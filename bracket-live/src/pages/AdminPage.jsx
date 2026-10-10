import { useState } from 'react'
import { useTournament } from '../hooks/useTournament'
import { useTournamentStore } from '../hooks/useTournamentStore'
import { getTournamentStatus } from '../utils/tournamentStatus'
import Tabs from '../components/ui/Tabs'
import Badge from '../components/ui/Badge'
import ConsoleHeader from '../components/admin/ConsoleHeader'
import StreamMonitor from '../components/admin/StreamMonitor'
import StreamLinks from '../components/admin/StreamLinks'
import ChampionControl from '../components/admin/ChampionControl'
import MatchControls from '../components/admin/MatchControls'
import TournamentForm from '../components/admin/TournamentForm'
import RosterEditor from '../components/admin/RosterEditor'
import TeamsEditor from '../components/admin/TeamsEditor'
import SessionActions from '../components/admin/SessionActions'

/**
 * Ruta /admin — consola del operador en dos zonas:
 *   izquierda: control (En vivo / Configuración)
 *   derecha:   Monitor de salida fijo + enlaces, siempre a la vista.
 */
export default function AdminPage() {
  const { state } = useTournamentStore()
  const view = useTournament()
  const status = getTournamentStatus(view)
  const [tab, setTab] = useState(state.matches.length > 0 ? 'live' : 'setup')

  // Cambia solo cuando cambia QUIÉN participa (demo, reinicio, otra cantidad): así la lista
  // de participantes se reinicia con la nueva, pero no pierde lo que el operador está editando.
  const rosterKey = `${Object.keys(state.teams).join(',')}:${state.matches.length}`

  const tabs = [
    {
      id: 'live',
      label: 'En vivo',
      badge:
        status.live > 0 ? <Badge tone="success">{status.live}</Badge> : null,
    },
    { id: 'setup', label: 'Configuración' },
  ]

  return (
    <div className="min-h-svh text-white">
      <ConsoleHeader title={view.title} status={status} />

      <div className="mx-auto grid max-w-[1800px] items-start motion-safe:animate-rise gap-6 p-4 lg:p-6 xl:grid-cols-[minmax(0,1fr)_clamp(440px,44vw,760px)]">
        {/* Zona de control */}
        <main className="order-2 flex min-w-0 flex-col gap-5 xl:order-1">
          <Tabs tabs={tabs} value={tab} onChange={setTab} />

          {/* Ambos paneles quedan montados: así no se pierde lo que se está escribiendo al cambiar de pestaña. */}
          <div role="tabpanel" id="panel-live" aria-labelledby="tab-live" hidden={tab !== 'live'} className="flex flex-col gap-5">
            <ChampionControl />
            <MatchControls onGoToSetup={() => setTab('setup')} />
          </div>

          <div role="tabpanel" id="panel-setup" aria-labelledby="tab-setup" hidden={tab !== 'setup'} className="flex flex-col gap-5">
            <TournamentForm />
            <RosterEditor key={rosterKey} onGenerated={() => setTab('live')} />
            <TeamsEditor />
            <SessionActions />
          </div>
        </main>

        {/* Monitor de salida: persistente (sticky) en pantallas anchas */}
        <aside className="order-1 flex min-w-0 flex-col gap-4 xl:sticky xl:top-[4.75rem] xl:order-2 xl:max-h-[calc(100svh-6rem)] xl:overflow-y-auto">
          <StreamMonitor />
          <StreamLinks />
        </aside>
      </div>
    </div>
  )
}
