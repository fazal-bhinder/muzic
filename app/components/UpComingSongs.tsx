'use client'

import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, Music } from 'lucide-react'
import { Song } from './types'

interface UpcomingSongsProps {
  songs: Song[]
  setQueue: (queue: Song[]) => void
}

export default function UpcomingSongs({ songs, setQueue }: UpcomingSongsProps) {

  const voteSong = async (streamId: string, isUpvote: boolean) => {
    const response = await fetch(`/api/streams/${isUpvote ? 'upvote' : 'downvote'}`, {
      method: 'POST',
      body: JSON.stringify({ streamId }),
      credentials: 'include',
    });

    if (response.ok) {
      setQueue(
        songs
          .map((song) =>
            song.id === streamId
              ? {
                  ...song,
                  upvotes: isUpvote ? (song.upvotes || 0) + 1 : (song.upvotes || 0) - 1,
                  haveUpvoted: !song.haveUpvoted,
                }
              : song
          )
          .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
      )
    }else {
      console.error('Failed to update votes:', await response.json());
    }
  }

  return (
    <motion.div
      className="bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-white">Upcoming Songs</h2>
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300">
        <ul className="space-y-4">
          {songs.map((song, index) => (
            <motion.li
              key={song.id}
              className="flex items-center justify-between bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-400 to-green-900 p-2 rounded-lg mr-4">
                  <Music size={24} />
                </div>
                <h3 className="text-lg font-semibold">{song.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-900">
                  {typeof song.upvotes === 'number' ? song.upvotes : 0}
                </span>
                <div className="flex flex-col">
                  <button
                    onClick={() => voteSong(song.id, !song.haveUpvoted)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors duration-300"
                  >
                    {song.haveUpvoted ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
