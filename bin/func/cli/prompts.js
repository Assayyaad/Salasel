/** @import { FilledPlaylist, Languages, ContentTypes, PresentationStyles, Classes, Categories, FetchedPlaylist } from '../../types.js' */

const { select, input, confirm, checkbox } = require('@inquirer/prompts')
const {
  languages,
  contents,
  presentations,
  classes: classOptions,
  categories: categoryOptions,
} = require('../../static.js')
const { toVideoUrl, toPlaylistUrl } = require('../util/youtube.js')

/**
 * Asks for confirmation before proceeding with an action
 * @param {string} message - Confirmation message
 * @returns {Promise<boolean>} User confirmation
 */
async function confirmAction(message) {
  return await confirm({ message, default: false })
}

/**
 * Prompts for YouTube playlist URL or ID and returns a complete URL
 * @returns {Promise<string>} Playlist URL
 */
async function getPlaylistUrl() {
  return toPlaylistUrl(
    await input({
      message: 'Enter YouTube playlist URL or ID:',
      validate: (v) => (!v.trim() ? 'Playlist URL or ID cannot be empty' : true),
    }),
  )
}

/**
 * Prompts for YouTube video URL or ID and returns a complete URL
 * @returns {Promise<string>} Video URL
 */
async function getVideoUrl() {
  return toVideoUrl(
    await input({
      message: 'Enter YouTube video URL or ID:',
      validate: (v) => (!v.trim() ? 'Video URL or ID cannot be empty' : true),
    }),
  )
}

/**
 * Prompts for manual playlist data completion
 * @param {FetchedPlaylist} playlist
 * @returns {Promise<FilledPlaylist>} Complete playlist data
 */
async function fillPlaylist(playlist) {
  console.log('\nComplete following for the playlist:')
  console.log(`> Name: ${playlist.name}`)
  console.log(`> Channel: ${playlist.channel}`)

  /** @type {string} */
  const description = await input({
    message: 'Enter playlist description:',
    default: '',
  })

  /** @type {string} */
  const participants = await input({
    message: 'Enter participants names (comma-separated):',
    default: '',
  })

  /** @type {Languages} */
  const language = await select({
    message: 'Select playlist language:',
    choices: Object.entries(languages).map(([name, value]) => ({ name, value })),
  })

  /** @type {ContentTypes} */
  const type = await select({
    message: 'Select content type:',
    choices: Object.entries(contents).map(([name, value]) => ({ name, value })),
  })

  /** @type {PresentationStyles} */
  const style = await select({
    message: 'Select presentation style:',
    choices: Object.entries(presentations).map(([name, value]) => ({ name, value })),
  })

  /** @type {Categories[]} */
  const categories = await checkbox({
    message: 'Select categories (use space to select, enter to confirm):',
    choices: Object.entries(categoryOptions).map(([name, value]) => ({ name, value })),
    required: true,
  })

  /** @type {Classes[]} */
  const classes = await checkbox({
    message: 'Select classes (use space to select, enter to confirm):',
    choices: Object.entries(classOptions).map(([name, value]) => ({ name, value })),
  })

  return {
    ...playlist,
    description,
    participants: participants
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p),
    language,
    type,
    style,
    categories,
    classes,
  }
}

/**
 * Prompts user to select a playlist from a list
 * @param {FilledPlaylist[]} playlists - Array of playlist objects
 * @returns {Promise<FilledPlaylist>} Selected playlist
 */
async function selectPlaylist(playlists) {
  if (playlists.length === 0) {
    throw new Error('No playlists available')
  }

  const id = await select({
    message: 'Select a playlist:',
    choices: playlists.map((p) => ({
      name: `${p.channel} | ${p.name}`,
      value: p.id,
    })),
  })

  const selected = playlists.find((p) => p.id === id)
  if (!selected) {
    throw new Error('Selected playlist not found')
  }
  return selected
}

/**
 * Prompts user to select language(s) for transcript download
 * @returns {Promise<string[]>} Selected language codes or all language codes if 'all' is selected
 */
async function getLanguageForTranscript() {
  const choices = [
    { name: 'All Languages', value: /** @type {any} */ ('__all__') },
    ...Object.entries(languages).map(([name, value]) => ({ name, value })),
  ]

  /** @type {string[]} */
  const langs = await checkbox({
    message: 'Select language(s) to download (use space to select, enter to confirm):',
    choices: choices,
    required: true,
  })

  // If '__all__' is selected, return all language codes
  if (langs.includes('__all__')) {
    return Object.values(languages)
  }

  return langs
}

/**
 * Prompts for first video index and video limit for batch transcript downloads
 * @returns {Promise<{firstIndex: number, limit: number | null}>} Range parameters
 */
async function getTranscriptRange() {
  const firstIndexStr = await input({
    message: 'Enter first video index (default: 0):',
    default: '0',
    validate: (value) => {
      const num = parseInt(value)
      if (isNaN(num) || num < 0) {
        return 'Please enter a valid non-negative number'
      }
      return true
    },
  })

  const limitStr = await input({
    message: 'Enter video limit (leave empty for all videos):',
    default: '',
    validate: (value) => {
      if (value.trim() === '') return true
      const num = parseInt(value)
      if (isNaN(num) || num <= 0) {
        return 'Please enter a valid positive number or leave empty'
      }
      return true
    },
  })

  return {
    firstIndex: parseInt(firstIndexStr),
    limit: limitStr.trim() === '' ? null : parseInt(limitStr),
  }
}

module.exports = {
  getPlaylistUrl,
  getVideoUrl,
  fillPlaylist,
  selectPlaylist,
  confirmAction,
  getLanguageForTranscript,
  getTranscriptRange,
}
