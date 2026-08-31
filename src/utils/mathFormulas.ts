/**
 * Mathematical Calculation Formulas for YouTube Creator Income & Metrics
 * Independent pure functions separating business logic from UI representation.
 */

export interface CountryRPMData {
  countryCode: string;
  countryName: string;
  flag: string;
  sampleRpm: number; // in USD
}

export const DEFAULT_SAMPLE_COUNTRIES: CountryRPMData[] = [
  { countryCode: 'US', countryName: 'Estados Unidos', flag: '🇺🇸', sampleRpm: 5.0 },
  { countryCode: 'GB', countryName: 'Reino Unido', flag: '🇬🇧', sampleRpm: 5.8 },
  { countryCode: 'ES', countryName: 'España', flag: '🇪🇸', sampleRpm: 2.9 },
  { countryCode: 'MX', countryName: 'México', flag: '🇲🇽', sampleRpm: 1.4 },
  { countryCode: 'CO', countryName: 'Colombia', flag: '🇨🇴', sampleRpm: 1.0 },
  { countryCode: 'AR', countryName: 'Argentina', flag: '🇦🇷', sampleRpm: 0.8 },
  { countryCode: 'CL', countryName: 'Chile', flag: '🇨🇱', sampleRpm: 1.6 },
  { countryCode: 'PE', countryName: 'Perú', flag: '🇵🇪', sampleRpm: 0.9 },
  { countryCode: 'DE', countryName: 'Alemania', flag: '🇩🇪', sampleRpm: 5.2 },
  { countryCode: 'CA', countryName: 'Canadá', flag: '🇨🇦', sampleRpm: 4.8 },
];

/**
 * 1. Calculadora de Ganancias de YouTube
 * Formula: Ganancias = (Vistas / 1000) * RPM
 */
export function calculateYoutubeEarnings(views: number, rpm: number): number {
  if (views <= 0 || rpm <= 0) return 0;
  return (views / 1000) * rpm;
}

/**
 * 2. Calculadora de RPM (Revenue Per Mille)
 * Formula: RPM = (Ingresos / Vistas) * 1000
 */
export function calculateRPM(revenue: number, views: number): number {
  if (revenue <= 0 || views <= 0) return 0;
  return (revenue / views) * 1000;
}

/**
 * 3. Calculadora de CPM (Cost Per Mille)
 * Formula: CPM = (Importe / Impresiones) * 1000
 */
export function calculateCPM(cost: number, impressions: number): number {
  if (cost <= 0 || impressions <= 0) return 0;
  return (cost / impressions) * 1000;
}

/**
 * 4. Calculadora de Ingresos Mensuales
 * Formulas:
 * Vistas mensuales = Vistas diarias * Días
 * Ingresos mensuales = (Vistas mensuales / 1000) * RPM
 */
export function calculateMonthlyEarnings(
  dailyViews: number,
  rpm: number,
  days: number = 30
): { monthlyViews: number; monthlyEarnings: number } {
  if (dailyViews <= 0 || rpm <= 0 || days <= 0) {
    return { monthlyViews: 0, monthlyEarnings: 0 };
  }
  const monthlyViews = Math.round(dailyViews * days);
  const monthlyEarnings = (monthlyViews / 1000) * rpm;
  return { monthlyViews, monthlyEarnings };
}

/**
 * 5. Calculadora de Ingresos Anuales
 * Formulas:
 * Vistas anuales = Vistas mensuales * Meses (por defecto 12)
 * Ingresos anuales = (Vistas anuales / 1000) * RPM
 */
export function calculateAnnualEarnings(
  monthlyViews: number,
  rpm: number,
  months: number = 12
): { annualViews: number; annualEarnings: number } {
  if (monthlyViews <= 0 || rpm <= 0 || months <= 0) {
    return { annualViews: 0, annualEarnings: 0 };
  }
  const annualViews = Math.round(monthlyViews * months);
  const annualEarnings = (annualViews / 1000) * rpm;
  return { annualViews, annualEarnings };
}

/**
 * 6. Calculadora de Vistas Necesarias para Cualquier Objetivo ($100, $500, $1000, etc.)
 * Formula: Vistas necesarias = Math.ceil((Objetivo / RPM) * 1000)
 */
export function calculateRequiredViews(
  targetRevenue: number,
  rpm: number
): { requiredViews: number; viewsPerDollar: number } {
  if (targetRevenue <= 0 || rpm <= 0) {
    return { requiredViews: 0, viewsPerDollar: 0 };
  }
  const requiredViews = Math.ceil((targetRevenue / rpm) * 1000);
  const viewsPerDollar = Math.ceil(requiredViews / targetRevenue);
  return { requiredViews, viewsPerDollar };
}

/**
 * 7. Calculadora de Ganancias de Shorts
 * Formula: Ingresos = (Vistas / 1000) * RPM
 */
export function calculateShortsEarnings(views: number, rpm: number): number {
  if (views <= 0 || rpm <= 0) return 0;
  return (views / 1000) * rpm;
}

/**
 * 8. Calculadora de Vistas Necesarias para Shorts
 * Formula: Vistas necesarias = Math.ceil((Objetivo / RPM) * 1000)
 */
