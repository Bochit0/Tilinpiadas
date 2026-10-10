import { Link } from 'react-router-dom'
import StatusBadge from '../ui/StatusBadge'
import { ROUTES } from '../../utils/routes'

/**
 * Barra superior fija con el estado global del torneo, visible desde cualquier pestaña:
 * gris = sin iniciar/finalizado, azul eléctrico = en curso, verde esmeralda = partida activa.
 */
export default function ConsoleHeader({ title, status }) {
  const { tournament, live, finished, total } = status
  const finishedTournament = tournament.label === 'Finalizado'

  return (
    <header className="sticky top-0 z-30 border-b border-edge bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to={ROUTES.home}
            aria-label="Volver al inicio"
            title="Volver al inicio"
            className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-sm font-black transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            B
          </Link>
          <div className="min-w-0">
            <p className="text-[13px] leading-tight font-medium text-subtle">Bracket.live · Consola</p>
            <h1 className="truncate text-base leading-tight font-bold">{title}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2" aria-label="Estado del torneo">
          <StatusBadge tone={tournament.tone}>{tournament.label}</StatusBadge>

          {total > 0 && !finishedTournament && (
            <StatusBadge tone={live > 0 ? 'success' : 'neutral'} pulse={live > 0}>
              {live === 0 ? 'Sin partida activa' : live === 1 ? 'Partida activa' : `${live} partidas activas`}
            </StatusBadge>
          )}

          {total > 0 && (
            <span className="text-[13px] font-medium text-subtle tabular-nums">
              {finished} / {total} partidos
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
