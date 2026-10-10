/** Aspecto común de inputs, selects y textareas de la consola (sin fijar el ancho). */
export const controlBase =
  'rounded-lg border border-edge bg-field px-3 py-2 text-sm text-white placeholder:text-neutral transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'

/** Igual que controlBase pero ocupando todo el ancho disponible. */
export const controlClass = `w-full ${controlBase}`