export function calculateShortsRequiredViews(
  targetRevenue: number,
  rpm: number
): { requiredViews: number; viewsPerDollar: number } {
  if (targetRevenue <= 0 || rpm <= 0) {
    return { requiredViews: 0, viewsPerDollar: 0 };
  }
  const requiredViews = Math.ceil((targetRevenue / rpm) * 1000);
  const viewsPerDollar = Math.ceil(requiredViews / targetRevenue);
  return { requiredViews, viewsPerDollar };
}

/**
 * 9. Comparador de RPM por País
 */
export interface CountryComparisonItem {
  countryCode: string;
  countryName: string;
  flag: string;
  rpm: number;
  estimatedEarnings: number;
}

export function calculateCountryRPMComparison(
  views: number,
  countries: CountryRPMData[] = DEFAULT_SAMPLE_COUNTRIES
): CountryComparisonItem[] {
  if (views <= 0) {
    return countries.map((c) => ({
      countryCode: c.countryCode,
      countryName: c.countryName,
      flag: c.flag,
      rpm: c.sampleRpm,
      estimatedEarnings: 0,
    }));
  }

  return countries.map((c) => ({
    countryCode: c.countryCode,
    countryName: c.countryName,
    flag: c.flag,
    rpm: c.sampleRpm,
    estimatedEarnings: (views / 1000) * c.sampleRpm,
  }));
}

/**
 * 10. Comparador de Ingresos por Cantidad de Vistas (Escalones de Tráfico)
 */
export interface ViewMilestoneItem {
  views: number;
  label: string;
  earnings: number;
}

export const DEFAULT_VIEW_MILESTONES = [1000, 10000, 50000, 100000, 500000, 1000000];

export function calculateViewMilestones(
  rpm: number,
  milestones: number[] = DEFAULT_VIEW_MILESTONES
): ViewMilestoneItem[] {
  return milestones.map((views) => ({
    views,
    label: `${views.toLocaleString('es-ES')} vistas`,
    earnings: rpm > 0 ? (views / 1000) * rpm : 0,
  }));
}

/**
 * 11. Comparador de Videos Largos vs YouTube Shorts
 */
export interface LongVsShortsComparison {
  longEarnings: number;
  shortsEarnings: number;
  totalEarnings: number;
  ratioEarnings: number; // long earnings / shorts earnings
  viewsDifferenceRatio: number; // views needed in shorts to match long video
}

export function calculateLongVsShorts(
  longViews: number,
  longRpm: number,
  shortsViews: number,
  shortsRpm: number
): LongVsShortsComparison {
  const longEarnings = calculateYoutubeEarnings(longViews, longRpm);
  const shortsEarnings = calculateShortsEarnings(shortsViews, shortsRpm);
  const totalEarnings = longEarnings + shortsEarnings;

  const ratioEarnings = shortsEarnings > 0 ? Number((longEarnings / shortsEarnings).toFixed(2)) : 0;
  const viewsDifferenceRatio = shortsRpm > 0 ? Number((longRpm / shortsRpm).toFixed(1)) : 0;

  return {
    longEarnings,
    shortsEarnings,
    totalEarnings,
    ratioEarnings,
    viewsDifferenceRatio,
  };
}

// ==========================================
// 📊 ANALYTICS DE YOUTUBE: FÓRMULAS MATEMÁTICAS
// ==========================================

/**
 * 1. Calculadora de CTR (Click-Through Rate)
 * Formula: CTR = (Vistas o Clics / Impresiones) * 100
 */
export function calculateCTR(viewsOrClicks: number, impressions: number): number {
  if (impressions <= 0 || viewsOrClicks < 0) return 0;
  return (viewsOrClicks / impressions) * 100;
}

/**
 * 2. Calculadora de Retención de Audiencia
 * Formula: Retención (%) = (Duración media / Duración total) * 100
 * Acepta unidades en segundos internamente
 */
export function calculateRetention(avgDurationSec: number, totalDurationSec: number): number {
  if (totalDurationSec <= 0 || avgDurationSec < 0) return 0;
  return (avgDurationSec / totalDurationSec) * 100;
}

/**
 * 3. Calculadora de Duración Media de Visualización
 * Formula: Duración Media = Watch Time Total / Vistas
 * Devuelve duración media en minutos y segundos
 */
export function calculateAverageViewDuration(
  watchTimeMinutes: number,
  views: number
): { avgMinutes: number; totalSeconds: number; formatted: string } {
  if (views <= 0 || watchTimeMinutes <= 0) {
    return { avgMinutes: 0, totalSeconds: 0, formatted: '0 min 0 s' };
  }
  const avgMinutes = watchTimeMinutes / views;
  const totalSeconds = Math.round(avgMinutes * 60);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return {
    avgMinutes,
    totalSeconds,
    formatted: `${m} min ${s} s`,
  };
}

/**
 * 4. Calculadora de Watch Time
 * Formulas:
 * Watch Time en minutos = Vistas * Duración media (minutos)
 * Watch Time en horas = Minutos / 60
 */
