import { useState } from 'react'
import Panel from '../ui/Panel'
import Button from '../ui/Button'
import { controlClass } from '../ui/controlStyles'
import { useTournamentStore } from '../../hooks/useTournamentStore'
import { ACTIONS } from '../../context/tournamentReducer'
import { MAX_NAME_LENGTH } from '../../utils/roster'
import { fileToLogoDataUrl } from '../../utils/image'

/** Identidad visual de cada equipo: nombre y logo (los cambios se ven al instante en el stream). */
export default function TeamsEditor() {
  const { state, dispatch } = useTournamentStore()
  const [error, setError] = useState('')
  const teams = Object.values(state.teams)

  if (teams.length === 0) return null

  const update = (id, patch) => dispatch({ type: ACTIONS.UPDATE_TEAM, id, patch })

  const uploadLogo = async (id, file) => {
    if (!file) return
    try {
      update(id, { logo: await fileToLogoDataUrl(file) })
      setError('')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <Panel title="Equipos" description="Sube un logo (se reduce automáticamente) o corrige un nombre sin regenerar el bracket.">
      {teams.map((team) => (
        <div key={team.id} className="flex items-center gap-2">
          <label className="relative grid size-10 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-lg border border-dashed border-edge bg-field text-[10px] font-medium text-subtle transition hover:border-primary">
            {team.logo ? (
              <img src={team.logo} alt={`Logo de ${team.name}`} className="size-full object-contain" />
            ) : (
              'Logo'
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label={`Subir logo de ${team.name}`}
              onChange={(e) => {
                uploadLogo(team.id, e.target.files?.[0])
                e.target.value = ''
              }}
            />
          </label>

          <input
            className={controlClass}
            value={team.name}
            maxLength={MAX_NAME_LENGTH}
            aria-label={`Nombre del equipo ${team.id}`}
            onChange={(e) => update(team.id, { name: e.target.value })}
          />

          {team.logo && (
            <Button size="icon" variant="ghost" aria-label={`Quitar logo de ${team.name}`} onClick={() => update(team.id, { logo: '' })}>
              ×
            </Button>
          )}
        </div>
      ))}

      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </Panel>
  )
}
