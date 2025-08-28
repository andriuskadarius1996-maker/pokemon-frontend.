import { useEffect, useState } from 'react'
import { useGame } from '../state/store'
import { formatHMS } from '../utils/time'

export default function ReferralView(){
  const { todaysReferrals, simulateInvite, boost, boostMultiplier, tokens, referralXpGainedToday } = useGame()
  const [now, setNow] = useState(Date.now())
  useEffect(()=>{ const t=setInterval(()=> setNow(Date.now()),1000); return ()=> clearInterval(t) },[])
  const left = boost.expiresAt ? Math.max(0, boost.expiresAt - now) : 0
  const invite = ()=> simulateInvite(1)
  const copyLink = ()=> navigator.clipboard.writeText('https://t.me/G0Pokem0nBot?start=ref_demo')
  return <div className="space-y-4">
    <div className="card">
      <div className="text-lg font-semibold">Referral</div>
      <div className="text-sm opacity-80 mt-1">Daily limit: up to 1000 invites (XP capped at 200/day)</div>
      <div className="flex gap-3 mt-3">
        <button className="btn" onClick={copyLink}>Copy Invite Link</button>
        <button className="btn" onClick={invite}>Simulate Invite +1</button>
      </div>
      <div className="mt-3 text-sm opacity-80">
        ✅ Today invited: {todaysReferrals} • 🎁 XP gained: {referralXpGainedToday}/200 • 💰 Tokens: {tokens}
      </div>
      {left>0 && <div className="mt-2 text-sm opacity-90">Boost active: +{boost.staking}% / +{boost.chest}% (x{boostMultiplier}) • ⏳ {formatHMS(left)}</div>}
    </div>
    <div className="card">
      <div className="text-lg font-semibold">History</div>
      <div className="text-sm opacity-80">Demo: scrollable list of invited users would appear here.</div>
      <div className="h-40 overflow-y-auto mt-2 space-y-2">
        {Array.from({length: Math.min(20, todaysReferrals)}).map((_,i)=>(
          <div key={i} className="bg-white/5 p-2 rounded-lg text-sm">User#{i+1} • 🎁 +5 XP, +50 PT</div>
        ))}
      </div>
    </div>
  </div>
}