export function calculateWatchTimeMetrics(
  views: number,
  avgDurationMinutes: number
): { totalMinutes: number; totalHours: number; daysEquivalent: number } {
  if (views <= 0 || avgDurationMinutes <= 0) {
    return { totalMinutes: 0, totalHours: 0, daysEquivalent: 0 };
  }
  const totalMinutes = views * avgDurationMinutes;
  const totalHours = totalMinutes / 60;
  const daysEquivalent = totalHours / 24;
  return { totalMinutes, totalHours, daysEquivalent };
}

/**
 * 5. Calculadora de Vistas por Hora
 * Formula: Vistas por hora = Vistas / Horas
 */
export function calculateViewsPerHour(
  views: number,
  timeAmount: number,
  unit: 'minutes' | 'hours' | 'days' = 'hours'
): { viewsPerHour: number; viewsPerMinute: number; viewsPerDay: number } {
  if (views <= 0 || timeAmount <= 0) {
    return { viewsPerHour: 0, viewsPerMinute: 0, viewsPerDay: 0 };
  }
  let hours = timeAmount;
  if (unit === 'minutes') hours = timeAmount / 60;
  if (unit === 'days') hours = timeAmount * 24;

  const viewsPerHour = views / hours;
  const viewsPerMinute = viewsPerHour / 60;
  const viewsPerDay = viewsPerHour * 24;

  return { viewsPerHour, viewsPerMinute, viewsPerDay };
}

/**
 * 6. Calculadora de Porcentaje Visto
 * Formula: Porcentaje visto = (Tiempo visto / Duración total) * 100
 */
export function calculatePercentageWatched(timeWatchedSec: number, totalDurationSec: number): number {
  if (totalDurationSec <= 0 || timeWatchedSec <= 0) return 0;
  return Math.min(100, (timeWatchedSec / totalDurationSec) * 100);
}

/**
 * 7 & 8. Conversión a Suscriptores y Suscriptores por cada 1.000 Vistas
 * Formulas:
 * Conversión (%) = (Suscriptores / Vistas) * 100
 * Subs por 1.000 vistas = (Suscriptores / Vistas) * 1.000
 */
export function calculateSubsPerThousandViews(subscribers: number, views: number): number {
  if (views <= 0 || subscribers <= 0) return 0;
  return (subscribers / views) * 1000;
}

export function calculateSubscriberConversion(
  subscribers: number,
  views: number
): { conversionRate: number; subsPerThousandViews: number; viewsPerSubscriber: number } {
  if (views <= 0 || subscribers <= 0) {
    return { conversionRate: 0, subsPerThousandViews: 0, viewsPerSubscriber: 0 };
  }
  const conversionRate = (subscribers / views) * 100;
  const subsPerThousandViews = (subscribers / views) * 1000;
  const viewsPerSubscriber = Math.round(views / subscribers);

  return { conversionRate, subsPerThousandViews, viewsPerSubscriber };
}

/**
 * 9. Vistas Necesarias para Conseguir Suscriptores
 * Formula: Vistas necesarias = Suscriptores objetivo / (Tasa de conversión % / 100)
 */
export function calculateViewsNeededForSubscribers(
  targetSubscribers: number,
  conversionRatePercent: number
): { requiredViews: number; subsPerMil: number } {
  if (targetSubscribers <= 0 || conversionRatePercent <= 0) {
    return { requiredViews: 0, subsPerMil: 0 };
  }
  const decimalRate = conversionRatePercent / 100;
  const requiredViews = Math.ceil(targetSubscribers / decimalRate);
  const subsPerMil = conversionRatePercent * 10;
  return { requiredViews, subsPerMil };
}

/**
 * 10 & 11. Calculadora de Crecimiento Porcentual General
 * Formula: Crecimiento (%) = ((Valor Final - Valor Inicial) / Valor Inicial) * 100
 */
export function calculateGrowthPercentage(
  initialValue: number,
  finalValue: number
): { growthPercentage: number; absoluteDifference: number; isPositive: boolean } {
  if (initialValue <= 0) {
    return { growthPercentage: 0, absoluteDifference: finalValue - initialValue, isPositive: finalValue >= initialValue };
  }
  const absoluteDifference = finalValue - initialValue;
  const growthPercentage = (absoluteDifference / initialValue) * 100;
  return {
    growthPercentage,
    absoluteDifference,
    isPositive: growthPercentage >= 0,
  };
}

/**
 * 12 & 13. Proyección de Crecimiento Compuesto (Vistas o Suscriptores)
 * Formula: Valor Futuro = Valor Actual * (1 + tasa)^períodos
 */
export interface CompoundProjectionPoint {
  period: number;
  label: string;
  value: number;
  formattedValue: string;
  growthFromStart: number;
}

