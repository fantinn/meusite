import { ArrowRight, Plus } from 'lucide-react'
import { faq, guides } from '../content'
import { SectionHead } from './Reveal'

// Perguntas frequentes em <details>: abrem e fecham sem JavaScript e o texto
// completo já vem no HTML (bom para o Google e para quem usa leitor de tela).
export default function Faq() {
  return (
    <section id="duvidas" className="section">
      <div className="container faq">
        <SectionHead
          kicker="Dúvidas"
          title="Perguntas frequentes sobre criar seu site."
          text="Tudo o que costumam me perguntar antes de fazer um site ou uma landing page. Ficou alguma dúvida? Me chama no WhatsApp."
          still
        />

        <div className="faq__list">
          {faq.map(({ q, a }) => (
            <details key={q} className="faq__item">
              <summary>
                <h3>{q}</h3>
                <Plus size={20} className="faq__icon" aria-hidden />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>

        <nav className="guides" aria-label="Guias">
          {guides.map((g) => (
            <a key={g.href} href={g.href} className="guide">
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
