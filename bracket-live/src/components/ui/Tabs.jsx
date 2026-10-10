import { cx } from '../../utils/cx'

/**
 * Pestañas accesibles (role=tablist). El contenido lo pinta quien las usa, con role="tabpanel".
 * @param {{ tabs: Array<{ id: string, label: string, badge?: import('react').ReactNode }>, value: string, onChange: (id: string) => void }} props
 */
export default function Tabs({ tabs, value, onChange }) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-edge">
      {tabs.map((tab) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cx(
              '-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-primary',
              active
                ? 'border-primary text-white'
                : 'border-transparent text-subtle hover:text-white',
            )}
          >
            {tab.label}
            {tab.badge}
          </button>
        )
      })}
    </div>
  )
}