export function calculateCompoundProjection(
  currentValue: number,
  growthRatePercent: number,
  periods: number = 6,
  periodType: 'meses' | 'semanas' | 'años' = 'meses'
): { finalValue: number; totalGrowthPercent: number; points: CompoundProjectionPoint[] } {
  if (currentValue <= 0 || periods <= 0) {
    return { finalValue: currentValue, totalGrowthPercent: 0, points: [] };
  }

  const rateDecimal = growthRatePercent / 100;
  const points: CompoundProjectionPoint[] = [
    {
      period: 0,
      label: 'Actual',
      value: currentValue,
      formattedValue: Math.round(currentValue).toLocaleString('es-ES'),
      growthFromStart: 0,
    },
  ];

  let running = currentValue;
  for (let i = 1; i <= periods; i++) {
    running = running * (1 + rateDecimal);
    const growthFromStart = ((running - currentValue) / currentValue) * 100;
    points.push({
      period: i,
      label: `Mes ${i}`,
      value: Math.round(running),
      formattedValue: Math.round(running).toLocaleString('es-ES'),
      growthFromStart,
    });
  }

  const finalValue = Math.round(currentValue * Math.pow(1 + rateDecimal, periods));
  const totalGrowthPercent = ((finalValue - currentValue) / currentValue) * 100;

  return { finalValue, totalGrowthPercent, points };
}

/**
 * 14. Proyección Completa del Canal (Vistas y Suscriptores simultáneos)
 */
export interface ChannelProjectionPoint {
  month: number;
  label: string;
  views: number;
  subscribers: number;
  formattedViews: string;
  formattedSubs: string;
}

export function calculateChannelCompoundProjection(
  currentViews: number,
  currentSubs: number,
  viewGrowthRatePercent: number,
  subGrowthRatePercent: number,
  months: number = 12
): {
  finalViews: number;
  finalSubs: number;
  viewGrowthPercent: number;
  subGrowthPercent: number;
  points: ChannelProjectionPoint[];
} {
  const viewRate = viewGrowthRatePercent / 100;
  const subRate = subGrowthRatePercent / 100;

  const points: ChannelProjectionPoint[] = [
    {
      month: 0,
      label: 'Actual',
      views: currentViews,
      subscribers: currentSubs,
      formattedViews: currentViews.toLocaleString('es-ES'),
      formattedSubs: currentSubs.toLocaleString('es-ES'),
    },
  ];

  let rViews = currentViews;
  let rSubs = currentSubs;

  for (let m = 1; m <= months; m++) {
    rViews = rViews * (1 + viewRate);
    rSubs = rSubs * (1 + subRate);
    points.push({
      month: m,
      label: `Mes ${m}`,
      views: Math.round(rViews),
      subscribers: Math.round(rSubs),
      formattedViews: Math.round(rViews).toLocaleString('es-ES'),
      formattedSubs: Math.round(rSubs).toLocaleString('es-ES'),
    });
  }

  const finalViews = Math.round(currentViews * Math.pow(1 + viewRate, months));
  const finalSubs = Math.round(currentSubs * Math.pow(1 + subRate, months));
  const viewGrowthPercent = currentViews > 0 ? ((finalViews - currentViews) / currentViews) * 100 : 0;
  const subGrowthPercent = currentSubs > 0 ? ((finalSubs - currentSubs) / currentSubs) * 100 : 0;

  return { finalViews, finalSubs, viewGrowthPercent, subGrowthPercent, points };
}

/**
 * 15. Comparador de Videos (Video A vs Video B)
 */
export interface VideoMetricComparison {
  metricName: string;
  unit: string;
  videoA: number;
  videoB: number;
  formattedA: string;
  formattedB: string;
  diffAbs: number;
  diffPercent: number;
  winner: 'A' | 'B' | 'equal';
}

export function calculateVideoComparison(
  a: {
    views: number;
    impressions: number;
    ctr: number;
    watchTimeHours: number;
    avgDurationMin: number;
    likes: number;
    comments: number;
    subs: number;
  },
  b: {
    views: number;
    impressions: number;
    ctr: number;
    watchTimeHours: number;
    avgDurationMin: number;
    likes: number;
    comments: number;
    subs: number;
  }
): VideoMetricComparison[] {
  const metrics = [
    { key: 'views', name: 'Visualizaciones', unit: 'vistas', a: a.views, b: b.views },
    { key: 'impressions', name: 'Impresiones', unit: 'impr.', a: a.impressions, b: b.impressions },
    { key: 'ctr', name: 'CTR (Tasa de Clics)', unit: '%', a: a.ctr, b: b.ctr },
    { key: 'watchTimeHours', name: 'Watch Time', unit: 'horas', a: a.watchTimeHours, b: b.watchTimeHours },
    { key: 'avgDurationMin', name: 'Duración Media', unit: 'min', a: a.avgDurationMin, b: b.avgDurationMin },
    { key: 'likes', name: 'Me Gusta (Likes)', unit: 'likes', a: a.likes, b: b.likes },
    { key: 'comments', name: 'Comentarios', unit: 'com.', a: a.comments, b: b.comments },
    { key: 'subs', name: 'Nuevos Suscriptores', unit: 'subs', a: a.subs, b: b.subs },
  ];

  return metrics.map((m) => {
    const diffAbs = m.b - m.a;
    const diffPercent = m.a > 0 ? (diffAbs / m.a) * 100 : m.b > 0 ? 100 : 0;
    let winner: 'A' | 'B' | 'equal' = 'equal';
    if (m.b > m.a) winner = 'B';
    else if (m.a > m.b) winner = 'A';

    return {
      metricName: m.name,
      unit: m.unit,
      videoA: m.a,
      videoB: m.b,
      formattedA: m.unit === '%' ? `${m.a.toFixed(1)}%` : m.a.toLocaleString('es-ES'),
      formattedB: m.unit === '%' ? `${m.b.toFixed(1)}%` : m.b.toLocaleString('es-ES'),
      diffAbs,
      diffPercent,
      winner,
    };
  });
}

