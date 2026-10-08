import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Linkedin, Mail, MessageCircle } from 'lucide-react'
import { brand } from '../content'
import FlowBackground from './FlowBackground'
import Reveal, { SectionHead, ease } from './Reveal'

const channels = [
  { icon: MessageCircle, label: 'WhatsApp', value: brand.whatsappLabel, href: `https://wa.me/${brand.whatsappNumber}` },
  { icon: Mail, label: 'E-mail', value: brand.email, href: `mailto:${brand.email}` },
  { icon: Linkedin, label: 'LinkedIn', value: 'Conecte-se comigo', href: brand.linkedin },
]

export default function Contact() {
  const [sent, setSent] = useState(false)

  // Monta a mensagem e abre o WhatsApp (app no celular, WhatsApp Web no computador) já com o texto preenchido.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const text = `Olá! Meu nome é ${data.get('name')}.\nTenho interesse em: *${data.get('service')}*\n\n${data.get('message')}`
    window.open(`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    setSent(true)
  }

  return (
    <section id="contato" className="section">
      <div className="container">
        <Reveal className="cta">
          <FlowBackground />
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Vamos tirar sua ideia do papel?</h2>
          <p>Conte um pouco sobre o seu projeto e receba uma proposta em até 24 horas.</p>
          <motion.a href="#form" className="btn btn--primary" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            Começar conversa <ArrowRight size={18} />
          </motion.a>
        </Reveal>

        <div style={{ marginTop: 'clamp(64px,10vw,112px)' }}>
          <SectionHead kicker="Contato" title="Fale comigo." text="Preencha o formulário e a mensagem chega direto no meu WhatsApp. Se preferir, escolha outro canal." still />
        </div>

        <div className="contact">
          <div className="contact__list">
            {channels.map(({ icon: Icon, label, value, href }) => (
              <a key={label} className="contact__item" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <span className="card__icon"><Icon size={18} /></span>
                <span><strong>{label}</strong><small>{value}</small></span>
                <ArrowRight size={16} className="contact__arrow" />
              </a>
            ))}
          </div>

          <form id="form" className="form card" onSubmit={onSubmit}>
              <div className="field">
                <input id="name" name="name" placeholder=" " required />
                <label htmlFor="name">Seu nome</label>
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
                    <CheckCircle2 size={22} /> Pronto! O WhatsApp foi aberto com a sua mensagem, é só tocar em enviar.
                  </motion.div>
                ) : (
                  <motion.button key="btn" type="submit" className="btn btn--primary" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} exit={{ opacity: 0, y: -8 }}>
                    <MessageCircle size={18} /> Enviar pelo WhatsApp
                  </motion.button>
                )}
              </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  )
}
