import type { Video } from '@/app/types'

import React from 'react'
import ContentCard from './ContentCard' // Import ContentCard

interface VideoContentProps {
  videos: Video[]
}

const VideoContent: React.FC<VideoContentProps> = ({ videos }) => {
  return (
    <div className="flex-1 overflow-y-auto pr-1 space-y-2">
      {videos.map((video, index) => (
        <ContentCard
          key={video['معرف الفيديو']}
          lessonNumber={index + 1}
          title={video['عنوان']}
          duration={video['مدة']}
          videoId={video.id}
          completed={index === 0 ? true : false} // Set first video as completed for demonstration
        />
      ))}
    </div>
  )
}

export default VideoContent