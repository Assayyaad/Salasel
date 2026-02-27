[![Netlify Status](https://api.netlify.com/api/v1/badges/18013d67-afeb-45d5-b529-177a8f1d3302/deploy-status)](https://app.netlify.com/projects/salaselapp/deploys)

---

# دليل التثبيت والتشغيل

## المتطلبات الأساسية

- Node.js (الإصدار 20 أو أحدث)
- npm أو yarn

## التثبيت

1. **استنساخ المشروع:**

```bash
git clone https://github.com/Assayyaad/Salasel.git
cd Salasel
```

2. **تثبيت الحزم:**

```bash
npm install
```

## التشغيل

### وضع التطوير

لتشغيل المشروع في وضع التطوير:

```bash
npm run dev
```

سيشغل التطبيق على [http://localhost:3000](http://localhost:3000)

### بناء المشروع

لبناء المشروع للإنتاج:

```bash
npm run build
```

هذا الأمر سيقوم بـ:

- تحويل البيانات من CSV إلى JSON
- بناء تطبيق Next.js

### تشغيل الإنتاج

بعد البناء، يمكنك تشغيل التطبيق بوضع الإنتاج:

```bash
npm run start
```

## واجهة سطر الأوامر (CLI)

```bash
npm run cli
```

توفر واجهة سطر الأوامر قوائم تفاعلية لإدارة المشروع:

### قوائم السلاسل (Playlists)

- **Add**: إضافة قائمة تشغيل جديدة
- **Fill**: ملء قائمة تشغيل يدوياً
- **Remove**: حذف قائمة تشغيل وجميع فيديوهاتها

### قوائم الفيديوهات (Videos)

- **Clean**: تنظيف الفيديوهات (إزالة الملفات اليتيمة والمكررات، التحقق من البيانات)
- **Sort**: ترتيب الفيديوهات حسب تاريخ النشر
- **Fetch**: تحديث البيانات الوصفية من YouTube

### قوائم النصوص (Transcripts)

- **Download Single**: تحميل نص فيديو واحد
- **Download Multiple**: تحميل نصوص فيديوهات قائمة تشغيل كاملة

### تحويل البيانات (Convert CSV to JSON)

- تحويل ملفات CSV إلى JSON لاستخدامها في التطبيق
