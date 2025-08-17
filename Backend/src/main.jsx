import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainAPP_ALLROUTE from "../src/Main_all_route";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainAPP_ALLROUTE />
  </StrictMode>,
)
