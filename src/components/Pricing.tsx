import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { plans } from '../content'
import Card from './Card'
import { SectionHead, fadeUp, stagger } from './Reveal'

export default function Pricing() {
  return (
    <section id="planos" className="section">
      <div className="container">
        <SectionHead
          kicker="Planos"
          title="Investimento claro, sem letras miúdas."
          text="Valores de referência. Cada projeto recebe uma proposta personalizada."
          center
        />
        <motion.div className="plans" variants={stagger(0.12)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
          {plans.map((p) => (
            <Card key={p.name} className={`plan${p.featured ? ' is-featured' : ''}`} variants={fadeUp}>
              {p.featured && <span className="plan__badge">Mais popular</span>}
              <h3>{p.name}</h3>
              <div className="plan__price">{p.price}</div>
              <p>{p.desc}</p>
              <ul>
                {p.features.map((f) => <li key={f}><Check size={16} />{f}</li>)}
              </ul>
              <motion.a href="#contato" className={`btn ${p.featured ? 'btn--primary' : 'btn--ghost'}`} whileTap={{ scale: 0.97 }}>
                Começar agora
              </motion.a>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
