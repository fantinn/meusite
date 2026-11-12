import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { brand } from '../content'
import { LETTERS } from './Logo'

// Logo "fantın" gigante que fecha o site (rodapé), na largura toda da página.
// Quando entra na tela: as letras sobem de trás de uma linha, o pingo cai do alto, amassa ao
// tocar no ı, solta uma onda e as letras respondem. Por dentro das letras passa o céu do hero,
// bem devagar. Com o mouse, as letras perto do cursor levantam.
// A coreografia é toda CSS (.bw em global.css); aqui só fica o que precisa de medida ou de rolagem.
// Quem pediu menos movimento no sistema (<html data-fx="soft">) vê o logo pronto, parado.
const I = LETTERS.findIndex(([ch]) => ch === 'ı')

export default function BigMark() {
  const ref = useRef<HTMLAnchorElement>(null)
  const [phase, setPhase] = useState<'still' | 'wait' | 'play'>('still')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const letters = Array.from(el.querySelectorAll<HTMLElement>('.bw__l'))

    // Cada letra recebe a própria posição dentro da palavra, para o céu ser um só atrás de todas
    const measure = () => {
      const left = el.getBoundingClientRect().left
      el.style.setProperty('--w', `${el.offsetWidth}px`)
      for (const l of letters) {
        const g = l.querySelector<HTMLElement>('.bw__g')
        g?.style.setProperty('--x', `${(l.getBoundingClientRect().left - left + g.offsetLeft).toFixed(1)}px`)
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    document.fonts?.ready.then(measure)

    if (document.documentElement.dataset.fx !== 'full') return () => ro.disconnect()

    // Toca quando metade do logo aparece; saiu inteiro da tela, rearma para tocar de novo
    setPhase('wait')
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.5) setPhase('play')
        else if (!e.isIntersecting) setPhase('wait')
      },
      { threshold: [0, 0.5] },
    )
    io.observe(el)
    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  // As letras perto do cursor levantam (--lift vai de 0 a 1 e o CSS transforma em deslocamento)
  const lift = (e: PointerEvent<HTMLAnchorElement>) => {
    if (phase !== 'play' || e.pointerType !== 'mouse') return
    const reach = e.currentTarget.offsetWidth * 0.22
    e.currentTarget.querySelectorAll<HTMLElement>('.bw__l').forEach((l) => {
      const b = l.getBoundingClientRect()
      const k = Math.max(0, 1 - Math.abs(e.clientX - (b.left + b.width / 2)) / reach)
      l.style.setProperty('--lift', (k * k * (3 - 2 * k)).toFixed(3))
    })
  }
  const settle = (e: PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.querySelectorAll<HTMLElement>('.bw__l').forEach((l) => l.style.removeProperty('--lift'))
  }

  return (
    <a
      ref={ref}
      href="/"
      className={`bw bw--sky footer__mark is-${phase}`}
      aria-label={`fantın, ${brand.name}`}
      onPointerMove={lift}
      onPointerLeave={settle}
    >
      {LETTERS.map(([ch, k], i) => (
        <span
          key={i}
          className={`bw__l${i === I ? ' bw__i' : ''}`}
          style={{ marginRight: `${k}em`, '--i': i, '--d': Math.abs(i - I) } as CSSProperties}
          aria-hidden
        >
          <span className="bw__m">
            <span className="bw__g">{ch}</span>
          </span>
          {i === I && (
            <span className="bw__drop">
              <span className="bw__ripple" />
              <span className="bw__dot" />
            </span>
          )}
        </span>
      ))}
    </a>
  )
}
