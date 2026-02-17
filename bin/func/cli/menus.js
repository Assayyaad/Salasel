/** @import { Choice } from '../../types.js' */

const { select } = require('@inquirer/prompts')
const { addPlaylist, fillPlaylist, removePlaylist } = require('./cmd/playlists.js')
const { downloadSingleTranscript, downloadMultipleTranscripts } = require('./cmd/transcripts.js')
const { cleanVideos, sortVideos, fetchVideos } = require('./cmd/videos.js')
const { convertToJson } = require('./cmd/convert-to-json.js')

/**
 * @param {string} message
 * @param {Choice[]} choices
 */
async function handleMenuSelection(message, choices) {
  /** @type {number} */
  const val = await select({ message, choices })
  await choices.find((c) => c.value === val)?.func()
}

/**
 * Main application loop
 * @returns {Promise<void>}
 */
async function mainMenu() {
  await handleMenuSelection('Select an action:', [
    { value: 0, name: 'Playlists', description: 'Manage playlists', func: playlistMenu },
    { value: 1, name: 'Videos', description: 'Manage videos', func: videoMenu },
    { value: 2, name: 'Transcripts', description: 'Manage transcripts', func: transcriptMenu },
    { value: 3, name: 'Convert CSV to JSON', description: 'Convert CSV files to JSON format', func: convertToJson },
  ])
}

/**
 * Handles playlist management menu
 * @returns {Promise<void>}
 */
async function playlistMenu() {
  await handleMenuSelection('Playlist:', [
    { value: 0, name: 'Add', description: 'Add a new playlist', func: addPlaylist },
    { value: 1, name: 'Fill', description: 'Fill a playlist manually', func: fillPlaylist },
    { value: 2, name: 'Remove', description: 'Delete a playlist and its videos', func: removePlaylist },
  ])
}

/**
 * Handles video operations menu
 * @returns {Promise<void>}
 */
async function videoMenu() {
  await handleMenuSelection('Video:', [
    {
      value: 0,
      name: 'Clean',
      description: 'Clean videos: remove orphaned files, duplicates, validate data',
      func: cleanVideos,
    },
    { value: 1, name: 'Sort', description: 'Sort videos by uploadedAt', func: sortVideos },
    { value: 2, name: 'Fetch', description: 'Update default metadata from YouTube', func: fetchVideos },
  ])
}

/**
 * Handles transcript operations menu
 * @returns {Promise<void>}
 */
async function transcriptMenu() {
  await handleMenuSelection('Transcript:', [
    {
      value: 0,
      name: 'Download Single',
      description: 'Downloads a video transcript',
      func: downloadSingleTranscript,
    },
    {
      value: 1,
      name: 'Download Multiple',
      description: 'Downloads a playlist videos transcripts',
      func: downloadMultipleTranscripts,
    },
  ])
}

module.exports = {
  mainMenu,
  playlistMenu,
  videoMenu,
  transcriptMenu,
}
