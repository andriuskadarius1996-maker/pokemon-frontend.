export function formatHMS(ms:number){
  const total = Math.max(0, Math.floor(ms/1000))
  const h = Math.floor(total/3600).toString().padStart(2,'0')
  const m = Math.floor((total%3600)/60).toString().padStart(2,'0')
  const s = Math.floor(total%60).toString().padStart(2,'0')
  return `${h}h ${m}m ${s}s`
}