import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

const TEXT = 'Design limpo. Código rápido. Um site que trabalha por você enquanto você cuida do seu negócio.'

function Word({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total
  const end = start + 1 / total
  const opacity = useTransform(progress, [start, end], [0.12, 1])
  return <motion.span className="statement__word" style={{ opacity }}>{word}</motion.span>
}

// A frase fica fixa no centro da tela e acende palavra por palavra enquanto você rola.
export default function Statement() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, 0.85, 1], [0.92, 1, 1.04])
  const words = TEXT.split(' ')
  return (
    <section ref={ref} className="statement">
      <div className="statement__sticky">
        <motion.p className="container statement__text" style={{ scale }} aria-label={TEXT}>
          {words.map((w, i) => (
            <Word key={i} word={w} index={i} total={words.length} progress={scrollYProgress} />
          ))}
        </motion.p>
      </div>
    </section>
  )
}
