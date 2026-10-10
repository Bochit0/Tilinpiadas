/**
 * Generador de brackets de eliminación directa (con soporte de BYEs).
 *
 * Modelo de datos (plano y serializable, apto para localStorage / API):
 *   match = {
 *     id: 'r0-m1',          // r{ronda}-m{índice}
 *     round: 0,             // 0 = primera ronda ... última = final
 *     index: 1,             // posición dentro de la ronda
 *     status: 'upcoming' | 'live' | 'finished',
 *     slots: [
 *       { teamId: 'fnc', score: 0 },   // primera ronda: equipo concreto
 *       { bye: true, score: 0 },       // primera ronda: sin rival, el otro pasa directo
 *       { from: 'r0-m0', score: 0 },   // rondas siguientes: ganador de otro partido
 *     ],
 *   }
 *
 * El ganador NUNCA se guarda: se deriva (ver utils/bracketView.js).
 */

export const MIN_TEAMS = 2
export const MAX_TEAMS = 16
export const TOURNAMENT_FORMATS = {
  elimination: 'Eliminación directa',
  'round-robin': 'Round robin (fase de grupos)',
  swiss: 'Formato suizo',
}

const ROUND_LABELS_FROM_END = [
  'Final',
  'Semifinal',
  'Cuartos de final',
  'Octavos de final',
]

export const matchId = (round, index) => `r${round}-m${index}`

/** Cantidad de participantes soportada por el generador. */
export function isValidEntrantCount(count) {
  return Number.isInteger(count) && count >= MIN_TEAMS && count <= MAX_TEAMS
}

/** 5 → 8, 8 → 8, 9 → 16. Tamaño del cuadro que contiene a `count` equipos. */
export function nextPowerOfTwo(count) {
  return 2 ** Math.ceil(Math.log2(count))
}

/** Nombre de la ronda según su distancia a la final. */
export function getRoundLabel(round, totalRounds) {
  const fromEnd = totalRounds - 1 - round
  return ROUND_LABELS_FROM_END[fromEnd] ?? `Ronda ${round + 1}`
}

/**
 * Primera ronda. Si faltan equipos para completar el cuadro, los primeros de la
 * lista (mejores seeds) reciben BYE, cada uno en un partido distinto; el resto
 * se empareja en orden: 1 vs 2, 3 vs 4...
 */
function buildFirstRound(teamIds, byes) {
  const pairs = []

  for (let i = 0; i < byes; i++) {
    pairs.push([{ teamId: teamIds[i], score: 0 }, { bye: true, score: 0 }])
  }
  for (let i = byes; i < teamIds.length; i += 2) {
    pairs.push([
      { teamId: teamIds[i], score: 0 },
      { teamId: teamIds[i + 1], score: 0 },
    ])
  }

  return pairs
}

/**
 * Crea todos los partidos para una lista ordenada de teamIds (el orden es el seed).
 * @param {string[]} teamIds entre MIN_TEAMS y MAX_TEAMS
 */
export function createBracket(teamIds) {
  if (!isValidEntrantCount(teamIds.length)) {
    throw new Error(
      `Cantidad de equipos inválida (${teamIds.length}). Permitido: ${MIN_TEAMS} a ${MAX_TEAMS}.`,
    )
  }

  const size = nextPowerOfTwo(teamIds.length)
  const totalRounds = Math.log2(size)
  const firstRound = buildFirstRound(teamIds, size - teamIds.length)
  const matches = []

  for (let round = 0; round < totalRounds; round++) {
    const matchesInRound = size / 2 ** (round + 1)

    for (let index = 0; index < matchesInRound; index++) {
      const slots =
        round === 0
          ? firstRound[index]
          : [index * 2, index * 2 + 1].map((prevIndex) => ({
              from: matchId(round - 1, prevIndex),
              score: 0,
            }))

      matches.push({
        id: matchId(round, index),
        round,
        index,
        status: 'upcoming',
        slots,
      })
    }
  }

  return matches
}

export function getFormat(stage) {
  if (stage?.toLowerCase().includes('round robin')) return 'round-robin'
  if (stage?.toLowerCase().includes('suizo')) return 'swiss'
  return 'elimination'
}

export function createRoundRobin(teamIds) {
  if (!isValidEntrantCount(teamIds.length)) {
    throw new Error(`Cantidad de equipos inválida (${teamIds.length}). Permitido: ${MIN_TEAMS} a ${MAX_TEAMS}.`)
  }

  const rotation = [...teamIds]
  if (rotation.length % 2) rotation.push(null)
  const matches = []
  const rounds = rotation.length - 1
  const half = rotation.length / 2

  for (let round = 0; round < rounds; round++) {
    for (let index = 0; index < half; index++) {
      const first = rotation[index]
      const second = rotation[rotation.length - 1 - index]
      if (first && second) {
        matches.push({
          id: matchId(round, index),
          round,
          index,
          status: 'upcoming',
          slots: [{ teamId: first, score: 0 }, { teamId: second, score: 0 }],
        })
      } else {
        const teamId = first ?? second
        matches.push({
          id: matchId(round, index),
          round,
          index,
          status: 'finished',
          slots: [{ teamId, score: 0 }, { bye: true, score: 0 }],
        })
      }
    }

    rotation.splice(1, 0, rotation.pop())
  }

  return matches
}

