import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MoodBoard } from './Cards.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MoodBoard />
  </StrictMode>,
)