import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'

const TEXT = 'Design limpo. Um site que trabalha por você enquanto você cuida do seu negócio.'

function Word({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  // Cada palavra acende um pouco antes de chegar ao centro da tela.
  const start = (index / total) * 0.9
  const end = start + 0.9 / total
  const opacity = useTransform(progress, [start, end], [0.15, 1])
  return <motion.span className="statement__word" style={{ opacity }}>{word}</motion.span>
}

// Frase gigante em uma linha: fica fixa na tela e passa para o lado enquanto você rola.
export default function Statement() {
  const ref = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLParagraphElement>(null)
  const [distance, setDistance] = useState(0)

  useLayoutEffect(() => {
    const measure = () => {
      const line = lineRef.current
      if (line) setDistance(Math.max(0, line.scrollWidth - window.innerWidth * 0.6))
    }
    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 160, damping: 34, mass: 0.3 })
  const x = useTransform(p, [0, 1], [0, -distance])
  const words = TEXT.split(' ')

  return (
    // A frase anda mais rápido que o scroll (0,55px de rolagem por 1px na horizontal) para não ficar longa demais.
    <section ref={ref} className="statement" style={{ height: `calc(100vh + ${Math.round(distance * 0.55)}px)` }}>
      <div className="statement__sticky">
        <motion.p ref={lineRef} className="statement__text" style={{ x }}>
          {words.map((w, i) => (
            <Fragment key={i}>
              <Word word={w} index={i} total={words.length} progress={p} />
              {i < words.length - 1 && ' '}
            </Fragment>
          ))}
        </motion.p>
      </div>
    </section>
  )
}
