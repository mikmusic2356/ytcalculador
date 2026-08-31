import { CategoryInfo, CalculatorConfig } from '../types';
import { ADVERTISING_CALCULATORS } from './calculators/advertising';
import { GOALS_CALCULATORS } from './calculators/goals';
import { SHORTS_CALCULATORS } from './calculators/shorts';
import { COMPARISON_CALCULATORS } from './calculators/comparison';
import { ANALYTICS_PERFORMANCE_CALCULATORS } from './calculators/analyticsPerformance';
import { ANALYTICS_AUDIENCE_CALCULATORS } from './calculators/analyticsAudience';
import { ANALYTICS_GROWTH_CALCULATORS } from './calculators/analyticsGrowth';
import { ANALYTICS_COMPARISON_CALCULATORS } from './calculators/analyticsComparison';
import { VIDEO_CALCULATORS } from './calculators/video';
import { SEO_SUBCATEGORIES_CONFIG, SEO_TOOLS } from './seoToolsData';

export const INCOME_SUBCATEGORIES = [
  {
    id: 'publicidad',
    name: 'Ingresos por publicidad',
    shortName: 'Publicidad',
    emoji: '📊',
    description: 'Calculadoras de ganancias de AdSense, RPM, CPM, ingresos mensuales y anuales.',
    icon: 'BarChart3',
  },
  {
    id: 'objetivos',
    name: 'Objetivos de ingresos',
    shortName: 'Objetivos',
    emoji: '🎯',
    description: '¿Cuántas vistas necesitas para ganar $100, $500, $1.000 o tu meta personalizada?',
    icon: 'Target',
  },
  {
    id: 'shorts',
    name: 'YouTube Shorts',
    shortName: 'Shorts',
    emoji: '📱',
    description: 'Calculadoras de ganancias y reproducciones necesarias para monetizar YouTube Shorts.',
    icon: 'Zap',
  },
  {
    id: 'comparacion',
    name: 'Comparación de ingresos',
    shortName: 'Comparación',
    emoji: '🌎',
    description: 'Comparador de RPM por países, escalones de vistas y Videos Largos vs Shorts.',
    icon: 'Globe',
  },
] as const;

export const ANALYTICS_SUBCATEGORIES = [
  {
    id: 'rendimiento',
    name: 'Rendimiento',
    shortName: 'Rendimiento',
    emoji: '👀',
    description: 'CTR, retención de audiencia, duración media de visualización, Watch Time, vistas por hora y porcentaje visto.',
    icon: 'Activity',
  },
  {
    id: 'audiencia',
    name: 'Audiencia y suscriptores',
    shortName: 'Audiencia',
    emoji: '👥',
    description: 'Conversión a suscriptores, subs por 1.000 vistas, vistas necesarias para subs y crecimiento de comunidad.',
    icon: 'Users',
  },
  {
    id: 'crecimiento',
    name: 'Crecimiento',
    shortName: 'Crecimiento',
    emoji: '📈',
    description: 'Calculadora de crecimiento porcentual, proyecciones de vistas, suscriptores y simulación integral de canal.',
    icon: 'TrendingUp',
  },
  {
    id: 'comparacion',
    name: 'Comparación',
    shortName: 'Comparación',
    emoji: '⚖️',
    description: 'Comparador de Videos (A vs B), comparador de períodos (Mes 1 vs Mes 2) y analizador de métricas globales.',
    icon: 'Columns',
  },
] as const;

export const VIDEO_SUBCATEGORIES = [
  {
    id: 'video',
    name: 'Video',
    shortName: 'Video',
    emoji: '🎥',
    description: 'Calculadora de bitrate, tamaño de archivo, duración de video, FPS, frames y compresión.',
    icon: 'Film',
  },
  {
    id: 'resolucion',
    name: 'Resolución y proporciones',
    shortName: 'Resolución',
    emoji: '📐',
    description: 'Calculadora de relación de aspecto, 16:9, 9:16 (Shorts), 4:3, escalado y verificación de dimensiones.',
    icon: 'Maximize',
  },
  {
    id: 'almacenamiento',
    name: 'Almacenamiento',
    shortName: 'Almacenamiento',
    emoji: '💾',
    description: 'Espacio necesario en disco, tiempo de grabación en tarjeta SD, almacenamiento para videos y tamaño por bitrate.',
    icon: 'HardDrive',
  },
  {
    id: 'fps_tiempo',
    name: 'FPS y tiempo',
    shortName: 'FPS y Tiempo',
    emoji: '🎞️',
    description: 'Duración según frames, conversor y comparador de FPS y conversor de tiempo para edición (Timecode SMPTE).',
    icon: 'Clock',
  },
] as const;

