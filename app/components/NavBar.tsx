'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Music, Search, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn, signOut, useSession } from 'next-auth/react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const session = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mx-4 my-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <Music className="h-6 w-6 text-white transition-transform duration-300 ease-in-out group-hover:scale-110" />
              <span className="ml-2 text-lg font-bold text-white group-hover:text-gray-300 transition-colors duration-300">Muzic</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="/">Home</NavLink>
            <NavIcon icon={<Search className="h-5 w-5" />} label="Search" />
            {session?.data?.user && <button className="px-4 py-1 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors duration-300" onClick={()=>signOut()}>Sign out</button>}
            {!session?.data?.user && <button className="px-4 py-1 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors duration-300" onClick={()=>signIn()}>Sign In</button>}
          </div>
          <div className="md:hidden">
            
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pt-2 pb-3 mt-2 space-y-1 sm:px-3 bg-black/50 backdrop-blur-md rounded-3xl border border-white/10">
              <MobileNavLink href="/">Home</MobileNavLink>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="px-3 py-2 text-sm font-medium text-white hover:text-gray-300 transition-colors duration-300">
    {children}
  </Link>
)

const NavIcon = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="p-1 rounded-full text-white hover:text-gray-300 focus:outline-none transition-colors duration-300">
    {icon}
    <span className="sr-only">{label}</span>
  </button>
)

const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="block px-3 py-2 text-base font-medium text-white hover:text-gray-300 transition-colors duration-300">
    {children}
  </Link>
)

export default Navbar

