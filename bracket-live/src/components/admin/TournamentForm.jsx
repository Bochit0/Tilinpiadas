import Panel from '../ui/Panel'
import Field from '../ui/Field'
import { controlClass } from '../ui/controlStyles'
import { useTournamentStore } from '../../hooks/useTournamentStore'
import { ACTIONS } from '../../context/tournamentReducer'
import { getFormat, TOURNAMENT_FORMATS } from '../../utils/bracketGenerator'

/** Textos generales que se ven en la cabecera de la vista pública. */
export default function TournamentForm() {
  const { state, dispatch } = useTournamentStore()
  const { title, stage } = state.tournament

  const setInfo = (field) => (event) =>
    dispatch({ type: ACTIONS.SET_INFO, field, value: event.target.value })

  return (
    <Panel title="Torneo" description="El formato se aplica al generar o regenerar el calendario.">
      <Field label="Título">
        <input className={controlClass} value={title} onChange={setInfo('title')} />
      </Field>
      <Field label="Formato del torneo">
        <select
          className={controlClass}
          value={getFormat(stage)}
          onChange={(event) => dispatch({
            type: ACTIONS.SET_INFO,
            field: 'stage',
            value: TOURNAMENT_FORMATS[event.target.value],
          })}
        >
          {Object.entries(TOURNAMENT_FORMATS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
    </Panel>
  )
}
