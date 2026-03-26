import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'sillage_v2';

const DEFAULT_PROFILE = {
  name: '',
  username: '',
  country: 'Saudi Arabia',
  currency: 'SAR',
  bio: '',
  avatar: '🫧',
  joinedAt: null,
  onboarded: false,
  priceAlerts: [],
  stats: { owned: 0, wishlist: 0, toTest: 0, totalValue: 0 },
};

const DEFAULT_STATE = {
  profile: DEFAULT_PROFILE,
  collection: {},    // fragranceId -> { list, addedAt, rating, review, size, fillLevel, bottleType, purchasePrice, purchasedFrom, notes, occasions, seasons, tags }
  priceHistory: {},  // fragranceId -> [{ store, price, currency, date, available }]
  alerts: [],        // { fragranceId, targetPrice, currency, active }
  searchHistory: [],
};

function load() {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed, profile: { ...DEFAULT_PROFILE, ...parsed.profile } };
  } catch { return DEFAULT_STATE; }
}

function save(state) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export function useStore() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  const update = useCallback((updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      save(next);
      return next;
    });
  }, []);

  // ── PROFILE ──
  const saveProfile = useCallback((profileData) => {
    update(s => ({ ...s, profile: { ...s.profile, ...profileData, onboarded: true, joinedAt: s.profile.joinedAt || new Date().toISOString() } }));
  }, [update]);

  // ── COLLECTION ──
  const addToList = useCallback((fragranceId, list, data = {}) => {
    update(s => {
      const existing = s.collection[fragranceId] || {};
      const entry = {
        list,
        addedAt: new Date().toISOString(),
        rating: null,
        review: '',
        size: data.size || null,
        fillLevel: data.fillLevel || 100,
        bottleType: data.bottleType || 'Full Bottle',
        purchasePrice: data.purchasePrice || null,
        purchasedFrom: data.purchasedFrom || '',
        notes: data.notes || '',
        occasions: [],
        seasons: [],
        tags: [],
        ...existing,
        ...data,
        list,
      };
      const collection = { ...s.collection, [fragranceId]: entry };
      const stats = computeStats(collection);
      return { ...s, collection, profile: { ...s.profile, stats } };
    });
  }, [update]);

  const removeFromList = useCallback((fragranceId) => {
    update(s => {
      const collection = { ...s.collection };
      delete collection[fragranceId];
      const stats = computeStats(collection);
      return { ...s, collection, profile: { ...s.profile, stats } };
    });
  }, [update]);

  const updateEntry = useCallback((fragranceId, data) => {
    update(s => {
      const collection = { ...s.collection, [fragranceId]: { ...s.collection[fragranceId], ...data } };
      const stats = computeStats(collection);
      return { ...s, collection, profile: { ...s.profile, stats } };
    });
  }, [update]);

  // ── PRICE HISTORY ──
  const addPriceData = useCallback((fragranceId, priceEntries) => {
    update(s => {
      const existing = s.priceHistory[fragranceId] || [];
      const merged = [...priceEntries, ...existing].slice(0, 100);
      return { ...s, priceHistory: { ...s.priceHistory, [fragranceId]: merged } };
    });
  }, [update]);

  // ── ALERTS ──
  const addAlert = useCallback((fragranceId, targetPrice, currency) => {
    update(s => ({
      ...s,
      alerts: [...s.alerts.filter(a => a.fragranceId !== fragranceId),
        { fragranceId, targetPrice, currency, active: true, createdAt: new Date().toISOString() }]
    }));
  }, [update]);

  const removeAlert = useCallback((fragranceId) => {
    update(s => ({ ...s, alerts: s.alerts.filter(a => a.fragranceId !== fragranceId) }));
  }, [update]);

  // ── SEARCH HISTORY ──
  const addSearch = useCallback((term) => {
    update(s => ({
      ...s,
      searchHistory: [term, ...s.searchHistory.filter(t => t !== term)].slice(0, 20)
    }));
  }, [update]);

  const getListItems = useCallback((list) => {
    return Object.entries(state.collection)
      .filter(([, v]) => v.list === list)
      .map(([id, v]) => ({ id, ...v }));
  }, [state.collection]);

  const getEntry = useCallback((fragranceId) => state.collection[fragranceId] || null, [state.collection]);
  const isInCollection = useCallback((fragranceId) => !!state.collection[fragranceId], [state.collection]);

  return {
    state, hydrated,
    profile: state.profile,
    collection: state.collection,
    priceHistory: state.priceHistory,
    alerts: state.alerts,
    saveProfile, addToList, removeFromList, updateEntry,
    addPriceData, addAlert, removeAlert, addSearch,
    getListItems, getEntry, isInCollection,
  };
}

function computeStats(collection) {
  const entries = Object.values(collection);
  return {
    owned: entries.filter(e => e.list === 'owned').length,
    wishlist: entries.filter(e => e.list === 'wishlist').length,
    toTest: entries.filter(e => e.list === 'toTest').length,
    totalValue: entries.filter(e => e.list === 'owned' && e.purchasePrice)
      .reduce((sum, e) => sum + (parseFloat(e.purchasePrice) || 0), 0),
  };
}
