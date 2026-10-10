import { useState } from 'react'
import SegmentedControl from '../ui/SegmentedControl'
import StatusBadge from '../ui/StatusBadge'
import { ExternalIcon } from '../ui/icons'
import { useElementWidth } from '../../hooks/useElementWidth'
import { useTournament } from '../../hooks/useTournament'
import { getTournamentStatus } from '../../utils/tournamentStatus'
import { ROUTES, withBase } from '../../utils/routes'

// Resolución real del escenario: el iframe se renderiza a este tamaño y se escala al ancho disponible.
const STAGE = { width: 1280, height: 720 }

// "Normal" muestra la vista con su fondo; las demás cargan ?bg=transparent sobre distintos fondos
// para comprobar cómo se verá en OBS antes de añadir la fuente.
const BACKGROUNDS = [
  { value: 'normal', label: 'Normal', path: ROUTES.stream },
  { value: 'dark', label: 'Oscuro', path: ROUTES.streamTransparent },
  { value: 'light', label: 'Blanco', path: ROUTES.streamTransparent },
  { value: 'checker', label: 'Ajedrez', path: ROUTES.streamTransparent },
]

const BACKDROPS = {
  normal: { backgroundColor: '#0b0914' },
  dark: { backgroundColor: '#0b0914' },
  light: { backgroundColor: '#ffffff' },
  checker: {
    backgroundColor: '#ffffff',
    backgroundImage:
      'conic-gradient(#d5dbe5 25%, transparent 0 50%, #d5dbe5 0 75%, transparent 0)',
    backgroundSize: '24px 24px',
  },
}

/**
 * Monitor de salida: muestra en vivo lo mismo que ve la audiencia (iframe de /stream),
 * escalado al ancho de la columna, con selector de fondo para probar la transparencia.
 */
export default function StreamMonitor() {
  const view = useTournament()
  const { live } = getTournamentStatus(view)
  const [background, setBackground] = useState('normal')
  const [frameRef, width] = useElementWidth()

  const current = BACKGROUNDS.find((b) => b.value === background)

  return (
    <section aria-label="Monitor de salida" className="rounded-xl border border-edge bg-panel/85 p-4 shadow-sm backdrop-blur-sm">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold">Monitor de salida</h2>
          {live > 0 ? (
            <StatusBadge tone="success" pulse>
              En vivo
            </StatusBadge>
          ) : (
            <StatusBadge tone="neutral">En espera</StatusBadge>
          )}
        </div>
        <a
          href={withBase(ROUTES.stream)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-subtle transition hover:bg-hover hover:text-white"
        >
          <ExternalIcon /> Abrir en ventana
        </a>
      </header>

      <div
        ref={frameRef}
        className="relative aspect-video w-full overflow-hidden rounded-lg border border-edge"
        style={BACKDROPS[background]}
      >
        {width > 0 && (
          <iframe
            title="Vista previa del stream"
            src={withBase(current.path)}
            tabIndex={-1}
            className="pointer-events-none absolute top-0 left-0 border-0"
            style={{
              width: STAGE.width,
              height: STAGE.height,
              transform: `scale(${width / STAGE.width})`,
              transformOrigin: 'top left',
            }}
          />
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-subtle">Fondo del visor</span>
        <SegmentedControl
          label="Fondo del visor"
          value={background}
          options={BACKGROUNDS}
          onChange={setBackground}
        />
      </div>
      <p className="mt-2 text-xs text-subtle">
        {background === 'normal'
          ? 'Vista tal cual la ve la audiencia.'
          : 'Fondo transparente (?bg=transparent): así se verá sobre tu escena de OBS.'}
      </p>
    </section>
  )
}
