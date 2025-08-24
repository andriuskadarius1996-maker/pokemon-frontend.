import React, { useEffect, useState } from 'react'

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined

function useInitData() {
  const [initData, setInitData] = useState('')
  useEffect(() => {
    try {
      if (tg) {
        tg.ready(); tg.expand()
        tg.setHeaderColor('secondary_bg_color')
        tg.setBackgroundColor('secondary_bg_color')
        setInitData(tg.initData || '')
      }
    } catch (e) { /* ignore */ }

    // Fallback: jei per 1 sek. negavom initData, vis tiek leidžiam UI pasileisti (demo)
    const t = setTimeout(() => {
      if (!initData) setInitData('DEMO_NO_INITDATA')
    }, 1000)
    return () => clearTimeout(t)
  }, [])
  return initData
}

export default function App() {
  const initData = useInitData()
  const [loading, setLoading] = useState(false)      // nebelaikom amžinam „įkeliama…“
  const [profile, setProfile] = useState(null)
  const [slots, setSlots] = useState([])
  const [cards, setCards] = useState([])
  const [message, setMessage] = useState('')

  // DEMO startiniai duomenys (kai nėra serverio / initData)
  useEffect(() => {
    if (!initData) return
    // Jei atėjom su DEMO vėliava – parodome UI be serverio
    if (initData === 'DEMO_NO_INITDATA') {
      setProfile({ level: 1, xp: 0, next_xp: 100, next_unlock_level: 5 })
      setCards([
        { id: 1, code:'sparko', name:'Sparko', emoji:'⚡️', rate:3, capacity:72, staked:false },
        { id: 2, code:'embero', name:'Embero', emoji:'🔥', rate:4, capacity:96, staked:false },
      ])
      setSlots([{card:null,progressPct:0,accrued:0},{card:null,progressPct:0,accrued:0},{card:null,progressPct:0,accrued:0},{card:null,progressPct:0,accrued:0},{card:null,progressPct:0,accrued:0}])
      return
    }

    // Jei initData yra – bandome kalbėtis su API (kai tik paleisim serverį)
    const authHeaders = { 'X-TG-INIT-DATA': initData, 'Content-Type': 'application/json' }
    const loadAll = async () => {
      try {
        setLoading(true)
        const [p,s,c] = await Promise.all([
          fetch(`${apiBase}/api/profile`, { headers: authHeaders }).then(r=>r.json()),
          fetch(`${apiBase}/api/slots`,   { headers: authHeaders }).then(r=>r.json()),
          fetch(`${apiBase}/api/cards`,   { headers: authHeaders }).then(r=>r.json()),
        ])
        setProfile(p)
        setSlots(s.slots || [])
        setCards(c.cards || [])
      } catch (e) {
        // Jei API nepasiekiamas – pereinam į demo, bet UI nerakinam
        setMessage('Serveris dar nepajungtas – rodoma demo versija.')
        setProfile({ level: 1, xp: 0, next_xp: 100, next_unlock_level: 5 })
        setCards([
          { id: 1, code:'sparko', name:'Sparko', emoji:'⚡️', rate:3, capacity:72, staked:false },
          { id: 2, code:'embero', name:'Embero', emoji:'🔥', rate:4, capacity:96, staked:false },
        ])
        setSlots([{card:null,progressPct:0,accrued:0},{card:null,progressPct:0,accrued:0},{card:null,progressPct:0,accrued:0},{card:null,progressPct:0,accrued:0},{card:null,progressPct:0,accrued:0}])
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [initData])

  const disabledMsg = 'Reikalingas serveris – greitai pajungsim!'
  const disabled = !profile || message.includes('Serveris dar nepajungtas')

  const claim = async (slotIndex) => {
    if (disabled) return setMessage(disabledMsg)
    try {
      const r = await fetch(`${apiBase}/api/claim`, {
        method: 'POST',
        headers: { 'X-TG-INIT-DATA': initData, 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotIndex })
      }).then(r=>r.json())
      if (r.ok) {
        setMessage(`Gavai +${r.gained} XP`)
        tg?.HapticFeedback?.notificationOccurred('success')
        // paprastumo dėlei perkraunam duomenis
        window.location.reload()
      } else {
        setMessage(r.error || 'Nepavyko')
        tg?.HapticFeedback?.notificationOccurred('error')
      }
    } catch {
      setMessage(disabledMsg)
    }
  }

  const stake = async (slotIndex, cardId) => {
    if (disabled) return setMessage(disabledMsg)
    try {
      const r = await fetch(`${apiBase}/api/stake`, {
        method: 'POST',
        headers: { 'X-TG-INIT-DATA': initData, 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotIndex, cardId })
      }).then(r=>r.json())
      if (r.ok) window.location.reload()
      else setMessage(r.error || 'Nepavyko')
    } catch {
      setMessage(disabledMsg)
    }
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
        <button onClick={()=>window.location.reload()} className="btn">Atnaujinti</button>
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
                  <Progress value={s.progressPct || 0} />
                  <div style={{opacity:.7, fontSize:12}}>Sukaupta: {s.accrued || 0} / {s.card.capacity}</div>
                </div>
                <button className="btn primary" onClick={()=>claim(i)} disabled={(s.accrued||0)<=0 || disabled}>Claim</button>
              </div>
            ) : (
              <div>
                <div style={{marginBottom:6, fontWeight:600}}>Tuščias slotas #{i+1}</div>
                <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                  {cards.filter(c=>!c.staked).map(c=>(
                    <button key={c.id} className="btn" onClick={()=>stake(i, c.id)} disabled={disabled}>
                      {c.emoji} {c.name} ({c.rate}/h)
                    </button>
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
        <div style={{opacity:.7, fontSize:12, marginTop:8}}>
          Kitas unlock: {profile.next_unlock_level ? `Level ${profile.next_unlock_level}` : 'visi atrakinti 🎉'}
        </div>
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
      <div style={{height:'100%', width:`${value||0}%`, background:value>50?'#22c55e':value>25?'#f59e0b':'#ef4444'}}></div>
    </div>
  )
}
function Center({children}) {
  return <div style={{display:'grid', placeItems:'center', height:'100vh'}}>{children}</div>
}
