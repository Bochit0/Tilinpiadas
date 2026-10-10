import { useEffect, useRef } from 'react'
import { celebrateChampion, celebrateWin } from '../utils/effects'

/**
 * Dispara los efectos de celebración cuando cambia el resultado:
 *  - aparece un nuevo ganador de partido → confeti discreto
 *  - aparece el campeón → confeti largo
 * No dispara nada al cargar la página (solo ante cambios posteriores).
 */
export function useMatchEvents({ rounds, champion }) {
  const previous = useRef(null)

  useEffect(() => {
    const winners = Object.fromEntries(
      rounds.flatMap((r) => r.matches).filter((m) => !m.hasBye).map((m) => [m.id, m.winnerId]),
    )
    const championId = champion?.id ?? null

    if (previous.current) {
      const newWinner = Object.entries(winners).some(
        ([id, winnerId]) => winnerId && winnerId !== previous.current.winners[id],
      )

      if (championId && championId !== previous.current.championId) celebrateChampion()
      else if (newWinner) celebrateWin()
    }

    previous.current = { winners, championId }
  }, [rounds, champion])
}
