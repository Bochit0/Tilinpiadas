import { useTournament } from '../hooks/useTournament'
import { useMatchEvents } from '../hooks/useMatchEvents'
import Header from '../components/layout/Header'
import StageBanner from '../components/layout/StageBanner'
import Bracket from '../components/bracket/Bracket'
import LeagueStage from '../components/bracket/LeagueStage'
import ChampionBanner from '../components/bracket/ChampionBanner'
import ScoreImpact from '../components/bracket/ScoreImpact'
import { useScoreImpact } from '../hooks/useScoreImpact'

/**
 * Vista pública del bracket (la que se proyecta o captura en OBS).
 * Solo pinta: no tiene ningún control de edición.
 */
export default function BracketPage({ enableScoreImpact = false }) {
  const view = useTournament()
  const { title, stage, format, isLive, rounds, standings, champion, runnerUp, showChampion } = view
  const impact = useScoreImpact(rounds, enableScoreImpact)

  useMatchEvents(view)

  return (
    <main className="flex min-h-svh flex-col">
      <Header title={title} isLive={isLive} />
      <StageBanner>{stage}</StageBanner>

      {rounds.length > 0 ? (
        format === 'elimination'
          ? <Bracket rounds={rounds} champion={champion} runnerUp={runnerUp} />
          : <LeagueStage rounds={rounds} standings={standings} />
      ) : (
        <p className="m-auto px-6 text-center text-muted">
          Aún no hay equipos. Configura el torneo desde el panel de administración.
        </p>
      )}

      <ScoreImpact event={impact} />
      <ChampionBanner team={format === 'elimination' && showChampion ? champion : null} runnerUp={runnerUp} />
    </main>
  )
}
