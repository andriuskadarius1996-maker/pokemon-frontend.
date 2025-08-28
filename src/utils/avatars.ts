export type Phase='spark'|'ember'|'aquado'|'legendary'|'pikachu'
export function avatarForLevel(level:number){
  if(level>=30) return {name:'Pikachu', phase:'pikachu' as Phase}
  if(level>=21) return {name:'Mewtwo', phase:'legendary' as Phase}
  if(level>=11) return {name:'Squirtle', phase:'aquado' as Phase}
  if(level>=6) return {name:'Charmander', phase:'ember' as Phase}
  return {name:'Pichu', phase:'spark' as Phase}
}
export function phaseColor(phase:Phase){
  switch(phase){ case 'spark':return '#f5e88b'; case 'ember':return '#ff6a55'; case 'aquado':return '#7fc4ff'; case 'legendary':return '#b69cff'; case 'pikachu':return '#ffe36e' }
}
export function barClass(phase:Phase){
  return ({spark:'bar-spark',ember:'bar-ember',aquado:'bar-aquado',legendary:'bar-legendary',pikachu:'bar-pikachu'} as const)[phase]
}
export function bonusesForLevel(level:number){
  if(level>=30) return {staking:30, chest:15}
  const pct = (level-1)/28
  const staking = +(20*pct).toFixed(1)
  const chest = +(9*pct).toFixed(1)
  return {staking, chest}
}
export const stakingRatesPerHour = { Pichu:2, Charmander:3, Squirtle:4, Mewtwo:6, Pikachu:10 } as const
export const lore: Record<string,string> = {
  Pichu:"Mažas, bet energingas Pichu. Elektriniai kibirkščiai dar silpni, bet tai tik pradžia.",
  Charmander:"Ugnies tipo Pokémonas, kurio liepsna stiprėja su tavo progresu.",
  Squirtle:"Vandens tipo Pokémonas — stabilus ir ištikimas kelionės draugas.",
  Mewtwo:"Legendinis Pokémonas su galinga psichikos energija.",
  Pikachu:"Ikoniškiausias. Pasiekęs Pikachu, tu tikras čempionas."
}