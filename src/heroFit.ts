// No computador, cada linha do título do hero recebe o tamanho que a faz ocupar exatamente a largura
// da coluna (as duas linhas ficam com a mesma largura). No celular vale o tamanho do CSS.
// Roda inline no HTML pré-renderizado (antes da primeira pintura, sem pulo de layout) e no
// componente Hero depois que o React assume. Não pode usar nada de fora da função.
export function fitHeroTitle(h1: HTMLElement | null) {
  if (!h1) return
  const lineEls = h1.querySelectorAll<HTMLElement>('.hero__line')
  lineEls.forEach((line) => (line.style.fontSize = ''))
  if (!window.matchMedia('(min-width: 861px)').matches) return
  const width = h1.clientWidth
  lineEls.forEach((line) => {
    line.style.fontSize = '100px'
    line.style.fontSize = `${(100 * width) / line.offsetWidth}px`
  })
}
