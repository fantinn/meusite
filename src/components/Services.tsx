import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { services } from '../content'
import Card from './Card'

// Seção fixa na tela: enquanto você rola para baixo, os cards passam na horizontal.
export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (track) setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 160, damping: 34, mass: 0.3 })
  const x = useTransform(p, [0, 1], [0, -distance])
  const bar = useTransform(p, [0, 1], [0, 1])
  const headY = useTransform(p, [0, 1], [0, -40])

  return (
    <section id="servicos" ref={sectionRef} className="hscroll" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="hscroll__sticky">
        <motion.div className="container hscroll__head" style={{ y: headY }}>
          <span className="kicker">Serviços</span>
          <h2>Tudo o que seu projeto digital precisa, em um só lugar.</h2>
        </motion.div>
        <motion.div ref={trackRef} className="hscroll__track" style={{ x }}>
          {services.map(({ icon: Icon, title, text, tags }, i) => (
            <Card key={title} className="hscroll__card">
              <span className="hscroll__num">{String(i + 1).padStart(2, '0')}</span>
              <div className="card__icon"><Icon size={24} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <div className="tags">{tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
            </Card>
          ))}
        </motion.div>
        <div className="container">
          <div className="hscroll__bar"><motion.span style={{ scaleX: bar }} /></div>
        </div>
      </div>
    </section>
  )
}
