/** @import { CalculatedPlaylist } from '../../types.js' */

const fs = require('fs-extra')
const csvDb = require('./csv.js')
const { jsonPlaylistsFile } = require('../../static.js')
const { calcPlaylist } = require('../util/youtube.js')

/**
 * Writes all playlists to the JSON file
 * @param {CalculatedPlaylist[]} playlists - Array of playlist objects
 * @returns {Promise<void>}
 * @private
 */
async function writePlaylists(playlists) {
  await fs.ensureFile(jsonPlaylistsFile)
  const playlistsObj = playlists.reduce((acc, pl) => {
    acc[pl.id] = pl
    return acc
  }, /** @type {Record<string, CalculatedPlaylist>} */ ({}))
  const content = JSON.stringify(playlistsObj)
  await fs.writeFile(jsonPlaylistsFile, content, 'utf8')
}

/**
 * Converts playlist CSV data to the JSON file consumed by the seed script.
 *
 * Videos are read only to compute each playlist's derived fields (video_count,
 * duration, start/end dates) — the seed script reads video rows straight from
 * the CSV files, so no per-video JSON is written.
 * @returns {Promise<{playlistCount: number, videoCount: number}>} Conversion summary
 */
async function convertCsvToJson() {
  // Read all playlists from CSV
  const playlists = await csvDb.readPlaylists()

  const videoPromises = []
  for (let i = 0; i < playlists.length; i++) {
    const pl = playlists[i]
    videoPromises.push(csvDb.readVideos(pl.id))
  }
  const videosArrays = await Promise.all(videoPromises)

  /** @type {CalculatedPlaylist[]} */
  const newPlaylists = []
  let totalVideos = 0

  // Process each playlist, deriving aggregate fields from its videos
  for (let i = 0; i < playlists.length; i++) {
    const pl = playlists[i]
    const videos = videosArrays[i]

    newPlaylists.push(calcPlaylist(pl, videos))
    totalVideos += videos.length
  }

  await writePlaylists(newPlaylists)

  return {
    playlistCount: playlists.length,
    videoCount: totalVideos,
  }
}

module.exports = {
  convertCsvToJson,
}
