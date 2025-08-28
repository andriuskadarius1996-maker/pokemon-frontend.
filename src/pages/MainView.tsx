import { useEffect, useMemo, useState } from 'react'
import { useGame } from '../state/store'
import { avatarForLevel, bonusesForLevel, phaseColor } from '../utils/avatars'
import ProgressBar from '../components/ProgressBar'
import { xpNeededForLevel } from '../utils/xp'
import { formatHMS } from '../utils/time'

export default function MainView(){
  const { level, xp, tokens, walletConnected, connectWallet, boost, resetToLevel1 } = useGame()
  const avatar = useMemo(()=>avatarForLevel(level),[level])
  const nextXp = xpNeededForLevel(level+1)
  const progress = Math.min(100, Math.round((xp/nextXp)*100))
  const bonuses = bonusesForLevel(level)
  const [now, setNow] = useState(Date.now())
  useEffect(()=>{ const t = setInterval(()=> setNow(Date.now()),1000); return ()=> clearInterval(t) },[])
  const boostLeft = boost.expiresAt ? Math.max(0, boost.expiresAt - now) : 0
  return <div className="space-y-6">
    <div className="flex gap-3 flex-wrap">
      <div className="card min-w-[180px]"><div className="text-sm opacity-70">PokeToken</div><div className="text-3xl font-semibold">{tokens.toLocaleString()}</div></div>
      <div className="card min-w-[180px]"><div className="text-sm opacity-70">XP</div><div className="text-3xl font-semibold">{(xp).toLocaleString()}</div><div className="mt-2"><span className="badge">level {level}</span></div></div>
      {!walletConnected && <div className="card flex items-center"><button className="btn-primary" onClick={connectWallet}>Connect Wallet</button></div>}
    </div>
    <div className="card">
      <div className="flex items-center gap-4">
        <div className="w-28 h-28 rounded-2xl avatar-idle" style={{background:'#0f172a', border:`2px solid ${phaseColor(avatar.phase)}`}} />
        <div className="flex-1">
          <div className="text-xl font-semibold">{avatar.name}</div>
          <div className="text-sm opacity-80 mt-1">+{bonuses.staking}% staking / +{bonuses.chest}% chest</div>
          {boostLeft>0 && <div className="text-xs mt-1 opacity-80">Boost: +{boost.staking}% / +{boost.chest}% • ⏳ {formatHMS(boostLeft)}</div>}
          <div className="mt-3"><ProgressBar phase={avatar.phase} progress={progress} /><div className="text-xs mt-1 opacity-70">{xp} / {nextXp} XP until next level</div></div>
        </div>
        <div className="flex flex-col gap-2"><button className="btn" onClick={resetToLevel1}>Reset to Lv1</button></div>
      </div>
    </div>
    <div className="opacity-60 text-xs">Demo: UI prototype • Fees hidden in UI • Anti-cheat server-side (not in demo)</div>
  </div>
}
