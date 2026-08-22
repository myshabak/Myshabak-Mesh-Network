# دليل نشر مشروع مشبك مش نتورك خطوة بخطوة

الدليل ده مكتوب على أساس إنك أول مرة تتعامل مع Cloudflare Workers و D1. كل أمر تقدر تنسخه وتلزقه زي ما هو.

---

## 1. إنشاء GitHub Repository

1. روح على github.com وسجل دخول بحساب `Hakyor`.
2. اعمل **New repository** باسم `meshabek`.
3. سيبه Public، من غير README (هنرفع الملفات إحنا).

على جهازك (أو من التيرمينال هنا):

```bash
cd meshabek
git init
git add .
git commit -m "Initial Meshabek website"
git branch -M main
git remote add origin https://github.com/Hakyor/meshabek.git
git push -u origin main
```

---

## 2. رفع الفرونت إند وتفعيل GitHub Pages

لو الفرونت إند في مجلد `frontend/` جوه الريبو، إنت عندك خيارين:
- تفعيل Pages وتخليها تقرأ من مجلد `/frontend` (الأسهل).
- أو تنقل محتوى `frontend/` لمجلد تاني اسمه `docs/` أو لـ root.

**الأسهل:** GitHub Pages بيدعم النشر من فرع `main` ومجلد `/docs` بس (مش أي مجلد). فأسهل حل:

```bash
git mv frontend docs
git commit -m "Move frontend to docs/ for GitHub Pages"
git push
```

بعدين:
1. روح **Settings → Pages** في الريبو.
2. تحت **Build and deployment**، اختار **Deploy from a branch**.
3. اختار الفرع `main` والمجلد `/docs`.
4. اضغط **Save**.

بعد دقيقة أو اتنين، الموقع هيبقى شغال على:
```
https://hakyor.github.io/meshabek/
```

---

## 3. إنشاء Cloudflare Worker

