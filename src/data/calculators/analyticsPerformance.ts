import { CalculatorConfig } from '../../types';
import {
  calculateCTR,
  calculateRetention,
  calculateAverageViewDuration,
  calculateWatchTimeMetrics,
  calculateViewsPerHour,
  calculatePercentageWatched,
} from '../../utils/mathFormulas';

export const ANALYTICS_PERFORMANCE_CALCULATORS: CalculatorConfig[] = [
  // 1. Calculadora de CTR (Click-Through Rate)
  {
    id: 'ctr',
    slug: 'calculadora-ctr-youtube',
    name: 'Calculadora de CTR (Click-Through Rate)',
    tagline: 'Mide la Efectividad de tus Miniaturas y Títulos en YouTube',
    shortDescription: 'Calcula el porcentaje de clics respecto a las impresiones que muestra el algoritmo de YouTube con la fórmula oficial.',
    category: 'analytics',
    subcategory: 'rendimiento',
    iconName: 'MousePointerClick',
    popularRank: 1,
    badge: 'Rendimiento',
    fields: [
      {
        id: 'impressions',
        label: 'Impresiones Totales Mostradas por YouTube',
        type: 'number',
        defaultValue: 100000,
        min: 1,
        max: 1000000000,
        step: 1000,
        placeholder: 'Ej. 100000',
        tooltip: 'Número de veces que YouTube mostró tu miniatura a los espectadores en la página principal, feed o búsquedas.',
      },
      {
        id: 'views',
        label: 'Vistas Provenientes de Impresiones',
        type: 'number',
        defaultValue: 6500,
        min: 0,
        max: 1000000000,
        step: 100,
        placeholder: 'Ej. 6500',
        tooltip: 'Visualizaciones registradas directamente cuando un usuario hizo clic tras ver la miniatura.',
      },
    ],
    presets: [
      { label: 'Canal Promedio (100k impr. / 6.5k vistas ➔ 6.5%)', values: { impressions: 100000, views: 6500 } },
      { label: 'Video Viral (500k impr. / 45k vistas ➔ 9.0%)', values: { impressions: 500000, views: 45000 } },
      { label: 'Bajo Rendimiento (50k impr. / 1.2k vistas ➔ 2.4%)', values: { impressions: 50000, views: 1200 } },
    ],
    calculate: (inputs) => {
      const impressions = Number(inputs.impressions) || 0;
      const views = Number(inputs.views) || 0;

      if (impressions <= 0) {
        return {
          primaryValue: '0.00%',
          primaryLabel: 'CTR de Impresiones',
          secondaryMetrics: [],
          formulaExplanation: 'Las impresiones deben ser mayores que 0.',
          recommendations: ['Introduce una cantidad de impresiones mayor a cero.'],
        };
      }

      if (views < 0) {
        return {
          primaryValue: '0.00%',
          primaryLabel: 'CTR de Impresiones',
          secondaryMetrics: [],
          formulaExplanation: 'El número de vistas no puede ser negativo.',
          recommendations: ['Introduce un número de vistas válido.'],
        };
      }

      if (views > impressions) {
        return {
          primaryValue: 'Error',
          primaryLabel: 'CTR Imposible',
          secondaryMetrics: [],
          formulaExplanation: 'Las vistas provenientes de impresiones no pueden superar el número de impresiones totales.',
          recommendations: ['Verifica las métricas en YouTube Studio: las vistas por impresiones deben ser menores o iguales a las impresiones.'],
        };
      }

      // Formula: CTR = (Vistas / Impresiones) * 100
      const ctr = calculateCTR(views, impressions);

      let status: 'optimal' | 'average' | 'needs-work' | 'info' = 'average';
      let benchmark = 'Tu CTR está en el rango estándar de YouTube (4.0% - 8.0%).';
      if (ctr >= 8.0) {
        status = 'optimal';
        benchmark = '¡Excelente CTR! Tu miniatura y título destacan notablemente por encima del promedio.';
      } else if (ctr < 4.0) {
        status = 'needs-work';
        benchmark = 'CTR por debajo del promedio. Se recomienda rediseñar la miniatura o ajustar el título.';
      }

      const breakdownData = [
        { name: 'Clics Registrados', value: views },
        { name: 'Impresiones sin Clic', value: Math.max(0, impressions - views) },
      ];

      return {
        primaryValue: `${ctr.toFixed(2)}%`,
        primaryLabel: 'CTR de Impresiones Estimado',
        secondaryMetrics: [
          { label: 'Impresiones', value: impressions.toLocaleString('es-ES'), subValue: 'Miniaturas mostradas' },
          { label: 'Vistas por Clics', value: views.toLocaleString('es-ES'), highlight: true },
          { label: 'Clics por 1.000 Impresiones', value: `${(ctr * 10).toFixed(0)} clics`, isPositive: ctr >= 5 },
        ],
        formulaExplanation: `Fórmula: CTR = (Vistas / Impresiones) × 100\nCálculo: (${views.toLocaleString('es-ES')} / ${impressions.toLocaleString('es-ES')}) × 100 = ${ctr.toFixed(2)}%`,
        benchmarkText: benchmark,
        benchmarkStatus: status,
        recommendations: [
          'El CTR de YouTube puede referirse a distintas métricas según el contexto (CTR de impresiones general, CTR en la página de inicio, CTR en sugeridos o CTR de Shorts). Esta calculadora representa el cálculo matemático simple de vistas dividido entre impresiones.',
          'Prueba la herramienta de "Pruebas y comparaciones" (Test A/B) en YouTube Studio para validar hasta 3 miniaturas.',
          'Mantén una tipografía de gran tamaño con alto contraste (máximo 3 o 4 palabras legibles en dispositivos móviles).',
        ],
        breakdownData,
        rawOutput: { ctr, impressions, views },
      };
    },
    seo: {
      title: 'Calculadora de CTR de YouTube - Mide la Tasa de Clics de tus Miniaturas',
      metaDescription: 'Calcula el CTR de tus videos en YouTube aplicando la fórmula matemática oficial: (Vistas / Impresiones) * 100. Evalúa títulos y miniaturas.',
      h1: 'Calculadora de CTR de YouTube',
      keywords: ['calculadora ctr youtube', 'como calcular ctr youtube', 'formula ctr youtube', 'click through rate youtube miniaturas'],
      summary: 'Evalúa la efectividad de tus miniaturas y títulos calculando el porcentaje exacto de impresiones que se convierten en visualizaciones.',
      formulaMarkdown: '`CTR = (Vistas / Impresiones) * 100`',
      howToSteps: [
        'Abre YouTube Studio y ve a la pestaña "Analytics" > "Alcance" de tu video o canal.',
        'Copia el número de Impresiones mostradas.',
        'Copia las Vistas provenientes de impresiones.',
        'Haz clic en "Calcular CTR" para obtener el porcentaje y diagnóstico de rendimiento.',
      ],
      tipsToImprove: [
        'Un CTR entre 4% y 8% se considera promedio según YouTube.',
        'A medida que un video acumula millones de impresiones y llega a audiencias más amplias, el CTR suele descender de forma natural.',
      ],
      faqs: [
        {
          question: '¿Qué es el CTR en YouTube y cómo se interpreta?',
          answer: 'El CTR (Click-Through Rate o Tasa de Clics) indica qué porcentaje de personas que vieron tu miniatura en pantalla decidieron hacer clic y ver tu video.',
        },
        {
          question: '¿Por qué mi CTR baja cuando el video se hace viral?',
          answer: 'Cuando el algoritmo recomienda tu video a un público mucho más amplio y heterogéneo fuera de tu nicho habitual, la tasa de clics promedio disminuye naturalmente aunque el número total de vistas siga creciendo.',
        },
      ],
    },
    relatedSlugs: ['calculadora-retencion-youtube', 'calculadora-watch-time-youtube', 'comparador-videos-youtube'],
  },

  // 2. Calculadora de Retención de Audiencia
  {
    id: 'retencion',
    slug: 'calculadora-retencion-youtube',
    name: 'Calculadora de Retención de Audiencia',
    tagline: 'Calcula el Porcentaje Promedio de Video Reproducido por Espectador',
    shortDescription: 'Calcula la retención media de tu video a partir de la duración total y la duración media de visualización con soporte para segundos, minutos y horas.',
    category: 'analytics',
    subcategory: 'rendimiento',
    iconName: 'Activity',
    popularRank: 2,
    badge: 'Rendimiento',
    fields: [
      {
        id: 'videoDurationMin',
        label: 'Duración Total del Video (Minutos)',
        type: 'number',
        defaultValue: 10,
        min: 0.1,
        max: 1000,
        step: 0.5,
        placeholder: 'Ej. 10',
        tooltip: 'Longitud total de tu video publicado (ej. 10 minutos).',
      },
      {
        id: 'avgDurationMin',
        label: 'Duración Media de Visualización (Minutos)',
        type: 'number',
        defaultValue: 4,
        min: 0.01,
        max: 1000,
        step: 0.1,
        placeholder: 'Ej. 4',
        tooltip: 'Tiempo promedio que cada usuario permanece viendo el video según YouTube Analytics.',
      },
    ],
    presets: [
      { label: 'Video 10 min / Media 4 min ➔ 40% Retención', values: { videoDurationMin: 10, avgDurationMin: 4 } },
      { label: 'Video 8 min / Media 5 min ➔ 62.5% Retención', values: { videoDurationMin: 8, avgDurationMin: 5 } },
      { label: 'Video 15 min / Media 3 min ➔ 20% Retención', values: { videoDurationMin: 15, avgDurationMin: 3 } },
    ],
    calculate: (inputs) => {
      const totalMin = Number(inputs.videoDurationMin) || 0;
      const avgMin = Number(inputs.avgDurationMin) || 0;

      if (totalMin <= 0) {
        return {
          primaryValue: '0.00%',
          primaryLabel: 'Retención Media Estimada',
          secondaryMetrics: [],
          formulaExplanation: 'La duración total del video debe ser mayor que 0 minutos.',
          recommendations: ['Introduce la duración de tu video.'],
        };
      }

      if (avgMin <= 0) {
        return {
          primaryValue: '0.00%',
          primaryLabel: 'Retención Media Estimada',
          secondaryMetrics: [],
          formulaExplanation: 'La duración media de visualización debe ser mayor que 0.',
          recommendations: ['Introduce la duración media registrada.'],
        };
      }

      if (avgMin > totalMin) {
        return {
          primaryValue: '100.00%',
          primaryLabel: 'Retención Saturada (≥100%)',
          secondaryMetrics: [
            { label: 'Duración Total', value: `${totalMin} min` },
            { label: 'Duración Media', value: `${avgMin} min` },
          ],
          formulaExplanation: 'Cuando la duración media supera la total se debe a usuarios que rebobinaron o vieron partes repetidas del video.',
          recommendations: ['Un porcentaje superior al 100% ocurre en videos con bucles o tutoriales técnicos con rebobinado continuo.'],
        };
      }

      // Convert to seconds for high mathematical precision
      const totalSec = totalMin * 60;
      const avgSec = avgMin * 60;
      const retentionPercent = calculateRetention(avgSec, totalSec);

      let status: 'optimal' | 'average' | 'needs-work' | 'info' = 'average';
      let benchmark = 'Tu retención se encuentra en el rango estándar para videos de esta duración.';
      if (retentionPercent >= 50) {
        status = 'optimal';
        benchmark = '¡Retención sobresaliente! Superar el 50% envía fuertes señales positivas al algoritmo de YouTube.';
      } else if (retentionPercent < 30) {
        status = 'needs-work';
        benchmark = 'Retención baja. Revisa los primeros 30 segundos y elimina introducciones lentas o pausas innecesarias.';
      }

      const breakdownData = [
        { name: 'Tiempo Promedio Visto (min)', value: Number(avgMin.toFixed(2)) },
        { name: 'Tiempo no Visto (min)', value: Number(Math.max(0, totalMin - avgMin).toFixed(2)) },
      ];

      return {
        primaryValue: `${retentionPercent.toFixed(1)}%`,
        primaryLabel: 'Retención Media Estimada',
        secondaryMetrics: [
          { label: 'Duración Total', value: `${totalMin} minutos`, subValue: `${Math.round(totalSec)} segundos` },
          { label: 'Duración Media', value: `${avgMin} minutos`, subValue: `${Math.round(avgSec)} segundos`, highlight: true },
          { label: 'Tiempo Abandonado', value: `${(totalMin - avgMin).toFixed(1)} min`, subValue: 'Por espectador promedio' },
        ],
        formulaExplanation: `Fórmula: Retención media (%) = (Duración media de visualización / Duración total del video) × 100\nCálculo: (${avgMin} min / ${totalMin} min) × 100 = ${retentionPercent.toFixed(1)}%`,
        benchmarkText: benchmark,
        benchmarkStatus: status,
        recommendations: [
          'Optimiza el "gancho" inicial (primeros 30 segundos) para evitar caídas bruscas antes del primer minuto.',
          'Inserta patrones de cambio visual (cortes de cámara, efectos de sonido, cambios de plano) cada 5-8 segundos para mantener la atención activa.',
          'Analiza el gráfico de retención en YouTube Studio para identificar picos de rebobinado y caídas pronunciadas.',
        ],
        breakdownData,
        rawOutput: { retentionPercent, totalMin, avgMin, totalSec, avgSec },
      };
    },
    seo: {
      title: 'Calculadora de Retención de Audiencia de YouTube - Fórmula y Análisis',
      metaDescription: 'Calcula el porcentaje de retención media de tus videos en YouTube aplicando la fórmula oficial: (Duración media / Duración total) * 100.',
      h1: 'Calculadora de Retención de Audiencia de YouTube',
      keywords: ['calculadora retencion audiencia youtube', 'como calcular retencion youtube', 'formula retencion promedio youtube', 'porcentaje retencion video youtube'],
      summary: 'Descubre qué porcentaje promedio de tus videos consumen tus espectadores y evalúa si tu retención es competitiva para el algoritmo.',
      formulaMarkdown: '`Retención (%) = (Duración Media / Duración Total) * 100`',
      howToSteps: [
        'Introduce la duración completa de tu video en minutos.',
        'Ingresa la duración media de visualización que reporta YouTube Studio.',
        'Haz clic en "Calcular Retención".',
        'Analiza tu porcentaje y las recomendaciones de ritmo audiovisual.',
      ],
      tipsToImprove: [
        'Para videos de 8 a 12 minutos, una retención media superior al 45-50% es un indicador excelente.',
      ],
      faqs: [
        {
          question: '¿Por qué la retención es una métrica tan importante en YouTube?',
          answer: 'YouTube prioriza recomendar videos que logren mantener a los espectadores en la plataforma durante más tiempo. Una retención alta es la señal más clara de satisfacción del usuario.',
        },
      ],
    },
    relatedSlugs: ['calculadora-duracion-media-youtube', 'calculadora-watch-time-youtube', 'calculadora-porcentaje-visto'],
  },

  // 3. Calculadora de Duración Media de Visualización
  {
    id: 'duracion-media',
    slug: 'calculadora-duracion-media-youtube',
    name: 'Calculadora de Duración Media de Visualización',
    tagline: 'Calcula el Tiempo Promedio que Cada Espectador Permanece en tu Video',
    shortDescription: 'Calcula la duración media de visualización a partir del Watch Time total y el número de reproducciones.',
    category: 'analytics',
    subcategory: 'rendimiento',
    iconName: 'Clock',
    popularRank: 3,
    badge: 'Rendimiento',
    fields: [
      {
        id: 'watchTimeMinutes',
        label: 'Watch Time Total Acumulado (Minutos)',
        type: 'number',
        defaultValue: 10000,
        min: 1,
        max: 1000000000,
        step: 500,
        placeholder: 'Ej. 10000',
        tooltip: 'Tiempo de reproducción total sumado entre todos los espectadores (ej. 10.000 minutos o 166.6 horas).',
      },
      {
        id: 'views',
        label: 'Número Total de Vistas',
        type: 'number',
        defaultValue: 2000,
        min: 1,
        max: 1000000000,
        step: 100,
        placeholder: 'Ej. 2000',
        tooltip: 'Total de reproducciones que acumula el video o canal.',
      },
    ],
    presets: [
      { label: '10.000 min / 2.000 vistas ➔ 5 min/vista', values: { watchTimeMinutes: 10000, views: 2000 } },
      { label: '50.000 min / 12.500 vistas ➔ 4 min/vista', values: { watchTimeMinutes: 50000, views: 12500 } },
      { label: '100.000 min / 15.000 vistas ➔ 6.67 min/vista', values: { watchTimeMinutes: 100000, views: 15000 } },
    ],
    calculate: (inputs) => {
      const watchTime = Number(inputs.watchTimeMinutes) || 0;
      const views = Number(inputs.views) || 0;

      if (views <= 0 || watchTime <= 0) {
        return {
          primaryValue: '0 min 0 s',
          primaryLabel: 'Duración Media de Visualización',
          secondaryMetrics: [],
          formulaExplanation: 'Tanto el Watch Time como las vistas deben ser mayores que 0.',
          recommendations: ['Ingresa valores mayores a 0.'],
        };
      }

      // Formula: Duración media = Watch Time total / Vistas
      const { avgMinutes, totalSeconds, formatted } = calculateAverageViewDuration(watchTime, views);
      const hoursEquivalent = (watchTime / 60).toFixed(1);

      const breakdownData = [
        { name: 'Minutos por Vista', value: Number(avgMinutes.toFixed(2)) },
        { name: 'Segundos por Vista', value: totalSeconds },
      ];

      return {
        primaryValue: formatted,
        primaryLabel: 'Duración Media de Visualización',
        secondaryMetrics: [
          { label: 'Minutos Exactos', value: `${avgMinutes.toFixed(2)} min`, highlight: true },
          { label: 'Watch Time Total', value: `${watchTime.toLocaleString('es-ES')} min`, subValue: `${hoursEquivalent} horas` },
          { label: 'Vistas Analizadas', value: `${views.toLocaleString('es-ES')} vistas` },
        ],
        formulaExplanation: `Fórmula: Duración media = Watch Time total / Vistas\nCálculo: ${watchTime.toLocaleString('es-ES')} minutos / ${views.toLocaleString('es-ES')} vistas = ${avgMinutes.toFixed(2)} minutos (${formatted})`,
        benchmarkText: 'Una duración media de visualización superior a 4-6 minutos en videos largos ayuda a desbloquear múltiples pausas publicitarias (mid-rolls).',
        benchmarkStatus: avgMinutes >= 4 ? 'optimal' : 'average',
        recommendations: [
          'Estructura tus videos con capítulos claros para que los espectadores encuentren rápidamente los momentos de mayor valor.',
          'Coloca llamadas a la acción antes de que termine la duración media promedio de tu canal.',
        ],
        breakdownData,
        rawOutput: { avgMinutes, totalSeconds, watchTime, views },
      };
    },
    seo: {
      title: 'Calculadora de Duración Media de Visualización en YouTube',
      metaDescription: 'Calcula la duración media de visualización de tus videos de YouTube con la fórmula matemática: Watch Time total / Vistas.',
      h1: 'Calculadora de Duración Media de Visualización',
      keywords: ['calculadora duracion media youtube', 'average view duration youtube', 'calcular tiempo promedio visto youtube'],
      summary: 'Convierte tu tiempo total de reproducción y número de vistas en la duración promedio exacta por espectador.',
      formulaMarkdown: '`Duración Media = Watch Time Total / Vistas`',
      howToSteps: [
        'Ingresa el Watch Time total en minutos acumulado en tu video.',
        'Ingresa el número total de visualizaciones.',
        'Haz clic en "Calcular Duración Media".',
      ],
      tipsToImprove: [
        '10.000 minutos divididos entre 2.000 vistas equivalen exactamente a 5 minutos por espectador.',
      ],
      faqs: [
        {
          question: '¿Cómo afecta la duración media a los ingresos?',
          answer: 'A mayor duración media de visualización, más tiempo pasa el usuario en el video y mayores son las oportunidades para mostrar anuncios intermedios (mid-rolls), elevando el RPM del canal.',
        },
      ],
    },
    relatedSlugs: ['calculadora-watch-time-youtube', 'calculadora-retencion-youtube', 'calculadora-porcentaje-visto'],
  },

  // 4. Calculadora de Watch Time
  {
    id: 'watch-time-calc',
    slug: 'calculadora-watch-time-youtube',
    name: 'Calculadora de Watch Time (Horas de Reproducción)',
    tagline: 'Proyecta el Tiempo Total de Visualización y Horas de Monetización',
    shortDescription: 'Calcula las horas y minutos de Watch Time generados multiplicando tus visualizaciones por la duración media.',
    category: 'analytics',
    subcategory: 'rendimiento',
    iconName: 'Clock',
    popularRank: 4,
    badge: 'Rendimiento',
    fields: [
      {
        id: 'views',
        label: 'Número Total de Vistas',
        type: 'number',
        defaultValue: 100000,
        min: 1,
        max: 1000000000,
        step: 5000,
        placeholder: 'Ej. 100000',
        tooltip: 'Visualizaciones totales que proyectas o has recibido.',
      },
      {
        id: 'avgDurationMinutes',
        label: 'Duración Media de Visualización (Minutos)',
        type: 'number',
        defaultValue: 4,
        min: 0.1,
        max: 600,
        step: 0.1,
        placeholder: 'Ej. 4',
        tooltip: 'Tiempo medio que dura cada visualización en minutos.',
      },
    ],
    presets: [
      { label: '100.000 vistas × 4 min ➔ 6.666,67 Horas', values: { views: 100000, avgDurationMinutes: 4 } },
      { label: '50.000 vistas × 5 min ➔ 4.166,67 Horas (Monetizable)', values: { views: 50000, avgDurationMinutes: 5 } },
      { label: '20.000 vistas × 3 min ➔ 1.000 Horas', values: { views: 20000, avgDurationMinutes: 3 } },
    ],
    calculate: (inputs) => {
      const views = Number(inputs.views) || 0;
      const avgMinutes = Number(inputs.avgDurationMinutes) || 0;

      if (views <= 0 || avgMinutes <= 0) {
        return {
          primaryValue: '0.00 horas',
          primaryLabel: 'Watch Time Estimado',
          secondaryMetrics: [],
          formulaExplanation: 'Las vistas y la duración media deben ser mayores que 0.',
          recommendations: ['Ingresa las vistas y la duración media.'],
        };
      }

      // Formula:
      // Watch Time minutos = Vistas * Duración media minutos
      // Horas = Minutos / 60
      const { totalMinutes, totalHours, daysEquivalent } = calculateWatchTimeMetrics(views, avgMinutes);
      const isMonetizableProgress = totalHours >= 4000;

      const breakdownData = [
        { name: '10k Vistas', value: Number(((10000 * avgMinutes) / 60).toFixed(1)) },
        { name: '50k Vistas', value: Number(((50000 * avgMinutes) / 60).toFixed(1)) },
        { name: '100k Vistas', value: Number(((100000 * avgMinutes) / 60).toFixed(1)) },
        { name: '250k Vistas', value: Number(((250000 * avgMinutes) / 60).toFixed(1)) },
        { name: 'Tu resultado', value: Number(totalHours.toFixed(1)) },
      ];

      return {
        primaryValue: `${totalHours.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} horas`,
        primaryLabel: 'Watch Time Total Estimado',
        secondaryMetrics: [
          { label: 'Total Minutos', value: `${totalMinutes.toLocaleString('es-ES')} min` },
          { label: 'Equivalente en Días', value: `${daysEquivalent.toFixed(1)} días ininterrumpidos`, highlight: true },
          { label: 'Meta 4.000 Horas YPP', value: isMonetizableProgress ? '¡Meta superada! 🎉' : `${((totalHours / 4000) * 100).toFixed(1)}% completado`, isPositive: isMonetizableProgress },
        ],
        formulaExplanation: `Fórmulas:\n1. Watch Time (minutos) = Vistas × Duración media = ${views.toLocaleString('es-ES')} × ${avgMinutes} = ${totalMinutes.toLocaleString('es-ES')} minutos\n2. Watch Time (horas) = Minutos / 60 = ${totalMinutes.toLocaleString('es-ES')} / 60 = ${totalHours.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} horas`,
        benchmarkText: totalHours >= 4000 ? '¡Superas las 4.000 horas requeridas por el Programa de Socios de YouTube (YPP)!' : `Te faltan ${Math.max(0, 4000 - totalHours).toLocaleString('es-ES', { maximumFractionDigits: 0 })} horas para alcanzar el requisito de 4.000 horas en 365 días.`,
        benchmarkStatus: totalHours >= 4000 ? 'optimal' : 'average',
        recommendations: [
          'Para llegar a 4.000 horas necesitas aproximadamente 60.000 visualizaciones si logras una duración media de 4 minutos.',
          'Crea videos en formato largo (más de 12 minutos) con contenido educativo, guías o análisis para acelerar la acumulación de Watch Time.',
        ],
        breakdownData,
        rawOutput: { totalHours, totalMinutes, daysEquivalent, views, avgMinutes },
      };
    },
    seo: {
      title: 'Calculadora de Watch Time de YouTube - Horas de Reproducción',
      metaDescription: 'Calcula el Watch Time acumulado en horas y minutos según tus visualizaciones y duración media de visualización con fórmula matemática.',
      h1: 'Calculadora de Watch Time de YouTube',
      keywords: ['calculadora watch time youtube', 'calcular horas reproduccion youtube', 'como calcular 4000 horas youtube', 'watch time calculator'],
      summary: 'Descubre cuántas horas y días de visualización acumulan tus videos y cuánto progreso tienes hacia las 4.000 horas de monetización.',
      formulaMarkdown: '`Watch Time Horas = (Vistas * Duración Media en Minutos) / 60`',
      howToSteps: [
        'Introduce el número total de visualizaciones.',
        'Indica la duración media de visualización en minutos.',
        'Haz clic en "Calcular Watch Time".',
        'Revisa el total de horas generadas y el progreso frente al requisito de 4.000 horas.',
      ],
      tipsToImprove: [
        '100.000 vistas con 4 minutos de duración media generan exactamente 6.666,67 horas de reproducción.',
      ],
      faqs: [
        {
          question: '¿Las horas de Shorts cuentan para las 4.000 horas de monetización?',
          answer: 'No. Las horas acumuladas a través del feed vertical de YouTube Shorts no se contabilizan para el requisito de 4.000 horas de videos largos. Shorts tiene su propia meta alternativa (10 millones de vistas en 90 días).',
        },
      ],
    },
    relatedSlugs: ['calculadora-duracion-media-youtube', 'calculadora-retencion-youtube', 'calculadora-vistas-por-hora'],
  },

  // 5. Calculadora de Vistas por Hora
  {
    id: 'vistas-por-hora',
    slug: 'calculadora-vistas-por-hora',
    name: 'Calculadora de Vistas por Hora',
    tagline: 'Mide la Velocidad y Ritmo de Crecimiento de un Video',
    shortDescription: 'Calcula la velocidad de generación de reproducciones por hora, minuto o día a partir de las visualizaciones y el tiempo transcurrido.',
    category: 'analytics',
    subcategory: 'rendimiento',
    iconName: 'Zap',
    popularRank: 5,
    badge: 'Rendimiento',
    fields: [
      {
        id: 'views',
        label: 'Vistas Acumuladas en el Período',
        type: 'number',
        defaultValue: 12000,
        min: 1,
        max: 1000000000,
        step: 500,
        placeholder: 'Ej. 12000',
        tooltip: 'Visualizaciones conseguidas en el lapso de tiempo evaluado.',
      },
      {
        id: 'timeAmount',
        label: 'Tiempo Transcurrido',
        type: 'number',
        defaultValue: 6,
        min: 0.1,
        max: 10000,
        step: 0.5,
        placeholder: 'Ej. 6',
        tooltip: 'Cantidad de tiempo transcurrido.',
      },
      {
        id: 'timeUnit',
        label: 'Unidad de Tiempo',
        type: 'select',
        defaultValue: 'hours',
        options: [
          { label: 'Horas (h)', value: 'hours' },
          { label: 'Minutos (min)', value: 'minutes' },
          { label: 'Días (días)', value: 'days' },
        ],
      },
    ],
    presets: [
      { label: '12.000 vistas en 6 horas ➔ 2.000 vistas/h', values: { views: 12000, timeAmount: 6, timeUnit: 'hours' } },
      { label: '50.000 vistas en 24 horas ➔ 2.083 vistas/h', values: { views: 50000, timeAmount: 24, timeUnit: 'hours' } },
      { label: '5.000 vistas en 120 minutos ➔ 2.500 vistas/h', values: { views: 5000, timeAmount: 120, timeUnit: 'minutes' } },
    ],
    calculate: (inputs) => {
      const views = Number(inputs.views) || 0;
      const timeAmount = Number(inputs.timeAmount) || 0;
      const timeUnit = (inputs.timeUnit as 'minutes' | 'hours' | 'days') || 'hours';

      if (views <= 0 || timeAmount <= 0) {
        return {
          primaryValue: '0 vistas/hora',
          primaryLabel: 'Velocidad de Visualizaciones',
          secondaryMetrics: [],
          formulaExplanation: 'Las vistas y el período de tiempo deben ser mayores que 0.',
          recommendations: ['Ingresa las vistas y el período transcurrido.'],
        };
      }

      // Formula: Vistas por hora = Vistas / Horas
      const { viewsPerHour, viewsPerMinute, viewsPerDay } = calculateViewsPerHour(views, timeAmount, timeUnit);

      const breakdownData = [
        { name: 'Por Minuto', value: Number(viewsPerMinute.toFixed(1)) },
        { name: 'Por Hora', value: Number(viewsPerHour.toFixed(0)) },
        { name: 'Proyección 24h', value: Number(viewsPerDay.toFixed(0)) },
      ];

      return {
        primaryValue: `${Math.round(viewsPerHour).toLocaleString('es-ES')} vistas/hora`,
        primaryLabel: 'Velocidad de Generación de Vistas',
        secondaryMetrics: [
          { label: 'Ritmo por Minuto', value: `${viewsPerMinute.toFixed(1)} vistas/min`, highlight: true },
          { label: 'Ritmo Proyectado Diario', value: `${Math.round(viewsPerDay).toLocaleString('es-ES')} vistas/día` },
          { label: 'Total Registrado', value: `${views.toLocaleString('es-ES')} vistas`, subValue: `en ${timeAmount} ${timeUnit}` },
        ],
        formulaExplanation: `Fórmula: Vistas por hora = Vistas / Horas\nCálculo: ${views.toLocaleString('es-ES')} vistas / ${timeUnit === 'hours' ? timeAmount : (timeAmount / (timeUnit === 'minutes' ? 60 : 1/24)).toFixed(2)} horas = ${Math.round(viewsPerHour).toLocaleString('es-ES')} vistas/hora`,
        benchmarkText: 'La velocidad de vistas durante las primeras 2 a 4 horas tras la publicación indica si el video ha sido acogido con fuerza por tus suscriptores habituales.',
        benchmarkStatus: viewsPerHour >= 1000 ? 'optimal' : 'average',
        recommendations: [
          'Publica en los momentos de mayor actividad de tu audiencia según el informe "Cuándo están tus espectadores en YouTube" de YouTube Studio.',
          'Notifica a tu comunidad en pestañas de comunidad, historias y redes externas durante la primera hora de lanzamiento.',
        ],
        breakdownData,
        rawOutput: { viewsPerHour, viewsPerMinute, viewsPerDay, views, timeAmount, timeUnit },
      };
    },
    seo: {
      title: 'Calculadora de Vistas por Hora en YouTube - Medidor de Velocidad Viral',
      metaDescription: 'Calcula la velocidad de reproducciones por hora de tus videos de YouTube aplicando la fórmula matemática oficial: Vistas / Horas.',
      h1: 'Calculadora de Vistas por Hora en YouTube',
      keywords: ['calculadora vistas por hora youtube', 'calcular velocidad de vistas youtube', 'views per hour youtube formula'],
      summary: 'Mide el ritmo de aceleración y viralidad de tus videos calculando exactamente cuántas visualizaciones por hora y por minuto estás generando.',
      formulaMarkdown: '`Vistas por Hora = Vistas / Horas`',
      howToSteps: [
        'Introduce el número de visualizaciones recibidas.',
        'Ingresa el tiempo transcurrido (en minutos, horas o días).',
        'Haz clic en "Calcular Vistas por Hora".',
      ],
      tipsToImprove: [
        '12.000 vistas en 6 horas representan una velocidad sostenida de 2.000 reproducciones por hora (33,3 vistas por minuto).',
      ],
      faqs: [
        {
          question: '¿Por qué las vistas por hora son cruciales para el algoritmo?',
          answer: 'Un alto ritmo de vistas por hora inmediatamente después de publicar indica al algoritmo que el contenido genera interés urgente, lo que acelera su difusión en la página principal y sugeridos.',
        },
      ],
    },
    relatedSlugs: ['calculadora-watch-time-youtube', 'calculadora-ctr-youtube', 'proyeccion-vistas-youtube'],
  },

  // 6. Calculadora de Porcentaje Visto
  {
    id: 'porcentaje-visto',
    slug: 'calculadora-porcentaje-visto',
    name: 'Calculadora de Porcentaje Visto',
    tagline: 'Determina qué Proporción de un Video se Ha Consumido',
    shortDescription: 'Calcula el porcentaje exacto de un video que ha sido visto a partir del tiempo consumido y la duración total.',
    category: 'analytics',
    subcategory: 'rendimiento',
    iconName: 'Percent',
    popularRank: 6,
    badge: 'Rendimiento',
    fields: [
      {
        id: 'totalDurationMinutes',
        label: 'Duración Total del Video (Minutos)',
        type: 'number',
        defaultValue: 8,
        min: 0.1,
        max: 600,
        step: 0.5,
        placeholder: 'Ej. 8',
        tooltip: 'Duración total de tu video en minutos.',
      },
      {
        id: 'timeWatchedMinutes',
        label: 'Tiempo Visto (Minutos)',
        type: 'number',
        defaultValue: 6,
        min: 0.1,
        max: 600,
        step: 0.5,
        placeholder: 'Ej. 6',
        tooltip: 'Tiempo reproducido por el espectador o duración promedio en minutos.',
      },
    ],
    presets: [
      { label: 'Video 8 min / Tiempo visto 6 min ➔ 75%', values: { totalDurationMinutes: 8, timeWatchedMinutes: 6 } },
      { label: 'Video 10 min / Tiempo visto 5 min ➔ 50%', values: { totalDurationMinutes: 10, timeWatchedMinutes: 5 } },
      { label: 'Video 20 min / Tiempo visto 16 min ➔ 80%', values: { totalDurationMinutes: 20, timeWatchedMinutes: 16 } },
    ],
    calculate: (inputs) => {
      const total = Number(inputs.totalDurationMinutes) || 0;
      const watched = Number(inputs.timeWatchedMinutes) || 0;

      if (total <= 0) {
        return {
          primaryValue: '0.00%',
          primaryLabel: 'Porcentaje Visto',
          secondaryMetrics: [],
          formulaExplanation: 'La duración del video debe ser mayor que 0 minutos.',
          recommendations: ['Introduce la duración del video.'],
        };
      }

      if (watched <= 0) {
        return {
          primaryValue: '0.00%',
          primaryLabel: 'Porcentaje Visto',
          secondaryMetrics: [],
          formulaExplanation: 'El tiempo visto debe ser mayor que 0 minutos.',
          recommendations: ['Introduce el tiempo visto.'],
        };
      }

      // Formula: Porcentaje visto = (Tiempo visto / Duración del video) * 100
      const totalSec = total * 60;
      const watchedSec = watched * 60;
      const percent = calculatePercentageWatched(watchedSec, totalSec);

      const breakdownData = [
        { name: 'Visto (%)', value: Number(percent.toFixed(1)) },
        { name: 'Restante (%)', value: Number(Math.max(0, 100 - percent).toFixed(1)) },
      ];

      return {
        primaryValue: `${percent.toFixed(1)}%`,
        primaryLabel: 'Porcentaje de Video Visto',
        secondaryMetrics: [
          { label: 'Tiempo Reproducido', value: `${watched} min`, highlight: true },
          { label: 'Duración Completa', value: `${total} min` },
          { label: 'Tiempo No Visto', value: `${Math.max(0, total - watched).toFixed(1)} min`, subValue: 'Por espectador' },
        ],
        formulaExplanation: `Fórmula: Porcentaje visto = (Tiempo visto / Duración del video) × 100\nCálculo: (${watched} min / ${total} min) × 100 = ${percent.toFixed(1)}%`,
        benchmarkText: percent >= 70 ? '¡Excelente porcentaje de retención individual!' : 'Un porcentaje mayor al 50% es saludable en la mayoría de nichos de YouTube.',
        benchmarkStatus: percent >= 70 ? 'optimal' : 'average',
        recommendations: [
          'Coloca los puntos más interesantes del video en la segunda mitad para incentivar que el usuario consuma más del 70% de la duración total.',
          'Elimina pantallas finales excesivamente largas que precipitan el abandono antes del cierre del video.',
        ],
        breakdownData,
        rawOutput: { percent, total, watched },
      };
    },
    seo: {
      title: 'Calculadora de Porcentaje Visto de un Video de YouTube',
      metaDescription: 'Calcula el porcentaje de visualización de un video en YouTube con la fórmula: (Tiempo visto / Duración del video) * 100.',
      h1: 'Calculadora de Porcentaje Visto de YouTube',
      keywords: ['calculadora porcentaje visto youtube', 'calcular porcentaje de video visto', 'percentage watched youtube formula'],
      summary: 'Descubre qué proporción exacta de un video ha sido visualizada aplicando el cálculo matemático oficial.',
      formulaMarkdown: '`Porcentaje Visto = (Tiempo Visto / Duración del Video) * 100`',
      howToSteps: [
        'Introduce la duración total del video en minutos.',
        'Introduce el tiempo visto en minutos.',
        'Haz clic en "Calcular Porcentaje Visto".',
      ],
      tipsToImprove: [
        'Un video de 8 minutos con 6 minutos vistos alcanza un 75% de porcentaje visto.',
      ],
      faqs: [
        {
          question: '¿Cuál es la diferencia entre porcentaje visto y retención de audiencia?',
          answer: 'El porcentaje visto mide la proporción consumida para una sesión o espectador en particular, mientras que la retención de audiencia promedia el porcentaje de todos los espectadores que reprodujeron el video.',
        },
      ],
    },
    relatedSlugs: ['calculadora-retencion-youtube', 'calculadora-duracion-media-youtube', 'calculadora-watch-time-youtube'],
  },
];
