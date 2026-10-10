import confetti from 'canvas-confetti'

// disableForReducedMotion: respeta la preferencia del sistema de reducir animaciones.
// Colores de la marca (los del inicio) + dorado de trofeo.
const base = {
  disableForReducedMotion: true,
  colors: ['#9b4dff', '#00f2fe', '#facc15', '#ffffff', '#c9a3ff'],
}

/** Confeti discreto cuando se confirma el ganador de un partido. */
export function celebrateWin() {
  confetti({ ...base, particleCount: 70, spread: 70, origin: { y: 0.6 } })
}

/** Confeti largo desde ambos lados cuando se corona al campeón. */
export function celebrateChampion() {
  const burst = (x, angle) =>
    confetti({ ...base, particleCount: 80, spread: 70, angle, origin: { x, y: 0.7 } })

  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      burst(0, 60)
      burst(1, 120)
    }, i * 500)
  }
}
