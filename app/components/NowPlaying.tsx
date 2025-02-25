'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Play, SkipForward } from 'lucide-react'
import { Song } from './types'
import { useState } from 'react'

type NowPlayingProps = {
  song: Song | null ,
}

export default function NowPlaying({ song }: NowPlayingProps) {

  const [currentSong, setSong] = useState<Song | null>(null)
  const [set, setActiveStream] = useState<Song | null>(null)

  
  return (
    <motion.div 
      className="bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-white">Now Playing</h2>
      <div className="flex items-center">
        {currentSong ?(<Image
          src={currentSong?.bigImg || ""}
          alt={`${currentSong?.title} cover`}
          width={120}
          height={120}
          className="rounded-lg mr-6"
        />):(<p className="text-gray-400">No song playing</p>)}
          <h3 className="text-2xl font-semibold mb-2">{currentSong?.title}</h3>
        </div>

    </motion.div>
  )
}

