import { pricing } from '../pricing'
import { CheckList, Cta, Faq, Hero, Prices, Projects, Related, Section, SITE, Steps, faqLd, type PageMeta } from './Layout'

const PATH = '/criacao-de-sites'

const faq = [
  {
    q: 'Quanto tempo leva para criar um site?',
    a: 'Uma landing page fica pronta em até 5 dias. Sites institucionais com várias páginas e lojas online levam em média de 10 a 14 dias. O prazo exato vem na proposta, junto com o valor.',
  },
  {
    q: 'Quanto custa fazer um site profissional?',
    a: `Uma landing page sai a partir de R$ ${pricing.landing.price} e uma loja online a partir de R$ ${pricing.loja.price}, com parcelamento sem juros no cartão. A manutenção, que inclui hospedagem, domínio e suporte, começa em R$ ${pricing.landing.careAnnual} por mês.`,
  },
  {
    q: 'Posso pedir alterações depois que o site estiver no ar?',
    a: 'Pode. Durante o projeto você aprova cada etapa, e depois de publicado a manutenção inclui alterações de conteúdo todo mês, como trocar textos, fotos, preços e serviços.',
  },
  {
    q: 'Preciso ter domínio e hospedagem para criar meu site?',
    a: 'Não. Eu cuido do registro do domínio (o endereço, como seunegocio.com.br), da hospedagem e do certificado SSL (o cadeado de site seguro). Se você já tiver um domínio, é só me passar o acesso.',
  },
  {
    q: 'O site vai aparecer no Google?',
    a: 'O site sai pronto para o Google: títulos e descrições otimizados, dados estruturados, sitemap, carregamento rápido e cadastro no Google Search Console. A posição nas buscas cresce com o tempo e com o conteúdo do site, e eu te oriento no que fazer para subir.',
  },
  {
    q: 'Você faz site para qualquer tipo de negócio?',
    a: 'Sim: prestadores de serviço, clínicas e consultórios, lojas, restaurantes, profissionais liberais, infoprodutores e empresas de todos os tamanhos. Atendo todo o Brasil, com tudo feito online pelo WhatsApp.',
  },
  {
    q: 'Como é feito o pagamento?',
    a: 'Por Pix ou cartão de crédito, em um checkout seguro. O projeto pode ser parcelado sem juros e a manutenção pode ser mensal (sem fidelidade) ou anual, com desconto.',
  },
]

