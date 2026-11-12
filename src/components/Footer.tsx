import { motion } from 'framer-motion'
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react'
import { brand, guides } from '../content'
import BigMark from './BigMark'

export default function Footer() {
  const social = [
    { icon: Github, href: brand.github, label: 'GitHub' },
    { icon: Linkedin, href: brand.linkedin, label: 'LinkedIn' },
    { icon: Mail, href: `mailto:${brand.email}`, label: 'E-mail' },
  ]
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <nav className="footer__links" aria-label="Rodapé">
          {guides.map((g) => <a key={g.href} href={g.href}>{g.label}</a>)}
        </nav>
        <div className="footer__social">
          {social.map(({ icon: Icon, href, label }) => (
            <motion.a key={label} className="icon-btn" href={href} aria-label={label} target="_blank" rel="noreferrer" whileHover={{ y: -3 }}>
              <Icon size={16} />
            </motion.a>
          ))}
          <motion.a className="icon-btn" href="#inicio" aria-label="Voltar ao topo" whileHover={{ y: -3 }}>
            <ArrowUp size={16} />
          </motion.a>
        </div>
        {/* O ano vem do build (pré-render); suppressHydrationWarning evita erro na virada do ano */}
        <span className="footer__copy" suppressHydrationWarning>
          {`© ${new Date().getFullYear()} ${brand.name} · Criação de sites, landing pages e lojas online.`}
        </span>
      </div>
      {/* O logo pequeno saiu daqui: quem fecha o site agora é o logo grande animado */}
      <div className="container footer__big">
        <BigMark />
      </div>
    </footer>
  )
}
