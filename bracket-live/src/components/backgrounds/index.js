import ImageCarouselBackground from './ImageCarouselBackground'
import CircuitPulseBackground from './CircuitPulseBackground'
import SunCircuitBackground from './SunCircuitBackground'

/**
 * Fuente única de verdad para los fondos alternativos de /stream.
 * StreamLinks lee label/hint para armar los enlaces; App.jsx usa Component
 * para renderizar el fondo elegido según ?bg=<key>.
 */
export const STREAM_BACKGROUNDS = [
  {
    key: 'carousel',
    label: 'Fondo carrusel',
    hint: 'Imágenes del evento rotando en el fondo',
    Component: ImageCarouselBackground,
  },
  {
    key: 'circuit',
    label: 'Fondo placa madre',
    hint: 'Pulsos recorriendo los circuitos',
    Component: CircuitPulseBackground,
  },
  {
    key: 'sunburst',
    label: 'Fondo eclipse circuito',
    hint: 'Puntos que titilan al azar',
    Component: SunCircuitBackground,
  },
]

export function getStreamBackground(key) {
  return STREAM_BACKGROUNDS.find((background) => background.key === key)
}
