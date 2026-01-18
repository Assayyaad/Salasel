'use client'
// app/playlist/[id]/components/SelectedPlaylistContent.tsx
import ContentCard from './ContentCard'
import { Playlist } from '@/app/types'

interface SelectedPlaylistContentProps {
  playlist: Playlist
}

const SelectedPlaylistContent: React.FC<SelectedPlaylistContentProps> = ({ playlist }) => {
  if (!playlist) {
    return <div>Loading...</div>
  }

  return (
    <div dir="rtl" className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-text-light dark:text-text-dark">محتويات السلسلة</h2>
        <span className="text-sm text-muted-light dark:text-muted-dark font-medium">
          {playlist.videos.length} حلقات
        </span>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {playlist.videos.map((video, index) => (
          <ContentCard
            key={video.id}
            lessonNumber={index + 1}
            title={video.title}
            duration={video.duration}
            videoId={video.id}
          />
        ))}
      </div>
    </div>
  )
}

export default SelectedPlaylistContent
