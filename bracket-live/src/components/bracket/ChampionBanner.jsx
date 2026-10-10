import { AnimatePresence, motion } from 'framer-motion'

function TrophyIcon() {
  return (
    <svg viewBox="0 0 64 64" className="size-32 text-gold" fill="currentColor" aria-hidden="true">
      <path d="M16 6h32v8h10v8c0 8-6 14-14 15-2 4-5 7-9 8v7h9v6H20v-6h9v-7c-4-1-7-4-9-8-8-1-14-7-14-15v-8h10V6Zm-4 14v2c0 4 3 7 7 8-1-3-1-6-1-10h-6Zm40 0h-6c0 4 0 7-1 10 4-1 7-4 7-8v-2Z" />
    </svg>
  )
}

const GLOW = [
  'drop-shadow(0 0 0px rgb(250 204 21 / 0))',
  'drop-shadow(0 0 28px rgb(250 204 21 / 0.8))',
  'drop-shadow(0 0 0px rgb(250 204 21 / 0))',
]

/**
 * Pantalla completa que proclama al campeón: el contenido desciende con un
 * resorte, el trofeo gira al aparecer y brilla en bucle. Se monta/desmonta con
 * animación según haya `team`. Los confeti los lanza useMatchEvents.
 * @param {{ team: { name: string, logo?: string } | null, runnerUp?: { name: string } | null }} props
 */
export default function ChampionBanner({ team, runnerUp = null }) {
  return (
    <AnimatePresence>
      {team && (
        <motion.div
          key="champion-banner"
          role="alert"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-canvas/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ y: -140, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -25 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.25 }}
            >
              <motion.div
                animate={{ filter: GLOW }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <TrophyIcon />
              </motion.div>
            </motion.div>

            <motion.p
              className="text-sm tracking-[0.4em] text-gold uppercase"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Campeón
            </motion.p>

            <motion.div
              className="flex items-center gap-5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 160, damping: 14 }}
            >
              {team.logo && (
                <img src={team.logo} alt={`Logo de ${team.name}`} className="size-24 object-contain" />
              )}
              <h2 className="text-6xl font-bold uppercase">{team.name}</h2>
            </motion.div>

            {runnerUp && (
              <motion.p
                className="text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Sub-Campeón: {runnerUp.name}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
