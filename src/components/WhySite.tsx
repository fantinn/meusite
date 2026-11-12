import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Volume2, VolumeX } from 'lucide-react'

// "Por que ter um site": o reel do concorrente (public/video/concorrente.mp4) num cartão escuro,
// com a história contada ao lado em 3 passos que acendem junto com o vídeo.
// - O vídeo só é baixado e tocado quando a seção aparece; saiu da tela, pausa.
// - Começa sem som (regra dos navegadores para tocar sozinho); o botão no canto liga o áudio.
// - Clicar num passo leva o vídeo para aquele trecho.
// O trecho final do reel ("Comenta SITE") foi cortado: aqui quem faz esse papel é o botão.
const STEPS = [
  { at: 0, title: 'Ele não é melhor. Só aparece.', text: 'Seu concorrente faz um trabalho pior que o seu e mesmo assim está lotado.' },
  { at: 7, title: 'O cliente pesquisou e você não estava lá.', text: 'Ele estava a 2 ruas de você, procurou no Google e passou direto.' },
  { at: 15.6, title: 'Com o site no ar, ele te acha.', text: 'Encontra você na busca, vê o seu trabalho e te chama no WhatsApp.' },
]

export default function WhySite() {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [step, setStep] = useState(0)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const el = root.current
    const v = video.current
    if (!el || !v) return
    // O React não grava o atributo "muted" no HTML pré-renderizado; sem isto o navegador bloqueia o play
    v.muted = true

    // Enquanto toca, acompanha o tempo do vídeo: qual passo está aceso e quanto dele já passou (--p).
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = v.currentTime
      let i = STEPS.length - 1
      while (i > 0 && t < STEPS[i].at) i--
      const end = i < STEPS.length - 1 ? STEPS[i + 1].at : v.duration || 22
      el.style.setProperty('--p', Math.min(1, Math.max(0, (t - STEPS[i].at) / (end - STEPS[i].at))).toFixed(3))
      setStep(i)
    }
    const onPlay = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }
    const onPause = () => cancelAnimationFrame(raf)
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.35 },
    )
    io.observe(v)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
    }
  }, [])

  const goTo = (i: number) => {
    const v = video.current
    if (!v) return
    v.currentTime = STEPS[i].at
    setStep(i)
    v.play().catch(() => {})
  }

  const toggleSound = () => {
    const v = video.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    if (v.paused) v.play().catch(() => {})
  }

  return (
    <section ref={root} id="por-que" className="section why">
      <div className="container">
        <div className="why__card">
          <div className="why__head">
            <span className="why__kicker">Por que ter um site</span>
            <h2>
              Seu concorrente é <em>pior</em> que você. E tá lotado.
            </h2>
          </div>

          <div className="why__media">
            <div className="why__frame">
              <video
                ref={video}
                className="why__video"
                src="/video/concorrente.mp4"
                poster="/video/concorrente.webp"
                width={720}
                height={1280}
                muted
                loop
                playsInline
                preload="none"
                aria-label="Animação: o cliente pesquisa no Google, encontra o concorrente e passa direto por você. Com o site no ar, ele te acha e te chama."
              />
              <button className="why__sound" onClick={toggleSound} aria-label={muted ? 'Ligar o som do vídeo' : 'Desligar o som do vídeo'} aria-pressed={!muted}>
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>

          <ol className="why__steps">
            {STEPS.map((s, i) => (
              <li key={s.at} className={`why__step${i === step ? ' is-on' : ''}`}>
                <button onClick={() => goTo(i)} aria-current={i === step ? 'step' : undefined}>
                  <span className="why__bar" aria-hidden />
                  <strong>{s.title}</strong>
                  <span>{s.text}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="why__cta">
            <a href="#contato" className="btn why__btn">
              Quero ser achado <ArrowRight size={18} />
            </a>
            <a href="#planos" className="why__link">Ver planos e preços</a>
          </div>
        </div>
      </div>
    </section>
  )
}
