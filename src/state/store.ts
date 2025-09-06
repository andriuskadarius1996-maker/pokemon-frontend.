type State = {
  xp: number; pt: number;
  boosts: { xpUntil?: number; stakeUntil?: number };
  referral: { invites24h: number; lastReset: number };
  inventory: { [k:string]: { level: number } };
  daily: { lastClaimed: number; streak: number };
};
const KEY = "poketoken_state_v1";
function load(): State {
  try { const s = JSON.parse(localStorage.getItem(KEY) || ""); if (s) return s; } catch {}
  return { xp:0, pt:0, boosts:{}, referral:{invites24h:0, lastReset:0},
    inventory:{Sparko:{level:0}, Embero:{level:0}, Aquado:{level:0}, Legendary:{level:0}, Pikachu:{level:0}},
    daily:{lastClaimed:0, streak:0} };
}
let state = load();
const listeners: Array<()=>void> = [];
function save(){ localStorage.setItem(KEY, JSON.stringify(state)); listeners.forEach(l=>l()); }
export function useSnapshot(){ return state; }
export function subscribe(fn:()=>void){ listeners.push(fn); return ()=>{ const i=listeners.indexOf(fn); if(i>=0) listeners.splice(i,1);};}
export const actions = {
  addXP(v:number){ state.xp+=v; save(); },
  addPT(v:number){ state.pt+=v; save(); },
  buy(item:"xp"|"stake"){ const cost=item==="xp"?200:250; if(state.pt>=cost){ state.pt-=cost; const hours=9; const until=Date.now()+hours*3600*1000;
      if(item==="xp") state.boosts.xpUntil = state.boosts.xpUntil && state.boosts.xpUntil>Date.now() ? state.boosts.xpUntil+hours*3600*1000 : until;
      if(item==="stake") state.boosts.stakeUntil = state.boosts.stakeUntil && state.boosts.stakeUntil>Date.now() ? state.boosts.stakeUntil+hours*3600*1000 : until;
      save(); }},
  stake(name:string){ const base:{[k:string]:number}={Sparko:2,Embero:3,Aquado:4,Legendary:6,Pikachu:10};
      const lvl=state.inventory[name]?.level||0; const boost=(state.boosts.stakeUntil && state.boosts.stakeUntil>Date.now())?0.02:0;
      const rate=(base[name]||0)+lvl; state.pt += Math.round(rate*(1+boost)); save(); },
  upgrade(name:string){ const price=100; if(state.pt>=price){ state.pt-=price; state.inventory[name].level=Math.min(3,(state.inventory[name].level||0)+1); save(); }},
  invite(){ const now=Date.now(); if(!state.referral.lastReset || now-state.referral.lastReset>24*3600*1000){ state.referral.lastReset=now; state.referral.invites24h=0; }
      if(state.referral.invites24h<50){ state.referral.invites24h++; state.xp+=10; state.pt+=50; save(); }},
  claimDaily(){ const now=Date.now(); const one=24*3600*1000; if(!state.daily.lastClaimed || now-state.daily.lastClaimed>=one){ state.daily.lastClaimed=now; state.daily.streak=Math.min(7,state.daily.streak+1); state.pt+=20; save(); }}
};