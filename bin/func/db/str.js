/** @import { FilledPlaylist, StringifiedPlaylist, StringifiedVideo, StringifiedProgram, Categories, FetchedVideo, Program } from '../../types.js' */

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
    programId: playlist.programId || '',
  }
}

/**
 * @param {StringifiedPlaylist} str
 * @returns {FilledPlaylist}
 */
function objectifyPlaylist(str) {
  /** @type {FilledPlaylist} */
  const playlist = {
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

  if (str.programId) {
    playlist.programId = str.programId
  }

  return playlist
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

/**
 * @param {Partial<Program>} program
 * @returns {StringifiedProgram}
 */
function stringifyProgram(program) {
  return {
    id: program.id || '',
    name: program.name || '',
    thumbnailId: program.thumbnailId || '',
    description: program.description || '',
    participants: (program.participants || []).join(';'),
    language: getEnumKey(languages, program.language || 'ar'),
    type: getEnumKey(contents, program.type || 0),
    style: getEnumKey(presentations, program.style || 0),
    categories: (program.categories || []).map((c) => getEnumKey(categories, c)).join(';'),
    classes: (program.classes || []).map((c) => getEnumKey(classes, c)).join(';'),
    playlistsOrder: (program.playlistsOrder || []).join(';'),
  }
}

/**
 * @param {StringifiedProgram} str
 * @returns {Program}
 */
function objectifyProgram(str) {
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
    playlistsOrder: (str.playlistsOrder || '')
      .split(';')
      .map((p) => p.trim())
      .filter((p) => p),
  }
}

module.exports = {
  stringifyPlaylist,
  objectifyPlaylist,

  stringifyProgram,
  objectifyProgram,

  stringifyVideo,
  objectifyVideo,
}