1. سجل / ادخل على [dash.cloudflare.com](https://dash.cloudflare.com).
2. ثبّت Wrangler (أداة الـCLI بتاعة Cloudflare) لو مش مثبتة:

```bash
npm install -g wrangler
wrangler login
```

هيفتحلك المتصفح عشان توافق على الصلاحيات.

3. من جوه مجلد `worker/`:

```bash
cd worker
npm install
```

---

## 4. إنشاء قاعدة بيانات D1

```bash
wrangler d1 create meshabek-db
```

هيديك output فيه `database_id`. انسخه.

افتح `worker/wrangler.toml` وحط الـ`database_id` بدل `REPLACE_WITH_YOUR_DATABASE_ID`.

---

## 5. تطبيق الـMigrations (Schema)

```bash
wrangler d1 execute meshabek-db --remote --file=../db/schema.sql
```

بعد كده حط بيانات مشبك مش نتورك نفسها (seed):

```bash
wrangler d1 execute meshabek-db --remote --file=../db/seed.sql
```

للتأكد إن البيانات اتحطت صح:

```bash
wrangler d1 execute meshabek-db --remote --command="SELECT * FROM businesses"
```

> **ملحوظة:** لو حابب تجرب محلي الأول قبل الرفع، شيل `--remote` وهيشتغل على نسخة محلية من D1.

---

## 6. تجربة الـWorker محليًا (اختياري بس مفيد)

```bash
wrangler dev
```

هيديك رابط زي `http://localhost:8787`. جرب:
```
http://localhost:8787/api/business/meshabek
```

المفروض يرجعلك بيانات مشبك مش نتورك في JSON.

---

## 7. نشر الـWorker (Deploy)

```bash
wrangler deploy
```

هيديك رابط الـWorker النهائي، شكله تقريبًا:
```
https://meshabek-api.YOUR-SUBDOMAIN.workers.dev
```

احتفظ بالرابط ده.

---

## 8. ربط الفرونت إند بالـWorker

افتح `docs/js/main.js` (أو `frontend/js/main.js` لو لسه ما نقلتهاش) ودور على السطر:

```js
const API_BASE = "https://meshabek-api.YOUR-SUBDOMAIN.workers.dev";
```

استبدله بالرابط الحقيقي بتاعك من الخطوة اللي فاتت. بعد كده:

```bash
git add .
git commit -m "Connect frontend to deployed Worker API"
git push
```

---

## 9. تحديث إعدادات CORS في الـWorker

افتح `worker/src/index.js` ودور على `ALLOWED_ORIGINS` في أول الملف. تأكد إن رابط GitHub Pages بتاعك (`https://hakyor.github.io`) موجود فيها. لو غيرت اسم المستخدم أو الريبو، حدّث الرابط، بعدين:

```bash
wrangler deploy
```

---

## 10. اختبار الـAPI

```bash
curl https://meshabek-api.YOUR-SUBDOMAIN.workers.dev/api/business/meshabek
```

المفروض يرجعلك JSON فيه بيانات مشبك مش نتورك.

جرب كمان endpoint الرسايل:

```bash
curl -X POST https://meshabek-api.YOUR-SUBDOMAIN.workers.dev/api/contact \
  -H "Content-Type: application/json" \
  -d '{"business_id":1,"name":"تجربة","message":"رسالة تجريبية"}'
```

---

## 11. اختبار الموقع

افتح `https://hakyor.github.io/meshabek/` وتأكد من:
- الخدمات والباقات بتظهر (لو الـAPI مش شغال، هيظهر fallback ثابت تلقائي).
- زرار تبديل اللغة (AR/EN) شغال.
- فورم التواصل بيبعت رسالة وبترجع في قاعدة البيانات (تقدر تتأكد بـ `wrangler d1 execute meshabek-db --remote --command="SELECT * FROM contact_messages"`).
- زرار الاتصال والواتساب والإيميل شغالين على الموبايل.

---

## 12. تحديث المشروع لاحقًا

أي تعديل في الفرونت إند:
```bash
git add . && git commit -m "وصف التعديل" && git push
```
GitHub Pages بيتحدث تلقائي بعد دقيقة أو اتنين.

أي تعديل في الـWorker:
```bash
cd worker
wrangler deploy
```

أي تعديل في بيانات نشاط (زي تغيير رقم تليفون):
```bash
wrangler d1 execute meshabek-db --remote --command="UPDATE businesses SET phone='xxxx' WHERE slug='meshabek'"
```

---

## 13. إضافة عميل جديد مستقبلًا (الهدف الأكبر من المشروع)

لما يبقى عندك عميل حقيقي (مثلاً محل ملابس)، مش محتاج تعمل مشروع جديد من الصفر:

```bash
wrangler d1 execute meshabek-db --remote --command="INSERT INTO businesses (slug, name_ar, name_en, phone, whatsapp, email) VALUES ('shop-slug', 'اسم المحل', 'Shop Name', '01xxxxxxxxx', '01xxxxxxxxx', 'shop@email.com')"
```

بعد كده تضيفله `services` و`products` بنفس الطريقة، وتعمل صفحة فرونت إند خفيفة بتقرأ من `/api/business/shop-slug` بدل `meshabek`. ده هو أساس فكرة الـ"مش نتورك" اللي المشروع مبني عليها.

---

## استكشاف الأخطاء الشائعة

| المشكلة | الحل |
|---|---|
| الموقع بيظهر بس البيانات مش بتتحمل | افتح Developer Console (F12) في المتصفح وشوف تبويب Network، تأكد إن `API_BASE` في `main.js` صحيح |
| رسالة CORS error | تأكد إن الدومين بتاعك مضاف في `ALLOWED_ORIGINS` جوه `worker/src/index.js` وإنك عملت `wrangler deploy` بعد التعديل |
| `wrangler d1 execute` بيديك خطأ صلاحيات | تأكد إنك عملت `wrangler login` وإن الـ`database_id` في `wrangler.toml` صح |
| الصفحة بتفضل فاضية | تأكد إن ملف `assets/logo.png` موجود (لو مش موجود، الاسم النصي بيظهر بدالها تلقائي، فمفروض ميأثرش على باقي الصفحة) |

لو واجهت أي error، ابعتلي نصه بالظبط وهساعدك تحله.
