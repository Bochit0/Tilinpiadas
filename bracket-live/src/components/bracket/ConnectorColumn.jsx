import Connector from './Connector'

/**
 * Columna estrecha entre dos rondas. Contiene `count` conectores que se reparten
 * la altura a partes iguales: uno por cada partido de la ronda SIGUIENTE.
 * @param {{ count: number, type?: 'merge' | 'split', topTone?: string, bottomTone?: string }} props
 */
export default function ConnectorColumn({ count, type = 'merge', topTone, bottomTone }) {
  return (
    <div aria-hidden="true" className="flex w-16 shrink-0 flex-col">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex-1">
          <Connector type={type} topTone={topTone} bottomTone={bottomTone} />
        </div>
      ))}
    </div>
  )
}
