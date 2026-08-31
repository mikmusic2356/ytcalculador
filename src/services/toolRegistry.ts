import { CALCULATORS } from '../data/calculators';
import { IMAGE_TOOLS } from '../data/imageToolsData';
import { SEO_TOOLS } from '../data/seoToolsData';
import { GUIDES } from '../data/guides';
import { ToolCategory, FAQItem } from '../types';
import { getSiteUrl, getAbsoluteUrl } from '../config/site';

export type ToolKind = 'calculator' | 'image' | 'seo' | 'guide' | 'static';

export interface RegisteredTool {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory | 'general' | 'guia' | 'legal';
  subcategory?: string;
  route: string; // e.g. '/calculadora-ganancias-youtube', '/imagenes/convertir-jpg-a-png', '/seo/generador-de-palabras-clave-youtube'
  canonicalUrl: string; // Absolute canonical URL calculated dynamically: SITE_URL + route
  kind: ToolKind;
  h1: string;
  tagline?: string;
  shortDescription: string;
  iconName?: string;
  published: boolean;
  indexable: boolean;
  robots: 'index, follow' | 'noindex, nofollow' | 'noindex, follow';
  priority: number; // 0.1 to 1.0
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastModified?: string;
  seo: {
    title: string;
    metaDescription: string;
    h1: string;
    keywords: string[];
    summary?: string;
    faqs?: FAQItem[];
    howToSteps?: string[];
    ogType?: 'website' | 'article';
    ogImage?: string;
  };
}

export interface RouteMetadata {
  title: string;
  metaDescription: string;
  h1: string;
  canonical: string;
  robots: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    type: string;
    siteName: string;
    locale: string;
    image?: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image?: string;
  };
  faqs?: FAQItem[];
  howToSteps?: string[];
  toolName?: string;
}

class ToolRegistryService {
  private customTools: RegisteredTool[] = [];
  private redirects: Map<string, string> = new Map(); // oldRoute -> newRoute

