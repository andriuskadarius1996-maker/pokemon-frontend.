
import React, { useMemo, useState } from 'react'
import manifest from './assets/avatars_manifest.json'
import { Avatar, loadState, saveState, addXP, addPT, grantXPBoost, grantStakeBoost, State } from './utils'

type Tab = 'Main'|'Stake'|'Shop'|'Referral'|'Leaderboard'|'Season Info'|'Daily Check'

const tabs: Tab[] = ['Main','Stake','Shop','Referral','Leaderboard','Season Info','Daily Check']

// Preload all avatar images with Vite's glob import
const avatarImgs = {
  ...import.meta.glob('./assets/avatars_main/*.png', { eager: true, as: 'url' }),
  ...import.meta.glob('./assets/avatars_main/*.{jpg,jpeg,JPG,JPEG}', { eager: true, as: 'url' }),
} as Record<string, string>;

const typeBadge = (t:string) => ({
  electric: '⚡',
  fire: '🔥',
  water: '💧',
  legend: '🌟',
  'electric-legend': '⚡🌟'
} as any)[t] || '⭐'

function useGame() {
  const [state, setState] = useState<State>(() => loadState())
  const commit = (fn:(s:State)=>void) => setState(s => { const n = structuredClone(s); fn(n); saveState(n); return n })
  return { state, commit }
}

const SeasonHeader = ({s}:{s:State}) => (
  <div className="kpi">
    <div className="pill">Nick: <b>{s.player.nick}</b></div>
    <div className="pill">Level: <b>{s.player.level}</b></div>
    <div className="pill">XP: <b>{s.player.xp}</b></div>
    <div className="pill">PT: <b>{s.player.pt}</b></div>
  </div>
)

