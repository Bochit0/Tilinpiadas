import { useEffect, useRef, useState } from 'react'

export function useScoreImpact(rounds, enabled) {
  const previous = useRef(null)
  const eventId = useRef(0)
  const [impact, setImpact] = useState(null)

  useEffect(() => {
    const matches = rounds.flatMap((round) => round.matches)
    const current = new Map(
      matches.map((match) => [
        match.id,
        { status: match.status, scores: match.teams.map((team) => team.score) },
      ]),
    )
    let nextImpact = null

    if (enabled && previous.current) {
      for (const match of matches) {
        const before = previous.current.get(match.id)
        if (!before || match.hasBye) continue

        if (match.status === 'finished' && before.status !== 'finished') {
          const winnerIndex = match.teams.findIndex((team) => team.isWinner)
          const loser = match.teams.find((team) => team.isLoser)
          if (winnerIndex !== -1 && loser) {
            nextImpact = { winner: match.teams[winnerIndex], loser, winnerIndex }
            break
          }
        }

        if (match.isLive) {
          const changedIndex = match.teams.findIndex(
            (team, index) => team.score !== before.scores[index],
          )
          if (changedIndex !== -1) {
            nextImpact = {
              winner: match.teams[changedIndex],
              loser: match.teams[1 - changedIndex],
              winnerIndex: changedIndex,
            }
            break
          }
        }
      }
    }

    previous.current = current
    if (nextImpact) {
      const id = ++eventId.current
      setImpact({ ...nextImpact, id, animation: (id - 1) % 4 })
    }
  }, [enabled, rounds])

  useEffect(() => {
    if (!impact) return undefined
    const timeout = setTimeout(() => setImpact(null), 1400)
    return () => clearTimeout(timeout)
  }, [impact])

  return impact
}