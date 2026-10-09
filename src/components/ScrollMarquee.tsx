import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

const ROWS = [
  'Sites · Lojas Online · Automação · Landing Pages · ',
  'Rápido · Bonito · Seguro · Feito para vender · ',
]

// Faixas de texto gigante que deslizam em sentidos opostos conforme o scroll.
// Decorativas: o texto vem do CSS (::before), fora da árvore de acessibilidade.
export default function ScrollMarquee() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const p = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 })
  const left = useTransform(p, [0, 1], ['0%', '-35%'])
  const right = useTransform(p, [0, 1], ['-35%', '0%'])
  return (
    <div ref={ref} className="smarquee" aria-hidden>
      <motion.div className="smarquee__row" data-text={ROWS[0].repeat(4)} style={{ x: left }} />
      <motion.div className="smarquee__row is-outline" data-text={ROWS[1].repeat(4)} style={{ x: right }} />
    </div>
  )
}