/**
 * 16. Comparador de Períodos
 */
export interface PeriodMetricComparison {
  metricName: string;
  unit: string;
  periodA: number;
  periodB: number;
  formattedA: string;
  formattedB: string;
  diffAbs: number;
  growthPercent: number;
  status: 'growth' | 'decrease' | 'equal';
}

export function calculatePeriodComparison(
  a: { views: number; subs: number; watchTimeHours: number; likes: number; comments: number },
  b: { views: number; subs: number; watchTimeHours: number; likes: number; comments: number }
): PeriodMetricComparison[] {
  const metrics = [
    { name: 'Visualizaciones', unit: 'vistas', a: a.views, b: b.views },
    { name: 'Suscriptores Ganados', unit: 'subs', a: a.subs, b: b.subs },
    { name: 'Tiempo de Reproducción', unit: 'horas', a: a.watchTimeHours, b: b.watchTimeHours },
    { name: 'Me Gusta (Likes)', unit: 'likes', a: a.likes, b: b.likes },
    { name: 'Comentarios', unit: 'com.', a: a.comments, b: b.comments },
  ];

  return metrics.map((m) => {
    const diffAbs = m.b - m.a;
    const growthPercent = m.a > 0 ? (diffAbs / m.a) * 100 : m.b > 0 ? 100 : 0;
    let status: 'growth' | 'decrease' | 'equal' = 'equal';
    if (growthPercent > 0.5) status = 'growth';
    else if (growthPercent < -0.5) status = 'decrease';

    return {
      metricName: m.name,
      unit: m.unit,
      periodA: m.a,
      periodB: m.b,
      formattedA: m.a.toLocaleString('es-ES'),
      formattedB: m.b.toLocaleString('es-ES'),
      diffAbs,
      growthPercent,
      status,
    };
  });
}

/**
 * 17. Comparador y Analizador de Métricas Globales del Canal
 */
export interface DerivedChannelMetrics {
  views: number;
  subscribers: number;
  watchTimeHours: number;
  ctr: number;
  retention: number;
  // Derived:
  subsPerThousandViews: number;
  estimatedImpressions: number;
  avgMinutesPerView: number;
  estimatedTotalVideoMinutes: number;
}

export function calculateDerivedChannelMetrics(
  views: number,
  subscribers: number,
  watchTimeHours: number,
  ctr: number,
  retention: number
): DerivedChannelMetrics {
  const subsPerThousandViews = views > 0 ? (subscribers / views) * 1000 : 0;
  const estimatedImpressions = ctr > 0 ? Math.round(views / (ctr / 100)) : 0;
  const avgMinutesPerView = views > 0 ? (watchTimeHours * 60) / views : 0;
  const estimatedTotalVideoMinutes = retention > 0 ? (avgMinutesPerView / (retention / 100)) : 0;

  return {
    views,
    subscribers,
    watchTimeHours,
    ctr,
    retention,
    subsPerThousandViews,
    estimatedImpressions,
    avgMinutesPerView,
    estimatedTotalVideoMinutes,
  };
}

/**
 * 18. Comparador de Rendimiento de Videos y Formatos (Performance Index)
 */
export interface PerformanceComparisonResult {
  scoreA: number;
  scoreB: number;
  winner: 'A' | 'B' | 'equal';
  ctrAdvantage: number;
  retentionAdvantage: number;
  engagementAdvantage: number;
  conversionAdvantage: number;
}

export function calculatePerformanceScoreComparison(
  a: { ctr: number; retention: number; engagementRate: number; conversionRate: number },
  b: { ctr: number; retention: number; engagementRate: number; conversionRate: number }
): PerformanceComparisonResult {
  // Weighted score: CTR 30%, Retention 35%, Engagement (Likes/Comments) 20%, Sub Conversion 15%
  // Normalized against YouTube creator benchmarks (CTR 10% = 100, Ret 60% = 100, Eng 8% = 100, Conv 2% = 100)
  const normA = {
    ctr: Math.min(100, (a.ctr / 10) * 100),
    ret: Math.min(100, (a.retention / 60) * 100),
    eng: Math.min(100, (a.engagementRate / 8) * 100),
    conv: Math.min(100, (a.conversionRate / 2) * 100),
  };

  const normB = {
    ctr: Math.min(100, (b.ctr / 10) * 100),
    ret: Math.min(100, (b.retention / 60) * 100),
    eng: Math.min(100, (b.engagementRate / 8) * 100),
    conv: Math.min(100, (b.conversionRate / 2) * 100),
  };

  const scoreA = Math.round(normA.ctr * 0.3 + normA.ret * 0.35 + normA.eng * 0.2 + normA.conv * 0.15);
  const scoreB = Math.round(normB.ctr * 0.3 + normB.ret * 0.35 + normB.eng * 0.2 + normB.conv * 0.15);

  let winner: 'A' | 'B' | 'equal' = 'equal';
  if (scoreB > scoreA) winner = 'B';
  else if (scoreA > scoreB) winner = 'A';

  return {
    scoreA,
    scoreB,
    winner,
    ctrAdvantage: b.ctr - a.ctr,
    retentionAdvantage: b.retention - a.retention,
    engagementAdvantage: b.engagementRate - a.engagementRate,
    conversionAdvantage: b.conversionRate - a.conversionRate,
  };
}

