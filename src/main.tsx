/**
 * main.tsx - Application entry point
 * Renders React app into DOM with Vite
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import '@/index.css'
import { logger } from '@/utils/logger'

logger.info('Main: Starting application...')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

logger.info('Main: Application mounted')
