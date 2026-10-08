import type { PlanId } from './pricing'

export type Billing = 'monthly' | 'annual'

// Cria um Checkout Asaas via /api/checkout e redireciona o cliente para ele.
export async function startCheckout(plan: PlanId, kind: 'project' | 'care', billing: Billing = 'monthly') {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ plan, kind, billing }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.link) throw new Error(data.error || 'Falha ao criar checkout')
  window.location.href = data.link
}
