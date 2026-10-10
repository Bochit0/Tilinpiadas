import { createBracket } from '../utils/bracketGenerator'

/** Torneo vacío: punto de partida; el operador lo personaliza todo desde /admin. */
export function createEmptyState() {
  return {
    tournament: { title: 'Nuevo torneo', stage: 'Eliminación Directa' },
    teams: {},
    matches: [],
    showChampion: true, // el banner de campeón se muestra al terminar la final
  }
}

/** Torneo de demostración (el de la maqueta). Útil para probar la UI. */
export function createDemoState() {
  const teams = {
    fnc: { id: 'fnc', name: 'Fanatic', logo: '' },
    t1: { id: 't1', name: 'T1', logo: '' },
    tl: { id: 'tl', name: 'Team Liquid', logo: '' },
    tsp: { id: 'tsp', name: 'Top Sports', logo: '' },
  }

  // Resultados de ejemplo por id de partido: marcador de cada slot + estado.
  const results = {
    'r0-m0': { status: 'finished', scores: [0, 3] },
    'r0-m1': { status: 'finished', scores: [2, 3] },
    'r1-m0': { status: 'live', scores: [0, 0] },
  }

  const matches = createBracket(Object.keys(teams)).map((match) => {
    const result = results[match.id]
    if (!result) return match
    return {
      ...match,
      status: result.status,
      slots: match.slots.map((slot, i) => ({ ...slot, score: result.scores[i] })),
    }
  })

  return {
    tournament: { title: 'Torneo Comunitario - Finales', stage: 'Eliminación Directa' },
    teams,
    matches,
    showChampion: true,
  }
}
