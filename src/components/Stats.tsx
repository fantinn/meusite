import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import { stats } from '../content'
import { fadeUp, stagger } from './Reveal'

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 2, ease: [0.1, 0.9, 0.2, 1], onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to])

  return <div ref={ref} className="stat__value">{value}{suffix}</div>
}

export default function Stats() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <motion.div className="stats" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
          {stats.map((s) => (
            <motion.div key={s.label} className="stat" variants={fadeUp}>
              <Counter to={s.value} suffix={s.suffix} />
              <div className="stat__label">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
