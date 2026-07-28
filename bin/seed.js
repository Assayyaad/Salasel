// Seeds playlists then videos into Supabase.
// Uses the service-role client — bypasses RLS.
// Run with: node bin/seed.js
// Requires .env to be loaded — uses dotenv if available.

require('dotenv').config()

const path = require('path')
const fs = require('fs-extra')
const { supabaseAdmin } = require('./supabase-admin.js')
const { readFileRecords } = require('./func/util/csvFile.js')
const { videosDir } = require('./static.js')

const PLAYLISTS_JSON = path.join(__dirname, '../public/playlists.json')
const BATCH_SIZE = 200

/**
 * Converts HH:MM:SS to total seconds.
 * @param {string} time
 * @returns {number}
 */
function timeToNum(time) {
  if (!time || time === '00:00:00') return 0
  return time
    .split(':')
    .map(Number)
    .reduce((acc, n) => acc * 60 + n, 0)
}

/**
 * Converts YYYY-MM-DD to unix epoch (seconds).
 * @param {string} date
 * @returns {number}
 */
function dateToNum(date) {
  if (!date || date === '0000-00-00') return 0
  const [y, m, d] = date.split('-').map(Number)
  return Math.floor(Date.UTC(y, m - 1, d) / 1000)
}

/**
 * Inserts rows in batches, upserts on conflict so re-runs are safe.
 * @param {string} table
 * @param {Record<string, any>[]} rows
 */
async function batchUpsert(table, rows) {
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const { error } = await supabaseAdmin.from(table).upsert(batch, { onConflict: 'id' })
    if (error) throw new Error(`[${table}] batch ${i / BATCH_SIZE + 1}: ${error.message}`)
  }
}

async function seedPlaylists() {
  console.log('--- Seeding playlists ---')
  const raw = JSON.parse(await fs.readFile(PLAYLISTS_JSON, 'utf8'))

  // public/playlists.json is Record<id, CalculatedPlaylist>
  // Map camelCase fields to snake_case columns
  const rows = Object.values(raw).map((pl) => ({
    id: pl.id,
    name: pl.name,
    thumbnail_id: pl.thumbnailId,
    description: pl.description,
    participants: pl.participants, // text[]
    language: pl.language,
    type: pl.type, // smallint
    style: pl.style, // smallint
    categories: pl.categories, // smallint[]
    classes: pl.classes, // smallint[]
    video_count: pl.videoCount,
    duration: pl.duration,
    start_date: pl.startDate,
    end_date: pl.endDate,
  }))

  await batchUpsert('playlists', rows)
  console.log(`  ✓ ${rows.length} playlists seeded\n`)
}

async function seedVideos() {
  console.log('--- Seeding videos ---')
  const files = (await fs.readdir(videosDir)).filter((f) => f.endsWith('.csv'))
  console.log(`  Found ${files.length} CSV files\n`)

  let totalVideos = 0
  const failedFiles = []

  for (const file of files) {
    const playlistId = path.basename(file, '.csv')
    const filePath = path.join(videosDir, file)

    try {
      let position = 0
      const parsed = await readFileRecords(filePath, (row) => ({
        id: row.id,
        playlist_id: playlistId,
        title: row.title,
        duration: timeToNum(row.duration),
        uploaded_at: dateToNum(row.uploadedAt),
        position: position++,
      }))

      if (parsed.length === 0) {
        console.warn(`  ⚠ ${playlistId} — empty, skipping`)
        continue
      }

      await batchUpsert('videos', parsed)
      console.log(`  ✓ ${playlistId} — ${parsed.length} videos`)
      totalVideos += parsed.length
    } catch (err) {
      console.error(`  ✗ ${playlistId} — ${err.message}`)
      failedFiles.push(playlistId)
    }
  }

  console.log(`\n  Total videos seeded: ${totalVideos}`)

  if (failedFiles.length > 0) {
    console.error(`  Failed (${failedFiles.length}): ${failedFiles.join(', ')}`)
    return false
  }

  return true
}

async function seed() {
  await seedPlaylists()
  const ok = await seedVideos()

  console.log('\n=== Seed complete ===')
  if (!ok) process.exit(1)
}

seed().catch((err) => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
