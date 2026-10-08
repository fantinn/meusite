import { MotionConfig } from 'framer-motion'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import LogosStrip from './components/LogosStrip'
import Statement from './components/Statement'
import Services from './components/Services'
import Process from './components/Process'
import Work from './components/Work'
import Stats from './components/Stats'
import Testimonials from './components/Testimonials'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'
import PaymentResult from './components/PaymentResult'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <LogosStrip />
        <Statement />
        <Services />
        <Process />
        <Work />
        <Stats />
        <Testimonials />
        <Pricing />
        <Contact />
      </main>
      <Footer />
      <PaymentResult />
    </MotionConfig>
  )
}
