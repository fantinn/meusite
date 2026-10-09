import type { ReactNode } from 'react'
import { ArrowRight, Check, MessageCircle } from 'lucide-react'
import { brand, guides, projectSrcSet, projects } from '../content'
import { INSTALLMENTS, pricing } from '../pricing'

// Páginas de conteúdo (criação de sites, landing page, sobre): HTML estático gerado no build,
// sem nenhum JavaScript no navegador. Carregam instantâneo e o Google lê tudo de primeira.

export const SITE = brand.site

export const whatsapp = (text: string) => `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(text)}`

export const brl = (v: number) => v.toLocaleString('pt-BR', { maximumFractionDigits: 0 })

// JSON para <script type="application/ld+json"> sem risco de fechar a tag por engano
export const ldJson = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c')

export type PageMeta = {
  path: string // ex.: /landing-page
  file: string // arquivo gerado em dist/
  crumb: string // nome curto no breadcrumb
  title: string
  description: string
  jsonLd: object[]
  Body: () => JSX.Element
}

export function breadcrumbLd(path: string, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name, item: `${SITE}${path}` },
    ],
  }
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }
}

export function Document({ page, css }: { page: PageMeta; css: string }) {
  const url = `${SITE}${page.path}`
  const { Body } = page
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="author" content={brand.name} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={url} />
        <meta name="theme-color" content="#0067b8" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:site_name" content={brand.name} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:image" content={`${SITE}/og.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.title} />
        <meta name="twitter:description" content={page.description} />
        <meta name="twitter:image" content={`${SITE}/og.jpg`} />
        <link rel="icon" type="image/png" sizes="512x512" href="/logo-gf.png" />
        <link rel="apple-touch-icon" href="/logo-gf.png" />
        {[breadcrumbLd(page.path, page.crumb), ...page.jsonLd].map((ld, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(ld) }} />
        ))}
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <a className="skip" href="#conteudo">Pular para o conteúdo</a>
        <header className="pg-nav">
          <div className="pg-container pg-nav__inner">
            <a href="/" className="logo">
              <span className="logo__mark" aria-hidden>{brand.short}</span>
              {brand.name}
            </a>
            <nav className="pg-nav__links" aria-label="Principal">
              {guides.map((g) => (
                <a key={g.href} href={g.href} aria-current={g.href === page.path ? 'page' : undefined}>
                  {g.href === '/gabriel-fantin' ? 'Sobre' : g.label}
                </a>
              ))}
              <a href="/#planos">Preços</a>
            </nav>
            <a className="btn btn--primary btn--sm" href={whatsapp('Olá, Gabriel! Vim pelo site e quero um orçamento.')}>
              Fale comigo
            </a>
          </div>
        </header>

        <main id="conteudo">
          <Body />
        </main>

        <footer className="pg-footer">
          <div className="pg-container pg-footer__inner">
            <div>
              <a href="/" className="logo">
                <span className="logo__mark" aria-hidden>{brand.short}</span>
                {brand.name}
              </a>
              <p>Criação de sites, landing pages e lojas online para todo o Brasil.</p>
            </div>
            <nav aria-label="Rodapé" className="pg-footer__links">
              <a href="/">Página inicial</a>
              {guides.map((g) => <a key={g.href} href={g.href}>{g.label}</a>)}
              <a href="/#projetos">Projetos</a>
              <a href="/#planos">Planos e preços</a>
              <a href={`https://wa.me/${brand.whatsappNumber}`}>WhatsApp {brand.whatsappLabel}</a>
            </nav>
          </div>
          <div className="pg-container">
            <small>{`© ${new Date().getFullYear()} ${brand.name} · fantin.tech`}</small>
          </div>
        </footer>
      </body>
    </html>
  )
}

// ---------- Blocos reutilizados pelas páginas ----------

