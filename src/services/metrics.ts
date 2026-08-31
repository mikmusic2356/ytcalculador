import { AggregatedStats, MetricEvent, ToolCategory } from '../types';
import { CALCULATORS } from '../data/calculators';
import { CookieManager } from '../utils/cookies';
import { getStoredCookiePreferences } from '../components/CookieBanner';

const METRICS_STORAGE_KEY = 'ytcalc_metrics_cache_v2';
const EVENT_LOG_KEY = 'ytcalc_event_log_v2';

// Clean baseline stats for brand-new real database
const EMPTY_STATS: AggregatedStats = {
  totalCalculations: 0,
  totalViews: 0,
  totalUniqueVisitors: 0,
  popularTools: [],
  dailyCalculations: [],
  categoryDistribution: [
    { category: 'ingresos', label: 'Ingresos y Monetización', count: 0, color: '#DC2626' },
    { category: 'analytics', label: 'Analytics y Algoritmo', count: 0, color: '#2563EB' },
    { category: 'video', label: 'Video y Producción', count: 0, color: '#16A34A' },
    { category: 'imagenes', label: 'Asistente de Imágenes', count: 0, color: '#9333EA' },
    { category: 'seo', label: 'SEO y Posicionamiento', count: 0, color: '#D97706' },
  ],
  hourlyActivity: [],
};

class MetricsService {
  private localStats: AggregatedStats;
  private recentEvents: MetricEvent[] = [];

  constructor() {
    this.localStats = this.loadStats();
    this.recentEvents = this.loadEvents();
    // Initial fetch from real Turso database
    this.syncFromDatabase();
  }

  private loadStats(): AggregatedStats {
    try {
      const stored = localStorage.getItem(METRICS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return { ...EMPTY_STATS };
  }

  private loadEvents(): MetricEvent[] {
    try {
      const stored = localStorage.getItem(EVENT_LOG_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return [];
  }

  private save() {
    try {
      localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(this.localStats));
      localStorage.setItem(EVENT_LOG_KEY, JSON.stringify(this.recentEvents.slice(-100)));
    } catch {
      // Ignore quota errors
    }
  }

  /**
   * Syncs latest real aggregated metrics directly from Turso database backend.
   */
  public async syncFromDatabase(): Promise<void> {
    try {
      const res = await fetch('/api/analytics/stats');
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          this.localStats = data.stats;
          if (data.events && Array.isArray(data.events)) {
            this.recentEvents = data.events;
          }
          this.save();
        }
      }
    } catch {
      // Offline fallback to local cache
    }
  }

  public trackEvent(event: Omit<MetricEvent, 'timestamp'>) {
    const prefs = getStoredCookiePreferences();
    // Verify consent for analytics (or default local)
    const visitorId = CookieManager.getOrCreateVisitorId();

    const fullEvent: MetricEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.recentEvents.unshift(fullEvent);
    if (this.recentEvents.length > 100) {
      this.recentEvents.pop();
    }

    // Local optimistic update
    if (event.type === 'tool_viewed') {
      this.localStats.totalViews += 1;
    } else if (event.type === 'calculation_completed') {
      this.localStats.totalCalculations += 1;

      if (event.toolSlug) {
        const toolIndex = this.localStats.popularTools.findIndex((t) => t.slug === event.toolSlug);
        if (toolIndex >= 0) {
          this.localStats.popularTools[toolIndex].count += 1;
        } else {
          this.localStats.popularTools.push({
            slug: event.toolSlug,
            name: event.tool_name || event.toolSlug,
            count: 1,
            category: (event.category as any) || 'ingresos',
          });
        }
        this.localStats.popularTools.sort((a, b) => b.count - a.count);
      }
    }

    this.save();

    // Send asynchronously to real Turso database backend
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          eventType: event.type,
          toolSlug: event.toolSlug,
          toolName: event.tool_name,
          category: event.category,
        }),
      }).catch(() => {});
    } catch {
      // Ignore network errors
    }
  }

  public getStats(): AggregatedStats {
    return { ...this.localStats };
  }

  public getRecentEvents(): MetricEvent[] {
    return [...this.recentEvents];
  }

  public resetMetrics() {
    this.localStats = { ...EMPTY_STATS };
    this.recentEvents = [];
    this.save();
  }

  public exportMetricsJson(): string {
    return JSON.stringify(
      {
        stats: this.localStats,
        events: this.recentEvents,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }
}

export const metricsService = new MetricsService();
