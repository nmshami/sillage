import { useState } from 'react';
import Nav from '../components/Nav';
import { useStore } from '../hooks/useStore';
import { T, S } from '../lib/design';
import { FRAGRANCE_DB, CURRENCIES, COUNTRIES } from '../lib/database';

const QUICK = [
  ['Creed Aventus 100ml','Aventus'],
  ['MFK Baccarat Rouge 540 70ml','Baccarat 540'],
  ['Parfums de Marly Layton 125ml','PdM Layton'],
  ['Xerjoff Erba Gold 100ml','Erba Gold'],
  ['Tom Ford Tobacco Vanille 100ml','TF Tobacco'],
  ['Amouage Interlude Man 100ml','Amouage IL'],
  ['Initio Oud for Greatness 90ml','Initio Oud'],
  ['Nishane Hacivat 100ml','Nishane'],
  ['Lattafa Khamrah Qahwa 100ml','Khamrah'],
  ['By Kilian Black Phantom 50ml','Black Phantom'],
];
const STEPS = [
  'Scanning platform 1...','Checking platform 2...','Querying platform 3...','Verifying stock...','Computing best deal...',
];

export default function PricesPage() {
  const { profile, addPriceData, addAlert, removeAlert, alerts, addSearch } = useStore();
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [overrideCountry, setOverrideCountry] = useState(null);
  const [alertTarget, setAlertTarget] = useState('');

  const country = overrideCountry || profile?.country || 'Saudi Arabia';
  const currency = CURRENCIES[country] || CURRENCIES['Saudi Arabia'];

  async function search(term) {
    const t = (term || q).trim();
    if (!t) return;
    setQ(t); setLoading(true); setError(null); setData(null); setStep(0);
    const iv = setInterval(()=>setStep(s=>(s+1)%STEPS.length), 800);
    try {
      const res = await fetch('/api/prices', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ query:t, country }),
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setData(result);
      const fragId = t.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
      const entries = (result.platforms||[]).map(p=>({...p, fetchedAt:new Date().toISOString()}));
      addPriceData(fragId, entries);
      addSearch(t);
      setHistory(h=>[{term:t, data:result, time:new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'}), country}, ...h].slice(0,10));
    } catch(e) { setError(e.message||'Analysis failed'); }
    clearInterval(iv);
    setLoading(false);
  }

  const avail = data ? (data.platforms||[]).filter(p=>p.available&&p.price) : [];
  const minP = avail.length ? Math.min(...avail.map(p=>p.price)) : null;
  const maxP = avail.length ? Math.max(...avail.map(p=>p.price)) : null;
  const savings = minP&&maxP ? maxP-minP : 0;
  const fragId = q.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  const existingAlert = alerts.find(a=>a.fragranceId===fragId);

  function setAlert() {
    if (!alertTarget) return;
    addAlert(fragId, parseFloat(alertTarget), currency.code);
    setAlertTarget('');
  }

  const inputStyle = {
    background:'rgba(201,169,110,0.05)', border:'1px solid rgba(201,169,110,0.14)',
    color:'#E8DFD0', fontFamily:"'DM Mono',monospace", fontSize:13, padding:'13px 18px',
  };

  return (
    <div style={{background:'#0B0A09', minHeight:'100vh', color:'#E8DFD0', fontFamily:"'DM Mono',monospace"}}>
      <Nav />
      <div style={{maxWidth:1100, margin:'0 auto', padding:'0 24px', paddingTop:36, paddingBottom:60}}>

        {/* HEADER */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:16, marginBottom:32}}>
          <div>
            <div style={{fontFamily:'Georgia,serif', fontSize:40, fontStyle:'italic', color:'#C9A96E', lineHeight:1, marginBottom:6}}>Price Intelligence</div>
            <div style={{display:'flex', alignItems:'center', gap:8, fontSize:10, color:'#8A7048', letterSpacing:'0.12em'}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:'#7EB896',display:'inline-block'}} className="pulse" />
              AI-powered · Real-time analysis · {currency.code} · {country}
            </div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <span style={{fontSize:9, color:'#5C5448', letterSpacing:'0.2em', textTransform:'uppercase'}}>Market:</span>
            <select value={country} onChange={e=>setOverrideCountry(e.target.value)} style={{
              background:'#161412', border:'1px solid rgba(201,169,110,0.2)', color:'#C9A96E',
              fontFamily:"'DM Mono',monospace", fontSize:11, padding:'8px 14px',
            }}>
              {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* SEARCH */}
        <div style={{marginBottom:32}}>
          <div style={{display:'flex', gap:10, marginBottom:12, flexWrap:'wrap'}}>
            <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()}
              placeholder="Search any fragrance with size, e.g. 'Creed Aventus 100ml'..."
              style={{...inputStyle, flex:1, minWidth:260}} />
            <button onClick={()=>search()} disabled={loading} style={{
              background:loading?'#2C2820':'#C9A96E', color:loading?'#8A7048':'#0B0A09',
              border:'none', fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:'0.2em',
              textTransform:'uppercase', padding:'13px 32px', cursor:loading?'not-allowed':'pointer',
              whiteSpace:'nowrap', transition:'background .2s',
            }}>{loading ? 'Scanning...' : 'Analyse →'}</button>
          </div>
          <div style={{display:'flex', flexWrap:'wrap', gap:6, alignItems:'center'}}>
            <span style={{fontSize:9, color:'#5C5448', letterSpacing:'0.22em', textTransform:'uppercase'}}>Quick:</span>
            {QUICK.map(([full,label])=>(
              <button key={full} onClick={()=>search(full)} style={{
                border:'1px solid rgba(201,169,110,0.18)', background:'transparent', color:'#8A7D68',
                fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.08em',
                padding:'5px 13px', cursor:'pointer', transition:'all .15s',
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div style={{textAlign:'center', padding:'56px 20px'}}>
            <div style={{fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color:'#C9A96E', marginBottom:12}}>{STEPS[step]}</div>
            <div style={{display:'flex', justifyContent:'center', gap:8, marginTop:20}}>
              {STEPS.map((_,i)=><div key={i} style={{width:40,height:2,background:i<=step?'#C9A96E':'#2C2820',transition:'background .3s'}} />)}
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && !loading && (
          <div style={{background:'#161412', border:'1px solid rgba(196,96,96,.35)', padding:'16px 22px', color:'#C46060', marginBottom:24}}>
            ⚠ {error}
          </div>
        )}

        {/* RESULTS */}
        {data && !loading && (
          <div className="fade-up">
            <div style={{marginBottom:20}}>
              <div style={{fontFamily:'Georgia,serif', fontSize:26, fontStyle:'italic', color:'#C9A96E', marginBottom:4}}>{data.fragrance}</div>
              <div style={{fontSize:10, color:'#5C5448', letterSpacing:'0.1em'}}>{data.category} · {data.notes}</div>
            </div>

            {/* Verdict */}
            <div style={{background:'#161412', border:'1px solid rgba(201,169,110,0.2)', padding:'20px 26px', marginBottom:24}}>
              <div style={{fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase', color:'#C9A96E', marginBottom:10}}>
                Expert Verdict · {country}
              </div>
              <div style={{fontSize:13, color:'#8A7D68', lineHeight:1.85}}>
                {data.verdict}
                {savings > 0 && (
                  <span> Buying smart saves you <strong style={{color:'#E8DFD0'}}>{currency.symbol}{savings.toLocaleString()}</strong> vs the most expensive option.</span>
                )}
              </div>
            </div>

            {/* Price grid */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:14, marginBottom:26}}>
              {(data.platforms||[]).map(p=>{
                const isBest = p.available && p.price===minP;
                const range = (maxP-minP)||1;
                const pct = p.available&&p.price ? Math.round(((p.price-minP)/range)*70+15) : 0;
                const saving = p.available&&p.price&&p.price>minP ? p.price-minP : null;
                const barColor = pct<=25 ? '#7EB896' : pct>=75 ? '#C46060' : '#D4924A';
                return (
                  <div key={p.name} style={{
                    background:isBest?'rgba(201,169,110,0.06)':'#161412',
                    border:`1px solid ${isBest?'#C9A96E':'rgba(201,169,110,0.14)'}`,
                    padding:20, position:'relative',
                  }}>
                    {isBest && <div style={{position:'absolute',top:-1,right:14,background:'#C9A96E',color:'#0B0A09',fontSize:7,letterSpacing:'0.22em',padding:'2px 10px',textTransform:'uppercase',fontWeight:600}}>Best Price</div>}
                    <div style={{fontSize:9, letterSpacing:'0.22em', textTransform:'uppercase', color:'#8A7048', marginBottom:10}}>{p.name}</div>
                    {p.available&&p.price ? (
                      <>
                        <div style={{fontFamily:'Georgia,serif', fontSize:30, color:'#E8DFD0', lineHeight:1, marginBottom:4}}>
                          <span style={{fontSize:12, color:'#8A7048', verticalAlign:'top', marginTop:5, marginRight:3}}>{currency.symbol}</span>
                          {p.price.toLocaleString()}
                        </div>
                        <div style={{fontSize:10, color:'#8A7D68', marginBottom:14}}>{p.size}</div>
                      </>
                    ) : (
                      <div style={{fontFamily:'Georgia,serif', fontSize:16, color:'#3D3830', fontStyle:'italic', marginBottom:14}}>Unavailable</div>
                    )}
                    <div style={{display:'flex',flexDirection:'column',gap:5,paddingTop:10,borderTop:'1px solid rgba(201,169,110,0.1)'}}>
                      {[
                        ['Shipping', p.shipping, null],
                        ['Auth', p.auth, p.auth==='High'?'#7EB896':p.auth==='Medium'?'#D4924A':'#C46060'],
                        saving ? ['vs Best', `+${currency.symbol}${saving}`, '#C46060'] : null,
                      ].filter(Boolean).map(([k,v,c])=>(
                        <div key={k} style={{display:'flex',justifyContent:'space-between'}}>
                          <span style={{fontSize:9,color:'#5C5448'}}>{k}</span>
                          <span style={{fontSize:9,color:c||'#E8DFD0'}}>{v}</span>
                        </div>
                      ))}
                    </div>
                    {p.available&&p.price && (
                      <div style={{marginTop:12}}>
                        <div style={{display:'flex',justifyContent:'space-between',fontSize:8,color:'#5C5448',marginBottom:4}}>
                          <span>Position</span><span>{pct<=25?'Lowest ✓':pct>=75?'Highest':'Mid-range'}</span>
                        </div>
                        <div style={{height:2,background:'#2C2820'}}>
                          <div style={{height:2,width:`${pct}%`,background:barColor,transition:'width .8s ease'}} />
                        </div>
                      </div>
                    )}
                    {p.note&&<div style={{fontSize:9,color:'#5C5448',marginTop:10,lineHeight:1.6}}>{p.note}</div>}
                  </div>
                );
              })}
            </div>

            {/* Alert */}
            <div style={{background:'#161412', border:'1px solid rgba(201,169,110,0.18)', padding:'18px 24px', marginBottom:28}}>
              <div style={{fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase', color:'#8A7048', marginBottom:12}}>
                Price Alert · {currency.code}
              </div>
              {existingAlert ? (
                <div style={{display:'flex', alignItems:'center', gap:14}}>
                  <span style={{fontSize:12, color:'#7EB896'}}>✓ Alert active at {existingAlert.currency} {existingAlert.targetPrice}</span>
                  <button onClick={()=>removeAlert(fragId)} style={{fontSize:9,color:'#C46060',background:'none',border:'none',cursor:'pointer',letterSpacing:'0.1em'}}>Remove</button>
                </div>
              ) : (
                <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
                  <input type="number" value={alertTarget} onChange={e=>setAlertTarget(e.target.value)}
                    placeholder={`Set target price in ${currency.code}`}
                    style={{...inputStyle, width:220, padding:'10px 14px', fontSize:12}} />
                  <button onClick={setAlert} style={{
                    background:'#C9A96E', color:'#0B0A09', border:'none',
                    fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.18em',
                    textTransform:'uppercase', padding:'10px 22px', cursor:'pointer',
                  }}>Set Alert</button>
                </div>
              )}
              <div style={{fontSize:9,color:'#3D3830',marginTop:8}}>Alerts are saved locally. Re-search to check current prices against your target.</div>
            </div>

            <div style={{fontSize:9, color:'#3D3830', lineHeight:1.7}}>
              ⚠ Prices are AI-estimated from known market data. Always verify on retailer websites before purchasing.
            </div>
          </div>
        )}

        {/* EMPTY */}
        {!data&&!loading&&!error && (
          <div style={{textAlign:'center', padding:'80px 20px'}}>
            <div style={{fontSize:48, opacity:.2, marginBottom:20}}>💰</div>
            <div style={{fontFamily:'Georgia,serif', fontSize:22, fontStyle:'italic', color:'#8A7D68', marginBottom:8}}>Search to compare prices</div>
            <div style={{fontSize:10, color:'#5C5448', letterSpacing:'0.2em'}}>Use quick picks or type any fragrance name above</div>
          </div>
        )}

        {/* HISTORY */}
        {history.length>0 && (
          <div style={{marginTop:48, paddingTop:32, borderTop:'1px solid rgba(201,169,110,0.12)'}}>
            <div style={{fontSize:9,letterSpacing:'0.3em',textTransform:'uppercase',color:'#8A7048',marginBottom:18}}>— Session History —</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {history.map((h,i)=>{
                const hAvail=(h.data?.platforms||[]).filter(p=>p.available&&p.price);
                const hMin=hAvail.length?Math.min(...hAvail.map(p=>p.price)):null;
                const hBest=hAvail.find(p=>p.price===hMin);
                return (
                  <div key={i} style={{background:'#161412',border:'1px solid rgba(201,169,110,0.12)',padding:'12px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
                    <div>
                      <div style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:14,color:'#E8DFD0',marginBottom:2}}>{h.data?.fragrance||h.term}</div>
                      <div style={{fontSize:9,color:'#5C5448'}}>{h.time} · {h.country}</div>
                    </div>
                    {hMin&&hBest&&(
                      <div style={{textAlign:'right'}}>
                        <div style={{fontFamily:'Georgia,serif',fontSize:18,color:'#C9A96E'}}>{currency.symbol}{hMin.toLocaleString()}</div>
                        <div style={{fontSize:9,color:'#5C5448'}}>{hBest.name}</div>
                      </div>
                    )}
                    <button onClick={()=>search(h.term)} style={{border:'1px solid rgba(201,169,110,0.18)',background:'transparent',color:'#8A7048',fontFamily:"'DM Mono',monospace",fontSize:9,padding:'5px 12px',cursor:'pointer'}}>↻ Re-search</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ACTIVE ALERTS */}
        {alerts.length>0 && (
          <div style={{marginTop:40, paddingTop:28, borderTop:'1px solid rgba(201,169,110,0.1)'}}>
            <div style={{fontSize:9,letterSpacing:'0.3em',textTransform:'uppercase',color:'#8A7048',marginBottom:16}}>
              — Active Price Alerts ({alerts.length}) —
            </div>
            {alerts.map((a,i)=>(
              <div key={i} style={{background:'#161412',border:'1px solid rgba(201,169,110,0.18)',padding:'12px 20px',marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontSize:11,color:'#E8DFD0',marginBottom:2}}>{a.fragranceId.replace(/-/g,' ')}</div>
                  <div style={{fontSize:9,color:'#C9A96E'}}>Target: {a.currency} {a.targetPrice}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <span style={{fontSize:9,color:'#7EB896'}}>● Active</span>
                  <button onClick={()=>removeAlert(a.fragranceId)} style={{fontSize:9,color:'#C46060',background:'none',border:'none',cursor:'pointer'}}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
