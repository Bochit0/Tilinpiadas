import { cx } from '../../utils/cx'

/**
 * Selector de una opción entre pocas (como botones pegados).
 * @param {{ label: string, value: string, options: Array<{ value: string, label: string }>, onChange: (value: string) => void, className?: string }} props
 */
export default function SegmentedControl({ label, value, options, onChange, className }) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cx('inline-flex rounded-lg border border-edge bg-field p-1', className)}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cx(
              'rounded-md px-3 py-1.5 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-primary',
              active ? 'bg-primary text-white shadow' : 'text-subtle hover:text-white',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
