import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import imagen1 from './carrusel/imagen1.jpeg'
import imagen2 from './carrusel/imagen2.jpeg'
import imagen3 from './carrusel/imagen3.jpeg'
import imagen4 from './carrusel/imagen4.jpeg'

/**
 * Carrusel de imágenes de fondo para /stream?bg=carousel.
 * Para sumar/cambiar imágenes: agrega el archivo a ./carrusel/ e impórtalo
 * arriba como los de ejemplo. Con la lista vacía se muestran paneles placeholder.
 */
const SLIDES = [
  { src: imagen1 },
  { src: imagen2 },
  { src: imagen3 },
  { src: imagen4 },
]

const PLACEHOLDER_SLIDES = [
  { id: 'p1', from: '#2a1f45', to: '#120c1f' },
  { id: 'p2', from: '#1f3a3a', to: '#0c1f1f' },
  { id: 'p3', from: '#3a2a1f', to: '#1f140c' },
]

const SLIDE_DURATION = 7000

export default function ImageCarouselBackground() {
  const hasRealSlides = SLIDES.length > 0
  const count = hasRealSlides ? SLIDES.length : PLACEHOLDER_SLIDES.length
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (count <= 1) return undefined
    const id = setInterval(() => setIndex((current) => (current + 1) % count), SLIDE_DURATION)
    return () => clearInterval(id)
  }, [count])

  const current = hasRealSlides ? SLIDES[index] : PLACEHOLDER_SLIDES[index]

  return (
    <div aria-hidden="true" className="fixed -z-10 inset-0 overflow-hidden bg-black">
      <AnimatePresence mode="sync">
        {hasRealSlides ? (
          <motion.img
            key={current.src}
            src={current.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          />
        ) : (
          <motion.div
            key={current.id}
            className="absolute inset-0 grid place-items-center"
            style={{ background: `linear-gradient(135deg, ${current.from}, ${current.to})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          >
            <span className="text-sm uppercase tracking-[0.3em] text-white/30">
              Agrega una imagen en /public/backgrounds/carousel
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/35" />
    </div>
  )
}
