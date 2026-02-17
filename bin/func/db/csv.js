/** @import { FetchedPlaylist, FetchedVideo, FilledPlaylist } from '../../types.js' */

const path = require('path')
const fs = require('fs-extra')
const { stringifyVideo, objectifyVideo, stringifyPlaylist, objectifyPlaylist } = require('./str.js')
const { playlistHeader, videoHeader, playlistsFile, videosDir } = require('../../static.js')
const { writeFileRecords, readFileRecords } = require('../util/csvFile.js')

/**
 * Gets the path to a playlist's video CSV file
 * @param {string} playlistId - The playlist ID
 * @returns {string} Full path to the video CSV file
 */
function getVideoPath(playlistId) {
  return path.join(videosDir, `${playlistId}.csv`)
}

/**
 * Reads all playlists from the CSV file
 * @returns {Promise<FilledPlaylist[]>} Array of playlist objects
 */
async function readPlaylists() {
  const exists = await fs.pathExists(playlistsFile)
  if (!exists) {
    return []
  }

  // @ts-expect-error
  return /** @type {FilledPlaylist[]} */ (await readFileRecords(playlistsFile, objectifyPlaylist))
}

/**
 * Adds or updates a playlist in the CSV database
 * @param {FetchedPlaylist} playlist - Playlist object to add or update
 * @returns {Promise<void>}
 */
async function addPlaylist(playlist) {
  /** @type {FetchedPlaylist[]} */
  const playlists = await readPlaylists()

  // Check if playlist already exists
  /** @type {number} */
  const plIndex = playlists.findIndex((pl) => pl.id === playlist.id)
  if (plIndex !== -1) {
    return
  }

  playlists.push(playlist)
  await writeFileRecords(playlistsFile, playlistHeader, playlists.map(stringifyPlaylist))
}

/**
 * @param {FilledPlaylist} playlist
 * @returns {Promise<void>}
 */
async function updatePlaylist(playlist) {
  const playlists = await readPlaylists()

  // Check if playlist already exists
  const plIndex = playlists.findIndex((pl) => pl.id === playlist.id)
  if (plIndex === -1) {
    throw new Error(`Playlist with id ${playlist.id} not found`)
  }

  playlists[plIndex] = playlist
  await writeFileRecords(playlistsFile, playlistHeader, playlists.map(stringifyPlaylist))
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

  await writeFileRecords(playlistsFile, playlistHeader, filteredPlaylists.map(stringifyPlaylist))

  // Also remove the playlist videos file
  const playlistVideoPath = getVideoPath(playlistId)
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
  const videoPath = getVideoPath(id)
  const exists = await fs.pathExists(videoPath)
  if (!exists) {
    return []
  }

  // @ts-expect-error
  return /** @type {FetchedVideo[]} */ (await readFileRecords(videoPath, objectifyVideo))
}

/**
 * @param {string} id
 * @param {FetchedVideo[]} videos
 * @returns {Promise<void>}
 */
async function addVideos(id, videos) {
  const videoPath = getVideoPath(id)
  const exists = await fs.pathExists(videoPath)
  if (exists) {
    return
  }

  await writeFileRecords(videoPath, videoHeader, videos.map(stringifyVideo))
}

/**
 * @param {string} id
 * @param {FetchedVideo[]} videos
 * @returns {Promise<void>}
 */
async function updateVideos(id, videos) {
  const videoPath = getVideoPath(id)
  const exists = await fs.pathExists(videoPath)
  if (!exists) {
    throw new Error(`Video file for playlist ${id} does not exist`)
  }

  await writeFileRecords(videoPath, videoHeader, videos.map(stringifyVideo))
}

module.exports = {
  readPlaylists,
  addPlaylist,
  updatePlaylist,
  removePlaylist,

  readVideos,
  addVideos,
  updateVideos,
}
