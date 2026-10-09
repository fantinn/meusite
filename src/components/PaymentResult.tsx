import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Clock, X, XCircle } from 'lucide-react'
import { isPlanId, pricing, type PlanId } from '../pricing'
import { CheckoutButton } from './Pricing'
import { ease } from './Reveal'

type Result = { status: 'sucesso' | 'cancelado' | 'expirado'; plan: PlanId; kind: 'project' | 'care' }

// Lê o retorno do Checkout Asaas (?pagamento=...&plano=...&tipo=...) e mostra o próximo passo.
function readResult(): Result | null {
  const q = new URLSearchParams(window.location.search)
  const status = q.get('pagamento')
  const plan = q.get('plano')
  const kind = q.get('tipo') === 'care' ? 'care' : 'project'
  if ((status === 'sucesso' || status === 'cancelado' || status === 'expirado') && isPlanId(plan)) return { status, plan, kind }
  return null
}

export default function PaymentResult() {
  // Lido depois de montar: o HTML pré-renderizado não tem a URL do visitante
  const [result, setResult] = useState<Result | null>(null)
  useEffect(() => setResult(readResult()), [])

  const close = () => {
    setResult(null)
    window.history.replaceState(null, '', window.location.pathname + window.location.hash)
  }

  useEffect(() => {
    if (!result) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [result])

  const p = result && pricing[result.plan]

  return (
    <AnimatePresence>
      {result && p && (
        <>
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <div className="modal-wrap">
            <motion.div
              className="modal pay-result"
              role="dialog"
              aria-modal
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.5, ease }}
            >
              <button className="modal__close" onClick={close} aria-label="Fechar"><X size={18} /></button>

              {result.status === 'sucesso' ? (
                <>
                  <motion.span className="pay-result__icon is-ok" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 }}>
                    <CheckCircle2 size={36} />
                  </motion.span>
                  {result.kind === 'project' ? (
                    <>
                      <h3>Pagamento recebido!</h3>
                      <p>Obrigado por fechar a <strong>{p.name}</strong>. Vou entrar em contato pelo WhatsApp para começarmos.</p>
                      <p>Último passo: ative a manutenção para deixar tudo no ar, com hospedagem, domínio, segurança e suporte. A primeira cobrança só acontece daqui a 30 dias.</p>
                      <div className="pay-result__options">
                        <CheckoutButton plan={result.plan} kind="care" billing="annual" className="btn btn--primary">
                          Anual · R$ {p.careAnnual}/mês
                        </CheckoutButton>
                        <CheckoutButton plan={result.plan} kind="care" billing="monthly" className="btn btn--ghost">
                          Mensal · R$ {p.care}/mês
                        </CheckoutButton>
                      </div>
                      <small>O anual é cobrado uma vez por ano (R$ {p.careAnnual * 12}).</small>
                    </>
                  ) : (
                    <>
                      <h3>Manutenção ativada!</h3>
                      <p>Tudo certo. Seu projeto fica no ar, seguro e com suporte direto comigo. Qualquer coisa, é só chamar no WhatsApp.</p>
                      <button className="btn btn--primary" onClick={close}>Fechar</button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <span className="pay-result__icon is-warn">{result.status === 'expirado' ? <Clock size={36} /> : <XCircle size={36} />}</span>
                  <h3>{result.status === 'expirado' ? 'O tempo para pagamento expirou' : 'Pagamento não concluído'}</h3>
                  <p>Sem problemas, nada foi cobrado. Você pode tentar de novo agora ou falar comigo se tiver alguma dúvida.</p>
                  <div className="pay-result__options">
                    <CheckoutButton plan={result.plan} kind={result.kind} className="btn btn--primary">Tentar novamente</CheckoutButton>
                    <a href="#contato" className="btn btn--ghost" onClick={close}>Falar comigo</a>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
