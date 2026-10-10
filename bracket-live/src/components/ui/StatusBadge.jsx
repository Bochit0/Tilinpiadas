import { cx } from '../../utils/cx'

// Códigos de color del estado global: esmeralda = activo, azul eléctrico = en curso, gris = neutro.
const TONES = {
  success: { box: 'border-success/40 bg-success/15 text-success', dot: 'bg-success' },
  info: { box: 'border-info/40 bg-info/15 text-info', dot: 'bg-info' },
  neutral: { box: 'border-neutral/40 bg-neutral/15 text-subtle', dot: 'bg-neutral' },
  warn: { box: 'border-warn/40 bg-warn/15 text-warn', dot: 'bg-warn' },
  danger: { box: 'border-danger/40 bg-danger/15 text-danger', dot: 'bg-danger' },
}

/**
 * Etiqueta de estado con punto de color. `pulse` hace latir el punto (algo ocurre ahora).
 * @param {{ tone?: keyof typeof TONES, pulse?: boolean, children: import('react').ReactNode }} props
 */
export default function StatusBadge({ tone = 'neutral', pulse = false, children }) {
  const { box, dot } = TONES[tone]

  return (
    <span
      className={cx(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap',
        box,
      )}
    >
      <span aria-hidden="true" className={cx('size-2 rounded-full', dot, pulse && 'animate-pulse')} />
      {children}
    </span>
  )
}
