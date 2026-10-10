import LiveBadge from '../ui/LiveBadge'

/** Barra superior: título centrado y badge "en directo" a la derecha. */
export default function Header({ title, isLive = false }) {
  return (
    <header className="relative flex justify-center border-b border-line bg-header px-6 py-4">
      <h1 className="text-lg font-medium uppercase">{title}</h1>

      {isLive && (
        <div className="absolute top-1/2 right-6 -translate-y-1/2">
          <LiveBadge />
        </div>
      )}
    </header>
  )
}
