import { useEffect, useState } from 'react'

/**
 * Mide el ancho de un elemento y lo mantiene actualizado (ResizeObserver).
 * Uso: const [ref, width] = useElementWidth();  <div ref={ref} />
 * @returns {[(node: HTMLElement | null) => void, number]}
 */
export function useElementWidth() {
  const [node, setNode] = useState(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!node) return undefined

    setWidth(node.getBoundingClientRect().width)
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(node)

    return () => observer.disconnect()
  }, [node])

  return [setNode, width]
}
