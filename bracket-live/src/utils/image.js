function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen'))
    }
    img.src = url
  })
}

/**
 * Reduce una imagen a un data URL pequeño (máx. `size` px) para guardarlo
 * en localStorage sin agotar la cuota.
 * @param {File} file
 * @param {number} size
 * @returns {Promise<string>}
 */
export async function fileToLogoDataUrl(file, size = 128) {
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen')
  }

  const img = await loadImage(file)
  const width = img.naturalWidth || size
  const height = img.naturalHeight || size
  const scale = Math.min(size / width, size / height, 1)

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width * scale))
  canvas.height = Math.max(1, Math.round(height * scale))
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)

  return canvas.toDataURL('image/webp', 0.9)
}
