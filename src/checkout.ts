import { payLinks, type PlanId } from './pricing'

export type Billing = 'monthly' | 'annual'

// Projeto: abre o link de pagamento fixo do Asaas. Manutenção: cria um Checkout via /api/checkout e redireciona.
export async function startCheckout(plan: PlanId, kind: 'project' | 'care', billing: Billing = 'monthly') {
  if (kind === 'project') {
    window.location.href = payLinks[plan]
    return
  }
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ plan, kind, billing }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.link) throw new Error(data.error || 'Falha ao criar checkout')
  window.location.href = data.link
}
