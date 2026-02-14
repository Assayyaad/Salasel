/** @import { Languages } from '../../types.js' */

const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs-extra')
const path = require('path')

// Constants
const COOLDOWN_MS = 2000 // 2 second cooldown between downloads

/**
 * Builds subtitle.to URL for a given video ID
 * @param {string} id - YouTube video ID
 * @returns {string} Subtitle.to URL
 */
function buildSubtitleUrl(id) {
  const videoUrl = `https://www.youtube.com/watch?v=${id}`
  return `https://subtitle.to/${videoUrl}`
}

/**
 * Fetches HTML page from subtitle.to
 * @param {string} url - Subtitle.to URL
 * @returns {Promise<string>} HTML content
 */
async function fetchSubtitlePage(url) {
  return (await axios.get(url)).data
}

/**
 * Parses download buttons from subtitle.to HTML
 * @param {cheerio.CheerioAPI} $ - Cheerio instance
 * @returns {cheerio.Cheerio<any>} Download buttons
 */
function parseDownloadButtons($) {
  return $('.download-button, .downloadbutton')
}

/**
 * Extracts caption information from data-title attribute
 * @param {string} dataTitle - data-title attribute value
 * @returns {{ lang: Languages, isAuto: boolean } | null} Caption info or null if invalid
 */
function extractCaptionInfo(dataTitle) {
  if (!dataTitle || !dataTitle.includes('srt')) {
    return null
  }

  const langMatch = dataTitle.match(/(\w{2})(?:-auto)?\.srt/)
  if (!langMatch) {
    return null
  }

  return {
    lang: /** @type {Languages} */ (langMatch[1]),
    isAuto: dataTitle.includes('-auto'),
  }
}

/**
 * Builds caption filename from language code and auto flag
 * @param {Languages} lang - Language code (e.g., 'en', 'ar')
 * @param {boolean} isAuto - Whether it's auto-generated
 * @returns {string} Caption filename
 */
function buildCaptionFilename(lang, isAuto) {
  const suffix = isAuto ? '-auto' : ''
  return `${lang}${suffix}.srt`
}

/**
 * Normalizes download URL to absolute URL
 * @param {string} href - href attribute value
 * @returns {string} Absolute download URL
 */
function normalizeDownloadUrl(href) {
  return href.startsWith('http') ? href : `https://subtitle.to${href}`
}

/**
 * Downloads SRT file from URL
 * @param {string} url - Download URL
 * @returns {Promise<string>} SRT file content
 */
async function downloadSrtContent(url) {
  return (await axios.get(url)).data
}

/**
 * Downloads a single SRT file
 * @param {string} url - Download URL
 * @param {string} filePath - File path to save
 * @param {string} fileName - Filename for logging
 * @returns {Promise<void>}
 */
async function downloadSrtFile(url, filePath, fileName) {
  const normalizedUrl = normalizeDownloadUrl(url)
  const content = await downloadSrtContent(normalizedUrl)
  await fs.writeFile(filePath, content)
  console.log(`Downloaded caption: ${fileName}`)
}

/**
 * Applies cooldown delay
 * @param {number} cooldownMs - Cooldown duration in milliseconds
 * @returns {Promise<void>}
 */
async function applyCooldown(cooldownMs) {
  await new Promise((resolve) => setTimeout(resolve, cooldownMs))
}

/**
 * Processes a single caption download button
 * @param {cheerio.Cheerio<any>} $button - Cheerio button element
 * @param {string} captionsDir - Captions directory
 * @param {number} cooldownMs - Cooldown between downloads
 * @param {string[]} languages - Array of language codes to download (empty array means all)
 * @returns {Promise<string | null>} Downloaded filename or null if skipped/failed
 */
async function processCaptionButton($button, captionsDir, cooldownMs, languages) {
  const dataTitle = $button.attr('data-title')
  const href = $button.attr('href')

  if (!dataTitle || !href) {
    return null
  }

  const captionInfo = extractCaptionInfo(dataTitle)
  if (!captionInfo) {
    return null
  }

  const { lang, isAuto } = captionInfo

  // Filter by language if specified
  if (languages.length > 0 && !languages.includes(lang)) {
    return null
  }

  const fileName = buildCaptionFilename(lang, isAuto)
  const filePath = path.join(captionsDir, fileName)

  // Check if file already exists
  if (await fs.pathExists(filePath)) {
    console.log(`Caption file already exists: ${fileName}`)
    return fileName
  }

  try {
    await downloadSrtFile(href, filePath, fileName)
    await applyCooldown(cooldownMs)
    return fileName
  } catch (/** @type {any} */ error) {
    console.error(`Failed to download ${fileName}: ${error.message}`)
    return null
  }
}

/**
 * Processes all caption buttons on a page
 * @param {cheerio.CheerioAPI} $ - Cheerio instance
 * @param {string} captionsDir - Captions directory
 * @param {number} cooldownMs - Cooldown between downloads
 * @param {string[]} languages - Array of language codes to download (empty array means all)
 * @returns {Promise<string[]>} Array of downloaded filenames
 */
async function processAllCaptionButtons($, captionsDir, cooldownMs, languages) {
  const downloadButtons = parseDownloadButtons($)
  const downloadedFiles = []

  for (const button of downloadButtons) {
    const $button = $(button)
    const fileName = await processCaptionButton($button, captionsDir, cooldownMs, languages)

    if (fileName) {
      downloadedFiles.push(fileName)
    }
  }

  return downloadedFiles
}

/**
 * Fetches and downloads all available captions for a video from subtitle.to
 * @param {string} videoId - YouTube video ID
 * @param {string} captionsDir - Directory to save captions
 * @param {string[]} [languages=[]] - Array of language codes to download (empty array means all)
 * @param {number} [cooldownMs=COOLDOWN_MS] - Cooldown between downloads in milliseconds
 * @returns {Promise<string[]>} Array of downloaded caption files
 */
async function fetchAndDownloadCaptions(videoId, captionsDir, languages = [], cooldownMs = COOLDOWN_MS) {
  const subtitleUrl = buildSubtitleUrl(videoId)

  console.log(`Fetching transcript options for video: ${videoId}`)
  const html = await fetchSubtitlePage(subtitleUrl)
  const $ = cheerio.load(html)
  const downloadedFiles = await processAllCaptionButtons($, captionsDir, cooldownMs, languages)

  if (downloadedFiles.length === 0) {
    const languageFilter = languages.length > 0 ? ` in language(s): ${languages.join(', ')}` : ''
    console.log(`No captions found for video: ${videoId}${languageFilter}`)
  }

  return downloadedFiles
}

module.exports = {
  fetchAndDownloadCaptions,
}
