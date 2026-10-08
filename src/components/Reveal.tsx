import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

export const ease = [0.1, 0.9, 0.2, 1] as const

// Movimento contínuo ligado ao scroll: o elemento desloca de `speed`px (para baixo)
// até -`speed`px (para cima) durante todo o tempo em que atravessa a tela.
export function Parallax({ children, className, speed = 60, x = 0 }: { children: ReactNode; className?: string; speed?: number; x?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const p = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 })
  const y = useTransform(p, [0, 1], [speed, -speed])
  const tx = useTransform(p, [0, 1], [x, -x])
  return (
    <motion.div ref={ref} className={className} style={{ y, x: tx }}>
      {children}
    </motion.div>
  )
}

type Props = { children: ReactNode; className?: string; delay?: number }

export default function Reveal({ children, className }: Props) {
  return <div className={className}>{children}</div>
}

type HeadProps = { kicker: string; title: string; text?: string; center?: boolean; still?: boolean }

export function SectionHead({ still, ...props }: HeadProps) {
  if (still) {
    const { kicker, title, text, center } = props
    return (
      <div className={`section__head${center ? ' section__head--center' : ''}`}>
        <span className="kicker">{kicker}</span>
        <span className="kicker__line" aria-hidden />
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
    )
  }
  return <MovingSectionHead {...props} />
}

function MovingSectionHead({ kicker, title, text, center }: HeadProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const p = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 })
  // Título e texto em velocidades diferentes enquanto a seção passa.
  const titleY = useTransform(p, [0, 1], [50, -50])
  const textY = useTransform(p, [0, 1], [90, -30])
  const line = useTransform(p, [0.15, 0.5], [0, 1])
  return (
    <div ref={ref} className={`section__head${center ? ' section__head--center' : ''}`}>
      <span className="kicker">{kicker}</span>
      <motion.span className="kicker__line" style={{ scaleX: line }} aria-hidden />
      <motion.h2 style={{ y: titleY }}>{title}</motion.h2>
      {text && <motion.p style={{ y: textY }}>{text}</motion.p>}
    </div>
  )
}
