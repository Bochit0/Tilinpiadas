import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter' // tipografía empaquetada (sin depender de Google Fonts)
import './index.css'
import App from './App.jsx'
import TournamentProvider from './context/TournamentProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TournamentProvider>
      <App />
    </TournamentProvider>
  </StrictMode>,
)
