import { useTournament } from '../hooks/useTournament'
import { useMatchEvents } from '../hooks/useMatchEvents'
import Header from '../components/layout/Header'
import StageBanner from '../components/layout/StageBanner'
import Bracket from '../components/bracket/Bracket'
import ChampionBanner from '../components/bracket/ChampionBanner'

/**
 * Vista pública del bracket (la que se proyecta o captura en OBS).
 * Solo pinta: no tiene ningún control de edición.
 */
export default function BracketPage() {
  const view = useTournament()
  const { title, stage, isLive, rounds, champion, runnerUp, showChampion } = view

  useMatchEvents(view)

  return (
    <main className="flex min-h-svh flex-col">
      <Header title={title} isLive={isLive} />
      <StageBanner>{stage}</StageBanner>

      {rounds.length > 0 ? (
        <Bracket rounds={rounds} champion={champion} runnerUp={runnerUp} />
      ) : (
        <p className="m-auto px-6 text-center text-muted">
          Aún no hay equipos. Configura el torneo desde el panel de administración.
        </p>
      )}

      <ChampionBanner team={showChampion ? champion : null} runnerUp={runnerUp} />
    </main>
  )
}
