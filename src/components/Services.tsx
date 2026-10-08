import { services } from '../content'
import Card from './Card'
import { ScrollItem, SectionHead } from './Reveal'

export default function Services() {
  return (
    <section id="servicos" className="section">
      <div className="container">
        <SectionHead
          kicker="Serviços"
          title="Tudo o que seu projeto digital precisa, em um só lugar."
          text="Da estratégia ao código, entrego soluções completas com foco em resultado, performance e uma experiência impecável."
        />
        <div className="grid-3">
          {services.map(({ icon: Icon, title, text, tags }, i) => (
            <ScrollItem key={title} index={i % 3} tilt>
              <Card style={{ height: '100%' }}>
                <div className="card__icon"><Icon size={24} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
                <div className="tags">{tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
              </Card>
            </ScrollItem>
          ))}
        </div>
      </div>
    </section>
  )
}
