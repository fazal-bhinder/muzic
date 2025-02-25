'use client'

import  { creatorId } from '../components/AddSong'
import StreamView from '../components/StreamView'

export default function Dashboard() {
  return <StreamView creatorId={creatorId} playSong={true} />
}