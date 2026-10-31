# مكتبة زاد المسلم (Next.js)

Next.js 14 (App Router) + TypeScript + Tailwind، بهوية قُدراتي (أخضر سعودي / رملي / ذهبي، IBM Plex Sans Arabic، RTL).

## التشغيل محليًا
1. `npm install`
2. ولّد الفهرس: الصق `scripts/catalog-builder.gs` في script.google.com، شغّل الدالة `build`، ثم نزّل `catalog.json` من Drive.
3. ضع الملف في `public/catalog.json` (أو ارفعه من زر الرفع داخل التطبيق).
4. `npm run dev` ثم افتح http://localhost:3000

## البناء والنشر
- `npm run typecheck` ثم `npm run build` ثم `npm start`
- على Vercel: استورد المشروع كما هو. لا متغيرات بيئة مطلوبة.

## الدمج في موقع 3A
- كمسار مستقل: انسخ `src/components` و`src/lib` إلى مشروع الموقع، وأنشئ `app/library/page.tsx` يعرض `<LibraryApp />`.
- أو انشره كمشروع منفصل على نطاق فرعي، أو تحت مسار باستخدام `NEXT_PUBLIC_BASE_PATH=/library`.
- ألوان الهوية معرّفة كمتغيرات CSS في `src/app/globals.css` (الدرجات غير #165B33 تقديرية). استبدلها بقيم tailwind.config الحقيقية لقُدراتي.

## بنية الفهرس (catalog.json)
{ "name": "...", "folders": [ { ...نفس البنية } ], "files": [ { "id": "...", "name": "...", "mime": "..." } ] }

## ملاحظات
- التشغيل الصوتي المباشر يستخدم رابط تنزيل Drive، ويعتمد على إعدادات المشاركة. عند الفشل يتحول إلى معاينة Drive.
- الحالة (المفضلة، التقدم، السلسلة) محفوظة في localStorage للمتصفح الواحد.
