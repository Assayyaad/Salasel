<div align="center">

# سلاسل

منصة لتنظيم ومشاهدة سلاسل المحتوى الإسلامي من يوتيوب

</div>

---

## المتطلبات

- [Node.js](https://nodejs.org/) v20 أو أحدث
- [npm](https://www.npmjs.com/) (مثبّت مع Node.js)

---

## الإعداد والتشغيل

### 1. استنساخ المستودع

```bash
git clone https://github.com/Assayyaad/Salasel
cd Salasel
```

### 2. تثبيت الاعتماديات

```bash
npm install
```

### 3. توليد ملفات البيانات

بيانات التطبيق مخزّنة في ملفات CSV داخل مجلد `data/`، ويجب تحويلها إلى JSON قبل تشغيل التطبيق:

```bash
npm run build:data
```

هذا الأمر يقرأ الملفات التالية:

- `data/playlists.csv` — بيانات جميع السلاسل
- `data/videos/<PLAYLIST_ID>.csv` — مقاطع كل سلسلة

وينتج:

- `public/playlists.json` — كائن JSON بجميع السلاسل
- `public/videos/<PLAYLIST_ID>.json` — ملف JSON لمقاطع كل سلسلة

> **ملاحظة:** ملفات `public/playlists.json` و `public/videos/` غير مُدرجة في git لأنها مولّدة تلقائياً. يجب تشغيل `npm run build:data` في كل مرة تُعدّل فيها ملفات `data/`.

### 4. تشغيل بيئة التطوير

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

---

## هيكل البيانات

### `data/playlists.csv`

| العمود         | النوع  | الوصف                                                                    |
| -------------- | ------ | ------------------------------------------------------------------------ |
| `id`           | string | معرّف السلسلة من يوتيوب (PLxxx)                                          |
| `name`         | string | اسم السلسلة                                                              |
| `channel`      | string | اسم القناة                                                               |
| `thumbnailId`  | string | معرّف مقطع الصورة المصغرة                                                |
| `description`  | string | وصف مختصر                                                                |
| `participants` | string | الأشخاص المشاركون (مفصولون بفاصلة)                                       |
| `language`     | string | `Arabic` أو `English` أو `Japanese`                                      |
| `type`         | string | `Educational` أو `Awareness` أو `Purification`                           |
| `style`        | string | `Narration` أو `Lecture` أو `Podcast` أو `Story`                         |
| `classes`      | string | `Kids`، `Female`، `Married`، `Parents` (مفصولة بفاصلة، يمكن تركها فارغة) |
| `categories`   | string | `Nature`، `Self`، `Religion` (مفصولة بفاصلة)                             |

### `data/videos/<PLAYLIST_ID>.csv`

| العمود       | النوع  | الوصف                    |
| ------------ | ------ | ------------------------ |
| `id`         | string | معرّف المقطع من يوتيوب   |
| `title`      | string | عنوان المقطع             |
| `uploadedAt` | string | تاريخ النشر (YYYY-MM-DD) |
| `duration`   | string | مدة المقطع (HH:MM:SS)    |

### إضافة سلسلة جديدة يدوياً

1. أضف صفاً جديداً في `data/playlists.csv`
2. أنشئ ملف `data/videos/<PLAYLIST_ID>.csv` بمقاطع السلسلة
3. شغّل `npm run build:data` لتوليد ملفات JSON

### إضافة سلسلة عبر CLI

يتوفر CLI تفاعلي يجلب البيانات تلقائياً من يوتيوب:

```bash
npm run cli
```

---

## الأوامر المتاحة

| الأمر                | الوصف                                  |
| -------------------- | -------------------------------------- |
| `npm run dev`        | تشغيل بيئة التطوير                     |
| `npm run build:data` | تحويل ملفات CSV إلى JSON               |
| `npm run build`      | بناء التطبيق للإنتاج (يشمل build:data) |
| `npm run start`      | تشغيل نسخة الإنتاج                     |
| `npm run cli`        | تشغيل CLI لإدارة البيانات              |
| `npm run lint`       | فحص جودة الكود                         |
| `npm run format`     | تنسيق الكود تلقائياً                   |

---

## ترخيص

هذا المشروع مرخص بموجب [رخصة MIT](LICENSE).
