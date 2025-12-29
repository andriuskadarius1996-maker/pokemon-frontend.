export type Avatar = { level:number; name:string; type:string; img:string };
export type Player = { nick:string; xp:number; pt:number; level:number; boosts:{ xpUntil:number; stakeUntil:number }; };

export const now = () => Date.now();
export const hours = (n:number) => n*60*60*1000;

const KEY = "poketoken_s1_state_v1";

export type State = {
  player: Player;
  inventory: { stakeCards: {name:string; rate:number; lvl:number; }[] };
  referral: { invited:number; xpFromRef:number; };
  staking: { totalRate:number };
};

export const defaultState = (): State => ({
  player: {
    nick: "Trainer",
    xp: 0,
    pt: 0,
    level: 1,
    boosts: { xpUntil: 0, stakeUntil: 0 }
  },
  inventory: { stakeCards: [] },
  referral: { invited: 0, xpFromRef: 0 },
  staking: { totalRate: 0 }
});

export function loadState(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return JSON.parse(raw);
  } catch { return defaultState(); }
}

export function saveState(s: State) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function addXP(s: State, amount:number) {
  const boosted = now() < s.player.boosts.xpUntil ? amount*2 : amount;
  s.player.xp += boosted;
  // simple level curve (just demo)
  const thresholds = [0, 100, 250, 450, 700, 1000, 1400, 1850, 2350, 2900,
    3500, 4200, 5000, 5900, 6900, 8000, 9200, 10500, 11900, 13400,
    15000, 16700, 18500, 20400, 22400, 24500, 26700, 29000, 31400, 33900];
  for (let i = thresholds.length-1; i>=0; i--) {
    if (s.player.xp >= thresholds[i]) { s.player.level = i+1; break; }
  }
}

export function addPT(s: State, amount:number) {
  s.player.pt += amount;
}

export function grantXPBoost(s: State, hoursDur=9) {
  s.player.boosts.xpUntil = now() + hours(hoursDur);
}

export function grantStakeBoost(s: State, hoursDur=9) {
  s.player.boosts.stakeUntil = now() + hours(hoursDur);
}