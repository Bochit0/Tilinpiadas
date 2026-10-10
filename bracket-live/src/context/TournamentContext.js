import { createContext } from 'react'

/** Canal de React que transporta { state, dispatch }. Se consume con useTournamentStore(). */
export const TournamentContext = createContext(null)
