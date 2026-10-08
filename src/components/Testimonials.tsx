import { Quote } from 'lucide-react'
import { testimonials } from '../content'
import Card from './Card'
import HorizontalScroll from './HorizontalScroll'

const initials = (name: string) => name.replace('Dra. ', '').split(' ').map((w) => w[0]).slice(0, 2).join('')

export default function Testimonials() {
  return (
    <HorizontalScroll kicker="Depoimentos" title="O que dizem os clientes." className="section--alt">
      {testimonials.map((t) => (
        <Card key={t.name} className="hscroll__card testimonial-card">
          <Quote size={28} className="testimonial-card__icon" />
          <blockquote>“{t.quote}”</blockquote>
          <figcaption className="testimonial__author">
            <span className="avatar">{initials(t.name)}</span>
            <span><strong>{t.name}</strong><small>{t.role}</small></span>
          </figcaption>
        </Card>
      ))}
    </HorizontalScroll>
  )
}