export const IMAGE_SUBCATEGORIES = [
  {
    id: 'conversion',
    name: 'Conversión de Formatos',
    shortName: 'Conversión',
    emoji: '🔄',
    description: 'Convertidor JPG, PNG, WebP, AVIF, SVG, HEIC y BMP con procesamiento 100% local.',
    icon: 'RefreshCw',
  },
  {
    id: 'optimizacion',
    name: 'Compresión y Web',
    shortName: 'Optimización',
    emoji: '🗜️',
    description: 'Comprime imágenes, reduce peso en KB/MB, optimiza para SEO y Core Web Vitals.',
    icon: 'Minimize2',
  },
  {
    id: 'dimensiones',
    name: 'Redimensionar y Recortar',
    shortName: 'Dimensiones',
    emoji: '📐',
    description: 'Recorta a 16:9, 9:16 Shorts, 1:1 y redimensiona por píxeles o porcentaje.',
    icon: 'Scaling',
  },
  {
    id: 'utilidades',
    name: 'Metadatos y Favicon',
    shortName: 'Utilidades',
    emoji: '🌟',
    description: 'Elimina metadatos EXIF/GPS para privacidad y genera favicons multicapa y paquetes PWA.',
    icon: 'Globe',
  },
] as const;

export const SEO_SUBCATEGORIES = SEO_SUBCATEGORIES_CONFIG;

export const CALCULATORS: CalculatorConfig[] = [
  // 💰 Dinero e Ingresos
  ...ADVERTISING_CALCULATORS,
  ...GOALS_CALCULATORS,
  ...SHORTS_CALCULATORS,
  ...COMPARISON_CALCULATORS,

  // 📊 Analytics de YouTube
  ...ANALYTICS_PERFORMANCE_CALCULATORS,
  ...ANALYTICS_AUDIENCE_CALCULATORS,
  ...ANALYTICS_GROWTH_CALCULATORS,
  ...ANALYTICS_COMPARISON_CALCULATORS,

  // 🎬 Video y Producción
  ...VIDEO_CALCULATORS,
];

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'ingresos',
    name: 'Dinero e Ingresos',
    description: 'Herramientas matemáticas para calcular ganancias de AdSense, RPM, CPM, Shorts y metas financieras.',
    icon: 'DollarSign',
    count: CALCULATORS.filter((c) => c.category === 'ingresos').length,
    subcategories: INCOME_SUBCATEGORIES.map((sub) => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      icon: sub.icon,
    })),
  },
  {
    id: 'analytics',
    name: 'Analytics de YouTube',
    description: 'Herramientas analíticas para medir CTR, retención, Watch Time, conversión a suscriptores y proyecciones.',
    icon: 'TrendingUp',
    count: CALCULATORS.filter((c) => c.category === 'analytics').length,
    subcategories: ANALYTICS_SUBCATEGORIES.map((sub) => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      icon: sub.icon,
    })),
  },
  {
    id: 'video',
    name: 'Video y Producción',
    description: 'Calculadoras de bitrate, resoluciones 16:9 y 9:16, compresión, tiempo de grabación en SD y conversor de timecode.',
    icon: 'Film',
    count: CALCULATORS.filter((c) => c.category === 'video').length,
    subcategories: VIDEO_SUBCATEGORIES.map((sub) => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      icon: sub.icon,
    })),
  },
  {
    id: 'imagenes',
    name: 'Asistente de imágenes',
    description: 'Convierte, optimiza y prepara tus imágenes gratis. Conversor JPG/PNG/WebP, compresión, redimensionar, recorte y metadatos.',
    icon: 'Image',
    count: 17,
    subcategories: IMAGE_SUBCATEGORIES.map((sub) => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      icon: sub.icon,
    })),
  },
  {
    id: 'seo',
    name: '🔎 SEO para YouTube',
    description: 'Investigación de keywords, analizador y comparador de títulos, descripciones estructuradas, hashtags, tags y auditoría textual.',
    icon: 'Search',
    count: SEO_TOOLS.length,
    subcategories: SEO_SUBCATEGORIES_CONFIG.map((sub) => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      icon: sub.icon,
    })),
  },
];
