import { useState, useMemo } from 'react';
import Nav from '../components/Nav';
import FragranceCard from '../components/FragranceCard';
import FragranceModal from '../components/FragranceModal';
import { useStore } from '../hooks/useStore';
import { T, S } from '../lib/design';
import { FRAGRANCE_DB, ACCORDS, SEASONS, OCCASIONS, GENDERS, CONCENTRATIONS } from '../lib/database';

const SORT_OPTIONS = [
  ['rating','Highest Rated'],['ratings_count','Most Reviewed'],
  ['year_new','Newest'],['longevity','Best Longevity'],
  ['sillage','Best Sillage'],['name','A to Z'],
];

export default function DiscoverPage() {
  const { isInCollection, getEntry, state } = useStore();
  const [openFrag, setOpenFrag] = useState(null);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('rating');
  const [view, setView] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [tab, setTab] = useState('all');
  const [filters, setFilters] = useState({
    accords:[], seasons:[], occasions:[], genders:[], concentrations:[], inCollection:null
  });

  const results = useMemo(() => {
    let list = [...FRAGRANCE_DB];
    if (q.trim()) {
      const lq = q.toLowerCase();
      list = list.filter(f =>
        f.name.toLowerCase().includes(lq) ||
        f.house.toLowerCase().includes(lq) ||
        (f.description||'').toLowerCase().includes(lq) ||
        (f.accords||[]).some(a => a.toLowerCase().includes(lq)) ||
        (f.notes&&f.notes.top||[]).some(n => n.toLowerCase().includes(lq)) ||
        (f.notes&&f.notes.base||[]).some(n => n.toLowerCase().includes(lq))
      );
    }
    if (filters.accords.length) list = list.filter(f => filters.accords.every(a => (f.accords||[]).includes(a)));
    if (filters.seasons.length) list = list.filter(f => filters.seasons.some(s => (f.season||[]).includes(s) || (f.season||[]).includes('All Season')));
    if (filters.occasions.length) list = list.filter(f => filters.occasions.some(o => (f.occasion||[]).includes(o)));
    if (filters.genders.length) list = list.filter(f => filters.genders.includes(f.gender) || f.gender==='Unisex');
    if (filters.concentrations.length) list = list.filter(f => filters.concentrations.includes(f.concentration));
    if (filters.inCollection==='owned') list = list.filter(f => getEntry(f.id)?.list==='owned');
    if (filters.inCollection==='wishlist') list = list.filter(f => getEntry(f.id)?.list==='wishlist');
    if (filters.inCollection==='toTest') list = list.filter(f => getEntry(f.id)?.list==='toTest');
    if (filters.inCollection==='notOwned') list = list.filter(f => !isInCollection(f.id));
    list.sort((a,b) => {
      if (sort==='rating') return (b.avgRating||0)-(a.avgRating||0);
      if (sort==='ratings_count') return (b.totalRatings||0)-(a.totalRatings||0);
      if (sort==='year_new') return (b.year||0)-(a.year||0);
      if (sort==='longevity') return (b.longevity||0)-(a.longevity||0);
      if (sort==='sillage') return (b.sillage||0)-(a.sillage||0);
      if (sort==='name') return a.name.localeCompare(b.name);
      return 0;
    });
    return list;
  }, [q, sort, filters, state.collection]);

  const recommendations = useMemo(() => {
    const owned = Object.entries(state.collection).filter(([,v])=>v.list==='owned').map(([id])=>id);
    if (!owned.length) return [...FRAGRANCE_DB].sort((a,b)=>(b.avgRating||0)-(a.avgRating||0)).slice(0,8);
    const ownedFrags = FRAGRANCE_DB.filter(f=>owned.includes(f.id));
    const af = {};
    ownedFrags.forEach(f=>(f.accords||[]).forEach(a=>{af[a]=(af[a]||0)+1;}));
    return FRAGRANCE_DB
      .filter(f=>!owned.includes(f.id))
      .map(f=>({...f, _score:(f.accords||[]).reduce((s,a)=>s+(af[a]||0),0)}))
      .sort((a,b)=>b._score-a._score)
      .slice(0,8);
  }, [state.collection]);

  const trending = useMemo(()=>[...FRAGRANCE_DB]
    .sort((a,b)=>((b.avgRating||0)*Math.log((b.totalRatings||1)))-((a.avgRating||0)*Math.log((a.totalRatings||1))))
    .slice(0,8),[]);

  function toggle(key, val) {
    setFilters(f => ({...f, [key]: f[key].includes(val) ? f[key].filter(v=>v!==val) : [...f[key], val]}));
  }

  const activeCount = filters.accords.length+filters.seasons.length+filters.occasions.length+filters.genders.length+filters.concentrations.length+(filters.inCollection?1:0);
  const displayList = tab==='recommendations' ? recommendations : tab==='trending' ? trending : results;
  const ownedCount = Object.values(state.collection).filter(v=>v.list==='owned').length;

  return (
    <div style={{background:'#0B0A09', minHeight:'100vh', color:'#E8DFD0', fontFamily:"'DM Mono',monospace"}}>
      <Nav />
      {openFrag && <FragranceModal frag={openFrag} onClose={()=>setOpenFrag(null)} />}

      <div style={{maxWidth:1300, margin:'0 auto', padding:'0 24px', paddingTop:40, paddingBottom:60}}>

        {/* HERO */}
        <div style={{marginBottom:36}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:12, marginBottom:8}}>
            <div style={{fontFamily:'Georgia,serif', fontSize:44, fontStyle:'italic', color:'#C9A96E', lineHeight:1}}>Discover</div>
            <div style={{fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase', color:'#8A7048'}}>
              {FRAGRANCE_DB.length} Fragrances · Global Database · AI-Powered Pricing
            </div>
          </div>
          <div style={{display:'flex', gap:20, flexWrap:'wrap', marginTop:12}}>
            {[
              {label:'Total Fragrances', val:FRAGRANCE_DB.length, c:'#C9A96E'},
              {label:'In Your Collection', val:ownedCount, c:'#C9A96E'},
              {label:'Houses', val:new Set(FRAGRANCE_DB.map(f=>f.house)).size, c:'#7EB8D4'},
              {label:'Countries Priced', val:6, c:'#7EB896'},
            ].map(({label,val,c})=>(
              <div key={label} style={{background:'#161412', border:'1px solid rgba(201,169,110,0.14)', padding:'10px 18px'}}>
                <div style={{fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', color:'#5C5448', marginBottom:4}}>{label}</div>
                <div style={{fontFamily:'Georgia,serif', fontSize:22, color:c}}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SEARCH ROW */}
        <div style={{display:'flex', gap:10, marginBottom:16, flexWrap:'wrap'}}>
          <div style={{flex:1, minWidth:260, position:'relative'}}>
            <input
              value={q} onChange={e=>setQ(e.target.value)}
              placeholder="Search by name, house, note, accord, description..."
              style={{
                background:'rgba(201,169,110,0.05)', border:'1px solid rgba(201,169,110,0.14)',
                color:'#E8DFD0', fontFamily:"'DM Mono',monospace", fontSize:13,
                padding:'13px 42px 13px 18px', width:'100%'
              }}
            />
            {q && (
              <button onClick={()=>setQ('')} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'#5C5448',cursor:'pointer',fontSize:16}}>✕</button>
            )}
          </div>
          <button onClick={()=>setShowFilters(!showFilters)} style={{
            background:activeCount>0?'rgba(201,169,110,0.07)':'transparent',
            border:`1px solid ${activeCount>0?'#C9A96E':'rgba(201,169,110,0.14)'}`,
            color:activeCount>0?'#C9A96E':'#8A7D68',
            fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.18em',
            textTransform:'uppercase', padding:'13px 22px', cursor:'pointer', whiteSpace:'nowrap',
          }}>
            {showFilters ? '× Filters' : '⟨⟩ Filters'}{activeCount>0?` (${activeCount})`:''}
          </button>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{
            background:'#161412', border:'1px solid rgba(201,169,110,0.14)',
            color:'#8A7D68', fontFamily:"'DM Mono',monospace", fontSize:10, padding:'13px 16px',
          }}>
            {SORT_OPTIONS.map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
          <div style={{display:'flex', border:'1px solid rgba(201,169,110,0.14)'}}>
            {[['grid','⊞'],['list','☰']].map(([v,icon])=>(
              <button key={v} onClick={()=>setView(v)} style={{
                padding:'0 18px', border:'none',
                background:view===v?'rgba(201,169,110,0.07)':'transparent',
                color:view===v?'#C9A96E':'#5C5448',
                fontSize:16, cursor:'pointer', transition:'all .15s',
              }}>{icon}</button>
            ))}
          </div>
        </div>

        {/* FILTER PANEL */}
        {showFilters && (
          <div style={{background:'#161412', border:'1px solid rgba(201,169,110,0.14)', padding:24, marginBottom:20}}>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:22}}>
              {[
                {label:'ACCORDS', key:'accords', opts:ACCORDS},
                {label:'SEASON', key:'seasons', opts:SEASONS},
                {label:'OCCASION', key:'occasions', opts:OCCASIONS},
                {label:'GENDER', key:'genders', opts:GENDERS},
                {label:'CONCENTRATION', key:'concentrations', opts:CONCENTRATIONS},
              ].map(({label,key,opts})=>(
                <div key={key}>
                  <div style={{fontSize:9,letterSpacing:'0.25em',textTransform:'uppercase',color:'#8A7048',marginBottom:10}}>{label}</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                    {opts.map(o=>(
                      <button key={o} onClick={()=>toggle(key,o)} style={{
                        padding:'4px 10px',
                        border:`1px solid ${filters[key].includes(o)?'#C9A96E':'rgba(201,169,110,0.14)'}`,
                        background:filters[key].includes(o)?'rgba(201,169,110,0.08)':'transparent',
                        color:filters[key].includes(o)?'#C9A96E':'#5C5448',
                        fontFamily:"'DM Mono',monospace", fontSize:9, cursor:'pointer', transition:'all .15s',
                      }}>{o}</button>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <div style={{fontSize:9,letterSpacing:'0.25em',textTransform:'uppercase',color:'#8A7048',marginBottom:10}}>COLLECTION</div>
                {[['owned','✦ I Own'],['wishlist','◈ Wishlist'],['toTest','◉ Want to Test'],['notOwned','Not Owned']].map(([v,l])=>(
                  <button key={v} onClick={()=>setFilters(f=>({...f,inCollection:f.inCollection===v?null:v}))} style={{
                    display:'block', width:'100%', marginBottom:5, padding:'7px 12px',
                    border:`1px solid ${filters.inCollection===v?'#C9A96E':'rgba(201,169,110,0.14)'}`,
                    background:filters.inCollection===v?'rgba(201,169,110,0.08)':'transparent',
                    color:filters.inCollection===v?'#C9A96E':'#5C5448',
                    fontFamily:"'DM Mono',monospace", fontSize:9, cursor:'pointer', textAlign:'left', transition:'all .15s',
                  }}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:18,paddingTop:16,borderTop:'1px solid rgba(201,169,110,0.1)'}}>
              <span style={{fontSize:10,color:'#5C5448'}}>{results.length} fragrances match your filters</span>
              <button onClick={()=>setFilters({accords:[],seasons:[],occasions:[],genders:[],concentrations:[],inCollection:null})} style={{fontSize:9,color:'#C46060',background:'none',border:'none',cursor:'pointer',letterSpacing:'0.12em'}}>Clear All Filters</button>
            </div>
          </div>
        )}

        {/* TABS */}
        <div style={{display:'flex', gap:0, borderBottom:'1px solid rgba(201,169,110,0.14)', marginBottom:24}}>
          {[
            ['all',`All Fragrances (${results.length})`],
            ['recommendations','Recommended for You'],
            ['trending','Trending'],
          ].map(([key,label])=>(
            <button key={key} onClick={()=>setTab(key)} style={{
              padding:'11px 24px', border:'none', background:'transparent',
              color:tab===key?'#C9A96E':'#5C5448',
              fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase',
              borderBottom:`2px solid ${tab===key?'#C9A96E':'transparent'}`,
              cursor:'pointer', transition:'all .15s',
            }}>{label}</button>
          ))}
        </div>

        {/* RECOMMENDATION NOTICE */}
        {tab==='recommendations' && (
          <div style={{background:'#161412', border:'1px solid rgba(201,169,110,0.18)', padding:'14px 20px', marginBottom:20, display:'flex', gap:14, alignItems:'center'}}>
            <span style={{fontSize:20}}>◈</span>
            <div style={{fontSize:12, color:'#8A7D68', lineHeight:1.6}}>
              {ownedCount===0
                ? 'Add fragrances to your Owned list to unlock personalized recommendations based on your accord profile.'
                : `Fragrances that share accord DNA with your ${ownedCount} owned bottle${ownedCount>1?'s':''}. Sorted by compatibility score.`}
            </div>
          </div>
        )}

        {tab==='trending' && (
          <div style={{background:'#161412', border:'1px solid rgba(201,169,110,0.18)', padding:'14px 20px', marginBottom:20}}>
            <div style={{fontSize:12, color:'#8A7D68'}}>Ranked by combined rating score and community engagement volume.</div>
          </div>
        )}

        {/* COUNT LABEL */}
        {tab==='all' && (
          <div style={{fontSize:10, color:'#5C5448', letterSpacing:'0.08em', marginBottom:16}}>
            {q ? `${results.length} results for "${q}"` : `Showing all ${FRAGRANCE_DB.length} fragrances`}
            {activeCount>0 && ` · ${activeCount} filter${activeCount>1?'s':''} active`}
          </div>
        )}

        {/* GRID */}
        {view==='grid' && (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:16}}>
            {displayList.map((frag,i)=>(
              <div key={frag.id} className="fade-up" style={{animationDelay:`${Math.min(i,10)*0.035}s`}}>
                <FragranceCard frag={frag} onOpen={setOpenFrag} />
              </div>
            ))}
          </div>
        )}

        {/* LIST */}
        {view==='list' && (
          <div style={{display:'flex', flexDirection:'column', gap:8}}>
            {displayList.map((frag,i)=>(
              <div key={frag.id} className="fade-up" style={{animationDelay:`${Math.min(i,10)*0.025}s`}}>
                <FragranceCard frag={frag} onOpen={setOpenFrag} compact />
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {displayList.length===0 && (
          <div style={{textAlign:'center', padding:'80px 20px'}}>
            <div style={{fontSize:44, opacity:.2, marginBottom:18}}>🔍</div>
            <div style={{fontFamily:'Georgia,serif', fontSize:22, fontStyle:'italic', color:'#8A7D68', marginBottom:8}}>No fragrances found</div>
            <div style={{fontSize:10, letterSpacing:'0.18em', color:'#5C5448'}}>Try adjusting your search or filters</div>
          </div>
        )}

      </div>
    </div>
  );
}
