import { StrictMode, startTransition } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// No build o HTML já vem pré-renderizado (scripts/prerender.mjs): o React só "assume" a página.
// Dentro de startTransition a hidratação é feita em pedaços pequenos, sem travar a tela.
// No `npm run dev` o #root vem vazio e a página é montada normalmente.
if (root.hasChildNodes()) startTransition(() => void hydrateRoot(root, app))
else createRoot(root).render(app)
