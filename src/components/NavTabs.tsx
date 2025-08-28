import { clsx } from 'clsx'
type Props = { active:string, setActive:(s:string)=>void }
const tabs = ['Main','Shop','Leaderboard','Referral','Season Info','Daily Check']
export default function NavTabs({active,setActive}:Props){
  return <div className="flex gap-3 flex-wrap">
    {tabs.map(t=>(<button key={t} className={clsx('tab', active===t && 'tab-active')} onClick={()=>setActive(t)}>{t}</button>))}
  </div>
}