export function getTeamStandings(teamIds, matches, awardBye = false) {
  const standings = Object.fromEntries(teamIds.map((teamId, seed) => [teamId, {
    teamId,
    seed,
    played: 0,
    wins: 0,
    losses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
    byes: 0,
  }]))

  for (const match of matches) {
    const first = match.slots.find((slot) => slot.teamId)
    const second = match.slots.filter((slot) => slot.teamId)[1]
    if (!first || !standings[first.teamId]) continue

    if (match.slots.some((slot) => slot.bye)) {
      standings[first.teamId].byes++
      if (awardBye && match.status === 'finished') standings[first.teamId].wins++
      continue
    }
    if (match.status !== 'finished' || !second || !standings[second.teamId]) continue

    const firstStats = standings[first.teamId]
    const secondStats = standings[second.teamId]
    firstStats.played++
    secondStats.played++
    firstStats.pointsFor += first.score
    firstStats.pointsAgainst += second.score
    secondStats.pointsFor += second.score
    secondStats.pointsAgainst += first.score

    if (first.score > second.score) {
      firstStats.wins++
      secondStats.losses++
    } else {
      secondStats.wins++
      firstStats.losses++
    }
  }

  return Object.values(standings).sort((a, b) =>
    b.wins - a.wins ||
    (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst) ||
    b.pointsFor - a.pointsFor ||
    a.seed - b.seed,
  )
}

function swissPairings(teamIds, matches, round) {
  const standings = getTeamStandings(teamIds, matches, true)
  const playedAgainst = new Set()
  const byeCounts = new Map(teamIds.map((teamId) => [teamId, 0]))

  for (const match of matches) {
    const participants = match.slots.filter((slot) => slot.teamId)
    if (match.slots.some((slot) => slot.bye) && participants[0]) {
      byeCounts.set(participants[0].teamId, (byeCounts.get(participants[0].teamId) ?? 0) + 1)
    }
    if (participants.length === 2) {
      playedAgainst.add([participants[0].teamId, participants[1].teamId].sort().join(':'))
    }
  }

  const ordered = [...standings]
  let byeTeam = null
  if (ordered.length % 2) {
    const minimumByes = Math.min(...ordered.map(({ teamId }) => byeCounts.get(teamId) ?? 0))
    const eligible = ordered.filter(({ teamId }) => (byeCounts.get(teamId) ?? 0) === minimumByes)
    byeTeam = eligible.at(-1).teamId
    ordered.splice(ordered.findIndex(({ teamId }) => teamId === byeTeam), 1)
  }

  const pair = (remaining) => {
    if (!remaining.length) return []
    const first = remaining[0]
    for (let index = 1; index < remaining.length; index++) {
      const second = remaining[index]
      const previous = playedAgainst.has([first.teamId, second.teamId].sort().join(':'))
      if (previous) continue
      const rest = remaining.filter((_, candidate) => candidate !== 0 && candidate !== index)
      const result = pair(rest)
      if (result) return [[first.teamId, second.teamId], ...result]
    }
    return null
  }

  const pairs = pair(ordered) ?? ordered.reduce((result, standing, index) => {
    if (index % 2 === 0) result.push([standing.teamId])
    else result.at(-1).push(standing.teamId)
    return result
  }, [])

  if (byeTeam) pairs.push([byeTeam])
  return pairs.map(([first, second], index) => ({
    id: matchId(round, index),
    round,
    index,
    status: second ? 'upcoming' : 'finished',
    slots: [
      { teamId: first, score: 0 },
      second ? { teamId: second, score: 0 } : { bye: true, score: 0 },
    ],
  }))
}

export function getSwissRoundCount(teamCount) {
  return Math.ceil(Math.log2(teamCount))
}

export function createTournamentMatches(teamIds, stage) {
  const format = getFormat(stage)
  const matches = format === 'round-robin'
    ? createRoundRobin(teamIds)
    : format === 'swiss'
      ? swissPairings(teamIds, [], 0)
      : createBracket(teamIds)
  return matches.map((match) => ({ ...match, format }))
}

export function createNextSwissRound(teamIds, matches, round) {
  return swissPairings(teamIds, matches, round).map((match) => ({ ...match, format: 'swiss' }))
}
