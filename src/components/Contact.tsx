import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Linkedin, Mail, MessageCircle } from 'lucide-react'
import { brand } from '../content'
import Reveal, { SectionHead, ease } from './Reveal'

const channels = [
  { icon: Mail, label: 'E-mail', value: brand.email, href: `mailto:${brand.email}` },
  { icon: MessageCircle, label: 'WhatsApp', value: 'Resposta rápida', href: brand.whatsapp },
  { icon: Linkedin, label: 'LinkedIn', value: 'Conecte-se comigo', href: brand.linkedin },
]

export default function Contact() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const body = `Nome: ${data.get('name')}\nE-mail: ${data.get('email')}\nServiço: ${data.get('service')}\n\n${data.get('message')}`
    window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent('Novo projeto')}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <section id="contato" className="section">
      <div className="container">
        <Reveal className="cta">
          <motion.span className="cta__ring" style={{ width: 420, height: 420, top: -200, right: -120 }} animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} />
          <motion.span className="cta__ring" style={{ width: 300, height: 300, bottom: -160, left: -60 }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Vamos tirar sua ideia do papel?</h2>
          <p>Conte um pouco sobre o seu projeto e receba uma proposta em até 24 horas.</p>
          <motion.a href="#form" className="btn btn--primary" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            Começar conversa <ArrowRight size={18} />
          </motion.a>
        </Reveal>

        <div className="contact" style={{ marginTop: 'clamp(64px,10vw,112px)' }}>
          <div>
            <SectionHead kicker="Contato" title="Fale comigo." text="Prefere outro canal? Escolha o que for mais prático para você." still />
            <Reveal className="contact__list" delay={0.1}>
              {channels.map(({ icon: Icon, label, value, href }) => (
                <a key={label} className="contact__item" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  <span className="card__icon"><Icon size={18} /></span>
                  <span><strong>{label}</strong><small>{value}</small></span>
                </a>
              ))}
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <form id="form" className="form card" onSubmit={onSubmit}>
              <div className="form__row">
                <div className="field">
                  <input id="name" name="name" placeholder=" " required />
                  <label htmlFor="name">Seu nome</label>
                </div>
                <div className="field">
                  <input id="email" name="email" type="email" placeholder=" " required />
                  <label htmlFor="email">E-mail</label>
                </div>
              </div>
              <div className="field">
                <select id="service" name="service" defaultValue="Landing Page">
                  <option>Landing Page</option>
                  <option>Loja Online</option>
                  <option>Automação</option>
                  <option>Outro projeto</option>
                </select>
                <label htmlFor="service">Serviço</label>
              </div>
              <div className="field">
                <textarea id="message" name="message" placeholder=" " required />
                <label htmlFor="message">Conte sobre o projeto</label>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                {sent ? (
                  <motion.div key="ok" className="form__success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease }}>
                    <CheckCircle2 size={22} /> Obrigado! Seu app de e-mail foi aberto para enviar a mensagem.
                  </motion.div>
                ) : (
                  <motion.button key="btn" type="submit" className="btn btn--primary" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} exit={{ opacity: 0, y: -8 }}>
                    Enviar mensagem <ArrowRight size={18} />
                  </motion.button>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