  /**
   * Builds the initial collection of tools by unifying calculators, image tools, SEO tools, guides, and core pages.
   */
  private buildRegistry(): RegisteredTool[] {
    const siteUrl = getSiteUrl();
    const today = new Date().toISOString().split('T')[0];
    const registered: RegisteredTool[] = [];

    // 1. Core Landing & Hub Pages
    const staticPages: Array<{
      id: string;
      slug: string;
      name: string;
      route: string;
      category: 'general' | 'legal';
      title: string;
      metaDescription: string;
      h1: string;
      keywords: string[];
      priority: number;
      changefreq: RegisteredTool['changefreq'];
      indexable?: boolean;
      robots?: RegisteredTool['robots'];
    }> = [
      {
        id: 'home',
        slug: '',
        name: 'YouTubeCalculador - Plataforma para Creadores',
        route: '/',
        category: 'general',
        title: 'Calculadoras y Herramientas Gratuitas para Creadores de YouTube',
        metaDescription: 'Plataforma gratuita con calculadoras de RPM, CPM, ganancias de videos y Shorts, CTR, Watch Time, Asistente de Imágenes y Suite SEO para YouTube.',
        h1: 'Herramientas y Calculadoras Gratuitas para YouTube',
        keywords: ['calculadoras youtube', 'calcular ganancias youtube', 'rpm youtube', 'cpm youtube', 'herramientas creadores youtube'],
        priority: 1.0,
        changefreq: 'daily',
      },
      {
        id: 'calculators-directory',
        slug: 'calculadoras',
        name: 'Directorio de Calculadoras para YouTube',
        route: '/calculadoras',
        category: 'general',
        title: 'Todas las Calculadoras para YouTube (100% Gratuitas) | Directorio Completo',
        metaDescription: 'Explora nuestro catálogo de calculadoras de ingresos, RPM por país, proyección de crecimiento, retención y análisis técnico de video para YouTube.',
        h1: 'Directorio de Calculadoras para YouTube',
        keywords: ['todas las calculadoras youtube', 'directorio herramientas youtube', 'calculadoras de monetizacion'],
        priority: 0.9,
        changefreq: 'weekly',
      },
      {
        id: 'images-hub',
        slug: 'imagenes',
        name: 'Asistente de Imágenes para YouTube',
        route: '/imagenes',
        category: 'general',
        title: 'Asistente y Convertidor de Imágenes Online Gratis | 100% Local en tu Navegador',
        metaDescription: 'Convierte JPG a PNG, PNG a JPG, WebP, AVIF, comprime imágenes por KB, redimensiona para miniaturas y banners de YouTube y genera favicons sin subir archivos a servidores.',
        h1: 'Asistente de Imágenes y Convertidor Local para YouTube',
        keywords: ['convertir imagenes youtube', 'convertir jpg a png gratis', 'comprimir miniaturas youtube', 'redimensionar banner youtube'],
        priority: 0.9,
        changefreq: 'weekly',
      },
      {
        id: 'seo-hub',
        slug: 'seo',
        name: 'Suite de SEO para YouTube',
        route: '/seo',
        category: 'general',
        title: '🔎 Suite de SEO para YouTube | 23 Herramientas Gratuitas de Optimización Textual',
        metaDescription: 'Generador de palabras clave, fórmulas de títulos, plantillas de descripciones con capítulos, generador de tags y auditoría SEO en tu navegador.',
        h1: 'Suite de SEO y Optimización para YouTube',
        keywords: ['seo youtube', 'palabras clave youtube', 'titulos youtube', 'generador de tags youtube', 'auditoria seo youtube'],
        priority: 0.9,
        changefreq: 'weekly',
      },
      {
        id: 'guides-hub',
        slug: 'guias',
        name: 'Guías y Estrategias para Creadores',
        route: '/guias',
        category: 'general',
        title: 'Guías y Estrategias para Creadores de YouTube | YouTubeCalculador',
        metaDescription: 'Artículos y guías paso a paso sobre cómo aumentar tu RPM, optimizar miniaturas con alto CTR y cumplir los requisitos de monetización del YPP.',
        h1: 'Guías y Estrategias de Crecimiento para YouTube',
        keywords: ['guias youtube', 'como monetizar youtube', 'estrategias rpm youtube', 'consejos youtube studio'],
        priority: 0.8,
        changefreq: 'weekly',
      },
      {
        id: 'sobre-nosotros',
        slug: 'sobre-nosotros',
        name: 'Sobre Nosotros',
        route: '/sobre-nosotros',
        category: 'general',
        title: 'Sobre Nosotros | Misión y Filosofía de YouTubeCalculador',
        metaDescription: 'Conoce la misión de YouTubeCalculador: ofrecer herramientas analíticas, técnicas y de diseño 100% gratuitas, privadas y accesibles para creadores.',
        h1: 'Sobre YouTubeCalculador',
        keywords: ['sobre nosotros youtubecalculador', 'mision youtubecalculador'],
        priority: 0.5,
        changefreq: 'monthly',
      },
      {
        id: 'contacto',
        slug: 'contacto',
        name: 'Contacto y Soporte',
        route: '/contacto',
        category: 'general',
        title: 'Contacto y Sugerencias | YouTubeCalculador',
        metaDescription: 'Ponte en contacto con el equipo de YouTubeCalculador para dudas, sugerencias de nuevas herramientas o reportes de funcionalidad.',
        h1: 'Contacto y Sugerencias',
        keywords: ['contacto youtubecalculador', 'sugerir herramienta youtube'],
        priority: 0.5,
        changefreq: 'monthly',
      },
      {
        id: 'politica-privacidad',
        slug: 'politica-privacidad',
        name: 'Política de Privacidad',
        route: '/politica-privacidad',
        category: 'legal',
        title: 'Política de Privacidad | YouTubeCalculador',
        metaDescription: 'Política de privacidad y protección de datos anónima y 100% local de YouTubeCalculador.',
        h1: 'Política de Privacidad',
        keywords: ['privacidad youtubecalculador', 'proteccion de datos'],
        priority: 0.3,
        changefreq: 'yearly',
      },
      {
        id: 'politica-cookies',
        slug: 'politica-cookies',
        name: 'Política de Cookies',
        route: '/politica-cookies',
        category: 'legal',
        title: 'Política de Cookies | YouTubeCalculador',
        metaDescription: 'Información sobre cookies técnicas y preferencias de analítica en YouTubeCalculador.',
        h1: 'Política de Cookies',
        keywords: ['cookies youtubecalculador'],
        priority: 0.3,
        changefreq: 'yearly',
      },
      {
        id: 'terminos',
        slug: 'terminos',
        name: 'Términos y Condiciones',
        route: '/terminos',
        category: 'legal',
        title: 'Términos y Condiciones de Uso | YouTubeCalculador',
        metaDescription: 'Términos de servicio y condiciones generales de uso de las herramientas y calculadoras de YouTubeCalculador.',
        h1: 'Términos y Condiciones',
        keywords: ['terminos de servicio youtubecalculador'],
        priority: 0.3,
        changefreq: 'yearly',
      },
      {
        id: 'admin-dashboard',
        slug: 'admin',
        name: 'Panel Administrativo',
        route: '/admin',
        category: 'general',
        title: 'Panel Administrativo | YouTubeCalculador',
        metaDescription: 'Dashboard de métricas, telemetría y configuración del sistema.',
        h1: 'Panel de Administración',
        keywords: [],
        priority: 0.0,
        changefreq: 'daily',
        indexable: false,
        robots: 'noindex, nofollow',
      },
    ];

    for (const page of staticPages) {
      registered.push({
        id: page.id,
        slug: page.slug,
        name: page.name,
        category: page.category,
        route: page.route,
        canonicalUrl: getAbsoluteUrl(page.route, siteUrl),
        kind: 'static',
        h1: page.h1,
        shortDescription: page.metaDescription,
        published: true,
        indexable: page.indexable ?? true,
        robots: page.robots || (page.indexable === false ? 'noindex, nofollow' : 'index, follow'),
        priority: page.priority,
        changefreq: page.changefreq,
        lastModified: today,
        seo: {
          title: page.title,
          metaDescription: page.metaDescription,
          h1: page.h1,
          keywords: page.keywords,
          ogType: 'website',
        },
      });
    }

    // 2. Standard Calculators (Category 1, 2, 3) -> Canonical route: /${calc.slug}
    for (const calc of CALCULATORS) {
      const route = `/${calc.slug}`;
      registered.push({
        id: calc.id,
        slug: calc.slug,
        name: calc.name,
        category: calc.category,
        subcategory: calc.subcategory,
        route,
        canonicalUrl: getAbsoluteUrl(route, siteUrl),
        kind: 'calculator',
        h1: calc.seo.h1 || calc.name,
        tagline: calc.tagline,
        shortDescription: calc.shortDescription,
        iconName: calc.iconName,
        published: true,
        indexable: true,
        robots: 'index, follow',
        priority: 0.9,
        changefreq: 'weekly',
        lastModified: today,
        seo: {
          title: calc.seo.title,
          metaDescription: calc.seo.metaDescription,
          h1: calc.seo.h1 || calc.name,
          keywords: calc.seo.keywords || [],
          summary: calc.seo.summary,
          faqs: calc.seo.faqs,
          howToSteps: calc.seo.howToSteps,
          ogType: 'website',
        },
      });
    }

    // 3. Image Assistant Tools (Category 4) -> Canonical route: /imagenes/${tool.slug}
    for (const imgTool of IMAGE_TOOLS) {
      const route = `/imagenes/${imgTool.slug}`;
      registered.push({
        id: imgTool.id,
        slug: imgTool.slug,
        name: imgTool.name,
        category: 'imagenes',
        route,
        canonicalUrl: getAbsoluteUrl(route, siteUrl),
        kind: 'image',
        h1: imgTool.seo.h1 || imgTool.name,
        tagline: imgTool.tagline,
        shortDescription: imgTool.shortDescription,
        iconName: imgTool.iconName,
        published: true,
        indexable: true,
        robots: 'index, follow',
        priority: 0.85,
        changefreq: 'weekly',
        lastModified: today,
        seo: {
          title: imgTool.seo.title,
          metaDescription: imgTool.seo.metaDescription,
          h1: imgTool.seo.h1 || imgTool.name,
          keywords: imgTool.seo.keywords || [],
          summary: imgTool.seo.summary,
          faqs: imgTool.seo.faqs,
          howToSteps: imgTool.seo.howToSteps,
          ogType: 'article',
        },
      });
    }

    // 4. SEO Suite Tools (Category 5) -> Canonical route: /seo/${tool.slug}
    for (const seoTool of SEO_TOOLS) {
      const route = `/seo/${seoTool.slug}`;
      registered.push({
        id: seoTool.id,
        slug: seoTool.slug,
        name: seoTool.name,
        category: 'seo',
        subcategory: seoTool.subcategory,
        route,
        canonicalUrl: getAbsoluteUrl(route, siteUrl),
        kind: 'seo',
        h1: seoTool.seo.h1 || seoTool.name,
        tagline: seoTool.tagline,
        shortDescription: seoTool.shortDescription,
        iconName: seoTool.iconName,
        published: true,
        indexable: true,
        robots: 'index, follow',
        priority: 0.85,
        changefreq: 'weekly',
        lastModified: today,
        seo: {
          title: seoTool.seo.title,
          metaDescription: seoTool.seo.metaDescription,
          h1: seoTool.seo.h1 || seoTool.name,
          keywords: seoTool.seo.keywords || [],
          summary: seoTool.seo.summary,
          faqs: seoTool.seo.faqs,
          howToSteps: seoTool.seo.howToSteps,
          ogType: 'article',
        },
      });
    }

    // 5. Creator Guides -> Canonical route: /guias/${guide.slug}
    for (const guide of GUIDES) {
      const route = `/guias/${guide.slug}`;
      registered.push({
        id: guide.id,
        slug: guide.slug,
        name: guide.title,
        category: 'guia',
        route,
        canonicalUrl: getAbsoluteUrl(route, siteUrl),
        kind: 'guide',
        h1: guide.title,
        shortDescription: guide.summary,
        published: true,
        indexable: true,
        robots: 'index, follow',
        priority: 0.7,
        changefreq: 'monthly',
        lastModified: guide.date || today,
        seo: {
          title: `${guide.title} | Guías para Creadores`,
          metaDescription: guide.summary,
          h1: guide.title,
          keywords: ['guia youtube', guide.category, 'estrategia creador youtube'],
          ogType: 'article',
        },
      });
    }

    // Append any dynamically registered custom tools
    return [...registered, ...this.customTools];
  }

