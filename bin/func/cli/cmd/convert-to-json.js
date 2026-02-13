const jsonDb = require('../../db/json.js')

/**
 * Converts all CSV data to JSON format
 * @returns {Promise<void>}
 */
async function convertToJson() {
  try {
    console.log('\nConverting CSV to JSON...')
    const summary = await jsonDb.convertCsvToJson()

    console.log('\n=== Conversion Summary ===')
    console.log(`✓ Playlists converted: ${summary.playlistCount}`)
    console.log(`✓ Videos converted: ${summary.videoCount}`)
    console.log('\nJSON files saved to data/json/ directory')
  } catch (/** @type {any} */ error) {
    console.error(`Failed to convert data: ${error.message}`)
  }
}

module.exports = {
  convertToJson,
}
