/** @import { Playlist as FetchedPlaylist, Video as FetchedVideo } from 'youtube-sr' */
/** @import { FetchedVideo as Video, FetchedPlaylist as Playlist } from '../../types.js' */

const YouTube = require('youtube-sr').default
const { toPlaylistUrl, toVideoUrl, parseDate, parseDuration } = require('../util/youtube.js')

/**
 * @param {string} url
 * @returns {Promise<FetchedPlaylist>}
 */
async function fetchPlaylist(url) {
  url = toPlaylistUrl(url)

  try {
    return await YouTube.getPlaylist(url)
  } catch (/** @type {any} */ error) {
    throw new Error(`Failed to fetch playlist data: ${error.message}`)
  }
}

/**
 * Parses a youtube-sr Playlist into our application's Playlist format
 * @param {FetchedPlaylist} playlist
 * @returns {Playlist}
 */
function parsePlaylist(playlist) {
  return {
    id: playlist.id || '',
    name: playlist.title || '',
    thumbnailId: playlist.thumbnail?.id || playlist.videos[0]?.id || '',
  }
}

/**
 * @param {string} url URL or video ID
 * @returns {Promise<FetchedVideo>}
 */
async function fetchVideo(url) {
  url = toVideoUrl(url)

  try {
    return await YouTube.getVideo(url)
  } catch (/** @type {any} */ error) {
    throw new Error(`Failed to fetch video data: ${error.message}`)
  }
}

/**
 * @param {FetchedVideo} video
 * @returns {Video}
 */
function parseVideo({ id, title, uploadedAt, duration }) {
  return {
    id: id || '',
    title: title || '',
    uploadedAt: parseDate(uploadedAt),
    duration: parseDuration(duration),
  }
}

module.exports = {
  fetchPlaylist,
  parsePlaylist,
  fetchVideo,
  parseVideo,
}
