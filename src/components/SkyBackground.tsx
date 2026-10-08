import { useEffect, useRef } from 'react'

// Céu com nuvens 3D (Vanta Clouds + three.js) no fundo do CTA.
// - Carrega o three.js só quando o bloco está chegando na tela (não pesa o início do site)
// - Céu de dia no modo claro e céu noturno no modo escuro, trocando junto com o tema
// - As nuvens reagem ao mouse; respeita "reduzir movimento" do sistema
const SKIES = {
  light: {
    backgroundColor: 0xffffff,
    skyColor: 0x3d8fd1,
    cloudColor: 0xb4c8e0,
    cloudShadowColor: 0x1a3a5c,
    sunColor: 0xe6f4ff,
    sunGlareColor: 0x8ccaff,
    sunlightColor: 0xdcecff,
    speed: 0.7,
  },
  dark: {
    backgroundColor: 0x000000,
    skyColor: 0x0d3163,
    cloudColor: 0x46689a,
    cloudShadowColor: 0x040b16,
    sunColor: 0x6fb6ff,
    sunGlareColor: 0x1f5fa3,
    sunlightColor: 0x6d93c4,
    speed: 0.6,
  },
}

type VantaEffect = { destroy: () => void; setOptions: (o: object) => void }

const currentSky = () => (document.documentElement.dataset.theme === 'dark' ? SKIES.dark : SKIES.light)

export default function SkyBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let effect: VantaEffect | null = null
    let cancelled = false

    const start = async () => {
      const [THREE, { default: CLOUDS }] = await Promise.all([import('three'), import('vanta/dist/vanta.clouds.min')])
      if (cancelled || effect) return
      effect = CLOUDS({
        el,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        ...currentSky(),
        ...(reduced ? { speed: 0 } : {}),
      }) as VantaEffect
    }

    // Só inicia quando o bloco estiver perto de aparecer.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        io.disconnect()
        start()
      }
    }, { rootMargin: '400px' })
    io.observe(el)

    // Acompanha a troca de tema claro/escuro.
    const themeObserver = new MutationObserver(() => effect?.setOptions(currentSky()))
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      cancelled = true
      io.disconnect()
      themeObserver.disconnect()
      effect?.destroy()
    }
  }, [])

  return <div ref={ref} className="sky-bg" aria-hidden />
}
