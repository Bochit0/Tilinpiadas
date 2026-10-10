import { cx } from '../../utils/cx'

const SIZES = {
  md: 'rounded-full border border-line bg-score px-4 py-1 text-[11px]',
  sm: 'text-[9px] text-muted',
}

/**
 * Indicador "en directo" con punto rojo pulsante.
 * @param {{ label?: string, size?: 'md' | 'sm', className?: string }} props
 */
export default function LiveBadge({ label = 'EN DIRECTO', size = 'md', className }) {
  return (
    <span
      role="status"
      className={cx(
        'inline-flex items-center gap-2 font-semibold tracking-wider',
        SIZES[size],
        className,
      )}
    >
      <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-live" />
      {label}
    </span>
  )
}