// ==========================================
// 🎬 CATEGORÍA: VIDEO Y PRODUCCIÓN FORMULAS
// ==========================================

/**
 * 1. Calculadora de Bitrate y Tamaño Estimado
 */
export interface VideoBitrateResult {
  totalBitrateKbps: number;
  totalBitrateMbps: number;
  totalBits: number;
  totalBytes: number;
  sizeMB: number;
  sizeGB: number;
  durationSeconds: number;
}

export function calculateVideoBitrateSize(
  durationMinutes: number,
  videoBitrateKbps: number,
  audioBitrateKbps: number
): VideoBitrateResult {
  const durationSeconds = Math.max(0, durationMinutes * 60);
  const totalBitrateKbps = Math.max(0, videoBitrateKbps + audioBitrateKbps);
  const totalBitrateMbps = totalBitrateKbps / 1000;
  
  // Total bits = total kilobits * 1000 * seconds
  const totalBits = totalBitrateKbps * 1000 * durationSeconds;
  const totalBytes = totalBits / 8;
  const sizeMB = totalBytes / (1024 * 1024);
  const sizeGB = totalBytes / (1024 * 1024 * 1024);

  return {
    totalBitrateKbps,
    totalBitrateMbps,
    totalBits,
    totalBytes,
    sizeMB,
    sizeGB,
    durationSeconds,
  };
}

/**
 * 2. Calculadora de Tamaño de Archivo con Unidades
 */
export interface FileSizeResult {
  sizeKB: number;
  sizeMB: number;
  sizeGB: number;
  sizeTB: number;
  bestUnitLabel: string;
}

export function calculateVideoFileSize(
  durationSeconds: number,
  totalBitrateKbps: number
): FileSizeResult {
  const totalBits = Math.max(0, durationSeconds) * Math.max(0, totalBitrateKbps) * 1000;
  const bytes = totalBits / 8;
  const sizeKB = bytes / 1024;
  const sizeMB = sizeKB / 1024;
  const sizeGB = sizeMB / 1024;
  const sizeTB = sizeGB / 1024;

  let bestUnitLabel = `${sizeMB.toFixed(2)} MB`;
  if (sizeTB >= 1) {
    bestUnitLabel = `${sizeTB.toFixed(2)} TB`;
  } else if (sizeGB >= 1) {
    bestUnitLabel = `${sizeGB.toFixed(2)} GB`;
  } else if (sizeMB < 1) {
    bestUnitLabel = `${sizeKB.toFixed(1)} KB`;
  }

  return {
    sizeKB,
    sizeMB,
    sizeGB,
    sizeTB,
    bestUnitLabel,
  };
}

/**
 * 3. Conversor de Duración
 */
export function convertDuration(
  value: number,
  fromUnit: 'seconds' | 'minutes' | 'hours'
): {
  seconds: number;
  minutes: number;
  hours: number;
  formattedTimecode: string;
} {
  let seconds = 0;
  if (fromUnit === 'seconds') seconds = value;
  else if (fromUnit === 'minutes') seconds = value * 60;
  else if (fromUnit === 'hours') seconds = value * 3600;

  seconds = Math.max(0, seconds);
  const minutes = seconds / 60;
  const hours = seconds / 3600;

  const h = Math.floor(hours);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const formattedTimecode = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return {
    seconds,
    minutes,
    hours,
    formattedTimecode,
  };
}

/**
 * 4. Calculadora de FPS
 */
export function calculateFps(frames: number, durationSeconds: number): number {
  if (durationSeconds <= 0 || frames <= 0) return 0;
  return frames / durationSeconds;
}

/**
 * 5. Calculadora de Frames
 */
export function calculateFrames(fps: number, durationSeconds: number): number {
  if (fps <= 0 || durationSeconds <= 0) return 0;
  return Math.round(fps * durationSeconds);
}

/**
 * 6. Calculadora de Compresión
 */
export interface CompressionResult {
  reductionPercent: number;
  savedSpaceMB: number;
  savedSpaceGB: number;
  compressionRatio: number;
}

export function calculateCompressionReduction(
  originalSizeMB: number,
  compressedSizeMB: number
): CompressionResult {
  if (originalSizeMB <= 0) {
    return { reductionPercent: 0, savedSpaceMB: 0, savedSpaceGB: 0, compressionRatio: 1 };
  }

  const reductionPercent = ((originalSizeMB - compressedSizeMB) / originalSizeMB) * 100;
  const savedSpaceMB = Math.max(0, originalSizeMB - compressedSizeMB);
  const savedSpaceGB = savedSpaceMB / 1024;
  const compressionRatio = compressedSizeMB > 0 ? originalSizeMB / compressedSizeMB : 0;

  return {
    reductionPercent,
    savedSpaceMB,
    savedSpaceGB,
    compressionRatio,
  };
}

