import { useMemo } from 'react'
import { useGame } from '../state/store'
import { prizeForRank } from '../utils/leaderboard'

type Row = { name:string, xp:number, tokens:number }
function makeRows(count:number): Row[] { const rows: Row[] = []; for(let i=0;i<count;i++){ rows.push({ name:`Player_${(i+1).toString().padStart(3,'0')}`, xp: 10000 - i*57, tokens: 5000 - i*31 }) } return rows }
export default function LeaderboardView(){
  const { username, walletConnected, demoRank } = useGame()
  const rows = useMemo(()=> makeRows(80),[])
  const myRank = walletConnected ? demoRank : null
  let display = rows
  if(myRank && myRank<=80){ display = [...rows]; display[myRank-1] = { name: username, xp: rows[myRank-1].xp, tokens: rows[myRank-1].tokens } }
  return <div className="space-y-3">
    {!walletConnected && <div className="card text-sm opacity-80">Connect Wallet to appear on the Leaderboard.</div>}
    <div className="card">
      <div className="grid grid-cols-5 gap-2 text-xs opacity-70 pb-2 border-b border-white/10"><div>Rank</div><div>Name</div><div>XP</div><div>PokeToken</div><div>Prize (SOL)</div></div>
      <div className="divide-y divide-white/10">
        {display.map((r,idx)=>(
          <div key={idx} className="grid grid-cols-5 gap-2 py-2">
            <div>#{idx+1}</div><div>{r.name}</div><div>{r.xp.toLocaleString()}</div><div>{r.tokens.toLocaleString()}</div><div>{prizeForRank(idx+1).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
    <div className="card">
      <div className="text-sm">
        {walletConnected ? ( myRank && myRank<=80 ? (<div>Your Rank: #{myRank} • Prize: {prizeForRank(myRank).toFixed(2)} SOL</div>) : (<div>Your Rank: 80+</div>) ) : (<div>Your Rank: — (connect wallet)</div>)}
      </div>
    </div>
  </div>
}
