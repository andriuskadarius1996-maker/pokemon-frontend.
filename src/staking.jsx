import React, { useEffect, useMemo, useState } from 'react'

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined

function useInitData() {
  const [initData, setInitData] = useState('')
  useEffect(() => {
    const d = tg?.initData || ''
    setInitData(d)
    tg?.ready(); tg?.expand()
    tg?.setHeaderColor('secondary_bg_color')
    tg?.setBackgroundColor('secondary_bg_color')
  }, [])
  return initData
}

export default function App() {
  const initData = useInitData()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [slots, setSlots] = useState([])
  const [cards, setCards] = useState([])
  const [message, setMessage] = useState('')

  const authHeaders = { 'X-TG-INIT-DATA': initData, 'Content-Type': 'application/json' }

  const loadAll = async () => {
    setLoading(true)
    const p = await fetch(`${apiBase}/api/profile`, { headers: authHeaders }).then(r=>r.json())
    const s = await fetch(`${apiBase}/api/slots`, { headers: authHeaders }).then(r=>r.json())
    const c = await fetch(`${apiBase}/api/cards`, { headers: authHeaders }).then(r=>r.json())
    setProfile(p); setSlots(s.slots || []); setCards(c.cards || [])
    setLoading(false)
  }

  useEffect(()=>{ if (initData) loadAll() }, [initData])

  const claim = async (slotIndex) => {
    setMessage('')
    const r = await fetch(`${apiBase}/api/claim`, {
      method: 'POST', headers: authHeaders, body: JSON.stringify({ slotIndex })
    }).then(r=>r.json())
    if (r.ok) { setMessage(`Gavai +${r.gained} XP`); tg?.HapticFeedback?.notificationOccurred('success'); loadAll() }
    else { setMessage(r.error || 'Nepavyko'); tg?.HapticFeedback?.notificationOccurred('error') }
  }

  const stake = async (slotIndex, cardId) => {
    setMessage('')
    const r = await fetch(`${apiBase}/api/stake`, {
      method: 'POST', headers: authHeaders, body: JSON.stringify({ slotIndex, cardId })
    }).then(r=>r.json())
    if (r.ok) loadAll(); else setMessage(r.error || 'Nepavyko')
  }

  if (loading) return <Center>Įkeliama…</Center>
  if (!profile) return <Center>Klaida įkeliant profilį</Center>

  return (
    <div style={{maxWidth:900, margin:'0 auto', padding:12}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div>
          <div style={{fontWeight:700,fontSize:18}}>Monstrų Staking</div>
          <div style={{opacity:.8,fontSize:13}}>Level {profile.level} • {profile.xp}/{profile.next_xp} XP</div>
          <Progress value={Math.floor(100*profile.xp/profile.next_xp)} />
        </div>
        <button onClick={loadAll} className="btn">Atnaujinti</button>
      </header>

      {message && <div style={{marginBottom:8, background:'#0b3', padding:'8px 12px', borderRadius:12}}>{message}</div>}

      <section style={{display:'grid', gridTemplateColumns:'1fr', gap:10}}>
        {slots.map((s, i) => (
          <div key={i} className="card">
            {s.card ? (
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:600}}>{s.card.emoji} {s.card.name}</div>
                  <div style={{opacity:.8, fontSize:13}}>{s.card.rate}/h • talpa {s.card.capacity}</div>
                  <Progress value={s.progressPct} />
                  <div style={{opacity:.7, fontSize:12}}>Sukaupta: {s.accrued} / {s.card.capacity}</div>
                </div>
                <button className="btn primary" onClick={()=>claim(i)} disabled={s.accrued<=0}>Claim</button>
              </div>
            ) : (
              <div>
                <div style={{marginBottom:6, fontWeight:600}}>Tuščias slotas #{i+1}</div>
                <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                  {cards.filter(c=>!c.staked).map(c=>(
                    <button key={c.id} className="btn" onClick={()=>stake(i, c.id)}>{c.emoji} {c.name} ({c.rate}/h)</button>
                  ))}
                  {cards.filter(c=>!c.staked).length===0 && <span style={{opacity:.7,fontSize:12}}>Neturi laisvų kortelių</span>}
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      <section style={{marginTop:12}}>
        <div style={{fontWeight:700, marginBottom:6}}>Tavo kortelės</div>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          {cards.map(c => (
            <div key={c.id} className="pill">{c.emoji} {c.name} • {c.rate}/h {c.staked?'(staked)':''}</div>
          ))}
        </div>
        <div style={{opacity:.7, fontSize:12, marginTop:8}}>Kitas unlock: {profile.next_unlock_level ? `Level ${profile.next_unlock_level}` : 'visi atrakinti 🎉'}</div>
      </section>

      <style>{`
        .btn{padding:8px 12px;border-radius:12px;background:#1f2937;color:#e5e7eb;border:none}
        .btn.primary{background:#059669}
        .card{background:#0f172a;border:1px solid #334155;border-radius:16px;padding:12px}
        .pill{background:#0f172a;border:1px solid #334155;border-radius:999px;padding:6px 10px;font-size:13px}
      `}</style>
    </div>
  )
}

function Progress({value}) {
  return (
    <div style={{height:8, background:'#334155', borderRadius:999, overflow:'hidden', marginTop:6, marginBottom:6}}>
      <div style={{height:'100%', width:`${value}%`, background:value>50?'#22c55e':value>25?'#f59e0b':'#ef4444'}}></div>
    </div>
  )
}
function Center({children}) {
  return <div style={{display:'grid', placeItems:'center', height:'100vh'}}>{children}</div>
}
