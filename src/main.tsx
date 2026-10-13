import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initSpeak } from './audio/speak'
import './index.css'

initSpeak()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
