import { motion } from 'framer-motion'
import { cx } from '../../utils/cx'

/**
 * Fila de un equipo: logo | nombre | marcador. Presentacional: no calcula nada.
 * Animaciones: el nombre entra deslizando cuando cambia (avance de fase), el
 * marcador "cae" al cambiar, la barra del ganador crece y el perdedor se
 * sacude, se desatura y se tacha.
 */
export default function TeamRow({
  logo,
  name,
  score = 0,
  isWinner = false,
  isLoser = false,
  isBye = false,
}) {
  return (
    <div
      className={cx(
        'relative grid grid-cols-[auto_1fr_auto] items-center gap-2 py-2 pr-2 pl-4',
        // Sin animación (reduced motion) el estado final se aplica igualmente.
        isLoser && 'opacity-60 grayscale motion-safe:animate-defeat',
        isBye && 'opacity-50',
      )}
    >
      {isWinner && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-1 left-0 w-[3px] origin-top rounded-sm bg-accent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {logo ? (
        <img src={logo} alt={`Logo de ${name}`} className="size-[22px] object-contain" />
      ) : (
        <span aria-hidden="true" className="size-[22px] rounded-full bg-score" />
      )}

      <motion.span
        key={name}
        className={cx('truncate text-sm font-medium', isLoser && 'line-through', isBye && 'italic')}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
      >
        {name}
      </motion.span>

      {isBye ? (
        <span aria-hidden="true" />
      ) : (
        <span
          aria-live="polite"
          className="min-w-8 overflow-hidden rounded-sm border border-line bg-score px-2 py-0.5 text-center font-bold tabular-nums"
        >
          <motion.span
            key={score}
            className="inline-block"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {score}
          </motion.span>
        </span>
      )}
    </div>
  )
}
