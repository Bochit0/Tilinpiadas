import { cx } from '../../utils/cx'
import LiveBadge from '../ui/LiveBadge'
import TeamRow from './TeamRow'

const VARIANTS = {
  default: 'rounded-lg bg-surface p-2',
  featured: 'rounded-xl border border-line bg-surface-featured p-4',
}

/**
 * Tarjeta de un partido (2 equipos). La variante solo cambia estilos;
 * si el partido está en vivo, pulsa con un resplandor.
 * @param {{
 *   teams: Array<{ slotKey: string, name: string, logo: string, score: number | null, isBye: boolean, isWinner: boolean, isLoser: boolean }>,
 *   isLive?: boolean,
 *   variant?: 'default' | 'featured'
 * }} props
 */
export default function MatchCard({ teams, isLive = false, variant = 'default' }) {
  return (
    <article
      className={cx(
        'flex flex-col gap-1 transition-shadow',
        VARIANTS[variant],
        isLive && 'ring-1 ring-accent motion-safe:animate-glow',
      )}
    >
      {isLive && (
        <div className="flex justify-center pb-1">
          <LiveBadge size="sm" />
        </div>
      )}

      {teams.map((team) => (
        <TeamRow
          key={team.slotKey}
          logo={team.logo}
          name={team.name}
          score={team.score}
          isWinner={team.isWinner}
          isLoser={team.isLoser}
          isBye={team.isBye}
        />
      ))}
    </article>
  )
}
