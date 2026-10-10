import { useMemo } from 'react'

const WIDTH = 1920
const HEIGHT = 1080
const CENTER = { x: 640, y: 300 }
const RADIUS = 150
const RAY_COUNT = 22
const FAR = 2200

const BG = '#0a0806'
const LINE_COLOR = 'rgba(214, 122, 58, 0.5)'
const DOT_COLOR = '#e08a46'

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function buildRay(rand, angle, index) {
  const dirX = Math.cos(angle)
  const dirY = Math.sin(angle)
  const jogAt = RADIUS + 60 + rand() * 40
  const jogX = CENTER.x + dirX * jogAt
  const jogY = CENTER.y + dirY * jogAt

  // la mitad de los rayos termina el quiebre en horizontal y la otra en vertical,
  // para que se vea como trazo de circuito y no como una línea recta perfecta
  const bendHorizontal = index % 2 === 0
  const endX = bendHorizontal ? CENTER.x + dirX * FAR : jogX
  const endY = bendHorizontal ? jogY : CENTER.y + dirY * FAR

  const dots = []
  const steps = 6 + Math.floor(rand() * 3)
  for (let s = 1; s <= steps; s += 1) {
    const t = s / (steps + 1)
    dots.push({
      x: jogX + (endX - jogX) * t,
      y: jogY + (endY - jogY) * t,
      delay: rand() * 6,
      duration: 2.4 + rand() * 3.2,
    })
  }

  return {
    d: `M ${CENTER.x + dirX * RADIUS} ${CENTER.y + dirY * RADIUS} L ${jogX} ${jogY} L ${endX} ${endY}`,
    dots,
  }
}

/**
 * Fondo tipo "eclipse de circuito" para /stream?bg=sunburst: solo la silueta
 * del sol (círculo), rayos en ángulo recto y puntos que titilan de a poco,
 * cada uno con su propio retraso/duración en CSS para no animar todos a la vez.
 */
export default function SunCircuitBackground() {
  const rays = useMemo(() => {
    const rand = seededRandom(19)
    return Array.from({ length: RAY_COUNT }, (_, i) => {
      const angle = (i / RAY_COUNT) * Math.PI * 2 + rand() * 0.08
      return buildRay(rand, angle, i)
    })
  }, [])

  return (
    <div aria-hidden="true" className="fixed -z-10 inset-0 overflow-hidden" style={{ background: BG }}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        {rays.map((ray, i) => (
          <path key={`ray-${i}`} d={ray.d} fill="none" stroke={LINE_COLOR} strokeWidth={1.5} />
        ))}
        <circle cx={CENTER.x} cy={CENTER.y} r={RADIUS} fill="none" stroke="rgba(224,138,70,0.6)" strokeWidth={2} />
        <circle cx={CENTER.x} cy={CENTER.y} r={RADIUS - 18} fill="rgba(170,86,38,0.12)" />
        {rays.flatMap((ray, i) =>
          ray.dots.map((dot, d) => (
            <circle
              key={`dot-${i}-${d}`}
              cx={dot.x}
              cy={dot.y}
              r={3}
              fill={DOT_COLOR}
              className="twinkle-dot"
              style={{ animationDelay: `${dot.delay}s`, animationDuration: `${dot.duration}s` }}
            />
          )),
        )}
      </svg>
      <style>{`
        .twinkle-dot {
          opacity: 0.18;
          animation-name: twinkle;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          transform-origin: center;
          transform-box: fill-box;
        }
        @keyframes twinkle {
          0%, 82% { opacity: 0.18; transform: scale(1); }
          92% { opacity: 1; transform: scale(1.8); }
          100% { opacity: 0.18; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
