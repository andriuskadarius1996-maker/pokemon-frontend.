
import React, {useState} from 'react'
export default function Shop(){
  const [xp,setXp]=useState(0)
  const [stk,setStk]=useState(0)
  return <div className="grid">
    <div className="card">
      <div style={{fontWeight:700}}>XP Boost ×2 (9h)</div>
      <div className="small">Repeated buys extend time</div>
      <button className="btn" style={{marginTop:8}} onClick={()=>setXp(xp+9)}>Buy</button>
      <div className="small" style={{marginTop:6}}>Active: {xp}h</div>
    </div>
    <div className="card">
      <div style={{fontWeight:700}}>Staking Boost +2% (9h)</div>
      <div className="small">UI hides fees; charged on payment only</div>
      <button className="btn" style={{marginTop:8}} onClick={()=>setStk(stk+9)}>Buy</button>
      <div className="small" style={{marginTop:6}}>Active: {stk}h</div>
    </div>
    <div className="card">
      <div style={{fontWeight:700}}>Lucky Chest</div>
      <div className="small">PT/XP/frames/staking cards</div>
      <button className="btn" style={{marginTop:8}}>Open</button>
    </div>
    <div className="card">
      <div style={{fontWeight:700}}>Small Chest (Daily)</div>
      <div className="small">Lvl 1–5 staking card chance</div>
      <button className="btn" style={{marginTop:8}}>Open</button>
    </div>
  </div>
}