export default function App(){
  const [tab, setTab] = useState<Tab>('Main')
  const { state, commit } = useGame()

  const avatars: Avatar[] = useMemo(()=> manifest.levels.map((v) => {
    const base = `./assets/avatars_main/lv${String(v.level).padStart(2,'0')}`
    const png = `${base}.png`
    const jpg = `${base}.jpg`
    const jpeg = `${base}.jpeg`
    const img = avatarImgs[png] || avatarImgs[jpg] || avatarImgs[jpeg] || Object.values(avatarImgs)[0]
    return { level: v.level, name: v.name, type: v.type, img }
  }), [])

  const currentAvatar = avatars[Math.min(state.player.level-1, avatars.length-1)]

  return (
    <div className="app">
      <div className="header">
        <div className="brand">POKE TOKEN — Season 1</div>
        <div>Prize Pool: <b>100 SOL</b></div>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <div key={t} className={'tab ' + (tab===t?'active':'')} onClick={()=>setTab(t)}>{t}</div>
        ))}
      </div>

      <div className="content">
        <SeasonHeader s={state} />

        {tab==='Main' && (
          <div className="card">
            <h2>Current Avatar — LV{currentAvatar.level} {typeBadge(currentAvatar.type)} <small style={{opacity:.7}}>({currentAvatar.name})</small></h2>
            <div className="grid">
              <div className="avatar">
                <span className="badge">LV{currentAvatar.level}</span>
                <img src={currentAvatar.img} alt={currentAvatar.name} />
              </div>
              <div style={{display:'grid', gap:12}}>
                <button className="btn" onClick={()=>commit(s=>addXP(s, 120))}>Do Quest (+XP)</button>
                <button className="btn" onClick={()=>commit(s=>addPT(s, 50))}>Claim PT (+50)</button>
                <button className="btn" onClick={()=>commit(s=>{grantXPBoost(s)})}>Buy XP Boost x2/9h</button>
                <button className="btn" onClick={()=>commit(s=>{grantStakeBoost(s)})}>Buy Staking Boost +2%/9h</button>
              </div>
            </div>
          </div>
        )}

        {tab==='Stake' && (
          <div className="card">
            <h2>Staking</h2>
            <p>Stake cards earn PT/h. (Demo logic)</p>
            <table className="table">
              <thead><tr><th>Card</th><th>Rate (PT/h)</th><th>Lvl</th><th>Action</th></tr></thead>
              <tbody>
                {state.inventory.stakeCards.map((c,i)=>(
                  <tr key={i}><td>{c.name}</td><td>{c.rate}</td><td>{c.lvl}</td><td><button className="btn" onClick={()=>alert('Upgrade not implemented in demo')}>Upgrade</button></td></tr>
                ))}
              </tbody>
            </table>
            <div style={{marginTop:12}}>
              <button className="btn" onClick={()=>alert('Claiming stake rewards (demo)')}>Claim Rewards</button>
              <button className="btn" style={{marginLeft:8}} onClick={()=>commit(s=>{
                s.inventory.stakeCards.push({name:'Sparko Stake', rate:2, lvl:1})
              })}>Add Sparko Stake Card</button>
            </div>
          </div>
        )}

        {tab==='Shop' && (
          <div className="card">
            <h2>Shop</h2>
            <div className="grid">
              <div className="card">
                <h3>XP Boost x2 (9h)</h3>
                <p>Doubles XP for 9 hours. Stacks by extending time.</p>
                <button className="btn" onClick={()=>commit(s=>grantXPBoost(s))}>Buy</button>
              </div>
              <div className="card">
                <h3>Staking Boost +2% (9h)</h3>
                <p>+2% staking rate for 9 hours. Stacks by extending time.</p>
                <button className="btn" onClick={()=>commit(s=>grantStakeBoost(s))}>Buy</button>
              </div>
              <div className="card">
                <h3>Lucky Chest</h3>
                <p>Random PT / XP / frames / staking cards</p>
                <button className="btn" onClick={()=>commit(s=>{ addPT(s, 100); addXP(s, 60) })}>Open (demo)</button>
              </div>
            </div>
          </div>
        )}

        {tab==='Referral' && (
          <div className="card">
            <h2>Referral</h2>
            <p>Invite friends for rewards. Limit: 500 XP/day from referrals.</p>
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              <button className="btn" onClick={()=>commit(s=>{
                if (s.referral.xpFromRef < 500) {
                  s.referral.invited += 1
                  s.referral.xpFromRef += 10
                  addXP(s, 10)
                  addPT(s, 50)
                }
              })}>Simulate Referral (+10 XP, +50 PT)</button>
              <div className="pill">Invited: {state.referral.invited}</div>
              <div className="pill">XP today: {state.referral.xpFromRef}/500</div>
            </div>
          </div>
        )}

        {tab==='Leaderboard' && (
          <div className="card">
            <h2>Leaderboard (Demo)</h2>
            <p>Connect wallet to appear on the official leaderboard.</p>
            <table className="table">
              <thead><tr><th>#</th><th>Nick</th><th>XP</th><th>PT</th></tr></thead>
              <tbody>
                {Array.from({length:8}).map((_,i)=>(
                  <tr key={i}><td>{i+1}</td><td>Player{i+1}</td><td>{5000 - i*200}</td><td>{2000 + i*50}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab==='Season Info' && (
          <div className="card">
            <h2>Season Info</h2>
            <ul>
              <li>Prize Pool: 100 SOL</li>
              <li>Top 80 get rewards</li>
              <li>XP Boost x2/9h — stacks by extending time</li>
              <li>Referral: +10 XP & +50 PT per invite (limit 500 XP/day)</li>
            </ul>
          </div>
        )}

        {tab==='Daily Check' && (
          <div className="card">
            <h2>Daily Check</h2>
            <p>Claim your daily rewards (demo).</p>
            <button className="btn" onClick={()=>commit(s=>{ addXP(s, 20); addPT(s, 15); })}>Claim Small Chest</button>
          </div>
        )}

        <div className="footer">Demo build. Payments & fees handled server-side. UI does not show fees.</div>
      </div>
    </div>
  )
}
