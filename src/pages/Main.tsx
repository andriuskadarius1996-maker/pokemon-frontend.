
import React from 'react'
import data from '../assets/avatars_manifest.json'
import AvatarAnimated from '../components/AvatarAnimated'
export default function Main(){
  const cur = data.levels.find((x:any)=>x.level===30) || data.levels[0]
  return <div className="card">
    <div className="row">
      <AvatarAnimated src={'/'+cur.avatar_path}/>
      <div>
        <div style={{fontWeight:800,fontSize:18}}>POKE TOKEN — Season 1</div>
        <div className="small" style={{marginTop:6}}>Season 1 chance — 100 SOL</div>
        <div className="small" style={{marginTop:10}}>XP • PokeToken • Auto avatar progression (no downgrade)</div>
      </div>
    </div>
  </div>
}
