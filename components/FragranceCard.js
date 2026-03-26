import { useState } from 'react';
import { T, LIST_CONFIG } from '../lib/design';
import { useStore } from '../hooks/useStore';

export default function FragranceCard({ frag, onOpen, compact = false }) {
  const { getEntry, addToList, removeFromList } = useStore();
  const entry = getEntry(frag.id);
  const [hovering, setHovering] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const list = entry?.list;
  const cfg = list ? LIST_CONFIG[list] : null;

  function handleAdd(listKey, e) {
    e.stopPropagation();
    if (list === listKey) { removeFromList(frag.id); }
    else { addToList(frag.id, listKey); }
    setShowAddMenu(false);
  }

  const stars = frag.avgRating || 0;
  const totalK = frag.totalRatings > 1000 ? `${(frag.totalRatings/1000).toFixed(1)}k` : frag.totalRatings;

  if (compact) return (
    <div
      onClick={() => onOpen?.(frag)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        background: T.smoke, border: `1px solid ${hovering ? T.goldDim : T.border}`,
        padding: 16, cursor: 'pointer', transition: 'border-color .2s, transform .15s',
        transform: hovering ? 'translateY(-2px)' : 'none',
        display: 'flex', gap: 14, alignItems: 'flex-start',
        position: 'relative',
      }}>
      <div style={{ fontSize: 28, lineHeight: 1 }}>{frag.image || '🫧'}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.goldDim, marginBottom: 3 }}>{frag.house}</div>
        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 15, color: T.cream, marginBottom: 4, lineHeight: 1.2 }}>{frag.name}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Stars value={stars} size={10} />
          <span style={{ fontSize: 9, color: T.dust }}>{totalK}</span>
        </div>
      </div>
      {cfg && (
        <div style={{ fontSize: 9, color: cfg.color, letterSpacing: '0.1em' }}>{cfg.icon} {cfg.label}</div>
      )}
    </div>
  );

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); setShowAddMenu(false); }}
      style={{
        background: T.smoke,
        border: `1px solid ${cfg ? cfg.color + '44' : hovering ? T.goldDim : T.border}`,
        padding: 24, cursor: 'pointer', transition: 'all .2s',
        transform: hovering ? 'translateY(-2px)' : 'none',
        position: 'relative', display: 'flex', flexDirection: 'column', gap: 14,
      }}
      onClick={() => onOpen?.(frag)}>

      {/* List badge */}
      {cfg && (
        <div style={{
          position: 'absolute', top: -1, left: 16,
          background: cfg.color, color: T.ink,
          fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase',
          padding: '2px 10px', fontWeight: 600,
        }}>{cfg.icon} {cfg.label}</div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: cfg ? 8 : 0 }}>
        <div style={{ fontSize: 36, lineHeight: 1 }}>{frag.image || '🫧'}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 9, padding: '3px 8px', border: `1px solid ${T.border}`, color: T.sand, letterSpacing: '0.08em' }}>
            {frag.concentration}
          </span>
          <span style={{ fontSize: 9, padding: '3px 8px', border: `1px solid ${T.border}`, color: T.sand, letterSpacing: '0.08em' }}>
            {frag.gender?.slice(0,3).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Info */}
      <div>
        <div style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.goldDim, marginBottom: 4 }}>{frag.house} · {frag.year}</div>
        <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, color: T.cream, lineHeight: 1.2, marginBottom: 10 }}>{frag.name}</div>
        <div style={{ fontSize: 11, color: T.sand, lineHeight: 1.65 }}>{frag.description?.slice(0, 90)}…</div>
      </div>

      {/* Accords */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {(frag.accords || []).slice(0, 4).map(a => (
          <span key={a} style={{ fontSize: 9, padding: '3px 9px', border: `1px solid ${T.border}`, color: T.dust, letterSpacing: '0.08em' }}>{a}</span>
        ))}
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Metric label="Longevity" val={frag.longevity} max={5} />
        <Metric label="Sillage" val={frag.sillage} max={5} />
      </div>

      {/* Rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
        <Stars value={stars} size={11} />
        <span style={{ fontSize: 10, color: T.gold }}>{stars.toFixed(1)}</span>
        <span style={{ fontSize: 9, color: T.dust }}>{totalK} ratings</span>
        {entry?.rating && (
          <span style={{ marginLeft: 'auto', fontSize: 9, color: T.goldDim }}>Your: {entry.rating}★</span>
        )}
      </div>

      {/* Season tags */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {(frag.season || []).map(s => (
          <span key={s} style={{ fontSize: 8, padding: '2px 7px', background: T.char, color: T.sand, letterSpacing: '0.08em' }}>{s}</span>
        ))}
      </div>

      {/* Add button */}
      <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          style={{
            width: '100%', padding: '10px 0',
            background: cfg ? T.glassHi : T.glass,
            border: `1px solid ${cfg ? cfg.color + '55' : T.border}`,
            color: cfg ? cfg.color : T.goldDim,
            fontFamily: "'DM Mono', monospace", fontSize: 10,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            transition: 'all .2s',
          }}>
          {cfg ? `${cfg.icon} In ${cfg.label}` : '+ Add to Collection'}
        </button>

        {showAddMenu && (
          <div style={{
            position: 'absolute', bottom: '100%', left: 0, right: 0,
            background: T.char, border: `1px solid ${T.border}`,
            zIndex: 10, marginBottom: 4,
          }}>
            {Object.entries(LIST_CONFIG).map(([key, lc]) => (
              <button key={key} onClick={(e) => handleAdd(key, e)} style={{
                display: 'block', width: '100%', padding: '10px 16px',
                background: list === key ? lc.bg : 'transparent',
                border: 'none', color: lc.color,
                fontFamily: "'DM Mono', monospace", fontSize: 10,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                textAlign: 'left', transition: 'background .15s',
              }}>
                {lc.icon} {list === key ? `Remove from ${lc.label}` : lc.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Stars({ value = 0, size = 12, interactive = false, onChange }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i}
          className={interactive ? 'rating-star' : ''}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange?.(i)}
          style={{ fontSize: size, color: i <= display ? T.gold : T.stone, lineHeight: 1 }}>★</span>
      ))}
    </div>
  );
}

export function Metric({ label, val, max = 5 }) {
  const pct = Math.round((val / max) * 100);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 9, color: T.dust, letterSpacing: '0.05em' }}>{label}</span>
        <span style={{ fontSize: 9, color: T.sand }}>{val}/{max}</span>
      </div>
      <div style={{ height: 2, background: T.ember }}>
        <div style={{ height: 2, width: `${pct}%`, background: `linear-gradient(90deg, ${T.goldDim}, ${T.gold})` }} />
      </div>
    </div>
  );
}
