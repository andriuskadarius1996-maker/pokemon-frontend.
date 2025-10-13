import React from 'react';

export default function StakeCard({ name, rate, lvl, onUpgrade }:{ name:string; rate:number; lvl:number; onUpgrade:()=>void; }){
  return (
    <div className="card">
      <div className="flex-row" style={{justifyContent:'space-between', gap:12}}>
        <div>
          <div style={{fontWeight:700}}>{name}</div>
          <div style={{opacity:.8}}>Rate: {rate}/h</div>
          <div style={{opacity:.8}}>Upgrade: +1/h (lvl {lvl}/3)</div>
        </div>
        <button className="btn" onClick={onUpgrade}>Upgrade</button>
      </div>
    </div>
  );
}