function Body() {
  return (
    <>
      <Hero
        crumb="Criação de sites"
        title="Criação de sites profissionais para o seu negócio vender mais"
        lead="Quer fazer um site para a sua empresa, mas não sabe por onde começar? Eu cuido de tudo, do design ao site no ar: você recebe um site rápido, bonito, que funciona no celular, chama no WhatsApp e está pronto para aparecer no Google."
        cta="Olá, Gabriel! Quero criar um site para o meu negócio."
      />

      <Section
        title="O que você recebe ao criar seu site comigo"
        intro="Nada de modelo pronto genérico. Cada site é desenhado para o seu negócio e para o que você quer que o visitante faça: chamar no WhatsApp, pedir orçamento ou comprar."
      >
        <CheckList
          items={[
            'Design personalizado, com a identidade da sua marca',
            'Site responsivo: perfeito no celular, tablet e computador',
            'Botão de WhatsApp e formulário que chegam direto no seu celular',
            'SEO técnico para aparecer no Google desde o primeiro dia',
            'Carregamento rápido, com nota alta no Google PageSpeed',
            'Google Analytics para saber quantas pessoas visitam o site',
            'Hospedagem, domínio e certificado SSL (cadeado de site seguro)',
            'Suporte direto comigo pelo WhatsApp, sem intermediários',
          ]}
        />
      </Section>

      <Section alt title="Tipos de site que eu faço">
        <div className="pg-cards">
          <a className="pg-card" href="/landing-page">
            <h3>Landing page</h3>
            <p>Uma página única e focada em converter: ideal para anúncios, lançamentos e para começar a vender rápido.</p>
          </a>
          <div className="pg-card">
            <h3>Site institucional</h3>
            <p>O site da sua empresa, com páginas de serviços, sobre, depoimentos e contato. Passa credibilidade e é encontrado no Google.</p>
          </div>
          <div className="pg-card">
            <h3>Loja online</h3>
            <p>Loja virtual com até 90 produtos, Pix e cartão, cálculo de frete automático e painel de pedidos e estoque.</p>
          </div>
          <div className="pg-card">
            <h3>Página de vendas</h3>
            <p>Para infoprodutos, cursos e listas: prova social, bônus, contador de oferta, perguntas frequentes e checkout.</p>
          </div>
          <div className="pg-card">
            <h3>Portfólio e site pessoal</h3>
            <p>Para profissionais e criativos mostrarem trabalhos, serviços e receberem contatos de novos clientes.</p>
          </div>
          <div className="pg-card">
            <h3>Automação</h3>
            <p>Integrações entre site, WhatsApp, CRM, e-mail e planilhas para eliminar tarefas manuais do dia a dia.</p>
          </div>
        </div>
      </Section>

      <Section title="Como funciona para fazer o seu site" intro="Um processo simples, 100% online, em que você acompanha e aprova cada etapa.">
        <Steps
          items={[
            { title: 'Conversa pelo WhatsApp', text: 'Você me conta sobre o seu negócio, seus clientes e o que espera do site. Sem formulários longos.' },
            { title: 'Proposta em até 24 horas', text: 'Você recebe escopo, prazo e valor fechados. Sem surpresas no meio do caminho.' },
            { title: 'Design e desenvolvimento', text: 'Crio o layout, escrevo a estrutura dos textos com você e desenvolvo o site. Você vê o andamento e aprova.' },
            { title: 'Site no ar', text: 'Publico o site, configuro domínio, SSL, Google Search Console e Analytics. Seu negócio já pode ser encontrado.' },
            { title: 'Manutenção e suporte', text: 'Mantenho tudo atualizado, seguro e funcionando, com alterações de conteúdo e suporte pelo WhatsApp.' },
          ]}
        />
      </Section>

      <Section alt id="precos" title="Quanto custa criar um site?" intro="Valores transparentes: você paga a criação uma vez e a manutenção mantém o site no ar.">
        <Prices />
      </Section>

      <Section title="Por que ter um site, e não só o Instagram?">
        <div className="pg-prose">
          <p>
            Redes sociais são ótimas para aparecer, mas quem procura um serviço no Google encontra <strong>sites</strong>. Um site profissional
            passa credibilidade, mostra seus serviços de forma organizada e trabalha por você 24 horas por dia, mesmo quando você não está
            postando.
          </p>
          <p>
            Além disso, o site é <strong>seu</strong>: não depende do algoritmo, não some se uma conta for bloqueada e reúne tudo o que o
            cliente precisa para decidir, do portfólio aos depoimentos, com um botão para chamar no WhatsApp na hora.
          </p>
        </div>
      </Section>

      <Section alt title="Sites e landing pages que já criei">
        <Projects />
      </Section>

      <Section title="Perguntas frequentes sobre criação de sites">
        <Faq items={faq} />
        <Related current={PATH} />
      </Section>

      <Cta
        title="Vamos criar o site do seu negócio?"
        text="Me conte sua ideia e receba uma proposta com prazo e valor em até 24 horas."
        message="Olá, Gabriel! Quero criar um site. Pode me passar um orçamento?"
      />
    </>
  )
}

export const criacaoDeSites: PageMeta = {
  path: PATH,
  file: 'criacao-de-sites.html',
  crumb: 'Criação de sites',
  title: 'Criação de Sites Profissionais: Faça seu Site | Gabriel Fantin',
  description: `Quer criar um site para sua empresa? Faço sites profissionais, rápidos e prontos para o Google, com WhatsApp integrado. Landing page a partir de R$ ${pricing.landing.price}.`,
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Criação de sites profissionais',
      serviceType: 'Criação de sites',
      url: `${SITE}${PATH}`,
      provider: { '@id': `${SITE}/#gabriel` },
      areaServed: { '@type': 'Country', name: 'Brasil' },
      offers: [
        { '@type': 'Offer', name: 'Landing Page', price: String(pricing.landing.price), priceCurrency: 'BRL' },
        { '@type': 'Offer', name: 'Loja Online', price: String(pricing.loja.price), priceCurrency: 'BRL' },
      ],
    },
    faqLd(faq),
  ],
  Body,
}
