import { cx } from '../../utils/cx'

// Tailwind necesita ver las clases completas en el código, por eso un mapa y no concatenación.
const TONES = {
  link: 'border-link',
  champion: 'border-link-champion',
}

/**
 * Dibuja el "corchete" que une dos tarjetas con una (merge) o una con dos (split).
 * Asume que ocupa la altura de una celda cuyas dos tarjetas están centradas
 * al 25 % y al 75 %: rama superior 25→50 %, rama inferior 50→75 %, salida al 50 %.
 *
 * @param {{ type?: 'merge' | 'split', topTone?: 'link' | 'champion', bottomTone?: 'link' | 'champion' }} props
 */
export default function Connector({ type = 'merge', topTone = 'link', bottomTone = 'link' }) {
  const isMerge = type === 'merge'
  const branchSide = isMerge ? 'left-0 border-r-2' : 'left-1/2 border-l-2'

  return (
    <div aria-hidden="true" className="relative h-full w-full">
      <span className={cx('absolute top-1/4 h-1/4 w-1/2 border-t-2', branchSide, TONES[topTone])} />
      <span
        className={cx('absolute top-1/2 h-1/4 w-1/2 border-b-2', branchSide, TONES[bottomTone])}
      />
      <span
        className={cx(
          'absolute top-1/2 w-1/2 border-t-2',
          isMerge ? 'left-1/2' : 'left-0',
          TONES[topTone],
        )}
      />
    </div>
  )
}
