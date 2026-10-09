import { brand, services, tech } from '../content'
import { CheckList, Cta, Projects, Related, Section, SITE, whatsapp, type PageMeta } from './Layout'

const PATH = '/gabriel-fantin'

function Body() {
  return (
    <>
      <section className="pg-hero">
        <div className="pg-container">
          <nav className="pg-crumbs" aria-label="Você está em">
            <a href="/">Início</a> <span aria-hidden>›</span> <span aria-current="page">Sobre</span>
          </nav>
          <div className="pg-profile">
            <span className="pg-profile__mark" aria-hidden>{brand.short}</span>
            <div>
              <h1>Gabriel Fantin</h1>
              <p className="pg-hero__lead">
                Desenvolvedor web e designer. Crio sites, landing pages, lojas online e automações que ajudam empresas e profissionais a
                vender mais pela internet.
              </p>
            </div>
          </div>
          <div className="pg-actions">
            <a className="btn btn--light" href={whatsapp('Olá, Gabriel! Vim pela sua página e quero conversar sobre um projeto.')}>
              Falar comigo no WhatsApp
            </a>
            <a className="btn btn--outline" href="/#projetos">Ver projetos</a>
          </div>
        </div>
      </section>

      <Section title="Quem é Gabriel Fantin">
        <div className="pg-prose">
          <p>
            Oi! Eu sou o <strong>Gabriel Fantin</strong>, e o <strong>Fantin</strong> (fantin.tech) é onde eu reúno o meu trabalho com
            desenvolvimento e design. Cuido do projeto inteiro: entendo o seu negócio, desenho o layout, escrevo o código, deixo o site rápido
            e pronto para o Google e acompanho depois que ele vai para o ar.
          </p>
          <p>
            Você fala direto comigo, sem intermediários e sem jargão técnico. O meu objetivo é simples: entregar um site bonito, que carrega
            rápido e que traz clientes de verdade, com preço justo e prazo curto.
          </p>
        </div>
      </Section>

      <Section alt title="O que eu faço">
        <div className="pg-cards">
          {services.map((s) => (
            s.link
              ? <a key={s.title} className="pg-card" href={s.link.href}><h3>{s.title}</h3><p>{s.text}</p></a>
              : <div key={s.title} className="pg-card"><h3>{s.title}</h3><p>{s.text}</p></div>
          ))}
        </div>
      </Section>

      <Section title="Como eu trabalho">
        <CheckList
          items={[
            'Proposta com escopo, prazo e valor fechados em até 24 horas',
            'Landing page no ar em até 5 dias',
            'Design pensado primeiro para o celular',
            'Sites rápidos, com nota alta no Google PageSpeed',
            'SEO técnico em todos os projetos',
            'Comunicação direta pelo WhatsApp do começo ao fim',
          ]}
        />
      </Section>

      <Section alt title="Ferramentas e tecnologias">
        <ul className="pg-tags">
          {tech.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </Section>

      <Section title="Projetos recentes">
        <Projects />
      </Section>

      <Section alt title="Leia também">
        <Related current={PATH} />
      </Section>

      <Cta
        title="Vamos trabalhar juntos?"
        text="Conte o que você precisa e eu te respondo com uma proposta em até 24 horas."
        message="Olá, Gabriel! Quero conversar sobre um projeto."
      />
    </>
  )
}

export const sobre: PageMeta = {
  path: PATH,
  file: 'gabriel-fantin.html',
  crumb: 'Sobre Gabriel Fantin',
  title: 'Gabriel Fantin | Desenvolvedor Web e Designer (Fantin)',
  description: 'Conheça Gabriel Fantin, desenvolvedor web e designer que cria sites, landing pages, lojas online e automações. Veja projetos, como eu trabalho e fale comigo.',
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      url: `${SITE}${PATH}`,
      name: 'Gabriel Fantin',
      mainEntity: {
        '@type': 'Person',
        '@id': `${SITE}/#gabriel`,
        name: 'Gabriel Fantin',
        alternateName: 'Fantin',
        jobTitle: 'Desenvolvedor web e designer',
        url: `${SITE}/`,
        image: `${SITE}/logo-gf.png`,
        sameAs: [brand.github],
        knowsAbout: ['Criação de sites', 'Landing pages', 'Lojas online', 'UI/UX Design', 'SEO', 'Automação', ...tech],
      },
    },
  ],
  Body,
}
