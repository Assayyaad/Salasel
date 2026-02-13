/** @import { FetchedPlaylist, FetchedVideo, FilledPlaylist } from '../../types.js' */

const path = require('path')
const fs = require('fs-extra')
const { stringifyVideo, objectifyVideo, stringifyPlaylist, objectifyPlaylist } = require('./str.js')
const { playlistHeader, videoHeader, playlistsFile, videosDir } = require('../../static.js')
const { writeCsvFile, readCsvFile } = require('../util/csv.js')

/**
 * Reads all playlists from the CSV file
 * @returns {Promise<FilledPlaylist[]>} Array of playlist objects
 */
async function readPlaylists() {
  const exists = await fs.pathExists(playlistsFile)
  if (exists) {
    return await readCsvFile(playlistsFile, objectifyPlaylist)
  }

  await writeCsvFile(playlistsFile, playlistHeader, [])
  return []
}

/**
 * Adds or updates a playlist in the CSV database
 * @param {FetchedPlaylist | FilledPlaylist} playlist - Playlist object to add or update
 * @returns {Promise<void>}
 */
async function addPlaylist(playlist) {
  /** @type {(FetchedPlaylist | FilledPlaylist)[]} */
  const playlists = await readPlaylists()

  // Check if playlist already exists
  /** @type {number} */
  const plIndex = playlists.findIndex((p) => p.id === playlist.id)
  if (plIndex !== -1) {
    return
  }

  playlists.push(playlist)
  await writeCsvFile(playlistsFile, playlistHeader, playlists.map(stringifyPlaylist))
}

/**
 * Removes a playlist from the CSV database
 * @param {string} playlistId - id of the playlist to remove
 * @returns {Promise<boolean>} True if removed, false if not found
 */
async function removePlaylist(playlistId) {
  const playlists = await readPlaylists()
  const filteredPlaylists = playlists.filter((p) => p.id !== playlistId)

  if (filteredPlaylists.length === playlists.length) {
    return false // Playlist not found
  }

  await writeCsvFile(playlistsFile, playlistHeader, filteredPlaylists.map(stringifyPlaylist))

  // Also remove the playlist videos file
  const playlistVideoPath = path.join(videosDir, `${playlistId}.csv`)
  if (await fs.pathExists(playlistVideoPath)) {
    await fs.remove(playlistVideoPath)
  }

  return true
}

/**
 * @param {string} id
 * @returns {Promise<FetchedVideo[]>}
 */
async function readVideos(id) {
  const videoPath = path.join(videosDir, `${id}.csv`)
  const exists = await fs.pathExists(videoPath)
  if (!exists) {
    return []
  }

  return readCsvFile(videoPath, objectifyVideo)
}

/**
 * @param {string} id
 * @param {FetchedVideo[]} videos
 * @returns {Promise<void>}
 */
async function addVideos(id, videos) {
  const videoPath = path.join(videosDir, `${id}.csv`)
  const exists = await fs.pathExists(videoPath)
  if (!exists) {
    return
  }

  await writeCsvFile(videoPath, videoHeader, videos.map(stringifyVideo))
}

module.exports = {
  readPlaylists,
  addPlaylist,
  removePlaylist,
  readVideos,
  addVideos,
}
