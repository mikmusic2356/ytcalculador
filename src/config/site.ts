/**
 * Global Site Configuration for YouTubeCalculador
 * Handles environment-aware URL resolution for canonicals, Open Graph, sitemaps, and robots.txt.
 * 
 * In development: Uses http://localhost:3000 or current browser origin.
 * In production: Uses https://youtubecalculador.online.
 * No components should hardcode domain strings.
 */

export const DEFAULT_PRODUCTION_URL = 'https://youtubecalculador.online';

/**
 * Resolves the active base URL of the site depending on runtime environment.
 */
export function getSiteUrl(): string {
  // 1. Server-side environment variable (Node / Cloud Run / SSR)
  if (typeof process !== 'undefined' && process.env?.SITE_URL) {
    return process.env.SITE_URL.trim().replace(/\/+$/, '');
  }

  // 2. Vite client-side environment variable
  try {
    const meta = import.meta as unknown as { env?: Record<string, string> };
    if (typeof meta !== 'undefined' && meta.env?.VITE_SITE_URL) {
      return meta.env.VITE_SITE_URL.trim().replace(/\/+$/, '');
    }
  } catch {
    // Ignore in non-Vite environments
  }

  // 3. Browser runtime origin detection (for localhost development)
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.');

    if (isLocalhost) {
      return `${window.location.protocol}//${window.location.host}`.replace(/\/+$/, '');
    }
  }

  // 4. Server-side development check
  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    return 'http://localhost:3000';
  }

  // 5. Canonical production domain
  return DEFAULT_PRODUCTION_URL;
}

export const SITE_URL = getSiteUrl();

/**
 * Generates an absolute URL given a route path (e.g. '/imagenes/convertir-jpg-a-png').
 */
export function getAbsoluteUrl(path: string, baseUrl?: string): string {
  const base = (baseUrl || getSiteUrl()).replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
