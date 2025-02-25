
import { motion } from 'framer-motion'
import Hero from './components/Hero'
import Navbar from './components/NavBar'
import Text from './components/Footer'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="bg-black">
      <Navbar/>
      <Hero />
      <Footer/>
    </main>
  )
}

