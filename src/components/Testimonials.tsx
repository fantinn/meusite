import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { testimonials } from '../content'
import Reveal, { SectionHead, ease } from './Reveal'

export default function Testimonials() {
  const [[index, dir], setState] = useState<[number, number]>([0, 1])
  const [paused, setPaused] = useState(false)
  const n = testimonials.length

  const go = (d: number) => setState(([i]) => [(i + d + n) % n, d])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => go(1), 6000)
    return () => clearInterval(id)
  }, [paused, index])

  const t = testimonials[index]
  const initials = t.name.replace('Dra. ', '').split(' ').map((w) => w[0]).slice(0, 2).join('')

  return (
    <section className="section section--alt">
      <div className="container">
        <SectionHead kicker="Depoimentos" title="O que dizem os clientes." center />
        <Reveal className="testimonial">
          <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <div className="testimonial__stage">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.figure
                  key={index}
                  custom={dir}
                  style={{ margin: 0 }}
                  initial={{ opacity: 0, x: dir * 60, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: dir * -60, filter: 'blur(6px)' }}
                  transition={{ duration: 0.55, ease }}
                >
                  <blockquote>“{t.quote}”</blockquote>
                  <figcaption className="testimonial__author">
                    <span className="avatar">{initials}</span>
                    <span><strong>{t.name}</strong><small>{t.role}</small></span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
            <div className="testimonial__controls">
              <motion.button className="icon-btn" onClick={() => go(-1)} whileTap={{ scale: 0.9 }} aria-label="Anterior"><ChevronLeft size={18} /></motion.button>
              <div className="dots">
                {testimonials.map((_, i) => (
                  <button key={i} className={`dot${i === index ? ' is-active' : ''}`} onClick={() => setState([i, i > index ? 1 : -1])} aria-label={`Depoimento ${i + 1}`} />
                ))}
              </div>
              <motion.button className="icon-btn" onClick={() => go(1)} whileTap={{ scale: 0.9 }} aria-label="Próximo"><ChevronRight size={18} /></motion.button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
