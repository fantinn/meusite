import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { brand, nav } from '../content'
import { ease } from './Reveal'
import ThemeToggle from './ThemeToggle'

export function Logo() {
  return (
    <a href="#" className="logo" aria-label={brand.name}>
      <span className="logo__mark" aria-hidden>{brand.short}</span>
      {brand.name}
    </a>
  )
}

export default function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 16))

  return (
    <motion.header
      className={`nav${scrolled || open ? ' is-scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease }}
    >
      <div className="container nav__inner">
        <Logo />
        <nav className="nav__links" onMouseLeave={() => setHovered(null)}>
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="nav__link" onMouseEnter={() => setHovered(item.href)}>
              {hovered === item.href && (
                <motion.span layoutId="nav-pill" className="nav__pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="nav__actions">
          <ThemeToggle />
          <a href="#contato" className="btn btn--primary btn--sm nav__cta">Fale comigo</a>
          <button className="nav__toggle" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'x' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <motion.ul initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}>
              {nav.map((item) => (
                <motion.li key={item.href} variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}>
                  <a href={item.href} onClick={() => setOpen(false)}>{item.label}</a>
                </motion.li>
              ))}
              <motion.li variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
                <a href="#contato" className="btn btn--primary" onClick={() => setOpen(false)}>Fale comigo</a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
