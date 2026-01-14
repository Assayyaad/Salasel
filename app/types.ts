
export interface Video {
    "عنوان": string;
    "معرف الفيديو": string;
    "صورة مصغرة": string;
    "رابط": string;
    "مدة": string;
    "تاريخ": string | null;
    "youtubeUrl"?: string;
}

export interface Playlist {
    "الاسم": string;
    "وصف مختصر": string;
    "اللغة": string;
    "معرف قائمة التشغيل": string;
    "الرابط": string;
    "المجال": string;
    "التصانيف": string;
    "المقدمين": string;
    "المدة الإجمالية (بالساعات)": string;
    "عدد الحلقات": number;
    "تاريخ أول حلقة": string;
    "تاريخ آخر حلقة": string;
    "الفيديوهات": Video[];
}

export interface SalaselData {
    courses: Playlist[];
}
