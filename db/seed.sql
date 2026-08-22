-- Seed: Meshabek's own business record (business #1)

INSERT INTO businesses (
  slug, name_ar, name_en, tagline_ar, tagline_en,
  description_ar, description_en,
  phone, whatsapp, email,
  address_ar, address_en,
  maps_url, hours_ar, hours_en,
  logo_url, primary_color, accent_color
) VALUES (
  'meshabek',
  'مشبك مش نتورك — Mesh Network',
  'Meshabek — Mesh Network',
  'خلّي مشروعك موجود أونلاين بشكل يليق بيه',
  'Give your business the online presence it deserves',
  'بنصمم ونطور مواقع احترافية للمحلات والمشاريع المحلية، ونساعدك يكون عندك وجود رقمي واضح وسهل لعملائك.',
  'We design and build professional websites for local shops and businesses, giving you a clear digital presence your customers can find and trust.',
  '01067508419',
  '01067508419',
  'myshabak.net@gmail.com',
  'دمياط، مصر',
  'Damietta, Egypt',
  NULL,
  NULL,
  NULL,
  NULL,
  '#0B0B0C',
  '#E4231C'
);

-- Services for business_id = 1 (meshabek)
INSERT INTO services (business_id, title_ar, title_en, description_ar, description_en, icon, sort_order) VALUES
(1, 'تصميم وتطوير المواقع', 'Website design & development', 'مواقع سريعة ومتجاوبة مع الموبايل ومصممة حسب طبيعة نشاطك.', 'Fast, mobile-responsive websites designed around what your business actually does.', 'code', 1),
(1, 'Google Maps', 'Google Maps setup', 'مساعدة في إضافة وتجهيز نشاطك التجاري على Google Maps / Google Business Profile.', 'We help you set up and prepare your Google Business Profile on Maps.', 'map-pin', 2),
(1, 'WhatsApp والتواصل', 'WhatsApp & contact', 'نخلي العميل يقدر يتواصل مع النشاط بسهولة من الموقع.', 'We make it easy for your customers to reach you directly from the site.', 'message-circle', 3),
(1, 'وجود رقمي متكامل', 'Complete digital presence', 'تنظيم بيانات النشاط، الخدمات، المنتجات، الصور، وسائل التواصل والموقع في مكان واحد.', 'All your business info, services, products, photos, and social links, organized in one place.', 'layers', 4),
(1, 'SEO أساسي', 'Basic SEO', 'تجهيز الموقع بشكل جيد لمحركات البحث.', 'We prepare your site properly for search engines.', 'search', 5);

-- Products table repurposed as pricing packages for meshabek
INSERT INTO products (business_id, title_ar, title_en, description_ar, description_en, price, sort_order) VALUES
(1, 'Starter', 'Starter', 'موقع بسيط، بيانات المحل، صور، رقم الهاتف، WhatsApp، Google Maps داخل الموقع، تصميم مناسب للموبايل، SEO أساسي', 'A simple site with your shop info, photos, phone, WhatsApp, embedded Google Maps, mobile-friendly design, basic SEO', '750 جنيه', 1),
(1, 'Business', 'Business', 'موقع كامل، صفحات للخدمات أو المنتجات، Gallery، WhatsApp، اتصال مباشر، Google Maps، ربط وسائل التواصل، SEO أساسي، تعديلات بسيطة بعد التسليم', 'A full site with service/product pages, gallery, WhatsApp, direct call, Maps, social links, basic SEO, and minor edits after delivery', '1500 جنيه', 2),
(1, 'Pro', 'Pro', 'كل مميزات Business، صفحات أكتر، محتوى ديناميكي، قاعدة بيانات عند الحاجة، خصائص مخصصة، SEO متقدم، دعم بعد التسليم', 'Everything in Business, plus more pages, dynamic content, a database when needed, custom features, advanced SEO, and post-delivery support', '3000 جنيه', 3);

-- Website settings for extra flexible fields
INSERT INTO website_settings (business_id, setting_key, setting_value) VALUES
(1, 'maintenance_price', '150 جنيه / شهر'),
(1, 'maps_setup_price', '200 جنيه مرة واحدة'),
(1, 'maps_setup_note_ar', '200 جنيه هي تكلفة خدمة مشبك مش نتورك لتجهيز وإضافة/المساعدة في إعداد Google Business Profile، وليست رسومًا من Google.'),
(1, 'maps_setup_note_en', 'The 200 EGP fee covers Meshabek''s work setting up your Google Business Profile — it is not a fee charged by Google.');
