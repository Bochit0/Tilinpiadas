import { MAX_TEAMS, MIN_TEAMS, nextPowerOfTwo } from './bracketGenerator'

export const MAX_NAME_LENGTH = 24

/** Quita espacios sobrantes: "  Team   Liquid " → "Team Liquid". */
export const normalizeName = (name) => name.replace(/\s+/g, ' ').trim()

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

/**
 * Valida la lista de participantes antes de generar el bracket. Función pura.
 *
 * @param {Array<{ id: string, name: string }>} items
 * @returns {{
 *   count: number, size: number, byes: number,
 *   itemErrors: Record<string, 'empty' | 'duplicate'>,
 *   level: 'ok' | 'warn' | 'error',
 *   message: string, suggestion: string,
 *   canGenerate: boolean
 * }}
 */
export function analyzeRoster(items) {
  const itemErrors = {}
  const firstSeen = new Map()

  for (const item of items) {
    const name = normalizeName(item.name)
    if (!name) {
      itemErrors[item.id] = 'empty'
      continue
    }

    const key = name.toLowerCase()
    if (firstSeen.has(key)) {
      itemErrors[item.id] = 'duplicate'
      itemErrors[firstSeen.get(key)] = 'duplicate'
    } else {
      firstSeen.set(key, item.id)
    }
  }

  const count = items.length
  const size = count >= MIN_TEAMS ? nextPowerOfTwo(count) : MIN_TEAMS
  const byes = count >= MIN_TEAMS && count <= MAX_TEAMS ? size - count : 0
  const issues = Object.keys(itemErrors).length

  let level = 'ok'
  let message = `Cuadro completo de ${size} equipos, sin BYEs.`
  let suggestion = ''

  if (count < MIN_TEAMS) {
    level = 'error'
    message = `Agrega al menos ${MIN_TEAMS} participantes para armar el bracket.`
  } else if (count > MAX_TEAMS) {
    level = 'error'
    message = `El máximo es ${MAX_TEAMS} participantes (ahora hay ${count}). Quita ${count - MAX_TEAMS}.`
  } else if (issues > 0) {
    level = 'error'
    message = `Corrige ${plural(issues, 'nombre marcado', 'nombres marcados')} (vacío o repetido).`
  } else if (byes > 0) {
    level = 'warn'
    message = `${count} no es potencia de 2: se añadirán ${plural(byes, 'BYE', 'BYEs')} (pases directos) en un cuadro de ${size}. Los ${plural(byes, 'primero', 'primeros')} de la lista pasan directo.`
    suggestion = `Para un cuadro sin BYEs: agrega ${plural(byes, 'participante', 'participantes')} o quita ${count - size / 2}.`
  }

  return { count, size, byes, itemErrors, level, message, suggestion, canGenerate: level !== 'error' }
}
