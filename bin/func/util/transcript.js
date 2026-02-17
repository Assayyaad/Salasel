/** @import { FetchedVideo } from '../../types.js' */

const fs = require('fs-extra')
const path = require('path')
const { fetchAndDownloadCaptions } = require('../api/subtitle-to.js')

/**
 * Ensures video captions directory exists
 * @param {string} captionsBaseDir - Base captions directory
 * @param {string} videoId - Video ID
 * @returns {Promise<string>} Video captions directory path
 */
async function ensureVideoCaptionsDir(captionsBaseDir, videoId) {
  const videoCaptionsDir = path.join(captionsBaseDir, videoId)
  await fs.ensureDir(videoCaptionsDir)
  return videoCaptionsDir
}

/**
 * Creates an empty download summary object
 * @param {number} totalVideos - Total number of videos
 * @returns {{total: number, processed: number, downloaded: number, errors: Array<{videoId: string, error: string}>}} Summary object
 */
function createDownloadSummary(totalVideos) {
  return {
    total: totalVideos,
    processed: 0,
    downloaded: 0,
    errors: [],
  }
}

/**
 * Updates summary after successful download
 * @param {{total: number, processed: number, downloaded: number, errors: Array<{videoId: string, error: string}>}} summary - Summary object
 * @param {boolean} hasDownloads - Whether any files were downloaded
 * @returns {void}
 */
function updateSummarySuccess(summary, hasDownloads) {
  if (hasDownloads) {
    summary.downloaded++
  }
  summary.processed++
}

/**
 * Updates summary after failed download
 * @param {{total: number, processed: number, downloaded: number, errors: Array<{videoId: string, error: string}>}} summary - Summary object
 * @param {string} videoId - Video ID
 * @param {string} errorMessage - Error message
 * @returns {void}
 */
function updateSummaryError(summary, videoId, errorMessage) {
  summary.errors.push({
    videoId,
    error: errorMessage,
  })
}

/**
 * Logs download progress
 * @param {number} processed - Number of processed videos
 * @param {number} total - Total number of videos
 * @returns {void}
 */
function logProgress(processed, total) {
  console.log(`Progress: ${processed}/${total} videos processed`)
}

/**
 * Downloads transcript for a single video
 * @param {string} videoId - YouTube video ID
 * @param {string} captionsDir - Directory to save captions
 * @param {string[]} [languages=[]] - Array of language codes to download (empty array means all)
 * @param {number} [cooldownMs] - Cooldown between downloads in milliseconds
 * @returns {Promise<string[]>} Array of downloaded caption files
 */
async function downloadTranscript(videoId, captionsDir, languages = [], cooldownMs) {
  try {
    return await fetchAndDownloadCaptions(videoId, captionsDir, languages, cooldownMs)
  } catch (/** @type {any} */ error) {
    throw new Error(`Failed to download transcript for ${videoId}: ${error.message}`)
  }
}

/**
 * Processes a single video transcript download
 * @param {FetchedVideo} video - Video object
 * @param {string} captionsBaseDir - Base captions directory
 * @param {string[]} languages - Array of language codes to download
 * @param {number} cooldownMs - Cooldown between downloads
 * @param {{total: number, processed: number, downloaded: number, errors: Array<{videoId: string, error: string}>}} summary - Summary object
 * @returns {Promise<void>}
 */
async function processVideoTranscript(video, captionsBaseDir, languages, cooldownMs, summary) {
  try {
    const videoCaptionsDir = await ensureVideoCaptionsDir(captionsBaseDir, video.id)
    const downloadedFiles = await downloadTranscript(video.id, videoCaptionsDir, languages, cooldownMs)

    updateSummarySuccess(summary, downloadedFiles.length > 0)
    logProgress(summary.processed, summary.total)
  } catch (/** @type {any} */ error) {
    updateSummaryError(summary, video.id, error.message)
    console.error(`Error processing video ${video.id}: ${error.message}`)
  }
}

/**
 * Downloads all available transcripts for videos in a playlist
 * @param {string} playlistId - Playlist ID
 * @param {FetchedVideo[]} videos - Array of video objects
 * @param {string} captionsBaseDir - Base captions directory
 * @param {string[]} [languages=[]] - Array of language codes to download (empty array means all)
 * @param {number} [cooldownMs=2000] - Cooldown between downloads in milliseconds
 * @returns {Promise<{total: number, processed: number, downloaded: number, errors: Array<{videoId: string, error: string}>}>} Summary of downloaded captions
 */
async function downloadPlaylistTranscripts(playlistId, videos, captionsBaseDir, languages = [], cooldownMs = 2000) {
  const summary = createDownloadSummary(videos.length)

  console.log(`Starting transcript download for playlist: ${playlistId} (${videos.length} videos)`)

  for (const video of videos) {
    await processVideoTranscript(video, captionsBaseDir, languages, cooldownMs, summary)
  }

  return summary
}

module.exports = {
  downloadTranscript,
  downloadPlaylistTranscripts,
}
