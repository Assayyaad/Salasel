/** @import { Categories, Classes, ContentTypes, FilledPlaylist, FetchedVideo, Languages, PresentationStyles, ContentTypeKeys, PresentationStyleKeys, ClassKeys, CategoryKeys, LanguageNames } from './types.js' */

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

/** @type {Readonly<Record<LanguageNames, Languages>>} */
const languages = Object.freeze({
  Arabic: 'ar',
  English: 'en',
  Japanese: 'ja',
})

/** @type {Readonly<Record<ContentTypeKeys, ContentTypes>>} */
const contents = Object.freeze({
  Educational: 0,
  Awareness: 1,
  Purification: 2,
})

/** @type {Readonly<Record<PresentationStyleKeys, PresentationStyles>>} */
const presentations = Object.freeze({
  Narration: 0,
  Lecture: 1,
  Podcast: 2,
  Story: 3,
})

/** @type {Readonly<Record<ClassKeys, Classes>>} */
const classes = Object.freeze({
  Kids: 0,
  Female: 1,
  Married: 2,
  Parents: 3,
})

/** @type {Readonly<Record<CategoryKeys, Categories>>} */
const categories = Object.freeze({
  Nature: 0,
  Self: 1,
  Religion: 2,
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
