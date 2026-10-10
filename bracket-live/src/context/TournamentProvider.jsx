import { useCallback, useEffect, useMemo, useRef } from 'react'
import { TournamentContext } from './TournamentContext'
import { tournamentReducer } from './tournamentReducer'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useBroadcast } from '../hooks/useBroadcast'
import { createEmptyState } from '../data/tournament'

const STORAGE_KEY = 'bracket-live:tournament:v2'
const CHANNEL = 'bracket-live:sync'

/**
 * Cerebro de datos del torneo: estado + acciones + persistencia + sincronización.
 *  - localStorage: sobrevive a recargas.
 *  - BroadcastChannel: lo que se edita en /admin aparece al instante en /stream.
 */
export default function TournamentProvider({ children }) {
  const [state, setState] = useLocalStorage(STORAGE_KEY, createEmptyState)

  // Referencia al último estado, para calcular el siguiente sin depender del render.
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  // Estado que llega desde otra pestaña: se adopta tal cual (sin volver a emitirlo).
  const post = useBroadcast(CHANNEL, setState)

  const dispatch = useCallback(
    (action) => {
      const next = tournamentReducer(stateRef.current, action)
      stateRef.current = next
      setState(next)
      post(next)
    },
    [setState, post],
  )

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>
}
