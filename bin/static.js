/** @import { Categories, Classes, ContentTypes, FilledPlaylist, FetchedVideo, Languages, PresentationStyles } from './types.js' */

const path = require('path')

/** @type {Readonly<(keyof FilledPlaylist)[]>} */
const playlistHeader = Object.freeze([
  'id',
  'name',
  'channel',
  'thumbnailId',
  'description',
  'participants',
  'language',
  'type',
  'style',
  'classes',
  'categories',
])

/** @type {Readonly<(keyof FetchedVideo)[]>} */
const videoHeader = Object.freeze(['id', 'title', 'uploadedAt', 'duration'])

/** @typedef {'Arabic' | 'English'} LanguageNames */
/** @type {Readonly<Record<LanguageNames, Languages>>} */
const languages = Object.freeze({
  Arabic: 'ar',
  English: 'en',
})

/** @typedef {'Educational' | 'Awareness'} ContentTypeKeys */
/** @type {Readonly<Record<ContentTypeKeys, ContentTypes>>} */
const contents = Object.freeze({
  Educational: 0,
  Awareness: 1,
  Purification: 2,
})

/** @typedef {'Narration' | 'Lecture' | 'Podcast' | 'Story'} PresentationStyleKeys */
/** @type {Readonly<Record<PresentationStyleKeys, PresentationStyles>>} */
const presentations = Object.freeze({
  Narration: 0,
  Lecture: 1,
  Podcast: 2,
  Story: 3,
})

/** @typedef {'Kids' | 'Female'| 'Married' | 'Parents'} ClassKeys */
/** @type {Readonly<Record<ClassKeys, Classes>>} */
const classes = Object.freeze({
  Kids: 0,
  Female: 1,
  Married: 2,
  Parents: 3,
})

/** @typedef {'Fitrah' | 'Din' | 'Nafs'} CategoryKeys */
/** @type {Readonly<Record<CategoryKeys, Categories>>} */
const categories = Object.freeze({
  Fitrah: 'فطرة',
  Din: 'دين',
  Nafs: 'نفس',
})

// Path helpers
const dataDir = path.join(process.cwd(), 'data')
const csvDir = dataDir
const videosDir = path.join(csvDir, 'videos')
const captionsDir = path.join(csvDir, 'captions')
const playlistsFile = path.join(csvDir, 'playlists.csv')

const jsonDir = path.join(process.cwd(), 'public')
const jsonVideosDir = path.join(jsonDir, 'videos')
const jsonPlaylistsFile = path.join(jsonDir, 'playlists.json')

module.exports = {
  playlistHeader,
  videoHeader,

  languages,
  contents,
  presentations,
  classes,
  categories,

  dataDir,
  csvDir,
  videosDir,
  captionsDir,
  playlistsFile,

  jsonDir,
  jsonVideosDir,
  jsonPlaylistsFile,
}
