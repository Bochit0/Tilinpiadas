import Panel from '../ui/Panel'
import CopyButton from '../ui/CopyButton'
import { ExternalIcon } from '../ui/icons'
import { ROUTES, absoluteUrl, withBase } from '../../utils/routes'
import { STREAM_BACKGROUNDS } from '../backgrounds'

const LINKS = [
  { id: 'stream', title: 'Vista de stream', hint: 'Pantalla completa o proyector', path: ROUTES.stream },
  {
    id: 'transparent',
    title: 'Fondo transparente',
    hint: 'Fuente de navegador en OBS',
    path: ROUTES.streamTransparent,
  },
  ...STREAM_BACKGROUNDS.map(({ key, label, hint }) => ({
    id: key,
    title: label,
    hint,
    path: `${ROUTES.stream}?bg=${key}`,
  })),
]

/** Enlaces listos para copiar con un clic: el botón confirma en verde que se copió. */
export default function StreamLinks() {
  return (
    <Panel title="Enlaces rápidos" description="Cópialos y pégalos como fuente en OBS o ábrelos en la pantalla del evento.">
      {LINKS.map(({ id, title, hint, path }) => {
        const url = absoluteUrl(path)
        return (
          <div key={id} className="flex flex-col gap-2 rounded-lg border border-edge bg-field p-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold">{title}</span>
              <span className="text-xs text-subtle">{hint}</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-md bg-panel px-3 py-2 font-mono text-xs text-subtle" title={url}>
                {url}
              </code>
              <CopyButton text={url} ariaLabel={`Copiar enlace: ${title.toLowerCase()}`} />
              <a
                href={withBase(path)}
                target="_blank"
                rel="noreferrer"
                aria-label={`Abrir ${title.toLowerCase()} en una ventana nueva`}
                className="grid size-9 shrink-0 place-items-center rounded-lg border border-edge text-subtle transition hover:bg-hover hover:text-white"
              >
                <ExternalIcon />
              </a>
            </div>
          </div>
        )
      })}
    </Panel>
  )
}
