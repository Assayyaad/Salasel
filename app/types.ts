export interface Video {
  /** معرف المقطع من يوتيوب */
  id: string
  /** معرف سلسلة المقطع من يوتيوب */
  playlistId: string
  /** عنوان المقطع */
  title: string
  /** مدة المقطع بالدقائق */
  duration: string
  /** تاريخ نشر المقطع */
  date: string
}

export interface Playlist {
  /** معرف السلسلة من يوتيوب */
  id: string
  /** القناة التي قدمت مقاطع السلسلة */
  channel: Channels
  /** اسم السلسلة */
  name: string
  /** وصف مختصر لمحتوى السلسلة */
  description: string
  /** الأشخاص الظاهرين في محتوى مقاطع السلسلة */
  participants: string[]
  /** لغة محتوى السلسلة */
  language: Languages
  /** نوع محتوى السلسلة */
  type: ContentTypes
  /** طريقة طرح محتوى السلسلة */
  presentation: PresentationTypes
  /** تصانيف محتوى السلسلة */
  categories: Categories[]
  /** مدة السلسلة الإجمالية بالساعات */
  duration: string
  /** عدد حلقات السلسلة */
  episodesCount: number
  /** تاريخ أول حلقة */
  startDate: string
  /** تاريخ آخر حلقة */
  endDate: string
  /** بيانات مقاطع السلسلة */
  videos: Video[]
}

export type Channels = 'فاهم بودكاست'

export type Languages = 'ar' | 'en'

export type Categories = 'فطرة' | 'دين' | 'نفس'

export enum ContentTypes {
  /** تعليمي: محتوى يهدف لتزويد المتلقي بعلم أو مهارة معينة */
  Educational = 0,
  /** توعوي: محتوى يهدف لزيادة وعي المتلقي حول قضية معينة */
  Awareness = 1,
}

export enum PresentationTypes {
  /** سرد: تحدث الملقي بدون وجود جمهور */
  Narration = 0,
  /** محاضرة: تحدث الملقي أمام جمهور  */
  Lecture = 1,
  /** إذاعة: تحدث الملقي ضمن حوار أو نقاش مع آخرين */
  Podcast = 2,
  /** مناظرة: جدال بين طرفين أو أكثر مختلفين حول قضية معينة */
  Debate = 3,
  /** سؤال وجواب: محتوى متقطع عبر عدة أسئلة */
  QnA = 4,
}
