import Panel from '../ui/Panel'
import Field from '../ui/Field'
import { controlClass } from '../ui/controlStyles'
import { useTournamentStore } from '../../hooks/useTournamentStore'
import { ACTIONS } from '../../context/tournamentReducer'

/** Textos generales que se ven en la cabecera de la vista pública. */
export default function TournamentForm() {
  const { state, dispatch } = useTournamentStore()
  const { title, stage } = state.tournament

  const setInfo = (field) => (event) =>
    dispatch({ type: ACTIONS.SET_INFO, field, value: event.target.value })

  return (
    <Panel title="Torneo" description="Estos textos aparecen en la cabecera del stream.">
      <Field label="Título">
        <input className={controlClass} value={title} onChange={setInfo('title')} />
      </Field>
      <Field label="Fase">
        <input className={controlClass} value={stage} onChange={setInfo('stage')} />
      </Field>
    </Panel>
  )
}
