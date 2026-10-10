import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import AdminPage from './pages/AdminPage'
import StreamPage from './pages/StreamPage'
import Starfield from './components/ui/Starfield'
import { ROUTES } from './utils/routes'

/**
 * Fondo común de toda la app: el degradado violeta va en <body> (index.css) y las estrellas
 * del inicio se dibujan fijas detrás de /admin y /stream. El inicio trae las suyas.
 * Con /stream?bg=transparent no se pinta nada, para que OBS reciba el canal alfa limpio.
 */
function Backdrop() {
  const { pathname, search } = useLocation()
  const transparent = new URLSearchParams(search).get('bg') === 'transparent'
  if (pathname === ROUTES.home || transparent) return null
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
