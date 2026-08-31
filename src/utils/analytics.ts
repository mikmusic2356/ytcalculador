/**
 * Analytics Engine for Tool Interaction Tracking
 * Measures tool usage, calculation volume, and creator interactions anonymously.
 */

export type AnalyticsEventType =
  | 'tool_viewed'
  | 'calculation_started'
  | 'calculation_completed'
  | 'new_calculation'
  | 'related_tool_clicked'
  | 'comparison_completed'
  | 'projection_generated'
  | 'conversion_completed'
  | 'unit_changed'
  | 'aspect_ratio_selected'
  | 'guide_viewed'
  | 'image_uploaded'
  | 'conversion_started'
  | 'image_downloaded'
  | 'compression_completed'
  | 'resize_completed'
  | 'crop_completed'
  | 'metadata_removed'
  | 'favicon_generated'
  | 'keyword_generated'
  | 'title_analyzed'
  | 'description_generated'
  | 'tags_generated'
  | 'hashtags_generated'
  | 'seo_analysis_completed'
  | 'copy_button_clicked';

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  tool_name: string;
  category?: string;
  timestamp: number;
  metadata?: Record<string, string | number | boolean>;
}

class ToolAnalyticsService {
  private eventLog: AnalyticsEvent[] = [];
  private readonly STORAGE_KEY = 'ytcalc_analytics_events';
  private readonly MAX_EVENTS = 200;

  constructor() {
    this.loadPersistedEvents();
  }

  private loadPersistedEvents(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.eventLog = JSON.parse(stored);
      }
    } catch {
      this.eventLog = [];
    }
  }

  private persistEvents(): void {
    try {
      // Keep only recent events to avoid storage bloat
      if (this.eventLog.length > this.MAX_EVENTS) {
        this.eventLog = this.eventLog.slice(-this.MAX_EVENTS);
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.eventLog));
    } catch {
      // ignore
    }
  }

  /**
   * Track an analytics event
   */
  public track(
    type: AnalyticsEventType,
    toolName: string,
    category?: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    const event: AnalyticsEvent = {
      type,
      tool_name: toolName,
      category,
      timestamp: Date.now(),
      metadata,
    };

    this.eventLog.push(event);
    this.persistEvents();

    // Notify window.dataLayer if Google Analytics / GTM is initialized
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: `ytcalc_${type}`,
        tool_name: toolName,
        category,
        ...metadata,
      });
    }

    // Custom browser event for internal reactive components (like Admin Dashboard)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('ytcalc_analytics_update', { detail: event })
      );
    }
  }

  /**
   * Get aggregated telemetry stats
   */
  public getAggregatedStats(): {
    totalCalculations: number;
    popularTools: Array<{ tool_name: string; count: number }>;
    recentEvents: AnalyticsEvent[];
  } {
    const calculationEvents = this.eventLog.filter((e) => e.type === 'calculation_completed');
    const toolCounts: Record<string, number> = {};

    this.eventLog.forEach((e) => {
      toolCounts[e.tool_name] = (toolCounts[e.tool_name] || 0) + 1;
    });

    const popularTools = Object.entries(toolCounts)
      .map(([tool_name, count]) => ({ tool_name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalCalculations: calculationEvents.length,
      popularTools,
      recentEvents: this.eventLog.slice(-20).reverse(),
    };
  }

  /**
   * Helper specifically for tool page load
   */
  public trackToolViewed(toolName: string, category?: string): void {
    this.track('tool_viewed', toolName, category);
  }

  /**
   * Helper for calculation initiation
   */
  public trackCalculationStarted(toolName: string, category?: string): void {
    this.track('calculation_started', toolName, category);
  }

  /**
   * Helper for successful calculation completion
   */
  public trackCalculationCompleted(
    toolName: string,
    category?: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('calculation_completed', toolName, category, metadata);
  }

  /**
   * Helper for comparison tools completion
   */
  public trackComparisonCompleted(
    toolName: string,
    category?: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('comparison_completed', toolName, category, metadata);
  }

  /**
   * Helper for projection generated
   */
  public trackProjectionGenerated(
    toolName: string,
    category?: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('projection_generated', toolName, category, metadata);
  }

  /**
   * Helper for conversion tool completed
   */
  public trackConversionCompleted(
    toolName: string,
    category?: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('conversion_completed', toolName, category, metadata);
  }

  /**
   * Helper for unit changes
   */
  public trackUnitChanged(
    toolName: string,
    category?: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('unit_changed', toolName, category, metadata);
  }

  /**
   * Helper for aspect ratio selection
   */
  public trackAspectRatioSelected(
    toolName: string,
    category?: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('aspect_ratio_selected', toolName, category, metadata);
  }

  /**
   * Helper for image uploads
   */
  public trackImageUploaded(
    toolName: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('image_uploaded', toolName, 'imagenes', metadata);
  }

  /**
   * Helper for image downloads
   */
  public trackImageDownloaded(
    toolName: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('image_downloaded', toolName, 'imagenes', metadata);
  }

  /**
   * Helper for image compression
   */
  public trackCompressionCompleted(
    toolName: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('compression_completed', toolName, 'imagenes', metadata);
  }

  /**
   * Helper for image resize
   */
  public trackResizeCompleted(
    toolName: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('resize_completed', toolName, 'imagenes', metadata);
  }

  /**
   * Helper for image crop
   */
  public trackCropCompleted(
    toolName: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('crop_completed', toolName, 'imagenes', metadata);
  }

  /**
   * Helper for metadata removal
   */
  public trackMetadataRemoved(
    toolName: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('metadata_removed', toolName, 'imagenes', metadata);
  }

  /**
   * Helper for favicon generation
   */
  public trackFaviconGenerated(
    toolName: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('favicon_generated', toolName, 'imagenes', metadata);
  }

  /**
   * Helper for SEO Keyword generation
   */
  public trackKeywordGenerated(
    toolName: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('keyword_generated', toolName, 'seo', metadata);
  }

  /**
   * Helper for Title analysis
   */
  public trackTitleAnalyzed(
    toolName: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('title_analyzed', toolName, 'seo', metadata);
  }

  /**
   * Helper for Description generation
   */
  public trackDescriptionGenerated(
    toolName: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('description_generated', toolName, 'seo', metadata);
  }

  /**
   * Helper for Tags generation
   */
  public trackTagsGenerated(
    toolName: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('tags_generated', toolName, 'seo', metadata);
  }

  /**
   * Helper for Hashtags generation
   */
  public trackHashtagsGenerated(
    toolName: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('hashtags_generated', toolName, 'seo', metadata);
  }

  /**
   * Helper for complete SEO analysis
   */
  public trackSeoAnalysisCompleted(
    toolName: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('seo_analysis_completed', toolName, 'seo', metadata);
  }

  /**
   * Helper for copy button clicks
   */
  public trackCopyButtonClicked(
    toolName: string,
    metadata?: Record<string, string | number | boolean>
  ): void {
    this.track('copy_button_clicked', toolName, 'seo', metadata);
  }

  /**
   * Helper for reset / new calculation button
   */
  public trackNewCalculation(toolName: string, category?: string): void {
    this.track('new_calculation', toolName, category);
  }

  /**
   * Helper for clicking a related tool
   */
  public trackRelatedToolClicked(toolName: string, targetSlug: string): void {
    this.track('related_tool_clicked', toolName, undefined, { targetSlug });
  }
}

export const analytics = new ToolAnalyticsService();