  /**
   * Syncs real image tools and overrides stored in Turso database.
   */
  public async syncFromDatabase(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/api/admin/image-tools');
      if (res.ok) {
        const data = await res.json();
        if (data.tools && Array.isArray(data.tools)) {
          const siteUrl = getSiteUrl();
          for (const dbTool of data.tools) {
            const existing = this.buildRegistry().find((t) => t.id === dbTool.id);
            if (existing) {
              const updated: RegisteredTool = {
                ...existing,
                name: dbTool.name || existing.name,
                category: dbTool.category || existing.category,
                route: dbTool.route || existing.route,
                canonicalUrl: getAbsoluteUrl(dbTool.route || existing.route, siteUrl),
                h1: dbTool.h1 || existing.h1,
                published: dbTool.status === 'active',
                indexable: Boolean(dbTool.indexable),
                robots: dbTool.indexable ? 'index, follow' : 'noindex, nofollow',
                seo: {
                  ...existing.seo,
                  title: dbTool.seoTitle || existing.seo.title,
                  h1: dbTool.h1 || existing.seo.h1,
                  metaDescription: dbTool.metaDescription || existing.seo.metaDescription,
                },
              };
              this.register(updated);
            }
          }
        }
      }
    } catch {
      // Offline fallback
    }
  }

  /**
   * Registers a new custom tool dynamically into the registry.
   */
  public register(tool: RegisteredTool): void {
    const existingIndex = this.customTools.findIndex((t) => t.id === tool.id);
    if (existingIndex >= 0) {
      this.customTools[existingIndex] = tool;
    } else {
      this.customTools.push(tool);
    }
  }

  /**
   * Updates a tool's route and creates an automatic 301 redirect from the old route to the new route.
   */
  public updateRoute(toolId: string, newRoute: string): void {
    const cleanNewRoute = newRoute.startsWith('/') ? newRoute : `/${newRoute}`;
    const all = this.getAll();
    const existing = all.find((t) => t.id === toolId);
    if (!existing) return;

    const oldRoute = existing.route;
    if (oldRoute === cleanNewRoute) return;

    // Register 301 redirect
    this.redirects.set(oldRoute, cleanNewRoute);

    const siteUrl = getSiteUrl();
    const updated: RegisteredTool = {
      ...existing,
      route: cleanNewRoute,
      canonicalUrl: getAbsoluteUrl(cleanNewRoute, siteUrl),
    };

    this.register(updated);
  }

  /**
   * Checks if an old route has a registered 301 redirection.
   */
  public getRedirectForRoute(pathname: string): string | undefined {
    const clean = pathname.split('?')[0].replace(/\/+$/, '') || '/';
    return this.redirects.get(clean);
  }

  /**
   * Returns all active 301 redirects.
   */
  public getAllRedirects(): Array<{ from: string; to: string }> {
    const list: Array<{ from: string; to: string }> = [];
    this.redirects.forEach((to, from) => {
      list.push({ from, to });
    });
    return list;
  }

  /**
   * Returns all tools and pages currently known to the registry.
   */
  public getAll(): RegisteredTool[] {
    return this.buildRegistry();
  }

  /**
   * Returns only tools that are published, indexable, and possess a valid route.
   */
  public getIndexable(): RegisteredTool[] {
    return this.getAll().filter(
      (tool) => tool.published && tool.indexable && tool.route && tool.route.startsWith('/')
    );
  }

  /**
   * Locates a registered tool by its route (e.g. '/imagenes/convertir-jpg-a-png' or '/calculadora-rpm-youtube').
   */
  public getByRoute(pathname: string): RegisteredTool | undefined {
    const clean = pathname.split('?')[0].replace(/\/+$/, '') || '/';
    return this.getAll().find((tool) => {
      const toolClean = tool.route.replace(/\/+$/, '') || '/';
      return toolClean === clean;
    });
  }

  /**
   * Locates a registered tool by its slug across any category.
   */
  public getBySlug(slug: string): RegisteredTool | undefined {
    if (!slug) return undefined;
    return this.getAll().find((tool) => tool.slug === slug);
  }

  /**
   * Locates a registered tool by its ID.
   */
  public getById(id: string): RegisteredTool | undefined {
    if (!id) return undefined;
    return this.getAll().find((tool) => tool.id === id);
  }

  /**
   * Generates dynamic, complete SEO metadata for any route.
   */
  public getMetadataForRoute(pathname: string): RouteMetadata {
    const tool = this.getByRoute(pathname);
    const siteUrl = getSiteUrl();
    const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/';
    const canonical = getAbsoluteUrl(cleanPath, siteUrl);

    if (tool) {
      const titleWithBrand = tool.seo.title.includes('YouTubeCalculador')
        ? tool.seo.title
        : `${tool.seo.title} | YouTubeCalculador`;

      return {
        title: titleWithBrand,
        metaDescription: tool.seo.metaDescription,
        h1: tool.seo.h1 || tool.h1 || tool.name,
        canonical: tool.canonicalUrl || canonical,
        robots: tool.robots,
        openGraph: {
          title: titleWithBrand,
          description: tool.seo.metaDescription,
          url: tool.canonicalUrl || canonical,
          type: tool.seo.ogType || 'website',
          siteName: 'YouTubeCalculador',
          locale: 'es_ES',
          image: tool.seo.ogImage || `${siteUrl}/icon.png`,
        },
        twitter: {
          card: 'summary_large_image',
          title: titleWithBrand,
          description: tool.seo.metaDescription,
          image: tool.seo.ogImage || `${siteUrl}/icon.png`,
        },
        faqs: tool.seo.faqs,
        howToSteps: tool.seo.howToSteps,
        toolName: tool.name,
      };
    }

    // Default fallback metadata
    const defaultTitle = 'Calculadoras y Herramientas Gratuitas para YouTube | YouTubeCalculador';
    const defaultDesc = 'Calcula tus ingresos, RPM, CPM, CTR, horas de reproducción y optimiza tu canal de YouTube gratis y sin registro.';

    return {
      title: defaultTitle,
      metaDescription: defaultDesc,
      h1: 'Herramientas Gratuitas para Creadores de YouTube',
      canonical,
      robots: 'index, follow',
      openGraph: {
        title: defaultTitle,
        description: defaultDesc,
        url: canonical,
        type: 'website',
        siteName: 'YouTubeCalculador',
        locale: 'es_ES',
        image: `${siteUrl}/icon.png`,
      },
      twitter: {
        card: 'summary_large_image',
        title: defaultTitle,
        description: defaultDesc,
        image: `${siteUrl}/icon.png`,
      },
    };
  }

  /**
   * Generates a valid standard XML sitemap dynamically from all indexable tools in the registry.
   */
  public generateSitemapXml(baseUrl?: string): string {
    const siteUrl = (baseUrl || getSiteUrl()).replace(/\/+$/, '');
    const indexableItems = this.getIndexable();

    const urlsXml = indexableItems
      .map((item) => {
        const loc = item.canonicalUrl.startsWith('http')
          ? item.canonicalUrl
          : `${siteUrl}${item.route}`;
        const lastmod = item.lastModified || new Date().toISOString().split('T')[0];
        const changefreq = item.changefreq || 'weekly';
        const priority = item.priority.toFixed(1);

        return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlsXml}
</urlset>`;
  }

  /**
   * Generates standard robots.txt permitting public pages and blocking admin/API routes.
   */
  public generateRobotsTxt(baseUrl?: string): string {
    const siteUrl = (baseUrl || getSiteUrl()).replace(/\/+$/, '');
    return `# Robots.txt for YouTubeCalculador
# https://youtubecalculador.online

User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

# Sitemap Location
Sitemap: ${siteUrl}/sitemap.xml
`;
  }
}

export const ToolRegistry = new ToolRegistryService();
