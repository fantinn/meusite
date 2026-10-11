import { ArrowRight, Plus } from 'lucide-react'
import { faq, guides } from '../content'
import { SectionHead } from './Reveal'

// Guia em destaque: fica no meio dos três cards
const FEATURED = '/gabriel-fantin'
const featured = guides.find((g) => g.href === FEATURED)
const others = guides.filter((g) => g.href !== FEATURED)
const cards = featured ? [others[0], featured, ...others.slice(1)] : guides

// Perguntas frequentes em <details>: abrem e fecham sem JavaScript e o texto
// completo já vem no HTML (bom para o Google e para quem usa leitor de tela).
export default function Faq() {
  return (
    <section id="duvidas" className="section">
      <div className="container faq">
        <SectionHead
          kicker="Dúvidas"
          title="Perguntas frequentes."
          text="Dúvidas mais comuns antes de realizar o melhor investimento para o seu negócio! Ficou alguma dúvida? Me chama no Zap."
          still
        />

        <div className="faq__list">
          {faq.map(({ q, a }) => (
            <details key={q} className="faq__item" name="faq">
              <summary>
                <h3>{q}</h3>
                <Plus size={20} className="faq__icon" aria-hidden />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>

        <nav className="guides" aria-label="Guias">
          {cards.map((g) => (
            <a key={g.href} href={g.href} className={g.href === FEATURED ? 'guide guide--featured' : 'guide'}>
              <strong>{g.label}</strong>
              <span>{g.text}</span>
              <ArrowRight size={16} className="guide__arrow" aria-hidden />
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}
