import { cx } from '../../utils/cx'

const TONES = {
  champion: 'border-link-champion',
  runnerUp: 'border-link',
}

/**
 * Caja de resultado final. Sin `team` muestra solo la etiqueta.
 * @param {{ label: string, team?: { name: string, logo?: string } | null, tone?: 'champion' | 'runnerUp' }} props
 */
export default function ResultSlot({ label, team = null, tone = 'runnerUp' }) {
  return (
    <div
      className={cx(
        'flex min-h-14 items-center justify-center gap-2 rounded-lg border bg-canvas px-4 py-2',
        TONES[tone],
      )}
    >
      {team ? (
        <>
          {team.logo && (
            <img src={team.logo} alt={`Logo de ${team.name}`} className="size-6 object-contain" />
          )}
          <span className="font-semibold">{team.name}</span>
        </>
      ) : (
        <span className="text-base text-muted">{label}</span>
      )}
    </div>
  )
}
