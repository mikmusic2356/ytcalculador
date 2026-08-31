import { CalculatorConfig } from '../../types';
import { calculateShortsEarnings, calculateShortsRequiredViews } from '../../utils/mathFormulas';

export const SHORTS_CALCULATORS: CalculatorConfig[] = [
  // 7. Calculadora de Ganancias de Shorts
  {
    id: 'ganancias-shorts',
    slug: 'calculadora-ganancias-shorts',
    name: 'Calculadora de Ganancias de Shorts',
    tagline: 'Estima tus Ingresos con el Fondo Creador y Anuncios de YouTube Shorts',
    shortDescription: 'Calcula cuánto dinero generan tus YouTube Shorts según tus visualizaciones y el RPM específico de formato vertical.',
    category: 'ingresos',
    subcategory: 'shorts',
    iconName: 'Zap',
    popularRank: 10,
    badge: 'Shorts',
    fields: [
      {
        id: 'views',
        label: 'Número de Vistas en Shorts',
        type: 'number',
        defaultValue: 500000,
        min: 1,
        max: 1000000000,
        step: 10000,
        placeholder: 'Ej. 500000',
        tooltip: 'Total de reproducciones que reciben tus Shorts (ej. 500.000 o 1.000.000 vistas).',
      },
      {
        id: 'rpm',
        label: 'RPM Estimado de Shorts ($ USD por 1.000 vistas)',
        type: 'number',
        defaultValue: 0.05,
        min: 0.001,
        max: 5,
        step: 0.01,
        prefix: '$',
        placeholder: 'Ej. 0.05',
        tooltip: 'El RPM de Shorts suele oscilar entre $0.02 y $0.10 USD por cada 1.000 vistas.',
      },
    ],
    presets: [
      { label: '500.000 vistas Shorts (RPM $0.05) ➔ $25 USD', values: { views: 500000, rpm: 0.05 } },
      { label: '1.000.000 vistas Shorts (RPM $0.05) ➔ $50 USD', values: { views: 1000000, rpm: 0.05 } },
      { label: '10.000.000 vistas Shorts (RPM $0.06) ➔ $600 USD', values: { views: 10000000, rpm: 0.06 } },
    ],
    calculate: (inputs) => {
      const views = Number(inputs.views) || 0;
      const rpm = Number(inputs.rpm) || 0;

      if (views <= 0) {
        return {
          primaryValue: '$0.00 USD',
          primaryLabel: 'Ingresos estimados de Shorts',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un número de vistas mayor que 0.',
          recommendations: ['Introduce tus vistas de Shorts.'],
        };
      }

      if (rpm <= 0) {
        return {
          primaryValue: '$0.00 USD',
          primaryLabel: 'Ingresos estimados de Shorts',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un RPM estimado de Shorts mayor que 0.',
          recommendations: ['El RPM de Shorts suele situarse entre $0.02 y $0.08 USD.'],
        };
      }

      // Formula: Ingresos = (Vistas / 1000) * RPM
      const earnings = calculateShortsEarnings(views, rpm);
      const formattedEarnings = `$${earnings.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;

      const breakdownData = [
        { name: '100k Vistas', value: Number(((100000 / 1000) * rpm).toFixed(2)) },
        { name: '500k Vistas', value: Number(((500000 / 1000) * rpm).toFixed(2)) },
        { name: '1M Vistas', value: Number(((1000000 / 1000) * rpm).toFixed(2)) },
        { name: '5M Vistas', value: Number(((5000000 / 1000) * rpm).toFixed(2)) },
        { name: '10M Vistas', value: Number(((10000000 / 1000) * rpm).toFixed(2)) },
      ];

      return {
        primaryValue: formattedEarnings,
        primaryLabel: 'Ingresos estimados de Shorts',
        secondaryMetrics: [
          { label: 'Vistas Evaluadas', value: `${views.toLocaleString('es-ES')} vistas`, subValue: `RPM: $${rpm.toFixed(3)} USD` },
          { label: 'Ingreso por 1 Vista', value: `$${(rpm / 1000).toFixed(6)} USD`, subValue: 'Por reproducción vertical' },
          { label: 'Ingreso por 10M Vistas', value: `$${(rpm * 10000).toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD`, highlight: true },
        ],
        formulaExplanation: `Fórmula: Ingresos = (Vistas / 1000) × RPM\nCálculo: (${views.toLocaleString('es-ES')} / 1.000) × $${rpm.toFixed(3)} = ${formattedEarnings}`,
        benchmarkText: 'Los ingresos de Shorts pueden variar significativamente y el RPM puede ser muy diferente al de los videos largos. Introduzca un RPM estimado para realizar la proyección.',
        benchmarkStatus: rpm >= 0.05 ? 'optimal' : 'average',
        recommendations: [
          'Los ingresos de Shorts pueden variar significativamente y el RPM puede ser muy diferente al de los videos largos. Introduzca un RPM estimado para realizar la proyección.',
          'Los Shorts monetizan mediante un fondo compartido de ingresos publicitarios entre creadores y licencias musicales.',
          'Usa los Shorts como embudo para atraer suscriptores y redirigirlos hacia tus videos largos donde el RPM es entre 20 y 50 veces mayor.',
        ],
        breakdownData,
        rawOutput: { earnings, views, rpm },
      };
    },
    seo: {
      title: 'Calculadora de Ganancias de YouTube Shorts - ¿Cuánto Paga Shorts?',
      metaDescription: 'Calcula cuánto dinero pagan los YouTube Shorts según tus visualizaciones y tu RPM vertical con la fórmula matemática oficial: (Vistas / 1000) * RPM.',
      h1: 'Calculadora de Ganancias de YouTube Shorts',
      keywords: ['calculadora ganancias youtube shorts', 'cuanto paga youtube por 1 millon de vistas en shorts', 'calcular dinero shorts youtube', 'rpm youtube shorts'],
      summary: 'Estima los ingresos publicitarios de tus videos cortos verticales en YouTube aplicando la fórmula matemática (Vistas / 1000) × RPM de Shorts.',
      formulaMarkdown: '`Ingresos Shorts = (Vistas / 1000) * RPM`',
      howToSteps: [
        'Introduce el número de reproducciones en YouTube Shorts (ej. 500.000 vistas).',
        'Ingresa el RPM promedio de Shorts (típicamente $0.03 - $0.08 USD).',
        'Haz clic en "Calcular Ganancias".',
        'Revisa la proyección financiera y advertencia sobre variación de ingresos.',
      ],
      tipsToImprove: [
        '1.000.000 de vistas en Shorts con un RPM de $0.05 generan $50 USD.',
        'El RPM de Shorts es más bajo porque se muestran menos anuncios por minuto que en videos largos.',
      ],
      faqs: [
        {
          question: '¿Por qué el RPM de Shorts es tan inferior al de los videos largos?',
          answer: 'En los Shorts los anuncios no se reproducen en cada video, sino de forma intercalada en el feed vertical, y los ingresos se distribuyen en un fondo global tras cubrir costes de licencias de música.',
        },
      ],
    },
    relatedSlugs: ['calculadora-vistas-shorts-ingresos', 'comparador-videos-largos-shorts', 'calculadora-ganancias-youtube'],
  },

  // 8. Calculadora de Vistas Necesarias para Ganar Dinero con Shorts
  {
    id: 'vistas-shorts',
    slug: 'calculadora-vistas-shorts-ingresos',
    name: 'Calculadora de Vistas Necesarias para Shorts',
    tagline: 'Calcula las Vistas Verticales Requeridas para Alcanzar una Meta de Ingresos',
    shortDescription: 'Descubre cuántas reproducciones en YouTube Shorts necesitas para ganar $100, $500 o cualquier objetivo monetario según tu RPM.',
    category: 'ingresos',
    subcategory: 'shorts',
    iconName: 'Eye',
    popularRank: 11,
    badge: 'Objetivos Shorts',
    fields: [
      {
        id: 'targetRevenue',
        label: 'Objetivo de Ingresos ($ USD)',
        type: 'currency',
        defaultValue: 100,
        min: 1,
        max: 1000000,
        step: 10,
        prefix: '$',
        placeholder: 'Ej. 100',
        tooltip: 'Dinero que deseas ganar con YouTube Shorts.',
      },
      {
        id: 'rpm',
        label: 'RPM Estimado de Shorts ($ USD por 1.000 vistas)',
        type: 'number',
        defaultValue: 0.05,
        min: 0.001,
        max: 5,
        step: 0.01,
        prefix: '$',
        placeholder: 'Ej. 0.05',
        tooltip: 'RPM promedio de tu canal en Shorts (por defecto $0.05 USD).',
      },
      {
        id: 'dailyShortsViews',
        label: 'Vistas Diarias en Shorts (Opcional)',
        type: 'number',
        defaultValue: 50000,
        min: 1,
        max: 100000000,
        step: 1000,
        placeholder: 'Ej. 50000',
      },
    ],
    presets: [
      { label: 'Meta $100 USD (RPM $0.05 ➔ 2M vistas)', values: { targetRevenue: 100, rpm: 0.05, dailyShortsViews: 50000 } },
      { label: 'Meta $500 USD (RPM $0.05 ➔ 10M vistas)', values: { targetRevenue: 500, rpm: 0.05, dailyShortsViews: 100000 } },
      { label: 'Meta $1.000 USD (RPM $0.06 ➔ 16.6M vistas)', values: { targetRevenue: 1000, rpm: 0.06, dailyShortsViews: 200000 } },
    ],
    calculate: (inputs) => {
      const target = Number(inputs.targetRevenue) || 0;
      const rpm = Number(inputs.rpm) || 0;
      const dailyViews = Number(inputs.dailyShortsViews) || 0;

      if (target <= 0) {
        return {
          primaryValue: '0 vistas',
          primaryLabel: 'Vistas necesarias en Shorts',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un objetivo de ingresos mayor que 0.',
          recommendations: ['Ingresa tu meta económica.'],
        };
      }

      if (rpm <= 0) {
        return {
          primaryValue: '0 vistas',
          primaryLabel: 'Vistas necesarias en Shorts',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un RPM estimado de Shorts mayor que 0.',
          recommendations: ['Ingresa tu RPM de Shorts.'],
        };
      }

      // Formula: Vistas necesarias = Math.ceil((Objetivo / RPM) * 1000)
      const { requiredViews, viewsPerDollar } = calculateShortsRequiredViews(target, rpm);
      const daysNeeded = dailyViews > 0 ? Math.ceil(requiredViews / dailyViews) : 0;

      const breakdownData = [
        { name: 'RPM $0.03', value: Math.ceil((target / 0.03) * 1000) },
        { name: 'RPM $0.05', value: Math.ceil((target / 0.05) * 1000) },
        { name: 'RPM $0.08', value: Math.ceil((target / 0.08) * 1000) },
        { name: 'RPM $0.10', value: Math.ceil((target / 0.10) * 1000) },
        { name: `Tu RPM ($${rpm})`, value: requiredViews },
      ];

      return {
        primaryValue: `${requiredViews.toLocaleString('es-ES')} vistas`,
        primaryLabel: `Vistas en Shorts necesarias para ganar $${target.toLocaleString('es-ES')} USD`,
        secondaryMetrics: [
          { label: 'Tiempo Estimado', value: daysNeeded > 0 ? `${daysNeeded} días` : 'Indica vistas/día', highlight: true },
          { label: 'Vistas por Cada $1 Dólar', value: `${viewsPerDollar.toLocaleString('es-ES')} vistas` },
          { label: 'Ingreso Neto por Vista', value: `$${(rpm / 1000).toFixed(6)} USD`, isPositive: true },
        ],
        formulaExplanation: `Fórmula: Vistas necesarias = RedondearArriba((Objetivo / RPM) × 1000)\nCálculo: ($${target} / $${rpm.toFixed(3)}) × 1.000 = ${((target / rpm) * 1000).toFixed(2)} ➔ Redondeado: ${requiredViews.toLocaleString('es-ES')} vistas`,
        benchmarkText: 'Los ingresos de Shorts pueden variar significativamente y el RPM puede ser muy diferente al de los videos largos. El resultado es una estimación matemática proyectada.',
        benchmarkStatus: 'optimal',
        recommendations: [
          'Esta es una estimación basada en el RPM introducido. Los ingresos reales pueden variar.',
          'Para ganar $100 USD con un RPM de $0.05 necesitas 2.000.000 de vistas en YouTube Shorts.',
          'Combina Shorts con videos largos para maximizar el retorno por hora de trabajo.',
        ],
        breakdownData,
        rawOutput: { requiredViews, target, rpm, daysNeeded },
      };
    },
    seo: {
      title: 'Calculadora de Vistas Necesarias para Ganar Dinero con Shorts',
      metaDescription: 'Calcula cuántas visualizaciones en YouTube Shorts necesitas para ganar $100, $500 o $1.000 USD según tu RPM con la fórmula oficial.',
      h1: 'Calculadora de Vistas Necesarias para YouTube Shorts',
      keywords: ['cuantas vistas se necesitan en shorts para ganar dinero', 'vistas necesarias shorts 100 dolares', 'calcular dinero shorts youtube'],
      summary: 'Descubre cuántas reproducciones necesitas acumular en YouTube Shorts para alcanzar tu objetivo de ingresos con la fórmula matemática oficial.',
      formulaMarkdown: '`Vistas Necesarias = Math.ceil((Objetivo / RPM) * 1000)`',
      howToSteps: [
        'Introduce tu objetivo monetario en dólares (ej. $100 USD).',
        'Ingresa tu RPM estimado de Shorts (ej. $0.05).',
        'Haz clic en "Calcular Vistas".',
      ],
      tipsToImprove: [
        'Para ganar $100 USD con Shorts requieres aproximadamente 2 millones de vistas.',
      ],
      faqs: [
        {
          question: '¿Cuántas vistas de Shorts se necesitan para monetizar el canal?',
          answer: 'Para ingresar al Programa de Socios de YouTube mediante Shorts necesitas 1.000 suscriptores y 10 millones de visualizaciones válidas de Shorts en los últimos 90 días.',
        },
      ],
    },
    relatedSlugs: ['calculadora-ganancias-shorts', 'comparador-videos-largos-shorts', 'vistas-para-ganar-100-dolares'],
  },
];
