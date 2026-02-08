import Link from 'next/link'

interface SidebarContentCardProps {
  lessonNumber: number
  title: string
  duration: string
  highlight?: boolean
  videoId: string
  playlistId: string
  completed: boolean
  onToggle: (videoId: string) => void
}

const SidebarContentCard: React.FC<SidebarContentCardProps> = ({
  lessonNumber,
  title,
  duration,
  highlight,
  videoId,
  playlistId,
  completed,
  onToggle,
}) => {
  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.preventDefault()
    onToggle(videoId)
  }

  return (
    <Link
      href={`/playlist/${playlistId}/${videoId}`}
      dir="rtl"
      className={`block group relative transition-colors cursor-pointer p-3 ${highlight ? 'bg-gray-50 dark:bg-gray-700/30' : ''} ${completed ? 'bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-800/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}
    >
      <div className="grid grid-cols-[1fr_auto] items-center gap-3">
        <div className="flex items-center">
          <div className="mr-3">
            <p className="text-xs font-medium text-primary mb-0.5">الحلقة {lessonNumber}</p>
            <h3 className="text-sm font-semibold text-text-light dark:text-text-dark truncate group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs text-muted-light dark:text-muted-dark font-medium mt-0.5">{duration}</p>
          </div>
        </div>
        <div onClick={handleCheckboxChange} className="relative z-20 p-1">
          <div
            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${completed ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'}`}
          >
            {completed && <span className="material-icons-round text-white text-base">done</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default SidebarContentCard
