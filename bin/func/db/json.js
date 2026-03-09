/** @import { CalculatedPlaylist, CalculatedVideo, CalculatedProgram } from '../../types.js' */

const path = require('path')
const fs = require('fs-extra')
const csvDb = require('./csv.js')
const { jsonPlaylistsFile, jsonVideosDir, jsonProgramsFile } = require('../../static.js')
const { calcPlaylist, calcVideo, calcProgram } = require('../util/youtube.js')

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
 * Writes videos for a specific playlist to JSON
 * @param {string} playlistId - Playlist ID
 * @param {CalculatedVideo[]} videos - Array of video objects
 * @returns {Promise<void>}
 * @private
 */
async function writeVideos(playlistId, videos) {
  await fs.ensureDir(jsonVideosDir)
  const videoPath = path.join(jsonVideosDir, `${playlistId}.json`)
  const videosObj = videos.reduce((acc, v) => {
    acc[v.id] = v
    return acc
  }, /** @type {Record<string, CalculatedVideo>} */ ({}))
  const content = JSON.stringify(videosObj)
  await fs.writeFile(videoPath, content, 'utf8')
}

/**
 * Writes all programs to the JSON file
 * @param {CalculatedProgram[]} programs - Array of program objects
 * @returns {Promise<void>}
 * @private
 */
async function writePrograms(programs) {
  await fs.ensureFile(jsonProgramsFile)
  const programsObj = programs.reduce((acc, prog) => {
    acc[prog.id] = prog
    return acc
  }, /** @type {Record<string, CalculatedProgram>} */ ({}))
  const content = JSON.stringify(programsObj)
  await fs.writeFile(jsonProgramsFile, content, 'utf8')
}

/**
 * Converts all CSV data to JSON format
 * @returns {Promise<{playlistCount: number, videoCount: number, programCount: number}>} Conversion summary
 */
async function convertCsvToJson() {
  // Read all playlists and programs from CSV
  const [playlists, programs] = await Promise.all([csvDb.readPlaylists(), csvDb.readPrograms()])

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

  // Build a map of playlistId -> CalculatedPlaylist for fast lookup
  /** @type {Record<string, CalculatedPlaylist>} */
  const playlistMap = {}
  for (const pl of newPlaylists) {
    playlistMap[pl.id] = pl
  }

  // Calculate programs using their associated playlists
  /** @type {CalculatedProgram[]} */
  const newPrograms = programs.map((prog) => {
    const progPlaylists = prog.playlistsOrder.map((id) => playlistMap[id]).filter(Boolean)
    return calcProgram(prog, progPlaylists)
  })

  writePromises.push(writePlaylists(newPlaylists))
  writePromises.push(writePrograms(newPrograms))
  await Promise.all(writePromises)

  return {
    playlistCount: playlists.length,
    videoCount: totalVideos,
    programCount: programs.length,
  }
}

module.exports = {
  convertCsvToJson,
}
