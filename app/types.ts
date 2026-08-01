/** Video with fetched data */
export interface FetchedVideo {
  /** معرف المقطع من يوتيوب */
  id: string
  /** عنوان المقطع */
  title: string
  /** مدة المقطع بالثواني */
  duration: number
  /** تاريخ نشر المقطع بالثواني */
  uploadedAt: number
}

/** Video with calculated data */
export interface CalculatedVideo extends FetchedVideo {
  /** معرف سلسلة المقطع من يوتيوب */
  playlistId: string
}

/** Playlist with fetched data */
export interface FetchedPlaylist {
  /** معرف السلسلة من يوتيوب */
  id: string
  /** اسم السلسلة */
  name: string
  /** معرف المقطع المستخدم للصورة المصغرة */
  thumbnailId: string
}

/** Playlist with manual data */
export interface FilledPlaylist extends FetchedPlaylist {
  /** وصف مختصر لمحتوى السلسلة */
  description: string
  /** الأشخاص الظاهرين في محتوى مقاطع السلسلة */
  participants: string[]
  /** لغة محتوى السلسلة */
  language: Languages
  /** نوع محتوى السلسلة */
  type: ContentTypes
  /** طريقة طرح محتوى السلسلة */
  style: PresentationStyles
  /** تصانيف محتوى السلسلة */
  categories: Categories[]
  /** فئات المحتوى موجه لها */
  classes: Classes[]
}

/** Playlist with calculated data */
export interface CalculatedPlaylist extends FilledPlaylist {
  /** عدد حلقات السلسلة */
  videoCount: number
  /** مدة السلسلة الإجمالية بالثواني */
  duration: number
  /** تاريخ أول حلقة */
  startDate: number
  /** تاريخ آخر حلقة */
  endDate: number
}

export type StringifiedPlaylist = Record<keyof FilledPlaylist, string>
export type StringifiedVideo = Record<keyof FetchedVideo, string> & {
  duration: StrTime
  uploadedAt: StrDate
}

export type Playlists = Record<string, CalculatedPlaylist>
export type Videos = Record<string, CalculatedVideo>

// ============================================================================
// Language & Internationalization Types
// ============================================================================

/** Language code (ISO 639-1) */
export type LanguageCode = 'ar' | 'en' | 'ja'

/** Language display name in  */
export type LanguageName = 'Arabic' | 'English' | 'Japanese'

/** Text direction */
export type LanguageDirection = 'rtl' | 'ltr'

/** Comma character */
export type LanguageComma = '،' | ',' | '、'

/** Language configuration */
export interface Language {
  /** Language code (ISO 639-1) */
  code: LanguageCode
  /** Display name in native language */
  name: string
  /** Text direction */
  dir: LanguageDirection
  /** Comma character for the language */
  comma: LanguageComma
}

/** Translation keys interface */
export interface Translations {
  __language: Language
  contents: {
    0: string
    1: string
    2: string
  }
  presentations: {
    0: string
    1: string
    2: string
    3: string
  }
  categories: {
    0: string
    1: string
    2: string
  }
  classes: {
    0: string
    1: string
    2: string
    3: string
  }
  searchPlaceholder: string
  loading: string
  filterLanguageLabel: string
  filterContentTypeLabel: string
  filterCategoryLabel: string
  filterPresentationStyleLabel: string
  filterClassLabel: string
  filterAllOption: string
  searchTab: string
  summaryTab: string
  transcriptionTab: string
  notesTab: string
  watchStatusCompleted: string
  watchStatusInProgress: string
  watchStatusNotStarted: string
  notesDeleteConfirmation: string
  notesPlaceholder: string
  notesAddButton: string
  notesEmptyMessage: string
  notesUpdateTimestamp: string
  notesSaveButton: string
  notesCancelButton: string
  personalProgressTitle: string
  nextToWatch: string
  totalNotes: string
  currentVideoProgress: string
  playlistProgress: string
  continueWatching: string
  startWatching: string
  withParticipation: string
  videosLabel: string
  durationLabel: string
  typeLabel: string
  styleLabel: string
  categoriesLabel: string
  classesLabel: string
  startDateLabel: string
  endDateLabel: string
  playlistContents: string
  episodeLabel: string
  goBack: string
  playlistNotFound: string
  videoNotFound: string
  noVideosFound: string
  appTitle: string
  appFullTitle: string
  appDescription: string
}

// ============================================================================
// Content Types
// ============================================================================

export type Languages = LanguageCode

export type CategoryKeys = keyof typeof Categories
export enum Categories {
  /** فطرة:  الاستعداد الفطري الذي فطر الله الناس عليه لمعرفته وتوحيده*/
  Nature = 0,
  /** نفس: الذات الشاملة على الروح والجسد وما تتصل به من صفات وأحوال */
  Self = 1,
  /** دين:  المنهج الإلهي الذي يشرع للناس عقائد وعبادات ومعاملات لتنظيم حياتهم*/
  Religion = 2,
}

export type ContentTypeKeys = keyof typeof ContentTypes
export enum ContentTypes {
  /** تعليمي: محتوى يهدف لتزويد المتلقي بعلم أو مهارة معينة */
  Educational = 0,
  /** توعوي: محتوى يهدف لزيادة وعي المتلقي حول قضية معينة */
  Awareness = 1,
  /** تزكية: محتوى يهدف لتزكية الإنسان وتنقيته */
  Purification = 2,
}

export type PresentationStyleKeys = keyof typeof PresentationStyles
export enum PresentationStyles {
  /** سرد: تحدث الملقي بدون وجود جمهور */
  Narration = 0,
  /** محاضرة: تحدث الملقي أمام جمهور  */
  Lecture = 1,
  /** إذاعة: تحدث الملقي ضمن حوار أو نقاش مع آخرين */
  Podcast = 2,
  /** قصة: محتوى يروى فيه قصة أو حكاية */
  Story = 3,
}

export type ClassKeys = keyof typeof Classes
export enum Classes {
  /** أطفال: محتوى موجه للأطفال، سهل الفهم ولا يحتوي محتوى حساس */
  Kids = 0,
  /** إناث: محتوى مخصص للإناث بغض النظر عن العمر */
  Female = 1,
  /** متزوجين: محتوى عن الزواج والعشرة */
  Married = 2,
  /** آباء: محتوى عن التربية والأسرة */
  Parents = 3,
}

/** "HH:MM:SS" */
export type StrTime = `${string}:${string}:${string}`
/** "YYYY-MM-DD" */
export type StrDate = `${string}-${string}-${string}`
