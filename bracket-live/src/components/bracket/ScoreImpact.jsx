import { AnimatePresence, motion } from 'framer-motion'

function getImpactAnimation(event) {
  const side = event.winnerIndex === 0 ? -1 : 1
  const loserSide = -side
  const winnerX = (distance) => `${side * distance}vw`
  const loserX = (distance) => `${loserSide * distance}vw`

  if (event.animation === 1) {
    return {
      winner: {
        initial: { x: winnerX(90), y: -40, scale: 0.35, rotate: side * 24 },
        animate: {
          x: [winnerX(90), winnerX(2), winnerX(2)],
          y: [0, -32, 0],
          scale: [0.35, 1.28, 1],
          rotate: [side * 24, side * -8, 0],
        },
        transition: { duration: 0.95, times: [0, 0.62, 1], ease: 'easeOut' },
      },
      loser: {
        initial: { x: loserX(8), rotate: 0, opacity: 1 },
        animate: {
          x: [loserX(8), loserX(14), loserX(110)],
          y: [0, -100, 260],
          rotate: [0, side * 540, side * 1300],
          opacity: [1, 1, 0],
        },
        transition: { duration: 1.1, times: [0, 0.35, 1], ease: 'easeIn' },
      },
    }
  }

  if (event.animation === 2) {
    return {
      winner: {
        initial: { x: winnerX(32), y: '65vh', scale: 0.2, rotate: side * -180, opacity: 0 },
        animate: {
          x: [winnerX(32), winnerX(8), winnerX(3)],
          y: ['65vh', '-3vh', 0],
          scale: [0.2, 1.15, 1],
          rotate: [side * -180, side * 30, 0],
          opacity: [0, 1, 1],
        },
        transition: { duration: 0.95, times: [0, 0.72, 1], ease: 'backOut' },
      },
      loser: {
        initial: { x: loserX(10), rotate: 0, opacity: 1 },
        animate: {
          x: [loserX(10), loserX(24), loserX(90)],
          y: [0, 30, 220],
          rotate: [0, side * 360, side * 900],
          opacity: [1, 1, 0],
        },
        transition: { duration: 1.05, times: [0, 0.4, 1], ease: 'easeIn' },
      },
    }
  }

  if (event.animation === 3) {
    return {
      winner: {
        initial: { x: winnerX(24), y: '-100vh', scale: 0.72, rotate: side * 18 },
        animate: {
          x: [winnerX(24), winnerX(2), winnerX(2), winnerX(2), winnerX(2)],
          y: ['-100vh', -35, 0, -14, 0],
          scale: [0.72, 1.1, 1, 1.02, 1],
          rotate: [side * 18, 0, 0, 0, 0],
        },
        transition: { duration: 1.05, times: [0, 0.68, 0.78, 0.9, 1], ease: 'easeOut' },
      },
      loser: {
        initial: { x: loserX(8), rotate: 0, opacity: 1 },
        animate: {
          x: [loserX(8), loserX(30), loserX(110)],
          y: [0, -110, 260],
          rotate: [0, side * 360, side * 900],
          opacity: [1, 1, 0],
        },
        transition: { duration: 1.1, times: [0, 0.4, 1], ease: 'easeIn' },
      },
    }
  }

  return {
    winner: {
      initial: { x: winnerX(70), scale: 0.65, rotate: 0 },
      animate: {
        x: [winnerX(70), winnerX(4), winnerX(3)],
        scale: [0.65, 1.18, 1],
        rotate: [0, side * 10, 0],
      },
      transition: { duration: 0.9, times: [0, 0.55, 0.72], ease: 'easeOut' },
    },
    loser: {
      initial: { x: loserX(12), rotate: 0, opacity: 1 },
      animate: {
        x: [loserX(12), loserX(7), loserX(125)],
        y: [0, 0, 260],
        rotate: [0, 420, 1260],
        opacity: [1, 1, 0],
      },
      transition: { duration: 1.2, times: [0, 0.55, 1], ease: 'easeIn' },
    },
  }
}

function TeamMark({ team, winner = false }) {
  const initials = team.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <div className={`flex flex-col items-center gap-2 ${winner ? 'text-white' : 'text-muted'}`}>
      <div className="grid size-[clamp(88px,13vw,160px)] place-items-center overflow-hidden rounded-2xl border-2 border-line bg-surface p-3 shadow-2xl">
        {team.logo ? (
          <img src={team.logo} alt="" className="size-full object-contain" />
        ) : (
          <span className="text-4xl font-black">{initials}</span>
        )}
      </div>
      <span className="max-w-52 rounded bg-canvas/90 px-3 py-1 text-center text-sm font-bold shadow-lg">
        {team.name}
      </span>
    </div>
  )
}

export default function ScoreImpact({ event }) {
  const animation = event ? getImpactAnimation(event) : null

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key={event.id}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[45] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 z-10 -translate-y-1/2"
            initial={animation.winner.initial}
            animate={animation.winner.animate}
            transition={animation.winner.transition}
          >
            <TeamMark team={event.winner} winner />
          </motion.div>
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-y-1/2"
            initial={animation.loser.initial}
            animate={animation.loser.animate}
            transition={animation.loser.transition}
          >
            <TeamMark team={event.loser} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}