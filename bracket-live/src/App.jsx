import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import AdminPage from './pages/AdminPage'
import StreamPage from './pages/StreamPage'
import Starfield from './components/ui/Starfield'
import { getStreamBackground } from './components/backgrounds'
import { ROUTES } from './utils/routes'

/**
 * Fondo común de toda la app: el degradado violeta va en <body> (index.css) y las estrellas
 * del inicio se dibujan fijas detrás de /admin y /stream. El inicio trae las suyas.
 * Con /stream?bg=transparent no se pinta nada, para que OBS reciba el canal alfa limpio.
 * En /stream, ?bg=<key> (ver components/backgrounds) cambia las estrellas por otro fondo.
 */
function Backdrop() {
  const { pathname, search } = useLocation()
  const bg = new URLSearchParams(search).get('bg')
  if (pathname === ROUTES.home || bg === 'transparent') return null

  if (pathname === ROUTES.stream) {
    const background = getStreamBackground(bg)
    if (background) {
      const { Component } = background
      return <Component />
    }
  }

  return <Starfield fixed />
}

// Rutas: / (inicio), /admin (consola del operador), /stream (pantalla pública para OBS).
// Cualquier otra ruta vuelve al inicio.
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Backdrop />
      <Routes>
        <Route path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.admin} element={<AdminPage />} />
        <Route path={ROUTES.stream} element={<StreamPage />} />
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
