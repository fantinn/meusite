import { ArrowUpRight } from 'lucide-react'
import { projectSrcSet, projects, type Project } from '../content'
import { SectionHead } from './Reveal'

const host = (url: string) => new URL(url).host.replace(/^www\./, '')

// Print do site dentro de uma janela de navegador, sobre a cor do projeto
function Shot({ p }: { p: Project }) {
  const inner = (
    <div className="case__window">
      <div className="case__bar" aria-hidden>
        <i /><i /><i />
        {p.url && <span className="case__url">{host(p.url)}</span>}
      </div>
      {p.image && (
        <img
          src={p.image}
          srcSet={projectSrcSet(p.image)}
          sizes="(max-width: 860px) calc(100vw - 64px), 600px"
          alt={`${p.category} ${p.title}, criada por Gabriel Fantin`}
          width={800}
          height={500}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  )
  return p.url ? (
    <a className="case__shot" style={{ background: p.gradient }} href={p.url} target="_blank" rel="noreferrer" aria-label={`Abrir o site ${p.title}`}>
      {inner}
    </a>
  ) : (
    <div className="case__shot" style={{ background: p.gradient }}>{inner}</div>
  )
}

export default function Work() {
  return (
    <section id="projetos" className="section">
      <div className="container">
        <SectionHead kicker="Projetos" title="Sites e landing pages que já estão no ar." text="Trabalhos recentes, todos publicados. Abra e navegue em cada um." />
        <div className="work">
          {projects.map((p, i) => (
            <article key={p.id} className="case">
              <Shot p={p} />
              <div className="case__body">
                <div className="case__meta">
                  <span className="case__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="case__cat">{p.category}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                {p.highlights && (
                  <ul className="case__tags">
                    {p.highlights.map((h) => <li key={h} className="tag">{h}</li>)}
                  </ul>
                )}
                <div className="case__actions">
                  {p.url && (
                    <a className="btn btn--primary" href={p.url} target="_blank" rel="noreferrer">
                      Ver site no ar <ArrowUpRight size={16} />
                    </a>
                  )}
                  <a className="case__link" href="#contato">Quero um assim</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
