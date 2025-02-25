'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Play, SkipForward, Plus, Share2, ChevronUp, ChevronDown, Music } from 'lucide-react'
import { YT_REGEX } from '../api/streams/route'

const REFRESH_INTERVAL = 10 * 1000

export default function StreamView({
  creatorId,
  playSong,
}: {
  creatorId: string
  playSong: boolean
}) {
  const [queue, setQueue] = useState<Song[]>([])
  const [song, setSong] = useState<Song | null>(null)
  const [set, setActiveStream] = useState<Song | null>(null)
  const [url, setUrl] = useState('')
  const [videoId, setVideoId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const refreshStream = async () => {
    const res = await fetch(`/api/streams/?creatorId=${creatorId}`, {
      credentials: 'include',
    })
    const json = await res.json()
    setQueue(json.stream.sort((a:any , b: any)=> a.upvotes < b.upvotes ? 1 : -1));
    setActiveStream(json.activeStream)
  }

  useEffect(() => {
    refreshStream()
    const interval = setInterval(() => {
      refreshStream()
    }, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  const playNext = async () => {
    if (queue.length > 0) {
      const data = await fetch('/api/streams/next_stream', {
        method: 'POST',
      })
      const json = await data.json()
      setActiveStream(json.stream)
    }
  }

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
    const shareUrl = `${window.location.hostname}/creator/${creatorId}`

    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
      })
      .catch((err) => console.error('Error copying link:', err))
  }

  const voteSong = async (streamId: string, isUpvote: boolean) => {
    const response = await fetch(`/api/streams/${isUpvote ? 'upvote' : 'downvote'}`, {
      method: 'POST',
      body: JSON.stringify({ streamId }),
      credentials: 'include',
    })

    if (response.ok) {
      setQueue(
        queue
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
    } else {
      console.error('Failed to update votes:', await response.json())
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <motion.h1
        className="text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        Your Muzic Dashboard
      </motion.h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
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
              <div className="mt-4">
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
          <motion.div
            className="bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-white">Now Playing</h2>
            {song ? (
              <div className="flex items-center">
                <Image
                  src={song.bigImg || ""}
                  alt={`${song.title} cover`}
                  width={120}
                  height={120}
                  className="rounded-lg mr-6"
                />
                <h3 className="text-2xl font-semibold mb-2">{song.title}</h3>
                <div className="flex items-center space-x-4">
                  <button className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-300">
                    <Play fill="currentColor" size={24} />
                  </button>
                  <button className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-300">
                    <SkipForward size={24} />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">No song playing</p>
            )}
            {playSong && (
              <button 
                onClick={playNext} 
                className="px-6 py-2 mt-3 w-full bg-gradient-to-r from-green-400 to-green-900 text-white rounded-full hover:from-green-800 hover:to-green-700 transition-colors duration-300 flex justify-center font-semibold"
              >
                Play Next
              </button>
            )}
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            className="bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-white">Upcoming Songs</h2>
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300">
              <ul className="space-y-4">
                {queue.map((song, index) => (
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
        </motion.div>
      </div>
    </div>
  )
}


interface Song  {
  id: string;
  title: string;
  url: string;
  upvotes: number;
  type?: string;
  extractedId?: string;
  smallImg?: string;
  bigImg?: string;
  active?: boolean;
  userId?: string;
  haveUpvoted?: boolean;
}





