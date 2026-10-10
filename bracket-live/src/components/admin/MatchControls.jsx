import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import StatusBadge from '../ui/StatusBadge'
import { CheckIcon } from '../ui/icons'
import { controlBase } from '../ui/controlStyles'
import { cx } from '../../utils/cx'
import { useTournament } from '../../hooks/useTournament'
import { useTournamentStore } from '../../hooks/useTournamentStore'
import { ACTIONS } from '../../context/tournamentReducer'

const SIZES = {
  md: { button: 'size-10 text-lg', input: 'w-14 text-base' },
  lg: { button: 'size-12 text-2xl', input: 'w-20 py-2 text-3xl' },
}

/** [−] valor [+] con botones grandes (pensado para operar desde el móvil). */
function ScoreStepper({ label, value, disabled, onChange, size = 'md' }) {
  const s = SIZES[size]
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label={`Marcador de ${label}`}>
      <Button
        className={s.button}
        disabled={disabled || value <= 0}
        onClick={() => onChange(value - 1)}
        aria-label={`Restar punto a ${label}`}
      >
        −
      </Button>
      <input
        type="number"
        min="0"
        inputMode="numeric"
        className={cx(controlBase, s.input, 'text-center font-bold tabular-nums')}
        value={value}
        disabled={disabled}
        aria-label={`Puntos de ${label}`}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button
        variant="secondary"
        className={s.button}
        disabled={disabled}
        onClick={() => onChange(value + 1)}
        aria-label={`Sumar punto a ${label}`}
      >
        +
      </Button>
    </div>
  )
}

/** Partida en juego: es lo más grande de la pantalla, con marcador editable y cierre confirmado. */
function LiveMatchCard({ match, dispatch }) {
  const [confirming, setConfirming] = useState(false)
  const [a, b] = match.teams
  const tie = a.score === b.score

  // La confirmación de cierre caduca sola a los 4 s.
  useEffect(() => {
    if (!confirming) return undefined
    const timer = setTimeout(() => setConfirming(false), 4000)
    return () => clearTimeout(timer)
  }, [confirming])

  const setScore = (slot) => (score) =>
    dispatch({ type: ACTIONS.SET_SCORE, matchId: match.id, slot, score })
  const setStatus = (status) => {
    setConfirming(false)
    dispatch({ type: ACTIONS.SET_STATUS, matchId: match.id, status })
  }

  return (
    <article
      aria-label={`Partida activa: ${a.name} contra ${b.name}`}
      className="flex flex-col gap-4 rounded-2xl border-2 border-success bg-panel p-5 shadow-lg shadow-success/10"
    >
      <header className="flex items-center justify-between">
        <Badge tone="muted" shape="tag">{match.roundLabel}</Badge>
        <StatusBadge tone="success" pulse>
          Partida activa
        </StatusBadge>
      </header>

      {[a, b].map((team, i) => (
        <div key={team.slotKey} className="flex items-center justify-between gap-4">
          <span className="min-w-0 flex-1 truncate text-xl font-bold">{team.name}</span>
          <ScoreStepper label={team.name} size="lg" value={team.score} onChange={setScore(i)} />
        </div>
      ))}

      <footer className="flex flex-wrap items-center gap-3 border-t border-edge pt-4">
        <Button
          size="lg"
          variant={confirming ? 'danger' : 'primary'}
          disabled={tie}
          onClick={() => (confirming ? setStatus('finished') : setConfirming(true))}
        >
          {confirming ? 'Confirmar cierre del partido' : 'Cerrar partido'}
        </Button>
        {tie && <span className="text-[13px] text-subtle">No se puede cerrar con empate.</span>}
        {!tie && !confirming && (
          <span className="text-[13px] text-subtle">Al cerrar, el ganador avanza a la siguiente ronda.</span>
        )}
      </footer>
    </article>
  )
}

