import { CalculatorConfig } from '../../types';
import {
  calculateSubscriberConversion,
  calculateSubsPerThousandViews,
  calculateViewsNeededForSubscribers,
  calculateGrowthPercentage,
} from '../../utils/mathFormulas';

export const ANALYTICS_AUDIENCE_CALCULATORS: CalculatorConfig[] = [
  // 1. Calculadora de Conversión a Suscriptores
  {
    id: 'conversion-suscriptores',
    slug: 'calculadora-conversion-suscriptores',
    name: 'Calculadora de Conversión a Suscriptores',
    tagline: 'Mide la Capacidad de tus Videos para Convertir Espectadores en Fieles Suscriptores',
    shortDescription: 'Calcula el porcentaje de conversión a suscriptores y los suscriptores obtenidos por cada 1.000 vistas en YouTube.',
    category: 'analytics',
    subcategory: 'audiencia',
    iconName: 'UserCheck',
    popularRank: 7,
    badge: 'Audiencia',
    fields: [
      {
        id: 'views',
        label: 'Visualizaciones Totales del Video o Período',
        type: 'number',
        defaultValue: 100000,
        min: 1,
        max: 1000000000,
        step: 5000,
        placeholder: 'Ej. 100000',
        tooltip: 'Número de vistas registradas en el video o canal.',
      },
      {
        id: 'subscribers',
        label: 'Nuevos Suscriptores Ganados',
        type: 'number',
        defaultValue: 1500,
        min: 1,
        max: 100000000,
        step: 50,
        placeholder: 'Ej. 1500',
        tooltip: 'Suscriptores netos sumados gracias a ese contenido.',
      },
    ],
    presets: [
      { label: '100.000 vistas / 1.500 subs ➔ 1.50% (15 subs/1k vistas)', values: { views: 100000, subscribers: 1500 } },
      { label: '50.000 vistas / 250 subs ➔ 0.50% (5 subs/1k vistas)', values: { views: 50000, subscribers: 250 } },
      { label: '200.000 vistas / 6.000 subs ➔ 3.00% (30 subs/1k vistas)', values: { views: 200000, subscribers: 6000 } },
    ],
    calculate: (inputs) => {
      const views = Number(inputs.views) || 0;
      const subs = Number(inputs.subscribers) || 0;

      if (views <= 0 || subs <= 0) {
        return {
          primaryValue: '0.00%',
          primaryLabel: 'Tasa de Conversión',
          secondaryMetrics: [],
          formulaExplanation: 'Las visualizaciones y suscriptores deben ser mayores que 0.',
          recommendations: ['Ingresa valores mayores a 0.'],
        };
      }

      // Formula: Conversión (%) = (Nuevos suscriptores / Vistas) * 100
      const { conversionRate, subsPerThousandViews, viewsPerSubscriber } = calculateSubscriberConversion(subs, views);

      let status: 'optimal' | 'average' | 'needs-work' | 'info' = 'average';
      let benchmark = 'Tu tasa de conversión se encuentra en el promedio estándar de YouTube (0.5% - 1.5%).';
      if (conversionRate >= 2.0) {
        status = 'optimal';
        benchmark = '¡Excelente conversión! Tus llamadas a la acción y contenido fidelizan a la audiencia a un ritmo superior.';
      } else if (conversionRate < 0.4) {
        status = 'needs-work';
        benchmark = 'Conversión baja. Prueba incluir una llamada a la acción contextualizada a mitad del video explicando el beneficio de suscribirse.';
      }

      const breakdownData = [
        { name: 'Suscriptores Ganados', value: subs },
        { name: 'Espectadores no suscritos', value: Math.max(0, views - subs) },
      ];

      return {
        primaryValue: `${conversionRate.toFixed(2)}%`,
        primaryLabel: 'Tasa de Conversión a Suscriptores',
        secondaryMetrics: [
          { label: 'Subs por Cada 1.000 Vistas', value: `${subsPerThousandViews.toFixed(1)} subs/1k`, highlight: true, isPositive: subsPerThousandViews >= 10 },
          { label: '1 Suscriptor Cada', value: `${viewsPerSubscriber.toLocaleString('es-ES')} vistas` },
          { label: 'Total Ganado', value: `+${subs.toLocaleString('es-ES')} suscriptores` },
        ],
        formulaExplanation: `Fórmulas matemáticas:\n1. Conversión a suscriptores (%) = (Nuevos suscriptores / Vistas) × 100\n   ➔ (${subs.toLocaleString('es-ES')} / ${views.toLocaleString('es-ES')}) × 100 = ${conversionRate.toFixed(2)}%\n2. Suscriptores por 1.000 vistas = (Nuevos suscriptores / Vistas) × 1.000\n   ➔ (${subs.toLocaleString('es-ES')} / ${views.toLocaleString('es-ES')}) × 1.000 = ${subsPerThousandViews.toFixed(1)} subs`,
        benchmarkText: benchmark,
        benchmarkStatus: status,
        recommendations: [
          'Agrega una llamada a la acción verbal mostrando en pantalla una animación clara de suscripción en el momento culminante del video.',
          'Ofrece una razón clara para suscribirse (ej. "Suscríbete para ver la segunda parte de este experimento la próxima semana").',
        ],
        breakdownData,
        rawOutput: { conversionRate, subsPerThousandViews, viewsPerSubscriber, views, subs },
      };
    },
    seo: {
      title: 'Calculadora de Conversión a Suscriptores en YouTube - Fórmula Oficial',
      metaDescription: 'Calcula tu tasa de conversión a suscriptores y suscriptores por 1.000 vistas en YouTube con la fórmula: (Suscriptores / Vistas) * 100.',
      h1: 'Calculadora de Conversión a Suscriptores en YouTube',
      keywords: ['calculadora conversion suscriptores youtube', 'tasa conversion suscriptores youtube', 'como calcular suscriptores por vistas youtube'],
      summary: 'Descubre qué porcentaje de espectadores decide suscribirse a tu canal tras ver tus videos y compáralo con el promedio del sector.',
      formulaMarkdown: '`Conversión (%) = (Nuevos Suscriptores / Vistas) * 100`',
      howToSteps: [
        'Ingresa el número total de visualizaciones analizadas.',
        'Ingresa los nuevos suscriptores netos obtenidos en ese lapso.',
        'Haz clic en "Calcular Conversión".',
        'Analiza tu tasa de conversión y los suscriptores por cada 1.000 vistas.',
      ],
      tipsToImprove: [
        '100.000 vistas y 1.500 suscriptores representan un 1,5% de conversión (15 suscriptores por cada 1.000 reproducciones).',
      ],
      faqs: [
        {
          question: '¿Cuál es una buena tasa de conversión a suscriptores?',
          answer: 'En canales temáticos de nicho o tutoriales con alto valor práctico, una tasa entre el 1% y el 2,5% es excelente. En contenido de entretenimiento general o Shorts, suele situarse entre el 0,3% y el 0,8%.',
        },
      ],
    },
    relatedSlugs: ['calculadora-suscriptores-por-mil-vistas', 'calculadora-vistas-para-suscriptores', 'calculadora-crecimiento-suscriptores'],
  },

  // 2. Calculadora de Suscriptores por cada 1.000 Vistas
  {
    id: 'subs-por-mil-vistas',
    slug: 'calculadora-suscriptores-por-mil-vistas',
    name: 'Calculadora de Suscriptores por Cada 1.000 Vistas',
    tagline: 'Mide la Densidad de Suscripción por Cada Millar de Reproducciones',
    shortDescription: 'Calcula cuántos suscriptores ganas de promedio por cada 1.000 visualizaciones en tus videos de YouTube.',
    category: 'analytics',
    subcategory: 'audiencia',
    iconName: 'Users',
    popularRank: 8,
    badge: 'Audiencia',
    fields: [
      {
        id: 'views',
        label: 'Vistas Totales',
        type: 'number',
        defaultValue: 50000,
        min: 1,
        max: 1000000000,
        step: 5000,
        placeholder: 'Ej. 50000',
        tooltip: 'Visualizaciones totales registradas.',
      },
      {
        id: 'subscribers',
        label: 'Suscriptores Obtenidos',
        type: 'number',
        defaultValue: 750,
        min: 1,
        max: 100000000,
        step: 50,
        placeholder: 'Ej. 750',
        tooltip: 'Suscriptores ganados con esas vistas.',
      },
    ],
    presets: [
      { label: '50.000 vistas / 750 subs ➔ 15 subs/1k vistas', values: { views: 50000, subscribers: 750 } },
      { label: '100.000 vistas / 800 subs ➔ 8 subs/1k vistas', values: { views: 100000, subscribers: 800 } },
      { label: '25.000 vistas / 625 subs ➔ 25 subs/1k vistas', values: { views: 25000, subscribers: 625 } },
    ],
    calculate: (inputs) => {
      const views = Number(inputs.views) || 0;
      const subs = Number(inputs.subscribers) || 0;

      if (views <= 0 || subs <= 0) {
        return {
          primaryValue: '0 subs/1k vistas',
          primaryLabel: 'Suscriptores por 1.000 Vistas',
          secondaryMetrics: [],
          formulaExplanation: 'Las vistas y los suscriptores deben ser mayores que 0.',
          recommendations: ['Introduce valores positivos.'],
        };
      }

      // Formula: Suscriptores por 1.000 vistas = (Suscriptores / Vistas) * 1.000
      const subsPerMil = calculateSubsPerThousandViews(subs, views);
      const conversionPercent = (subs / views) * 100;
      const viewsPerSub = Math.round(views / subs);

      const breakdownData = [
        { name: '10.000 vistas', value: Math.round(subsPerMil * 10) },
        { name: '50.000 vistas', value: Math.round(subsPerMil * 50) },
        { name: '100.000 vistas', value: Math.round(subsPerMil * 100) },
        { name: '500.000 vistas', value: Math.round(subsPerMil * 500) },
      ];

      return {
        primaryValue: `${subsPerMil.toFixed(1)} subs/1k`,
        primaryLabel: 'Suscriptores por Cada 1.000 Vistas',
        secondaryMetrics: [
          { label: 'Equivalente en Porcentaje', value: `${conversionPercent.toFixed(2)}%`, highlight: true },
          { label: '1 Nuevo Suscriptor Cada', value: `${viewsPerSub.toLocaleString('es-ES')} vistas` },
          { label: 'Suscriptores en 100k Vistas', value: `${Math.round(subsPerMil * 100).toLocaleString('es-ES')} subs` },
        ],
        formulaExplanation: `Fórmula: Suscriptores por 1.000 vistas = (Suscriptores / Vistas) × 1.000\nCálculo: (${subs.toLocaleString('es-ES')} / ${views.toLocaleString('es-ES')}) × 1.000 = ${subsPerMil.toFixed(1)} suscriptores por cada 1.000 reproducciones.`,
        benchmarkText: subsPerMil >= 10 ? '¡Excelente densidad de suscriptores! Promedias más de 10 suscriptores por cada 1.000 vistas.' : 'El promedio de YouTube ronda entre 5 y 12 suscriptores por cada 1.000 vistas.',
        benchmarkStatus: subsPerMil >= 10 ? 'optimal' : 'average',
        recommendations: [
          'Vincula videos en tarjetas y pantallas finales con temáticas afines para aumentar la probabilidad de suscripción múltiple.',
          'Crea series de contenido temáticas estructuradas en listas de reproducción.',
        ],
        breakdownData,
        rawOutput: { subsPerMil, conversionPercent, viewsPerSub, views, subs },
      };
    },
    seo: {
      title: 'Calculadora de Suscriptores por Cada 1.000 Vistas en YouTube',
      metaDescription: 'Calcula cuántos suscriptores ganas por cada 1.000 visualizaciones en YouTube con la fórmula matemática: (Suscriptores / Vistas) * 1.000.',
      h1: 'Calculadora de Suscriptores por Cada 1.000 Vistas',
      keywords: ['calculadora suscriptores por mil vistas', 'suscriptores por cada 1000 vistas youtube', 'calcular conversion subs youtube'],
      summary: 'Descubre cuántos suscriptores obtienes por cada millar de vistas y proyecta el crecimiento futuro de tu comunidad.',
      formulaMarkdown: '`Subs por 1.000 Vistas = (Suscriptores / Vistas) * 1.000`',
      howToSteps: [
        'Ingresa el número total de visualizaciones.',
        'Ingresa el número de suscriptores obtenidos.',
        'Haz clic en "Calcular Suscriptores por 1.000 Vistas".',
      ],
      tipsToImprove: [
        '50.000 vistas con 750 suscriptores representan exactamente 15 suscriptores por cada 1.000 reproducciones.',
      ],
      faqs: [
        {
          question: '¿Por qué calcular los suscriptores por 1.000 vistas es útil?',
          answer: 'Permite comparar el rendimiento de videos con diferente número de vistas de manera neutral y estandarizada, identificando qué formatos son más efectivos atrayendo comunidad.',
        },
      ],
    },
    relatedSlugs: ['calculadora-conversion-suscriptores', 'calculadora-vistas-para-suscriptores', 'proyeccion-suscriptores-youtube'],
  },

  // 3. Calculadora de Vistas Necesarias para Conseguir Suscriptores
  {
    id: 'vistas-para-suscriptores',
    slug: 'calculadora-vistas-para-suscriptores',
    name: 'Calculadora de Vistas Necesarias para Conseguir Suscriptores',
    tagline: 'Calcula el Tráfico Requerido para Alcanzar tus Metas de Comunidad',
    shortDescription: 'Calcula cuántas visualizaciones necesitas para alcanzar un objetivo de suscriptores (1.000, 10.000, 100.000) según tu tasa de conversión.',
    category: 'analytics',
    subcategory: 'audiencia',
    iconName: 'Target',
    popularRank: 9,
    badge: 'Audiencia',
    fields: [
      {
        id: 'targetSubscribers',
        label: 'Suscriptores Objetivo a Conseguir',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        max: 100000000,
        step: 100,
        placeholder: 'Ej. 1000',
        tooltip: 'Número de suscriptores que deseas alcanzar (ej. 1.000 para monetizar).',
      },
      {
        id: 'conversionRate',
        label: 'Tasa de Conversión a Suscriptores (%)',
        type: 'number',
        defaultValue: 1.0,
        min: 0.01,
        max: 50,
        step: 0.1,
        placeholder: 'Ej. 1.0',
        tooltip: 'Porcentaje habitual de espectadores que se suscriben en tu canal (el estándar es 1.0%).',
      },
    ],
    presets: [
      { label: 'Meta 1.000 Subs con 1.0% de Conversión ➔ 100.000 Vistas', values: { targetSubscribers: 1000, conversionRate: 1.0 } },
      { label: 'Meta 10.000 Subs con 1.5% de Conversión ➔ 666.667 Vistas', values: { targetSubscribers: 1000, conversionRate: 1.5 } },
      { label: 'Meta 1.000 Subs con 0.5% de Conversión ➔ 200.000 Vistas', values: { targetSubscribers: 1000, conversionRate: 0.5 } },
    ],
    calculate: (inputs) => {
      const targetSubs = Number(inputs.targetSubscribers) || 0;
      const convRate = Number(inputs.conversionRate) || 0;

      if (targetSubs <= 0 || convRate <= 0) {
        return {
          primaryValue: '0 vistas',
          primaryLabel: 'Vistas Necesarias',
          secondaryMetrics: [],
          formulaExplanation: 'Los suscriptores y la tasa de conversión deben ser mayores que 0.',
          recommendations: ['Introduce metas válidas.'],
        };
      }

      // Formula: Vistas necesarias = Suscriptores objetivo / (Tasa de conversión / 100)
      const { requiredViews, subsPerMil } = calculateViewsNeededForSubscribers(targetSubs, convRate);

      const breakdownData = [
        { name: 'Con 0.5% conv.', value: Math.ceil(targetSubs / 0.005) },
        { name: 'Con 1.0% conv.', value: Math.ceil(targetSubs / 0.01) },
        { name: 'Tu tasa (' + convRate + '%)', value: requiredViews },
        { name: 'Con 2.0% conv.', value: Math.ceil(targetSubs / 0.02) },
      ];

      return {
        primaryValue: `${requiredViews.toLocaleString('es-ES')} vistas`,
        primaryLabel: 'Vistas Necesarias Estimadas',
        secondaryMetrics: [
          { label: 'Meta de Suscriptores', value: `+${targetSubs.toLocaleString('es-ES')} subs`, highlight: true },
          { label: 'Tasa Aplicada', value: `${convRate.toFixed(2)}%`, subValue: `${subsPerMil.toFixed(1)} subs/1k vistas` },
          { label: 'Si mejoras conversión a 2%', value: `${Math.ceil(targetSubs / 0.02).toLocaleString('es-ES')} vistas`, isPositive: true },
        ],
        formulaExplanation: `Fórmula: Vistas necesarias = Suscriptores objetivo / (Tasa de conversión / 100)\nCálculo: ${targetSubs.toLocaleString('es-ES')} / (${convRate} / 100) = ${targetSubs.toLocaleString('es-ES')} / ${(convRate / 100).toFixed(4)} = ${requiredViews.toLocaleString('es-ES')} visualizaciones`,
        benchmarkText: `Con tu tasa del ${convRate}%, necesitas generar ${requiredViews.toLocaleString('es-ES')} vistas para sumar ${targetSubs.toLocaleString('es-ES')} suscriptores.`,
        benchmarkStatus: convRate >= 1.0 ? 'optimal' : 'average',
        recommendations: [
          'Mejorar la tasa de conversión de 0.5% a 1.0% reduce a la mitad el número de vistas que necesitas para alcanzar cualquier meta.',
          'Destaca los beneficios de ser suscriptor (ej. acceso a descargables, directos semanales o tutoriales exclusivos).',
        ],
        breakdownData,
        rawOutput: { requiredViews, targetSubs, convRate, subsPerMil },
      };
    },
    seo: {
      title: 'Calculadora de Vistas Necesarias para Conseguir Suscriptores en YouTube',
      metaDescription: 'Calcula cuántas vistas necesitas en YouTube para ganar 1.000, 10.000 o cualquier meta de suscriptores según tu tasa de conversión.',
      h1: 'Calculadora de Vistas Necesarias para Conseguir Suscriptores',
      keywords: ['calculadora vistas para suscriptores youtube', 'cuantas vistas para 1000 suscriptores', 'vistas necesarias suscriptores youtube formula'],
      summary: 'Establece metas claras de tráfico para alcanzar los requisitos de monetización de 1.000 suscriptores o hitos mayores.',
      formulaMarkdown: '`Vistas Necesarias = Suscriptores Objetivo / (Tasa de Conversión / 100)`',
      howToSteps: [
        'Introduce el número de suscriptores que deseas ganar.',
        'Ingresa tu tasa de conversión promedio (el promedio general es 1.0%).',
        'Haz clic en "Calcular Vistas Necesarias".',
      ],
      tipsToImprove: [
        'Para ganar 1.000 suscriptores con una tasa del 1,0%, necesitas exactamente 100.000 visualizaciones.',
      ],
      faqs: [
        {
          question: '¿Cuántas vistas necesito de media para conseguir 1.000 suscriptores?',
          answer: 'Con una tasa de conversión estándar del 1%, necesitas aproximadamente 100.000 visualizaciones. Con una tasa excelente del 2%, solo requerirás 50.000 visualizaciones.',
        },
      ],
    },
    relatedSlugs: ['calculadora-conversion-suscriptores', 'calculadora-suscriptores-por-mil-vistas', 'proyeccion-suscriptores-youtube'],
  },

  // 4. Calculadora de Crecimiento de Suscriptores
  {
    id: 'crecimiento-suscriptores',
    slug: 'calculadora-crecimiento-suscriptores',
    name: 'Calculadora de Crecimiento de Suscriptores',
    tagline: 'Calcula el Incremento Porcentual y Absoluto de tu Audiencia',
    shortDescription: 'Calcula el crecimiento porcentual y la ganancia neta de suscriptores entre dos fechas o hitos de tu canal.',
    category: 'analytics',
    subcategory: 'audiencia',
    iconName: 'TrendingUp',
    popularRank: 10,
    badge: 'Audiencia',
    fields: [
      {
        id: 'initialSubs',
        label: 'Suscriptores Iniciales',
        type: 'number',
        defaultValue: 10000,
        min: 1,
        max: 1000000000,
        step: 500,
        placeholder: 'Ej. 10000',
        tooltip: 'Número de suscriptores al inicio del período evaluado.',
      },
      {
        id: 'finalSubs',
        label: 'Suscriptores Finales',
        type: 'number',
        defaultValue: 12000,
        min: 0,
        max: 1000000000,
        step: 500,
        placeholder: 'Ej. 12000',
        tooltip: 'Número de suscriptores al final del período evaluado.',
      },
    ],
    presets: [
      { label: 'De 10.000 a 12.000 (+20.00%)', values: { initialSubs: 10000, finalSubs: 12000 } },
      { label: 'De 1.000 a 5.000 (+400.00%)', values: { initialSubs: 1000, finalSubs: 5000 } },
      { label: 'De 50.000 a 65.000 (+30.00%)', values: { initialSubs: 5000, finalSubs: 65000 } },
    ],
    calculate: (inputs) => {
      const initial = Number(inputs.initialSubs) || 0;
      const final = Number(inputs.finalSubs) || 0;

      if (initial <= 0) {
        return {
          primaryValue: '0.00%',
          primaryLabel: 'Crecimiento Porcentual',
          secondaryMetrics: [],
          formulaExplanation: 'Los suscriptores iniciales deben ser mayores que 0.',
          recommendations: ['Ingresa un valor inicial mayor a 0.'],
        };
      }

      // Formula: Crecimiento (%) = ((Final - Inicial) / Inicial) * 100
      const { growthPercentage, absoluteDifference, isPositive } = calculateGrowthPercentage(initial, final);

      const breakdownData = [
        { name: 'Suscriptores Iniciales', value: initial },
        { name: 'Ganancia Neta', value: Math.max(0, absoluteDifference) },
        { name: 'Suscriptores Finales', value: final },
      ];

      return {
        primaryValue: `${isPositive ? '+' : ''}${growthPercentage.toFixed(2)}%`,
        primaryLabel: 'Crecimiento Porcentual de Suscriptores',
        secondaryMetrics: [
          { label: 'Diferencia Neta', value: `${isPositive ? '+' : ''}${absoluteDifference.toLocaleString('es-ES')} subs`, highlight: true, isPositive },
          { label: 'Suscriptores Iniciales', value: initial.toLocaleString('es-ES') },
          { label: 'Suscriptores Finales', value: final.toLocaleString('es-ES') },
        ],
        formulaExplanation: `Fórmula: Crecimiento (%) = ((Suscriptores finales - Suscriptores iniciales) / Suscriptores iniciales) × 100\nCálculo: ((${final.toLocaleString('es-ES')} - ${initial.toLocaleString('es-ES')}) / ${initial.toLocaleString('es-ES')}) × 100 = (${absoluteDifference.toLocaleString('es-ES')} / ${initial.toLocaleString('es-ES')}) × 100 = ${isPositive ? '+' : ''}${growthPercentage.toFixed(2)}%`,
        benchmarkText: isPositive ? `Tu canal creció un ${growthPercentage.toFixed(2)}% sumando ${absoluteDifference.toLocaleString('es-ES')} nuevos suscriptores netos.` : `Tu canal registró una variación negativa del ${growthPercentage.toFixed(2)}%.`,
        benchmarkStatus: isPositive ? 'optimal' : 'needs-work',
        recommendations: [
          'Compara este crecimiento con meses anteriores para calcular tu tasa de crecimiento mensual promedio (MoM).',
          'Documenta qué temáticas o videos impulsaron los mayores picos de captación durante este intervalo.',
        ],
        breakdownData,
        rawOutput: { growthPercentage, absoluteDifference, isPositive, initial, final },
      };
    },
    seo: {
      title: 'Calculadora de Crecimiento de Suscriptores en YouTube',
      metaDescription: 'Calcula el crecimiento porcentual y neto de suscriptores en YouTube con la fórmula matemática: ((Final - Inicial) / Inicial) * 100.',
      h1: 'Calculadora de Crecimiento de Suscriptores de YouTube',
      keywords: ['calculadora crecimiento suscriptores youtube', 'crecimiento porcentual suscriptores youtube', 'calcular aumento suscriptores'],
      summary: 'Mide la evolución y tasa de crecimiento de tu canal de YouTube entre diferentes fechas.',
      formulaMarkdown: '`Crecimiento (%) = ((Final - Inicial) / Inicial) * 100`',
      howToSteps: [
        'Introduce el número de suscriptores iniciales.',
        'Introduce el número de suscriptores finales.',
        'Haz clic en "Calcular Crecimiento".',
      ],
      tipsToImprove: [
        'Pasar de 10.000 a 12.000 suscriptores representa un crecimiento exacto del +20,00% (+2.000 suscriptores).',
      ],
      faqs: [
        {
          question: '¿Qué es una tasa de crecimiento de suscriptores saludable en YouTube?',
          answer: 'Para canales en fase de aceleración (1.000 a 50.000 suscriptores), un crecimiento mensual del 5% al 15% es un ritmo muy saludable y sostenido.',
        },
      ],
    },
    relatedSlugs: ['calculadora-conversion-suscriptores', 'proyeccion-suscriptores-youtube', 'proyeccion-crecimiento-canal'],
  },
];
