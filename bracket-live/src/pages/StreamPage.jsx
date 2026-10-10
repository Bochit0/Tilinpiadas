import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import BracketPage from './BracketPage'

/**
 * Ruta /stream — vista limpia sin controles, para OBS o pantalla completa.
 * Con ?bg=transparent el fondo de la página se vuelve transparente.
 * MotionConfig respeta "reducir movimiento" del sistema en todas las animaciones.
 */
export default function StreamPage() {
  const [params] = useSearchParams()
  const transparent = params.get('bg') === 'transparent'

  useEffect(() => {
    if (!transparent) return undefined
    document.documentElement.dataset.transparent = ''
    return () => {
      delete document.documentElement.dataset.transparent
    }
  }, [transparent])

  return (
    <MotionConfig reducedMotion="user">
      <BracketPage />
    </MotionConfig>
  )
}
