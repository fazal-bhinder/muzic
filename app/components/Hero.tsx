'use client'

import Link from 'next/link'
import { Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { signIn, useSession } from 'next-auth/react'

const Hero = () => {
    

  return (
    <div className="relative bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 md:pt-32 md:pb-32">
        <div className="text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Your Music, Your Way
          </motion.h1>
          <motion.p 
            className="mt-6 text-lg md:text-xl text-gray-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Stream millions of songs and podcasts on the go. Start listening for free today.
          </motion.p>
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >

            <GetStarted/>
            <DiscoverMusic/>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Hero

export function GetStarted(){

    const session = useSession();
    if(!session?.data?.user){
        return <div>
        <button className="px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors duration-300 min-w-[200px]" onClick={()=>signIn()}>Get Started</button>
        </div>
    }else{
        return <div>
            <Link 
                href="/dashboard" 
                className="px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors duration-300 min-w-[200px]"
                >
                Get Started
                </Link>
            </div>
    }
}

export function DiscoverMusic(){
    const session = useSession();

    if(session?.data?.user){
        return <Link 
              href="/dashboard" 
              className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/20 transition-colors duration-300 flex items-center justify-center gap-2 min-w-[200px]"
            >
              <Play className="h-5 w-5" />
              Discover Music
            </Link>
    }
}