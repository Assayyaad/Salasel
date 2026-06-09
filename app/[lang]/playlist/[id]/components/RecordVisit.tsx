'use client'

import { useEffect } from 'react'
import { useProgressStore } from '@/app/store/useProgressStore'

export interface RecordVisitProps {
  playlistId: string
}

const RecordVisit: React.FC<RecordVisitProps> = ({ playlistId }) => {
  const { recordPlaylistVisit } = useProgressStore()

  useEffect(() => {
    recordPlaylistVisit(playlistId)
  }, [playlistId, recordPlaylistVisit])

  return null
}

export default RecordVisit
