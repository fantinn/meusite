import { ArrowRight } from 'lucide-react'
import { services } from '../content'
import Card from './Card'
import HorizontalScroll from './HorizontalScroll'

export default function Services() {
  return (
    <HorizontalScroll id="servicos" kicker="Serviços" title="Criação de sites, landing pages e lojas online.">
      {services.map(({ icon: Icon, title, text, tags, link }, i) => (
        <Card key={title} className="hscroll__card">
          <span className="hscroll__num" data-num={String(i + 1).padStart(2, '0')} aria-hidden />
          <div className="card__icon"><Icon size={24} /></div>
          <h3>{title}</h3>
          <p>{text}</p>
          <div className="tags">{tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
          {link && (
            <a className="card__link" href={link.href}>
              {link.label} <ArrowRight size={15} />
            </a>
          )}
        </Card>
      ))}
    </HorizontalScroll>
  )
}
