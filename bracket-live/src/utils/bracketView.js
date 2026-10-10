import { getWinner, getLoser } from './bracket'
import { getFormat, getRoundLabel, getTeamStandings, TOURNAMENT_FORMATS } from './bracketGenerator'

const PLACEHOLDER_TEAM = { name: 'Por definir', logo: '' }

/**
 * Convierte el estado crudo del torneo en lo que la UI necesita pintar:
 * resuelve los `from` (ganadores que avanzan), aplica los BYE, deriva
 * ganadores/perdedores y agrupa los partidos por ronda.
 * Función pura: mismo estado, misma vista.
 *
 * @param {{ tournament: {title:string, stage:string}, teams: Record<string, any>, matches: any[], showChampion?: boolean }} state
 */
export function buildBracketView({ tournament, teams, matches, showChampion = true }) {
  const format = matches[0]?.format ?? getFormat(tournament.stage)
  // Orden por ronda: así, cuando llegamos a un slot "from", ese partido ya está resuelto.
  const ordered = [...matches].sort((a, b) => a.round - b.round || a.index - b.index)
  const resolvedById = {}

  for (const match of ordered) {
    const slots = match.slots.map((slot) => ({
      ...slot,
      teamId: slot.from ? (resolvedById[slot.from]?.winnerId ?? null) : (slot.teamId ?? null),
    }))
    const hasBye = slots.some((s) => s.bye)

    // Con BYE el otro equipo avanza solo; sin BYE el ganador sale del marcador.
    const winnerId = hasBye
      ? (slots.find((s) => !s.bye).teamId ?? null)
      : getWinner({ ...match, slots })
    const loserId = hasBye ? null : getLoser({ ...match, slots })
    const status = hasBye ? 'finished' : match.status

    resolvedById[match.id] = {
      id: match.id,
      round: match.round,
      status,
      isLive: status === 'live',
      hasBye,
      isReady: slots.every((s) => s.bye || s.teamId),
      winnerId,
      loserId,
      teams: slots.map((slot, i) => {
        const slotKey = `${match.id}-${i}`

        if (slot.bye) {
          return { slotKey, name: 'BYE', logo: '', score: null, isBye: true, isWinner: false, isLoser: false }
        }

        const team = teams[slot.teamId] ?? PLACEHOLDER_TEAM
        return {
          slotKey,
          teamId: slot.teamId,
          name: team.name,
          logo: team.logo,
          score: slot.score,
          isBye: false,
          isWinner: winnerId !== null && slot.teamId === winnerId,
          isLoser: winnerId !== null && slot.teamId !== winnerId,
        }
      }),
    }
  }

  const totalRounds = ordered.length ? ordered[ordered.length - 1].round + 1 : 0

  const rounds = Array.from({ length: totalRounds }, (_, round) => ({
    id: `round-${round}`,
    label: format === 'elimination' ? getRoundLabel(round, totalRounds) : `Jornada ${round + 1}`,
    matches: ordered.filter((m) => m.round === round).map((m) => resolvedById[m.id]),
  }))

  const finalMatch = rounds.at(-1)?.matches[0]
  const standings = format === 'elimination'
    ? []
    : getTeamStandings(Object.keys(teams), ordered, true).map((standing) => ({
        ...standing,
        team: teams[standing.teamId],
      }))

  return {
    title: tournament.title,
    stage: TOURNAMENT_FORMATS[format] ?? tournament.stage,
    format,
    rounds,
    standings,
    champion: format === 'elimination' ? teams[finalMatch?.winnerId] ?? null : null,
    runnerUp: format === 'elimination' ? teams[finalMatch?.loserId] ?? null : null,
    isLive: ordered.some((m) => resolvedById[m.id].isLive),
    showChampion,
  }
}
