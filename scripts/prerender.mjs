// Último passo do build: transforma o site em HTML pronto (pré-renderizado).
// - Página inicial: conteúdo já no HTML (o Google lê tudo e a tela aparece antes do JavaScript),
//   com o CSS embutido para não ter nenhum arquivo bloqueando a primeira pintura.
// - Páginas de conteúdo (src/pages): HTML estático, sem JavaScript nenhum.
import { readFileSync, rmSync, writeFileSync } from 'node:fs'

process.env.NODE_ENV = 'production'

const dist = new URL('../dist/', import.meta.url)
const serverDir = new URL('../dist-server/', import.meta.url)
const { renderHome, renderPages } = await import(new URL('entry-server.js', serverDir).href)

const replaceOnce = (html, search, replacement) => {
  const i = typeof search === 'string' ? html.indexOf(search) : html.search(search)
  if (i < 0) throw new Error(`prerender: não encontrei ${search} no index.html`)
  return html.replace(search, () => replacement)
}

// ---------- Página inicial ----------
let html = readFileSync(new URL('index.html', dist), 'utf8')

// CSS principal embutido no <head>
const cssLink = /<link rel="stylesheet"[^>]*href="\.?\/?(assets\/[^"]+\.css)"[^>]*>/.exec(html)
if (!cssLink) throw new Error('prerender: não encontrei o CSS no index.html')
const css = readFileSync(new URL(cssLink[1], dist), 'utf8')
html = replaceOnce(html, cssLink[0], '')
html = replaceOnce(html, '</head>', `<style>${css}</style>\n</head>`)

// O JavaScript (que só deixa a página interativa) é pedido assim que o navegador mostra a primeira
// tela (evento first-contentful-paint): o conteúdo já está no HTML, então nada visível espera por ele,
// e o download do JS não disputa a rede com o que aparece primeiro.
// Rede de segurança: interação do usuário ou 2,5s, o que vier antes.
const appScript = /<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/.exec(html)
if (!appScript) throw new Error('prerender: não encontrei o script principal no index.html')
html = replaceOnce(html, appScript[0], '')
html = html.replace(/<link rel="modulepreload"[^>]*>\s*/g, '')
const loader = `(function(){
var done=0,ev=['pointerdown','keydown','touchstart','scroll'];
function go(){if(done)return;done=1;ev.forEach(function(e){removeEventListener(e,go)});var s=document.createElement('script');s.type='module';s.crossOrigin='';s.src=${JSON.stringify(appScript[1])};document.head.appendChild(s)}
try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){if(e.name==='first-contentful-paint')setTimeout(go,0)})}).observe({type:'paint',buffered:true})}catch(e){requestAnimationFrame(function(){setTimeout(go,0)})}
ev.forEach(function(e){addEventListener(e,go,{passive:true,once:true})});setTimeout(go,2500)
})()`.replace(/\n/g, '')

const home = await renderHome()
if (home.html.includes('$RC') || home.html.includes('<template')) throw new Error('prerender: alguma seção não terminou de renderizar')
html = replaceOnce(html, '</head>', `${home.head}\n</head>`)
html = replaceOnce(html, '<div id="root"></div>', `<div id="root">${home.html}</div><script>${home.fitScript};${loader}</script>`)
writeFileSync(new URL('index.html', dist), html)
console.log(`prerender: index.html (${(html.length / 1024).toFixed(1)} kB)`)

// ---------- Páginas de conteúdo ----------
for (const page of renderPages()) {
  writeFileSync(new URL(page.file, dist), page.html)
  console.log(`prerender: ${page.file} -> ${page.path} (${(page.html.length / 1024).toFixed(1)} kB)`)
}

rmSync(serverDir, { recursive: true, force: true })
