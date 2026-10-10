import { useEffect, useState } from 'react'
import Panel from '../ui/Panel'
import Button from '../ui/Button'
import { useTournamentStore } from '../../hooks/useTournamentStore'
import { ACTIONS } from '../../context/tournamentReducer'
import { createDemoState, createEmptyState } from '../../data/tournament'

/** Acciones destructivas de la sesión: cargar la demo o empezar de cero (piden confirmación). */
export default function SessionActions() {
  const { dispatch } = useTournamentStore()
  const [pending, setPending] = useState(null) // 'demo' | 'reset' | null

  useEffect(() => {
    if (!pending) return undefined
    const timer = setTimeout(() => setPending(null), 4000)
    return () => clearTimeout(timer)
  }, [pending])

  const run = (kind, makeState) => {
    if (pending !== kind) {
      setPending(kind)
      return
    }
    dispatch({ type: ACTIONS.RESET, state: makeState() })
    setPending(null)
  }

  return (
    <Panel title="Sesión" description="Reemplaza todos los datos actuales del torneo.">
      <div className="grid grid-cols-2 gap-2">
        <Button variant={pending === 'demo' ? 'danger' : 'secondary'} onClick={() => run('demo', createDemoState)}>
          {pending === 'demo' ? 'Confirmar' : 'Cargar demo'}
        </Button>
        <Button variant={pending === 'reset' ? 'danger' : 'secondary'} onClick={() => run('reset', createEmptyState)}>
          {pending === 'reset' ? 'Confirmar' : 'Empezar de cero'}
        </Button>
      </div>
    </Panel>
  )
}
