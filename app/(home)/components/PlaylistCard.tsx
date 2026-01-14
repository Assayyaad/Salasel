import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Video } from '@/app/types'

export interface PlaylistCardProps {
  title: string
  description: string
  imageUrl: string
  playlistId: string
  course: Video[]
  tags: string[]
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ title, description, imageUrl, playlistId }) => {
  return (
    <Link href={`/playlist/${playlistId}`}>
      <article className="group cursor-pointer">
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-800 relative shadow-sm group-hover:shadow-lg transition-shadow duration-300">
          <Image
            src={imageUrl}
            alt={title}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>
        <div className="mt-4" dir="rtl">
          <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </article>
    </Link>
  )
}

export default PlaylistCard
