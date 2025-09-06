import { useEffect, useMemo, useReducer } from "react";
import { getTelegram } from "./telegram";
import { useSnapshot, actions } from "./state/store";
import AvatarAnimated from "./components/AvatarAnimated";
import StakeCard from "./components/StakeCard";

type Tab = "Main" | "Stake" | "Shop" | "Referral" | "Leaderboard" | "Season" | "Daily";
const avatarPaths = Array.from({length:30}, (_,i)=> `./assets/avatars_main/lv${String(i+1).padStart(2,"0")}.png`);
const avatars = avatarPaths.map(p => new URL(p, import.meta.url).href);

function Tabs({tab, setTab}:{tab:Tab; setTab:(t:Tab)=>void}){
  const names:Tab[] = ["Main","Stake","Shop","Referral","Leaderboard","Season","Daily"];
  return (<div className="flex gap-2 flex-wrap">{names.map(n=>(<button key={n} className={`tab ${tab===n?'tab-active':''}`} onClick={()=>setTab(n)}>{n}</button>))}</div>);
}

function Header(){
  const s = useSnapshot();
  const [, force] = useReducer(x=>x+1,0);
  useEffect(()=>{ const id=setInterval(()=>force(),1000); return ()=>clearInterval(id); },[]);
  const xpActive = !!(s.boosts.xpUntil && s.boosts.xpUntil > Date.now());
  const stakeActive = !!(s.boosts.stakeUntil && s.boosts.stakeUntil > Date.now());
  const xpLeft = xpActive ? Math.max(0, Math.floor((s.boosts.xpUntil! - Date.now())/1000)) : 0;
  const stLeft = stakeActive ? Math.max(0, Math.floor((s.boosts.stakeUntil! - Date.now())/1000)) : 0;
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h1 className="title">POKE TOKEN — Season 1</h1>
        <div className="flex gap-3 items-center">
          {xpActive && <span className="badge">XP x2 {xpLeft}s</span>}
          {stakeActive && <span className="badge">Stake +2% {stLeft}s</span>}
          <span className="badge">XP: {s.xp}</span>
          <span className="badge">PT: {s.pt}</span>
        </div>
      </div>
    </div>
  );
}

function MainTab(){
  return (
    <div className="card mt-4">
      <div className="title">Avatars (preview)</div>
      <div className="grid grid-cols-6 gap-4 mt-6">
        {avatars.map((src,i)=>(<AvatarAnimated key={i} src={src} label={`lv${String(i+1).padStart(2,"0")}`} />))}
      </div>
    </div>
  );
}

function StakeTab(){
  const names = ["Sparko","Embero","Aquado","Legendary","Pikachu"] as const;
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-4">
      {names.map(n=> (<StakeCard key={n} name={n}/>))}
    </div>
  );
}

function ShopTab(){
  return (
    <div className="grid md:grid-cols-3 gap-4 mt-4">
      <div className="card"><div className="title">XP Boost x2 (9h)</div><p className="opacity-80 mt-2">Price: 200 PT</p><button className="mt-4 px-4 py-2 rounded-xl bg-white text-black" onClick={()=>actions.buy("xp")}>Buy</button></div>
      <div className="card"><div className="title">Stake Boost +2% (9h)</div><p className="opacity-80 mt-2">Price: 250 PT</p><button className="mt-4 px-4 py-2 rounded-xl bg-white text-black" onClick={()=>actions.buy("stake")}>Buy</button></div>
      <div className="card"><div className="title">Small Chest</div><p className="opacity-80 mt-2">Drops: PT/XP</p><button className="mt-4 px-4 py-2 rounded-xl bg-white text-black" onClick={()=>{ actions.addPT(50); actions.addXP(20); }}>Open</button></div>
    </div>
  );
}

function ReferralTab(){
  const s = useSnapshot();
  return (
    <div className="card mt-4">
      <div className="title">Referral</div>
      <p className="opacity-80 mt-2">+10 XP & +50 PT per invite (limit 500 XP / 24h).</p>
      <div className="mt-4 flex gap-2">
        <input className="px-3 py-2 rounded-xl bg-neutral-800/60 border border-white/10 w-full" readOnly value="https://t.me/yourbot?start=ref_XXXX"/>
        <button className="px-4 py-2 rounded-xl bg-white text-black" onClick={()=>actions.invite()}>Simulate Invite</button>
      </div>
      <p className="opacity-70 text-sm mt-2">Invites today: {s.referral.invites24h}/50</p>
    </div>
  );
}

function LeaderboardTab(){
  const rows = Array.from({length:10},(_,i)=>({
    nick:`Player${i+1}`, xp:(10-i)*1000, pt:(10-i)*200, prize: i<3? ["13 SOL","8 SOL","6 SOL"][i]:"0.95 SOL"
  }));
  return (
    <div className="card mt-4">
      <div className="title">Leaderboard (Top 10)</div>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full text-sm">
          <thead className="opacity-70"><tr><th className="text-left p-2">#</th><th className="text-left p-2">Nick</th><th className="text-left p-2">XP</th><th className="text-left p-2">PT</th><th className="text-left p-2">Prize</th></tr></thead>
          <tbody>{rows.map((r,i)=>(<tr key={i} className="border-t border-white/10"><td className="p-2">{i+1}</td><td className="p-2">{r.nick}</td><td className="p-2">{r.xp}</td><td className="p-2">{r.pt}</td><td className="p-2">{r.prize}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

function SeasonTab(){
  return (
    <div className="card mt-4">
      <div className="title">Season Info</div>
      <ul className="list-disc ml-6 mt-3 space-y-1 opacity-90">
        <li>Prize pool: 100 SOL (1st: 13, 2nd: 8, 3rd: 6, 4–80th: 0.95)</li>
        <li>Avatars: 30 levels with glow effects</li>
        <li>Referral XP limit: 500 per 24h</li>
        <li>XP Boost: x2 for 9h (stackable)</li>
      </ul>
    </div>
  );
}

function DailyTab(){
  return (
    <div className="card mt-4">
      <div className="title">Daily Check</div>
      <p className="opacity-80 mt-2">7-day cycle with small chest drops.</p>
      <button className="mt-4 px-4 py-2 rounded-xl bg-white text-black" onClick={()=>actions.claimDaily()}>Claim Today</button>
    </div>
  );
}

export default function App(){
  const [tab, setTab] = useReducer((_:Tab, t:Tab)=>t, "Main" as Tab);
  const isTG = useMemo(()=>!!getTelegram(),[]);
  useEffect(()=>{ try{ getTelegram()?.ready?.(); }catch{} },[]);
  return (
    <div className="p-6 space-y-4">
      <Header />
      <div><Tabs tab={tab as Tab} setTab={(t)=>setTab(t as Tab)} /></div>
      {tab==="Main" && <MainTab/>}
      {tab==="Stake" && <StakeTab/>}
      {tab==="Shop" && <ShopTab/>}
      {tab==="Referral" && <ReferralTab/>}
      {tab==="Leaderboard" && <LeaderboardTab/>}
      {tab==="Season" && <SeasonTab/>}
      {tab==="Daily" && <DailyTab/>}
    </div>
  );
}