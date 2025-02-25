'use client'
import { motion } from 'framer-motion'

export default function Footer(){
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { 
            staggerChildren: 0.2
          }
        }
      }
    
      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 10
          }
        }
      }
    return <div>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-3xl font-bold sm:text-4xl text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Why Choose Muzic?
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300" variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-4">Vast Library</h3>
            <p className="text-gray-400">
              Access millions of songs from various genres and artists worldwide.
            </p>
          </motion.div>
          <motion.div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300" variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-4">Personalized Playlists</h3>
            <p className="text-gray-400">
              Enjoy custom playlists tailored to your music taste and mood.
            </p>
          </motion.div>
          <motion.div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300" variants={itemVariants}>
            <h3 className="text-xl font-semibold mb-4">High-Quality Audio</h3>
            <p className="text-gray-400">
              Experience crystal-clear sound with our premium audio quality.
            </p>
          </motion.div>
        </motion.div>
      </section>
    </div>
}