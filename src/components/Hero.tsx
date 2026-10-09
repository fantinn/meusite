import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLayoutEffect, useRef, type CSSProperties, type MouseEvent } from 'react'
import { hero } from '../content'
import { fitHeroTitle } from '../heroFit'
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
    <section ref={ref} id="inicio" className="hero" onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0) }}>
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

        <div className="hero__visual" aria-hidden>
          <motion.div style={{ rotateX: rotX, rotateY: rotY, position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
            {/* Notebook e celular flutuando no céu (fundo removido, sombra preservada) */}
            <img
              className="device device--laptop"
              src="/hero/laptop.webp"
              srcSet="/hero/laptop-760.webp 760w, /hero/laptop.webp 1100w"
              sizes="(max-width: 520px) calc(96vw - 30px), (max-width: 960px) 500px, 40vw"
              alt=""
              width={1100}
              height={911}
              // No celular fica abaixo da dobra: prioridade baixa. No computador o index.html já
              // pré-carrega esta imagem com prioridade alta (<link rel="preload" media=...>).
              fetchPriority="low"
              draggable={false}
            />
            <motion.img
              className="device device--phone"
              src="/hero/phone.webp"
              srcSet="/hero/phone-300.webp 300w, /hero/phone.webp 560w"
              sizes="(max-width: 520px) 31vw, (max-width: 960px) 190px, 14vw"
              alt=""
              width={560}
              height={639}
              loading="lazy"
              draggable={false}
              style={{ x: fx, y: fy }}
            />

            <motion.div className="window window--chip chip" style={{ x: fx, y: fy }}>
              <span className="chip__icon"><Sparkles size={16} /></span>
              <span>Site no ar!<small>há 2 minutos</small></span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
