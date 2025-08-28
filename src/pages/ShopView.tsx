import { useState } from 'react'
import { useGame } from '../state/store'
import Modal from '../components/Modal'
import { lore, stakingRatesPerHour } from '../utils/avatars'

type Item = { name: keyof typeof stakingRatesPerHour, rate:number, unlock:number }
const ITEMS: Item[] = [
  { name:'Pichu', rate:2, unlock:1 },
  { name:'Charmander', rate:3, unlock:6 },
  { name:'Squirtle', rate:4, unlock:11 },
  { name:'Mewtwo', rate:6, unlock:21 },
  { name:'Pikachu', rate:10, unlock:30 },
]
export default function ShopView(){
  const { level, inventory } = useGame()
  const [open, setOpen] = useState<string|null>(null)
  const owned = new Set(inventory.stakingAvatars)
  return <div className="space-y-4">
    {ITEMS.map(it=>{
      const locked = level < it.unlock
      const isOwned = owned.has(it.name)
      return <div key={it.name} className="card">
        <div className="flex items-center justify-between"><div className="text-lg font-semibold">{it.name}</div><div className="badge">{it.rate} / h</div></div>
        <div className="h-28 bg-white/5 grid place-items-center rounded-xl my-3">Pokémon Art Placeholder</div>
        <div className="flex gap-3">
          <button className="btn" disabled={!isOwned || locked}>{locked? 'Locked' : (isOwned? 'Stake' : 'Not Owned')}</button>
          <button className="btn" onClick={()=>setOpen(it.name)}>Details</button>
        </div>
        <Modal open={open===it.name} onClose={()=>setOpen(null)}>
          <div className="space-y-3">
            <div className="text-xl font-semibold">{it.name}</div>
            <div className="text-sm opacity-80">Unlock at level {it.unlock}</div>
            <div className="badge">{it.rate} / h</div>
            <div className="h-40 bg-white/5 grid place-items-center rounded-xl my-2">Animated effect (demo)</div>
            <p className="opacity-80 text-sm">{lore[it.name]}</p>
            <div className="text-right"><button className="btn" disabled={locked || !isOwned}>{locked? 'Locked' : 'Stake'}</button></div>
          </div>
        </Modal>
      </div>
    })}
  </div>
}
