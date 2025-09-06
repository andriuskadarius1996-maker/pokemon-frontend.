
import React from 'react'
export default function DailyCheck(){
  return <div className="grid">
    {Array.from({length:7},(_,i)=>(
      <div key={i} className="card"><div style={{fontWeight:700}}>Day {i+1}</div><div className="small">Reduced XP + small PT</div></div>
    ))}
    <div className="card"><div style={{fontWeight:700}}>30 days bonus</div><div className="small">Legendary staking avatar</div></div>
  </div>
}