function UpcomingRow({ match, dispatch }) {
  const [a, b] = match.teams
  return (
    <li className="flex items-center gap-3 rounded-lg border border-edge bg-panel px-4 py-3">
      <Badge tone="muted" shape="tag">{match.roundLabel}</Badge>
      <span className="min-w-0 flex-1 truncate text-sm">
        <strong className="font-semibold">{a.name}</strong> <span className="text-subtle">vs</span>{' '}
        <strong className="font-semibold">{b.name}</strong>
      </span>
      <Button
        size="sm"
        variant={match.isReady ? 'primary' : 'secondary'}
        disabled={!match.isReady}
        aria-label={`Iniciar ${a.name} contra ${b.name}`}
        onClick={() => dispatch({ type: ACTIONS.SET_STATUS, matchId: match.id, status: 'live' })}
      >
        {match.isReady ? 'Iniciar partido' : 'Esperando equipos'}
      </Button>
    </li>
  )
}

function FinishedRow({ match, dispatch }) {
  const [a, b] = match.teams
  const side = (team) =>
    cx(
      'truncate',
      team.isWinner && 'font-semibold text-success',
      team.isLoser && 'text-danger/80 line-through',
    )

  return (
    <li className="flex items-center gap-3 rounded-lg border border-edge bg-panel/60 px-4 py-2.5">
      <Badge tone="muted" shape="tag">{match.roundLabel}</Badge>
      <span className="flex min-w-0 flex-1 items-center gap-2 text-sm">
        <span className={side(a)}>{a.name}</span>
        {a.isWinner && <CheckIcon className="size-4 shrink-0 text-success" />}
        <span className="shrink-0 font-bold text-white tabular-nums">
          {a.score} – {b.score}
        </span>
        {b.isWinner && <CheckIcon className="size-4 shrink-0 text-success" />}
        <span className={side(b)}>{b.name}</span>
      </span>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => dispatch({ type: ACTIONS.SET_STATUS, matchId: match.id, status: 'live' })}
      >
        Reabrir
      </Button>
    </li>
  )
}

function Section({ title, count, children }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2 text-[13px] font-semibold tracking-wider text-subtle uppercase">
        {title}
        <Badge>{count}</Badge>
      </h3>
      {children}
    </section>
  )
}

/**
 * Control de partidas ordenado por lo que importa en directo:
 * 1) en juego (grande), 2) próximos (compactos), 3) finalizados (resumen).
 */
export default function MatchControls({ onGoToSetup }) {
  const { rounds } = useTournament()
  const { dispatch } = useTournamentStore()

  const entries = rounds.flatMap((r) => r.matches.map((m) => ({ ...m, roundLabel: r.label })))
  const playable = entries.filter((m) => !m.hasBye)
  const live = playable.filter((m) => m.isLive)
  const upcoming = playable.filter((m) => m.status === 'upcoming')
  const finished = playable.filter((m) => m.status === 'finished')
  const byes = entries.filter((m) => m.hasBye)

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-edge px-6 py-16 text-center">
        <h2 className="text-base font-bold">Todavía no hay partidos</h2>
        <p className="max-w-sm text-[13px] text-subtle">
          Agrega los participantes y genera el bracket para empezar a puntuar.
        </p>
        <Button variant="primary" onClick={onGoToSetup}>
          Ir a configuración
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <Section title="En juego" count={live.length}>
        {live.length > 0 ? (
          live.map((match) => <LiveMatchCard key={match.id} match={match} dispatch={dispatch} />)
        ) : (
          <p className="rounded-lg border border-dashed border-edge px-4 py-6 text-center text-[13px] text-subtle">
            Ninguna partida activa. Inicia una de la lista de próximos.
          </p>
        )}
      </Section>

      {upcoming.length > 0 && (
        <Section title="Próximos" count={upcoming.length}>
          <ul className="flex flex-col gap-2">
            {upcoming.map((match) => (
              <UpcomingRow key={match.id} match={match} dispatch={dispatch} />
            ))}
          </ul>
          {byes.length > 0 && (
            <p className="text-xs text-subtle">
              Pasan directo (BYE): {byes.map((m) => m.teams.find((t) => !t.isBye).name).join(', ')}.
            </p>
          )}
        </Section>
      )}

      {finished.length > 0 && (
        <Section title="Finalizados" count={finished.length}>
          <ul className="flex flex-col gap-2">
            {finished.map((match) => (
              <FinishedRow key={match.id} match={match} dispatch={dispatch} />
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}
