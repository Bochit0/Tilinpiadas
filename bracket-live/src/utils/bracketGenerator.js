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
