# مشبك مش نتورك — Mesh Network

موقع أعمال متعدد الاستخدام لمشبك مش نتورك، مبني عشان يتوسع لعملاء تانيين من غير إعادة بناء المشروع من الصفر.

## البنية

```
meshabek/
├── frontend/          → الموقع نفسه (HTML/CSS/JS) — يترفع على GitHub Pages
│   ├── index.html
│   ├── css/style.css
│   ├── js/main.js
│   ├── assets/        → حط اللوجو هنا باسم logo.png (وlogo-en.png لو النسخة الإنجليزية مختلفة)
│   ├── robots.txt
│   └── sitemap.xml
├── worker/            → Cloudflare Worker (API) — يترفع بـ wrangler
│   ├── src/index.js
│   └── wrangler.toml
├── db/                → Schema و seed data لـ Cloudflare D1
│   ├── schema.sql
│   └── seed.sql
└── docs/
    └── DEPLOYMENT.md  → دليل النشر كامل خطوة بخطوة
```

## اللوجو

الموقع بيدور تلقائي على `frontend/assets/logo.png`. لو الصورة مش موجودة، بيظهر بدالها اسم "مشبك مش نتورك" كنص. حط اللوجو بتاعك في المكان ده وهيشتغل من غير أي تعديل في الكود.

للنسخة الإنجليزية، ممكن تستخدم نفس اللوجو أو لوجو منفصل — قولّي لو عايز الكود يفرّق بينهم تلقائيًا حسب اللغة المختارة.

## البدء السريع

شوف `docs/DEPLOYMENT.md` للدليل الكامل. باختصار:

1. ارفع `frontend/` (أو انقلها لـ `docs/`) على GitHub Pages.
2. اعمل D1 database وطبّق `db/schema.sql` و `db/seed.sql`.
3. انشر الـWorker من `worker/` بـ `wrangler deploy`.
4. حدّث `API_BASE` في `frontend/js/main.js` برابط الـWorker.
