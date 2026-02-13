/** @import { StrDate, StrTime } from '../../types.js' */

/**
 * @param {number} seconds
 * @returns {StrTime}
 */
function timeToStr(seconds) {
  if (seconds === 0) {
    return '00:00:00'
  }

  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`

  /**
   * @param {number} num
   * @returns {string}
   */
  function pad(num) {
    return String(num).padStart(2, '0')
  }
}

/**
 * @param {StrTime} duration
 * @returns {number}
 */
function timeToNum(duration) {
  if (!duration || duration === '00:00:00') {
    return 0
  }

  const parts = duration.split(':').map(Number)
  let seconds = 0

  for (let i = 0; i < parts.length; i++) {
    seconds = seconds * 60 + parts[i]
  }

  return seconds
}
/**
 * @param {number} seconds
 * @returns {StrDate}
 */
function dateToStr(seconds) {
  if (seconds === 0) {
    return '0000-00-00'
  }

  const date = new Date(seconds * 1000)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * @param {StrDate} duration
 * @returns {number}
 */
function dateToNum(duration) {
  if (!duration || duration === '0000-00-00') {
    return 0
  }

  const parts = duration.split('-').map(Number)
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]))
  return Math.floor(date.getTime() / 1000)
}

module.exports = {
  timeToStr,
  timeToNum,
  dateToStr,
  dateToNum,
}
