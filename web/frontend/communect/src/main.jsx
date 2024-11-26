import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Top from './Top.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Top />
  </StrictMode>,
)
