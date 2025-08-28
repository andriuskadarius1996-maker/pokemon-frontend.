import { useEffect, useState } from 'react'
import NavTabs from './components/NavTabs'
import MainView from './pages/MainView'
import ShopView from './pages/ShopView'
import LeaderboardView from './pages/LeaderboardView'
import ReferralView from './pages/ReferralView'
import SeasonInfoView from './pages/SeasonInfoView'
import DailyCheckView from './pages/DailyCheckView'
import { useGame } from './state/store'

export default function App(){
  const [tab, setTab] = useState('Main')
  const { tickBoost } = useGame()
  useEffect(()=>{ const t=setInterval(()=> tickBoost(Date.now()),1000); return ()=> clearInterval(t) },[])
  return <div className="max-w-3xl mx-auto p-4 space-y-6">
    <div className="flex items-center gap-3">
      <div className="w-3 h-10 rounded-full bg-green-400/80" />
      <div><div className="font-semibold text-xl">PokeToken</div><div className="text-xs opacity-70">Season 1 • Demo</div></div>
    </div>
    <NavTabs active={tab} setActive={setTab} />
    {tab==='Main' && <MainView />}
    {tab==='Shop' && <ShopView />}
    {tab==='Leaderboard' && <LeaderboardView />}
    {tab==='Referral' && <ReferralView />}
    {tab==='Season Info' && <SeasonInfoView />}
    {tab==='Daily Check' && <DailyCheckView />}
    <div className="text-center text-xs opacity-60">Demo only • No real wallets or payments • Visual prototype for Telegram Mini App</div>
  </div>
}
