import { useState } from 'react';
import Nav from '../components/Nav';
import FragranceModal from '../components/FragranceModal';
import { useStore } from '../hooks/useStore';
import { T, S, LIST_CONFIG } from '../lib/design';
import { FRAGRANCE_DB, CURRENCIES } from '../lib/database';
import { Stars } from '../components/FragranceCard';

export default function CollectionPage() {
  const { state, profile, getListItems, removeFromList, updateEntry } = useStore();
  const [activeList, setActiveList] = useState('owned');
  const [sort, setSort] = useState('addedAt');
  const [openFrag, setOpenFrag] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editData, setEditData] = useState({});

  const currency = CURRENCIES[profile?.country] || CURRENCIES['Saudi Arabia'];
  const items = getListItems(activeList);
  const lc = LIST_CONFIG[activeList];

  // Sort items
  const sorted = [...items].sort((a, b) => {
    if (sort === 'addedAt') return new Date(b.addedAt) - new Date(a.addedAt);
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sort === 'price') return (parseFloat(b.purchasePrice) || 0) - (parseFloat(a.purchasePrice) || 0);
    if (sort === 'name') return a.id.localeCompare(b.id);
    return 0;
  });

  function getFrag(id) { return FRAGRANCE_DB.find(f => f.id === id); }

  function startEdit(item) {
    setEditingEntry(item.id);
    setEditData({ rating: item.rating || 0, review: item.review || '', size: item.size || '', fillLevel: item.fillLevel ?? 100, purchasePrice: item.purchasePrice || '', purchasedFrom: item.purchasedFrom || '', notes: item.notes || '' });
  }

  function saveEdit() {
    updateEntry(editingEntry, editData);
    setEditingEntry(null);
  }

  const totalValue = items.filter(i => i.purchasePrice).reduce((s, i) => s + parseFloat(i.purchasePrice), 0);

  return (
    <div style={S.page}>
      <Nav />
      {openFrag && <FragranceModal frag={openFrag} onClose={() => setOpenFrag(null)} />}

      <div style={{ ...S.wrap, paddingTop: 36, paddingBottom: 60 }}>

        {/* HEADER */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 36, fontStyle: 'italic', color: T.gold, marginBottom: 4 }}>Collection</div>
          <div style={{ fontSize: 10, color: T.goldDim, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {profile?.name || 'Your'} · {profile?.country || 'Global'}
          </div>
        </div>

        {/* LIST TABS */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: `1px solid ${T.border}` }}>
          {Object.entries(LIST_CONFIG).map(([key, cfg]) => {
            const count = getListItems(key).length;
            return (
              <button key={key} onClick={() => setActiveList(key)} style={{
                padding: '12px 24px', border: 'none', background: 'transparent',
                color: activeList === key ? cfg.color : T.dust,
                fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
                borderBottom: `2px solid ${activeList === key ? cfg.color : 'transparent'}`,
                transition: 'all .15s', cursor: 'pointer',
              }}>
                {cfg.icon} {cfg.label} ({count})
              </button>
            );
          })}
        </div>

        {/* STATS BAR */}
        {items.length > 0 && (
          <div style={{ display: 'flex', gap: 24, marginBottom: 24, padding: '14px 20px', background: T.smoke, border: `1px solid ${T.border}`, flexWrap: 'wrap' }}>
            <StatPill label="Total" val={items.length} />
            {activeList === 'owned' && <StatPill label={`Est. Value`} val={`${currency.symbol}${totalValue.toLocaleString()}`} color={T.gold} />}
            <StatPill label="Rated" val={items.filter(i => i.rating).length} />
            <StatPill label="Reviewed" val={items.filter(i => i.review).length} />

            {/* Sort */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 9, color: T.dust, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Sort:</span>
              {[['addedAt','Recent'],['rating','Rating'],['price','Price'],['name','Name']].map(([v,l]) => (
                <button key={v} onClick={() => setSort(v)} style={{
                  background: sort === v ? T.glass : 'transparent',
                  border: `1px solid ${sort === v ? T.border : 'transparent'}`,
                  color: sort === v ? T.gold : T.dust,
                  fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.1em',
                  padding: '4px 10px', cursor: 'pointer', transition: 'all .15s',
                }}>{l}</button>
              ))}
            </div>
          </div>
        )}

        {/* EMPTY */}
        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 44, marginBottom: 16, opacity: .3 }}>{lc.icon}</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 22, fontStyle: 'italic', color: T.creamDim, marginBottom: 8 }}>
              Your {lc.label} is empty
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', color: T.dust }}>
              Add fragrances from the Discover page
            </div>
          </div>
        )}

        {/* COLLECTION TABLE */}
        {sorted.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sorted.map(item => {
              const frag = getFrag(item.id);
              const isEditing = editingEntry === item.id;

              return (
                <div key={item.id} style={{ background: T.smoke, border: `1px solid ${T.border}`, transition: 'border-color .2s' }} className="card-hover">
                  <div style={{ padding: '18px 22px', display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {/* Emoji */}
                    <div style={{ fontSize: 32, lineHeight: 1 }}>{frag?.image || '🫧'}</div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.goldDim, marginBottom: 3 }}>
                        {frag?.house || item.id.split('-')[0]}
                      </div>
                      <div style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', fontSize: 17, color: T.cream, marginBottom: 6, cursor: 'pointer' }}
                        onClick={() => frag && setOpenFrag(frag)}>
                        {frag?.name || item.id.split('-').slice(1).join(' ')}
                      </div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Stars value={item.rating || 0} size={11} />
                        {item.size && <span style={{ fontSize: 9, color: T.dust, padding: '2px 7px', border: `1px solid ${T.border}` }}>{item.size}</span>}
                        {item.purchasedFrom && <span style={{ fontSize: 9, color: T.dust }}>from {item.purchasedFrom}</span>}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                      {item.purchasePrice && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 9, color: T.dust, letterSpacing: '0.1em', marginBottom: 2 }}>PAID</div>
                          <div style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: T.gold }}>{currency.symbol}{parseFloat(item.purchasePrice).toLocaleString()}</div>
                        </div>
                      )}
                      {activeList === 'owned' && item.fillLevel != null && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 9, color: T.dust, letterSpacing: '0.1em', marginBottom: 4 }}>FILL</div>
                          <div style={{ width: 32, height: 60, border: `1px solid ${T.border}`, position: 'relative', overflow: 'hidden', background: T.ember }}>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${item.fillLevel}%`, background: `linear-gradient(to top, ${T.gold}, ${T.goldDim})`, transition: 'height .5s' }} />
                          </div>
                          <div style={{ fontSize: 8, color: T.dust, marginTop: 3 }}>{item.fillLevel}%</div>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <button onClick={() => isEditing ? saveEdit() : startEdit(item)} style={{
                          background: isEditing ? T.gold : T.glass,
                          color: isEditing ? T.ink : T.goldDim,
                          border: `1px solid ${isEditing ? T.gold : T.border}`,
                          fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.1em',
                          padding: '6px 14px', cursor: 'pointer',
                        }}>{isEditing ? 'Save ✓' : 'Edit'}</button>
                        <button onClick={() => removeFromList(item.id)} style={{
                          background: 'transparent', border: `1px solid rgba(196,96,96,0.3)`,
                          color: T.red, fontFamily: "'DM Mono',monospace", fontSize: 9,
                          letterSpacing: '0.1em', padding: '6px 14px', cursor: 'pointer',
                        }}>Remove</button>
                      </div>
                    </div>
                  </div>

                  {/* Edit panel */}
                  {isEditing && (
                    <div style={{ padding: '0 22px 20px', borderTop: `1px solid ${T.border}`, paddingTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
                      {[
                        ['Your Rating', 'rating', 'number', '1-5'],
                        ['Fill Level %', 'fillLevel', 'number', '0-100'],
                        ['Size', 'size', 'text', '50ml'],
                        ['Purchase Price', 'purchasePrice', 'number', '0.00'],
                        ['Purchased From', 'purchasedFrom', 'text', 'Store'],
                      ].map(([label, key, type, ph]) => (
                        <div key={key}>
                          <div style={{ fontSize: 9, color: T.dust, letterSpacing: '0.15em', marginBottom: 5 }}>{label.toUpperCase()}</div>
                          <input type={type} value={editData[key] || ''} placeholder={ph}
                            onChange={e => setEditData(p => ({ ...p, [key]: e.target.value }))}
                            style={{ background: T.glass, border: `1px solid ${T.border}`, color: T.cream, fontFamily: "'DM Mono',monospace", fontSize: 12, padding: '8px 12px', width: '100%' }} />
                        </div>
                      ))}
                      <div style={{ gridColumn: '1/-1' }}>
                        <div style={{ fontSize: 9, color: T.dust, letterSpacing: '0.15em', marginBottom: 5 }}>NOTES</div>
                        <textarea value={editData.notes || ''} onChange={e => setEditData(p => ({ ...p, notes: e.target.value }))}
                          placeholder="Personal notes…" rows={2}
                          style={{ background: T.glass, border: `1px solid ${T.border}`, color: T.cream, fontFamily: "'DM Mono',monospace", fontSize: 12, padding: '8px 12px', width: '100%', resize: 'vertical' }} />
                      </div>
                    </div>
                  )}

                  {/* Review preview */}
                  {!isEditing && item.review && (
                    <div style={{ padding: '0 22px 16px', fontSize: 12, color: T.sand, fontStyle: 'italic', borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
                      "{item.review}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatPill({ label, val, color }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: '#5C5448', letterSpacing: '0.1em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 18, fontFamily: 'Georgia,serif', color: color || '#E8DFD0' }}>{val}</div>
    </div>
  );
}
