/**
 * Reglas puras del torneo. No dependen de React ni de datos globales.
 * Un "match" aquí ya tiene los slots con teamId resuelto.
 */

/** Devuelve el teamId ganador, o null si no terminó o hay empate. */
export function getWinner(match) {
  const [a, b] = match.slots

  if (match.status !== 'finished') return null
  if (a.score === b.score) return null

  return a.score > b.score ? a.teamId : b.teamId
}

/** Devuelve el teamId perdedor, o null si todavía no hay ganador. */
export function getLoser(match) {
  const winner = getWinner(match)

  if (!winner) return null

  return match.slots.find((s) => s.teamId !== winner).teamId
}
