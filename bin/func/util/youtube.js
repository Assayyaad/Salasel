/** @import { CalculatedPlaylist, CalculatedVideo, FetchedPlaylist, FetchedVideo, FilledPlaylist } from '../../types.js'  */

/**
 * @param {string} str
 * @returns {string}
 */
function toPlaylistUrl(str) {
  if (str.startsWith('http')) {
    // If it's already a URL, validate and return it
    if (str.includes('youtube.com') || str.includes('youtu.be')) {
      if (!str.includes('list=')) {
        return 'Please enter a valid YouTube playlist URL (must contain list= parameter)'
      }

      return str
    }
  }

  // Otherwise, treat it as an ID and construct the URL
  return `https://www.youtube.com/playlist?list=${str.trim()}`
}

/**
 * @param {string} str
 * @returns {string}
 */
function toVideoUrl(str) {
  if (str.startsWith('http')) {
    // If it's already a URL, return it
    if (str.includes('youtube.com') || str.includes('youtu.be')) {
      if (str.includes('youtube.com') && !str.includes('v=')) {
        return 'Please enter a valid YouTube video URL (must contain v= parameter if it is youtube.com)'
      }

      return str
    }
  }

  // Otherwise, treat it as an ID and construct the URL
  return `https://www.youtube.com/watch?v=${str.trim()}`
}

/**
 * @param {string} url
 * @returns {string}
 */
function extractPlaylistId(url) {
  const match = url.match(/[&?]list=([^&]+)/)

  if (!match) {
    throw new Error('Invalid YouTube playlist URL')
  }

  return match[1]
}

/**
 * @param {string} url
 * @returns {string}
 */
function extractVideoId(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)

  if (!match) {
    throw new Error('Invalid YouTube video URL')
  }

  return match[1]
}

/**
 * Seconds
 * @param {string} [str]
 * @returns {number}
 */
function parseDate(str) {
  if (!str) return 0
  return new Date(`${str} UTC`).getTime() / 1000
}

/**
 * ٍSeconds
 * @param {number} num
 * @returns {number}
 */
function parseDuration(num) {
  if (isNaN(num)) return 0
  return num / 1000
}

/**
 * @param {FilledPlaylist} playlist
 * @param {FetchedVideo[]} videos
 * @returns {CalculatedPlaylist}
 */
function calcPlaylist(playlist, videos) {
  const lastI = videos.length - 1
  return {
    ...playlist,
    videoCount: videos.length,
    duration: videos.reduce((acc, v) => acc + v.duration, 0),
    startDate: videos[0].uploadedAt,
    endDate: videos[lastI].uploadedAt,
  }
}

/**
 * @param {FetchedVideo} video
 * @param {Pick<FetchedPlaylist, 'id'>} playlist
 * @returns {CalculatedVideo}
 */
function calcVideo(video, playlist) {
  return {
    ...video,
    playlistId: playlist.id,
  }
}

module.exports = {
  toPlaylistUrl,
  toVideoUrl,

  extractPlaylistId,
  extractVideoId,

  parseDate,
  parseDuration,

  calcPlaylist,
  calcVideo,
}
