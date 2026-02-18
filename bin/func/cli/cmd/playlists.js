/** @import { FilledPlaylist } from '../../../types.js' */

const { fetchPlaylist, parsePlaylist, parseVideo } = require('../../api/youtube-sr.js')
const { withCommandErrorHandling, logSuccess, logAction } = require('../../util/cmd.js')
const { extractPlaylistId } = require('../../util/youtube.js')
const prompts = require('../prompts.js')
const csvDb = require('../../db/csv.js')

/**
 * Reads playlists and prompts user to select one
 * @returns {Promise<FilledPlaylist | undefined>}
 * @private
 */
async function selectPlaylist() {
  const url = await prompts.getPlaylistUrl()
  const id = extractPlaylistId(url)
  const playlists = await csvDb.readPlaylists()
  return playlists.find((p) => p.id === id)
}

/**
 * Adds a playlist from YouTube URL
 * @returns {Promise<void>}
 */
async function addPlaylist() {
  await withCommandErrorHandling(async () => {
    const url = await prompts.getPlaylistUrl()
    const id = extractPlaylistId(url)

    logAction('Fetching playlist data from YouTube...')
    const rawPlaylist = await fetchPlaylist(url)
    if (!rawPlaylist) {
      throw new Error('Playlist not found or is private')
    }

    // Parse playlist and videos
    const playlist = parsePlaylist(rawPlaylist)
    const videos = rawPlaylist.videos.map(parseVideo)
    console.log(`Found playlist: "${playlist.name}" with ${videos.length} videos`)

    /** @type {Promise<any>[]} */
    const promises = []

    // Check if playlist exists
    const playlists = await csvDb.readPlaylists()
    const storedPlaylist = playlists.find((p) => p.id === id)
    if (!storedPlaylist) {
      promises.push(csvDb.addPlaylist(playlist))
    }

    // Check if videos exist for the playlist
    const existingVideos = await csvDb.readVideos(playlist.id)
    if (existingVideos.length === 0) {
      promises.push(csvDb.addVideos(playlist.id, videos))
    }

    if (promises.length > 0) {
      await Promise.all(promises)
    }

    logSuccess(`Playlist "${playlist.name}" added successfully!`)
  }, 'Failed to add playlist')
}

/**
 * Fills playlist manual data
 * @returns {Promise<void>}
 */
async function fillPlaylist() {
  await withCommandErrorHandling(async () => {
    const storedPlaylist = await selectPlaylist()
    if (!storedPlaylist) {
      console.log('Playlist not found in database. Please add it first.')
      return
    }

    logAction(`Filling playlist data: "${storedPlaylist.name}"`)

    // Fill manual data
    const filledPlaylist = await prompts.fillPlaylist(storedPlaylist)

    await csvDb.updatePlaylist(filledPlaylist)
    logSuccess(`Playlist "${filledPlaylist.name}" filled successfully!`)
  }, 'Failed to fill playlist')
}

/**
 * Removes a playlist from the database
 * @returns {Promise<void>}
 */
async function removePlaylist() {
  await withCommandErrorHandling(async () => {
    const storedPlaylist = await selectPlaylist()
    if (!storedPlaylist) {
      console.log('Playlist not found in database.')
      return
    }

    const shouldRemove = await prompts.confirmAction(
      `Are you sure you want to remove playlist "${storedPlaylist.name}"? This will also remove all associated video data.`,
    )
    if (!shouldRemove) {
      console.log('Playlist not removed.')
      return
    }

    const removed = await csvDb.removePlaylist(storedPlaylist.id)
    if (removed) {
      logSuccess(`Playlist "${storedPlaylist.name}" removed successfully!`)
    } else {
      console.log('Playlist not found.')
    }
  }, 'Failed to remove playlist')
}

module.exports = {
  addPlaylist,
  fillPlaylist,
  removePlaylist,
}
