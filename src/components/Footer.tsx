import { motion } from 'framer-motion'
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react'
import { brand } from '../content'
import { Logo } from './Navbar'

export default function Footer() {
  const social = [
    { icon: Github, href: brand.github, label: 'GitHub' },
    { icon: Linkedin, href: brand.linkedin, label: 'LinkedIn' },
    { icon: Mail, href: `mailto:${brand.email}`, label: 'E-mail' },
  ]
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Logo />
        <span>© {new Date().getFullYear()} {brand.name}. Todos os direitos reservados.</span>
        <div className="footer__social">
          {social.map(({ icon: Icon, href, label }) => (
            <motion.a key={label} className="icon-btn" href={href} aria-label={label} target="_blank" rel="noreferrer" whileHover={{ y: -3 }}>
              <Icon size={16} />
            </motion.a>
          ))}
          <motion.a className="icon-btn" href="#" aria-label="Voltar ao topo" whileHover={{ y: -3 }}>
            <ArrowUp size={16} />
          </motion.a>
        </div>
      </div>
    </footer>
  )
}
