import { useEffect, useRef } from 'react'
import { stagger, useAnimate, useReducedMotion } from 'framer-motion'
import { brand } from '../content'

// Logo "fantın" com o pingo do i animado.
// Entrada: as letras sobem desfocando para nítido, o pingo surge no alto e cai,
// achata ao tocar no i, solta uma onda e as letras fazem uma "ola".
// Depois o pingo pulsa de leve, como status de site no ar. No hover ele dá um pulinho.

// Ajuste fino do espaço entre cada letra (em em), para o desenho ficar equilibrado
const LETTERS: [string, number][] = [['f', -0.02], ['a', -0.01], ['n', 0], ['t', -0.015], ['ı', 0.005], ['n', 0]]

const fall = [0.55, 0, 1, 0.45] as const // acelera ao cair, como gravidade
const out = [0.22, 1, 0.36, 1] as const

export default function Logo({ intro = true }: { intro?: boolean }) {
  const [scope, animate] = useAnimate()
  const reduce = useReducedMotion()
  const busy = useRef(false)

  // Pingo encosta no i: achata, solta a onda e as letras respondem
  const impact = () => {
    animate('.wm__dot', { scaleX: [1.5, 0.88, 1], scaleY: [0.55, 1.15, 1] }, { duration: 0.5, ease: 'easeOut' })
    animate('.wm__ripple', { scale: [0.6, 3.4], opacity: [0.65, 0] }, { duration: 0.8, ease: 'easeOut' })
    return animate('.wm__l', { y: ['0em', '-0.11em', '0em'] }, { duration: 0.42, delay: stagger(0.045, { from: 4 }), ease: 'easeInOut' })
  }

  useEffect(() => {
    if (!intro || reduce) return
    busy.current = true
    const run = async () => {
      animate('.wm__l', { opacity: [0, 1], y: ['0.5em', '0em'], filter: ['blur(6px)', 'blur(0px)'] }, { duration: 0.75, delay: stagger(0.06, { startDelay: 0.35 }), ease: out })
      // O pingo surge parado no alto, segura um instante e cai (esticando um pouco na queda)
      await animate('.wm__dot', { y: '-1.5em', scale: [0, 1], opacity: [0, 1] }, { duration: 0.3, delay: 0.85, ease: out })
      await animate('.wm__dot', { y: ['-1.5em', '0em'], scaleX: [1, 0.85], scaleY: [1, 1.25] }, { duration: 0.42, delay: 0.12, ease: fall })
      await impact()
      busy.current = false
      scope.current?.classList.add('is-live') // libera o pulso contínuo
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hop = async () => {
    if (reduce || busy.current) return
    busy.current = true
    await animate('.wm__dot', { y: ['0em', '-0.75em', '0em'], scaleY: [1, 1.12, 1] }, { duration: 0.5, times: [0, 0.45, 1], ease: ['easeOut', 'easeIn'] })
    await impact()
    busy.current = false
  }

  return (
    <a
      ref={scope}
      href="/"
      className={`logo wm${intro && !reduce ? ' wm--intro' : ' is-live'}`}
      aria-label={brand.name}
      onMouseEnter={hop}
      onFocus={hop}
    >
      <span className="wm__word" aria-hidden>
        {LETTERS.map(([ch, k], i) => (
          <span key={i} className={`wm__l${ch === 'ı' ? ' wm__i' : ''}`} style={{ marginRight: `${k}em` }}>
            {ch}
            {ch === 'ı' && (
              <span className="wm__drop">
                <span className="wm__ripple" />
                <span className="wm__dot" />
              </span>
            )}
          </span>
        ))}
      </span>
    </a>
  )
}
