// Edite aqui os textos do site.
import type { LucideIcon } from 'lucide-react'
import { Code2, Palette, Smartphone, Zap, Search, ShoppingBag } from 'lucide-react'
import { pricing, type PlanId, type PlanPricing } from './pricing'

export const brand = {
  name: 'Gabriel Fantin',
  short: 'GF',
  role: 'Desenvolvimento & Design',
  email: 'contato@seudominio.com',
  whatsappNumber: '5527992864820', // formato internacional, só números (55 + DDD + número)
  whatsappLabel: '(27) 99286-4820',
  linkedin: 'https://www.linkedin.com/',
  github: 'https://github.com/',
}

export const nav = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Planos', href: '#planos' },
  { label: 'Contato', href: '#contato' },
]

export const hero = {
  eyebrow: 'Disponível para novos projetos',
  title: 'Experiências digitais que fazem sua empresa crescer.',
  subtitle:
    'Sites, sistemas e interfaces rápidas, bonitas e pensadas para converter. Do conceito ao lançamento, com atenção a cada detalhe.',
  primary: { label: 'Solicitar orçamento', href: '#contato' },
  secondary: { label: 'Ver projetos', href: '#projetos' },
}

export const tech = [
  'React', 'TypeScript', 'Next.js', 'Node.js', 'Figma', 'Azure',
  'Supabase', 'Tailwind', 'Power BI', 'Python', 'Vercel', 'PostgreSQL',
]

export type Service = { icon: LucideIcon; title: string; text: string; tags: string[] }

export const services: Service[] = [
  { icon: Code2, title: 'Sites & Landing Pages', text: 'Páginas rápidas, responsivas e otimizadas para transformar visitantes em clientes.', tags: ['React', 'SEO', 'Performance'] },
  { icon: Palette, title: 'UI/UX Design', text: 'Interfaces limpas e intuitivas, com design system consistente do protótipo ao código.', tags: ['Figma', 'Protótipos', 'Design System'] },
  { icon: Smartphone, title: 'Aplicações Web', text: 'Sistemas sob medida, dashboards e áreas de cliente com autenticação e banco de dados.', tags: ['Full-stack', 'APIs', 'Cloud'] },
  { icon: ShoppingBag, title: 'E-commerce', text: 'Lojas virtuais com checkout fluido, integrações de pagamento e gestão simplificada.', tags: ['Pagamentos', 'Estoque', 'Analytics'] },
  { icon: Zap, title: 'Automação', text: 'Elimine tarefas repetitivas com integrações, bots e fluxos automatizados.', tags: ['Integrações', 'Bots', 'Workflows'] },
  { icon: Search, title: 'SEO & Performance', text: 'Auditoria técnica e melhorias para carregar rápido e aparecer no Google.', tags: ['Core Web Vitals', 'Auditoria'] },
]

export type Project = {
  id: string
  title: string
  category: string
  text: string
  result?: string
  gradient: string
  image?: string // print do site, mostrado dentro da janela do card
  url?: string // link do site no ar
}

export const projects: Project[] = [
  { id: 'p1', title: 'Portal Financeiro', category: 'Aplicação Web', text: 'Dashboard com gráficos em tempo real, relatórios e controle de acesso por perfil para uma consultoria financeira.', result: '+40% de produtividade da equipe', gradient: 'linear-gradient(135deg,#0067b8,#004e8c)' },
  { id: 'p2', title: 'Pedro Design', category: 'Site / Portfólio', text: 'Site para designer de posicionamento visual: apresentação dos serviços, planos mensais, projetos em destaque e contato direto pelo WhatsApp.', gradient: 'linear-gradient(135deg,#2b2b2b,#4a4a4a)', image: '/projects/pdrdesign.jpg', url: 'https://pdrdesign.com.br' },
  { id: 'p3', title: 'PryzeGear', category: 'Landing Page', text: 'Landing page de uma comunidade de periféricos e setups high-end: apresentação da marca, níveis de setup e chamada para o grupo VIP de ofertas no WhatsApp.', gradient: 'linear-gradient(135deg,#1d4f7c,#0b2e4f)', image: '/projects/pryzegear.jpg', url: 'https://www.pryzegear.com.br' },
  { id: 'p4', title: 'Fluxo Ops', category: 'Automação', text: 'Automação de onboarding de clientes integrando CRM, e-mail e planilhas.', result: '12h/semana economizadas', gradient: 'linear-gradient(135deg,#5a6570,#2f363d)' },
]

export const stats = [
  { value: 50, suffix: '+', label: 'Projetos entregues' },
  { value: 98, suffix: '%', label: 'Clientes satisfeitos' },
  { value: 6, suffix: ' anos', label: 'De experiência' },
  { value: 24, suffix: 'h', label: 'Tempo de resposta' },
]

export const testimonials = [
  { quote: 'Entrega impecável e dentro do prazo. O site ficou exatamente como imaginávamos — só que melhor.', name: 'Mariana Costa', role: 'CEO, Aurora' },
  { quote: 'Comunicação clara do começo ao fim. A automação mudou a rotina da nossa equipe.', name: 'Rafael Lima', role: 'COO, Fluxo' },
  { quote: 'Design moderno e performance excelente. Nossos pacientes elogiam a facilidade de agendar.', name: 'Dra. Paula Souza', role: 'Clínica Vita' },
]

// Planos: projeto (pagamento único) + assinatura de manutenção.
// Os valores ficam em src/pricing.ts (compartilhado com a API de checkout).
export { INSTALLMENTS } from './pricing'

export type Plan = PlanPricing & {
  id: PlanId
  icon: LucideIcon
  name: string
  desc: string
  from?: boolean // exibe "a partir de" no preço do projeto
  features: string[] // o que vem no projeto
  careFeatures: string[] // o que a manutenção cobre
  featured?: boolean
}

export const plans: Plan[] = [
  {
    ...pricing.landing,
    id: 'landing',
    icon: Code2,
    name: 'Landing Page',
    desc: 'Uma página de alta conversão para apresentar seu negócio e captar clientes.',
    from: true,
    features: [
      'Página única com design personalizado',
      'Botão de WhatsApp e formulário',
      'SEO + Google Analytics',
      'Entrega em até 7 dias',
    ],
    careFeatures: [
      'Hospedagem, domínio e SSL',
      '1 alteração de conteúdo por mês',
      'Suporte por WhatsApp',
    ],
  },
  {
    ...pricing.loja,
    id: 'loja',
    icon: ShoppingBag,
    name: 'Loja Online',
    desc: 'Loja completa para vender todos os dias, com pagamento e frete integrados.',
    from: true,
    featured: true,
    features: [
      'Até 60 produtos cadastrados',
      'Pix e cartão integrados',
      'Cálculo de frete automático',
      'Painel de pedidos e estoque',
    ],
    careFeatures: [
      'Hospedagem, domínio, SSL e backups',
      '1h de ajustes por mês',
      'Suporte por WhatsApp',
    ],
  },
  {
    ...pricing.automacao,
    id: 'automacao',
    icon: Zap,
    name: 'Automação',
    desc: 'Robôs e integrações que trabalham por você 24h e eliminam tarefas manuais.',
    from: true,
    features: [
      '1 fluxo automatizado completo',
      'Integração com WhatsApp, CRM, e-mail e planilhas',
      'Documentação do fluxo',
    ],
    careFeatures: [
      'Servidor e monitoramento 24h',
      'Correção de falhas',
      'Suporte por WhatsApp',
    ],
  },
]

export const plansNote = 'O projeto é seu: você paga uma vez pela criação e a manutenção mantém tudo no ar, seguro e atualizado.'
