import MatchCard from './MatchCard'

function Standings({ standings }) {
  return (
    <section className="min-w-0">
      <h2 className="mb-3 text-lg font-bold">Posiciones</h2>
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[440px] text-left text-sm tabular-nums">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Equipo</th>
              <th className="px-2 py-2 text-center font-medium">PJ</th>
              <th className="px-2 py-2 text-center font-medium">G</th>
              <th className="px-2 py-2 text-center font-medium">P</th>
              <th className="px-2 py-2 text-center font-medium">PF</th>
              <th className="px-2 py-2 text-center font-medium">PC</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing, index) => (
              <tr key={standing.teamId} className="border-b border-line/60 last:border-0">
                <td className="px-3 py-2 font-bold text-gold">{index + 1}</td>
                <td className="max-w-48 truncate px-3 py-2 font-semibold">{standing.team?.name}</td>
                <td className="px-2 py-2 text-center">{standing.played}</td>
                <td className="px-2 py-2 text-center text-success">{standing.wins}</td>
                <td className="px-2 py-2 text-center text-muted">{standing.losses}</td>
                <td className="px-2 py-2 text-center">{standing.pointsFor}</td>
                <td className="px-2 py-2 text-center">{standing.pointsAgainst}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function LeagueStage({ rounds, standings }) {
  return (
    <section className="grid min-w-0 flex-1 gap-6 p-4 lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.5fr)] lg:p-6">
      <Standings standings={standings} />

      <section className="min-w-0">
        <h2 className="mb-3 text-lg font-bold">Jornadas</h2>
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {rounds.map((round) => (
            <section key={round.id} className="flex min-w-0 flex-col gap-2 rounded-xl border border-line bg-surface/70 p-3">
              <h3 className="text-sm font-bold text-cyan">{round.label}</h3>
              {round.matches.map((match) => (
                <MatchCard
                  key={match.id}
                  teams={match.teams}
                  isLive={match.isLive}
                />
              ))}
            </section>
          ))}
        </div>
      </section>
    </section>
  )
}