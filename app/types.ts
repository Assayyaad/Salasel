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
  /** ترتيب المقطع ضمن السلسلة (يبدأ من 0) */
  position: number
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

// ============================================================================
// Notes (handoff from the Salasel browser extension)
// ============================================================================

/** A single video's note, as delivered by the Salasel browser extension */
export interface NoteRecord {
  /** YouTube video id (the ?v= value) */
  videoId: string
  /** YouTube playlist id (?list=) if taken in a playlist context, else null */
  playlistId: string | null
  /** The note body, plain text (may contain newlines) */
  text: string
  /** Epoch milliseconds of the last edit */
  updatedAt: number
}

/** Full notes snapshot the extension writes to localStorage["salasel-notes-inbox"] */
export interface NotesHandoffPayload {
  /** Constant marker, lets the app ignore unrelated writes */
  source: 'salasel-extension'
  /** Schema version for future migrations */
  version: 1
  /** Epoch ms when the extension wrote this payload */
  exportedAt: number
  /** Map keyed by videoId */
  notes: Record<string, NoteRecord>
}

// ============================================================================
// Feedback (Discord webhook)
// ============================================================================

/** Kind of feedback a user can submit from the app */
export enum FeedbackType {
  /** Suggest a new playlist/series to add to the index */
  PlaylistSuggestion = 'playlist',
  /** Suggest an improvement to the app in general */
  AppSuggestion = 'app',
  /** Report a problem or complaint */
  Complaint = 'complaint',
  /** Anything else */
  General = 'general',
}

/** Max length of a feedback message (shared by client counter + server cap). */
export const FEEDBACK_MESSAGE_MAX_LENGTH = 2000

/** Max length of the optional contact field. */
export const FEEDBACK_CONTACT_MAX_LENGTH = 200

/** All valid feedback type values, for runtime validation */
export const feedbackTypes: readonly FeedbackType[] = Object.freeze([
  FeedbackType.PlaylistSuggestion,
  FeedbackType.AppSuggestion,
  FeedbackType.Complaint,
  FeedbackType.General,
])

/** Payload posted from the feedback widget to the feedback API route */
export interface FeedbackPayload {
  /** Which kind of feedback this is */
  type: FeedbackType
  /** The feedback body, plain text */
  message: string
  /** Optional way to reach the user back (email, handle, etc.) */
  contact?: string
  /** The page the user submitted from, for context */
  pageUrl?: string
  /** UI language the user was using */
  lang?: string
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
  filterAdvancedLabel: string
  filterBookmarksLabel: string
  bookmarkLabel: string
  continueWatchingLabel: string
  viewAllLabel: string
  showLessLabel: string
  hideLabel: string
  showLabel: string
  readMoreLabel: string
  readLessLabel: string
  playlistsCountLabel: string
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
  completedLabel: string
  downloadNoteLabel: string
  downloadPlaylistNotesLabel: string
  noNotesLabel: string
  watchOnYoutubeLabel: string
  moveNotesSideLabel: string
  languagePickerTitle: string
  languagePickerDescription: string
  notesLabel: string
  notesPlaceholder: string
  noteSavedLabel: string
  noteSavingLabel: string
  videoUnavailableLabel: string
  feedback: {
    buttonLabel: string
    title: string
    typeLabel: string
    typePlaylist: string
    typeApp: string
    typeComplaint: string
    typeGeneral: string
    messageLabel: string
    messagePlaceholder: string
    contactLabel: string
    contactPlaceholder: string
    submitLabel: string
    submittingLabel: string
    successMessage: string
    errorMessage: string
    rateLimitMessage: string
    closeLabel: string
  }
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
