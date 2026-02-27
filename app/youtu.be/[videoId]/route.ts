import type { Playlists } from '@/app/types'

import { NextRequest, NextResponse } from 'next/server'
import { getPlaylists } from '@/app/db'
import videoIndex from '@/public/video-index.json'

export async function GET(request: NextRequest, { params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = await params
  const listId = request.nextUrl.searchParams.get('list')
  const playlists: Playlists = getPlaylists()

  // Case 1: playlist ID provided and known
  if (listId && playlists[listId]) {
    const lang = playlists[listId].language
    return NextResponse.redirect(new URL(`/${lang}/playlist/${listId}/${videoId}`, request.url))
  }

  // Case 2: look up playlist from video index
  const playlistId = (videoIndex as Record<string, string>)[videoId]
  if (playlistId && playlists[playlistId]) {
    const lang = playlists[playlistId].language
    return NextResponse.redirect(new URL(`/${lang}/playlist/${playlistId}/${videoId}`, request.url))
  }

  return new NextResponse('المحتوى غير متوفر على سلاسل', { status: 404 })
}
