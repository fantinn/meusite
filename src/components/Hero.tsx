import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { MouseEvent } from 'react'
import { hero } from '../content'
import { ease } from './Reveal'
import CloudShader from './CloudShader'

const ACCENT_FROM = 3 // índice da palavra onde começa o destaque em gradiente

export default function Hero() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })

  const rotY = useTransform(sx, [-0.5, 0.5], [8, -8])
  const rotX = useTransform(sy, [-0.5, 0.5], [-6, 6])
  const fx = useTransform(sx, [-0.5, 0.5], [-24, 24])
  const fy = useTransform(sy, [-0.5, 0.5], [-24, 24])

  const { scrollY } = useScroll()
  const fade = useTransform(scrollY, [0, 500], [1, 0])
  const lift = useTransform(scrollY, [0, 500], [0, -80])

  const onMove = (e: MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const words = hero.title.split(' ')

  return (
    <section className="hero" onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0) }}>
      <CloudShader />

      <motion.div className="container hero__inner" style={{ opacity: fade, y: lift }}>
        <div>
          <motion.span className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.2 }}>
            <span className="eyebrow__dot" />
            {hero.eyebrow}
          </motion.span>

          <h1 aria-label={hero.title}>
            {words.map((w, i) => (
              <motion.span
                key={i}
                className={`word${i >= ACCENT_FROM ? ' accent' : ''}`}
                aria-hidden
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, ease, delay: 0.3 + i * 0.06 }}
              >
                {w}
              </motion.span>
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
            <div className="window window--main">
              <div className="window__bar">
                <span>seuprojeto.com</span>
                <span className="window__ctrls"><span>—</span><span>☐</span><span>✕</span></span>
              </div>
              <div className="window__body">
                <div className="mock-hero" />
                <div className="skeleton" style={{ width: '70%' }} />
                <div className="skeleton" style={{ width: '45%' }} />
                <div className="mock-cards"><div /><div /><div /></div>
              </div>
            </div>

            <motion.div className="window window--chart" style={{ x: fx, y: fy }}>
              <div className="window__body">
                <div className="chart__label"><span>Conversões</span><strong>+128%</strong></div>
                <div className="bars">
                  {[35, 55, 40, 70, 60, 90, 100].map((h, i) => (
                    <motion.span
                      key={i}
                      style={{ height: `${h}%` }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.8, ease, delay: 1.1 + i * 0.07 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="window window--chip chip"
              style={{ x: fx, y: fy }}
              animate={{ translateY: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="chip__icon"><Sparkles size={16} /></span>
              <span>Lançado!<small>há 2 minutos</small></span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
