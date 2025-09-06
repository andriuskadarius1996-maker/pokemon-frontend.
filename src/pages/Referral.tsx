
import React from 'react'
export default function Referral(){
  return <div className="card">
    <div style={{fontWeight:700}}>Referral</div>
    <div className="small">+10 XP & +50 PT per friend • XP cap 500/day</div>
    <div className="small" style={{marginTop:8}}>≥5/day → +2% staking boost (stacks up to 3×)</div>
    <div style={{display:'flex',gap:8,marginTop:10}}>
      <button className="btn">Copy Invite Link</button>
      <button className="btn">Simulate Invite +1</button>
    </div>
  </div>
}
