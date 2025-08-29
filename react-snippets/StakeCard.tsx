
import React from 'react';
import { AvatarAnimated } from './AvatarAnimated';
export function StakeCard({name, level, src, phase, rate}:{name:string; level:number; src:string; phase:'spark'|'ember'|'aquado'|'legendary'|'pikachu'; rate:number}){
  return (
    <div style={{background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.08)', padding:12, borderRadius:12, display:'flex', gap:12, alignItems:'center'}}>
      <AvatarAnimated src={src} phase={phase}/>
      <div style={{flex:1}}>
        <div style={{fontWeight:600}}>{name}</div>
        <div style={{opacity:.8, fontSize:12}}>Lv {level} • Rate: <b>{rate}/h</b></div>
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <button style={{padding:'6px 10px', borderRadius:8, background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)'}}>Upgrade +1/h</button>
          <button style={{padding:'6px 10px', borderRadius:8, background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)'}}>Sell</button>
        </div>
      </div>
    </div>
  );
}
