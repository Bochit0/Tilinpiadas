// Rutas públicas de la app. Todas respetan `base` de Vite (por si se despliega en un subdirectorio).
export const ROUTES = {
  home: '/',
  admin: '/admin',
  stream: '/stream',
  streamTransparent: '/stream?bg=transparent',
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

/** "/stream" → "/stream" (o "/mi-app/stream" con base). Para href e iframes. */
export const withBase = (path) => BASE + path

/** URL absoluta lista para pegar en OBS: "https://sitio.com/stream?bg=transparent". */
export const absoluteUrl = (path) => window.location.origin + withBase(path)
