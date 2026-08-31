import { CalculatorConfig } from '../../types';
import {
  calculateCountryRPMComparison,
  calculateViewMilestones,
  calculateLongVsShorts,
  DEFAULT_SAMPLE_COUNTRIES,
} from '../../utils/mathFormulas';

export const COMPARISON_CALCULATORS: CalculatorConfig[] = [
  // 9. Comparador de RPM por País
  {
    id: 'comparador-paises',
    slug: 'comparador-rpm-pais',
    name: 'Comparador de RPM por País',
    tagline: 'Compara tus Ingresos Estimados según la Procedencia de la Audiencia',
    shortDescription: 'Descubre cómo cambian los ingresos para una misma cantidad de visualizaciones según el país de los espectadores con datos de ejemplo y comparativas en tiempo real.',
    category: 'ingresos',
    subcategory: 'comparacion',
    iconName: 'Globe',
    popularRank: 12,
    badge: 'Comparador',
    fields: [
      {
        id: 'views',
        label: 'Número de Visualizaciones Totales',
        type: 'number',
        defaultValue: 100000,
        min: 1,
        max: 1000000000,
        step: 10000,
        placeholder: 'Ej. 100000',
        tooltip: 'Cantidad de visualizaciones a proyectar en cada país (ej. 100.000 vistas).',
      },
    ],
    presets: [
      { label: '100.000 Vistas globales', values: { views: 100000 } },
      { label: '500.000 Vistas globales', values: { views: 500000 } },
      { label: '1.000.000 Vistas globales', values: { views: 1000000 } },
    ],
    calculate: (inputs) => {
      const views = Number(inputs.views) || 0;

      if (views <= 0) {
        return {
          primaryValue: '$0.00 USD',
          primaryLabel: 'Ingresos por País',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un número de vistas mayor que 0.',
          recommendations: ['Introduce las visualizaciones a comparar entre países.'],
        };
      }

      // Calculate country comparison
      const comparisons = calculateCountryRPMComparison(views, DEFAULT_SAMPLE_COUNTRIES);
      const usaItem = comparisons.find((c) => c.countryCode === 'US') || comparisons[0];
      const espItem = comparisons.find((c) => c.countryCode === 'ES') || comparisons[1];
      const latamItem = comparisons.find((c) => c.countryCode === 'MX') || comparisons[2];

      const breakdownData = comparisons.slice(0, 6).map((c) => ({
        name: `${c.flag} ${c.countryName.split(' ')[0]}`,
        value: Number(c.estimatedEarnings.toFixed(2)),
      }));

      return {
        primaryValue: `$${usaItem.estimatedEarnings.toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD (EE.UU.)`,
        primaryLabel: `Ingresos en EE.UU. por ${views.toLocaleString('es-ES')} vistas`,
        secondaryMetrics: [
          { label: '🇺🇸 Estados Unidos (RPM $5.00)', value: `$${usaItem.estimatedEarnings.toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD`, highlight: true },
          { label: '🇪🇸 España (RPM $2.90)', value: `$${espItem.estimatedEarnings.toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD` },
          { label: '🇲🇽 México (RPM $1.40)', value: `$${latamItem.estimatedEarnings.toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD` },
        ],
        formulaExplanation: `Fórmula para cada país: Ingresos = (Vistas / 1000) × RPM País\nEjemplo EE.UU.: (${views.toLocaleString('es-ES')} / 1.000) × $5.00 = $${usaItem.estimatedEarnings.toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD`,
        benchmarkText: 'Los valores de RPM utilizados son estimaciones y pueden variar según canal, audiencia, contenido, temporada y otros factores. Todos los datos se proporcionan como referencia educativa.',
        benchmarkStatus: 'optimal',
        recommendations: [
          'Los valores de RPM utilizados son estimaciones y pueden variar según canal, audiencia, contenido, temporada y otros factores.',
          'Una audiencia de países con alto poder adquisitivo (EE.UU., Reino Unido, Alemania, España) genera hasta 4 a 6 veces más ingresos por la misma cantidad de reproducciones.',
          'Considera subtitular tus videos en inglés o crear pistas de audio secundarias en varios idiomas.',
        ],
        breakdownData,
        rawOutput: { comparisons, views },
      };
    },
    seo: {
      title: 'Comparador de RPM por País en YouTube - ¿Cuánto Paga Cada País?',
      metaDescription: 'Compara cuánto paga YouTube por 100.000 o 1.000.000 de vistas en Estados Unidos, España, México, Colombia, Argentina y más países con datos de ejemplo actualizados.',
      h1: 'Comparador de RPM por País en YouTube',
      keywords: ['comparador rpm por pais youtube', 'cuanto paga youtube en estados unidos vs espana', 'rpm youtube mexico colombia', 'ingresos youtube por pais'],
      summary: 'Analiza las diferencias de ingresos publicitarios en YouTube según el país de procedencia de tu audiencia con fórmulas y datos de referencia claros.',
      formulaMarkdown: '`Ingresos País = (Vistas / 1000) * RPM_País`',
      howToSteps: [
        'Introduce el volumen de visualizaciones totales que deseas contrastar (ej. 100.000 vistas).',
        'Haz clic en "Calcular Comparación".',
        'Analiza la tabla y gráfica con el RPM estimado e ingresos para cada país.',
      ],
      tipsToImprove: [
        '100.000 vistas en EE.UU. ($500 USD) generan más de 3 veces los ingresos que en México ($140 USD).',
      ],
      faqs: [
        {
          question: '¿Por qué el RPM varía tanto entre países?',
          answer: 'El RPM depende del presupuesto de los anunciantes en cada mercado geográfico. En países con mayor poder de compra y comercio digital, las marcas pagan pujas de CPM más elevadas por impactar al público.',
        },
      ],
    },
    relatedSlugs: ['calculadora-rpm-youtube', 'comparador-ingresos-vistas', 'calculadora-ganancias-youtube'],
  },

  // 10. Comparador de Ingresos por Cantidad de Vistas
  {
    id: 'comparador-vistas',
    slug: 'comparador-ingresos-vistas',
    name: 'Comparador de Ingresos por Cantidad de Vistas',
    tagline: 'Genera una Tabla de Escenarios desde 1.000 hasta 1.000.000 de Vistas',
    shortDescription: 'Introduce tu RPM y genera automáticamente una tabla comparativa con los ingresos generados para 1k, 10k, 50k, 100k, 500k y 1M de visualizaciones.',
    category: 'ingresos',
    subcategory: 'comparacion',
    iconName: 'Layers',
    popularRank: 13,
    badge: 'Escalones de Tráfico',
    fields: [
      {
        id: 'rpm',
        label: 'Tu RPM Estimado ($ USD por 1.000 vistas)',
        type: 'number',
        defaultValue: 3.5,
        min: 0.01,
        max: 100,
        step: 0.1,
        prefix: '$',
        placeholder: 'Ej. 3.50',
        tooltip: 'Tu ingreso promedio por cada 1.000 reproducciones.',
      },
    ],
    presets: [
      { label: 'RPM $3.50 (Estándar)', values: { rpm: 3.5 } },
      { label: 'RPM $2.00 (General)', values: { rpm: 2.0 } },
      { label: 'RPM $8.00 (Finanzas/Tech)', values: { rpm: 8.0 } },
    ],
    calculate: (inputs) => {
      const rpm = Number(inputs.rpm) || 0;

      if (rpm <= 0) {
        return {
          primaryValue: '$0.00 USD',
          primaryLabel: 'Escala de Ingresos',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un RPM mayor que 0.',
          recommendations: ['Introduce tu RPM para generar la tabla de escenarios.'],
        };
      }

      // Calculate milestone scenarios
      const milestones = calculateViewMilestones(rpm);
      const oneMillion = milestones.find((m) => m.views === 1000000)?.earnings || 0;
      const hundredK = milestones.find((m) => m.views === 100000)?.earnings || 0;
      const tenK = milestones.find((m) => m.views === 10000)?.earnings || 0;

      const breakdownData = milestones.map((m) => ({
        name: m.views >= 1000000 ? `${m.views / 1000000}M` : `${m.views / 1000}k`,
        value: Number(m.earnings.toFixed(2)),
      }));

      return {
        primaryValue: `$${oneMillion.toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD (por 1M vistas)`,
        primaryLabel: `Ingresos por 1.000.000 de vistas con RPM $${rpm.toFixed(2)}`,
        secondaryMetrics: [
          { label: '10.000 Vistas', value: `$${tenK.toFixed(2)} USD`, subValue: `(${tenK / 10} USD / 1k)` },
          { label: '100.000 Vistas', value: `$${hundredK.toFixed(2)} USD`, highlight: true },
          { label: '1.000.000 Vistas', value: `$${oneMillion.toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD`, isPositive: true },
        ],
        formulaExplanation: `Fórmula para cada escalón: Ingresos = (Vistas / 1000) × RPM\n• 1.000 vistas: (1.000 / 1.000) × $${rpm.toFixed(2)} = $${(rpm * 1).toFixed(2)} USD\n• 10.000 vistas: (10.000 / 1.000) × $${rpm.toFixed(2)} = $${tenK.toFixed(2)} USD\n• 50.000 vistas: (50.000 / 1.000) × $${rpm.toFixed(2)} = $${((50000 / 1000) * rpm).toFixed(2)} USD\n• 100.000 vistas: (100.000 / 1.000) × $${rpm.toFixed(2)} = $${hundredK.toFixed(2)} USD\n• 500.000 vistas: (500.000 / 1.000) × $${rpm.toFixed(2)} = $${((500000 / 1000) * rpm).toFixed(2)} USD\n• 1.000.000 vistas: (1.000.000 / 1.000) × $${rpm.toFixed(2)} = $${oneMillion.toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD`,
        benchmarkText: 'Esta tabla representa una estimación matemática basada en el RPM ingresado. Los ingresos reales pueden variar según la procedencia geográfica y tipo de anuncios mostrados.',
        benchmarkStatus: 'optimal',
        recommendations: [
          'Esta es una estimación basada en el RPM introducido. Los ingresos reales pueden variar.',
          'Cada 100.000 vistas representan exactamente $' + hundredK.toFixed(2) + ' USD con tu RPM de $' + rpm.toFixed(2) + ' USD.',
        ],
        breakdownData,
        rawOutput: { milestones, rpm },
      };
    },
    seo: {
      title: 'Comparador de Ingresos por Cantidad de Vistas en YouTube (1k a 1M)',
      metaDescription: 'Descubre cuánto dinero ganas por 1.000, 10.000, 50.000, 100.000, 500.000 y 1.000.000 de vistas en YouTube según tu RPM con nuestra tabla comparativa.',
      h1: 'Comparador de Ingresos por Cantidad de Vistas',
      keywords: ['cuanto paga youtube por 10000 vistas', 'cuanto paga youtube por 100000 vistas', 'cuanto paga youtube por 1 millon de visitas', 'tabla ingresos youtube vistas'],
      summary: 'Consulta la tabla completa de ingresos proyectados en YouTube desde mil hasta un millón de reproducciones con cálculo matemático exacto.',
      formulaMarkdown: '`Ingresos = (Vistas / 1000) * RPM`',
      howToSteps: [
        'Introduce tu RPM estimado (ej. $3.50 USD).',
        'Haz clic en "Calcular Comparación".',
        'Explora la tabla con los 6 escenarios de tráfico y su gráfico evolutivo.',
      ],
      tipsToImprove: [
        'Con RPM de $3.50: 10k vistas = $35, 100k vistas = $350, 1M vistas = $3.500 USD.',
      ],
      faqs: [
        {
          question: '¿Los ingresos crecen de forma lineal con las vistas?',
          answer: 'Sí, a nivel matemático la fórmula es directamente proporcional. Sin embargo, a medida que un video se vuelve masivamente viral, el RPM puede variar ligeramente si atrae público de otros países.',
        },
      ],
    },
    relatedSlugs: ['calculadora-ganancias-youtube', 'comparador-rpm-pais', 'vistas-para-ganar-100-dolares'],
  },

  // 11. Comparador Video Largo vs Shorts
  {
    id: 'comparador-largo-shorts',
    slug: 'comparador-videos-largos-shorts',
    name: 'Comparador Video Largo vs Shorts',
    tagline: 'Compara Rendimiento Financiero y Vistas entre Formato Horizontal y Vertical',
    shortDescription: 'Calcula y compara lado a lado los ingresos de tus videos largos tradicionales vs YouTube Shorts y descubre el total combinado.',
    category: 'ingresos',
    subcategory: 'comparacion',
    iconName: 'Split',
    popularRank: 14,
    badge: 'Largo vs Shorts',
    fields: [
      {
        id: 'longViews',
        label: 'Vistas en Videos Largos',
        type: 'number',
        defaultValue: 50000,
        min: 1,
        max: 1000000000,
        step: 5000,
        placeholder: 'Ej. 50000',
        tooltip: 'Vistas mensuales o de un video en formato horizontal tradicional.',
      },
      {
        id: 'longRpm',
        label: 'RPM Videos Largos ($ USD por 1.000 vistas)',
        type: 'number',
        defaultValue: 3.5,
        min: 0.01,
        max: 100,
        step: 0.1,
        prefix: '$',
        placeholder: 'Ej. 3.50',
        tooltip: 'RPM típico para videos tradicionales (ej. $2.00 - $6.00 USD).',
      },
      {
        id: 'shortsViews',
        label: 'Vistas en YouTube Shorts',
        type: 'number',
        defaultValue: 1000000,
        min: 1,
        max: 1000000000,
        step: 50000,
        placeholder: 'Ej. 1000000',
        tooltip: 'Vistas mensuales o de videos en formato vertical.',
      },
      {
        id: 'shortsRpm',
        label: 'RPM YouTube Shorts ($ USD por 1.000 vistas)',
        type: 'number',
        defaultValue: 0.05,
        min: 0.001,
        max: 5,
        step: 0.01,
        prefix: '$',
        placeholder: 'Ej. 0.05',
        tooltip: 'RPM típico para Shorts (ej. $0.03 - $0.08 USD).',
      },
    ],
    presets: [
      { label: 'Canal Mixto (50k Largos / 1M Shorts)', values: { longViews: 50000, longRpm: 3.5, shortsViews: 1000000, shortsRpm: 0.05 } },
      { label: 'Enfocado en Shorts (10k Largos / 5M Shorts)', values: { longViews: 10000, longRpm: 3.0, shortsViews: 5000000, shortsRpm: 0.05 } },
      { label: 'Enfocado en Largos (200k Largos / 200k Shorts)', values: { longViews: 200000, longRpm: 4.0, shortsViews: 200000, shortsRpm: 0.05 } },
    ],
    calculate: (inputs) => {
      const longViews = Number(inputs.longViews) || 0;
      const longRpm = Number(inputs.longRpm) || 0;
      const shortsViews = Number(inputs.shortsViews) || 0;
      const shortsRpm = Number(inputs.shortsRpm) || 0;

      // Fórmulas:
      // Video largo: (Vistas largas / 1000) * RPM largo
      // Shorts: (Vistas Shorts / 1000) * RPM Shorts
      // Total: Ingresos largos + Ingresos Shorts
      const result = calculateLongVsShorts(longViews, longRpm, shortsViews, shortsRpm);

      const breakdownData = [
        { name: 'Videos Largos', value: Number(result.longEarnings.toFixed(2)) },
        { name: 'YouTube Shorts', value: Number(result.shortsEarnings.toFixed(2)) },
        { name: 'Total Combinado', value: Number(result.totalEarnings.toFixed(2)) },
      ];

      return {
        primaryValue: `$${result.totalEarnings.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`,
        primaryLabel: 'Ingresos Totales Combinados (Largos + Shorts)',
        secondaryMetrics: [
          { label: 'Ingresos Videos Largos', value: `$${result.longEarnings.toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD`, subValue: `${longViews.toLocaleString('es-ES')} vistas @ $${longRpm} RPM`, highlight: true },
          { label: 'Ingresos YouTube Shorts', value: `$${result.shortsEarnings.toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD`, subValue: `${shortsViews.toLocaleString('es-ES')} vistas @ $${shortsRpm} RPM` },
          { label: 'Relación de RPM', value: `${result.viewsDifferenceRatio}x`, subValue: 'RPM Largo vs Shorts', isPositive: true },
        ],
        formulaExplanation: `Fórmulas aplicadas:
1. Videos Largos = (${longViews.toLocaleString('es-ES')} / 1.000) × $${longRpm.toFixed(2)} = $${result.longEarnings.toFixed(2)} USD
2. YouTube Shorts = (${shortsViews.toLocaleString('es-ES')} / 1.000) × $${shortsRpm.toFixed(3)} = $${result.shortsEarnings.toFixed(2)} USD
3. Total Combinado = $${result.longEarnings.toFixed(2)} + $${result.shortsEarnings.toFixed(2)} = $${result.totalEarnings.toFixed(2)} USD`,
        benchmarkText: 'El RPM de Shorts y de videos largos no deben asumirse iguales. Los videos largos permiten pausas intermedias y mayor tiempo de visualización, mientras que los Shorts distribuyen un fondo publicitario compartido.',
        benchmarkStatus: 'optimal',
        recommendations: [
          'El RPM de Shorts y de videos largos no deben asumirse iguales.',
          '50.000 vistas en videos largos generan más ingresos ($' + result.longEarnings.toFixed(2) + ' USD) que 1.000.000 de vistas en Shorts ($' + result.shortsEarnings.toFixed(2) + ' USD) debido a la gran diferencia de RPM.',
          'Usa YouTube Shorts para acelerar el crecimiento de suscriptores y los videos largos para monetizar tu tiempo eficientemente.',
        ],
        breakdownData,
        rawOutput: result,
      };
    },
    seo: {
      title: 'Comparador Video Largo vs Shorts en YouTube - ¿Qué Paga Más?',
      metaDescription: 'Compara cuánto dinero ganas con videos largos vs YouTube Shorts. Descubre la diferencia de RPM, ingresos totales combinados y fórmulas matemáticas.',
      h1: 'Comparador de Ingresos: Video Largo vs YouTube Shorts',
      keywords: ['comparador videos largos vs shorts youtube', 'que paga mas videos largos o shorts youtube', 'diferencia rpm shorts y videos largos'],
      summary: 'Descubre la rentabilidad real de los videos largos comparada con YouTube Shorts mediante fórmulas transparentes y análisis lado a lado.',
      formulaMarkdown: '`Total = ((Vistas Largas/1000) * RPM Largo) + ((Vistas Shorts/1000) * RPM Shorts)`',
      howToSteps: [
        'Introduce las visualizaciones y RPM de tus videos largos.',
        'Introduce las visualizaciones y RPM estimado de tus YouTube Shorts.',
        'Haz clic en "Calcular Comparación".',
        'Revisa el balance de ingresos y el ratio de rendimiento por formato.',
      ],
      tipsToImprove: [
        'El RPM de videos largos suele ser entre 30x y 70x superior al de YouTube Shorts.',
      ],
      faqs: [
        {
          question: '¿Conviene más hacer Shorts o videos largos para ganar dinero?',
          answer: 'Para monetización pura mediante AdSense, los videos largos generan significativamente más dinero por hora de visualización. Sin embargo, los Shorts son excelentes para ganar suscriptores rápidamente.',
        },
      ],
    },
    relatedSlugs: ['calculadora-ganancias-shorts', 'calculadora-ganancias-youtube', 'comparador-ingresos-vistas'],
  },
];
