import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

export const ease = [0.1, 0.9, 0.2, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}

export const stagger = (delay = 0.08): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
})

type Props = { children: ReactNode; className?: string; delay?: number }

export default function Reveal({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHead({ kicker, title, text, center }: { kicker: string; title: string; text?: string; center?: boolean }) {
  return (
    <motion.div
      className={`section__head${center ? ' section__head--center' : ''}`}
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
    >
      <motion.span className="kicker" variants={fadeUp}>{kicker}</motion.span>
      <motion.h2 variants={fadeUp}>{title}</motion.h2>
      {text && <motion.p variants={fadeUp}>{text}</motion.p>}
    </motion.div>
  )
}
