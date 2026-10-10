import { cx } from '../../utils/cx'

/**
 * Columna vertical que reparte sus hijos con espacio equitativo (space-around):
 * así cada tarjeta queda centrada en su "celda", alineada con los conectores sin números mágicos.
 */
export default function BracketColumn({ label, className, children }) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cx('flex min-w-0 flex-col justify-around gap-3', className)}
    >
      {children}
    </div>
  )
}
