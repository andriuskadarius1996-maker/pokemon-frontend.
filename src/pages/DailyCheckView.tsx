import { useState } from 'react'
import { useGame } from '../state/store'
const LABELS = ['Day 1','Day 2','Day 3','Day 4','Day 5','Day 6','Day 7']
export default function DailyCheckView(){
  const { dailyIndex, claimDaily, streakDays } = useGame()
  const [msg, setMsg] = useState<string>('')
  const claim = ()=> { const r = claimDaily(); setMsg(r.message); setTimeout(()=> setMsg(''), 2500) }
  return <div className="space-y-4">
    <div className="card">
      <div className="flex items-center justify-between"><div className="text-lg font-semibold">Daily Check</div><div className="text-sm opacity-80">Streak: {streakDays} days</div></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
        {LABELS.map((lab,i)=>(
          <div key={i} className={`p-3 rounded-xl border ${i===dailyIndex? 'border-green-400/50 bg-green-400/10':'border-white/10 bg-white/5'}`}>
            <div className="font-semibold text-sm">{lab}</div>
            <div className="text-xs opacity-80 mt-1">
              {i===0 && '5 XP + 20 PT'}
              {i===1 && '10 XP'}
              {i===2 && 'Small Chest'}
              {i===3 && '15 XP'}
              {i===4 && '50 PT'}
              {i===5 && '20 XP'}
              {i===6 && 'LuckyChest'}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-3"><button className="btn" onClick={claim}>Claim Today</button>{msg && <div className="text-sm opacity-80 self-center">{msg}</div>}</div>
      <div className="text-xs opacity-70 mt-2">Complete 30-day streak to receive a fixed Legendary staking avatar.</div>
    </div>
  </div>
}
