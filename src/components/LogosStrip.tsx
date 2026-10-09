import { tech } from '../content'

// Faixa infinita em CSS puro (roda na GPU, sem JavaScript a cada quadro)
export default function LogosStrip() {
  const items = [...tech, ...tech]
  return (
    <div className="marquee">
      <ul className="marquee__track" aria-label="Tecnologias que uso">
        {items.map((t, i) => (
          <li key={i} className="marquee__item" aria-hidden={i >= tech.length || undefined}>{t}</li>
        ))}
      </ul>
    </div>
  )
}
