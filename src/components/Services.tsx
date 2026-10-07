import { motion } from 'framer-motion'
import { services } from '../content'
import Card from './Card'
import { SectionHead, fadeUp, stagger } from './Reveal'

export default function Services() {
  return (
    <section id="servicos" className="section">
      <div className="container">
        <SectionHead
          kicker="Serviços"
          title="Tudo o que seu projeto digital precisa, em um só lugar."
          text="Da estratégia ao código, entrego soluções completas com foco em resultado, performance e uma experiência impecável."
        />
        <motion.div className="grid-3" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
          {services.map(({ icon: Icon, title, text, tags }) => (
            <Card key={title} variants={fadeUp}>
              <div className="card__icon"><Icon size={24} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <div className="tags">{tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
