
import React, { useEffect, useState } from 'react';
import { AvatarAnimated } from './AvatarAnimated';

type Row = {level:number; phase:'spark'|'ember'|'aquado'|'legendary'|'pikachu'; avatar_path:string};
export function AvatarGrid(){
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(()=>{
    fetch('/assets/avatars_manifest.json')
      .then(r=>r.json())
      .then(data=> setRows(data.levels.map((x:any)=>({level:x.level, phase:x.phase, avatar_path:'/'+x.avatar_path}))));
  },[]);
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:16}}>
      {rows.map(r=>(
        <div key={r.level} style={{textAlign:'center'}}>
          <AvatarAnimated src={r.avatar_path} phase={r.phase} />
          <div style={{marginTop:8, opacity:.8}}>Lv {r.level}</div>
        </div>
      ))}
    </div>
  );
}
