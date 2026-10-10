import { useMemo } from 'react'

const WIDTH = 1920
const HEIGHT = 1080
const GRID = 64

const BG = '#b7c9b0'
const TRACE_SOFT = '#7c8e74'
const TRACE_LANE = '#51623f'
const CHIP = '#3a4a38'
const PULSE = '#f3ffe9'

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function snap(value, grid) {
  return Math.round(value / grid) * grid
}

function buildTrace(rand) {
  const x0 = snap(rand() * WIDTH, GRID)
  const y0 = snap(rand() * HEIGHT, GRID)
  const midX = snap(rand() * WIDTH, GRID)
  const midY = snap(rand() * HEIGHT, GRID)
  const x1 = snap(rand() * WIDTH, GRID)
  const y1 = snap(rand() * HEIGHT, GRID)
  return `M ${x0} ${y0} L ${midX} ${y0} L ${midX} ${midY} L ${x1} ${midY} L ${x1} ${y1}`
}

/**
 * Fondo tipo placa madre para /stream?bg=circuit: trazos en ángulo recto generados
 * una sola vez (semilla fija) y tres pulsos que las recorren sin parar.
 */
export default function CircuitPulseBackground() {
  const { traces, chips, lanes } = useMemo(() => {
    const rand = seededRandom(7)
    const traces = Array.from({ length: 34 }, () => buildTrace(rand))
    const chips = Array.from({ length: 10 }, () => ({
      x: snap(rand() * WIDTH, GRID),
      y: snap(rand() * HEIGHT, GRID),
    }))
    const laneIndexes = [4, 15, 27]
    const lanes = laneIndexes.map((traceIndex, i) => ({
      d: traces[traceIndex],
      delay: i * 2.6,
      duration: 7 + i * 2,
    }))
    return { traces, chips, lanes }
  }, [])

  return (
    <div aria-hidden="true" className="fixed -z-10 inset-0 overflow-hidden">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <rect width={WIDTH} height={HEIGHT} fill={BG} />
        {traces.map((d, i) => (
          <path key={`trace-${i}`} d={d} fill="none" stroke={TRACE_SOFT} strokeWidth={2} opacity={0.55} />
        ))}
        {chips.map((chip, i) => (
          <rect
            key={`chip-${i}`}
            x={chip.x - 14}
            y={chip.y - 14}
            width={28}
            height={28}
            rx={3}
            fill={CHIP}
            opacity={0.45}
          />
        ))}
        {lanes.map((lane, i) => (
          <path key={`lane-${i}`} d={lane.d} fill="none" stroke={TRACE_LANE} strokeWidth={3} opacity={0.85} />
        ))}
        {lanes.map((lane, i) => (
          <circle key={`pulse-${i}`} r={7} fill={PULSE} className="circuit-pulse">
            <animateMotion dur={`${lane.duration}s`} begin={`${lane.delay}s`} repeatCount="indefinite" path={lane.d} />
          </circle>
        ))}
      </svg>
      <style>{`.circuit-pulse { filter: drop-shadow(0 0 6px ${PULSE}) drop-shadow(0 0 14px ${PULSE}); }`}</style>
    </div>
  )
}
