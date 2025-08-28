export default function SeasonInfoView(){
  return <div className="space-y-4">
    <div className="card">
      <div className="text-2xl font-semibold">Season 1</div>
      <div className="text-sm opacity-80 mt-1">Status: Active</div>
      <div className="mt-3">
        <div className="text-sm opacity-90">Prize Pool: 100 SOL</div>
        <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
          <li>🥇 1st — 13 SOL</li>
          <li>🥈 2nd — 8 SOL</li>
          <li>🥉 3rd — 6 SOL</li>
          <li>4–80 — 0.95 SOL each</li>
        </ul>
      </div>
      <div className="text-xs opacity-70 mt-3">Results are frozen at season end; prizes are paid according to the final leaderboard snapshot.</div>
    </div>
  </div>
}
