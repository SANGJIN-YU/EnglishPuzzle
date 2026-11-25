import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { IS_TOSS, restoreRecords } from './lib/toss.ts'

// In the Toss app, bring back saved records before the first render reads them.
void restoreRecords().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})

// Offline support and the Play Store app (TWA) need a service worker; skip it in dev
// and in the Toss mini app, which ships its files inside the app bundle.
if (import.meta.env.PROD && !IS_TOSS && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
