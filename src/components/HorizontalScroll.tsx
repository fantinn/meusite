import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

type Props = { id?: string; kicker: string; title: string; className?: string; children: ReactNode }

// Seção fixa na tela: enquanto você rola para baixo, os cards passam na horizontal.
export default function HorizontalScroll({ id, kicker, title, className = '', children }: Props) {
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
  const headY = useTransform(p, [0, 1], [0, -40])

  return (
    <section id={id} ref={sectionRef} className={`hscroll ${className}`} style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="hscroll__sticky">
        <motion.div className="container hscroll__head" style={{ y: headY }}>
          <span className="kicker">{kicker}</span>
          <h2>{title}</h2>
        </motion.div>
        <motion.div ref={trackRef} className="hscroll__track" style={{ x }}>
          {children}
        </motion.div>
        <div className="container">
          <div className="hscroll__bar"><motion.span style={{ scaleX: p }} /></div>
        </div>
      </div>
    </section>
  )
}
