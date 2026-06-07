import type { Translations } from '@/app/types'

export interface SidebarContentCardProps {
  lessonNumber: number
  title: string
  duration: string
  videoId: string
  playlistId: string
  t: Translations
}

const SidebarContentCard: React.FC<SidebarContentCardProps> = ({
  lessonNumber,
  title,
  duration,
  videoId,
  playlistId,
  t,
}) => {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${videoId}&list=${playlistId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative transition-colors cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30"
    >
      <div className="flex items-center">
        <div>
          <p className="text-xs font-medium text-primary mb-0.5">
            {t.episodeLabel} {lessonNumber}
          </p>
          <h3 className="text-sm font-semibold text-text-light dark:text-text-dark truncate group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-xs text-muted-light dark:text-muted-dark font-medium mt-0.5">{duration}</p>
        </div>
      </div>
    </a>
  )
}

export default SidebarContentCard
