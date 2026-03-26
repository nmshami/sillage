import { useRouter } from 'next/router';
import { T, S } from '../lib/design';
import { useStore } from '../hooks/useStore';
import { useState } from 'react';

export default function Nav() {
  const router = useRouter();
  const { profile, state } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/',          label: 'Discover' },
    { href: '/collection',label: 'Collection' },
    { href: '/prices',    label: 'Prices' },
    { href: '/profile',   label: 'Profile' },
  ];

  const active = (href) => router.pathname === href || (href !== '/' && router.pathname.startsWith(href));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.ink}; }
        input:focus, textarea:focus, select:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${T.ink}; }
        ::-webkit-scrollbar-thumb { background: ${T.stone}; border-radius: 2px; }
        button { cursor: pointer; }
        a { text-decoration: none; color: inherit; }
        .hover-gold:hover { color: ${T.gold} !important; }
        .hover-border:hover { border-color: ${T.goldDim} !important; }
        .card-hover:hover { border-color: ${T.goldDim} !important; transform: translateY(-1px); }
        .btn-primary:hover { background: ${T.parchmt} !important; }
        .btn-secondary:hover { border-color: ${T.goldDim} !important; color: ${T.gold} !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .fade-up { animation: fadeUp .4s ease both; }
        .shimmer { background: linear-gradient(90deg, ${T.ember} 25%, ${T.char} 50%, ${T.ember} 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .pulse { animation: pulse 2s ease infinite; }
        input::placeholder { color: ${T.dust}; }
        textarea::placeholder { color: ${T.dust}; }
        select option { background: ${T.char}; color: ${T.cream}; }
        .rating-star { cursor: pointer; transition: color .15s; }
      `}</style>
      <nav style={{
        background: T.smoke,
        borderBottom: `1px solid ${T.border}`,
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          {/* Logo */}
          <div onClick={() => router.push('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontStyle: 'italic', color: T.gold, letterSpacing: '0.08em' }}>Sillage</span>
            <span style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: T.goldDim }}>Beta</span>
          </div>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {links.map(l => (
              <button key={l.href} onClick={() => router.push(l.href)}
                style={{
                  background: active(l.href) ? T.glass : 'transparent',
                  border: `1px solid ${active(l.href) ? T.border : 'transparent'}`,
                  color: active(l.href) ? T.gold : T.sand,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                  padding: '8px 16px', transition: 'all .2s',
                }}>
                {l.label}
              </button>
            ))}

            {/* Stats pills */}
            <div style={{ display: 'flex', gap: 6, marginLeft: 12, paddingLeft: 12, borderLeft: `1px solid ${T.border}` }}>
              {[
                { n: profile?.stats?.owned || 0, c: T.gold, icon: '✦' },
                { n: profile?.stats?.wishlist || 0, c: T.blue, icon: '◈' },
                { n: profile?.stats?.toTest || 0, c: T.green, icon: '◉' },
              ].map(({ n, c, icon }) => (
                <div key={icon} style={{ fontSize: 10, color: c, letterSpacing: '0.05em' }}>
                  {icon} {n}
                </div>
              ))}
            </div>

            {/* Avatar */}
            <div onClick={() => router.push('/profile')} style={{
              marginLeft: 8, width: 32, height: 32, borderRadius: '50%',
              border: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, cursor: 'pointer', background: T.char,
              transition: 'border-color .2s',
            }} className="hover-border">
              {profile?.avatar || '🫧'}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
