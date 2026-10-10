/**
 * Copia texto al portapapeles. Usa la API moderna y, si no está disponible
 * (p. ej. abriendo la consola por http en la red local), el método clásico.
 * @param {string} text
 * @returns {Promise<boolean>} true si se pudo copiar
 */
export async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // permiso denegado o contexto no seguro: se prueba el método clásico
  }

  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  } catch {
    return false
  }
}
