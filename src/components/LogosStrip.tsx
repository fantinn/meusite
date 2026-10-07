import { motion } from 'framer-motion'
import { tech } from '../content'

export default function LogosStrip() {
  const items = [...tech, ...tech]
  return (
    <div className="marquee" aria-label="Tecnologias">
      <motion.div
        className="marquee__track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((t, i) => (
          <span key={i} className="marquee__item" aria-hidden={i >= tech.length}>{t}</span>
        ))}
      </motion.div>
    </div>
  )
}
