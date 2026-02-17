/** @import { FetchedVideo } from '../../../types.js' */

const { extractVideoId, extractPlaylistId } = require('../../util/youtube.js')
const { downloadTranscript, downloadPlaylistTranscripts } = require('../../util/transcript.js')
const { withCommandErrorHandling, logSuccess, logAction } = require('../../util/cmd.js')
const { ensureCaptionsDir } = require('../../db/captions.js')
const prompts = require('../prompts.js')
const csvDb = require('../../db/csv.js')

/**
 * Downloads transcript for a single video
 * @returns {Promise<void>}
 */
async function downloadSingleTranscript() {
  await withCommandErrorHandling(async () => {
    const url = await prompts.getVideoUrl()
    const videoId = extractVideoId(url)

    // Ask for language selection
    const languages = await prompts.getLanguageForTranscript()

    logAction(`Downloading transcript for video: ${videoId}`)
    console.log(`Languages: ${languages.join(', ')}`)

    const captionsDir = await ensureCaptionsDir(videoId)
    const downloadedFiles = await downloadTranscript(videoId, captionsDir, languages)

    if (downloadedFiles.length > 0) {
      logSuccess(`Downloaded ${downloadedFiles.length} transcript file(s): ${downloadedFiles.join(', ')}`)
    } else {
      console.log('No transcripts found for this video in the selected language(s).')
    }
  }, 'Failed to download transcript')
}

/**
 * Downloads transcripts for all videos in a playlist
 * @returns {Promise<void>}
 */
async function downloadMultipleTranscripts() {
  await withCommandErrorHandling(async () => {
    const url = await prompts.getPlaylistUrl()
    const id = extractPlaylistId(url)

    // Check if playlist exists
    const playlists = await csvDb.readPlaylists()
    const storedPlaylist = playlists.find((p) => p.id === id)

    if (!storedPlaylist) {
      console.log('Playlist not found in database. Please add it first.')
      return
    }

    const videos = await csvDb.readVideos(storedPlaylist.id)

    if (videos.length === 0) {
      console.log('No videos found for this playlist.')
      return
    }

    // Get range parameters
    const { firstIndex, limit } = await prompts.getTranscriptRange()

    // Calculate video range
    const startIndex = Math.max(0, firstIndex)
    const endIndex = limit ? Math.min(startIndex + limit, videos.length) : videos.length
    const videosToProcess = videos.slice(startIndex, endIndex)

    if (videosToProcess.length === 0) {
      console.log('No videos in the specified range.')
      return
    }

    console.log(`\nPlaylist: "${storedPlaylist.name}"`)
    console.log(`Total videos: ${videos.length}`)
    console.log(`Range: ${startIndex} to ${endIndex - 1} (${videosToProcess.length} videos)`)

    const shouldProceed = await prompts.confirmAction(
      `Download transcripts for ${videosToProcess.length} video(s)? This may take a while.`,
    )

    if (!shouldProceed) {
      console.log('Transcript download cancelled.')
      return
    }

    // Ask for language selection
    const languages = await prompts.getLanguageForTranscript()
    console.log(`Languages: ${languages.join(', ')}`)

    await downloadTranscriptsForPlaylist(storedPlaylist.id, videosToProcess, languages)
  }, 'Failed to download playlist transcripts')
}

/**
 * Helper function to download transcripts for a playlist
 * @param {string} playlistId - Playlist ID
 * @param {FetchedVideo[]} videos - Array of video objects
 * @param {string[]} languages - Array of language codes to download
 * @returns {Promise<void>}
 * @private
 */
async function downloadTranscriptsForPlaylist(playlistId, videos, languages) {
  const captionsBaseDir = await ensureCaptionsDir('')
  const summary = await downloadPlaylistTranscripts(playlistId, videos, captionsBaseDir, languages)

  console.log('\n=== Transcript Download Summary ===')
  console.log(`Total videos: ${summary.total}`)
  console.log(`Successfully processed: ${summary.processed}`)
  console.log(`Videos with transcripts: ${summary.downloaded}`)

  if (summary.errors.length > 0) {
    console.log(`Errors: ${summary.errors.length}`)
    summary.errors.forEach((error) => {
      console.log(`  - ${error.videoId}: ${error.error}`)
    })
  }
}

module.exports = {
  downloadSingleTranscript,
  downloadMultipleTranscripts,
}
