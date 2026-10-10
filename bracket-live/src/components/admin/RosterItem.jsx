import { Reorder, useDragControls } from 'framer-motion'
import { cx } from '../../utils/cx'
import { MAX_NAME_LENGTH, normalizeName } from '../../utils/roster'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { ArrowDownIcon, ArrowUpIcon, GripIcon, TrashIcon } from '../ui/icons'

const ERRORS = {
  empty: 'El nombre no puede estar vacío.',
  duplicate: 'Nombre repetido: cada participante debe ser único.',
}

/**
 * Fila reordenable de un participante: asa de arrastre, posición (seed), nombre editable
 * y botones de subir/bajar/quitar (alternativa accesible y táctil al arrastre).
 */
export default function RosterItem({
  item,
  index,
  total,
  hasBye,
  error,
  draggable,
  onRename,
  onMove,
  onRemove,
}) {
  const controls = useDragControls()

  return (
    <Reorder.Item
      as="li"
      value={item}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.02, boxShadow: '0 12px 32px rgb(0 0 0 / 0.55)', zIndex: 10 }}
      className={cx(
        'rounded-lg border bg-field px-2 py-2 transition-colors',
        error ? 'border-danger' : 'border-edge',
      )}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!draggable}
          aria-label={`Arrastrar a ${item.name || 'participante'} para reordenar`}
          onPointerDown={(event) => draggable && controls.start(event)}
          className={cx(
            'touch-none rounded p-1 text-subtle transition',
            draggable ? 'cursor-grab hover:text-white active:cursor-grabbing' : 'opacity-30',
          )}
        >
          <GripIcon />
        </button>

        <span className="grid size-6 shrink-0 place-items-center rounded-md bg-hover text-xs font-bold text-subtle tabular-nums">
          {index + 1}
        </span>

        <input
          value={item.name}
          maxLength={MAX_NAME_LENGTH}
          aria-label={`Nombre del participante ${index + 1}`}
          aria-invalid={Boolean(error)}
          onChange={(e) => onRename(item.id, e.target.value)}
          onBlur={(e) => {
            const clean = normalizeName(e.target.value)
            if (clean !== item.name) onRename(item.id, clean)
          }}
          className="min-w-0 flex-1 bg-transparent px-1 py-1 text-sm font-medium text-white placeholder:text-neutral focus:outline-none"
          placeholder="Nombre"
        />

        {item.name.length >= MAX_NAME_LENGTH - 4 && (
          <span className="text-[11px] text-warn tabular-nums" title="Los nombres largos se cortan en pantalla">
            {item.name.length}/{MAX_NAME_LENGTH}
          </span>
        )}

        {hasBye && (
          <Badge tone="warn">Pasa directo</Badge>
        )}

        <div className="flex items-center">
          <Button size="icon" variant="ghost" className="size-7" disabled={index === 0} aria-label={`Subir a ${item.name || 'participante'}`} onClick={() => onMove(index, -1)}>
            <ArrowUpIcon />
          </Button>
          <Button size="icon" variant="ghost" className="size-7" disabled={index === total - 1} aria-label={`Bajar a ${item.name || 'participante'}`} onClick={() => onMove(index, 1)}>
            <ArrowDownIcon />
          </Button>
          <Button size="icon" variant="ghost" className="size-7 hover:text-danger" aria-label={`Quitar a ${item.name || 'participante'}`} onClick={() => onRemove(item.id)}>
            <TrashIcon />
          </Button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-1.5 pl-9 text-xs font-medium text-danger">
          {ERRORS[error]}
        </p>
      )}
    </Reorder.Item>
  )
}
