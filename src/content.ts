// Edite aqui os textos do site.
import type { LucideIcon } from 'lucide-react'
import { Code2, Palette, Smartphone, Zap, Search, ShoppingBag } from 'lucide-react'

export const brand = {
  name: 'Gabriel Fantin',
  short: 'GF',
  role: 'Desenvolvimento & Design',
  email: 'contato@seudominio.com',
  whatsapp: 'https://wa.me/5500000000000',
  linkedin: 'https://www.linkedin.com/',
  github: 'https://github.com/',
}

export const nav = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Processo', href: '#processo' },
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

export const process = [
  { title: 'Descoberta', text: 'Uma conversa para entender seu negócio, objetivos e público.' },
  { title: 'Design', text: 'Wireframes e protótipo navegável para você validar antes do código.' },
  { title: 'Desenvolvimento', text: 'Construção com entregas semanais e acompanhamento transparente.' },
  { title: 'Lançamento', text: 'Publicação, testes finais e suporte para o seu projeto decolar.' },
]

export type Project = { id: string; title: string; category: string; text: string; result: string; gradient: string }

export const projects: Project[] = [
  { id: 'p1', title: 'Portal Financeiro', category: 'Aplicação Web', text: 'Dashboard com gráficos em tempo real, relatórios e controle de acesso por perfil para uma consultoria financeira.', result: '+40% de produtividade da equipe', gradient: 'linear-gradient(135deg,#0067b8,#4f6bed)' },
  { id: 'p2', title: 'Loja Aurora', category: 'E-commerce', text: 'Loja virtual com checkout em uma página, integração de frete e painel administrativo simplificado.', result: '2,3x mais conversões', gradient: 'linear-gradient(135deg,#8661c5,#e3008c)' },
  { id: 'p3', title: 'Clínica Vita', category: 'Landing Page', text: 'Site institucional com agendamento online, blog e otimização local de SEO.', result: '1º lugar no Google local', gradient: 'linear-gradient(135deg,#00b294,#0099bc)' },
  { id: 'p4', title: 'Fluxo Ops', category: 'Automação', text: 'Automação de onboarding de clientes integrando CRM, e-mail e planilhas.', result: '12h/semana economizadas', gradient: 'linear-gradient(135deg,#ff8c00,#e81123)' },
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

export const plans = [
  { name: 'Essencial', price: 'R$ 1.900', desc: 'Para quem precisa de presença online rápida.', features: ['Landing page de 1 página', 'Design responsivo', 'Formulário de contato', 'SEO básico', 'Entrega em até 10 dias'], featured: false },
  { name: 'Profissional', price: 'R$ 4.900', desc: 'O mais escolhido por pequenas empresas.', features: ['Site até 6 páginas', 'Design personalizado', 'Blog / CMS', 'SEO completo + Analytics', 'Animações e micro-interações', '30 dias de suporte'], featured: true },
  { name: 'Sob medida', price: 'Consulte', desc: 'Sistemas, e-commerce e automações.', features: ['Escopo personalizado', 'Aplicação full-stack', 'Integrações e APIs', 'Entregas semanais', 'Suporte contínuo'], featured: false },
]
