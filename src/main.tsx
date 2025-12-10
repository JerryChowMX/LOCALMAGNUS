import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme/theme.css'
import App from './App.tsx'
import { initAnalytics } from './lib/analytics'

// Initialize analytics (will only start if consent is already granted)
initAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
