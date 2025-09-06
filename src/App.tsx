
import React, {useState} from 'react'
import './styles.css'
import Main from './pages/Main'
import Stake from './pages/Stake'
import Shop from './pages/Shop'
import Referral from './pages/Referral'
import Leaderboard from './pages/Leaderboard'
import SeasonInfo from './pages/SeasonInfo'
import DailyCheck from './pages/DailyCheck'

export default function App(){
  const [tab,setTab]=useState<'Main'|'Stake'|'Shop'|'Referral'|'Leaderboard'|'Season'|'Daily'>('Main')
  return <div className="container">
    <div style={{fontWeight:900,fontSize:22,marginBottom:10}}>POKE TOKEN — Season 1</div>
    <div className="tabs">
      {['Main','Stake','Shop','Referral','Leaderboard','Season','Daily'].map(t=>
        <button key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t as any)}>{t}</button>
      )}
    </div>
    {tab==='Main' && <Main/>}
    {tab==='Stake' && <Stake/>}
    {tab==='Shop' && <Shop/>}
    {tab==='Referral' && <Referral/>}
    {tab==='Leaderboard' && <Leaderboard/>}
    {tab==='Season' && <SeasonInfo/>}
    {tab==='Daily' && <DailyCheck/>}
  </div>
}
