/** Etiqueta (13px, medium, atenuada) + control. El <label> envuelve al control: queda asociado sin ids. */
export default function Field({ label, hint, children }) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] font-medium text-subtle">
      <span>{label}</span>
      {children}
      {hint && <span className="text-xs font-normal">{hint}</span>}
    </label>
  )
}
