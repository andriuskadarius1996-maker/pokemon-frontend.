export function now(): number { return Date.now(); }
export function startOfDay(ts = Date.now()): number {
  const d = new Date(ts); d.setHours(0,0,0,0); return d.getTime();
}
export function daysSince(ts: number): number {
  const one = 24*60*60*1000;
  return Math.floor((Date.now() - ts)/one);
}