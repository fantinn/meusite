import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { Check, Loader2, RefreshCw, ShieldCheck } from 'lucide-react'
import { INSTALLMENTS, plans, plansNote, type Plan } from '../content'
import { startCheckout, type Billing } from '../checkout'
import type { PlanId } from '../pricing'
import Card from './Card'
import FlowBackground from './FlowBackground'
import Reveal, { SectionHead, ease } from './Reveal'

export function CheckoutButton({ plan, kind = 'project', billing, className, children }: {
  plan: PlanId
  kind?: 'project' | 'care'
  billing?: Billing
  className: string
  children: ReactNode
}) {
  const [loading, setLoading] = useState(false)
  const go = async () => {
    setLoading(true)
    try {
      await startCheckout(plan, kind, billing)
    } catch {
      // Sem checkout disponível (ex.: API não configurada): leva para o formulário de contato.
      setLoading(false)
      document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })
    }
  }
  return (
    <motion.button className={className} onClick={go} disabled={loading} whileTap={{ scale: 0.97 }}>
      {loading ? <><Loader2 size={18} className="spin" /> Abrindo pagamento…</> : children}
    </motion.button>
  )
}

const brl = (v: number) => v.toLocaleString('pt-BR', { maximumFractionDigits: 0 })

const careFor = (p: Plan, billing: Billing) => (billing === 'annual' ? p.careAnnual : p.care)

function BillingSwitch({ value, onChange, id = 'billing-pill' }: { value: Billing; onChange: (b: Billing) => void; id?: string }) {
  const options: { id: Billing; label: string }[] = [
    { id: 'monthly', label: 'Mensal' },
    { id: 'annual', label: 'Anual' },
  ]
  return (
    <div className="billing" role="radiogroup" aria-label="Plano de manutenção">
      {options.map((o) => (
        <button key={o.id} role="radio" aria-checked={value === o.id} className={`billing__opt${value === o.id ? ' is-active' : ''}`} onClick={() => onChange(o.id)}>
          {value === o.id && <motion.span layoutId={id} className="billing__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span>{o.label}</span>
          {o.id === 'annual' && <span className="billing__save">economize</span>}
        </button>
      ))}
    </div>
  )
}

function AnimatedNumber({ value, up }: { value: number; up: boolean }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        initial={{ opacity: 0, y: up ? -14 : 14, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: up ? 14 : -14, filter: 'blur(4px)' }}
        transition={{ duration: 0.35, ease }}
        style={{ display: 'inline-block' }}
      >
        {brl(value)}
      </motion.span>
    </AnimatePresence>
  )
}

// Zoom de "câmera" só no computador, e só se a tela tiver altura suficiente
const ZOOM_QUERY = '(min-width: 1024px) and (min-height: 620px)'
const FOCUS_SAFE = 16 // margem embaixo quando os cards estão em foco
const FOCUS_TOP = 54 // em cima fica a chave Mensal/Anual flutuante, no lugar do menu

