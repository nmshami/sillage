// Design System Tokens
export const T = {
  // Colors
  ink:     '#0B0A09',
  smoke:   '#161412',
  char:    '#201E1A',
  ember:   '#2C2820',
  stone:   '#3D3830',
  dust:    '#5C5448',
  sand:    '#8A7D68',
  cream:   '#E8DFD0',
  parchmt: '#F2EBE0',
  gold:    '#C9A96E',
  goldDim: '#8A7048',
  goldPal: '#E8D5A8',
  blue:    '#7EB8D4',
  green:   '#7EB896',
  red:     '#C46060',
  amber:   '#D4924A',
  border:  'rgba(201,169,110,0.14)',
  borderHi:'rgba(201,169,110,0.35)',
  glass:   'rgba(201,169,110,0.05)',
  glassHi: 'rgba(201,169,110,0.10)',
};

// Shared inline styles
export const S = {
  page: { background: T.ink, minHeight: '100vh', color: T.cream, fontFamily: "'DM Mono', monospace" },
  wrap: { maxWidth: 1100, margin: '0 auto', padding: '0 24px' },
  wrapWide: { maxWidth: 1400, margin: '0 auto', padding: '0 24px' },

  // Typography
  displayTitle: { fontFamily: 'Georgia, serif', fontSize: 42, fontWeight: 300, fontStyle: 'italic', color: T.gold, letterSpacing: '0.06em', lineHeight: 1 },
  sectionLabel: { fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: T.goldDim },
  bodyText: { fontSize: 13, color: T.sand, lineHeight: 1.75, letterSpacing: '0.02em' },

  // Cards
  card: { background: T.smoke, border: `1px solid ${T.border}`, padding: 24, transition: 'border-color .2s' },
  cardHover: { borderColor: T.goldDim },

  // Buttons
  btnPrimary: { background: T.gold, color: T.ink, border: 'none', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '12px 28px', cursor: 'pointer', transition: 'background .2s' },
  btnSecondary: { background: 'transparent', color: T.goldDim, border: `1px solid ${T.border}`, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '10px 20px', cursor: 'pointer', transition: 'all .2s' },
  btnGhost: { background: 'transparent', border: 'none', color: T.sand, fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: 'pointer', padding: '6px 0', letterSpacing: '0.05em' },

  // Inputs
  input: { background: T.glass, border: `1px solid ${T.border}`, color: T.cream, fontFamily: "'DM Mono', monospace", fontSize: 13, padding: '12px 16px', outline: 'none', letterSpacing: '0.03em', width: '100%', transition: 'border-color .2s' },

  // Layout
  divider: { borderTop: `1px solid ${T.border}`, margin: '28px 0' },
  pill: (active) => ({
    background: active ? T.gold : 'transparent',
    color: active ? T.ink : T.sand,
    border: `1px solid ${active ? T.gold : T.border}`,
    fontFamily: "'DM Mono', monospace",
    fontSize: 10,
    letterSpacing: '0.1em',
    padding: '5px 14px',
    cursor: 'pointer',
    transition: 'all .18s',
    whiteSpace: 'nowrap',
  }),

  // Ratings
  ratingBar: (val, max=5) => ({
    height: 2,
    background: T.ember,
    position: 'relative',
    overflow: 'hidden',
    marginTop: 4,
  }),
};

// List config
export const LIST_CONFIG = {
  owned:    { label: 'I Own',         icon: '✦', color: T.gold,  bg: 'rgba(201,169,110,0.08)' },
  wishlist: { label: 'Wishlist',      icon: '◈', color: T.blue,  bg: 'rgba(126,184,212,0.08)' },
  toTest:   { label: 'Want to Test',  icon: '◉', color: T.green, bg: 'rgba(126,184,150,0.08)' },
};
