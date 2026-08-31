import { CalculatorConfig } from '../../types';
import {
  calculateVideoComparison,
  calculatePeriodComparison,
  calculateDerivedChannelMetrics,
  calculatePerformanceScoreComparison,
} from '../../utils/mathFormulas';

export const ANALYTICS_COMPARISON_CALCULATORS: CalculatorConfig[] = [
  // 1. Comparador de Videos de YouTube (Video A vs Video B)
  {
    id: 'comparador-videos',
    slug: 'comparador-videos-youtube',
    name: 'Comparador de Videos de YouTube (Video A vs Video B)',
    tagline: 'Compara Rendimiento, CTR, Retención y Engagement Frente a Frente',
    shortDescription: 'Compara métricas completas de dos videos (vistas, impresiones, CTR, watch time, likes, comentarios, suscriptores) para identificar el mejor rendimiento.',
    category: 'analytics',
    subcategory: 'comparacion',
    iconName: 'Columns',
    popularRank: 16,
    badge: 'Comparador',
    fields: [
      // Video A Inputs
      {
        id: 'viewsA',
        label: 'Video A - Visualizaciones',
        type: 'number',
        defaultValue: 50000,
        min: 0,
        max: 1000000000,
        step: 500,
        placeholder: 'Ej. 50000',
      },
      {
        id: 'impressionsA',
        label: 'Video A - Impresiones',
        type: 'number',
        defaultValue: 800000,
        min: 0,
        max: 1000000000,
        step: 5000,
        placeholder: 'Ej. 800000',
      },
      {
        id: 'ctrA',
        label: 'Video A - CTR (%)',
        type: 'number',
        defaultValue: 6.25,
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: 'Ej. 6.25',
      },
      {
        id: 'watchTimeA',
        label: 'Video A - Watch Time (Horas)',
        type: 'number',
        defaultValue: 3500,
        min: 0,
        max: 10000000,
        step: 50,
        placeholder: 'Ej. 3500',
      },
      {
        id: 'avgDurationMinA',
        label: 'Video A - Duración Media (Minutos)',
        type: 'number',
        defaultValue: 4.2,
        min: 0,
        max: 600,
        step: 0.1,
        placeholder: 'Ej. 4.2',
      },
      {
        id: 'likesA',
        label: 'Video A - Me Gusta (Likes)',
        type: 'number',
        defaultValue: 3200,
        min: 0,
        max: 10000000,
        step: 50,
        placeholder: 'Ej. 3200',
      },
      {
        id: 'commentsA',
        label: 'Video A - Comentarios',
        type: 'number',
        defaultValue: 280,
        min: 0,
        max: 10000000,
        step: 10,
        placeholder: 'Ej. 280',
      },
      {
        id: 'subsA',
        label: 'Video A - Nuevos Suscriptores',
        type: 'number',
        defaultValue: 650,
        min: 0,
        max: 10000000,
        step: 10,
        placeholder: 'Ej. 650',
      },

      // Video B Inputs
      {
        id: 'viewsB',
        label: 'Video B - Visualizaciones',
        type: 'number',
        defaultValue: 85000,
        min: 0,
        max: 1000000000,
        step: 500,
        placeholder: 'Ej. 85000',
      },
      {
        id: 'impressionsB',
        label: 'Video B - Impresiones',
        type: 'number',
        defaultValue: 1100000,
        min: 0,
        max: 1000000000,
        step: 5000,
        placeholder: 'Ej. 1100000',
      },
      {
        id: 'ctrB',
        label: 'Video B - CTR (%)',
        type: 'number',
        defaultValue: 7.72,
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: 'Ej. 7.72',
      },
      {
        id: 'watchTimeB',
        label: 'Video B - Watch Time (Horas)',
        type: 'number',
        defaultValue: 7080,
        min: 0,
        max: 10000000,
        step: 50,
        placeholder: 'Ej. 7080',
      },
      {
        id: 'avgDurationMinB',
        label: 'Video B - Duración Media (Minutos)',
        type: 'number',
        defaultValue: 5.0,
        min: 0,
        max: 600,
        step: 0.1,
        placeholder: 'Ej. 5.0',
      },
      {
        id: 'likesB',
        label: 'Video B - Me Gusta (Likes)',
        type: 'number',
        defaultValue: 5900,
        min: 0,
        max: 10000000,
        step: 50,
        placeholder: 'Ej. 5900',
      },
      {
        id: 'commentsB',
        label: 'Video B - Comentarios',
        type: 'number',
        defaultValue: 450,
        min: 0,
        max: 10000000,
        step: 10,
        placeholder: 'Ej. 450',
      },
      {
        id: 'subsB',
        label: 'Video B - Nuevos Suscriptores',
        type: 'number',
        defaultValue: 1400,
        min: 0,
        max: 10000000,
        step: 10,
        placeholder: 'Ej. 1400',
      },
    ],
    presets: [
      {
        label: 'Video Estándar (50k) vs Video Destacado (85k)',
        values: {
          viewsA: 50000, impressionsA: 800000, ctrA: 6.25, watchTimeA: 3500, avgDurationMinA: 4.2, likesA: 3200, commentsA: 280, subsA: 650,
          viewsB: 85000, impressionsB: 1100000, ctrB: 7.72, watchTimeB: 7080, avgDurationMinB: 5.0, likesB: 5900, commentsB: 450, subsB: 1400,
        },
      },
    ],
    calculate: (inputs) => {
      const a = {
        views: Number(inputs.viewsA) || 0,
        impressions: Number(inputs.impressionsA) || 0,
        ctr: Number(inputs.ctrA) || 0,
        watchTimeHours: Number(inputs.watchTimeA) || 0,
        avgDurationMin: Number(inputs.avgDurationMinA) || 0,
        likes: Number(inputs.likesA) || 0,
        comments: Number(inputs.commentsA) || 0,
        subs: Number(inputs.subsA) || 0,
      };

      const b = {
        views: Number(inputs.viewsB) || 0,
        impressions: Number(inputs.impressionsB) || 0,
        ctr: Number(inputs.ctrB) || 0,
        watchTimeHours: Number(inputs.watchTimeB) || 0,
        avgDurationMin: Number(inputs.avgDurationMinB) || 0,
        likes: Number(inputs.likesB) || 0,
        comments: Number(inputs.commentsB) || 0,
        subs: Number(inputs.subsB) || 0,
      };

      const comparisonResults = calculateVideoComparison(a, b);
      const winsB = comparisonResults.filter((r) => r.winner === 'B').length;
      const winsA萃 = comparisonResults.filter((r) => r.winner === 'A').length;

      let winnerText = 'Rendimiento Equilibrado';
      if (winsB > winsA萃) winnerText = 'Video B Superó a Video A';
      else if (winsA萃 > winsB) winnerText = 'Video A Superó a Video B';

      const breakdownData = [
        { name: 'Vistas Video A', value: a.views },
        { name: 'Vistas Video B', value: b.views },
        { name: 'Likes Video A', value: a.likes },
        { name: 'Likes Video B', value: b.likes },
      ];

      return {
        primaryValue: winnerText,
        primaryLabel: 'Ganador de Rendimiento Global',
        secondaryMetrics: [
          { label: 'Métricas a favor de B', value: `${winsB} de ${comparisonResults.length}`, highlight: winsB >= winsA萃, isPositive: winsB >= winsA萃 },
          { label: 'Métricas a favor de A', value: `${winsA萃} de ${comparisonResults.length}`, isPositive: winsA萃 > winsB },
          { label: 'Diferencia en Vistas', value: `${b.views >= a.views ? '+' : ''}${(b.views - a.views).toLocaleString('es-ES')}` },
        ],
        formulaExplanation: `Tabla comparativa de métricas:\n${comparisonResults
          .map(
            (c) =>
              `• ${c.metricName}: Video A (${c.formattedA}) vs Video B (${c.formattedB}) ➔ Dif: ${c.diffAbs >= 0 ? '+' : ''}${c.diffAbs.toLocaleString('es-ES')} (${c.diffPercent >= 0 ? '+' : ''}${c.diffPercent.toFixed(1)}%) ➔ Mejor: ${c.winner === 'equal' ? 'Igual' : `Video ${c.winner}`}`
          )
          .join('\n')}`,
        benchmarkText: 'Compara dos videos con temáticas o estilos similares para identificar qué título, miniatura y estructura de guion enganchan con mayor fuerza a tu audiencia.',
        benchmarkStatus: 'optimal',
        recommendations: [
          'Analiza qué tuvo de diferente la miniatura del video ganador para replicar su estilo en futuros contenidos.',
          'Revisa si la mayor duración media en el video ganador se debe a un mejor gancho inicial en los primeros 30 segundos.',
        ],
        breakdownData,
        rawOutput: { comparisonResults, winsB, winsA: winsA萃, a, b },
      };
    },
    seo: {
      title: 'Comparador de Videos de YouTube (Video A vs Video B)',
      metaDescription: 'Compara dos videos de YouTube frente a frente: visualizaciones, CTR, Watch Time, likes, comentarios y suscriptores ganados.',
      h1: 'Comparador de Videos de YouTube (Video A vs Video B)',
      keywords: ['comparador videos youtube', 'comparar dos videos youtube', 'analisis comparativo videos youtube'],
      summary: 'Analiza detalladamente dos publicaciones de YouTube para descubrir qué formato, título y miniatura consiguieron el mejor engagement y alcance.',
      formulaMarkdown: '`Diferencia (%) = ((Video B - Video A) / Video A) * 100`',
      howToSteps: [
        'Introduce las métricas del Video A (vistas, CTR, watch time, likes, suscriptores).',
        'Introduce las métricas del Video B.',
        'Haz clic en "Comparar Videos".',
        'Examina la tabla comparativa con el ganador métrica por métrica.',
      ],
      tipsToImprove: [
        'Identifica patrones repetibles en el video ganador para estandarizarlos en tu flujo de producción.',
      ],
      faqs: [
        {
          question: '¿Qué métrica es la más decisiva al comparar dos videos?',
          answer: 'El Watch Time y el CTR son las dos métricas que tienen mayor peso en las decisiones de recomendación del algoritmo de YouTube.',
        },
      ],
    },
    relatedSlugs: ['comparador-periodos-youtube', 'comparador-metricas-youtube', 'calculadora-ctr-youtube'],
  },

  // 2. Comparador de Períodos de YouTube
  {
    id: 'comparador-periodos',
    slug: 'comparador-periodos-youtube',
    name: 'Comparador de Períodos de YouTube',
    tagline: 'Compara la Evolución Global entre Dos Meses o Rango de Fechas',
    shortDescription: 'Compara visualizaciones, suscriptores, tiempo de reproducción, likes y comentarios entre el Período 1 y Período 2 con indicadores de tendencia.',
    category: 'analytics',
    subcategory: 'comparacion',
    iconName: 'ArrowLeftRight',
    popularRank: 17,
    badge: 'Comparador',
    fields: [
      {
        id: 'viewsPeriod1',
        label: 'Período 1 - Vistas',
        type: 'number',
        defaultValue: 100000,
        min: 0,
        max: 1000000000,
        step: 5000,
        placeholder: 'Ej. 100000',
      },
      {
        id: 'subsPeriod1',
        label: 'Período 1 - Suscriptores',
        type: 'number',
        defaultValue: 1500,
        min: 0,
        max: 100000000,
        step: 50,
        placeholder: 'Ej. 1500',
      },
      {
        id: 'watchTimePeriod1',
        label: 'Período 1 - Watch Time (Horas)',
        type: 'number',
        defaultValue: 6600,
        min: 0,
        max: 10000000,
        step: 100,
        placeholder: 'Ej. 6600',
      },
      {
        id: 'likesPeriod1',
        label: 'Período 1 - Likes',
        type: 'number',
        defaultValue: 7000,
        min: 0,
        max: 10000000,
        step: 100,
        placeholder: 'Ej. 7000',
      },
      {
        id: 'commentsPeriod1',
        label: 'Período 1 - Comentarios',
        type: 'number',
        defaultValue: 600,
        min: 0,
        max: 10000000,
        step: 50,
        placeholder: 'Ej. 600',
      },

      {
        id: 'viewsPeriod2',
        label: 'Período 2 - Vistas',
        type: 'number',
        defaultValue: 145000,
        min: 0,
        max: 1000000000,
        step: 5000,
        placeholder: 'Ej. 145000',
      },
      {
        id: 'subsPeriod2',
        label: 'Período 2 - Suscriptores',
        type: 'number',
        defaultValue: 2400,
        min: 0,
        max: 100000000,
        step: 50,
        placeholder: 'Ej. 2400',
      },
      {
        id: 'watchTimePeriod2',
        label: 'Período 2 - Watch Time (Horas)',
        type: 'number',
        defaultValue: 10200,
        min: 0,
        max: 10000000,
        step: 100,
        placeholder: 'Ej. 10200',
      },
      {
        id: 'likesPeriod2',
        label: 'Período 2 - Likes',
        type: 'number',
        defaultValue: 11000,
        min: 0,
        max: 10000000,
        step: 100,
        placeholder: 'Ej. 11000',
      },
      {
        id: 'commentsPeriod2',
        label: 'Período 2 - Comentarios',
        type: 'number',
        defaultValue: 950,
        min: 0,
        max: 10000000,
        step: 50,
        placeholder: 'Ej. 950',
      },
    ],
    presets: [
      {
        label: 'Mes 1 vs Mes 2 (+45% crecimiento)',
        values: {
          viewsPeriod1: 100000, subsPeriod1: 1500, watchTimePeriod1: 6600, likesPeriod1: 7000, commentsPeriod1: 600,
          viewsPeriod2: 145000, subsPeriod2: 2400, watchTimePeriod2: 10200, likesPeriod2: 11000, commentsPeriod2: 950,
        },
      },
    ],
    calculate: (inputs) => {
      const a = {
        views: Number(inputs.viewsPeriod1) || 0,
        subs: Number(inputs.subsPeriod1) || 0,
        watchTimeHours: Number(inputs.watchTimePeriod1) || 0,
        likes: Number(inputs.likesPeriod1) || 0,
        comments: Number(inputs.commentsPeriod1) || 0,
      };

      const b進 = {
        views: Number(inputs.viewsPeriod2) || 0,
        subs: Number(inputs.subsPeriod2) || 0,
        watchTimeHours: Number(inputs.watchTimePeriod2) || 0,
        likes: Number(inputs.likesPeriod2) || 0,
        comments: Number(inputs.commentsPeriod2) || 0,
      };

      const results = calculatePeriodComparison(a, b進);
      const viewRow = results.find((r) => r.metricName === 'Visualizaciones');
      const viewGrowth = viewRow ? viewRow.growthPercent : 0;

      const breakdownData = [
        { name: 'Vistas P1', value: a.views },
        { name: 'Vistas P2', value: b進.views },
        { name: 'Watch Time P1 (h)', value: a.watchTimeHours },
        { name: 'Watch Time P2 (h)', value: b進.watchTimeHours },
      ];

      return {
        primaryValue: `${viewGrowth >= 0 ? '↑ +' : '↓ '}${viewGrowth.toFixed(1)}% Vistas`,
        primaryLabel: 'Variación de Tráfico entre Períodos',
        secondaryMetrics: results.slice(1, 4).map((r) => ({
          label: r.metricName,
          value: `${r.growthPercent >= 0 ? '↑ +' : '↓ '}${r.growthPercent.toFixed(1)}%`,
          subValue: `Dif: ${r.diffAbs >= 0 ? '+' : ''}${r.diffAbs.toLocaleString('es-ES')}`,
          highlight: r.metricName.includes('Suscriptores'),
          isPositive: r.growthPercent >= 0,
        })),
        formulaExplanation: `Desglose de variación entre períodos:\n${results
          .map(
            (r) =>
              `• ${r.metricName}: P1 (${r.formattedA}) ➔ P2 (${r.formattedB}) | Dif: ${r.diffAbs >= 0 ? '+' : ''}${r.diffAbs.toLocaleString('es-ES')} | Variación: ${r.growthPercent >= 0 ? '↑ +' : '↓ '}${r.growthPercent.toFixed(2)}%`
          )
          .join('\n')}`,
        benchmarkText: viewGrowth >= 0 ? `Evolución positiva: Tu canal creció un ${viewGrowth.toFixed(1)}% en vistas en el Período 2.` : `Tu canal descendió un ${Math.abs(viewGrowth).toFixed(1)}% en el Período 2.`,
        benchmarkStatus: viewGrowth >= 0 ? 'optimal' : 'needs-work',
        recommendations: [
          'Mantén registro de las mejoras implementadas entre un período y otro (ej. frecuencia de subida, diseño de miniaturas o duración promedio).',
          'Examina si el aumento de visualizaciones vino acompañado de un crecimiento proporcional en comentarios y likes (engagement sostenido).',
        ],
        breakdownData,
        rawOutput: { results, a, b: b進 },
      };
    },
    seo: {
      title: 'Comparador de Períodos de YouTube - Análisis de Tendencia y Crecimiento',
      metaDescription: 'Compara dos períodos de tiempo en YouTube: visualizaciones, suscriptores, watch time y engagement con indicadores de tendencia.',
      h1: 'Comparador de Períodos de YouTube',
      keywords: ['comparador periodos youtube', 'analisis mensual canal youtube', 'evolucion metricas youtube'],
      summary: 'Analiza la evolución de tu canal comparando dos meses o lapsos de tiempo con indicadores visuales claros.',
      formulaMarkdown: '`Variación (%) = ((Período 2 - Período 1) / Período 1) * 100`',
      howToSteps: [
        'Introduce las métricas del Período 1 (anterior).',
        'Introduce las métricas del Período 2 (actual o reciente).',
        'Haz clic en "Comparar Períodos".',
        'Revisa la evolución y tasa de variación porcentual.',
      ],
      tipsToImprove: [
        'Utiliza períodos de duración idéntica (ej. 30 días contra 30 días) para comparaciones rigurosas.',
      ],
      faqs: [
        {
          question: '¿Cómo exportar estas cifras desde YouTube Studio?',
          answer: 'Ve a YouTube Studio > Analytics, selecciona el rango de fechas en la esquina superior derecha y copia las métricas principales de la pestaña "Resumen".',
        },
      ],
    },
    relatedSlugs: ['comparador-videos-youtube', 'comparador-metricas-youtube', 'proyeccion-canal-youtube'],
  },

  // 3. Comparador y Analizador de Métricas del Canal
  {
    id: 'comparador-metricas',
    slug: 'comparador-metricas-youtube',
    name: 'Comparador y Analizador de Métricas del Canal',
    tagline: 'Calcula Automáticamente Todas las Métricas Derivadas de tu Canal',
    shortDescription: 'Introduce vistas, suscriptores, horas, CTR y retención para obtener métricas clave: horas por vista, subs/1k vistas e impresiones estimadas.',
    category: 'analytics',
    subcategory: 'comparacion',
    iconName: 'LayoutDashboard',
    popularRank: 18,
    badge: 'Comparador',
    fields: [
      {
        id: 'views',
        label: 'Visualizaciones Totales del Canal',
        type: 'number',
        defaultValue: 250000,
        min: 1,
        max: 1000000000,
        step: 10000,
        placeholder: 'Ej. 250000',
        tooltip: 'Vistas totales registradas en el período.',
      },
      {
        id: 'subscribers',
        label: 'Nuevos Suscriptores Obtenidos',
        type: 'number',
        defaultValue: 3500,
        min: 0,
        max: 100000000,
        step: 50,
        placeholder: 'Ej. 3500',
        tooltip: 'Suscriptores netos sumados.',
      },
      {
        id: 'watchTimeHours',
        label: 'Watch Time Total (Horas)',
        type: 'number',
        defaultValue: 18750,
        min: 1,
        max: 10000000,
        step: 250,
        placeholder: 'Ej. 18750',
        tooltip: 'Horas de reproducción acumuladas.',
      },
      {
        id: 'ctr',
        label: 'CTR Promedio de Impresiones (%)',
        type: 'number',
        defaultValue: 6.8,
        min: 0.1,
        max: 100,
        step: 0.1,
        placeholder: 'Ej. 6.8',
        tooltip: 'Tasa promedio de clics del canal.',
      },
      {
        id: 'retention',
        label: 'Retención Promedio (%)',
        type: 'number',
        defaultValue: 45.0,
        min: 1,
        max: 100,
        step: 0.5,
        placeholder: 'Ej. 45.0',
        tooltip: 'Porcentaje de retención promedio.',
      },
    ],
    presets: [
      {
        label: 'Canal en Crecimiento (250k vistas / 3.5k subs / 18.7k horas)',
        values: { views: 250000, subscribers: 3500, watchTimeHours: 18750, ctr: 6.8, retention: 45.0 },
      },
      {
        label: 'Canal Consolidado (1M vistas / 15k subs / 75k horas)',
        values: { views: 1000000, subscribers: 15000, watchTimeHours: 75000, ctr: 7.5, retention: 50.0 },
      },
    ],
    calculate: (inputs) => {
      const views = Number(inputs.views) || 0;
      const subscribers萃 = Number(inputs.subscribers) || 0;
      const watchTimeHours = Number(inputs.watchTimeHours) || 0;
      const ctr = Number(inputs.ctr) || 0;
      const retention = Number(inputs.retention) || 0;

      if (views <= 0) {
        return {
          primaryValue: '0 métricas',
          primaryLabel: 'Análisis de Métricas',
          secondaryMetrics: [],
          formulaExplanation: 'Las visualizaciones deben ser mayores que 0.',
          recommendations: ['Introduce las vistas de tu canal.'],
        };
      }

      const derived = calculateDerivedChannelMetrics(views, subscribers萃, watchTimeHours, ctr, retention);

      const breakdownData韵 = [
        { name: 'Vistas Registradas', value: views },
        { name: 'Impresiones Estimadas', value: derived.estimatedImpressions },
        { name: 'Horas Watch Time', value: watchTimeHours },
        { name: 'Suscriptores', value: subscribers萃 },
      ];

      return {
        primaryValue: `${derived.subsPerThousandViews.toFixed(1)} subs / 1k vistas`,
        primaryLabel: 'Rendimiento Derivado de Captación',
        secondaryMetrics: [
          { label: 'Impresiones Estimadas', value: `${derived.estimatedImpressions.toLocaleString('es-ES')}`, highlight: true },
          { label: 'Duración Media por Vista', value: `${derived.avgMinutesPerView.toFixed(2)} min`, subValue: `${(derived.avgMinutesPerView * 60).toFixed(0)} segundos` },
          { label: 'Longitud Promedio de Video', value: `~${derived.estimatedTotalVideoMinutes.toFixed(1)} min`, subValue: `con ${retention}% retención` },
        ],
        formulaExplanation: `Fórmulas derivadas calculadas:\n1. Impresiones estimadas = Vistas / (CTR / 100) = ${views.toLocaleString('es-ES')} / ${(ctr / 100).toFixed(4)} = ${derived.estimatedImpressions.toLocaleString('es-ES')} impresiones\n2. Suscriptores por 1.000 vistas = (${subscribers萃.toLocaleString('es-ES')} / ${views.toLocaleString('es-ES')}) × 1.000 = ${derived.subsPerThousandViews.toFixed(1)} subs/1k vistas\n3. Minutos promedio por vista = (${watchTimeHours.toLocaleString('es-ES')} × 60) / ${views.toLocaleString('es-ES')} = ${derived.avgMinutesPerView.toFixed(2)} minutos`,
        benchmarkText: 'Este análisis global conecta tus métricas de tráfico, visualización y conversión para darte una radiografía matemática completa de la salud de tu canal.',
        benchmarkStatus: 'optimal',
        recommendations: [
          'Una relación sana entre CTR (>6%) y Retención (>45%) genera el mayor efecto multiplicador en impresiones orgánicas recomendadas por el algoritmo.',
          'Si tus impresiones estimadas son altas pero las vistas bajas, enfócate de forma prioritaria en optimizar títulos y miniaturas.',
        ],
        breakdownData: breakdownData韵,
        rawOutput: { derived, views, subscribers: subscribers萃, watchTimeHours, ctr, retention },
      };
    },
    seo: {
      title: 'Comparador y Analizador de Métricas del Canal de YouTube',
      metaDescription: 'Analiza y calcula métricas derivadas de tu canal: impresiones estimadas, minutos por vista, y densidad de suscriptores.',
      h1: 'Comparador y Analizador de Métricas del Canal',
      keywords: ['analizador metricas canal youtube', 'impresiones estimadas youtube formula', 'dashboard metricas youtube'],
      summary: 'Obtén una visión integral de las métricas interconectadas de tu canal de YouTube calculando métricas derivadas clave.',
      formulaMarkdown: '`Impresiones = Vistas / (CTR / 100)`',
      howToSteps: [
        'Ingresa las vistas, suscriptores y horas totales.',
        'Ingresa el CTR y la retención promedio de tu canal.',
        'Haz clic en "Analizar Métricas".',
      ],
      tipsToImprove: [
        'Permite estimar el volumen de impresiones totales incluso si solo conoces tus vistas y tu CTR.',
      ],
      faqs: [
        {
          question: '¿Por qué calcular las impresiones a partir del CTR y las vistas?',
          answer: 'Porque si conoces tus vistas (ej. 250.000) y tu CTR promedio (6,8%), la fórmula inversa (250.000 / 0,068) revela que YouTube mostró tus miniaturas más de 3,67 millones de veces.',
        },
      ],
    },
    relatedSlugs: ['comparador-videos-youtube', 'calculadora-ctr-youtube', 'calculadora-retencion-youtube'],
  },

  // 4. Comparador de Rendimiento de Videos y Formatos (Performance Index)
  {
    id: 'comparador-rendimiento',
    slug: 'comparador-rendimiento-youtube',
    name: 'Comparador de Rendimiento de Contenido en YouTube',
    tagline: 'Compara Índices de Eficiencia, Retención y Conversión entre Videos',
    shortDescription: 'Evalúa y compara el índice de rendimiento ponderado (CTR, Retención, Engagement y Conversión) entre dos videos o formatos.',
    category: 'analytics',
    subcategory: 'comparacion',
    iconName: 'Activity',
    popularRank: 19,
    badge: 'Índice de Calidad',
    fields: [
      {
        id: 'ctrA',
        label: 'Video A - CTR (%)',
        type: 'number',
        defaultValue: 5.5,
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: 'Ej. 5.5',
      },
      {
        id: 'retentionA',
        label: 'Video A - Retención Promedio (%)',
        type: 'number',
        defaultValue: 38.0,
        min: 0,
        max: 100,
        step: 0.5,
        placeholder: 'Ej. 38.0',
      },
      {
        id: 'engagementRateA',
        label: 'Video A - Tasa de Likes y Comentarios (%)',
        type: 'number',
        defaultValue: 4.2,
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: 'Ej. 4.2',
      },
      {
        id: 'conversionRateA',
        label: 'Video A - Conversión a Suscriptores (%)',
        type: 'number',
        defaultValue: 1.1,
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: 'Ej. 1.1',
      },
      {
        id: 'ctrB',
        label: 'Video B - CTR (%)',
        type: 'number',
        defaultValue: 8.2,
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: 'Ej. 8.2',
      },
      {
        id: 'retentionB',
        label: 'Video B - Retención Promedio (%)',
        type: 'number',
        defaultValue: 49.0,
        min: 0,
        max: 100,
        step: 0.5,
        placeholder: 'Ej. 49.0',
      },
      {
        id: 'engagementRateB',
        label: 'Video B - Tasa de Likes y Comentarios (%)',
        type: 'number',
        defaultValue: 6.5,
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: 'Ej. 6.5',
      },
      {
        id: 'conversionRateB',
        label: 'Video B - Conversión a Suscriptores (%)',
        type: 'number',
        defaultValue: 1.8,
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: 'Ej. 1.8',
      },
    ],
    presets: [
      {
        label: 'Video Promedio (Score 48) vs Video Viral (Score 82)',
        values: {
          ctrA: 5.5, retentionA: 38.0, engagementRateA: 4.2, conversionRateA: 1.1,
          ctrB: 8.2, retentionB: 49.0, engagementRateB: 6.5, conversionRateB: 1.8,
        },
      },
    ],
    calculate: (inputs) => {
      const a = {
        ctr: Number(inputs.ctrA) || 0,
        retention: Number(inputs.retentionA) || 0,
        engagementRate: Number(inputs.engagementRateA) || 0,
        conversionRate: Number(inputs.conversionRateA) || 0,
      };

      const b = {
        ctr: Number(inputs.ctrB) || 0,
        retention: Number(inputs.retentionB) || 0,
        engagementRate: Number(inputs.engagementRateB) || 0,
        conversionRate: Number(inputs.conversionRateB) || 0,
      };

      const result = calculatePerformanceScoreComparison(a, b);
      const winnerLabel =
        result.winner === 'B'
          ? 'Video B (Mayor Eficiencia)'
          : result.winner === 'A'
          ? 'Video A (Mayor Eficiencia)'
          : 'Rendimiento Equivalente';

      const breakdownData = [
        { name: 'Score Video A', value: result.scoreA },
        { name: 'Score Video B', value: result.scoreB },
      ];

      return {
        primaryValue: winnerLabel,
        primaryLabel: 'Índice de Calidad Algorítmica',
        secondaryMetrics: [
          { label: 'Score Video B', value: `${result.scoreB}/100`, highlight: result.winner === 'B', isPositive: result.scoreB >= result.scoreA },
          { label: 'Score Video A', value: `${result.scoreA}/100`, isPositive: result.scoreA >= result.scoreB },
          { label: 'Ventaja en CTR', value: `${result.ctrAdvantage >= 0 ? '+' : ''}${result.ctrAdvantage.toFixed(1)}%`, isPositive: result.ctrAdvantage > 0 },
          { label: 'Ventaja en Retención', value: `${result.retentionAdvantage >= 0 ? '+' : ''}${result.retentionAdvantage.toFixed(1)}%`, isPositive: result.retentionAdvantage > 0 },
        ],
        formulaExplanation: `Cálculo del Índice de Rendimiento Algorítmico:\n• Score Video A: ${result.scoreA} pts (CTR: ${a.ctr}%, Ret: ${a.retention}%, Eng: ${a.engagementRate}%, Conv: ${a.conversionRate}%)\n• Score Video B: ${result.scoreB} pts (CTR: ${b.ctr}%, Ret: ${b.retention}%, Eng: ${b.engagementRate}%, Conv: ${b.conversionRate}%)\n• Ponderación: Retención (35%) + CTR (30%) + Engagement (20%) + Conversión (15%)`,
        benchmarkText: 'El algoritmo de YouTube favorece los videos que combinan un CTR atractivo con una alta retención y un fuerte compromiso de la audiencia.',
        benchmarkStatus: result.winner === 'equal' ? 'average' : 'optimal',
        recommendations: [
          result.scoreB >= result.scoreA
            ? 'El Video B demuestra mayor tracción algorítmica. Analiza los ganchos iniciales y el ritmo de edición.'
            : 'El Video A mantuvo un mejor balance de retención y conversión.',
        ],
        breakdownData,
        rawOutput: { result, a, b },
      };
    },
    seo: {
      title: 'Comparador de Rendimiento de Videos de YouTube | Índice de Eficiencia',
      metaDescription: 'Compara el rendimiento y la calidad algorítmica de dos videos analizando CTR, retención, likes y suscriptores con una puntuación ponderada.',
      h1: 'Comparador de Rendimiento de Contenido en YouTube',
      keywords: ['comparador rendimiento videos youtube', 'score calidad video youtube', 'evaluar videos youtube'],
      summary: 'Evalúa la eficiencia y la puntuación de calidad de dos videos o formatos en YouTube comparando CTR, retención, interacción y conversión.',
      formulaMarkdown: '`Score = (CTR × 0.3) + (Retención × 0.35) + (Engagement × 0.20) + (Conversión × 0.15)`',
      howToSteps: [
        'Ingresa el CTR y la retención del Video A y del Video B.',
        'Añade las tasas de interacción y conversión de ambos videos.',
        'Haz clic en "Comparar Rendimiento" para ver la puntuación de calidad.',
      ],
      tipsToImprove: [
        'Los videos con puntuaciones superiores a 70 puntos suelen tener muchas más probabilidades de ser recomendados por el algoritmo de YouTube.',
      ],
      faqs: [
        {
          question: '¿Qué peso tiene cada métrica en el índice de rendimiento?',
          answer: 'La retención representa el 35% y el CTR el 30% porque son los dos factores de mayor impacto en las recomendaciones de YouTube, seguidos por la interacción (20%) y la conversión a suscriptores (15%).',
        },
      ],
    },
    relatedSlugs: ['comparador-videos-youtube', 'comparador-periodos-youtube', 'calculadora-retencion-youtube'],
  },
];
