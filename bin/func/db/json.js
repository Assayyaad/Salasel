/** @import { CalculatedPlaylist, CalculatedVideo } from '../../types.js' */

const path = require('path')
const fs = require('fs-extra')
const csvDb = require('./csv.js')
const { jsonPlaylistsFile, jsonVideosDir } = require('../../static.js')
const { calcPlaylist, calcVideo } = require('../util/youtube.js')

/**
 * Reads all playlists from the JSON file
 * @returns {Promise<CalculatedPlaylist[]>} Array of playlist objects
 */
async function readPlaylists() {
  const exists = await fs.pathExists(jsonPlaylistsFile)
  if (!exists) {
    return []
  }

  const content = await fs.readFile(jsonPlaylistsFile, 'utf8')
  const playlists = /** @type {CalculatedPlaylist[]} */ (JSON.parse(content))

  return playlists.map((pl) => ({
    ...pl,
    videoCount: pl.videoCount < 0 ? 0 : pl.videoCount,
    duration: pl.duration < 0 ? 0 : pl.duration,
    startDate: pl.startDate < 0 ? 0 : pl.startDate,
    endDate: pl.endDate < 0 ? 0 : pl.endDate,
  }))
}

/**
 * Writes all playlists to the JSON file
 * @param {CalculatedPlaylist[]} playlists - Array of playlist objects
 * @returns {Promise<void>}
 */
async function writePlaylists(playlists) {
  await fs.ensureFile(jsonPlaylistsFile)
  const content = JSON.stringify(playlists, null, 2)
  await fs.writeFile(jsonPlaylistsFile, content, 'utf8')
}

/**
 * Reads videos for a specific playlist from JSON
 * @param {string} playlistId - Playlist ID
 * @returns {Promise<CalculatedVideo[]>} Array of video objects
 */
async function readVideos(playlistId) {
  const videoPath = path.join(jsonVideosDir, `${playlistId}.json`)

  const exists = await fs.pathExists(videoPath)
  if (!exists) {
    return []
  }

  const content = await fs.readFile(videoPath, 'utf8')
  const videos = /** @type {CalculatedVideo[]} */ (JSON.parse(content))

  return videos.map((v) => ({
    ...v,
    duration: v.duration < 0 ? 0 : v.duration,
    uploadedAt: v.uploadedAt < 0 ? 0 : v.uploadedAt,
  }))
}

/**
 * Writes videos for a specific playlist to JSON
 * @param {string} playlistId - Playlist ID
 * @param {CalculatedVideo[]} videos - Array of video objects
 * @returns {Promise<void>}
 */
async function writeVideos(playlistId, videos) {
  await fs.ensureDir(jsonVideosDir)
  const videoPath = path.join(jsonVideosDir, `${playlistId}.json`)
  const content = JSON.stringify(videos, null, 2)
  await fs.writeFile(videoPath, content, 'utf8')
}

/**
 * Converts all CSV data to JSON format
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

  // Process each playlist and its videos
  const writePromises = []
  for (let i = 0; i < playlists.length; i++) {
    const pl = playlists[i]
    const videos = videosArrays[i]

    newPlaylists.push(calcPlaylist(pl, videos))
    totalVideos += videos.length

    const newVideos = videos.map((v) => calcVideo(v, pl))
    writePromises.push(writeVideos(pl.id, newVideos))
  }

  writePromises.push(writePlaylists(newPlaylists))
  await Promise.all(writePromises)

  return {
    playlistCount: playlists.length,
    videoCount: totalVideos,
  }
}

module.exports = {
  readPlaylists,
  writePlaylists,

  readVideos,
  writeVideos,

  convertCsvToJson,
}
