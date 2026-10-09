import { INSTALLMENTS, pricing } from '../pricing'
import { CheckList, Cta, Faq, Hero, Projects, Related, Section, SITE, Steps, brl, faqLd, type PageMeta } from './Layout'

const PATH = '/landing-page'
const lp = pricing.landing

const faq = [
  {
    q: 'Em quanto tempo minha landing page fica pronta?',
    a: 'Em até 5 dias depois que você me envia as informações do negócio (textos, fotos e logo, se tiver). Se precisar, eu ajudo a escrever os textos.',
  },
  {
    q: 'Quanto custa fazer uma landing page?',
    a: `A partir de R$ ${lp.price}, ou ${INSTALLMENTS}x de R$ ${brl(Math.ceil(lp.price / INSTALLMENTS))} sem juros. A manutenção custa a partir de R$ ${lp.careAnnual} por mês e inclui hospedagem, domínio, SSL, uma alteração de conteúdo por mês e suporte.`,
  },
  {
    q: 'Posso usar a landing page com anúncios do Google e do Instagram?',
    a: 'Pode e deve: a landing page é feita para receber tráfego de anúncios. Ela carrega rápido (o que melhora a pontuação dos anúncios) e já sai com Google Analytics para você medir os resultados.',
  },
  {
    q: 'A landing page aparece no Google?',
    a: 'Sim. Ela sai com SEO técnico: título e descrição otimizados, dados estruturados, sitemap e cadastro no Google Search Console, pronta para ser encontrada nas buscas.',
  },
  {
    q: 'Consigo saber quantas pessoas visitaram a página?',
    a: 'Sim. Toda landing page vem com Google Analytics configurado, e você vê visitas, de onde as pessoas vieram e quantas clicaram para chamar no WhatsApp.',
  },
  {
    q: 'Depois posso transformar a landing page em um site completo?',
    a: 'Pode. A landing page é um ótimo começo: quando o negócio crescer, ela vira a página inicial de um site com mais páginas ou de uma loja online, sem perder o que já foi feito.',
  },
]

