import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLayoutEffect, useRef, type MouseEvent } from 'react'
import { hero } from '../content'
import { ease } from './Reveal'
import CloudShader from './CloudShader'

const ACCENT_FROM = 3 // índice da palavra onde começa o destaque em gradiente

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })

  const rotY = useTransform(sx, [-0.5, 0.5], [8, -8])
  const rotX = useTransform(sy, [-0.5, 0.5], [-6, 6])
  const fx = useTransform(sx, [-0.5, 0.5], [-24, 24])
  const fy = useTransform(sy, [-0.5, 0.5], [-24, 24])

  // O conteúdo some conforme o hero sai da tela (proporcional à altura dele,
  // para a janela não sumir antes de aparecer no celular, onde o hero é mais alto)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const fade = useTransform(scrollYProgress, [0.35, 0.85], [1, 0])
  const lift = useTransform(scrollYProgress, [0, 0.85], [0, -80])

  const onMove = (e: MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  // Linhas > trechos > palavras, mantendo o índice global (para o destaque e o atraso da animação)
  let n = 0
  const lines = hero.titleLines.map((line) =>
    line.map((chunk) => chunk.split(' ').map((word) => ({ word, i: n++ }))),
  )

  // No computador, cada linha recebe o tamanho que a faz ocupar exatamente a largura da coluna
  // (as duas linhas ficam com a mesma largura). No celular vale o tamanho do CSS.
  const titleRef = useRef<HTMLHeadingElement>(null)
  useLayoutEffect(() => {
    const h1 = titleRef.current
    if (!h1) return
    const desktop = window.matchMedia('(min-width: 861px)')
    const fit = () => {
      const lineEls = h1.querySelectorAll<HTMLElement>('.hero__line')
      lineEls.forEach((line) => (line.style.fontSize = ''))
      if (!desktop.matches) return
      const width = h1.clientWidth
      lineEls.forEach((line) => {
        line.style.fontSize = '100px'
        line.style.fontSize = `${(100 * width) / line.offsetWidth}px`
      })
    }
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

  return (
    <section ref={ref} className="hero" onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0) }}>
      <CloudShader />

      <motion.div className="container hero__inner" style={{ opacity: fade, y: lift }}>
        <div className="hero__copy">
          <motion.span className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.2 }}>
            <span className="eyebrow__dot" />
            {hero.eyebrow}
          </motion.span>

          <h1 ref={titleRef} aria-label={hero.title}>
            {lines.map((line, l) => (
              <span key={l} className="hero__line" aria-hidden>
                {line.map((chunk, c) => (
                  <span key={c} className="hero__chunk">
                    {chunk.map(({ word, i }) => (
                      <motion.span
                        key={i}
                        className={`word${i >= ACCENT_FROM ? ' accent' : ''}`}
                        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.9, ease, delay: 0.3 + i * 0.06 }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <motion.p className="hero__sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.8 }}>
            {hero.subtitle}
          </motion.p>

          <motion.div className="hero__actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.95 }}>
            <motion.a href={hero.primary.href} className="btn btn--primary" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              {hero.primary.label} <ArrowRight size={18} />
            </motion.a>
            <motion.a href={hero.secondary.href} className="btn btn--ghost" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              {hero.secondary.label}
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.5 }}
          aria-hidden
        >
          <motion.div style={{ rotateX: rotX, rotateY: rotY, position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
            {/* Notebook e celular flutuando no céu (fundo removido, sombra preservada) */}
            <img className="device device--laptop" src="/hero/laptop.webp" alt="" width={1100} height={911} draggable={false} />
            <motion.img className="device device--phone" src="/hero/phone.webp" alt="" width={560} height={639} draggable={false} style={{ x: fx, y: fy }} />

            <motion.div
              className="window window--chip chip"
              style={{ x: fx, y: fy }}
              animate={{ translateY: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="chip__icon"><Sparkles size={16} /></span>
              <span>Site no ar!<small>há 2 minutos</small></span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
