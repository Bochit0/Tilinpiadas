import {
  createNextSwissRound,
  createTournamentMatches,
  getFormat,
  getSwissRoundCount,
  isValidEntrantCount,
} from '../utils/bracketGenerator'

export const ACTIONS = {
  SET_INFO: 'SET_INFO',                       // { field: 'title' | 'stage', value }
  SET_TEAMS: 'SET_TEAMS',                     // { teams: [{ id, name, logo }] } → regenera el bracket
  UPDATE_TEAM: 'UPDATE_TEAM',                 // { id, patch: { name?, logo? } }
  SET_SCORE: 'SET_SCORE',                     // { matchId, slot: 0 | 1, score }
  SET_STATUS: 'SET_STATUS',                   // { matchId, status }
  SET_CHAMPION_BANNER: 'SET_CHAMPION_BANNER', // { visible: boolean }
  RESET: 'RESET',                             // { state } → reemplaza todo
}

const updateMatch = (state, matchId, update) => ({
  ...state,
  matches: state.matches.map((m) => (m.id === matchId ? update(m) : m)),
})

const toScore = (value) => Math.max(0, Math.trunc(Number(value)) || 0)

/** Reducer puro: (estado, acción) → nuevo estado. Nunca muta. */
export function tournamentReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_INFO:
      return {
        ...state,
        tournament: { ...state.tournament, [action.field]: action.value },
      }

    case ACTIONS.SET_TEAMS: {
      if (!isValidEntrantCount(action.teams.length)) return state
      return {
        ...state,
        teams: Object.fromEntries(action.teams.map((t) => [t.id, t])),
        matches: createTournamentMatches(action.teams.map((t) => t.id), state.tournament.stage),
        showChampion: true,
      }
    }

    case ACTIONS.UPDATE_TEAM:
      if (!state.teams[action.id]) return state
      return {
        ...state,
        teams: {
          ...state.teams,
          [action.id]: { ...state.teams[action.id], ...action.patch },
        },
      }

    case ACTIONS.SET_SCORE:
      return updateMatch(state, action.matchId, (m) => ({
        ...m,
        slots: m.slots.map((s, i) =>
          i === action.slot ? { ...s, score: toScore(action.score) } : s,
        ),
      }))

    case ACTIONS.SET_STATUS: {
      const updated = updateMatch(state, action.matchId, (m) => ({ ...m, status: action.status }))
      const match = updated.matches.find((item) => item.id === action.matchId)
      let matches = updated.matches

      if (action.status === 'finished' && (match.format ?? getFormat(state.tournament.stage)) === 'swiss') {
        const currentRound = matches.filter((item) => item.round === match.round)
        const roundComplete = currentRound.every((item) => item.status === 'finished')
        const nextRoundExists = matches.some((item) => item.round === match.round + 1)
        if (
          roundComplete &&
          !nextRoundExists &&
          match.round + 1 < getSwissRoundCount(Object.keys(state.teams).length)
        ) {
          matches = [...matches, ...createNextSwissRound(Object.keys(state.teams), matches, match.round + 1)]
        }
      }

      return {
        ...updated,
        matches,
        // Al cerrar un partido se vuelve a permitir el banner de campeón.
        showChampion: action.status === 'finished' ? true : state.showChampion,
      }
    }

    case ACTIONS.SET_CHAMPION_BANNER:
      return { ...state, showChampion: action.visible }

    case ACTIONS.RESET:
      return action.state

    default:
      return state
  }
}
