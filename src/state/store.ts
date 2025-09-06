type State = {
  xp: number;
  pt: number;
  boosts: { xpUntil?: number; stakeUntil?: number };
  referral: { invites24h: number; lastReset: number };
  inventory: { [name: string]: { level: number } };
  daily: { lastClaimed: number; streak: number };
};

const KEY = "poketoken_state_v1";

function load(): State {
  try { const s = JSON.parse(localStorage.getItem(KEY) || ""); if (s) return s; } catch {}
  return {
    xp: 0, pt: 0,
    boosts: {},
    referral: { invites24h: 0, lastReset: 0 },
    inventory: { Sparko:{level:0}, Embero:{level:0}, Aquado:{level:0}, Legendary:{level:0}, Pikachu:{level:0} },
    daily: { lastClaimed: 0, streak: 0 },
  };
}

let state = load();
const listeners: Array<() => void> = [];

function save(){ localStorage.setItem(KEY, JSON.stringify(state)); listeners.forEach(l=>l()); }

export function useSnapshot(): State {
  // naive subscription for demo
  // not a real hook, but enough for this static demo (consumer will re-render via key bump)
  return state;
}

export function subscribe(fn: ()=>void){ listeners.push(fn); return () => {
  const i = listeners.indexOf(fn); if (i>=0) listeners.splice(i,1);
};}

export const actions = {
  addXP(v:number){ state.xp += v; save(); },
  addPT(v:number){ state.pt += v; save(); },
  buy(item:"xp"|"stake"){ const cost = item==="xp"?200:250; if (state.pt>=cost){
      state.pt -= cost;
      const hours = 9;
      const until = Date.now() + hours*60*60*1000;
      if (item==="xp") state.boosts.xpUntil = (state.boosts.xpUntil && state.boosts.xpUntil>Date.now()) ? state.boosts.xpUntil + hours*60*60*1000 : until;
      if (item==="stake") state.boosts.stakeUntil = (state.boosts.stakeUntil && state.boosts.stakeUntil>Date.now()) ? state.boosts.stakeUntil + hours*60*60*1000 : until;
      save();
    }},
  stake(name:string){ // +PT/h simulated tick (adds instantly for demo)
    const base = {Sparko:2, Embero:3, Aquado:4, Legendary:6, Pikachu:10}[name as any] || 0;
    const lvl = state.inventory[name]?.level || 0;
    const boostPct = (state.boosts.stakeUntil && state.boosts.stakeUntil > Date.now()) ? 0.02 : 0;
    const rate = (base + lvl) * (1 + boostPct);
    state.pt += Math.round(rate); save();
  },
  upgrade(name:string){ const price = 100; if (state.pt>=price){
      state.pt -= price;
      state.inventory[name].level = Math.min(3, (state.inventory[name].level||0)+1);
      save();
    }},
  invite(){ // +10 XP +50 PT, cap 500 XP/24h
    const now = Date.now();
    const last = state.referral.lastReset || 0;
    if (!last || (now - last) > 24*60*60*1000){ state.referral.lastReset = now; state.referral.invites24h = 0; }
    if (state.referral.invites24h < 50){ // 50 * 10 XP = 500 XP
      state.referral.invites24h += 1;
      state.xp += 10; state.pt += 50; save();
    }
  },
  claimDaily(){
    const now = Date.now();
    const one = 24*60*60*1000;
    if (!state.daily.lastClaimed || (now - state.daily.lastClaimed) >= one){
      state.daily.lastClaimed = now;
      state.daily.streak = Math.min(7, state.daily.streak + 1);
      // small chest: +20 PT
      state.pt += 20; save();
    }
  }
};