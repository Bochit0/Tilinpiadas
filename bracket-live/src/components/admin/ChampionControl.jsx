import Button from '../ui/Button'
import { useTournament } from '../../hooks/useTournament'
import { useTournamentStore } from '../../hooks/useTournamentStore'
import { ACTIONS } from '../../context/tournamentReducer'

/** Aparece al coronar un campeón: permite quitar o volver a mostrar el banner en pantalla. */
export default function ChampionControl() {
  const { champion, showChampion } = useTournament()
  const { dispatch } = useTournamentStore()

  if (!champion) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/40 bg-gold/10 px-5 py-4">
      <div>
        <p className="text-[13px] font-semibold tracking-wider text-gold uppercase">Campeón</p>
        <p className="text-lg font-bold">{champion.name}</p>
      </div>
      <Button onClick={() => dispatch({ type: ACTIONS.SET_CHAMPION_BANNER, visible: !showChampion })}>
        {showChampion ? 'Ocultar banner de campeón' : 'Mostrar banner de campeón'}
      </Button>
    </div>
  )
}
