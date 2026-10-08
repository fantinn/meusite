import { motion, useScroll, useSpring, useTransform, type Variants } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

export const ease = [0.1, 0.9, 0.2, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}

export const stagger = (delay = 0.08): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
})

// Progresso suavizado (0 → 1) de um elemento entrando na tela, amarrado ao scroll.
// `index` atrasa o fim da animação para criar efeito cascata entre itens de uma grade.
function useEnterProgress(index = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 100%', `start ${Math.max(35, 62 - index * 6)}%`],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 })
  return { ref, progress }
}

type ScrollProps = { children: ReactNode; className?: string; index?: number; distance?: number; tilt?: boolean }

// Item que sobe, cresce e aparece conforme o scroll (e volta ao rolar para cima).
export function ScrollItem({ children, className, index = 0, distance = 90, tilt = false }: ScrollProps) {
  const { ref, progress } = useEnterProgress(index)
  const y = useTransform(progress, [0, 1], [distance, 0])
  const opacity = useTransform(progress, [0, 0.6], [0, 1])
  const scale = useTransform(progress, [0, 1], [0.9, 1])
  const rotateX = useTransform(progress, [0, 1], [tilt ? 18 : 0, 0])
  return (
    <motion.div ref={ref} className={className} style={{ y, opacity, scale, rotateX, transformPerspective: 1200 }}>
      {children}
    </motion.div>
  )
}

type Props = { children: ReactNode; className?: string; delay?: number }

export default function Reveal({ children, className, delay = 0 }: Props) {
  return (
    <ScrollItem className={className} index={Math.round(delay * 10)} distance={60}>
      {children}
    </ScrollItem>
  )
}

export function SectionHead({ kicker, title, text, center }: { kicker: string; title: string; text?: string; center?: boolean }) {
  const { ref, progress } = useEnterProgress()
  const y = useTransform(progress, [0, 1], [70, 0])
  const opacity = useTransform(progress, [0, 0.7], [0, 1])
  const titleY = useTransform(progress, [0, 1], [40, 0])
  const titleBlur = useTransform(progress, [0, 1], ['blur(10px)', 'blur(0px)'])
  const line = useTransform(progress, [0.3, 1], [0, 1])
  return (
    <motion.div ref={ref} className={`section__head${center ? ' section__head--center' : ''}`} style={{ y, opacity }}>
      <span className="kicker">{kicker}</span>
      <motion.span className="kicker__line" style={{ scaleX: line }} aria-hidden />
      <motion.h2 style={{ y: titleY, filter: titleBlur }}>{title}</motion.h2>
      {text && <p>{text}</p>}
    </motion.div>
  )
}
