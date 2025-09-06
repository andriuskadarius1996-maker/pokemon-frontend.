
import React from 'react'
import AvatarAnimated from './AvatarAnimated'
export default function StakeCard({src,name,level,rate}:{src:string;name:string;level:number;rate:number}){
  return <div className="card">
    <div className="row">
      <AvatarAnimated src={src}/>
      <div style={{flex:1}}>
        <div style={{fontWeight:700}}>{name}</div>
        <div className="small">Lv {level} • Rate <b>{rate}/h</b></div>
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <button className="btn">Upgrade +1/h</button>
          <button className="btn">Sell</button>
        </div>
      </div>
    </div>
  </div>
}
