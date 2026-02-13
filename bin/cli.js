#!/usr/bin/env node

const fs = require('fs-extra')
const { mainMenu } = require('./func/cli/menus.js')
const { csvDir, videosDir, captionsDir, playlistsFile } = require('./static')

/**
 * Main entry point for the application
 * @returns {Promise<void>}
 */
async function main() {
  try {
    await Promise.all([
      fs.ensureDir(csvDir),
      fs.ensureDir(videosDir),
      fs.ensureDir(captionsDir),
      fs.ensureFile(playlistsFile),
    ])

    await mainMenu()
  } catch (/** @type {any} */ error) {
    console.error('Application error:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nApplication terminated by user.')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n\nApplication terminated.')
  process.exit(0)
})

// Run the main application when executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error.message)
    process.exit(1)
  })
}
