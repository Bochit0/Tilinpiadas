import { cx } from '../../utils/cx'

const TONES = {
  neutral: 'bg-hover text-white', // contadores
  muted: 'bg-hover text-subtle', // etiquetas de categoría (ronda)
  success: 'bg-success text-white', // aviso de actividad (partidas en juego)
  warn: 'bg-warn/15 text-warn', // advertencias suaves (pase directo)
}

const SHAPES = {
  pill: 'rounded-full',
  tag: 'rounded-md tracking-wide uppercase',
}

/**
 * Etiqueta pequeña para contadores y marcas ("1", "Pasa directo", "SEMIFINAL").
 * Distinta de StatusBadge, que es el estado global con punto de color.
 * @param {{ tone?: keyof typeof TONES, shape?: keyof typeof SHAPES, className?: string, children: import('react').ReactNode }} props
 */
export default function Badge({ tone = 'neutral', shape = 'pill', className, children }) {
  return (
    <span
      className={cx(
        'inline-flex items-center px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap tabular-nums',
        TONES[tone],
        SHAPES[shape],
        className,
      )}
    >
      {children}
    </span>
  )
}
