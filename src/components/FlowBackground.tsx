import { useEffect, useRef } from 'react'

// Fundo fluido em canvas: várias ondas de luz azul correndo pelo bloco.
// - Fluem continuamente (cada onda com velocidade e frequência próprias)
// - Se curvam em direção ao cursor
// - Aceleram enquanto a página é rolada
// Pausa quando sai da tela e respeita "reduzir movimento" do sistema.
const WAVES = [
  { amp: 0.16, freq: 1.6, speed: 0.55, y: 0.35, width: 2.2, color: [140, 210, 255], alpha: 0.55 },
  { amp: 0.22, freq: 1.1, speed: -0.4, y: 0.5, width: 1.4, color: [76, 194, 255], alpha: 0.45 },
  { amp: 0.12, freq: 2.4, speed: 0.8, y: 0.62, width: 1, color: [200, 230, 255], alpha: 0.35 },
  { amp: 0.28, freq: 0.8, speed: 0.3, y: 0.45, width: 18, color: [40, 150, 240], alpha: 0.18 },
  { amp: 0.2, freq: 1.3, speed: -0.65, y: 0.7, width: 10, color: [90, 180, 255], alpha: 0.14 },
  { amp: 0.1, freq: 3.2, speed: 1.1, y: 0.28, width: 0.8, color: [255, 255, 255], alpha: 0.3 },
]

export default function FlowBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let raf = 0
    let visible = false
    let t = 0
    let boost = 0 // aceleração vinda do scroll
    let lastScroll = window.scrollY
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0, tactive: 0 }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      mouse.x += (mouse.tx - mouse.x) * 0.06
      mouse.y += (mouse.ty - mouse.y) * 0.06
      mouse.active += (mouse.tactive - mouse.active) * 0.05

      for (const wave of WAVES) {
        ctx.beginPath()
        const step = 8
        for (let x = -step; x <= w + step; x += step) {
          const nx = x / w
          const phase = t * wave.speed
          let y =
            Math.sin(nx * Math.PI * wave.freq + phase) * 0.6 +
            Math.sin(nx * Math.PI * wave.freq * 2.3 - phase * 1.4) * 0.25 +
            Math.sin(nx * Math.PI * 0.7 + phase * 0.5) * 0.15
          y = wave.y + y * wave.amp
          // Puxa a onda na direção do cursor, com força maior perto dele.
          const dx = nx - mouse.x
          const pull = Math.exp(-(dx * dx) / 0.035) * mouse.active
          y += (mouse.y - y) * pull * 0.55
          const py = y * h
          if (x === -step) ctx.moveTo(x, py)
          else ctx.lineTo(x, py)
        }
        const [r, g, b] = wave.color
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${wave.alpha})`
        ctx.lineWidth = wave.width
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`
        ctx.shadowBlur = wave.width > 5 ? 30 : 12
        ctx.stroke()
      }
      ctx.shadowBlur = 0
      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = () => {
      const scroll = window.scrollY
      boost = Math.min(boost + Math.abs(scroll - lastScroll) * 0.0025, 3)
      lastScroll = scroll
      boost *= 0.94
      t += 0.012 * (1 + boost)
      draw()
      if (visible) raf = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.tx = (e.clientX - r.left) / r.width
      mouse.ty = (e.clientY - r.top) / r.height
      mouse.tactive = 1
    }
    const onLeave = () => { mouse.tactive = 0 }

    resize()
    const host = canvas.parentElement!
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', resize)

    if (reduced) {
      draw()
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(raf)
      if (visible && !reduced) raf = requestAnimationFrame(loop)
    })
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="flow-bg" aria-hidden />
}
