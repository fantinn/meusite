// Usado só no build (scripts/prerender.mjs): gera o HTML de todas as páginas.
import { StrictMode } from 'react'
import { renderToPipeableStream, renderToStaticMarkup } from 'react-dom/server'
import { Writable } from 'node:stream'
import App from './App'
import { faq } from './content'
import { fitHeroTitle } from './heroFit'
import { pages } from './pages'
import { Document, faqLd, ldJson } from './pages/Layout'
import pagesCss from './pages/pages.css?inline'

// Página inicial: HTML que o React do navegador "hidrata" (assume) depois.
// Espera todas as seções (inclusive as carregadas sob demanda) antes de gerar o HTML.
function renderApp() {
  return new Promise<string>((resolve, reject) => {
    let html = ''
    const sink = new Writable({
      write(chunk, _encoding, done) {
        html += chunk
        done()
      },
      final(done) {
        resolve(html)
        done()
      },
    })
    const stream = renderToPipeableStream(
      <StrictMode>
        <App />
      </StrictMode>,
      { onAllReady: () => stream.pipe(sink), onShellError: reject, onError: reject },
    )
  })
}

export async function renderHome() {
  return {
    html: await renderApp(),
    head: `<script type="application/ld+json">${ldJson(faqLd(faq))}</script>`,
    // Ajusta o título do hero antes da primeira pintura (mesmo código do componente)
    fitScript: `(${fitHeroTitle.toString()})(document.getElementById('hero-title'))`,
  }
}

// Páginas de conteúdo: HTML 100% estático, sem JavaScript.
export function renderPages() {
  return pages.map((page) => ({
    file: page.file,
    path: page.path,
    html: `<!doctype html>${renderToStaticMarkup(<Document page={page} css={pagesCss} />)}`,
  }))
}
