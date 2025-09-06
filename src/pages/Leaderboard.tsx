
import React from 'react'
export default function Leaderboard(){
  const rows = Array.from({length:80}, (_,i)=>({pos:i+1, nick:`User${i+1}`, xp: 50000 - i*300, pt: 15000 - i*100, prize: i<3?[13,8,6][i]:0.95 }))
  return <div className="card">
    <div style={{fontWeight:700, marginBottom:8}}>Leaderboard (Top 80)</div>
    <div className="small" style={{display:'grid',gridTemplateColumns:'60px 1fr 120px 120px 100px',gap:8,fontWeight:600,opacity:.8}}>
      <div>#</div><div>Nick</div><div>XP</div><div>PokeToken</div><div>Prize</div>
    </div>
    <div style={{marginTop:8,display:'grid',gap:6}}>
      {rows.map(r=>(
        <div key={r.pos} className="small" style={{display:'grid',gridTemplateColumns:'60px 1fr 120px 120px 100px',gap:8}}>
          <div>{r.pos}</div><div>{r.nick}</div><div>{r.xp}</div><div>{r.pt}</div><div>{r.prize}</div>
        </div>
      ))}
    </div>
  </div>
}
