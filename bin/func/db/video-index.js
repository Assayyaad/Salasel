/** @import { CalculatedVideo } from '../../types.js' */

const path = require('path')
const fs = require('fs-extra')
const { jsonPlaylistsFile, jsonVideosDir, jsonDir } = require('../../static.js')

const videoIndexFile = path.join(jsonDir, 'video-index.json')

/**
 * Reads all playlist IDs from the JSON playlists file
 * @returns {Promise<string[]>} Array of playlist IDs
 */
async function readPlaylistIds() {
  const exists = await fs.pathExists(jsonPlaylistsFile)
  if (!exists) {
    return []
  }

  const content = await fs.readFile(jsonPlaylistsFile, 'utf8')
  const playlists = JSON.parse(content)
  return Object.keys(playlists)
}

/**
 * Reads all video IDs for a given playlist from its JSON file
 * @param {string} playlistId - The playlist ID
 * @returns {Promise<string[]>} Array of video IDs belonging to this playlist
 */
async function readVideoIdsForPlaylist(playlistId) {
  const videoPath = path.join(jsonVideosDir, `${playlistId}.json`)
  const exists = await fs.pathExists(videoPath)
  if (!exists) {
    return []
  }

  const content = await fs.readFile(videoPath, 'utf8')
  const videos = /** @type {Record<string, CalculatedVideo>} */ (JSON.parse(content))
  return Object.keys(videos)
}

/**
 * Builds a flat map of videoId to playlistId across all playlists
 * @returns {Promise<Record<string, string>>} Map of { videoId: playlistId }
 */
async function buildVideoIndex() {
  const playlistIds = await readPlaylistIds()

  const videoIdArrays = await Promise.all(
    playlistIds.map(async (playlistId) => {
      const videoIds = await readVideoIdsForPlaylist(playlistId)
      return { playlistId, videoIds }
    }),
  )

  /** @type {Record<string, string>} */
  const index = {}
  for (const { playlistId, videoIds } of videoIdArrays) {
    for (const videoId of videoIds) {
      index[videoId] = playlistId
    }
  }

  return index
}

/**
 * Generates video-index.json and writes it to the public directory
 * @returns {Promise<{videoCount: number}>} Summary of the generated index
 */
async function generateVideoIndex() {
  const index = await buildVideoIndex()

  await fs.ensureFile(videoIndexFile)
  await fs.writeFile(videoIndexFile, JSON.stringify(index), 'utf8')

  return { videoCount: Object.keys(index).length }
}

module.exports = {
  generateVideoIndex,
}
