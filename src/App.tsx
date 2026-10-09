import { Suspense, lazy, type ComponentType } from 'react'
import { MotionConfig } from 'framer-motion'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import LogosStrip from './components/LogosStrip'

// O que fica abaixo da dobra vem em arquivos separados. O HTML de todas as seções já chega
// pronto (pré-renderizado); cada uma é "hidratada" sozinha quando o arquivo dela carrega,
// em vez de o navegador processar o site inteiro de uma vez.
const Statement = lazy(() => import('./components/Statement'))
const Services = lazy(() => import('./components/Services'))
const Work = lazy(() => import('./components/Work'))
const ScrollMarquee = lazy(() => import('./components/ScrollMarquee'))
const Stats = lazy(() => import('./components/Stats'))
const Testimonials = lazy(() => import('./components/Testimonials'))
const Pricing = lazy(() => import('./components/Pricing'))
const Faq = lazy(() => import('./components/Faq'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))
const PaymentResult = lazy(() => import('./components/PaymentResult'))

function Later({ C }: { C: ComponentType }) {
  return (
    <Suspense fallback={null}>
      <C />
    </Suspense>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <LogosStrip />
        <Later C={Statement} />
        <Later C={Services} />
        <Later C={Work} />
        <Later C={ScrollMarquee} />
        <Later C={Stats} />
        <Later C={Testimonials} />
        <Later C={Pricing} />
        <Later C={Faq} />
        <Later C={Contact} />
      </main>
      <Later C={Footer} />
      <Later C={PaymentResult} />
    </MotionConfig>
  )
}
