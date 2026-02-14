const path = require('path')
const fs = require('fs-extra')
const { captionsDir } = require('../../static.js')

/**
 * Ensures the captions directory exists for a video
 * @param {string} videoId - The video id
 * @returns {Promise<string>} Path to the captions directory
 */
async function ensureCaptionsDir(videoId) {
  const captionsPath = path.join(captionsDir, videoId)
  await fs.ensureDir(captionsPath)
  return captionsPath
}

/**
 * Checks if a caption file exists for a video
 * @param {string} videoId - The video id
 * @param {string} languageCode - language code (e.g., 'en', 'ar')
 * @param {boolean} isAuto - Whether it's auto-generated captions
 * @returns {Promise<boolean>} True if file exists
 */
async function captionExists(videoId, languageCode, isAuto = false) {
  const suffix = isAuto ? '-auto' : ''
  const fileName = `${languageCode}${suffix}.srt`
  const filePath = path.join(captionsDir, videoId, fileName)
  return await fs.pathExists(filePath)
}

module.exports = {
  ensureCaptionsDir,
  captionExists,
}
