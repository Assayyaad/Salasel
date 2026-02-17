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
  /** القناة التي قدمت مقاطع السلسلة */
  channel: string
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

export type Languages = 'ar' | 'en'

export type Categories = 'فطرة' | 'دين' | 'نفس'

export enum ContentTypes {
  /** تعليمي: محتوى يهدف لتزويد المتلقي بعلم أو مهارة معينة */
  Educational = 0,
  /** توعوي: محتوى يهدف لزيادة وعي المتلقي حول قضية معينة */
  Awareness = 1,
  /** تزكية: محتوى يهدف لتزكية الإنسان وتنقيته */
  Purification = 2,
}

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
