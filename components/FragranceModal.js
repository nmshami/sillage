import { useState, useEffect } from 'react';
import { T, LIST_CONFIG } from '../lib/design';
import { useStore } from '../hooks/useStore';
import { Stars, Metric } from './FragranceCard';
import { STORES, CURRENCIES } from '../lib/database';

export default function FragranceModal({ frag, onClose }) {
  const { profile, getEntry, addToList, removeFromList, updateEntry, addPriceData, addAlert, priceHistory, alerts } = useStore();
  const [tab, setTab] = useState('overview');
  const [entry, setEntry] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [prices, setPrices] = useState([]);
  const [alertTarget, setAlertTarget] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [addingTo, setAddingTo] = useState(null);
  const [addData, setAddData] = useState({ size: '', purchasePrice: '', purchasedFrom: '', notes: '' });

  const country = profile?.country || 'Saudi Arabia';
  const currency = CURRENCIES[country] || CURRENCIES['Saudi Arabia'];
  const existingAlert = alerts.find(a => a.fragranceId === frag.id);

  useEffect(() => {
    const e = getEntry(frag.id);
    setEntry(e);
    setReviewText(e?.review || '');
  }, [frag.id, getEntry]);

  useEffect(() => {
    if (tab === 'pricing') loadPrices();
  }, [tab]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  async function loadPrices() {
    // Check cache first
    const cached = priceHistory[frag.id];
    if (cached && cached.length > 0 && Date.now() - new Date(cached[0].fetchedAt).getTime() < 3600000) {
      setPrices(cached);
      return;
    }
    setLoadingPrices(true);
    try {
      const res = await fetch('/api/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `${frag.house} ${frag.name}`, country, fragranceId: frag.id }),
      });
      const data = await res.json();
      const priceEntries = (data.platforms || []).map(p => ({
        ...p, fragranceId: frag.id, fetchedAt: new Date().toISOString(),
      }));
      setPrices(priceEntries);
      addPriceData(frag.id, priceEntries);
    } catch(e) { console.error(e); }
    setLoadingPrices(false);
  }

  function handleRate(val) {
    updateEntry(frag.id, { rating: val });
    setEntry(prev => ({ ...prev, rating: val }));
  }

  function saveReview() {
    updateEntry(frag.id, { review: reviewText });
    setEntry(prev => ({ ...prev, review: reviewText }));
  }

  function handleAddToList(listKey) {
    if (entry?.list === listKey) {
      removeFromList(frag.id);
      setEntry(null);
    } else {
      if (listKey === 'owned') { setAddingTo(listKey); }
      else { addToList(frag.id, listKey); setEntry({ ...entry, list: listKey }); }
    }
  }

  function confirmAdd() {
    addToList(frag.id, addingTo, addData);
    setEntry({ ...entry, list: addingTo, ...addData });
    setAddingTo(null);
  }

  function handleSetAlert() {
    if (!alertTarget) return;
    addAlert(frag.id, parseFloat(alertTarget), currency.code);
    setAlertTarget('');
  }

  const minPrice = prices.filter(p => p.available && p.price).reduce((min, p) => p.price < min ? p.price : min, Infinity);

  const TABS = ['overview', 'notes', 'pricing', 'reviews'];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(11,10,9,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(8px)', padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: T.smoke, border: `1px solid ${T.border}`,
        width: '100%', maxWidth: 820, maxHeight: '90vh',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        animation: 'fadeUp .25s ease',
      }} onClick={e => e.stopPropagation()}>

        {/* ── MODAL HEADER ── */}
        <div style={{ padding: '24px 28px 0', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 44, lineHeight: 1 }}>{frag.image}</div>
              <div>
                <div style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.goldDim, marginBottom: 4 }}>
                  {frag.house} · {frag.year} · {frag.concentration}
                </div>
                <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 26, color: T.cream, lineHeight: 1.1, marginBottom: 8 }}>
                  {frag.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <Stars value={frag.avgRating} size={12} />
                  <span style={{ fontSize: 10, color: T.gold }}>{frag.avgRating?.toFixed(1)}</span>
                  <span style={{ fontSize: 9, color: T.dust }}>({(frag.totalRatings/1000).toFixed(1)}k ratings)</span>
                  <span style={{ fontSize: 9, color: T.sand, padding: '2px 8px', border: `1px solid ${T.border}` }}>{frag.gender}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: `1px solid ${T.border}`, color: T.sand, padding: '6px 12px', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.1em' }}>✕ Close</button>
          </div>

          {/* List Actions */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {Object.entries(LIST_CONFIG).map(([key, lc]) => {
              const active = entry?.list === key;
              return (
                <button key={key} onClick={() => handleAddToList(key)} style={{
                  padding: '8px 18px', border: `1px solid ${active ? lc.color : T.border}`,
                  background: active ? lc.bg : 'transparent',
                  color: active ? lc.color : T.sand,
                  fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                  transition: 'all .18s',
                }}>
                  {lc.icon} {active ? `✓ ${lc.label}` : lc.label}
                </button>
              );
            })}
          </div>

          {/* Add to owned form */}
          {addingTo === 'owned' && (
            <div style={{ background: T.char, border: `1px solid ${T.border}`, padding: 16, marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div>
                <div style={{ fontSize: 9, color: T.goldDim, letterSpacing: '0.2em', marginBottom: 6 }}>SIZE</div>
                <select value={addData.size} onChange={e => setAddData(p=>({...p,size:e.target.value}))} style={{ ...inputStyle }}>
                  <option value="">Select</option>
                  {frag.sizes?.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 9, color: T.goldDim, letterSpacing: '0.2em', marginBottom: 6 }}>PURCHASE PRICE ({currency.code})</div>
                <input type="number" value={addData.purchasePrice} onChange={e => setAddData(p=>({...p,purchasePrice:e.target.value}))} placeholder="0.00" style={{ ...inputStyle }} />
              </div>
              <div>
                <div style={{ fontSize: 9, color: T.goldDim, letterSpacing: '0.2em', marginBottom: 6 }}>PURCHASED FROM</div>
                <input value={addData.purchasedFrom} onChange={e => setAddData(p=>({...p,purchasedFrom:e.target.value}))} placeholder="Store name" style={{ ...inputStyle }} />
              </div>
              <div style={{ gridColumn: '1/-1', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => setAddingTo(null)} style={{ ...ghostBtn }}>Cancel</button>
                <button onClick={confirmAdd} style={{ ...primaryBtn }}>Confirm →</button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '10px 20px', border: 'none',
                background: tab === t ? T.char : 'transparent',
                color: tab === t ? T.gold : T.sand,
                fontFamily: "'DM Mono', monospace", fontSize: 10,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                borderBottom: `2px solid ${tab === t ? T.gold : 'transparent'}`,
                transition: 'all .15s',
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* ── TAB CONTENT ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <p style={{ fontSize: 13, color: T.sand, lineHeight: 1.8 }}>{frag.description}</p>
              </div>

              <div>
                <SectionLabel>Performance</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                  <Metric label="Longevity" val={frag.longevity} max={5} />
                  <Metric label="Sillage" val={frag.sillage} max={5} />
                </div>
              </div>

              <div>
                <SectionLabel>Details</SectionLabel>
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    ['House', frag.house],
                    ['Year', frag.year],
                    ['Concentration', frag.concentration],
                    ['Gender', frag.gender],
                    ['Sizes', frag.sizes?.join(', ')],
                  ].map(([k,v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: T.dust }}>{k}</span>
                      <span style={{ fontSize: 10, color: T.cream }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <SectionLabel>Season</SectionLabel>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                  {frag.season?.map(s => <span key={s} style={tagStyle}>{s}</span>)}
                </div>
              </div>

              <div>
                <SectionLabel>Occasion</SectionLabel>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                  {frag.occasion?.map(o => <span key={o} style={tagStyle}>{o}</span>)}
                </div>
              </div>

              {/* Your Collection Entry */}
              {entry && (
                <div style={{ gridColumn: '1/-1', background: T.char, border: `1px solid ${T.border}`, padding: 20 }}>
                  <SectionLabel>Your Collection Entry</SectionLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 12, marginBottom: 16 }}>
                    {[
                      ['List', LIST_CONFIG[entry.list]?.label],
                      ['Size', entry.size || '—'],
                      ['Purchased From', entry.purchasedFrom || '—'],
                      ['Purchase Price', entry.purchasePrice ? `${currency.symbol}${entry.purchasePrice}` : '—'],
                      ['Added', entry.addedAt ? new Date(entry.addedAt).toLocaleDateString() : '—'],
                      ['Fill Level', entry.fillLevel != null ? `${entry.fillLevel}%` : '—'],
                    ].map(([k,v]) => (
                      <div key={k}>
                        <div style={{ fontSize: 9, color: T.dust, letterSpacing: '0.1em', marginBottom: 3 }}>{k}</div>
                        <div style={{ fontSize: 12, color: T.cream }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  <SectionLabel>Your Rating</SectionLabel>
                  <div style={{ marginTop: 8, marginBottom: 16 }}>
                    <Stars value={entry.rating || 0} size={20} interactive onChange={handleRate} />
                  </div>

                  <SectionLabel>Your Notes</SectionLabel>
                  <textarea
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    placeholder="Add your personal notes, impressions, or review…"
                    rows={3}
                    style={{ ...inputStyle, width: '100%', marginTop: 8, resize: 'vertical' }}
                  />
                  <button onClick={saveReview} style={{ ...primaryBtn, marginTop: 8 }}>Save Notes</button>
                </div>
              )}
            </div>
          )}

          {/* NOTES */}
          {tab === 'notes' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
                {[
                  { tier: 'Top Notes', notes: frag.notes?.top, color: T.blue },
                  { tier: 'Heart Notes', notes: frag.notes?.heart, color: T.gold },
                  { tier: 'Base Notes', notes: frag.notes?.base, color: T.amber },
                ].map(({ tier, notes, color }) => (
                  <div key={tier} style={{ background: T.char, border: `1px solid ${T.border}`, padding: 18 }}>
                    <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color, marginBottom: 12 }}>{tier}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {notes?.map(n => (
                        <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', background: color, flexShrink: 0 }} />
                          <span style={{ fontSize: 12, color: T.cream }}>{n}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <SectionLabel>Accords</SectionLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {frag.accords?.map(a => (
                  <span key={a} style={{ padding: '6px 14px', border: `1px solid ${T.border}`, fontSize: 11, color: T.sand, letterSpacing: '0.08em' }}>{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* PRICING */}
          {tab === 'pricing' && (
            <div>
              {loadingPrices ? (
                <div style={{ textAlign: 'center', padding: 48, color: T.goldDim }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8 }}>Scanning {country} prices…</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
                    {[0,1,2,3,4].map(i => (
                      <div key={i} className="shimmer" style={{ width: 32, height: 2, animationDelay: `${i*0.15}s` }} />
                    ))}
                  </div>
                </div>
              ) : prices.length > 0 ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 24 }}>
                    {prices.map(p => {
                      const isBest = p.available && p.price === minPrice;
                      return (
                        <div key={p.name} style={{
                          background: isBest ? T.glassHi : T.char,
                          border: `1px solid ${isBest ? T.gold : T.border}`,
                          padding: 16, position: 'relative',
                        }}>
                          {isBest && <div style={{ position: 'absolute', top: -1, right: 12, background: T.gold, color: T.ink, fontSize: 7, letterSpacing: '0.2em', padding: '2px 8px', textTransform: 'uppercase' }}>Best</div>}
                          <div style={{ fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.goldDim, marginBottom: 8 }}>{p.name}</div>
                          {p.available && p.price ? (
                            <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: T.cream }}>{currency.symbol}{p.price}</div>
                          ) : (
                            <div style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: T.dust, fontStyle: 'italic' }}>Unavailable</div>
                          )}
                          <div style={{ fontSize: 9, color: T.dust, marginTop: 6 }}>{p.shipping}</div>
                          <div style={{ fontSize: 9, color: p.auth === 'High' ? T.green : p.auth === 'Medium' ? T.amber : T.red, marginTop: 4 }}>Auth: {p.auth}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Price Alert */}
                  <div style={{ background: T.char, border: `1px solid ${T.border}`, padding: 20 }}>
                    <SectionLabel>Price Alert</SectionLabel>
                    {existingAlert ? (
                      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, color: T.green }}>✓ Alert set at {existingAlert.currency} {existingAlert.targetPrice}</span>
                        <button onClick={() => removeAlert(frag.id)} style={{ ...ghostBtn, fontSize: 9, color: T.red }}>Remove</button>
                      </div>
                    ) : (
                      <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: T.sand }}>{currency.code}</span>
                        <input type="number" value={alertTarget} onChange={e => setAlertTarget(e.target.value)} placeholder="Target price" style={{ ...inputStyle, width: 140 }} />
                        <button onClick={handleSetAlert} style={{ ...primaryBtn }}>Set Alert</button>
                      </div>
                    )}
                    <p style={{ fontSize: 10, color: T.dust, marginTop: 8 }}>Alert notes are saved locally. You can check back here for updates.</p>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: 48 }}>
                  <button onClick={loadPrices} style={{ ...primaryBtn }}>Load Prices for {country}</button>
                </div>
              )}
            </div>
          )}

          {/* REVIEWS */}
          {tab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 52, color: T.gold, lineHeight: 1 }}>{frag.avgRating?.toFixed(1)}</div>
                  <Stars value={frag.avgRating} size={14} />
                  <div style={{ fontSize: 9, color: T.dust, marginTop: 4 }}>Community · {(frag.totalRatings/1000).toFixed(1)}k ratings</div>
                </div>
                <div style={{ flex: 1 }}>
                  {[5,4,3,2,1].map(star => {
                    const fakeWidths = [65, 20, 8, 4, 3];
                    return (
                      <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 10, color: T.sand, width: 12 }}>{star}</span>
                        <span style={{ fontSize: 10, color: T.gold }}>★</span>
                        <div style={{ flex: 1, height: 6, background: T.ember }}>
                          <div style={{ height: 6, width: `${fakeWidths[5-star]}%`, background: T.gold }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sample community reviews */}
              {[
                { user: "Riyadh_Collector", rating: 5, date: "2025-11", text: "A masterpiece. The longevity on my skin is extraordinary — 14+ hours. Every time I wear it I get compliments." },
                { user: "Dubai_Scenthead", rating: 4, date: "2025-10", text: "Stunning fragrance. My only note is batch variation — earlier batches were more smoky. Still a staple." },
                { user: "GulfNicheFan", rating: 5, date: "2025-09", text: "Worth every riyal. Unmatched complexity in this price range." },
              ].map((r, i) => (
                <div key={i} style={{ background: T.char, border: `1px solid ${T.border}`, padding: 18, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 10, color: T.gold }}>◈ {r.user}</span>
                      <Stars value={r.rating} size={10} />
                    </div>
                    <span style={{ fontSize: 9, color: T.dust }}>{r.date}</span>
                  </div>
                  <p style={{ fontSize: 12, color: T.sand, lineHeight: 1.7 }}>{r.text}</p>
                </div>
              ))}

              {/* Your review */}
              {entry && (
                <div style={{ background: T.glassHi, border: `1px solid ${T.gold}44`, padding: 18 }}>
                  <div style={{ fontSize: 9, color: T.gold, letterSpacing: '0.2em', marginBottom: 10 }}>YOUR REVIEW</div>
                  <Stars value={entry.rating || 0} size={16} interactive onChange={handleRate} />
                  <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                    placeholder="Write your review…" rows={3}
                    style={{ ...inputStyle, width: '100%', marginTop: 12, resize: 'vertical' }} />
                  <button onClick={saveReview} style={{ ...primaryBtn, marginTop: 10 }}>Save Review</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.goldDim }}>{children}</div>;
}

const tagStyle = { fontSize: 9, padding: '3px 9px', border: `1px solid rgba(201,169,110,0.15)`, color: '#8A7D68', letterSpacing: '0.08em' };
const inputStyle = { background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.2)', color: '#E8DFD0', fontFamily: "'DM Mono', monospace", fontSize: 12, padding: '10px 14px', width: '100%' };
const primaryBtn = { background: '#C9A96E', color: '#0B0A09', border: 'none', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '10px 22px', cursor: 'pointer' };
const ghostBtn = { background: 'none', border: 'none', color: '#8A7D68', fontFamily: "'DM Mono', monospace", fontSize: 10, cursor: 'pointer', letterSpacing: '0.08em' };
