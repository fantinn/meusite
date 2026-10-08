import { services } from '../content'
import Card from './Card'
import HorizontalScroll from './HorizontalScroll'

export default function Services() {
  return (
    <HorizontalScroll id="servicos" kicker="Serviços" title="Tudo o que seu projeto digital precisa, em um só lugar.">
      {services.map(({ icon: Icon, title, text, tags }, i) => (
        <Card key={title} className="hscroll__card">
          <span className="hscroll__num">{String(i + 1).padStart(2, '0')}</span>
          <div className="card__icon"><Icon size={24} /></div>
          <h3>{title}</h3>
          <p>{text}</p>
          <div className="tags">{tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
        </Card>
      ))}
    </HorizontalScroll>
  )
}
