(function () {
  "use strict";

  // ======== CONFIG ========
  // Replace with your deployed Worker URL once you have it.
  const API_BASE = "https://meshabek-api.YOUR-SUBDOMAIN.workers.dev";
  const BUSINESS_SLUG = "meshabek";
  const BUSINESS_ID = 1; // meshabek is seeded as business_id 1

  // ======== STATIC FALLBACK DATA ========
  // Used if the API is unreachable, so the site never looks broken.
  const FALLBACK_SERVICES = [
    { title_ar: "تصميم وتطوير المواقع", title_en: "Website design & development", description_ar: "مواقع سريعة ومتجاوبة مع الموبايل ومصممة حسب طبيعة نشاطك.", description_en: "Fast, mobile-responsive websites designed around what your business does." },
    { title_ar: "Google Maps", title_en: "Google Maps setup", description_ar: "مساعدة في إضافة وتجهيز نشاطك التجاري على Google Maps.", description_en: "We help you set up your Google Business Profile on Maps." },
    { title_ar: "WhatsApp والتواصل", title_en: "WhatsApp & contact", description_ar: "نخلي العميل يقدر يتواصل مع النشاط بسهولة من الموقع.", description_en: "We make it easy for customers to reach you from the site." },
    { title_ar: "وجود رقمي متكامل", title_en: "Complete digital presence", description_ar: "بيانات النشاط والخدمات والصور ووسائل التواصل في مكان واحد.", description_en: "Your info, services, photos, and social links, all in one place." },
    { title_ar: "SEO أساسي", title_en: "Basic SEO", description_ar: "تجهيز الموقع بشكل جيد لمحركات البحث.", description_en: "We prepare your site properly for search engines." },
  ];

  const FALLBACK_PRICING = [
    {
      title_ar: "Starter", title_en: "Starter", price: "500",
      features_ar: ["موقع بسيط", "بيانات المحل وصور", "رقم الهاتف و WhatsApp", "Google Maps داخل الموقع", "تصميم مناسب للموبايل", "SEO أساسي"],
      features_en: ["A simple website", "Shop info & photos", "Phone & WhatsApp", "Embedded Google Maps", "Mobile-friendly design", "Basic SEO"],
      featured: false
    },
    {
      title_ar: "Business", title_en: "Business", price: "1,000",
      features_ar: ["موقع كامل", "صفحات للخدمات أو المنتجات", "معرض صور", "WhatsApp واتصال مباشر", "Google Maps + وسائل التواصل", "تعديلات بسيطة بعد التسليم"],
      features_en: ["A full website", "Service/product pages", "Photo gallery", "WhatsApp & direct call", "Maps + social links", "Minor edits after delivery"],
      featured: true
    },
    {
      title_ar: "Pro", title_en: "Pro", price: "3,000",
      features_ar: ["كل مميزات Business", "صفحات أكتر ومحتوى ديناميكي", "قاعدة بيانات عند الحاجة", "خصائص مخصصة لنشاطك", "SEO متقدم", "دعم بعد التسليم"],
      features_en: ["Everything in Business", "More pages, dynamic content", "A database when needed", "Custom features for your business", "Advanced SEO", "Post-delivery support"],
      featured: false
    },
  ];

  // ======== LANGUAGE ========
  const LANG_KEY = "meshabek_lang";
  function getLang() {
    return localStorage.getItem(LANG_KEY) || "ar";
  }
  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-ar][data-en]").forEach((el) => {
      const text = lang === "ar" ? el.getAttribute("data-ar") : el.getAttribute("data-en");
      if (el.hasAttribute("data-attr")) {
        el.setAttribute(el.getAttribute("data-attr"), text);
      } else {
        el.textContent = text;
      }
    });
    const toggle = document.getElementById("langToggle");
    if (toggle) toggle.textContent = lang === "ar" ? "EN" : "AR";
    localStorage.setItem(LANG_KEY, lang);
  }

  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      const next = getLang() === "ar" ? "en" : "ar";
      applyLang(next);
    });
  }
  applyLang(getLang());

  // ======== MOBILE MENU ========
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      })
    );
  }

  // ======== RENDER SERVICES ========
  function renderServices(services) {
    const grid = document.getElementById("servicesGrid");
    if (!grid) return;
    grid.innerHTML = "";
    services.forEach((s) => {
      const card = document.createElement("div");
      card.className = "service-card";
      const h3 = document.createElement("h3");
      h3.setAttribute("data-ar", s.title_ar);
      h3.setAttribute("data-en", s.title_en);
      const p = document.createElement("p");
      p.setAttribute("data-ar", s.description_ar || "");
      p.setAttribute("data-en", s.description_en || "");
      card.appendChild(h3);
      card.appendChild(p);
      grid.appendChild(card);
    });
    applyLang(getLang());
  }

  // ======== RENDER PRICING ========
  function renderPricing(packages) {
    const grid = document.getElementById("pricingGrid");
    if (!grid) return;
    grid.innerHTML = "";
    packages.forEach((pkg) => {
      const card = document.createElement("div");
      card.className = "price-card" + (pkg.featured ? " featured" : "");

      if (pkg.featured) {
        const badge = document.createElement("span");
        badge.className = "price-badge";
        badge.setAttribute("data-ar", "الأكثر طلبًا");
        badge.setAttribute("data-en", "Most popular");
        card.appendChild(badge);
      }

      const h3 = document.createElement("h3");
      h3.textContent = pkg.title_ar; // package names stay as brand-style labels
      card.appendChild(h3);

      const amount = document.createElement("p");
      amount.className = "price-amount";
      const unit = document.createElement("span");
      unit.setAttribute("data-ar", " جنيه");
      unit.setAttribute("data-en", " EGP");
      amount.textContent = pkg.price;
      amount.appendChild(unit);
      card.appendChild(amount);

      const ul = document.createElement("ul");
      const featuresAr = pkg.features_ar || [];
      const featuresEn = pkg.features_en || featuresAr;
      featuresAr.forEach((feat, i) => {
        const li = document.createElement("li");
        li.setAttribute("data-ar", feat);
        li.setAttribute("data-en", featuresEn[i] || feat);
        ul.appendChild(li);
      });
      card.appendChild(ul);

      const cta = document.createElement("a");
      cta.href = "#contact";
      cta.className = "price-cta";
      cta.setAttribute("data-ar", "اطلب الباقة دي");
      cta.setAttribute("data-en", "Choose this package");
      card.appendChild(cta);

      grid.appendChild(card);
    });
    applyLang(getLang());
  }

  // ======== FETCH FROM API (with fallback) ========
  async function loadServices() {
    try {
      const res = await fetch(`${API_BASE}/api/services/${BUSINESS_ID}`);
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      if (Array.isArray(data.services) && data.services.length) {
        renderServices(data.services);
        return;
      }
      throw new Error("empty");
    } catch (e) {
      renderServices(FALLBACK_SERVICES);
    }
  }

  async function loadPricing() {
    try {
      const res = await fetch(`${API_BASE}/api/products/${BUSINESS_ID}`);
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      if (Array.isArray(data.products) && data.products.length) {
        const mapped = data.products.map((p, i) => ({
          title_ar: p.title_ar,
          title_en: p.title_en,
          price: (p.price || "").replace(/[^\d,]/g, ""),
          features_ar: (p.description_ar || "").split("،").map((s) => s.trim()).filter(Boolean),
          features_en: (p.description_en || "").split(",").map((s) => s.trim()).filter(Boolean),
          featured: i === 1, // middle package highlighted, matching "Business" tier
        }));
        renderPricing(mapped);
        return;
      }
      throw new Error("empty");
    } catch (e) {
      renderPricing(FALLBACK_PRICING);
    }
  }

  loadServices();
  loadPricing();

  // ======== CONTACT FORM ========
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");

  function setStatus(lang, ar, en, type) {
    if (!statusEl) return;
    statusEl.textContent = lang === "ar" ? ar : en;
    statusEl.className = "form-status" + (type ? " " + type : "");
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const lang = getLang();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const message = form.message.value.trim();

      if (name.length < 2) {
        setStatus(lang, "من فضلك اكتب اسمك.", "Please enter your name.", "error");
        return;
      }
      if (message.length < 5) {
        setStatus(lang, "من فضلك اكتب رسالة أوضح.", "Please write a longer message.", "error");
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      setStatus(lang, "جاري الإرسال...", "Sending...", "");

      try {
        const res = await fetch(`${API_BASE}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ business_id: BUSINESS_ID, name, phone, message }),
        });
        if (!res.ok) throw new Error("failed");
        setStatus(lang, "تم إرسال رسالتك، هنتواصل معاك قريب!", "Your message was sent — we'll be in touch soon!", "success");
        form.reset();
      } catch (err) {
        setStatus(
          lang,
          "حصل خطأ في الإرسال. تقدر تتواصل معنا مباشرة على WhatsApp.",
          "Something went wrong. You can reach us directly on WhatsApp instead.",
          "error"
        );
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
})();
