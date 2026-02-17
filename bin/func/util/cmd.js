const successSymbol = '✓'
const errorSymbol = '✗'
const warningSymbol = '⚠'
/**
 * Wraps a file processing function with error handling and logging
 * @param {(file: string) => Promise<void>} func - Function to process a file
 * @returns {(file: string) => Promise<void>}
 */
function withFileErrorHandling(func) {
  return async (file) => {
    try {
      await func(file)
      console.log(`${successSymbol} Processed: ${file}`)
    } catch (/** @type {any} */ error) {
      console.error(`${errorSymbol} Failed to process ${file}: ${error.message}`)
    }
  }
}

/**
 * Wraps a command function with error handling and logging
 * @param {() => Promise<void>} func - The command function to wrap
 * @param {string} errorPrefix - Error message prefix (e.g., "Failed to add playlist")
 * @returns {Promise<void>}
 */
async function withCommandErrorHandling(func, errorPrefix) {
  try {
    await func()
  } catch (/** @type {any} */ error) {
    console.error(`${errorPrefix}: ${error.message}`)
  }
}

/**
 * Logs a success message with a checkmark
 * @param {string} message - Success message to log
 */
function logSuccess(message) {
  console.log(`${successSymbol} ${message}`)
}

/**
 * Logs an action message (informational)
 * @param {string} message - Action message to log
 */
function logAction(message) {
  console.log(`\n${message}`)
}

/**
 * Logs a warning message
 * @param {string} message - Warning message to log
 */
function logWarning(message) {
  console.log(`${warningSymbol} ${message}`)
}

/**
 * Logs an error message with an X mark
 * @param {string} message - Error message to log
 */
function logError(message) {
  console.error(`${errorSymbol} ${message}`)
}

module.exports = {
  withFileErrorHandling,
  withCommandErrorHandling,

  logAction,
  logSuccess,
  logWarning,
  logError,
}
