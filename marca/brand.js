// Peças visuais da marca para o Instagram: cores, fontes e o monograma "FA / Ti + N".
const C = { navy: '#062a55', blue: '#0067b8', sky: '#9cc3e8', bright: '#3d9be9', ink: '#1b1b1b', ink2: '#505050', light: '#f2f6fb', white: '#ffffff' }
const FONT = '"Segoe UI Variable Display", "Segoe UI", system-ui, sans-serif'
const font = (weight, px) => `${weight} ${px}px ${FONT}`

// Monograma (versão "mais grossa" aprovada). Unidade = altura da maiúscula.
// F e T têm a mesma largura, A e i dividem o eixo, o N vai do topo do FA à base do Ti.
const MONO = { s: 0.27, F: 0.6, A: 0.82, lg: 0.1, gap: 0.18, N: 1.24 }

// Desenha o monograma com o canto de cima à esquerda em (x, y) e altura total h. Retorna a largura.
function drawMonogram(ctx, x, y, h, ink, dot) {
  const m = MONO
  const u = h / (2 + m.gap), s = m.s * u
  const colW = m.F + m.lg + m.A, W = (colW + m.gap + m.N) * u
  const top1 = y, base1 = y + u, top2 = base1 + m.gap * u, base2 = y + h

  // Camada do tamanho do monograma (o miolo do A é recortado sem apagar o fundo); funciona com ctx transformado
  const L = document.createElement('canvas'); L.width = Math.ceil(W + 10); L.height = Math.ceil(h + 10)
  const g = L.getContext('2d')
  const ox = Math.floor(x) - 4, oy = Math.floor(y) - 4 // deslocamento inteiro: bordas continuam nítidas
  g.translate(-ox, -oy)
  const R = Math.round
  const rect = (rx, ry, w, hh, col = ink) => { g.fillStyle = col; g.fillRect(R(rx), R(ry), R(rx + w) - R(rx), R(ry + hh) - R(ry)) }
  const poly = (pts) => { g.beginPath(); pts.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py))); g.closePath() }

  rect(x, top1, s, u); rect(x, top1, m.F * u, s); rect(x, top1 + u * 0.43, m.F * u * 0.86, s)

  const ax = x + (m.F + m.lg) * u, aw = m.A * u, acx = ax + aw / 2, tw = s * 1.1
  const run = aw / 2 - tw / 2, d = s * 0.9 // perna um pouco mais fina que a haste: abre espaço para a barra aparecer
  const outer = [[ax, base1], [acx - tw / 2, top1], [acx + tw / 2, top1], [ax + aw, base1]]
  g.fillStyle = ink; poly(outer); g.fill()
  const apexY = base1 - u * Math.min(1, (aw - 2 * d) / (2 * run))
  const hole = [[ax + d, base1 + 4], [acx, apexY], [ax + aw - d, base1 + 4]]
  g.save(); g.globalCompositeOperation = 'destination-out'; poly(hole); g.fill(); g.restore()
  g.save(); poly([[hole[0][0] - 1, hole[0][1]], [acx, apexY - 1], [hole[2][0] + 1, hole[2][1]]]); g.clip()
  rect(ax, base1 - u * 0.22 - s * 0.7, aw, s * 0.7); g.restore()

  rect(x, top2, m.F * u, s); rect(x + (m.F * u - s) / 2, top2, s, u)

  const dotD = s * 1.3
  rect(acx - s / 2, top2 + dotD + s * 0.55, s, u - dotD - s * 0.55)
  g.fillStyle = dot; g.beginPath(); g.arc(acx, top2 + dotD / 2, dotD / 2, 0, Math.PI * 2); g.fill()

  const nx = x + (colW + m.gap) * u, nw = m.N * u, nh = base2 - top1
  const dn = s * Math.hypot(nh, nw) / nh * 1.18
  const yR = top1 + ((nw - s - dn) / (nw - dn)) * nh, yL = top1 + (s / (nw - dn)) * nh
  g.fillStyle = ink
  poly([[nx, base2], [nx, top1], [nx + dn, top1], [nx + nw - s, yR], [nx + nw - s, top1], [nx + nw, top1],
        [nx + nw, base2], [nx + nw - dn, base2], [nx + s, yL], [nx + s, base2]])
  g.fill()

  ctx.drawImage(L, ox, oy)
  return W
}
const monoWidth = (h) => (h / (2 + MONO.gap)) * (MONO.F + MONO.lg + MONO.A + MONO.gap + MONO.N)
