import { motion, type HTMLMotionProps } from 'framer-motion'
import type { MouseEvent } from 'react'

// Card Fluent com "reveal highlight": a luz segue o cursor via CSS vars --x/--y.
export default function Card({ className = '', onMouseMove, ...props }: HTMLMotionProps<'div'>) {
  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
    onMouseMove?.(e)
  }
  return (
    <motion.div
      className={`card ${className}`}
      onMouseMove={handleMove}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      {...props}
    />
  )
}
