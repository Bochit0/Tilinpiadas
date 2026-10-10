import { cx } from '../../utils/cx'

/** Sección de la consola: título de 16px bold, descripción atenuada y borde de 1px. */
export default function Panel({ title, description, action, className, children }) {
  return (
    <section className={cx('rounded-xl border border-edge bg-panel/85 p-5 shadow-sm backdrop-blur-sm', className)}>
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold">{title}</h2>
          {description && <p className="mt-1 text-[13px] text-subtle">{description}</p>}
        </div>
        {action}
      </header>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </section>
  )
}
