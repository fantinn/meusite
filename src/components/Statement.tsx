import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

const TEXT = 'Design limpo. Código rápido. Um site que trabalha por você enquanto você cuida do seu negócio.'

function Word({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total
  const end = start + 1 / total
  const opacity = useTransform(progress, [start, end], [0.12, 1])
  const y = useTransform(progress, [start, end], [12, 0])
  return <motion.span className="statement__word" style={{ opacity, y }}>{word}</motion.span>
}

// Frase grande que vai "acendendo" palavra por palavra conforme o scroll.
export default function Statement() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = TEXT.split(' ')
  return (
    <section className="statement">
      <div className="container">
        <p ref={ref} className="statement__text" aria-label={TEXT}>
          {words.map((w, i) => (
            <Word key={i} word={w} index={i} total={words.length} progress={scrollYProgress} />
          ))}
        </p>
      </div>
    </section>
  )
}
