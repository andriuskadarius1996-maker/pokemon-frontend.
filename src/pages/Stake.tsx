
import React from 'react'
import data from '../assets/avatars_manifest.json'
import StakeCard from '../components/StakeCard'
const rate=(lv:number)=> lv>=30?10: lv>=21?6: lv>=16?4: lv>=11?3: 2
export default function Stake(){
  const lvls=[1,5,10,12,16,20,25,30]
  return <div style={{display:'grid',gap:12}}>
    {lvls.map(lv=>{
      const row=(data as any).levels.find((x:any)=>x.level===lv)
      return <StakeCard key={lv} src={'/'+row.avatar_path} name={`Card Lv${lv}`} level={lv} rate={rate(lv)}/>
    })}
  </div>
}
