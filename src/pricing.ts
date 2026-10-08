// Valores dos planos em reais. Usado pelo site e pela API de checkout (api/checkout.ts),
// então o preço cobrado é sempre o mesmo que aparece na página.
// - price: valor do projeto, pago uma vez (parcelável em INSTALLMENTS vezes)
// - care: mensalidade da manutenção no plano mensal (sem fidelidade)
// - careAnnual: mensalidade da manutenção no plano anual (cobrada 12x esse valor por ano)
export const INSTALLMENTS = 5

export type PlanId = 'landing' | 'loja' | 'automacao'

export type PlanPricing = {
  name: string
  checkoutDesc: string // até 150 caracteres, aparece no checkout do Asaas
  price: number
  care: number
  careAnnual: number
}

export const pricing: Record<PlanId, PlanPricing> = {
  landing: {
    name: 'Landing Page',
    checkoutDesc: 'Landing page profissional com design personalizado, WhatsApp, SEO e Google Analytics.',
    price: 400,
    care: 39,
    careAnnual: 29,
  },
  loja: {
    name: 'Loja Online Completa',
    checkoutDesc: 'Loja Nuvemshop pronta em até 14 dias: até 60 produtos, Pix e cartão, frete automático e Instagram.',
    price: 700,
    care: 59,
    careAnnual: 49,
  },
  automacao: {
    name: 'Automação',
    checkoutDesc: 'Fluxo automatizado completo integrando WhatsApp, CRM, e-mail e planilhas, com documentação.',
    price: 500,
    care: 59,
    careAnnual: 49,
  },
}

export const isPlanId = (v: unknown): v is PlanId => typeof v === 'string' && v in pricing
