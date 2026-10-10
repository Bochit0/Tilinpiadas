/** Pestaña trapezoidal con el nombre de la fase. */
export default function StageBanner({ children }) {
  return (
    <div className="flex justify-center">
      <div className="bg-header px-14 py-2 text-xs tracking-widest uppercase [clip-path:polygon(6%_0,94%_0,100%_100%,0_100%)]">
        {children}
      </div>
    </div>
  )
}
