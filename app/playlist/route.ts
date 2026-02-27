import type { Playlists } from '@/app/types'

import { NextRequest, NextResponse } from 'next/server'
import { getPlaylists } from '@/app/db'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const listId = searchParams.get('list')

  const playlists: Playlists = getPlaylists()

  if (listId && playlists[listId]) {
    const lang = playlists[listId].language
    return NextResponse.redirect(new URL(`/${lang}/playlist/${listId}`, request.url))
  }

  return new NextResponse('المحتوى غير متوفر على سلاسل', { status: 404 })
}
