'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Share2 } from 'lucide-react'
import { YT_REGEX } from '../api/streams/route'
import { Song } from './types'

interface AddSongProps {
  setQueue: React.Dispatch<React.SetStateAction<Song[]>>
  queue: Song[]
}
export const creatorId = "cm4oquk250000s8y6ghins2nm";
export default function AddSong({ setQueue, queue }: AddSongProps) {
  const [url, setUrl] = useState('')
  const [videoId, setVideoId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false) 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/streams/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId,
          url,
        }),
      })

      if (res.ok) {
        const newSong = await res.json()
        setQueue([...queue, newSong]) 
      }
    } catch (err) {
      console.error("Error adding song:", err)
    } finally {
      setLoading(false)
      setUrl('')
      setVideoId(null)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value
    setUrl(inputUrl)

    const match = inputUrl.match(YT_REGEX)
    if (match) {
      setVideoId(match[1])
    } else {
      setVideoId(null)
    }
  }

  const handleShare = () => {
    const shareUrl = `${window.location.hostname}/creator/${creatorId}`;

    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true); 
        setTimeout(() => setCopied(false), 1000); 
      })
      .catch((err) => console.error('Error copying link:', err));
  }

  return (
    <motion.div 
      className="bg-black/50 backdrop-blur-md p-6 rounded-2xl mb-8 border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-white">Add a Song</h2>
      <form className="flex" onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="Paste song URL here"
          className="flex-grow px-4 py-2 rounded-l-full bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button 
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-green-400 to-green-900 text-white rounded-r-full hover:from-green-800 hover:to-green-700 transition-colors duration-300 flex items-center"
          disabled={loading}
        >
          <Plus className="mr-2" size={20} />
          {loading ? "Adding..." : "Add to Queue"}
        </button>
     
        <button
          type="button"
          onClick={handleShare}
          className="ml-4 p-2 bg-gradient-to-r bg-green-400  text-white rounded-full hover:from-green-800 hover:to-green-700 transition-colors duration-300 flex items-center justify-center"
        >
          <Share2 size={20} />
        </button>
      </form>

        {copied && (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-sm p-2 rounded-md shadow-lg">
            Link copied!
          </div>
        )}
      
      {videoId && !loading && (
        <div className="mt-4 ">
          <h3 className="text-lg font-semibold text-white mb-">Preview</h3>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}
