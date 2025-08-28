export function xpNeededForLevel(level:number){
  const n = level - 1
  const base = 150 + 50*n + 2*n*n
  return Math.floor(base*2) // doubled curve (~50k to 30
}
export function totalXpForLevel(targetLevel:number){
  let sum=0; for(let lvl=2; lvl<=targetLevel; lvl++) sum += xpNeededForLevel(lvl); return sum
}