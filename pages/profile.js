import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Nav from '../components/Nav';
import { useStore } from '../hooks/useStore';
import { T, S, LIST_CONFIG } from '../lib/design';
import { COUNTRIES, CURRENCIES } from '../lib/database';
import { Stars } from '../components/FragranceCard';

const AVATARS = ['🫧','🌹','🌿','🕌','🌊','🏔','☕','🖤','🌙','🌺','🦁','👑'];

export default function ProfilePage() {
  const { profile, saveProfile, state, getListItems } = useStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name:'', username:'', country:'Saudi Arabia', bio:'', avatar:'🫧' });
  const router = useRouter();

  useEffect(() => {
    if (profile) setForm({ name:profile.name||'', username:profile.username||'', country:profile.country||'Saudi Arabia', bio:profile.bio||'', avatar:profile.avatar||'🫧' });
    if (!profile?.onboarded) setEditing(true);
  }, [profile?.onboarded]);

  function save() {
    saveProfile(form);
    setEditing(false);
  }

  const owned = getListItems('owned');
  const wishlist = getListItems('wishlist');
  const toTest = getListItems('toTest');
  const currency = CURRENCIES[profile?.country] || CURRENCIES['Saudi Arabia'];
  const totalValue = owned.reduce((s, e) => s + (parseFloat(e.purchasePrice) || 0), 0);

  const ratingsGiven = Object.values(state.collection).filter(e => e.rating).length;
  const avgMyRating = ratingsGiven > 0
    ? (Object.values(state.collection).filter(e => e.rating).reduce((s, e) => s + e.rating, 0) / ratingsGiven).toFixed(1)
    : '—';

  // Collection by season
  const bySeason = {};
  owned.forEach(e => {
    // We'd look up frag data — simplified here
  });

  return (
    <div style={S.page}>
      <Nav />
      <div style={{ ...S.wrap, paddingTop: 40, paddingBottom: 60 }}>

        {/* ONBOARDING MODAL */}
        {editing && (
          <div style={{ position:'fixed', inset:0, background:'rgba(11,10,9,0.95)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
            <div style={{ background:T.smoke, border:`1px solid ${T.border}`, padding:40, width:'100%', maxWidth:520 }} className="fade-up">
              <div style={{ fontFamily:'Georgia,serif', fontSize:32, fontStyle:'italic', color:T.gold, marginBottom:4 }}>Welcome to Sillage</div>
              <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:T.goldDim, marginBottom:28 }}>Set up your collector profile</div>

              {/* Avatar */}
              <div style={{ fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color:T.goldDim, marginBottom:10 }}>Choose your avatar</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:24 }}>
                {AVATARS.map(a => (
                  <button key={a} onClick={() => setForm(p=>({...p,avatar:a}))} style={{
                    width:44, height:44, fontSize:22, background: form.avatar===a ? T.glass : 'transparent',
                    border:`1px solid ${form.avatar===a ? T.gold : T.border}`,
                    cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                  }}>{a}</button>
                ))}
              </div>

              {[
                ['YOUR NAME','name','Your name','text'],
                ['USERNAME','username','@handle','text'],
              ].map(([label, field, ph, type]) => (
                <div key={field} style={{ marginBottom:16 }}>
                  <div style={{ fontSize:9, letterSpacing:'0.25em', textTransform:'uppercase', color:T.goldDim, marginBottom:6 }}>{label}</div>
                  <input type={type} value={form[field]} onChange={e=>setForm(p=>({...p,[field]:e.target.value}))}
                    placeholder={ph} style={{ background:T.glass, border:`1px solid ${T.border}`, color:T.cream, fontFamily:"'DM Mono',monospace", fontSize:13, padding:'12px 16px', width:'100%' }} />
                </div>
              ))}

              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:9, letterSpacing:'0.25em', textTransform:'uppercase', color:T.goldDim, marginBottom:6 }}>YOUR COUNTRY</div>
                <select value={form.country} onChange={e=>setForm(p=>({...p,country:e.target.value}))}
                  style={{ background:T.glass, border:`1px solid ${T.border}`, color:T.cream, fontFamily:"'DM Mono',monospace", fontSize:13, padding:'12px 16px', width:'100%' }}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ marginBottom:28 }}>
                <div style={{ fontSize:9, letterSpacing:'0.25em', textTransform:'uppercase', color:T.goldDim, marginBottom:6 }}>BIO</div>
                <textarea value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))}
                  placeholder="Fragrance obsessions, preferred accords, signature style…"
                  rows={2} style={{ background:T.glass, border:`1px solid ${T.border}`, color:T.cream, fontFamily:"'DM Mono',monospace", fontSize:13, padding:'12px 16px', width:'100%', resize:'vertical' }} />
              </div>

              <button onClick={save} style={{ background:T.gold, color:T.ink, border:'none', width:'100%', padding:16, fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer' }}>
                Enter Sillage →
              </button>
            </div>
          </div>
        )}

        {/* PROFILE HEADER */}
        <div style={{ display:'flex', gap:28, alignItems:'flex-start', marginBottom:40, flexWrap:'wrap' }}>
          <div style={{ fontSize:72, lineHeight:1 }}>{profile?.avatar || '🫧'}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'Georgia,serif', fontSize:32, fontStyle:'italic', color:T.cream, marginBottom:4 }}>
              {profile?.name || 'Anonymous Collector'}
            </div>
            <div style={{ fontSize:10, color:T.goldDim, letterSpacing:'0.15em', marginBottom:8 }}>
              {profile?.username ? `@${profile.username}` : ''} · {profile?.country || 'Global'} · Member since {profile?.joinedAt ? new Date(profile.joinedAt).getFullYear() : '2025'}
            </div>
            {profile?.bio && <div style={{ fontSize:13, color:T.sand, lineHeight:1.7, maxWidth:500 }}>{profile.bio}</div>}
            <button onClick={() => setEditing(true)} style={{ marginTop:12, background:'transparent', border:`1px solid ${T.border}`, color:T.goldDim, fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', padding:'8px 18px', cursor:'pointer' }}>
              Edit Profile
            </button>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12, marginBottom:40 }}>
          {[
            { label:'Owned', val:owned.length, color:T.gold, icon:'✦' },
            { label:'Wishlist', val:wishlist.length, color:T.blue, icon:'◈' },
            { label:'Want to Test', val:toTest.length, color:T.green, icon:'◉' },
            { label:'Total Collection Value', val:`${currency.symbol}${totalValue.toLocaleString()}`, color:T.gold, icon:'◆' },
            { label:'Ratings Given', val:ratingsGiven, color:T.amber, icon:'★' },
            { label:'Avg Your Rating', val:avgMyRating, color:T.amber, icon:'★' },
          ].map(({ label, val, color, icon }) => (
            <div key={label} style={{ background:T.smoke, border:`1px solid ${T.border}`, padding:'18px 20px' }}>
              <div style={{ fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:T.dust, marginBottom:8 }}>{label}</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:28, color }}>
                <span style={{ fontSize:14, marginRight:4 }}>{icon}</span>{val}
              </div>
            </div>
          ))}
        </div>

        {/* ALERTS */}
        {state.alerts.length > 0 && (
          <div style={{ marginBottom:40 }}>
            <div style={{ fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase', color:T.goldDim, marginBottom:16 }}>— Price Alerts —</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {state.alerts.map((a, i) => (
                <div key={i} style={{ background:T.smoke, border:`1px solid ${T.border}`, padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:10, color:T.goldDim, letterSpacing:'0.1em', marginBottom:2 }}>{a.fragranceId.replace(/-/g,' ').toUpperCase()}</div>
                    <div style={{ fontSize:13, color:T.cream }}>Alert at {a.currency} {a.targetPrice}</div>
                  </div>
                  <div style={{ fontSize:9, color:a.active ? T.green : T.dust }}>
                    {a.active ? '● Active' : '○ Triggered'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COLLECTION LISTS */}
        {[
          { key:'owned', items:owned, icon:'✦' },
          { key:'wishlist', items:wishlist, icon:'◈' },
          { key:'toTest', items:toTest, icon:'◉' },
        ].map(({ key, items, icon }) => {
          const lc = LIST_CONFIG[key];
          if (items.length === 0) return null;
          return (
            <div key={key} style={{ marginBottom:36 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <div style={{ fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase', color:lc.color }}>
                  {icon} {lc.label} ({items.length})
                </div>
                <button onClick={() => router.push('/collection')} style={{ fontSize:9, color:T.goldDim, background:'none', border:'none', cursor:'pointer', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                  View All →
                </button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:10 }}>
                {items.slice(0,6).map(item => (
                  <div key={item.id} style={{ background:T.smoke, border:`1px solid ${T.border}`, padding:'14px 18px' }}>
                    <div style={{ fontSize:9, color:lc.color, letterSpacing:'0.1em', marginBottom:4 }}>{icon} {item.id.split('-').slice(1).join(' ')}</div>
                    {item.rating && <Stars value={item.rating} size={10} />}
                    {item.purchasePrice && <div style={{ fontSize:10, color:T.gold, marginTop:4 }}>{currency.symbol}{item.purchasePrice}</div>}
                    {item.purchasedFrom && <div style={{ fontSize:9, color:T.dust, marginTop:2 }}>{item.purchasedFrom}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
