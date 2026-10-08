// Função serverless (Vercel) que cria um Checkout Asaas e devolve o link de pagamento.
// A chave de API fica só no servidor, na variável de ambiente ASAAS_API_KEY.
//
// POST /api/checkout
//   { plan: 'landing' | 'loja' | 'automacao', kind: 'project' }                      -> projeto (Pix ou cartão em até INSTALLMENTS x)
//   { plan: ..., kind: 'care', billing: 'monthly' | 'annual' }                        -> assinatura de manutenção (cartão recorrente)
import { INSTALLMENTS, isPlanId, pricing } from '../src/pricing'

const API_BASE = process.env.ASAAS_ENV === 'production' ? 'https://api.asaas.com' : 'https://api-sandbox.asaas.com'

// Primeira cobrança da manutenção: dias depois da contratação (tempo para entregar o projeto).
const CARE_FIRST_CHARGE_DAYS = 30

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

const isoDate = (d: Date) => d.toISOString().slice(0, 10)

async function imageBase64(origin: string, plan: string) {
  // Usa public/checkout/<plano>.png se existir; senão, o logo.
  for (const path of [`/checkout/${plan}.png`, '/logo-gf.png']) {
    const res = await fetch(origin + path)
    if (res.ok && res.headers.get('content-type')?.startsWith('image/')) {
      return Buffer.from(await res.arrayBuffer()).toString('base64')
    }
  }
  throw new Error('Imagem do checkout não encontrada')
}

export async function POST(request: Request) {
  const apiKey = process.env.ASAAS_API_KEY
  if (!apiKey) return json({ error: 'ASAAS_API_KEY não configurada' }, 500)

  const body = await request.json().catch(() => null)
  const plan = body?.plan
  const kind = body?.kind
  const billing = body?.billing === 'annual' ? 'annual' : 'monthly'
  if (!isPlanId(plan) || (kind !== 'project' && kind !== 'care')) {
    return json({ error: 'Plano inválido' }, 400)
  }

  const p = pricing[plan]
  const origin = new URL(request.url).origin
  const back = (status: string) => `${origin}/?pagamento=${status}&plano=${plan}&tipo=${kind}#planos`

  const base = {
    minutesToExpire: 60,
    externalReference: `${plan}:${kind}${kind === 'care' ? `:${billing}` : ''}`,
    callback: { successUrl: back('sucesso'), cancelUrl: back('cancelado'), expiredUrl: back('expirado') },
  }

  const checkout =
    kind === 'project'
      ? {
          ...base,
          billingTypes: ['PIX', 'CREDIT_CARD'],
          chargeTypes: ['DETACHED', 'INSTALLMENT'],
          installment: { maxInstallmentCount: INSTALLMENTS },
          items: [{ name: p.name.slice(0, 30), description: p.checkoutDesc, quantity: 1, value: p.price, imageBase64: await imageBase64(origin, plan) }],
        }
      : {
          ...base,
          billingTypes: ['CREDIT_CARD'],
          chargeTypes: ['RECURRENT'],
          subscription: {
            cycle: billing === 'annual' ? 'YEARLY' : 'MONTHLY',
            nextDueDate: isoDate(new Date(Date.now() + CARE_FIRST_CHARGE_DAYS * 864e5)),
          },
          items: [{
            name: `Manutenção ${billing === 'annual' ? 'anual' : 'mensal'}`,
            description: `${p.name}: hospedagem, domínio, SSL, segurança e suporte.`,
            quantity: 1,
            value: billing === 'annual' ? p.careAnnual * 12 : p.care,
            imageBase64: await imageBase64(origin, plan),
          }],
        }

  const res = await fetch(`${API_BASE}/v3/checkouts`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', access_token: apiKey, 'User-Agent': 'meusite/1.0.0' },
    body: JSON.stringify(checkout),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.link) {
    console.error('Asaas checkout error', res.status, data)
    return json({ error: 'Não foi possível criar o checkout' }, 502)
  }
  return json({ link: data.link })
}
