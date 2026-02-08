// app/lib/localStorage.ts

const WATCHED_VIDEOS_PREFIX = 'watched-videos-'

export const addWatchedVideo = (playlistId: string, videoId: string) => {
  try {
    const key = `${WATCHED_VIDEOS_PREFIX}${playlistId}`
    const watchedVideos = getWatchedVideos(playlistId)
    if (!watchedVideos.includes(videoId)) {
      const newWatchedVideos = [...watchedVideos, videoId]
      localStorage.setItem(key, JSON.stringify(newWatchedVideos))
    }
  } catch (error) {
    console.error('Error saving to local storage:', error)
  }
}

export const removeWatchedVideo = (playlistId: string, videoId: string) => {
  try {
    const key = `${WATCHED_VIDEOS_PREFIX}${playlistId}`
    const watchedVideos = getWatchedVideos(playlistId)
    if (watchedVideos.includes(videoId)) {
      const newWatchedVideos = watchedVideos.filter((id) => id !== videoId)
      localStorage.setItem(key, JSON.stringify(newWatchedVideos))
    }
  } catch (error) {
    console.error('Error saving to local storage:', error)
  }
}

export const getWatchedVideos = (playlistId: string): string[] => {
  try {
    const key = `${WATCHED_VIDEOS_PREFIX}${playlistId}`
    const watchedVideos = localStorage.getItem(key)
    return watchedVideos ? JSON.parse(watchedVideos) : []
  } catch (error) {
    console.error('Error reading from local storage:', error)
    return []
  }
}
