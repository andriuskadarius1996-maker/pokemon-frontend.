import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { xpNeededForLevel } from '../utils/xp'

type Boost = { staking:number; chest:number; expiresAt:number|null }
type Inventory = { stakingAvatars: string[] }

type State = {
  username: string
  walletConnected: boolean
  level: number
  xp: number
  tokens: number
  todaysReferrals: number
  referralXpGainedToday: number
  boost: Boost
  boostMultiplier: number
  dailyIndex: number
  lastDailyClaimDate: string | null
  streakDays: number
  inventory: Inventory
  demoRank: number
}

type Actions = {
  connectWallet(): void
  addXp(amount:number): void
  addTokens(amount:number): void
  simulateInvite(count?:number): {awardedXp:number, awardedTokens:number}
  tickBoost(now:number): void
  claimDaily(): {ok:boolean, message:string}
  openSmallChest(): string
  openLuckyChest(): string
  setDemoRank(r:number): void
  resetToLevel1(): void
}

function todayKey(){ return new Date().toISOString().slice(0,10) }

export const useGame = create<State & Actions>()(persist((set,get)=>({
  username:'AshKetchum',
  walletConnected:false,
  level:1,
  xp:0,
  tokens:0,
  todaysReferrals:0,
  referralXpGainedToday:0,
  boost:{ staking:0, chest:0, expiresAt:null },
  boostMultiplier:0,
  dailyIndex:0,
  lastDailyClaimDate:null,
  streakDays:0,
  inventory:{ stakingAvatars:['Pichu','Charmander'] },
  demoRank:80,

  connectWallet(){ set({walletConnected:true}) },

  addXp(amount:number){
    let { xp, level } = get()
    xp += amount
    while(true){
      const next = xpNeededForLevel(level+1)
      if(xp >= next){ xp -= next; level += 1 } else break
    }
    set({ xp, level })
  },
  addTokens(amount:number){ set({ tokens: get().tokens + amount }) },

  simulateInvite(count:number=1){
    const s = get()
    let canXp = Math.max(0, 200 - s.referralXpGainedToday)
    let xpAward = Math.min(canXp, 5*count)
    let tokenAward = 50*count
    set({ todaysReferrals: s.todaysReferrals + count, referralXpGainedToday: s.referralXpGainedToday + xpAward })
    if(xpAward>0) get().addXp(xpAward)
    if(tokenAward>0) get().addTokens(tokenAward)
    const now = Date.now()
    const active = s.boost.expiresAt && s.boost.expiresAt > now
    if(s.todaysReferrals + count >= 5){
      let mult = s.boostMultiplier
      if(active){
        mult = Math.min(3, mult+1)
        const newExp = (s.boost.expiresAt||now) + 24*3600*1000
        set({ boost: { staking: 2*mult, chest: 2*mult, expiresAt: newExp}, boostMultiplier: mult })
      }else{
        mult = 1
        set({ boost: { staking: 2, chest: 2, expiresAt: now + 24*3600*1000 }, boostMultiplier: 1 })
      }
    }
    return { awardedXp: xpAward, awardedTokens: tokenAward }
  },

  tickBoost(now:number){
    const b = get().boost
    if(b.expiresAt && now >= b.expiresAt){
      set({ boost:{staking:0,chest:0,expiresAt:null}, boostMultiplier:0 })
    }
  },

  claimDaily(){
    const key = todayKey()
    const { lastDailyClaimDate, dailyIndex, streakDays } = get()
    if(lastDailyClaimDate === key){ return { ok:false, message:'Jau pasiėmei šiandien.' } }
    let idx = dailyIndex
    let newStreak = streakDays
    if(!lastDailyClaimDate){ newStreak = 1 } else {
      const prev = new Date(lastDailyClaimDate); const today = new Date(key)
      const diff = (today.getTime()-prev.getTime())/(24*3600*1000)
      newStreak = (diff<=1.1)? streakDays+1 : 1
    }
    const rewards = [
      ()=>{ get().addXp(5); get().addTokens(20); return '5 XP + 20 PT' },
      ()=>{ get().addXp(10); return '10 XP' },
      ()=>{ const r = get().openSmallChest(); return 'Small Chest → '+r },
      ()=>{ get().addXp(15); return '15 XP' },
      ()=>{ get().addTokens(50); return '50 PT' },
      ()=>{ get().addXp(20); return '20 XP' },
      ()=>{ const r = get().openLuckyChest(); return 'LuckyChest → '+r },
    ]
    const rewardText = rewards[idx]()
    const newIdx = (idx+1)%7
    set({ lastDailyClaimDate: key, dailyIndex: newIdx, streakDays: newStreak })
    if(newStreak>0 && newStreak%30===0){
      const inv = get().inventory.stakingAvatars
      if(!inv.includes('Mewtwo')) set({ inventory: { stakingAvatars: inv.concat(['Mewtwo']) } })
    }
    return { ok:true, message:rewardText }
  },

  openSmallChest(){
    const choices = ['Pichu','Charmander','Tokens','XP']
    const pick = choices[Math.floor(Math.random()*choices.length)]
    if(pick==='Tokens'){ get().addTokens(30); return '30 PT' }
    if(pick==='XP'){ get().addXp(8); return '8 XP' }
    const inv = get().inventory.stakingAvatars
    if(!inv.includes(pick)){ set({ inventory: { stakingAvatars: inv.concat([pick]) } }); return pick+' avatar' }
    get().addTokens(20); return 'Duplicate → 20 PT'
  },

  openLuckyChest(){
    const level = get().level
    const roll = Math.random()
    if(roll < 0.25) return 'Frame: Bronze Glow'
    if(roll < 0.35) return 'Frame: Silver Spark'
    if(roll < 0.39) return 'Frame: Golden Flame (Epic)'
    if(roll < 0.40) return 'Frame: Thunderstrike (Legendary)'
    if(level>=11 && Math.random()<0.3){
      const options:string[] = []
      if(level>=11) options.push('Squirtle')
      if(level>=21) options.push('Mewtwo')
      if(level>=30) options.push('Pikachu')
      if(options.length){
        const pick = options[Math.floor(Math.random()*options.length)]
        const inv = get().inventory.stakingAvatars
        if(!inv.includes(pick)){ set({ inventory: { stakingAvatars: inv.concat([pick]) } }); return pick+' staking avatar' }
      }
    }
    if(Math.random()<0.5){ get().addTokens(60); return '60 PT' }
    get().addXp(25); return '25 XP'
  },

  setDemoRank(r:number){ set({ demoRank:r }) },

  resetToLevel1(){
    set({
      level:1, xp:0, tokens:0, todaysReferrals:0, referralXpGainedToday:0,
      boost:{staking:0,chest:0,expiresAt:null}, boostMultiplier:0,
      dailyIndex:0, lastDailyClaimDate:null, streakDays:0,
      inventory:{ stakingAvatars:['Pichu','Charmander'] }
    })
  }
}), { name:'poketoken_demo_v1' }))
