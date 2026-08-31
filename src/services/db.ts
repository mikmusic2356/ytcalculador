import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import { IMAGE_TOOLS } from '../data/imageToolsData';

dotenv.config();

const url = process.env.TURSO_DATABASE_URL || 'libsql://yt-calculator-mikmusic2356.aws-us-east-2.turso.io';
const authToken = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODgxNTUxNTksImlkIjoiMDFhMDU2NWEtMTgwMS03OGUxLWE5NjktZjgxNTRhYWE1NDAxIiwia2lkIjoiT19jVUNRdEI2Y3hWTlBrSzJFZFJPTEI0ZUhqR2wweFEtNUlEUVNaSjBOUSIsInJpZCI6ImRhMjA0NzhjLTdlYWEtNGY0NS1hNTk3LWEwY2Y0YzRmOTAzNiJ9.UnF1kvXHtIHEYnpYIBNzwpiLCmv8Wy22OTydbXLfdShFmwn0ovUOLW1vwsfnMSA-5m1uGU73Rsj9rxnUCirXAw';

export const turso = createClient({
  url,
  authToken,
});

export async function initDatabase() {
  try {
    // 1. Visitors table (unique visitors by visitor_id cookie/fingerprint)
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS visitors (
        id TEXT PRIMARY KEY,
        first_seen INTEGER NOT NULL,
        last_seen INTEGER NOT NULL,
        user_agent TEXT,
        country TEXT
      );
    `);

    // 2. Events table (pageviews, calculations, tool interactions)
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS telemetry_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        visitor_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        tool_slug TEXT,
        tool_name TEXT,
        category TEXT,
        metadata TEXT,
        created_at INTEGER NOT NULL
      );
    `);

    // 3. Image Tools Management table (Turso Database for Image Tools)
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS image_tools (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'imagenes',
        route TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL DEFAULT 'active',
        h1 TEXT,
        seo_title TEXT,
        meta_description TEXT,
        indexable INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER,
        updated_at INTEGER
      );
    `);

    // 4. Image Conversions Usage Statistics table (100% anonymous, privacy-first)
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS image_conversions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tool_id TEXT NOT NULL,
        event TEXT NOT NULL DEFAULT 'conversion',
        format_from TEXT NOT NULL,
        format_to TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);

    // 5. Cookie Consent Records table (Compliance & Real-time audit)
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS cookie_consents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        visitor_id TEXT NOT NULL,
        consent_type TEXT NOT NULL,
        necessary INTEGER NOT NULL DEFAULT 1,
        analytics INTEGER NOT NULL DEFAULT 0,
        advertising INTEGER NOT NULL DEFAULT 0,
        user_agent TEXT,
        ip_country TEXT,
        created_at INTEGER NOT NULL
      );
    `);

    // 6. Cookie Policy & Banner Configuration table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS cookie_settings (
        id TEXT PRIMARY KEY,
        banner_title TEXT NOT NULL,
        banner_description TEXT NOT NULL,
        banner_enabled INTEGER NOT NULL DEFAULT 1,
        require_explicit_consent INTEGER NOT NULL DEFAULT 1,
        cookie_expiry_days INTEGER NOT NULL DEFAULT 365,
        updated_at INTEGER NOT NULL
      );
    `);

    // Seed default cookie settings if not exists
    await turso.execute({
      sql: `
        INSERT INTO cookie_settings (id, banner_title, banner_description, banner_enabled, require_explicit_consent, cookie_expiry_days, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO NOTHING;
      `,
      args: [
        'default',
        'Privacidad y Cookies en YouTubeCalculador',
        'Utilizamos cookies técnicas necesarias para el funcionamiento de las herramientas y cookies de analítica anónima para medir el uso y preparar el servicio para AdSense.',
        1,
        1,
        365,
        Date.now(),
      ],
    });

    // Indexes for fast statistics & filtering
    await turso.execute(`
      CREATE INDEX IF NOT EXISTS idx_events_type_created ON telemetry_events(event_type, created_at);
    `);
    await turso.execute(`
      CREATE INDEX IF NOT EXISTS idx_events_slug ON telemetry_events(tool_slug);
    `);
    await turso.execute(`
      CREATE INDEX IF NOT EXISTS idx_image_tools_route ON image_tools(route);
    `);
    await turso.execute(`
      CREATE INDEX IF NOT EXISTS idx_img_conv_tool_created ON image_conversions(tool_id, created_at);
    `);
    await turso.execute(`
      CREATE INDEX IF NOT EXISTS idx_cookie_consents_created ON cookie_consents(created_at);
    `);

    // Seed existing image tools into Turso if not already present (without duplication)
    const now = Date.now();
    for (const tool of IMAGE_TOOLS) {
      const canonicalRoute = `/imagenes/${tool.slug}`;
      await turso.execute({
        sql: `
          INSERT INTO image_tools (id, name, category, route, status, h1, seo_title, meta_description, indexable, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            category = excluded.category,
            updated_at = excluded.updated_at
          WHERE image_tools.updated_at IS NULL;
        `,
        args: [
          tool.id,
          tool.name,
          'imagenes',
          canonicalRoute,
          'active',
          tool.seo.h1 || tool.name,
          tool.seo.title,
          tool.seo.metaDescription,
          1,
          now,
          now,
        ],
      });
    }

    console.log('✅ Turso Database initialized successfully (visitors, telemetry_events & image_tools ready)');
  } catch (error) {
    console.error('❌ Error initializing Turso database:', error);
  }
}
