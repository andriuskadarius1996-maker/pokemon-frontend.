import { barClass } from '../utils/avatars'
type Props = { phase:'spark'|'ember'|'aquado'|'legendary'|'pikachu', progress:number }
export default function ProgressBar({phase,progress}:Props){
  return <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
    <div className={`${barClass(phase)} h-full`} style={{width:`${Math.min(100,Math.max(0,progress))}%`}} />
  </div>
}