import { useContext } from 'react'
import { TournamentContext } from '../context/TournamentContext'

/** Acceso al estado crudo y a dispatch. Para pintar la UI usa useTournament(). */
export function useTournamentStore() {
  const ctx = useContext(TournamentContext)
  if (!ctx) {
    throw new Error('useTournamentStore debe usarse dentro de <TournamentProvider>')
  }
  return ctx
}
