export type ToolCategory = 'ingresos' | 'analytics' | 'video' | 'imagenes' | 'seo';

export type IncomeSubcategory = 'publicidad' | 'objetivos' | 'shorts' | 'comparacion';
export type AnalyticsSubcategory = 'rendimiento' | 'audiencia' | 'crecimiento' | 'comparacion';
export type VideoSubcategory = 'video' | 'resolucion' | 'almacenamiento' | 'fps_tiempo';
export type ImageSubcategory = 'conversion' | 'optimizacion' | 'dimensiones' | 'utilidades';
export type SeoSubcategory =
  | 'keywords'
  | 'titulos'
  | 'descripciones'
  | 'hashtags'
  | 'tags'
  | 'asistente'
  | 'limpieza';

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
  count?: number;
  subcategories?: Array<{
    id: IncomeSubcategory | AnalyticsSubcategory | VideoSubcategory | ImageSubcategory | SeoSubcategory | string;
    name: string;
    description: string;
    icon: string;
  }>;
}

export type FieldType = 'number' | 'select' | 'slider' | 'duration' | 'currency';

export interface FieldOption {
  label: string;
  value: string | number;
  description?: string;
}

export interface CalculatorField {
  id: string;
  label: string;
  type: FieldType;
  defaultValue: number | string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
  tooltip?: string;
  options?: FieldOption[];
  suffix?: string;
  prefix?: string;
}

export interface MetricCard {
  label: string;
  value: string;
  subValue?: string;
  badge?: string;
  isPositive?: boolean;
  highlight?: boolean;
}

export interface CalculationResult {
  primaryValue: string;
  primaryLabel: string;
  secondaryMetrics: MetricCard[];
  formulaExplanation: string;
  benchmarkText?: string;
  benchmarkStatus?: 'optimal' | 'average' | 'needs-work' | 'info';
  recommendations: string[];
  breakdownData?: Array<{ name: string; value: number; [key: string]: string | number }>;
  rawOutput?: Record<string, any>;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CalculatorConfig {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  category: ToolCategory;
  subcategory?: IncomeSubcategory | string;
  iconName: string;
  popularRank?: number;
  badge?: string;
  fields: CalculatorField[];
  presets?: Array<{ label: string; values: Record<string, number | string> }>;
  calculate: (inputs: Record<string, any>) => CalculationResult;
  // SEO & Editorial Content
  seo: {
    title: string;
    metaDescription: string;
    h1: string;
    keywords: string[];
    summary: string;
    formulaMarkdown: string;
    howToSteps: string[];
    tipsToImprove: string[];
    faqs: FAQItem[];
  };
  relatedSlugs: string[];
}

export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  category: ToolCategory;
  readTime: string;
  summary: string;
  author: string;
  date: string;
  featured?: boolean;
  content: string;
  relatedToolSlugs: string[];
}

export interface MetricEvent {
  type:
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
  toolSlug?: string;
  tool_name?: string;
  category?: string;
  timestamp: number;
}

export interface SeoToolConfig {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  subcategory: SeoSubcategory;
  iconName: string;
  popularRank?: number;
  badge?: string;
  seo: {
    title: string;
    metaDescription: string;
    h1: string;
    keywords: string[];
    summary: string;
    howToSteps: string[];
    comparisonPoints?: Array<{ title: string; desc: string }>;
    tipsToImprove: string[];
    faqs: FAQItem[];
  };
  relatedSlugs: string[];
}

export interface AggregatedStats {
  totalCalculations: number;
  totalViews: number;
  totalUniqueVisitors: number;
  popularTools: Array<{ slug: string; name: string; count: number; category: ToolCategory }>;
  dailyCalculations: Array<{ date: string; calculations: number; views: number }>;
  categoryDistribution: Array<{ category: ToolCategory; label: string; count: number; color: string }>;
  hourlyActivity: Array<{ hour: string; count: number }>;
}

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
  saved: boolean;
}
