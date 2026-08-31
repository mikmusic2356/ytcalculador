import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { ToolRegistry } from './src/services/toolRegistry';
import { turso, initDatabase } from './src/services/db';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Turso database tables on server start
initDatabase();

// Lazy-initialize Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'YouTubeCalculador API',
    database: 'Turso LibSQL Connected',
    timestamp: new Date().toISOString(),
  });
});

// Real Analytics: Record Telemetry Event
app.post('/api/analytics/track', async (req, res) => {
  try {
    const { visitorId, eventType, toolSlug, toolName, category, metadata } = req.body;
    if (!visitorId || !eventType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const now = Date.now();
    const userAgent = req.headers['user-agent'] || '';

    // 1. Upsert Visitor in Turso
    await turso.execute({
      sql: `
        INSERT INTO visitors (id, first_seen, last_seen, user_agent)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET last_seen = ?;
      `,
      args: [visitorId, now, now, userAgent, now],
    });

    // 2. Insert Telemetry Event in Turso
    await turso.execute({
      sql: `
        INSERT INTO telemetry_events (visitor_id, event_type, tool_slug, tool_name, category, metadata, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      args: [
        visitorId,
        eventType,
        toolSlug || null,
        toolName || null,
        category || null,
        metadata ? JSON.stringify(metadata) : null,
        now,
      ],
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error tracking analytics event:', error);
    res.status(500).json({ error: 'Failed to record event' });
  }
});

// Real Analytics: Query Dashboard Aggregated Stats from Turso
app.get('/api/analytics/stats', async (req, res) => {
  try {
    // 1. Total Unique Visitors from Turso
    const visitorsRes = await turso.execute('SELECT COUNT(DISTINCT id) as total FROM visitors;');
    const totalUniqueVisitors = Number(visitorsRes.rows[0]?.total || 0);

    // 2. Total Page Views & Calculations
    const countsRes = await turso.execute(`
      SELECT 
        SUM(CASE WHEN event_type = 'tool_viewed' THEN 1 ELSE 0 END) as total_views,
        SUM(CASE WHEN event_type = 'calculation_completed' THEN 1 ELSE 0 END) as total_calculations
      FROM telemetry_events;
    `);
    const totalViews = Number(countsRes.rows[0]?.total_views || 0);
    const totalCalculations = Number(countsRes.rows[0]?.total_calculations || 0);

    // 3. Popular Tools Ranking
    const popularRes = await turso.execute(`
      SELECT 
        tool_slug as slug,
        COALESCE(tool_name, tool_slug) as name,
        COALESCE(category, 'general') as category,
        COUNT(*) as count
      FROM telemetry_events
      WHERE tool_slug IS NOT NULL AND tool_slug != ''
      GROUP BY tool_slug
      ORDER BY count DESC
      LIMIT 10;
    `);
    const popularTools = popularRes.rows.map((r: any) => ({
      slug: String(r.slug),
      name: String(r.name),
      category: String(r.category) as any,
      count: Number(r.count),
    }));

    // 4. Daily calculations for last 7 days
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const dailyRes = await turso.execute({
      sql: `
        SELECT 
          strftime('%d/%m', datetime(created_at/1000, 'unixepoch')) as date,
          SUM(CASE WHEN event_type = 'calculation_completed' THEN 1 ELSE 0 END) as calculations,
          SUM(CASE WHEN event_type = 'tool_viewed' THEN 1 ELSE 0 END) as views
        FROM telemetry_events
        WHERE created_at >= ?
        GROUP BY date
        ORDER BY min(created_at) ASC;
      `,
      args: [sevenDaysAgo],
    });

    const dailyCalculations = dailyRes.rows.map((r: any) => ({
      date: String(r.date),
      calculations: Number(r.calculations),
      views: Number(r.views),
    }));

    // 5. Category Distribution
    const catRes = await turso.execute(`
      SELECT 
        category,
        COUNT(*) as count
      FROM telemetry_events
      WHERE category IS NOT NULL AND category != ''
      GROUP BY category
      ORDER BY count DESC;
    `);
    const categoryColors: Record<string, string> = {
      ingresos: '#DC2626',
      analytics: '#2563EB',
      video: '#16A34A',
      imagenes: '#9333EA',
      seo: '#D97706',
    };
    const categoryDistribution = catRes.rows.map((r: any) => ({
      category: String(r.category) as any,
      label: String(r.category).toUpperCase(),
      count: Number(r.count),
      color: categoryColors[String(r.category)] || '#71717A',
    }));

    // 6. Recent live events (last 50)
    const eventsRes = await turso.execute(`
      SELECT visitor_id, event_type, tool_slug, tool_name, category, created_at
      FROM telemetry_events
      ORDER BY created_at DESC
      LIMIT 50;
    `);
    const recentEvents = eventsRes.rows.map((r: any) => ({
      type: r.event_type,
      toolSlug: r.tool_slug || undefined,
      tool_name: r.tool_name || undefined,
      category: r.category || undefined,
      timestamp: Number(r.created_at),
    }));

    res.json({
      stats: {
        totalCalculations,
        totalViews,
        totalUniqueVisitors,
        popularTools,
        dailyCalculations,
        categoryDistribution,
        hourlyActivity: [],
      },
      events: recentEvents,
    });
  } catch (error: any) {
    console.error('Error fetching analytics stats from Turso:', error);
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

// Image Tools Management: Get all Image Tools from Turso Database
app.get('/api/admin/image-tools', async (req, res) => {
  try {
    const result = await turso.execute(`
      SELECT id, name, category, route, status, h1, seo_title, meta_description, indexable, created_at, updated_at
      FROM image_tools
      ORDER BY id ASC;
    `);

    const tools = result.rows.map((row: any) => ({
      id: String(row.id),
      name: String(row.name),
      category: String(row.category),
      route: String(row.route),
      status: String(row.status),
      h1: row.h1 ? String(row.h1) : '',
      seoTitle: row.seo_title ? String(row.seo_title) : '',
      metaDescription: row.meta_description ? String(row.meta_description) : '',
      indexable: Boolean(row.indexable),
      createdAt: Number(row.created_at || 0),
      updatedAt: Number(row.updated_at || 0),
    }));

    res.json({ tools });
  } catch (error: any) {
    console.error('Error fetching image tools from Turso:', error);
    res.status(500).json({ error: 'Failed to retrieve image tools' });
  }
});

// Image Tools Management: Update Image Tool in Turso Database
app.post('/api/admin/image-tools/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, route, status, h1, seoTitle, metaDescription, indexable } = req.body;
    const now = Date.now();

    await turso.execute({
      sql: `
        UPDATE image_tools
        SET 
          name = COALESCE(?, name),
          category = COALESCE(?, category),
          route = COALESCE(?, route),
          status = COALESCE(?, status),
          h1 = COALESCE(?, h1),
          seo_title = COALESCE(?, seo_title),
          meta_description = COALESCE(?, meta_description),
          indexable = COALESCE(?, indexable),
          updated_at = ?
        WHERE id = ?;
      `,
      args: [
        name !== undefined ? name : null,
        category !== undefined ? category : null,
        route !== undefined ? route : null,
        status !== undefined ? status : null,
        h1 !== undefined ? h1 : null,
        seoTitle !== undefined ? seoTitle : null,
        metaDescription !== undefined ? metaDescription : null,
        indexable !== undefined ? (indexable ? 1 : 0) : null,
        now,
        id,
      ],
    });

    res.json({ success: true, id });
  } catch (error: any) {
    console.error('Error updating image tool in Turso:', error);
    res.status(500).json({ error: 'Failed to update image tool' });
  }
});

// Image Conversion Usage Tracking: Record Conversion Event in Turso
app.post('/api/analytics/image-conversion', async (req, res) => {
  try {
    const { tool_id, event, format_from, format_to } = req.body;
    if (!tool_id || !format_from || !format_to) {
      return res.status(400).json({ error: 'Missing required conversion telemetry parameters' });
    }

    const now = Date.now();
    await turso.execute({
      sql: `
        INSERT INTO image_conversions (tool_id, event, format_from, format_to, created_at)
        VALUES (?, ?, ?, ?, ?);
      `,
      args: [tool_id, event || 'conversion', String(format_from).toLowerCase(), String(format_to).toLowerCase(), now],
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error recording image conversion in Turso:', error);
    res.status(500).json({ error: 'Failed to record conversion' });
  }
});

// Image Stats for Admin: Filter by Tool and Period
app.get('/api/admin/image-stats', async (req, res) => {
  try {
    const { tool_id, period } = req.query;
    const now = Date.now();
    let timeThreshold = 0;

    if (period === 'today') {
      timeThreshold = now - 24 * 60 * 60 * 1000;
    } else if (period === '7days') {
      timeThreshold = now - 7 * 24 * 60 * 60 * 1000;
    } else if (period === '30days') {
      timeThreshold = now - 30 * 24 * 60 * 60 * 1000;
    }

    // 1. Tool-level aggregation
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (timeThreshold > 0) {
      whereClause += ' AND c.created_at >= ?';
      params.push(timeThreshold);
    }
    if (tool_id && tool_id !== 'all') {
      whereClause += ' AND c.tool_id = ?';
      params.push(tool_id);
    }

    const statsQuery = `
      SELECT 
        c.tool_id,
        COALESCE(t.name, c.tool_id) as tool_name,
        COUNT(*) as total_conversions,
        c.format_from,
        c.format_to
      FROM image_conversions c
      LEFT JOIN image_tools t ON c.tool_id = t.id
      ${whereClause}
      GROUP BY c.tool_id, c.format_from, c.format_to
      ORDER BY total_conversions DESC;
    `;

    const result = await turso.execute({
      sql: statsQuery,
      args: params,
    });

    // 2. Summary per tool
    const summaryMap: Record<string, { tool_id: string; tool_name: string; count: number; formats: Record<string, number> }> = {};
    let grandTotal = 0;

    for (const row of result.rows) {
      const tid = String(row.tool_id);
      const tname = String(row.tool_name);
      const count = Number(row.total_conversions);
      const formatPair = `${row.format_from} → ${row.format_to}`;
      grandTotal += count;

      if (!summaryMap[tid]) {
        summaryMap[tid] = {
          tool_id: tid,
          tool_name: tname,
          count: 0,
          formats: {},
        };
      }

      summaryMap[tid].count += count;
      summaryMap[tid].formats[formatPair] = (summaryMap[tid].formats[formatPair] || 0) + count;
    }

    const toolSummary = Object.values(summaryMap).sort((a, b) => b.count - a.count);

    // 3. Recent conversions list
    const recentRes = await turso.execute({
      sql: `
        SELECT c.id, c.tool_id, COALESCE(t.name, c.tool_id) as tool_name, c.event, c.format_from, c.format_to, c.created_at
        FROM image_conversions c
        LEFT JOIN image_tools t ON c.tool_id = t.id
        ${whereClause}
        ORDER BY c.created_at DESC
        LIMIT 50;
      `,
      args: params,
    });

    const recentConversions = recentRes.rows.map((r: any) => ({
      id: Number(r.id),
      tool_id: String(r.tool_id),
      tool_name: String(r.tool_name),
      event: String(r.event),
      format_from: String(r.format_from),
      format_to: String(r.format_to),
      created_at: Number(r.created_at),
    }));

    res.json({
      grandTotal,
      toolSummary,
      recentConversions,
    });
  } catch (error: any) {
    console.error('Error fetching image stats from Turso:', error);
    res.status(500).json({ error: 'Failed to retrieve image conversion stats' });
  }
});

// Cookie Consent Tracking: Record user cookie preference in Turso
app.post('/api/cookies/consent', async (req, res) => {
  try {
    const { visitorId, consentType, necessary, analytics, advertising } = req.body;
    if (!visitorId) {
      return res.status(400).json({ error: 'Missing visitorId' });
    }

    const now = Date.now();
    const userAgent = req.headers['user-agent'] || '';

    await turso.execute({
      sql: `
        INSERT INTO cookie_consents (visitor_id, consent_type, necessary, analytics, advertising, user_agent, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      args: [
        visitorId,
        consentType || 'custom',
        necessary !== undefined ? (necessary ? 1 : 0) : 1,
        analytics ? 1 : 0,
        advertising ? 1 : 0,
        userAgent,
        now,
      ],
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error recording cookie consent in Turso:', error);
    res.status(500).json({ error: 'Failed to record cookie consent' });
  }
});

// Cookie Stats & Consent Audit for Admin Dashboard
app.get('/api/admin/cookie-stats', async (req, res) => {
  try {
    // 1. Total consent records
    const totalsRes = await turso.execute(`
      SELECT 
        COUNT(*) as total_records,
        SUM(CASE WHEN consent_type = 'all' THEN 1 ELSE 0 END) as accepted_all,
        SUM(CASE WHEN consent_type = 'essential_only' THEN 1 ELSE 0 END) as rejected_optional,
        SUM(CASE WHEN consent_type = 'custom' THEN 1 ELSE 0 END) as custom_preferences,
        SUM(CASE WHEN analytics = 1 THEN 1 ELSE 0 END) as analytics_allowed,
        SUM(CASE WHEN advertising = 1 THEN 1 ELSE 0 END) as ads_allowed
      FROM cookie_consents;
    `);

    const row = (totalsRes.rows[0] as any) || {};
    const totalRecords = Number(row.total_records || 0);

    // 2. Settings
    const settingsRes = await turso.execute(`
      SELECT id, banner_title, banner_description, banner_enabled, require_explicit_consent, cookie_expiry_days, updated_at
      FROM cookie_settings
      WHERE id = 'default'
      LIMIT 1;
    `);
    const settings = (settingsRes.rows[0] as any) || {
      banner_title: 'Privacidad y Cookies en YouTubeCalculador',
      banner_description: 'Utilizamos cookies técnicas necesarias y cookies de analítica anónima.',
      banner_enabled: 1,
      require_explicit_consent: 1,
      cookie_expiry_days: 365,
    };

    // 3. Recent 50 consent audit records
    const recentRes = await turso.execute(`
      SELECT id, visitor_id, consent_type, necessary, analytics, advertising, user_agent, created_at
      FROM cookie_consents
      ORDER BY created_at DESC
      LIMIT 50;
    `);

    const recentConsents = recentRes.rows.map((r: any) => ({
      id: Number(r.id),
      visitorId: String(r.visitor_id),
      consentType: String(r.consent_type),
      necessary: Boolean(r.necessary),
      analytics: Boolean(r.analytics),
      advertising: Boolean(r.advertising),
      userAgent: String(r.user_agent || ''),
      createdAt: Number(r.created_at),
    }));

    res.json({
      summary: {
        totalRecords,
        acceptedAll: Number(row.accepted_all || 0),
        rejectedOptional: Number(row.rejected_optional || 0),
        customPreferences: Number(row.custom_preferences || 0),
        analyticsAllowed: Number(row.analytics_allowed || 0),
        adsAllowed: Number(row.ads_allowed || 0),
      },
      settings: {
        bannerTitle: String(settings.banner_title),
        bannerDescription: String(settings.banner_description),
        bannerEnabled: Boolean(settings.banner_enabled),
        requireExplicitConsent: Boolean(settings.require_explicit_consent),
        cookieExpiryDays: Number(settings.cookie_expiry_days),
      },
      recentConsents,
    });
  } catch (error: any) {
    console.error('Error fetching cookie stats from Turso:', error);
    res.status(500).json({ error: 'Failed to retrieve cookie stats' });
  }
});

// Update Cookie Settings from Admin
app.post('/api/admin/cookie-settings', async (req, res) => {
  try {
    const { bannerTitle, bannerDescription, bannerEnabled, requireExplicitConsent, cookieExpiryDays } = req.body;
    const now = Date.now();

    await turso.execute({
      sql: `
        UPDATE cookie_settings
        SET 
          banner_title = COALESCE(?, banner_title),
          banner_description = COALESCE(?, banner_description),
          banner_enabled = COALESCE(?, banner_enabled),
          require_explicit_consent = COALESCE(?, require_explicit_consent),
          cookie_expiry_days = COALESCE(?, cookie_expiry_days),
          updated_at = ?
        WHERE id = 'default';
      `,
      args: [
        bannerTitle !== undefined ? bannerTitle : null,
        bannerDescription !== undefined ? bannerDescription : null,
        bannerEnabled !== undefined ? (bannerEnabled ? 1 : 0) : null,
        requireExplicitConsent !== undefined ? (requireExplicitConsent ? 1 : 0) : null,
        cookieExpiryDays !== undefined ? Number(cookieExpiryDays) : null,
        now,
      ],
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error updating cookie settings in Turso:', error);
    res.status(500).json({ error: 'Failed to update cookie settings' });
  }
});

// Technical SEO: Dynamic Sitemap XML generated from ToolRegistry
app.get('/sitemap.xml', (req, res) => {
  try {
    const sitemapXml = ToolRegistry.generateSitemapXml();
    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(sitemapXml);
  } catch (error) {
    console.error('Error generating sitemap.xml:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Technical SEO: Dynamic Robots.txt generated from ToolRegistry
app.get('/robots.txt', (req, res) => {
  try {
    const robotsTxt = ToolRegistry.generateRobotsTxt();
    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.send(robotsTxt);
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    res.status(500).send('Error generating robots.txt');
  }
});

// Gemini AI Creator Advisor route (Server-Side Proxy)
app.post('/api/gemini/advisor', async (req, res) => {
  try {
    const { toolName, category, inputs, resultPrimary, recommendations } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Graceful fallback response when API key is not configured
      return res.json({
        advice: `💡 Para ${toolName} con valor ${resultPrimary}: Optimiza la retención en los primeros 30 segundos de tus videos para que el algoritmo aumente las impresiones sugeridas. Si el video supera 8 minutos, añade pausas publicitarias estratégicas.`,
      });
    }

    const prompt = `Actúa como un estratega y consultor sénior experto en el algoritmo de YouTube y monetización en YouTube Studio.
Analiza la siguiente métrica de un creador de contenido:
- Herramienta: ${toolName} (Categoría: ${category})
- Parámetros ingresados: ${JSON.stringify(inputs)}
- Resultado calculado: ${resultPrimary}
- Recomendaciones base: ${JSON.stringify(recommendations || [])}

Escribe un consejo estratégico, ultra conciso, accionable y profesional (máximo 3 frases directas en español) explicando exactamente qué paso técnico o de contenido debe realizar este creador en su próximo video para mejorar esta métrica.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({
      advice: response.text || 'Análisis completado satisfactoriamente.',
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/advisor:', error);
    res.status(200).json({
      advice:
        '💡 Consejo para tu canal: Mantén una consistencia de publicación semanal, mejora el contraste y legibilidad de tus miniaturas y analiza los picos de retención en tu YouTube Studio.',
    });
  }
});

// Vite middleware setup
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`YouTubeCalculador server running on http://0.0.0.0:${PORT}`);
  });
}

start();
