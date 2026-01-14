import React from 'react'
import { Video } from '../../../types'

interface VideoContentProps {
  videos: Video[]
}

const VideoContent: React.FC<VideoContentProps> = ({ videos }) => {
  return (
    <div className="flex-1 overflow-y-auto pr-1 space-y-2">
      {videos.map((video, index) => (
        <div
          key={video['معرف الفيديو']}
          className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border border-transparent hover:border-border-light dark:hover:border-border-dark"
        >
          <input type="checkbox" className="form-checkbox h-5 w-5 text-primary rounded-sm focus:ring-primary" />
          <div className="flex-1">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {index + 1}. {video['عنوان']}
            </p>
          </div>
          <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
            {video['مدة']}
          </span>
        </div>
      ))}
    </div>
  )
}

export default VideoContent
