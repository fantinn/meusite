import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2, RefreshCw, ShieldCheck } from 'lucide-react'
import { INSTALLMENTS, plans, plansNote, type Plan } from '../content'
import { startCheckout, type Billing } from '../checkout'
import type { PlanId } from '../pricing'
import Card from './Card'
import Reveal, { ScrollItem, SectionHead, ease } from './Reveal'

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

function BillingSwitch({ value, onChange }: { value: Billing; onChange: (b: Billing) => void }) {
  const options: { id: Billing; label: string }[] = [
    { id: 'monthly', label: 'Mensal' },
    { id: 'annual', label: 'Anual' },
  ]
  return (
    <div className="billing" role="radiogroup" aria-label="Plano de manutenção">
      {options.map((o) => (
        <button key={o.id} role="radio" aria-checked={value === o.id} className={`billing__opt${value === o.id ? ' is-active' : ''}`} onClick={() => onChange(o.id)}>
          {value === o.id && <motion.span layoutId="billing-pill" className="billing__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
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

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>('annual')

  return (
    <section id="planos" className="section">
      <div className="container">
        <SectionHead
          kicker="Planos"
          title="Seu projeto pronto, e sempre funcionando."
          text="Você paga a criação uma única vez e mantém tudo no ar com uma manutenção que cabe no bolso: hospedagem, domínio, segurança e suporte inclusos."
          center
        />

        <Reveal className="billing-wrap">
          <span className="billing__label">Manutenção</span>
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
                ? 'Contrato de 12 meses com mensalidade menor na manutenção.'
                : 'Sem fidelidade: cancele a manutenção quando quiser.'}
            </motion.p>
          </AnimatePresence>
        </Reveal>

        <div className="plans">
          {plans.map((p, i) => {
            const Icon = p.icon
            const care = careFor(p, billing)
            const yearlySaving = (p.care - p.careAnnual) * 12
            return (
              <ScrollItem key={p.name} index={i} tilt>
              <Card className={`plan${p.featured ? ' is-featured' : ''}`} style={{ height: '100%' }}>
                {p.featured && <span className="plan__badge">Mais popular</span>}
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
              </ScrollItem>
            )
          })}
        </div>

        <Reveal className="plans__included" delay={0.1}>
          <ShieldCheck size={18} />
          <span>{plansNote}</span>
        </Reveal>
      </div>
    </section>
  )
}
