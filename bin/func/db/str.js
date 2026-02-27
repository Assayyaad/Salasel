/** @import { FilledPlaylist, StringifiedPlaylist, StringifiedVideo, Categories, FetchedVideo } from '../../types.js' */

const { timeToStr, timeToNum, dateToStr, dateToNum } = require('../util/format.js')
const { languages, contents, presentations, categories, classes } = require('../../static.js')

/**
 * Finds the key for a given value in an enum object
 * @template T
 * @param {Record<string, T>} enumObj
 * @param {T} value
 * @returns {string}
 */
function getEnumKey(enumObj, value) {
  const entry = Object.entries(enumObj).find(([_, v]) => v === value)
  return entry ? entry[0] : ''
}

/**
 * Finds the value for a given key in an enum object
 * @template T
 * @param {Record<string, T>} enumObj
 * @param {string} key
 * @returns {T}
 */
function getEnumValue(enumObj, key) {
  return enumObj[key]
}

/**
 * @param {Partial<FilledPlaylist>} playlist
 * @returns {StringifiedPlaylist}
 */
function stringifyPlaylist(playlist) {
  return {
    id: playlist.id || '',
    name: playlist.name || '',
    thumbnailId: playlist.thumbnailId || '',
    description: playlist.description || '',
    participants: (playlist.participants || []).join(';'),
    language: getEnumKey(languages, playlist.language || 'ar'),
    type: getEnumKey(contents, playlist.type || 0),
    style: getEnumKey(presentations, playlist.style || 0),
    categories: (playlist.categories || []).map((c) => getEnumKey(categories, c)).join(';'),
    classes: (playlist.classes || []).map((c) => getEnumKey(classes, c)).join(';'),
  }
}

/**
 * @param {StringifiedPlaylist} str
 * @returns {FilledPlaylist}
 */
function objectifyPlaylist(str) {
  return {
    ...str,
    participants: (str.participants || '')
      .split(';')
      .map((p) => p.trim())
      .filter((p) => p),
    language: getEnumValue(languages, str.language || ''),
    type: getEnumValue(contents, str.type || ''),
    style: getEnumValue(presentations, str.style || ''),
    categories: (str.categories || '')
      .split(';')
      .map((c) => getEnumValue(categories, c.trim()))
      .filter((c) => !isNaN(c)),
    classes: (str.classes || '')
      .split(';')
      .map((c) => getEnumValue(classes, c.trim()))
      .filter((c) => !isNaN(c)),
  }
}

/**
 * @param {FetchedVideo} video
 * @returns {StringifiedVideo}
 */
function stringifyVideo(video) {
  return {
    ...video,
    duration: timeToStr(video.duration),
    uploadedAt: dateToStr(video.uploadedAt),
  }
}

/**
 * @param {StringifiedVideo} str
 * @returns {FetchedVideo}
 */
function objectifyVideo(str) {
  return {
    ...str,
    duration: timeToNum(str.duration),
    uploadedAt: dateToNum(str.uploadedAt),
  }
}

module.exports = {
  stringifyPlaylist,
  objectifyPlaylist,

  stringifyVideo,
  objectifyVideo,
}
