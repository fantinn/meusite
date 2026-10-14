import { Sparkles } from 'lucide-react'
import { LaptopScreen, PhoneScreen } from './ScreenSites'

// Notebook e celular flutuando (fundo removido, sombra preservada), com as telas animadas por cima
export default function Devices() {
  return (
    <div className="devices" aria-hidden>
      <div className="device device--laptop">
        <img
          src="/hero/laptop.webp"
          srcSet="/hero/laptop-760.webp 760w, /hero/laptop.webp 1100w"
          sizes="(max-width: 900px) 90vw, 560px"
          alt=""
          width={1100}
          height={911}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <LaptopScreen />
      </div>
      <div className="device device--phone">
        <img
          src="/hero/phone.webp"
          srcSet="/hero/phone-300.webp 300w, /hero/phone.webp 560w"
          sizes="(max-width: 900px) 30vw, 190px"
          alt=""
          width={560}
          height={639}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <PhoneScreen />
      </div>
      <div className="window window--chip chip">
        <span className="chip__icon"><Sparkles size={16} /></span>
        <span>Site no ar!<small>há 2 minutos</small></span>
      </div>
    </div>
  )
}
