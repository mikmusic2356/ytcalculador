import { CalculatorConfig } from '../../types';
import { calculateRequiredViews } from '../../utils/mathFormulas';

export const GOALS_CALCULATORS: CalculatorConfig[] = [
  // 6. ¿Cuántas vistas necesito para ganar $100?
  {
    id: 'vistas-100',
    slug: 'vistas-para-ganar-100-dolares',
    name: '¿Cuántas vistas necesito para ganar $100?',
    tagline: 'Calcula las Vistas Necesarias para Alcanzar el Umbral de Cobro de AdSense',
    shortDescription: 'Descubre cuántas visualizaciones necesitas exactamente para ganar $100 USD en YouTube según tu RPM con la fórmula oficial.',
    category: 'ingresos',
    subcategory: 'objetivos',
    iconName: 'Target',
    popularRank: 3,
    badge: 'Objetivo $100',
    fields: [
      {
        id: 'rpm',
        label: 'RPM de tu Canal ($ USD por 1.000 vistas)',
        type: 'number',
        defaultValue: 3.0,
        min: 0.01,
        max: 100,
        step: 0.1,
        prefix: '$',
        placeholder: 'Ej. 3.00',
        tooltip: 'Tu ingreso neto por cada 1.000 visualizaciones (ej. $3.00 USD).',
      },
      {
        id: 'dailyViews',
        label: 'Tus Vistas Diarias Actuales (Opcional para estimar días)',
        type: 'number',
        defaultValue: 1500,
        min: 1,
        max: 10000000,
        step: 100,
        placeholder: 'Ej. 1500',
        tooltip: 'Visualizaciones que recibe tu canal al día para calcular cuántos días tardarás.',
      },
    ],
    presets: [
      { label: 'RPM $3.00 (33.334 vistas)', values: { rpm: 3.0, dailyViews: 1500 } },
      { label: 'RPM $2.00 (50.000 vistas)', values: { rpm: 2.0, dailyViews: 1000 } },
      { label: 'RPM $5.00 (20.000 vistas)', values: { rpm: 5.0, dailyViews: 2000 } },
    ],
    calculate: (inputs) => {
      const rpm = Number(inputs.rpm) || 0;
      const dailyViews = Number(inputs.dailyViews) || 0;
      const target = 100;

      if (rpm <= 0) {
        return {
          primaryValue: '0 vistas',
          primaryLabel: 'Vistas necesarias para ganar $100',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un RPM mayor que 0.',
          recommendations: ['Ingresa tu RPM para calcular las visualizaciones necesarias.'],
        };
      }

      // Formula: Vistas necesarias = Math.ceil((Objetivo / RPM) * 1000)
      const { requiredViews, viewsPerDollar } = calculateRequiredViews(target, rpm);
      const daysNeeded = dailyViews > 0 ? Math.ceil(requiredViews / dailyViews) : 0;

      const breakdownData = [
        { name: 'RPM $1.00', value: 100000 },
        { name: 'RPM $2.00', value: 50000 },
        { name: 'RPM $3.00', value: 33334 },
        { name: 'RPM $5.00', value: 20000 },
        { name: `Tu RPM ($${rpm})`, value: requiredViews },
      ];

      return {
        primaryValue: `${requiredViews.toLocaleString('es-ES')} vistas`,
        primaryLabel: 'Vistas necesarias para ganar $100 USD',
        secondaryMetrics: [
          { label: 'Tiempo Estimado de Cobro', value: daysNeeded > 0 ? `${daysNeeded} días` : 'Indica vistas/día', highlight: true, subValue: daysNeeded > 0 ? `A ${dailyViews.toLocaleString('es-ES')} vistas/día` : '' },
          { label: 'Vistas por Cada $1 Dólar', value: `${viewsPerDollar.toLocaleString('es-ES')} vistas`, subValue: 'Esfuerzo por unidad monetaria' },
          { label: 'Ingreso Neto por Vista', value: `$${(rpm / 1000).toFixed(4)} USD`, isPositive: true },
        ],
        formulaExplanation: `Fórmula: Vistas necesarias = RedondearArriba((Objetivo / RPM) × 1000)\nCálculo: ($100 / $${rpm.toFixed(2)}) × 1.000 = ${((target / rpm) * 1000).toFixed(2)} ➔ Redondeado: ${requiredViews.toLocaleString('es-ES')} vistas`,
        benchmarkText: `Con un RPM de $${rpm.toFixed(2)} USD, necesitas exactamente ${requiredViews.toLocaleString('es-ES')} reproducciones monetizadas para llegar a los $100 USD (el mínimo necesario para que AdSense emita una transferencia bancaria).`,
        benchmarkStatus: rpm >= 3.0 ? 'optimal' : 'average',
        recommendations: [
          'Esta es una estimación basada en el RPM introducido. Los ingresos reales pueden variar.',
          '$100 USD es el umbral de pago mínimo de Google AdSense; al alcanzarlo, el dinero se transfiere a tu cuenta bancaria.',
          'Crear videos de más de 8 minutos con pausas intermedias ayuda a reducir las vistas necesarias a la mitad.',
        ],
        breakdownData,
        rawOutput: { requiredViews, target, rpm, daysNeeded },
      };
    },
    seo: {
      title: '¿Cuántas vistas necesito para ganar $100 en YouTube? - Calculadora Oficial',
      metaDescription: 'Descubre cuántas visualizaciones necesitas exactamente para ganar tus primeros $100 USD en YouTube según tu RPM con la fórmula oficial: (100 / RPM) * 1000.',
      h1: '¿Cuántas vistas necesito para ganar $100 en YouTube?',
      keywords: ['cuantas vistas necesito para ganar 100 dolares youtube', '100 dolares en youtube cuantas visitas son', 'umbral cobro adsense youtube', 'calcular vistas para 100 usd'],
      summary: 'Calcula con precisión matemática cuántas reproducciones monetizadas necesitas para alcanzar tus primeros $100 USD en YouTube y cobrar tu cheque de AdSense.',
      formulaMarkdown: '`Vistas Necesarias = Math.ceil((100 / RPM) * 1000)`',
      howToSteps: [
        'Ingresa tu RPM estimado (ej. $3.00 USD por cada 1.000 vistas).',
        'Opcionalmente ingresa tu ritmo de vistas diarias para calcular el tiempo estimado.',
        'Haz clic en "Calcular Vistas".',
        'Obtén el total exacto de reproducciones necesarias y los días requeridos.',
      ],
      tipsToImprove: [
        'Con un RPM de $3.00 USD necesitas exactamente 33.334 visualizaciones.',
        'Con un RPM de $5.00 USD solo necesitas 20.000 visualizaciones para ganar $100 USD.',
      ],
      faqs: [
        {
          question: '¿Por qué $100 USD es un número clave en YouTube?',
          answer: 'Porque $100 USD (o 70 € en la Unión Europea) es el umbral de pago mínimo que establece Google AdSense para emitir transferencias de ganancias acumuladas a tu banco.',
        },
      ],
    },
    relatedSlugs: ['vistas-para-ganar-500-dolares', 'vistas-para-ganar-1000-dolares', 'calculadora-vistas-objetivo-ingresos', 'calculadora-ganancias-youtube'],
  },

  // 6b. ¿Cuántas vistas necesito para ganar $500?
  {
    id: 'vistas-500',
    slug: 'vistas-para-ganar-500-dolares',
    name: '¿Cuántas vistas necesito para ganar $500?',
    tagline: 'Calcula las Visualizaciones para Alcanzar $500 USD al Mes',
    shortDescription: 'Descubre cuántas reproducciones necesitas para generar $500 USD en YouTube según tu RPM temático.',
    category: 'ingresos',
    subcategory: 'objetivos',
    iconName: 'Target',
    popularRank: 8,
    badge: 'Objetivo $500',
    fields: [
      {
        id: 'rpm',
        label: 'RPM de tu Canal ($ USD por 1.000 vistas)',
        type: 'number',
        defaultValue: 3.0,
        min: 0.01,
        max: 100,
        step: 0.1,
        prefix: '$',
        placeholder: 'Ej. 3.00',
        tooltip: 'Tu ingreso promedio por cada 1.000 vistas.',
      },
      {
        id: 'dailyViews',
        label: 'Tus Vistas Diarias Actuales (Opcional)',
        type: 'number',
        defaultValue: 5000,
        min: 1,
        max: 10000000,
        step: 100,
        placeholder: 'Ej. 5000',
      },
    ],
    presets: [
      { label: 'RPM $3.00 (166.667 vistas)', values: { rpm: 3.0, dailyViews: 5000 } },
      { label: 'RPM $2.50 (200.000 vistas)', values: { rpm: 2.5, dailyViews: 4000 } },
      { label: 'RPM $5.00 (100.000 vistas)', values: { rpm: 5.0, dailyViews: 5000 } },
    ],
    calculate: (inputs) => {
      const rpm = Number(inputs.rpm) || 0;
      const dailyViews = Number(inputs.dailyViews) || 0;
      const target = 500;

      if (rpm <= 0) {
        return {
          primaryValue: '0 vistas',
          primaryLabel: 'Vistas necesarias para ganar $500',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un RPM mayor que 0.',
          recommendations: ['Introduce tu RPM.'],
        };
      }

      const { requiredViews, viewsPerDollar } = calculateRequiredViews(target, rpm);
      const daysNeeded = dailyViews > 0 ? Math.ceil(requiredViews / dailyViews) : 0;

      return {
        primaryValue: `${requiredViews.toLocaleString('es-ES')} vistas`,
        primaryLabel: 'Vistas necesarias para ganar $500 USD',
        secondaryMetrics: [
          { label: 'Tiempo Estimado', value: daysNeeded > 0 ? `${daysNeeded} días` : 'Indica vistas/día', highlight: true },
          { label: 'Vistas por Cada $1 Dólar', value: `${viewsPerDollar.toLocaleString('es-ES')} vistas` },
          { label: 'Ingreso Neto por Vista', value: `$${(rpm / 1000).toFixed(4)} USD`, isPositive: true },
        ],
        formulaExplanation: `Fórmula: Vistas necesarias = RedondearArriba((Objetivo / RPM) × 1000)\nCálculo: ($500 / $${rpm.toFixed(2)}) × 1.000 = ${((target / rpm) * 1000).toFixed(2)} ➔ Redondeado: ${requiredViews.toLocaleString('es-ES')} vistas`,
        benchmarkText: `Para alcanzar $500 USD con un RPM de $${rpm.toFixed(2)} USD necesitas ${requiredViews.toLocaleString('es-ES')} visualizaciones totales.`,
        benchmarkStatus: 'optimal',
        recommendations: [
          'Esta es una estimación basada en el RPM introducido. Los ingresos reales pueden variar.',
          'Con un ingreso de $500 USD al mes comienzas a consolidar un ingreso recurrente relevante como creador de contenido.',
        ],
        rawOutput: { requiredViews, target, rpm, daysNeeded },
      };
    },
    seo: {
      title: '¿Cuántas vistas necesito para ganar $500 en YouTube? - Calculadora',
      metaDescription: 'Calcula cuántas visualizaciones necesitas para ganar $500 USD en YouTube según tu RPM con la fórmula oficial.',
      h1: '¿Cuántas vistas necesito para ganar $500 en YouTube?',
      keywords: ['cuantas vistas necesito para ganar 500 dolares youtube', '500 dolares youtube cuantas visitas son'],
      summary: 'Descubre cuántas visualizaciones necesitas para alcanzar la meta de $500 USD en YouTube según tu temática.',
      formulaMarkdown: '`Vistas Necesarias = Math.ceil((500 / RPM) * 1000)`',
      howToSteps: ['Introduce tu RPM estimado.', 'Haz clic en "Calcular Vistas".'],
      tipsToImprove: ['Con un RPM de $3.00 necesitas 166.667 vistas para ganar $500 USD.'],
      faqs: [
        {
          question: '¿Cuánto tiempo se tarda en ganar $500 en YouTube?',
          answer: 'Depende de tu ritmo de publicación y vistas diarias. Con 5.000 vistas al día y RPM de $3 tardarías aproximadamente 34 días.',
        },
      ],
    },
    relatedSlugs: ['vistas-para-ganar-100-dolares', 'vistas-para-ganar-1000-dolares', 'calculadora-vistas-objetivo-ingresos'],
  },

  // 6c. ¿Cuántas vistas necesito para ganar $1.000?
  {
    id: 'vistas-1000',
    slug: 'vistas-para-ganar-1000-dolares',
    name: '¿Cuántas vistas necesito para ganar $1.000?',
    tagline: 'Calcula las Vistas para Facturar $1.000 USD en YouTube',
    shortDescription: 'Descubre cuántas visualizaciones necesitas para ganar $1.000 USD en YouTube según tu RPM promedio.',
    category: 'ingresos',
    subcategory: 'objetivos',
    iconName: 'Target',
    popularRank: 9,
    badge: 'Objetivo $1.000',
    fields: [
      {
        id: 'rpm',
        label: 'RPM de tu Canal ($ USD por 1.000 vistas)',
        type: 'number',
        defaultValue: 3.0,
        min: 0.01,
        max: 100,
        step: 0.1,
        prefix: '$',
        placeholder: 'Ej. 3.00',
      },
      {
        id: 'dailyViews',
        label: 'Tus Vistas Diarias Actuales (Opcional)',
        type: 'number',
        defaultValue: 10000,
        min: 1,
        max: 10000000,
        step: 100,
        placeholder: 'Ej. 10000',
      },
    ],
    presets: [
      { label: 'RPM $3.00 (333.334 vistas)', values: { rpm: 3.0, dailyViews: 10000 } },
      { label: 'RPM $4.00 (250.000 vistas)', values: { rpm: 4.0, dailyViews: 10000 } },
      { label: 'RPM $2.00 (500.000 vistas)', values: { rpm: 2.0, dailyViews: 15000 } },
    ],
    calculate: (inputs) => {
      const rpm = Number(inputs.rpm) || 0;
      const dailyViews = Number(inputs.dailyViews) || 0;
      const target = 1000;

      if (rpm <= 0) {
        return {
          primaryValue: '0 vistas',
          primaryLabel: 'Vistas necesarias para ganar $1.000',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un RPM mayor que 0.',
          recommendations: ['Introduce tu RPM.'],
        };
      }

      const { requiredViews, viewsPerDollar } = calculateRequiredViews(target, rpm);
      const daysNeeded = dailyViews > 0 ? Math.ceil(requiredViews / dailyViews) : 0;

      return {
        primaryValue: `${requiredViews.toLocaleString('es-ES')} vistas`,
        primaryLabel: 'Vistas necesarias para ganar $1.000 USD',
        secondaryMetrics: [
          { label: 'Tiempo Estimado', value: daysNeeded > 0 ? `${daysNeeded} días` : 'Indica vistas/día', highlight: true },
          { label: 'Vistas por Cada $1 Dólar', value: `${viewsPerDollar.toLocaleString('es-ES')} vistas` },
          { label: 'Ingreso Neto por Vista', value: `$${(rpm / 1000).toFixed(4)} USD`, isPositive: true },
        ],
        formulaExplanation: `Fórmula: Vistas necesarias = RedondearArriba((Objetivo / RPM) × 1000)\nCálculo: ($1.000 / $${rpm.toFixed(2)}) × 1.000 = ${((target / rpm) * 1000).toFixed(2)} ➔ Redondeado: ${requiredViews.toLocaleString('es-ES')} vistas`,
        benchmarkText: `Para ganar $1.000 USD con un RPM de $${rpm.toFixed(2)} USD necesitas ${requiredViews.toLocaleString('es-ES')} visualizaciones totales.`,
        benchmarkStatus: 'optimal',
        recommendations: [
          'Esta es una estimación basada en el RPM introducido. Los ingresos reales pueden variar.',
          '$1.000 USD al mes es el hito en el que muchos creadores consideran dedicarse a tiempo completo a YouTube.',
        ],
        rawOutput: { requiredViews, target, rpm, daysNeeded },
      };
    },
    seo: {
      title: '¿Cuántas vistas necesito para ganar $1.000 en YouTube? - Calculadora Oficial',
      metaDescription: 'Calcula cuántas visualizaciones necesitas para ganar tus primeros $1.000 USD en YouTube según tu RPM temático.',
      h1: '¿Cuántas vistas necesito para ganar $1.000 en YouTube?',
      keywords: ['cuantas vistas necesito para ganar 1000 dolares youtube', '1000 dolares youtube cuantas visitas son'],
      summary: 'Descubre cuántas visualizaciones necesitas para ganar $1.000 USD en YouTube según tu RPM promedio.',
      formulaMarkdown: '`Vistas Necesarias = Math.ceil((1000 / RPM) * 1000)`',
      howToSteps: ['Introduce tu RPM promedio.', 'Haz clic en "Calcular Vistas".'],
      tipsToImprove: ['Con un RPM de $3.00 necesitas 333.334 visualizaciones para ganar $1.000 USD.'],
      faqs: [
        {
          question: '¿Cuántas vistas al día se necesitan para ganar $1.000 al mes?',
          answer: 'Con un RPM de $3.00 USD, necesitas aproximadamente 11.111 visualizaciones al día para generar $1.000 USD en 30 días.',
        },
      ],
    },
    relatedSlugs: ['vistas-para-ganar-100-dolares', 'vistas-para-ganar-500-dolares', 'calculadora-vistas-objetivo-ingresos'],
  },

  // 6d. Calculadora de vistas necesarias para alcanzar cualquier objetivo de ingresos
  {
    id: 'vistas-objetivo-libre',
    slug: 'calculadora-vistas-objetivo-ingresos',
    name: 'Calculadora de Vistas para Cualquier Objetivo de Ingresos',
    tagline: 'Personaliza tu Meta Financiera y Calcula las Visualizaciones Requeridas',
    shortDescription: 'Introduce cualquier objetivo de dinero ($50, $100, $500, $1.000, $5.000, $10.000...) y calcula las vistas necesarias según tu RPM.',
    category: 'ingresos',
    subcategory: 'objetivos',
    iconName: 'Target',
    popularRank: 7,
    badge: 'Personalizable',
    fields: [
      {
        id: 'targetRevenue',
        label: 'Objetivo de Ingresos ($ USD)',
        type: 'currency',
        defaultValue: 100,
        min: 1,
        max: 10000000,
        step: 10,
        prefix: '$',
        placeholder: 'Ej. 100',
        tooltip: 'Ingresa la cantidad exacta de dinero que te propones ganar.',
      },
      {
        id: 'rpm',
        label: 'RPM Estimado ($ USD por 1.000 vistas)',
        type: 'number',
        defaultValue: 3.0,
        min: 0.01,
        max: 100,
        step: 0.1,
        prefix: '$',
        placeholder: 'Ej. 3.00',
        tooltip: 'Tu ingreso estimado por cada 1.000 vistas.',
      },
      {
        id: 'dailyViews',
        label: 'Vistas Diarias Promedio (Opcional)',
        type: 'number',
        defaultValue: 2000,
        min: 1,
        max: 10000000,
        step: 100,
        placeholder: 'Ej. 2000',
      },
    ],
    presets: [
      { label: 'Meta $50 (AdSense inicial)', values: { targetRevenue: 50, rpm: 3.0, dailyViews: 1000 } },
      { label: 'Meta $100 (Cobro AdSense)', values: { targetRevenue: 100, rpm: 3.0, dailyViews: 1500 } },
      { label: 'Meta $500 (Ingreso recurrente)', values: { targetRevenue: 50, rpm: 3.0, dailyViews: 5000 } },
      { label: 'Meta $1.000 (Hito profesional)', values: { targetRevenue: 1000, rpm: 3.0, dailyViews: 10000 } },
      { label: 'Meta $5.000 (Canal consolidado)', values: { targetRevenue: 5000, rpm: 3.5, dailyViews: 30000 } },
      { label: 'Meta $10.000 (Top creator)', values: { targetRevenue: 10000, rpm: 4.0, dailyViews: 80000 } },
    ],
    calculate: (inputs) => {
      const target = Number(inputs.targetRevenue) || 0;
      const rpm = Number(inputs.rpm) || 0;
      const dailyViews = Number(inputs.dailyViews) || 0;

      if (target <= 0) {
        return {
          primaryValue: '0 vistas',
          primaryLabel: 'Vistas necesarias',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un objetivo de ingresos mayor que 0.',
          recommendations: ['Ingresa tu meta económica en dólares.'],
        };
      }

      if (rpm <= 0) {
        return {
          primaryValue: '0 vistas',
          primaryLabel: 'Vistas necesarias',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un RPM mayor que 0.',
          recommendations: ['Ingresa tu RPM estimado.'],
        };
      }

      // Formula: Vistas necesarias = Math.ceil((Objetivo / RPM) * 1000)
      const { requiredViews, viewsPerDollar } = calculateRequiredViews(target, rpm);
      const daysNeeded = dailyViews > 0 ? Math.ceil(requiredViews / dailyViews) : 0;

      const breakdownData = [
        { name: 'RPM $1.00', value: Math.ceil((target / 1.0) * 1000) },
        { name: 'RPM $2.00', value: Math.ceil((target / 2.0) * 1000) },
        { name: 'RPM $3.00', value: Math.ceil((target / 3.0) * 1000) },
        { name: 'RPM $5.00', value: Math.ceil((target / 5.0) * 1000) },
        { name: `Tu RPM ($${rpm})`, value: requiredViews },
      ];

      return {
        primaryValue: `${requiredViews.toLocaleString('es-ES')} vistas`,
        primaryLabel: `Vistas necesarias para ganar $${target.toLocaleString('es-ES')} USD`,
        secondaryMetrics: [
          { label: 'Tiempo Estimado', value: daysNeeded > 0 ? `${daysNeeded} días` : 'Indica vistas/día', highlight: true },
          { label: 'Vistas por Cada $1 Dólar', value: `${viewsPerDollar.toLocaleString('es-ES')} vistas` },
          { label: 'Ingreso Neto por Vista', value: `$${(rpm / 1000).toFixed(4)} USD`, isPositive: true },
        ],
        formulaExplanation: `Fórmula: Vistas necesarias = RedondearArriba((Objetivo / RPM) × 1000)\nCálculo: ($${target} / $${rpm.toFixed(2)}) × 1.000 = ${((target / rpm) * 1000).toFixed(2)} ➔ Redondeado: ${requiredViews.toLocaleString('es-ES')} vistas`,
        benchmarkText: `Para alcanzar tu meta de $${target.toLocaleString('es-ES')} USD con un RPM de $${rpm.toFixed(2)} USD necesitas ${requiredViews.toLocaleString('es-ES')} visualizaciones totales.`,
        benchmarkStatus: 'optimal',
        recommendations: [
          'Esta es una estimación basada en el RPM introducido. Los ingresos reales pueden variar.',
          'Divide tu meta en objetivos semanales para mantener un ritmo de publicación consistente.',
        ],
        breakdownData,
        rawOutput: { requiredViews, target, rpm, daysNeeded },
      };
    },
    seo: {
      title: 'Calculadora de Vistas Necesarias para Cualquier Objetivo de Ingresos en YouTube',
      metaDescription: 'Calcula cuántas visualizaciones necesitas para alcanzar cualquier meta de ingresos ($100, $500, $1.000, $5.000, etc.) en YouTube con la fórmula oficial.',
      h1: 'Calculadora de Vistas Necesarias para Objetivos de Ingresos',
      keywords: ['calculadora vistas objetivo ingresos youtube', 'cuantas vistas para ganar dinero en youtube', 'metas financieras youtube'],
      summary: 'Calcula exactamente cuántas reproducciones necesitas para lograr cualquier meta de facturación en YouTube según tu RPM estimado.',
      formulaMarkdown: '`Vistas Necesarias = Math.ceil((Objetivo / RPM) * 1000)`',
      howToSteps: [
        'Introduce tu meta económica deseada en dólares.',
        'Ingresa tu RPM promedio estimado.',
        'Opcionalmente introduce tus visualizaciones diarias actuales.',
        'Presiona "Calcular Vistas".',
      ],
      tipsToImprove: [
        'Con $100 de objetivo y RPM $3 necesitas 33.334 vistas.',
        'Con $1.000 de objetivo y RPM $3 necesitas 333.334 vistas.',
      ],
      faqs: [
        {
          question: '¿Cómo afecta el nicho al número de vistas necesarias?',
          answer: 'Un canal en un nicho de alto RPM (como finanzas con RPM de $10) necesita 10 veces menos vistas para ganar $1.000 USD que un canal de entretenimiento con RPM de $1.',
        },
      ],
    },
    relatedSlugs: ['vistas-para-ganar-100-dolares', 'vistas-para-ganar-500-dolares', 'vistas-para-ganar-1000-dolares'],
  },
];
