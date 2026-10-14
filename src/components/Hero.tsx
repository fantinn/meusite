import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import { hero } from '../content'
import { fitHeroTitle } from '../heroFit'
import CloudShader from './CloudShader'

const ACCENT_FROM = 3 // índice da palavra onde começa o destaque em gradiente

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  // O conteúdo some conforme o hero sai da tela (proporcional à altura dele,
  // para a janela não sumir antes de aparecer no celular, onde o hero é mais alto)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const fade = useTransform(scrollYProgress, [0.35, 0.85], [1, 0])
  const lift = useTransform(scrollYProgress, [0, 0.85], [0, -80])

  // Linhas > trechos > palavras, mantendo o índice global (para o destaque e o atraso da animação)
  let n = 0
  const lines = hero.titleLines.map((line) =>
    line.map((chunk) => chunk.split(' ').map((word) => ({ word, i: n++ }))),
  )

  const titleRef = useRef<HTMLHeadingElement>(null)
  useLayoutEffect(() => {
    const h1 = titleRef.current
    if (!h1) return
    const fit = () => fitHeroTitle(h1)
    const desktop = window.matchMedia('(min-width: 861px)')
    fit()
    document.fonts?.ready.then(fit)
    const observer = new ResizeObserver(fit)
    observer.observe(h1)
    desktop.addEventListener('change', fit)
    return () => {
      observer.disconnect()
      desktop.removeEventListener('change', fit)
    }
  }, [])

  // As entradas são animações CSS (global.css): o hero aparece já no HTML, sem esperar o JavaScript.
  return (
    <section ref={ref} id="inicio" className="hero">
      <CloudShader />

      <motion.div className="container hero__inner" style={{ opacity: fade, y: lift }}>
        <div className="hero__copy">
          <span className="eyebrow">
            <span className="eyebrow__dot" />
            {hero.eyebrow}
          </span>

          <h1 ref={titleRef} id="hero-title" aria-label={hero.title}>
            {lines.map((line, l) => (
              <span key={l} className="hero__line" aria-hidden>
                {line.map((chunk, c) => (
                  <span key={c} className="hero__chunk">
                    {chunk.map(({ word, i }) => (
                      <span key={i} className={`word${i >= ACCENT_FROM ? ' accent' : ''}`} style={{ '--i': i } as CSSProperties}>
                        {word}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className="hero__sub">{hero.subtitle}</p>

          <div className="hero__actions">
            <motion.a href={hero.primary.href} className="btn btn--primary" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              {hero.primary.label} <ArrowRight size={18} />
            </motion.a>
            <motion.a href={hero.secondary.href} className="btn btn--ghost" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              {hero.secondary.label}
            </motion.a>
          </div>
        </div>

      </motion.div>
    </section>
  )
}
