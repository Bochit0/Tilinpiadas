import { useMemo, useState } from 'react'
import { Reorder } from 'framer-motion'
import Panel from '../ui/Panel'
import Button from '../ui/Button'
import SegmentedControl from '../ui/SegmentedControl'
import { controlClass } from '../ui/controlStyles'
import { AlertIcon, CheckIcon, InfoIcon, PlusIcon, ShuffleIcon, UploadIcon } from '../ui/icons'
import { cx } from '../../utils/cx'
import RosterItem from './RosterItem'
import { useTournamentStore } from '../../hooks/useTournamentStore'
import { ACTIONS } from '../../context/tournamentReducer'
import { MAX_TEAMS } from '../../utils/bracketGenerator'
import { parseEntrants, parseEntrantsFile, shuffle } from '../../utils/entrants'
import { MAX_NAME_LENGTH, analyzeRoster, normalizeName } from '../../utils/roster'
import { fileToLogoDataUrl } from '../../utils/image'

const SIZES = [2, 4, 8, 16]

const SEEDING = [
  { value: 'manual', label: 'Manual' },
  { value: 'random', label: 'Aleatorio' },
]

// Colores del aviso según gravedad: verde = todo bien, ámbar = BYEs, rojo = no se puede generar.
const LEVELS = {
  ok: { box: 'border-success/40 bg-success/10 text-success', Icon: CheckIcon },
  warn: { box: 'border-warn/40 bg-warn/10 text-warn', Icon: AlertIcon },
  error: { box: 'border-danger/40 bg-danger/10 text-danger', Icon: AlertIcon },
}

let lastId = 0
const makeItem = (name, logo = '') => ({ id: `p${++lastId}`, name, logo })

/**
 * Alta de participantes con lista interactiva: se añaden uno a uno o pegando/importando
 * varios, se reordenan arrastrando (seeding manual) y se validan al instante.
 * @param {{ onGenerated?: () => void }} props
 */
