-- Meshabek D1 schema
-- Designed so a new client business = new rows, not a new codebase.

CREATE TABLE IF NOT EXISTS businesses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,               -- e.g. 'meshabek'
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  tagline_ar TEXT,
  tagline_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address_ar TEXT,
  address_en TEXT,
  maps_url TEXT,
  hours_ar TEXT,
  hours_en TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#0B0B0C',
  accent_color TEXT DEFAULT '#E4231C',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  icon TEXT,                                -- optional icon key for frontend
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  price TEXT,                               -- free text, e.g. '750 جنيه'
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',                -- new | read | replied
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS website_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL,
  setting_value TEXT,
  UNIQUE(business_id, setting_key)
);

CREATE INDEX IF NOT EXISTS idx_services_business ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_products_business ON products(business_id);
CREATE INDEX IF NOT EXISTS idx_messages_business ON contact_messages(business_id);
CREATE INDEX IF NOT EXISTS idx_settings_business ON website_settings(business_id);