/**
 * Greatest Common Divisor (GCD) Helper
 */
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * 7. Calculadora de Relación de Aspecto
 */
export interface AspectRatioResult {
  ratioText: string;
  ratioDecimal: number;
  simplifiedWidth: number;
  simplifiedHeight: number;
  isStandard: boolean;
  standardName?: string;
}

export function calculateAspectRatio(width: number, height: number): AspectRatioResult {
  if (width <= 0 || height <= 0) {
    return {
      ratioText: '0:0',
      ratioDecimal: 0,
      simplifiedWidth: 0,
      simplifiedHeight: 0,
      isStandard: false,
    };
  }

  const w = Math.round(width);
  const h = Math.round(height);
  const divisor = gcd(w, h);
  const simplifiedWidth = w / divisor;
  const simplifiedHeight = h / divisor;
  const ratioDecimal = w / h;

  let standardName: string | undefined;
  let isStandard = false;

  // Approximate checks
  if (Math.abs(ratioDecimal - 16 / 9) < 0.01) {
    standardName = '16:9 (Panorámico / Estándar YouTube)';
    isStandard = true;
  } else if (Math.abs(ratioDecimal - 9 / 16) < 0.01) {
    standardName = '9:16 (Vertical / Shorts / Reels)';
    isStandard = true;
  } else if (Math.abs(ratioDecimal - 4 / 3) < 0.01) {
    standardName = '4:3 (Clásico / TV Antigua)';
    isStandard = true;
  } else if (Math.abs(ratioDecimal - 1) < 0.01) {
    standardName = '1:1 (Cuadrado / Instagram)';
    isStandard = true;
  } else if (Math.abs(ratioDecimal - 21 / 9) < 0.02) {
    standardName = '21:9 (Ultrawide / Cine)';
    isStandard = true;
  }

  return {
    ratioText: `${simplifiedWidth}:${simplifiedHeight}`,
    ratioDecimal,
    simplifiedWidth,
    simplifiedHeight,
    isStandard,
    standardName,
  };
}

/**
 * 8. Calculadora 16:9
 */
export function calculate16by9(
  dimension: number,
  given: 'width' | 'height'
): { width: number; height: number } {
  if (given === 'width') {
    const height = Math.round((dimension * 9) / 16);
    return { width: dimension, height };
  } else {
    const width = Math.round((dimension * 16) / 9);
    return { width, height: dimension };
  }
}

/**
 * 9. Calculadora 9:16 (Shorts / Vertical)
 */
export function calculate9by16(
  dimension: number,
  given: 'width' | 'height'
): { width: number; height: number } {
  if (given === 'width') {
    const height = Math.round((dimension * 16) / 9);
    return { width: dimension, height };
  } else {
    const width = Math.round((dimension * 9) / 16);
    return { width, height: dimension };
  }
}

/**
 * 10. Calculadora 4:3
 */
export function calculate4by3(
  dimension: number,
  given: 'width' | 'height'
): { width: number; height: number } {
  if (given === 'width') {
    const height = Math.round((dimension * 3) / 4);
    return { width: dimension, height };
  } else {
    const width = Math.round((dimension * 4) / 3);
    return { width, height: dimension };
  }
}

/**
 * 11. Calculadora de Escalado de Video
 */
export function calculateScaledResolution(
  origWidth: number,
  origHeight: number,
  scalePercent: number
): {
  newWidth: number;
  newHeight: number;
  totalPixelsOriginal: number;
  totalPixelsNew: number;
  pixelReductionPercent: number;
} {
  const newWidth = Math.round((origWidth * scalePercent) / 100);
  const newHeight = Math.round((origHeight * scalePercent) / 100);
  const totalPixelsOriginal = origWidth * origHeight;
  const totalPixelsNew = newWidth * newHeight;
  const pixelReductionPercent =
    totalPixelsOriginal > 0
      ? ((totalPixelsOriginal - totalPixelsNew) / totalPixelsOriginal) * 100
      : 0;

  return {
    newWidth,
    newHeight,
    totalPixelsOriginal,
    totalPixelsNew,
    pixelReductionPercent,
  };
}

/**
 * 12. Verificador de Dimensiones y Relación de Aspecto
 */
export function verifyAspectRatio(
  width: number,
  height: number,
  expectedRatio: '16:9' | '9:16' | '4:3' | '1:1'
): {
  isMatch: boolean;
  actualRatioDecimal: number;
  expectedRatioDecimal: number;
  expectedHeightForWidth: number;
  expectedWidthForHeight: number;
  differencePixels: number;
} {
  const actualRatioDecimal = height > 0 ? width / height : 0;
  let expectedRatioDecimal = 16 / 9;

  if (expectedRatio === '9:16') expectedRatioDecimal = 9 / 16;
  else if (expectedRatio === '4:3') expectedRatioDecimal = 4 / 3;
  else if (expectedRatio === '1:1') expectedRatioDecimal = 1;

  const expectedHeightForWidth = Math.round(width / expectedRatioDecimal);
  const expectedWidthForHeight = Math.round(height * expectedRatioDecimal);

  const differencePixels = Math.abs(height - expectedHeightForWidth);
  const isMatch = differencePixels === 0 || Math.abs(actualRatioDecimal - expectedRatioDecimal) < 0.005;

  return {
    isMatch,
    actualRatioDecimal,
    expectedRatioDecimal,
    expectedHeightForWidth,
    expectedWidthForHeight,
    differencePixels,
  };
}

