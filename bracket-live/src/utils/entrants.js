/** Fisher-Yates. `random` es inyectable para poder probarlo con valores fijos. */
export function shuffle(list, random = Math.random) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Texto con un participante por línea → lista limpia (sin vacíos). */
export function parseEntrants(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

/** Archivo .txt/.csv: una fila por participante, se toma la primera columna. */
export function parseEntrantsFile(text) {
  return parseEntrants(text)
    .map((line) => line.split(/[;\t,]/)[0].trim())
    .filter(Boolean)
}
