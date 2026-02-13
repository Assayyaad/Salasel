const path = require('path')
const fs = require('fs-extra')
const csvDb = require('../../db/csv.js')
const { videosDir } = require('../../../static.js')
const { fetchVideo, parseVideo } = require('../../api/youtube-sr.js')
const { timeToStr } = require('../../util/format.js')

/**
 * Updates all video CSV files by filling empty dates and removing rows with empty id
 * @returns {Promise<void>}
 */
async function updateVideos() {
  try {
    console.log('\nUpdating video files...')

    // Get all video CSV files
    const videoFiles = /** @type {string[]} */ (await fs.readdir(videosDir))
    const csvFiles = videoFiles.filter((f) => f.endsWith('.csv'))
    console.log(`Found ${csvFiles.length} video CSV files`)

    let updatedCount = 0
    let errorCount = 0
    let deletedRowsCount = 0

    for (const file of csvFiles) {
      try {
        const filePath = path.join(videosDir, file)
        const content = await fs.readFile(filePath, 'utf8')
        const lines = content.split('\n').filter((l) => l.trim() !== '')

        if (lines.length === 0) {
          console.log(`⚠ Skipping empty file: ${file}`)
          continue
        }

        // Parse header
        const headers = lines[0].split(',').map((h) => h.trim())

        // Find column indices
        const idIndex = headers.indexOf('id')
        const uploadedAtIndex = headers.indexOf('uploadedAt')
        const durationIndex = headers.indexOf('duration')

        // Process data rows
        const dataRows = []
        let fileDeletedRows = 0

        for (let i = 1; i < lines.length; i++) {
          let values = lines[i].split(',').map((v) => v.trim())

          // Skip rows with empty id
          if (idIndex !== -1 && (!values[idIndex] || values[idIndex] === '')) {
            fileDeletedRows++
            continue
          }

          // Fill empty uploadedAt with '0000-00-00'
          if (uploadedAtIndex !== -1 && (!values[uploadedAtIndex] || values[uploadedAtIndex] === '')) {
            values[uploadedAtIndex] = '0000-00-00'
          }

          // Fill empty duration with '00:00:00'
          if (durationIndex !== -1 && (!values[durationIndex] || values[durationIndex] === '')) {
            values[durationIndex] = '00:00:00'
          }

          dataRows.push(values)
        }

        // Sort by uploadedAt (earliest to latest)
        if (uploadedAtIndex !== -1) {
          dataRows.sort((a, b) => {
            const dateA = a[uploadedAtIndex] || '0000-00-00'
            const dateB = b[uploadedAtIndex] || '0000-00-00'
            return dateA.localeCompare(dateB)
          })
        }

        // Build final content with sorted rows
        const newLines = [headers.join(','), ...dataRows.map((row) => row.join(','))]

        // Write updated content
        await fs.writeFile(filePath, newLines.join('\n'), 'utf8')

        if (fileDeletedRows > 0) {
          console.log(`✓ Updated: ${file} (deleted ${fileDeletedRows} row(s) with empty id)`)
          deletedRowsCount += fileDeletedRows
        } else {
          console.log(`✓ Updated: ${file}`)
        }
        updatedCount++
      } catch (/** @type {any} */ error) {
        console.error(`✗ Failed to update ${file}: ${error.message}`)
        errorCount++
      }
    }

    console.log('\n=== Update Summary ===')
    console.log(`Total video files: ${csvFiles.length}`)
    console.log(`Successfully updated: ${updatedCount}`)
    if (deletedRowsCount > 0) {
      console.log(`Deleted rows with empty id: ${deletedRowsCount}`)
    }
    if (errorCount > 0) {
      console.log(`Errors: ${errorCount}`)
    }
  } catch (/** @type {any} */ error) {
    console.error(`Failed to update videos: ${error.message}`)
  }
}

/**
 * Updates videos with default uploadedAt or duration by fetching from YouTube
 * @returns {Promise<void>}
 */
