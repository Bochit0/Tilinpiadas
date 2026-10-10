import { useMemo } from 'react'
import { useTournamentStore } from './useTournamentStore'
import { buildBracketView } from '../utils/bracketView'

/** Vista lista para la UI: rondas, partidos resueltos, campeón y sub-campeón. */
export function useTournament() {
  const { state } = useTournamentStore()
  return useMemo(() => buildBracketView(state), [state])
}
