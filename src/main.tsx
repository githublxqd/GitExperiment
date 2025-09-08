import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SWRConfig, { swrConfig } from './lib/swrConfig.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SWRConfig value={swrConfig}>
      <App />
    </SWRConfig>
  </StrictMode>,
)
