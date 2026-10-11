import { BarChart3, Eye, MessageCircle, Users, Wallet } from 'lucide-react'
import { useLayoutEffect, useRef, type ReactNode } from 'react'

type Pt = [number, number]

// Projeta um retângulo de w × h px sobre o quadrilátero `q` (cantos na ordem: topo-esq, topo-dir,
// baixo-dir, baixo-esq, em px da imagem). Devolve o matrix3d que dá a perspectiva da tela.
function screenMatrix(q: [Pt, Pt, Pt, Pt], w: number, h: number) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3
  const den = dx1 * dy2 - dy1 * dx2
  const g = (dx3 * dy2 - dy3 * dx2) / den
  const hh = (dx1 * dy3 - dy1 * dx3) / den
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3
  const d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3
  const n = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, x0, y0, 0, 1]
  return `matrix3d(${n.map((v) => +v.toFixed(7)).join(',')})`
}

type ScreenProps = {
  nw: number // largura natural da imagem do aparelho
  nh: number
  quad: [Pt, Pt, Pt, Pt] // onde fica o vidro da tela, em px da imagem
  w: number // tamanho do "monitor" virtual onde o site é desenhado
  h: number
  radius: number
  children: ReactNode
}

// Camada sobre a imagem do aparelho: o site é desenhado num tamanho fixo e deitado sobre o vidro.
// A escala acompanha a largura da imagem (ResizeObserver), o resto é CSS.
function DeviceScreen({ nw, nh, quad, w, h, radius, children }: ScreenProps) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    const host = el?.parentElement
    if (!el || !host) return
    const fit = () => el.style.setProperty('--s', String(host.clientWidth / nw))
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(host)
    return () => observer.disconnect()
  }, [nw])

  return (
    <div ref={ref} className="dscreen" style={{ width: nw, height: nh }} aria-hidden>
      <div className="dscreen__pane" style={{ width: w, height: h, borderRadius: radius, transform: screenMatrix(quad, w, h) }}>
        {children}
      </div>
    </div>
  )
}

const Logo = () => (
  <span className="ss-logo">
    fant<span className="ss-i">ı</span>n
  </span>
)

const Gauge = () => (
  <svg className="ss-gauge" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="42" className="ss-gauge__bg" />
    <circle cx="50" cy="50" r="42" className="ss-gauge__bar" pathLength={100} />
    <text x="50" y="58" textAnchor="middle">100</text>
  </svg>
)

const menu = [
  { icon: BarChart3, label: 'Visão geral', on: true },
  { icon: Eye, label: 'Visitas' },
  { icon: MessageCircle, label: 'Contatos' },
  { icon: Wallet, label: 'Vendas' },
]

const kpis = [
  { icon: Eye, label: 'Visitas hoje', cls: 'ss-num--1', delta: '+38%' },
  { icon: MessageCircle, label: 'Contatos no WhatsApp', cls: 'ss-num--2', delta: '+24%' },
  { icon: Users, label: 'Novos clientes', cls: 'ss-num--3', delta: '+19%' },
]

const leads = [
  { name: 'Mariana', text: 'Oi! Vi seu site e quero um orçamento' },
  { name: 'Carlos', text: 'Quanto custa uma loja online?' },
  { name: 'Studio Bella', text: 'Podemos fechar ainda hoje?' },
]

// Tela do notebook: painel ao vivo, as visitas virando clientes (animações em screens.css)
function LaptopSite() {
  return (
    <div className="ss ss--lap">
      <aside className="ss-side">
        <Logo />
        <ul>
          {menu.map(({ icon: Icon, label, on }) => (
            <li key={label} className={on ? 'is-on' : undefined}>
              <Icon size={26} />
              {label}
            </li>
          ))}
        </ul>
      </aside>

      <div className="ss-main">
        <div className="ss-bar ss-a">
          <h2>Visão geral</h2>
          <span className="ss-live"><i />Ao vivo</span>
        </div>

        <div className="ss-kpis ss-b">
          {kpis.map(({ icon: Icon, label, cls, delta }) => (
            <div key={label} className="ss-kpi">
              <span className="ss-kpi__icon"><Icon size={26} /></span>
              <small>{label}</small>
              <b className={`ss-num ${cls}`} />
              <em>{delta}</em>
            </div>
          ))}
        </div>

        <div className="ss-row">
          <div className="ss-panel ss-chart ss-c">
            <header><b>Visitas e contatos</b><small>Últimos 30 dias</small></header>
            <svg viewBox="0 0 600 330">
              <defs>
                <linearGradient id="ssArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2899f5" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#2899f5" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="ss-chart__area" d="M0 289 C60 275 90 234 140 241 S220 193 270 176 S350 199 400 138 S500 96 600 38 L600 330 L0 330 Z" fill="url(#ssArea)" />
              <path className="ss-chart__line" pathLength={100} d="M0 289 C60 275 90 234 140 241 S220 193 270 176 S350 199 400 138 S500 96 600 38" />
              <path className="ss-chart__line ss-chart__line--2" pathLength={100} d="M0 313 C70 308 100 282 150 286 S230 261 280 248 S360 258 410 220 S510 193 600 148" />
            </svg>
          </div>

          <div className="ss-side-col">
            <div className="ss-panel ss-speed ss-d">
              <Gauge />
              <div><b>PageSpeed</b><small>Desempenho</small></div>
            </div>
            <div className="ss-panel ss-feed">
              <header><b>Novos contatos</b></header>
              {leads.map((l, i) => (
                <p key={l.name} className={`ss-lead ss-n${i + 1}`}>
                  <span><MessageCircle size={22} /></span>
                  <b>{l.name}<small>{l.text}</small></b>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <i className="ss-notch" />
    </div>
  )
}

// Tela do celular: bloqueio com clientes chamando no WhatsApp
function PhoneSite() {
  return (
    <div className="ss ss--pho">
      <div className="ss-lock">
        <b className="ss-clock ss-a">9:41</b>
        <div className="ss-notifs">
          {leads.map((l, i) => (
            <div key={l.name} className={`ss-notif ss-n${i + 1}`}>
              <span><MessageCircle size={26} /></span>
              <p><b>{l.name}<small>agora</small></b>{l.text}</p>
            </div>
          ))}
        </div>
        <div className="ss-lock__foot ss-f">
          <Logo />
        </div>
      </div>
    </div>
  )
}

// Posições do vidro em cada imagem (px da imagem original). Ajuste aqui se trocar as fotos.
export function LaptopScreen() {
  return (
    <DeviceScreen
      nw={1100}
      nh={911}
      quad={[[40, 138], [754, 12], [846, 470], [131, 584]]}
      w={1280}
      h={800}
      radius={10}
    >
      <LaptopSite />
    </DeviceScreen>
  )
}

export function PhoneScreen() {
  return (
    <DeviceScreen
      nw={560}
      nh={639}
      quad={[[203, 12], [409, 40], [226, 538], [17, 478]]}
      w={320}
      h={692}
      radius={46}
    >
      <PhoneSite />
    </DeviceScreen>
  )
}
