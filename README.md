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

3. **إعداد متغيرات البيئة:**

أنشئ ملف `.env` في جذر المشروع بالمحتوى التالي:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # للسيدر فقط، لا يُستخدم في التطبيق
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

## قاعدة بيانات Supabase (التطوير المحلي والإنتاج)

يستخدم التطبيق Supabase مصدرًا للبيانات. يمكن تشغيل نسخة محلية كاملة عبر Docker للتطوير دون المساس بقاعدة البيانات الإنتاجية.

### 1. المتطلبات

- Node.js 20 أو أحدث
- Docker مثبت وقيد التشغيل

### 2. متغيرات البيئة

أنشئ ملف `.env` في جذر المشروع (غير مُلتزَم في git) بالمتغيرات التالية:

```bash
# القاعدة المستخدمة: "development" (محلية) أو "production" (سحابية)
APP_ENV=development

# Supabase المحلية (Docker) — مفاتيح محلية افتراضية معروفة، ليست أسرارًا.
# احصل على القيم الفعلية بتشغيل: npx supabase status -o env
DEV_SUPABASE_URL=http://127.0.0.1:54321
DEV_SUPABASE_ANON_KEY=<publishable-key-from-supabase-status>
DEV_SUPABASE_SERVICE_ROLE_KEY=<secret-key-from-supabase-status>

# Supabase الإنتاجية (سحابية) — سرّية، اطلبها من مالك المشروع أو المساهمين
PROD_SUPABASE_URL=
PROD_SUPABASE_ANON_KEY=
PROD_SUPABASE_SERVICE_ROLE_KEY=
```

- المفتاح `APP_ENV` يحدد القاعدة المستخدمة، ويتحكم في `dev` و`build` و`start` معًا:
  - `APP_ENV=development` → القاعدة المحلية عبر Docker (قيم `DEV_*`)
  - `APP_ENV=production` → القاعدة السحابية (قيم `PROD_*`)
- قيم `DEV_*` هي مفاتيح Supabase المحلية الافتراضية المعروفة، وليست أسرارًا — اتركها كما هي.
- قيم `PROD_*` سرّية ولا تُلتزم في git. للحصول عليها تواصل مع مالك المشروع أو المساهمين فيه.
- عند الإقلاع يطبع التطبيق سطرًا يوضح القاعدة المستخدمة، مثل:
  `[supabase] DEVELOPMENT (local) → http://127.0.0.1:54321`

### 3. تشغيل القاعدة المحلية

```bash
npm run db:start    # تشغيل حزمة Supabase المحلية (Docker)
npm run db:reset    # تطبيق ملفات الترحيل في supabase/migrations من جديد
npm run build:data  # توليد public/*.json من data/*.csv
npm run seed:local  # تعبئة القاعدة المحلية بالبيانات
npm run dev         # تشغيل التطبيق (يقرأ APP_ENV من .env)
npm run db:stop     # إيقاف الحزمة المحلية عند الانتهاء
```

- الحزمة مُبسّطة عمدًا: Postgres وREST (PostgREST) وStudio فقط. خدمات Auth وStorage وRealtime وEdge Functions والتحليلات معطّلة في `supabase/config.toml` لأن التطبيق يقرأ المحتوى فقط.
- متصفح قاعدة البيانات (Studio): http://127.0.0.1:54323

### 4. تعديل المخطط (Schema) عبر ملفات الترحيل

مصدر الحقيقة للمخطط هو مجلد `supabase/migrations/`. **لا تعدّل المخطط من لوحة التحكم مباشرة.** أي تغيير يكون ملف ترحيل جديدًا يُراجَع ويُلتزم في git.

```bash
# 1) أنشئ ملف ترحيل جديدًا فارغًا
npx supabase migration new add_something

# 2) اكتب جمل SQL داخل الملف الجديد في supabase/migrations/

# 3) طبّقه محليًا وتأكد من صحته (يعيد بناء القاعدة المحلية من الصفر)
npm run db:reset
npm run seed:local
```

### 5. الدفع إلى الإنتاج (Push)

بعد التحقق محليًا، اربط المشروع السحابي وادفع الترحيلات:

```bash
# مرة واحدة: المصادقة والربط
export SUPABASE_ACCESS_TOKEN=sbp_...        # من https://supabase.com/dashboard/account/tokens
npx supabase link --project-ref <project-ref>

# دفع الترحيلات الجديدة إلى الإنتاج
npx supabase db push
```

- إذا كانت القاعدة السحابية أُنشئت يدويًا (بدون سجل ترحيلات)، علّم الترحيل الأساسي كمطبَّق قبل الدفع:
  `npx supabase migration repair --status applied <migration-timestamp>`
- لتعبئة بيانات الإنتاج من ملفات CSV: اضبط `APP_ENV=production` ثم `npm run seed` (يستخدم مفتاح service_role).
- التطبيق مُصدَّر بشكل ساكن (static export)، لذا تُقرأ البيانات وقت البناء — أعد البناء والنشر لتظهر التغييرات.

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
