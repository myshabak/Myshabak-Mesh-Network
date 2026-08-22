// Meshabek API — Cloudflare Worker
// Talks to D1. Frontend never touches the database directly.

const ALLOWED_ORIGINS = [
  "https://hakyor.github.io", // GitHub Pages origin — update if your GH username/repo changes
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(origin),
    },
  });
}

// very small in-memory rate limiter (per-isolate, best-effort only)
const rateBucket = new Map();
function isRateLimited(key, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const entry = rateBucket.get(key) || { count: 0, reset: now + windowMs };
  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + windowMs;
  }
  entry.count += 1;
  rateBucket.set(key, entry);
  return entry.count > limit;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const path = url.pathname;

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    try {
      // GET /api/business/:slug
      let m = path.match(/^\/api\/business\/([a-z0-9-]+)$/i);
      if (m && request.method === "GET") {
        const slug = m[1];
        const biz = await env.DB.prepare(
          "SELECT * FROM businesses WHERE slug = ?"
        )
          .bind(slug)
          .first();
        if (!biz) return json({ error: "Business not found" }, 404, origin);
        return json({ business: biz }, 200, origin);
      }

      // GET /api/services/:businessId
      m = path.match(/^\/api\/services\/(\d+)$/);
      if (m && request.method === "GET") {
        const businessId = m[1];
        const { results } = await env.DB.prepare(
          "SELECT * FROM services WHERE business_id = ? ORDER BY sort_order ASC"
        )
          .bind(businessId)
          .all();
        return json({ services: results }, 200, origin);
      }

      // GET /api/products/:businessId
      m = path.match(/^\/api\/products\/(\d+)$/);
      if (m && request.method === "GET") {
        const businessId = m[1];
        const { results } = await env.DB.prepare(
          "SELECT * FROM products WHERE business_id = ? ORDER BY sort_order ASC"
        )
          .bind(businessId)
          .all();
        return json({ products: results }, 200, origin);
      }

      // GET /api/settings/:businessId
      m = path.match(/^\/api\/settings\/(\d+)$/);
      if (m && request.method === "GET") {
        const businessId = m[1];
        const { results } = await env.DB.prepare(
          "SELECT setting_key, setting_value FROM website_settings WHERE business_id = ?"
        )
          .bind(businessId)
          .all();
        const settings = {};
        for (const row of results) settings[row.setting_key] = row.setting_value;
        return json({ settings }, 200, origin);
      }

      // POST /api/contact
      if (path === "/api/contact" && request.method === "POST") {
        const ip = request.headers.get("CF-Connecting-IP") || "unknown";
        if (isRateLimited(ip, 5, 60000)) {
          return json({ error: "Too many requests. Please try again shortly." }, 429, origin);
        }

        let body;
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid JSON body" }, 400, origin);
        }

        const { business_id, name, phone, email, message } = body || {};

        if (!business_id || !Number.isInteger(Number(business_id))) {
          return json({ error: "business_id is required" }, 400, origin);
        }
        if (!name || typeof name !== "string" || name.trim().length < 2 || name.length > 200) {
          return json({ error: "A valid name is required" }, 400, origin);
        }
        if (!message || typeof message !== "string" || message.trim().length < 5 || message.length > 2000) {
          return json({ error: "A valid message is required" }, 400, origin);
        }
        if (phone && (typeof phone !== "string" || phone.length > 30)) {
          return json({ error: "Invalid phone" }, 400, origin);
        }
        if (email && (typeof email !== "string" || email.length > 200 || !email.includes("@"))) {
          return json({ error: "Invalid email" }, 400, origin);
        }

        await env.DB.prepare(
          `INSERT INTO contact_messages (business_id, name, phone, email, message)
           VALUES (?, ?, ?, ?, ?)`
        )
          .bind(
            Number(business_id),
            name.trim().slice(0, 200),
            phone ? phone.trim().slice(0, 30) : null,
            email ? email.trim().slice(0, 200) : null,
            message.trim().slice(0, 2000)
          )
          .run();

        return json({ success: true }, 201, origin);
      }

      return json({ error: "Not found" }, 404, origin);
    } catch (err) {
      return json({ error: "Server error", detail: String(err) }, 500, origin);
    }
  },
};