function Body() {
  return (
    <>
      <Hero
        crumb="Landing page"
        title="Landing page profissional: crie a sua e transforme visitas em clientes"
        lead={`Quer criar uma landing page para vender mais, anunciar no Google e no Instagram ou receber contatos no WhatsApp? Faço sua landing page com design personalizado, SEO e Google Analytics, pronta em até 5 dias, a partir de R$ ${lp.price}.`}
        cta="Olá, Gabriel! Quero fazer uma landing page."
      />

      <Section title="O que é uma landing page?">
        <div className="pg-prose">
          <p>
            <strong>Landing page</strong> (ou página de destino) é uma página única criada com um só objetivo: fazer o visitante tomar uma
            ação. Pode ser chamar no WhatsApp, comprar um produto, agendar um horário ou deixar o contato.
          </p>
          <p>
            Diferente de um site com vários menus, a landing page conduz a pessoa do começo ao fim, sem distrações: apresenta o problema,
            mostra a solução, prova que funciona e termina com um botão claro. Por isso ela converte mais visitas em clientes, principalmente
            quando o visitante chega por um anúncio.
          </p>
        </div>
      </Section>

      <Section alt title="Quando vale a pena fazer uma landing page">
        <CheckList
          items={[
            'Você vai anunciar no Google, Instagram ou Facebook e precisa de uma página que converta',
            'Quer vender um produto, serviço, curso ou lista específica',
            'Vai fazer um lançamento ou uma promoção com prazo',
            'Quer captar contatos e conversar com os clientes pelo WhatsApp',
            'Está começando e quer estar na internet rápido, gastando pouco',
            'Quer testar uma ideia de negócio antes de investir em um site completo',
          ]}
        />
      </Section>

      <Section title="O que tem em uma landing page que converte" intro="Cada parte da página tem uma função. Esta é a estrutura que eu uso e adapto para o seu negócio:">
        <div className="pg-cards">
          <div className="pg-card"><h3>Título que prende</h3><p>Em poucos segundos o visitante entende o que você oferece e por que isso importa para ele.</p></div>
          <div className="pg-card"><h3>Benefícios claros</h3><p>Mostra o resultado que o cliente vai ter, e não só a lista de características do produto.</p></div>
          <div className="pg-card"><h3>Prova social</h3><p>Depoimentos, números, fotos e clientes atendidos para passar confiança.</p></div>
          <div className="pg-card"><h3>Oferta e chamada para ação</h3><p>Botões claros e repetidos ao longo da página, levando direto para o WhatsApp ou para a compra.</p></div>
          <div className="pg-card"><h3>Perguntas frequentes</h3><p>Responde às dúvidas e objeções que impedem a pessoa de fechar.</p></div>
          <div className="pg-card"><h3>Velocidade</h3><p>Uma página lenta perde visitantes. As minhas landing pages carregam em poucos segundos, até no 4G.</p></div>
        </div>
      </Section>

      <Section alt title="Landing page ou site completo?">
        <div className="pg-table-wrap">
          <table className="pg-table">
            <thead>
              <tr><th scope="col"></th><th scope="col">Landing page</th><th scope="col">Site completo</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">Objetivo</th><td>Uma ação: vender, captar contato</td><td>Apresentar a empresa inteira</td></tr>
              <tr><th scope="row">Páginas</th><td>Uma página</td><td>Várias páginas e menus</td></tr>
              <tr><th scope="row">Prazo</th><td>Até 5 dias</td><td>De 10 a 14 dias, em média</td></tr>
              <tr><th scope="row">Ideal para</th><td>Anúncios, lançamentos, começar rápido</td><td>Empresas com muitos serviços ou produtos</td></tr>
              <tr><th scope="row">Investimento</th><td>A partir de R$ {lp.price}</td><td>Sob orçamento</td></tr>
            </tbody>
          </table>
        </div>
        <p className="pg-note">Na dúvida, comece pela landing page: depois ela pode virar a página inicial de um site maior. <a href="/criacao-de-sites">Veja como funciona a criação de sites</a>.</p>
      </Section>

      <Section title="Quanto custa fazer uma landing page?">
        <div className="pg-price pg-price--wide">
          <h3>Landing Page</h3>
          <div className="pg-price__value"><small>a partir de</small> R$ {brl(lp.price)}</div>
          <div className="pg-price__sub">ou {INSTALLMENTS}x de R$ {brl(Math.ceil(lp.price / INSTALLMENTS))} sem juros · pronta em até 5 dias</div>
          <CheckList
            items={[
              'Página única com design personalizado',
              'Botão de WhatsApp e formulário',
              'SEO + Google Analytics',
              `Manutenção a partir de R$ ${lp.careAnnual}/mês: hospedagem, domínio, SSL e suporte`,
            ]}
          />
          <a className="btn btn--primary" href="/#planos">Ver planos e contratar</a>
        </div>
      </Section>

      <Section alt title="Landing pages e páginas de vendas que já criei">
        <Projects only={['p3', 'p1', 'p4']} />
      </Section>

      <Section title="Como eu crio sua landing page">
        <Steps
          items={[
            { title: 'Briefing rápido', text: 'Conversamos pelo WhatsApp sobre o que você vende, para quem e qual ação o visitante deve tomar.' },
            { title: 'Estrutura e textos', text: 'Monto a estrutura da página e ajudo a escrever títulos e chamadas que vendem.' },
            { title: 'Design e desenvolvimento', text: 'Crio o design com a sua marca e desenvolvo a página, rápida e perfeita no celular.' },
            { title: 'No ar em até 5 dias', text: 'Publico com domínio, SSL, Google Analytics e Search Console configurados.' },
          ]}
        />
      </Section>

      <Section alt title="Perguntas frequentes sobre landing page">
        <Faq items={faq} />
        <Related current={PATH} />
      </Section>

      <Cta
        title="Pronto para criar sua landing page?"
        text="Me chame no WhatsApp e receba a proposta em até 24 horas. Sua página pode estar no ar ainda esta semana."
        message="Olá, Gabriel! Quero criar uma landing page. Pode me passar um orçamento?"
      />
    </>
  )
}

export const landingPage: PageMeta = {
  path: PATH,
  file: 'landing-page.html',
  crumb: 'Landing page',
  title: 'Criar Landing Page Profissional que Converte | Gabriel Fantin',
  description: `Landing page profissional pronta em até 5 dias, a partir de R$ ${lp.price}: design personalizado, WhatsApp, SEO e Google Analytics. Veja o que é e como criar a sua.`,
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Criação de landing page',
      serviceType: 'Landing page',
      url: `${SITE}${PATH}`,
      provider: { '@id': `${SITE}/#gabriel` },
      areaServed: { '@type': 'Country', name: 'Brasil' },
      offers: { '@type': 'Offer', price: String(lp.price), priceCurrency: 'BRL' },
    },
    faqLd(faq),
  ],
  Body,
}
