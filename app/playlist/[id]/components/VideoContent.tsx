import type { Video } from '@/app/types'
import React from 'react'
import SidebarContentCard from './SidebarContentCard'

interface VideoContentProps {
  videos: Video[];
  currentVideoId: string;
  playlistId: string;
}

const VideoContent: React.FC<VideoContentProps> = ({ videos, currentVideoId, playlistId }) => {
  return (
    <div className="flex-1 overflow-y-auto pr-1 space-y-2">
      {videos.map((video, index) => (
        <SidebarContentCard
          key={video.id}
          lessonNumber={index + 1}
          title={video.title}
          duration={video.duration}
          videoId={video.id}
          highlight={video.id === currentVideoId}
          completed={false} // This can be connected to user state later
          playlistId={playlistId}
        />
      ))}
    </div>
  )
}

export default VideoContent
