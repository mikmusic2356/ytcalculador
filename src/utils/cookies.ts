/**
 * Cookie Management Utility for YouTubeCalculador
 * Compliant with RGPD / ePrivacy / CCPA
 */

export interface CookieOptions {
  days?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export const CookieManager = {
  /**
   * Sets a cookie with specified name, value, and options.
   */
  set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof document === 'undefined') return;

    const days = options.days ?? 365;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

    const expires = `; expires=${date.toUTCString()}`;
    const path = options.path || '; path=/';
    const sameSite = options.sameSite ? `; SameSite=${options.sameSite}` : '; SameSite=Lax';
    const secure = options.secure || (typeof window !== 'undefined' && window.location.protocol === 'https:') ? '; Secure' : '';
    const domain = options.domain ? `; domain=${options.domain}` : '';

    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}${path}${domain}${sameSite}${secure}`;
  },

  /**
   * Retrieves a cookie value by name.
   */
  get(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const nameEQ = `${encodeURIComponent(name)}=`;
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  },

  /**
   * Deletes a cookie by name.
   */
  delete(name: string, path: string = '/'): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Lax`;
  },

  /**
   * Generates or retrieves a unique persistent Anonymous Visitor ID for real database analytics.
   */
  getOrCreateVisitorId(): string {
    const COOKIE_NAME = 'ytcalc_visitor_id';
    let visitorId = this.get(COOKIE_NAME);

    if (!visitorId) {
      // Generate a crypto-random anonymous ID
      visitorId = 'v_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
      this.set(COOKIE_NAME, visitorId, { days: 365 });
    }

    return visitorId;
  },
};
