/** @import { FetchedPlaylistWithVideos } from '../../../types.js' */

const { fetchPlaylist, parsePlaylist, parseVideo } = require('../../api/youtube-sr.js')
const { extractPlaylistId } = require('../../util/youtube.js')
const prompts = require('../prompts.js')
const csvDb = require('../../db/csv.js')

/**
 * Adds a playlist from YouTube URL
 * @returns {Promise<void>}
 */
async function addPlaylist() {
  try {
    const url = await prompts.getPlaylistUrl()
    const id = extractPlaylistId(url)

    console.log('\nFetching playlist data from YouTube...')
    const { playlist, videos } = await getPlaylistWithVideos(url)
    console.log(`Found playlist: "${playlist.name}" with ${videos.length} videos`)

    // Check if playlist exists
    const playlists = await csvDb.readPlaylists()
    const storedPlaylist = playlists.find((p) => p.id === id)
    if (storedPlaylist) {
      console.log('Playlist already exists in database. Use update option to modify it.')
      return
    }

    // Save playlist and videos
    await csvDb.addPlaylist(playlist)
    await csvDb.addVideos(playlist.id, videos)

    console.log(`✓ Playlist "${playlist.name}" added successfully!`)
  } catch (/** @type {any} */ error) {
    console.error(`Failed to add playlist: ${error.message}`)
  }
}

/**
 * Fills playlist manual data
 * @returns {Promise<void>}
 */
async function fillPlaylist() {
  try {
    const playlists = await csvDb.readPlaylists()
    const storedPlaylist = await prompts.selectPlaylist(playlists)

    console.log(`\nFilling playlist data: "${storedPlaylist.name}"`)

    // Complete/fill manual data
    const filledPlaylist = await prompts.fillPlaylist(storedPlaylist)

    await csvDb.addPlaylist(filledPlaylist)
    console.log(`✓ Playlist "${filledPlaylist.name}" filled successfully!`)
  } catch (/** @type {any} */ error) {
    console.error(`Failed to fill playlist: ${error.message}`)
  }
}

/**
 * Removes a playlist from the database
 * @returns {Promise<void>}
 */
async function removePlaylist() {
  try {
    const playlists = await csvDb.readPlaylists()
    const storedPlaylist = await prompts.selectPlaylist(playlists)

    const shouldRemove = await prompts.confirmAction(
      `Are you sure you want to remove playlist "${storedPlaylist.name}"? This will also remove all associated video data.`,
    )
    if (!shouldRemove) {
      console.log('Playlist not removed.')
      return
    }

    const removed = await csvDb.removePlaylist(storedPlaylist.id)
    if (removed) {
      console.log(`✓ Playlist "${storedPlaylist.name}" removed successfully!`)
    } else {
      console.log('Playlist not found.')
    }
  } catch (/** @type {any} */ error) {
    console.error(`Failed to remove playlist: ${error.message}`)
  }
}

/**
 * @param {string} url
 * @returns {Promise<FetchedPlaylistWithVideos>}
 * @private
 */
async function getPlaylistWithVideos(url) {
  try {
    const rawPlaylist = await fetchPlaylist(url)
    if (!rawPlaylist) {
      throw new Error('Playlist not found or is private')
    }

    // Parse playlist and videos
    const playlist = parsePlaylist(rawPlaylist)
    const videos = rawPlaylist.videos.map(parseVideo)

    return {
      playlist,
      videos,
    }
  } catch (/** @type {any} */ error) {
    throw new Error(`Failed to fetch playlist data: ${error.message}`)
  }
}

module.exports = {
  addPlaylist,
  fillPlaylist,
  removePlaylist,
}
