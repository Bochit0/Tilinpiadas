/**
 * Resume el estado global del torneo para las etiquetas de la consola.
 * tone: 'neutral' (gris) | 'info' (azul eléctrico) | 'success' (verde esmeralda)
 *
 * @param {{ rounds: Array<{ matches: any[] }>, champion: any }} view vista de useTournament()
 */
export function getTournamentStatus({ rounds, champion }) {
  // Los partidos con BYE no se juegan: no cuentan para el progreso.
  const playable = rounds.flatMap((r) => r.matches).filter((m) => !m.hasBye)
  const total = playable.length
  const finished = playable.filter((m) => m.status === 'finished').length
  const live = playable.filter((m) => m.isLive).length

  let tournament = { label: 'Listo para iniciar', tone: 'neutral' }
  if (total === 0) tournament = { label: 'Sin torneo', tone: 'neutral' }
  else if (champion) tournament = { label: 'Finalizado', tone: 'neutral' }
  else if (live > 0 || finished > 0) tournament = { label: 'Torneo en curso', tone: 'info' }

  return { tournament, total, finished, live }
}
