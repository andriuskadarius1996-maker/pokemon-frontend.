import React from 'react'
import manifest from "/avatars_manifest.json"

const levels = Array.from({length:30}, (_,i)=>i+1)
export default function App(){
  return (
    <div style={{padding:24, maxWidth:1200, margin:'0 auto'}}>
      <h1 style={{margin:0}}>POKE TOKEN — Season 1</h1>
      <p style={{opacity:.8}}>Avatars loaded from <code>/avatars_main/</code> via manifest.</p>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:16, marginTop:24}}>
        {levels.map(n=>{
          const url = (manifest as any)[String(n)] as string
          return (
            <div key={n} style={{background:'#0f1a33', padding:12, borderRadius:12, textAlign:'center'}}>
              <img src={url} alt={'lv'+String(n).padStart(2,'0')} style={{width:'100%',height:'auto',borderRadius:10}} onError={(e)=>{ (e.target as HTMLImageElement).style.opacity='0.25' }} />
              <small style={{opacity:.8}}>lv{String(n).padStart(2,'0')}.png</small>
            </div>
          )
        })}
      </div>
    </div>
  )
}