function useZoomStage() {
  // Começa desligado (igual ao HTML pré-renderizado) e liga depois de montar
  const [on, setOn] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(ZOOM_QUERY)
    const update = () => setOn(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return on
}

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>('annual')

  // A seção chega no tamanho normal; quando ela prende na tela, a "câmera" faz um zoom
  // animado (não ligado ao scroll) até os cards ocuparem a tela inteiros, e fica assim
  // enquanto se rola por ela. No fim da seção o zoom volta ao normal.
  const zoom = useZoomStage()
  const stageRef = useRef<HTMLElement>(null)
  const cameraRef = useRef<HTMLDivElement>(null)
  const plansRef = useRef<HTMLDivElement>(null)
  const billingRef = useRef<HTMLDivElement>(null)
  const metrics = useRef({ s1: 1, y1: 0 })
  const focus = useMotionValue(0) // 0 = normal, 1 = em foco
  const focused = useRef(false)
  const [showFloat, setShowFloat] = useState(false)
  const scale = useMotionValue(1)
  const y = useMotionValue(0)
  const billingOpacity = useTransform(focus, [0, 0.35], [1, 0])
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end end'] })

  const render = (k: number) => {
    const m = metrics.current
    scale.set(1 + (m.s1 - 1) * k)
    y.set(m.y1 * k)
  }
  useMotionValueEvent(focus, 'change', render)

  const update = (p: number) => {
    const next = p > 0.02 && p < 0.97
    if (next === focused.current) return
    focused.current = next
    setShowFloat(next)
    // Durante a animação o zoom roda na GPU (will-change); depois volta ao normal
    // para o texto ficar nítido no tamanho final
    const camera = cameraRef.current
    if (camera) camera.style.willChange = 'transform'
    animate(focus, next ? 1 : 0, { duration: 0.9, ease: [0.22, 1, 0.36, 1] }).then(() => {
      if (camera) camera.style.willChange = 'auto'
    })
    // O menu some enquanto os cards estão em foco
    if (next) document.documentElement.dataset.navHidden = ''
    else delete document.documentElement.dataset.navHidden
  }
  useMotionValueEvent(scrollYProgress, 'change', (p) => zoom && update(p))

  useLayoutEffect(() => {
    const camera = cameraRef.current
    const cards = plansRef.current
    if (!zoom || !camera || !cards) return
    const measure = () => {
      // Foco: só os cards (posições sem o zoom atual); a chave vai flutuando no topo
      const cam = camera.getBoundingClientRect()
      const focusTop = (cards.getBoundingClientRect().top - cam.top) / scale.get()
      const focusH = cards.offsetHeight
      // No foco o menu some, então os cards podem usar quase a altura toda da tela
      const avail = window.innerHeight - FOCUS_TOP - FOCUS_SAFE
      const s1 = Math.min(1.25, avail / focusH)
      metrics.current = { s1, y1: FOCUS_TOP + (avail - focusH * s1) / 2 - focusTop * s1 }
      render(focus.get())
      update(scrollYProgress.get())
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(camera)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      delete document.documentElement.dataset.navHidden
      focused.current = false
      focus.set(0)
    }
  }, [zoom])

  return (
    <section ref={stageRef} id="planos" className={`section${zoom ? ' pricing--zoom' : ''}`}>
      <div className="pricing__sticky">
      <AnimatePresence>
        {zoom && showFloat && (
          <motion.div
            className="billing-float"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease }}
          >
            <BillingSwitch value={billing} onChange={setBilling} id="billing-pill-float" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div ref={cameraRef} className="pricing__camera" style={zoom ? { scale, y } : undefined}>
      <div className="container">
        <SectionHead
          kicker="Planos"
          title="Seu site pronto, e sempre funcionando."
          text="Você paga a criação uma única vez e mantém tudo no ar com uma manutenção que cabe no bolso: hospedagem, domínio, segurança e suporte inclusos."
          center
          still
        />

        {/* Some durante o foco, quando a versão flutuante assume o lugar */}
        <motion.div ref={billingRef} style={zoom ? { opacity: billingOpacity } : undefined}>
        <Reveal className="billing-wrap">
          <BillingSwitch value={billing} onChange={setBilling} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={billing}
              className="billing__hint"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {billing === 'annual'
                ? ''
                : 'Sem fidelidade: cancele a manutenção quando quiser.'}
            </motion.p>
          </AnimatePresence>
        </Reveal>
        </motion.div>

        <div ref={plansRef} className="plans">
          {plans.map((p) => {
            const Icon = p.icon
            const care = careFor(p, billing)
            const yearlySaving = (p.care - p.careAnnual) * 12
            return (
              <div key={p.name}>
              <Card className={`plan${p.featured ? ' is-featured' : ''}`} style={{ height: '100%' }}>
                {p.featured && (
                  <>
                    {/* Ondas de luz animadas no rodapé do card em destaque */}
                    <div className="plan__glow" aria-hidden><FlowBackground /></div>
                    <span className="plan__badge">Mais popular</span>
                  </>
                )}
                <div className="card__icon"><Icon size={24} /></div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>

                <div className="plan__pricing">
                  <span className="plan__from">{p.from ? 'Projeto a partir de' : 'Projeto'}</span>
                  <div className="plan__price">
                    <span className="plan__currency">R$</span>
                    {brl(p.price)}
                  </div>
                  <div className="plan__setup">ou {INSTALLMENTS}x de R$ {brl(Math.ceil(p.price / INSTALLMENTS))} sem juros</div>
                </div>

                <ul>
                  {p.features.map((f) => <li key={f}><Check size={16} />{f}</li>)}
                </ul>

                <div className="care">
                  <div className="care__head">
                    <span className="care__title"><RefreshCw size={14} /> Manutenção</span>
                    <span className="care__price">
                      + R$ <AnimatedNumber value={care} up={billing === 'annual'} /><small>/mês</small>
                    </span>
                  </div>
                  <AnimatePresence initial={false}>
                    {billing === 'annual' && (
                      <motion.div
                        className="care__saving"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease }}
                      >
                        Economia de R$ {brl(yearlySaving)} por ano
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <ul>
                    {p.careFeatures.map((f) => <li key={f}><Check size={14} />{f}</li>)}
                  </ul>
                </div>

                <CheckoutButton plan={p.id} className={`btn ${p.featured ? 'btn--primary' : 'btn--ghost'}`}>
                  Quero esse plano
                </CheckoutButton>
              </Card>
              </div>
            )
          })}
        </div>

        <Reveal className="plans__included" delay={0.1}>
          <ShieldCheck size={18} />
          <span>{plansNote}</span>
        </Reveal>
      </div>
      </motion.div>
      </div>
    </section>
  )
}