/**
 * 13. Calculadora de Espacio Necesario para Almacenamiento
 */
export function calculateStorageNeeded(
  videoCount: number,
  durationMinutes: number,
  bitrateMbps: number
): {
  sizePerVideoGB: number;
  totalSizeGB: number;
  totalSizeTB: number;
  recommendedStorageGB: number;
} {
  const durationSeconds = durationMinutes * 60;
  const megabitsPerVideo = durationSeconds * bitrateMbps;
  const megabytesPerVideo = megabitsPerVideo / 8;
  const sizePerVideoGB = megabytesPerVideo / 1024;
  const totalSizeGB = sizePerVideoGB * videoCount;
  const totalSizeTB = totalSizeGB / 1024;
  // +15% headroom buffer for safety
  const recommendedStorageGB = totalSizeGB * 1.15;

  return {
    sizePerVideoGB,
    totalSizeGB,
    totalSizeTB,
    recommendedStorageGB,
  };
}

/**
 * 14. Calculadora de Tiempo de Grabación
 */
export function calculateRecordingTime(
  availableStorageGB: number,
  bitrateMbps: number
): {
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  formattedTime: string;
} {
  if (bitrateMbps <= 0 || availableStorageGB <= 0) {
    return { totalSeconds: 0, totalMinutes: 0, totalHours: 0, formattedTime: '0h 0m' };
  }

  const availableBits = availableStorageGB * 1024 * 1024 * 1024 * 8;
  const bitrateBps = bitrateMbps * 1000 * 1000;
  const totalSeconds = availableBits / bitrateBps;
  const totalMinutes = totalSeconds / 60;
  const totalHours = totalMinutes / 60;

  const h = Math.floor(totalHours);
  const m = Math.floor((totalSeconds % 3600) / 60);

  return {
    totalSeconds,
    totalMinutes,
    totalHours,
    formattedTime: `${h}h ${m}m`,
  };
}

/**
 * 15. Calculadora de Almacenamiento por Lotes de Grabación
 */
export function calculateBatchStorage(
  durationMinutes: number,
  bitrateMbps: number,
  batchCount: number
): {
  singleVideoGB: number;
  batchTotalGB: number;
  tenVideosGB: number;
  fiftyVideosGB: number;
  hundredVideosGB: number;
} {
  const singleVideoGB = (durationMinutes * 60 * bitrateMbps) / 8 / 1024;
  return {
    singleVideoGB,
    batchTotalGB: singleVideoGB * batchCount,
    tenVideosGB: singleVideoGB * 10,
    fiftyVideosGB: singleVideoGB * 50,
    hundredVideosGB: singleVideoGB * 100,
  };
}

/**
 * 16. Calculadora de Duración según Frames
 */
export function calculateDurationFromFrames(
  frames: number,
  fps: number
): {
  seconds: number;
  minutes: number;
  timecode: string;
} {
  if (fps <= 0 || frames <= 0) {
    return { seconds: 0, minutes: 0, timecode: '00:00:00:00' };
  }

  const totalSeconds = frames / fps;
  const minutes = totalSeconds / 60;

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const f = Math.floor(frames % fps);

  const timecode = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;

  return {
    seconds: totalSeconds,
    minutes,
    timecode,
  };
}

/**
 * 17. Conversor de FPS
 */
export function convertFpsMetrics(fps: number): {
  frameDurationMs: number;
  framesPerMinute: number;
  framesPerHour: number;
} {
  if (fps <= 0) return { frameDurationMs: 0, framesPerMinute: 0, framesPerHour: 0 };
  const frameDurationMs = 1000 / fps;
  const framesPerMinute = fps * 60;
  const framesPerHour = fps * 3600;

  return {
    frameDurationMs,
    framesPerMinute,
    framesPerHour,
  };
}

/**
 * 18. Conversor de Timecode (SMPTE HH:MM:SS:FF)
 */
export function parseTimecodeToSeconds(timecode: string, fps: number): number {
  if (!timecode) return 0;
  const parts = timecode.split(':').map((p) => Number(p.trim()) || 0);
  if (parts.length < 4) {
    // If HH:MM:SS format
    const [h = 0, m = 0, s = 0] = parts;
    return h * 3600 + m * 60 + s;
  }
  const [h = 0, m = 0, s = 0, f = 0] = parts;
  return h * 3600 + m * 60 + s + (fps > 0 ? f / fps : 0);
}

export function secondsToTimecode(totalSeconds: number, fps: number): string {
  if (totalSeconds <= 0) return '00:00:00:00';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const remSeconds = totalSeconds - Math.floor(totalSeconds);
  const f = Math.floor(remSeconds * (fps > 0 ? fps : 30));

  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
}

