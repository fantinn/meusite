import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, TrendingUp, X } from 'lucide-react'
import { projects, type Project } from '../content'
import { SectionHead, ease } from './Reveal'

function Cover({ p }: { p: Project }) {
  return (
    <motion.div className="project__cover" layoutId={`cover-${p.id}`}>
      <div className="project__cover-inner" style={{ background: p.gradient }} />
      <motion.div className={`project__mock${p.image ? ' project__mock--image' : ''}`} whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
        {p.image ? (
          <img src={p.image} alt={`${p.category} ${p.title}, criada por Gabriel Fantin`} loading="lazy" />
        ) : (
          <>
            <div className="skeleton" />
            <div className="skeleton" style={{ width: '80%' }} />
            <div className="skeleton" style={{ width: '60%' }} />
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Work() {
  const [active, setActive] = useState<Project | null>(null)

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active])

  return (
    <section id="projetos" className="section">
      <div className="container">
        <SectionHead kicker="Projetos" title="Sites e landing pages que já estão no ar." text="Alguns trabalhos recentes. Clique para ver os detalhes." />
        <div className="work">
          {projects.map((p) => (
            <motion.button
              key={p.id}
              className="project"
              layoutId={`card-${p.id}`}
              onClick={() => setActive(p)}
              whileHover={{ y: -6, boxShadow: 'var(--shadow-28)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            >
              <Cover p={p} />
              <div className="project__body">
                <div>
                  <div className="project__cat">{p.category}</div>
                  <motion.h3 layoutId={`title-${p.id}`}>{p.title}</motion.h3>
                </div>
                <span className="project__arrow"><ArrowUpRight size={18} /></span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <>
            <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)} />
            <div className="modal-wrap">
              <motion.div className="modal" layoutId={`card-${active.id}`} role="dialog" aria-modal aria-label={active.title} style={{ position: 'relative' }}>
                <button className="modal__close" onClick={() => setActive(null)} aria-label="Fechar"><X size={18} /></button>
                <Cover p={active} />
                <motion.div className="modal__body" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.5, ease } }} exit={{ opacity: 0 }}>
                  <div className="project__cat">{active.category}</div>
                  <motion.h3 layoutId={`title-${active.id}`} style={{ fontSize: 28, fontWeight: 600 }}>{active.title}</motion.h3>
                  <p>{active.text}</p>
                  <div className="modal__actions">
                    {active.result && <span className="modal__result"><TrendingUp size={16} /> {active.result}</span>}
                    {active.url && (
                      <a className="btn btn--primary" href={active.url} target="_blank" rel="noreferrer">
                        Ver site no ar <ArrowUpRight size={16} />
                      </a>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