async function fetchVideos() {
  try {
    console.log('\nUpdating videos metadata from YouTube...')

    // Get all video CSV files
    const videoFiles = /** @type {string[]} */ (await fs.readdir(videosDir))
    console.log(`Found ${videoFiles.length} video CSV files\n`)

    let totalVideos = 0
    let updatedCount = 0
    let errorCount = 0
    let skippedCount = 0

    for (const file of videoFiles) {
      try {
        const playlistId = path.basename(file, '.csv')
        console.log(`Processing playlist: ${playlistId}`)

        // Read videos from CSV
        const videos = await csvDb.readVideos(playlistId)
        totalVideos += videos.length

        let videoUpdated = false

        // Check each video for default values
        for (let i = 0; i < videos.length; i++) {
          const v = videos[i]
          // const dateIsDefault = v.uploadedAt === 0
          // const durationIsDefault = v.duration === 0

          // if (dateIsDefault || durationIsDefault) {
          try {
            console.log(`  Fetching: ${v.title.substring(0, 50)}...`)

            // Fetch video data from YouTube
            const fetchedVideo = await fetchVideo(v.id)
            const parsedVideo = parseVideo(fetchedVideo)

            // Update only the fields with default values
            // if (dateIsDefault && parsedVideo.uploadedAt !== 0) {
            if (parsedVideo.uploadedAt !== 0) {
              v.uploadedAt = parsedVideo.uploadedAt
              console.log(`    ✓ Updated uploadedAt`)
            }
            // if (durationIsDefault && parsedVideo.duration !== 0) {
            if (parsedVideo.duration !== 0) {
              v.duration = parsedVideo.duration
              console.log(`    ✓ Updated duration`)
            }

            videoUpdated = true
            updatedCount++

            // Add a small delay to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 500))
          } catch (/** @type {any} */ error) {
            console.error(`    ✗ Failed to fetch video: ${error.message}`)
            errorCount++
          }
          // } else {
          //   skippedCount++
          // }
        }

        // Write updated videos back to CSV if any changes were made
        if (videoUpdated) {
          await csvDb.addVideos(playlistId, videos)
          console.log(`  ✓ Saved updates for ${playlistId}\n`)
        } else {
          console.log(`  No updates needed for ${playlistId}\n`)
        }
      } catch (/** @type {any} */ error) {
        console.error(`✗ Failed to process ${file}: ${error.message}\n`)
        errorCount++
      }
    }

    console.log('\n=== Update Summary ===')
    console.log(`Total videos: ${totalVideos}`)
    console.log(`Updated: ${updatedCount}`)
    console.log(`Skipped (already have data): ${skippedCount}`)
    if (errorCount > 0) {
      console.log(`Errors: ${errorCount}`)
    }
  } catch (/** @type {any} */ error) {
    console.error(`Failed to update videos metadata: ${error.message}`)
  }
}

/**
 * Cleans video CSV files by removing files for non-existent playlists
 * @returns {Promise<void>}
 */
async function cleanVideos() {
  try {
    console.log('\nCleaning video files...')

    // Get all valid playlist IDs
    const playlists = await csvDb.readPlaylists()
    const validPlaylistIds = new Set(playlists.map((p) => p.id))
    console.log(`Found ${validPlaylistIds.size} valid playlists`)

    // Get all video CSV files
    const videoFiles = /** @type {string[]} */ (await fs.readdir(videosDir))
    const csvFiles = videoFiles.filter((f) => f.endsWith('.csv'))
    console.log(`Found ${csvFiles.length} video CSV files`)

    let deletedCount = 0
    const deletedFiles = []

    // Check each video file
    for (const file of csvFiles) {
      const playlistId = path.basename(file, '.csv')

      if (!validPlaylistIds.has(playlistId)) {
        const filePath = path.join(videosDir, file)
        await fs.remove(filePath)
        deletedFiles.push(file)
        deletedCount++
        console.log(`✗ Deleted: ${file} (playlist not found)`)
      }
    }

    console.log('\n=== Cleaning Summary ===')
    console.log(`Total video files: ${csvFiles.length}`)
    console.log(`Deleted: ${deletedCount}`)
    console.log(`Remaining: ${csvFiles.length - deletedCount}`)

    if (deletedCount === 0) {
      console.log('\n✓ All video files are valid!')
    }
  } catch (/** @type {any} */ error) {
    console.error(`Failed to clean videos: ${error.message}`)
  }
}

module.exports = {
  updateVideos,
  fetchVideos,
  cleanVideos,
}
