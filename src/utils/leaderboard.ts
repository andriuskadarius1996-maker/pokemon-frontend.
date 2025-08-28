export function prizeForRank(rank:number){
  if(rank===1) return 13
  if(rank===2) return 8
  if(rank===3) return 6
  if(rank>=4 && rank<=80) return 0.95
  return 0
}