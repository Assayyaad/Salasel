const jsonDb = require('../../db/json.js')
const { withCommandErrorHandling, logSuccess, logAction } = require('../../util/cmd.js')

/**
 * Converts all CSV data to JSON format
 * @returns {Promise<void>}
 */
async function convertToJson() {
  await withCommandErrorHandling(async () => {
    logAction('Converting CSV to JSON...')
    const summary = await jsonDb.convertCsvToJson()

    console.log('\n=== Conversion Summary ===')
    logSuccess(`Playlists converted: ${summary.playlistCount}`)
    logSuccess(`Videos converted: ${summary.videoCount}`)
    console.log('\nJSON files saved to data/json/ directory')
  }, 'Failed to convert data')
}

module.exports = {
  convertToJson,
}