export function Hero({ crumb, title, lead, cta }: { crumb: string; title: ReactNode; lead: ReactNode; cta: string }) {
  return (
    <section className="pg-hero">
      <div className="pg-container">
        <nav className="pg-crumbs" aria-label="Você está em">
          <a href="/">Início</a> <span aria-hidden>›</span> <span aria-current="page">{crumb}</span>
        </nav>
        <h1>{title}</h1>
        <p className="pg-hero__lead">{lead}</p>
        <div className="pg-actions">
          <a className="btn btn--light" href={whatsapp(cta)}>
            <MessageCircle size={18} aria-hidden /> Pedir orçamento no WhatsApp
          </a>
          <a className="btn btn--outline" href="/#projetos">Ver projetos</a>
        </div>
      </div>
    </section>
  )
}

export function Section({ id, title, intro, alt, children }: { id?: string; title: string; intro?: ReactNode; alt?: boolean; children: ReactNode }) {
  return (
    <section id={id} className={`pg-section${alt ? ' pg-section--alt' : ''}`}>
      <div className="pg-container">
        <h2>{title}</h2>
        {intro && <p className="pg-intro">{intro}</p>}
        {children}
      </div>
    </section>
  )
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="pg-checks">
      {items.map((t) => <li key={t}><Check size={18} aria-hidden />{t}</li>)}
    </ul>
  )
}

export function Steps({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="pg-steps">
      {items.map((s) => (
        <li key={s.title}>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  )
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="pg-faq">
      {items.map(({ q, a }) => (
        <details key={q}>
          <summary><h3>{q}</h3></summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  )
}

export function Prices() {
  const rows = [
    { name: 'Landing Page', p: pricing.landing, note: 'Página única, pronta em até 5 dias' },
    { name: 'Loja Online', p: pricing.loja, note: 'Até 90 produtos, Pix, cartão e frete' },
    { name: 'Automação', p: pricing.automacao, note: 'WhatsApp, CRM, e-mail e planilhas' },
  ]
  return (
    <>
      <div className="pg-prices">
        {rows.map(({ name, p, note }) => (
          <div key={name} className="pg-price">
            <h3>{name}</h3>
            <p>{note}</p>
            <div className="pg-price__value"><small>a partir de</small> R$ {brl(p.price)}</div>
            <div className="pg-price__sub">ou {INSTALLMENTS}x de R$ {brl(Math.ceil(p.price / INSTALLMENTS))} sem juros</div>
            <div className="pg-price__sub">+ manutenção a partir de R$ {p.careAnnual}/mês</div>
          </div>
        ))}
      </div>
      <p className="pg-note">
        A manutenção inclui hospedagem, domínio, certificado SSL e suporte pelo WhatsApp.{' '}
        <a href="/#planos">Ver todos os detalhes dos planos <ArrowRight size={14} aria-hidden /></a>
      </p>
    </>
  )
}

export function Projects({ only }: { only?: string[] }) {
  const list = only ? projects.filter((p) => only.includes(p.id)) : projects
  return (
    <ul className="pg-projects">
      {list.map((p) => (
        <li key={p.id}>
          <img
            src={p.image}
            srcSet={p.image && projectSrcSet(p.image)}
            sizes="(max-width: 760px) calc(100vw - 34px), 520px"
            alt={`${p.category} ${p.title}, criada por Gabriel Fantin`}
            width={800}
            height={500}
            loading="lazy"
            decoding="async"
          />
          <div>
            <span className="pg-projects__cat">{p.category}</span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            {p.url && <a href={p.url} target="_blank" rel="noopener">Ver o site no ar <ArrowRight size={14} aria-hidden /></a>}
          </div>
        </li>
      ))}
    </ul>
  )
}

export function Cta({ title, text, message }: { title: string; text: string; message: string }) {
  return (
    <section className="pg-cta">
      <div className="pg-container">
        <h2>{title}</h2>
        <p>{text}</p>
        <a className="btn btn--light" href={whatsapp(message)}>
          <MessageCircle size={18} aria-hidden /> Chamar no WhatsApp
        </a>
      </div>
    </section>
  )
}

export function Related({ current }: { current: string }) {
  return (
    <nav className="pg-related" aria-label="Leia também">
      {guides.filter((g) => g.href !== current).map((g) => (
        <a key={g.href} href={g.href}>
          <strong>{g.label}</strong>
          <span>{g.text}</span>
        </a>
      ))}
    </nav>
  )
}
