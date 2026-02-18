const path = require('path')
const fs = require('fs-extra')
const csvDb = require('../../db/csv.js')
const { videosDir } = require('../../../static.js')
const { fetchVideo, parseVideo } = require('../../api/youtube-sr.js')
const { rowToCells, cellsToRow, validateRows } = require('../../util/csv.js')
const { readFileRows, writeFileRows, processAllFiles } = require('../../util/csvFile.js')
const { validateHeaders } = require('../../util/csv.js')
const {
  withFileErrorHandling,
  withCommandErrorHandling,
  logAction,
  logSuccess,
  logError,
  logWarning,
} = require('../../util/cmd.js')

/**
 * Cleans video CSV files by:
 * - Removing files for non-existent playlists
 * - Filling empty dates with defaults
 * - Removing rows with empty id
 * - Removing duplicate rows based on id
 * @returns {Promise<void>}
 */
async function cleanVideos() {
  await withCommandErrorHandling(async () => {
    logAction('Cleaning video files...')

    // Get all valid playlist IDs
    const playlists = await csvDb.readPlaylists()
    const validPlaylistIds = new Set(playlists.map((p) => p.id))
    console.log(`Found ${validPlaylistIds.size} valid playlists`)

    // Get all video CSV files
    const videoFiles = /** @type {string[]} */ (await fs.readdir(videosDir))
    const csvFiles = videoFiles.filter((f) => f.endsWith('.csv'))
    console.log(`Found ${csvFiles.length} video CSV files`)

    /** @type {Promise<void>[]} */
    const cleanPromises = []

    // Check each video file
    for (const file of csvFiles) {
      const playlistId = path.basename(file, '.csv')

      if (!validPlaylistIds.has(playlistId)) {
        const filePath = path.join(videosDir, file)
        await fs.remove(filePath)
        logError(`Deleted: ${file} (playlist not found)`)
      } else {
        // Clean the video file (validate, remove duplicates)
        cleanPromises.push(withFileErrorHandling(cleanVideosFile)(file))
      }
    }

    await Promise.all(cleanPromises)

    console.log('\n=== Cleaning Summary ===')
    console.log(`Total video files: ${csvFiles.length}`)
  }, 'Failed to clean videos')
}

/**
 * @param {string} file
 * @returns {Promise<void>}
 * @private
 */
async function cleanVideosFile(file) {
  const filePath = path.join(videosDir, file)
  const { headers, rows } = await readFileRows(filePath)

  if (headers.length === 0) {
    logWarning(`Skipping empty file: ${file}`)
    return
  }

  // Validate headers
  const valid = validateHeaders(file, headers, ['id'])
  if (!valid) {
    return
  }

  /** @type {Record<string, string>} */
  const checks = {
    id: '',
    title: '',
    uploadedAt: '0000-00-00',
    duration: '00:00:00',
  }

  // Validate rows (fill empty dates, remove rows with empty id)
  const validatedRows = validateRows(headers, rows, checks)

  // Remove duplicate rows based on id
  const idIndex = headers.indexOf('id')
  /** @type {Set<string>} */
  const seenIds = new Set()
  /** @type {string[]} */
  const uniqueRows = [validatedRows[0]] // Keep header

  for (let i = 1; i < validatedRows.length; i++) {
    const cells = rowToCells(validatedRows[i])
    const id = cells[idIndex]

    if (!seenIds.has(id)) {
      seenIds.add(id)
      uniqueRows.push(validatedRows[i])
    }
  }

  // Write updated content
  await writeFileRows(filePath, uniqueRows)
  logSuccess(`Cleaned: ${file}`)
}

/**
 * Sorts video CSV files by uploadedAt (earliest to latest)
 * @returns {Promise<void>}
 */
async function sortVideos() {
  try {
    await processAllFiles(videosDir, withFileErrorHandling(sortVideosFile), 'Sorting video files by uploadedAt')

    logAction('=== Sorting Summary ===')
  } catch (/** @type {any} */ error) {
    console.error(`Failed to sort videos: ${error.message}`)
  }
}

/**
 * @param {Readonly<string>} file
 * @returns {Promise<void>}
 */
async function sortVideosFile(file) {
  const filePath = path.join(videosDir, file)
  const { headers, rows } = await readFileRows(filePath)

  if (headers.length === 0) {
    logWarning(`Skipping empty file: ${file}`)
    return
  }

  // Validate headers
  const valid = validateHeaders(file, headers, ['uploadedAt'])
  if (!valid) {
    return
  }

  const uploadedAtIndex = headers.indexOf('uploadedAt')

  // Sort by uploadedAt (earliest to latest)
  const sortedDataRows = rows.sort((a, b) => {
    const aCells = rowToCells(a)
    const bCells = rowToCells(b)

    const dateAParts = aCells[uploadedAtIndex].split('-').map(Number)
    const dateBParts = bCells[uploadedAtIndex].split('-').map(Number)

    const yearDiff = dateAParts[0] - dateBParts[0]
    if (yearDiff !== 0) return yearDiff

    const monthDiff = dateAParts[1] - dateBParts[1]
    if (monthDiff !== 0) return monthDiff

    const dayDiff = dateAParts[2] - dateBParts[2]
    return dayDiff
  })

  // Build final content with sorted rows
  const sortedRows = [cellsToRow(headers), ...sortedDataRows]

  // Write updated content
  await writeFileRows(filePath, sortedRows)
  logSuccess(`Sorted: ${file}`)
}

/**
 * Updates videos with default uploadedAt or duration by fetching from YouTube
 * @returns {Promise<void>}
 */
async function fetchVideos() {
  try {
    await processAllFiles(videosDir, withFileErrorHandling(fetchVideosFile), 'Updating videos metadata from YouTube')

    logAction('=== Update Summary ===')
  } catch (/** @type {any} */ error) {
    console.error(`Failed to update videos metadata: ${error.message}`)
  }
}

/**
 * @param {string} file
 * @return {Promise<void>}
 */
async function fetchVideosFile(file) {
  const playlistId = path.basename(file, '.csv')
  const videos = await csvDb.readVideos(playlistId)
  let videoUpdated = false

  // Check each video for default values
  for (let i = 0; i < videos.length; i++) {
    const v = videos[i]
    const dateIsDefault = v.uploadedAt === 0
    const durationIsDefault = v.duration === 0

    if (dateIsDefault || durationIsDefault) {
      console.log(`  Fetching: ${v.title.substring(0, 50)}...`)

      // Fetch video data from YouTube
      const fetchedVideo = await fetchVideo(v.id)
      const parsedVideo = parseVideo(fetchedVideo)

      // Update only the fields with default values
      if (dateIsDefault && parsedVideo.uploadedAt !== 0) {
        v.uploadedAt = parsedVideo.uploadedAt
        console.log(`    ✓ Updated uploadedAt`)
      }
      if (durationIsDefault && parsedVideo.duration !== 0) {
        v.duration = parsedVideo.duration
        console.log(`    ✓ Updated duration`)
      }

      videoUpdated = true

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
  }

  // Write updated videos back to CSV if any changes were made
  if (videoUpdated) {
    await csvDb.updateVideos(playlistId, videos)
    logSuccess(`  Saved updates for ${playlistId}\n`)
  }
}

module.exports = {
  cleanVideos,
  sortVideos,
  fetchVideos,
}
