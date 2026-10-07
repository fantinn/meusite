import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { process } from '../content'
import { SectionHead, fadeUp, stagger } from './Reveal'

export default function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 50%'] })
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 25 })

  return (
    <section id="processo" className="section section--alt">
      <div className="container">
        <SectionHead
          kicker="Como trabalho"
          title="Um processo simples, transparente e sem surpresas."
          text="Você acompanha cada etapa e sabe exatamente o que está sendo feito."
        />
        <motion.div
          ref={ref}
          className="process"
          variants={stagger(0.15)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="process__track" aria-hidden />
          <motion.div className="process__fill" style={{ ['--p' as string]: p }} aria-hidden />
          {process.map((s, i) => (
            <motion.div key={s.title} className="step" variants={fadeUp}>
              <motion.div className="step__num" whileHover={{ scale: 1.1 }}>{String(i + 1).padStart(2, '0')}</motion.div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