export default function RosterEditor({ onGenerated }) {
  const { state, dispatch } = useTournamentStore()
  const hasBracket = state.matches.length > 0

  const [items, setItems] = useState(() => Object.values(state.teams).map((t) => makeItem(t.name, t.logo)))
  const [seeding, setSeeding] = useState('manual')
  const [draft, setDraft] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [notice, setNotice] = useState('')

  const analysis = useMemo(() => analyzeRoster(items), [items])
  const { level, byes, size, count } = analysis
  const LevelIcon = LEVELS[level].Icon
  const full = items.length >= MAX_TEAMS
  const manual = seeding === 'manual'

  const touch = (updater) => {
    setItems(updater)
    setConfirming(false)
    setNotice('')
  }

  const addNames = (names) => {
    const clean = names.map(normalizeName).filter(Boolean)
    const room = MAX_TEAMS - items.length
    touch((prev) => [...prev, ...clean.slice(0, Math.max(0, room)).map(makeItem)])
    if (clean.length > room) setNotice(`Solo caben ${MAX_TEAMS}: se omitieron ${clean.length - room}.`)
  }

  const submitDraft = () => {
    if (!normalizeName(draft)) return
    addNames([draft])
    setDraft('')
  }

  const changeLogo = async (id, file) => {
    if (!file) {
      touch((prev) => prev.map((item) => (item.id === id ? { ...item, logo: '' } : item)))
      return
    }

    try {
      const logo = await fileToLogoDataUrl(file)
      touch((prev) => prev.map((item) => (item.id === id ? { ...item, logo } : item)))
    } catch {
      setNotice('No se pudo cargar el logo. Elige un archivo de imagen válido.')
    }
  }

  const importFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = '' // permite volver a elegir el mismo archivo
    if (!file) return
    try {
      addNames(parseEntrantsFile(await file.text()))
    } catch {
      setNotice('No se pudo leer el archivo.')
    }
  }

  const move = (index, delta) =>
    touch((prev) => {
      const next = [...prev]
      ;[next[index], next[index + delta]] = [next[index + delta], next[index]]
      return next
    })

  const generate = () => {
    if (hasBracket && !confirming) {
      setConfirming(true) // primer clic: pide confirmación (se pierden los resultados)
      return
    }

    // Conserva el logo de quien ya existía con el mismo nombre.
    const logoByName = new Map(Object.values(state.teams).map((t) => [t.name, t.logo]))
    const ordered = (seeding === 'random' ? shuffle(items) : items).map((item) => ({
      ...item,
      name: normalizeName(item.name),
    }))

    dispatch({
      type: ACTIONS.SET_TEAMS,
      teams: ordered.map((item, i) => ({
        id: `t${i + 1}`,
        name: item.name,
        logo: item.logo || logoByName.get(item.name) || '',
      })),
    })
    setItems(ordered) // la lista refleja el orden realmente usado
    setConfirming(false)
    setNotice('')
    onGenerated?.()
  }

  return (
    <Panel
      title="Participantes"
      description="Añade nombres, arrástralos para definir los emparejamientos (1 vs 2, 3 vs 4…) y genera el cuadro."
      action={
        <span className="text-2xl font-bold tabular-nums">
          {count}
          <span className="text-sm font-medium text-subtle"> / {MAX_TEAMS}</span>
        </span>
      }
    >
      <div className="flex gap-2">
        <input
          className={controlClass}
          value={draft}
          maxLength={MAX_NAME_LENGTH}
          disabled={full}
          placeholder={full ? `Máximo ${MAX_TEAMS} participantes` : 'Nombre del participante y Enter'}
          aria-label="Nuevo participante"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submitDraft()
            }
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData('text')
            if (/\r?\n/.test(text)) {
              e.preventDefault() // lista pegada: un participante por línea
              addNames(parseEntrants(text))
            }
          }}
        />
        <Button variant="secondary" disabled={full || !normalizeName(draft)} onClick={submitDraft}>
          <PlusIcon /> Agregar
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <SegmentedControl label="Seeding" value={seeding} options={SEEDING} onChange={setSeeding} />
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" disabled={items.length < 2} onClick={() => touch((prev) => shuffle(prev))}>
            <ShuffleIcon /> Mezclar
          </Button>
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-subtle transition hover:bg-hover hover:text-white focus-within:outline-2 focus-within:outline-primary">
            <UploadIcon /> Importar .txt / .csv
            <input type="file" accept=".txt,.csv,text/plain,text/csv" className="sr-only" onChange={importFile} />
          </label>
          <Button size="sm" variant="ghost" disabled={items.length === 0} className="hover:text-danger" onClick={() => touch(() => [])}>
            Vaciar
          </Button>
        </div>
      </div>

      {items.length > 0 ? (
        <>
          {!manual && (
            <p className="flex items-center gap-2 text-xs text-subtle">
              <InfoIcon /> El orden se sorteará al generar el bracket. Cambia a Manual para arrastrar.
            </p>
          )}
          <Reorder.Group axis="y" values={items} onReorder={(next) => touch(() => next)} className="flex flex-col gap-2">
            {items.map((item, index) => (
              <RosterItem
                key={item.id}
                item={item}
                index={index}
                total={items.length}
                hasBye={index < byes}
                error={analysis.itemErrors[item.id]}
                draggable={manual}
                onLogoChange={changeLogo}
                onRename={(id, name) => touch((prev) => prev.map((it) => (it.id === id ? { ...it, name } : it)))}
                onMove={move}
                onRemove={(id) => touch((prev) => prev.filter((it) => it.id !== id))}
              />
            ))}
          </Reorder.Group>
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-edge px-4 py-6 text-center text-sm text-subtle">
          Aún no hay participantes. Escribe un nombre arriba, pega una lista o importa un archivo.
        </p>
      )}

      {/* Contador dinámico: tamaño del cuadro y aviso de BYEs */}
      <div className={cx('rounded-lg border p-3 text-sm', LEVELS[level].box)} role="status">
        <p className="flex items-start gap-2 font-medium">
          <LevelIcon className="mt-0.5 size-4 shrink-0" />
          <span>{analysis.message}</span>
        </p>
        {analysis.suggestion && <p className="mt-1 pl-6 text-xs opacity-90">{analysis.suggestion}</p>}
        <div className="mt-3 flex items-center gap-2 pl-6 text-xs text-subtle" aria-label="Tamaño del cuadro">
          Cuadro:
          {SIZES.map((s) => (
            <span
              key={s}
              className={cx(
                'rounded-md px-2 py-0.5 font-semibold tabular-nums',
                count >= 2 && s === size ? 'bg-white/15 text-white' : 'bg-field',
              )}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {notice && (
        <p role="alert" className="text-xs font-medium text-warn">
          {notice}
        </p>
      )}

      <Button
        size="lg"
        variant={confirming ? 'danger' : 'primary'}
        className="w-full"
        disabled={!analysis.canGenerate}
        onClick={generate}
      >
        {confirming
          ? 'Confirmar: se borrarán los resultados actuales'
          : hasBracket
            ? 'Regenerar bracket'
            : 'Generar bracket'}
      </Button>
    </Panel>
  )
}
