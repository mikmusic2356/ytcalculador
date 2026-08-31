import { CalculatorConfig } from '../../types';
import {
  calculateYoutubeEarnings,
  calculateRPM,
  calculateCPM,
  calculateMonthlyEarnings,
  calculateAnnualEarnings,
} from '../../utils/mathFormulas';
import { formatCurrencyAmount } from '../../utils/currency';

export const ADVERTISING_CALCULATORS: CalculatorConfig[] = [
  // 1. Calculadora de Ganancias de YouTube
  {
    id: 'ganancias',
    slug: 'calculadora-ganancias-youtube',
    name: 'Calculadora de Ganancias de YouTube',
    tagline: 'Estima tus Ingresos con AdSense según Vistas y RPM',
    shortDescription: 'Calcula cuánto dinero genera tu canal de YouTube según tus visualizaciones y el RPM estimado con fórmulas matemáticas exactas.',
    category: 'ingresos',
    subcategory: 'publicidad',
    iconName: 'DollarSign',
    popularRank: 1,
    badge: 'Más Usada',
    fields: [
      {
        id: 'views',
        label: 'Número de Vistas (Visualizaciones)',
        type: 'number',
        defaultValue: 100000,
        min: 1,
        max: 1000000000,
        step: 1000,
        placeholder: 'Ej. 100000',
        tooltip: 'Total de reproducciones que quieres estimar (ej. 100.000 vistas).',
      },
      {
        id: 'rpm',
        label: 'RPM ($ USD por 1.000 vistas)',
        type: 'number',
        defaultValue: 3.5,
        min: 0.01,
        max: 100,
        step: 0.1,
        prefix: '$',
        placeholder: 'Ej. 3.50',
        tooltip: 'Ingreso promedio neto por cada 1.000 reproducciones monetizadas.',
      },
    ],
    presets: [
      { label: '100.000 Vistas / RPM $3.50', values: { views: 100000, rpm: 3.5 } },
      { label: '50.000 Vistas / RPM $2.00', values: { views: 50000, rpm: 2.0 } },
      { label: '1.000.000 Vistas / RPM $4.00', values: { views: 1000000, rpm: 4.0 } },
    ],
    calculate: (inputs) => {
      const views = Number(inputs.views) || 0;
      const rpm = Number(inputs.rpm) || 0;

      if (views <= 0) {
        return {
          primaryValue: '$0.00 USD',
          primaryLabel: 'Ganancias estimadas',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un número de vistas mayor que 0.',
          recommendations: ['Introduce un número válido de visualizaciones para calcular tus ganancias.'],
        };
      }

      if (rpm <= 0) {
        return {
          primaryValue: '$0.00 USD',
          primaryLabel: 'Ganancias estimadas',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un RPM mayor que 0.',
          recommendations: ['El RPM representa tu ingreso neto por cada 1.000 vistas.'],
        };
      }

      // Mathematical formula: Ganancias = (Vistas / 1000) * RPM
      const earnings = calculateYoutubeEarnings(views, rpm);
      const formattedEarnings = `$${earnings.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;

      const breakdownData = [
        { name: '10k Vistas', value: Number(((10000 / 1000) * rpm).toFixed(2)) },
        { name: '50k Vistas', value: Number(((50000 / 1000) * rpm).toFixed(2)) },
        { name: '100k Vistas', value: Number(((100000 / 1000) * rpm).toFixed(2)) },
        { name: '500k Vistas', value: Number(((500000 / 1000) * rpm).toFixed(2)) },
        { name: '1M Vistas', value: Number(((1000000 / 1000) * rpm).toFixed(2)) },
      ];

      return {
        primaryValue: formattedEarnings,
        primaryLabel: 'Ganancias estimadas',
        secondaryMetrics: [
          { label: 'Vistas Evaluadas', value: `${views.toLocaleString('es-ES')} vistas`, subValue: `RPM: $${rpm.toFixed(2)} USD` },
          { label: 'Ingreso por 1 Vista', value: `$${(rpm / 1000).toFixed(4)} USD`, subValue: 'Por reproducción' },
          { label: 'Ingreso por 1M de Vistas', value: `$${(rpm * 1000).toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD`, isPositive: true },
        ],
        formulaExplanation: `Fórmula: Ganancias = (Vistas / 1000) × RPM\nCálculo: (${views.toLocaleString('es-ES')} / 1.000) × $${rpm.toFixed(2)} = ${formattedEarnings}`,
        benchmarkText: 'Esta es una estimación basada en el RPM introducido. Los ingresos reales pueden variar según la procedencia geográfica del público, el porcentaje de usuarios con AdBlock y la estacionalidad publicitaria.',
        benchmarkStatus: rpm >= 3.0 ? 'optimal' : 'average',
        recommendations: [
          'Esta es una estimación basada en el RPM introducido. Los ingresos reales pueden variar.',
          'Aumenta la duración de tus videos por encima de 8 minutos para habilitar anuncios intermedios (mid-rolls).',
          'Optimiza títulos y miniaturas para incrementar el CTR y multiplicar el volumen de reproducciones.',
        ],
        breakdownData,
        rawOutput: { earnings, views, rpm },
      };
    },
    seo: {
      title: 'Calculadora de Ganancias de YouTube - ¿Cuánto Dinero Paga YouTube?',
      metaDescription: 'Calcula las ganancias estimadas de tu canal de YouTube según tus visualizaciones y RPM con la fórmula oficial: (Vistas / 1000) * RPM. 100% gratuita.',
      h1: 'Calculadora de Ganancias de YouTube',
      keywords: ['calculadora ganancias youtube', 'cuanto paga youtube por 100000 visitas', 'estimar dinero canal youtube', 'calcular ingresos adsense youtube'],
      summary: 'Estima con exactitud matemática las ganancias de tu canal de YouTube introduciendo tu número de visualizaciones y tu RPM estimado.',
      formulaMarkdown: '`Ganancias = (Vistas / 1000) * RPM`',
      howToSteps: [
        'Introduce el número total de visualizaciones que deseas estimar (ej. 100.000 vistas).',
        'Ingresa tu RPM estimado (ingreso por cada 1.000 vistas, ej. $3.50).',
        'Haz clic en "Calcular Ganancias".',
        'Revisa el desglose paso a paso del cálculo y las recomendaciones tácticas.',
      ],
      tipsToImprove: [
        'Un video de 100.000 vistas con un RPM de $3.50 genera exactamente $350 USD.',
        'Los RPMs más altos corresponden a nichos financieros, tecnología, software y comercio electrónico.',
        'El RPM real de un canal fluctúa mensualmente según el presupuesto de los anunciantes.',
      ],
      faqs: [
        {
          question: '¿Cómo se calculan las ganancias en YouTube?',
          answer: 'Las ganancias estimadas se obtienen dividiendo las visualizaciones entre 1.000 y multiplicando el resultado por el RPM del canal: Ganancias = (Vistas / 1000) × RPM.',
        },
        {
          question: '¿Por qué los ingresos reales pueden ser diferentes a la estimación?',
          answer: 'Porque el RPM no es constante: cambia diariamente según el país de cada espectador, el nicho temático, si usan YouTube Premium o bloqueadores de anuncios, y la temporada del año (Q4 suele pagar más).',
        },
      ],
    },
    relatedSlugs: ['calculadora-rpm-youtube', 'calculadora-cpm-youtube', 'calculadora-ingresos-mensuales', 'vistas-para-ganar-100-dolares'],
  },

  // 2. Calculadora de RPM de YouTube
  {
    id: 'rpm',
    slug: 'calculadora-rpm-youtube',
    name: 'Calculadora de RPM de YouTube',
    tagline: 'Calcula tus Ingresos Reales Netos por Cada 1.000 Vistas',
    shortDescription: 'Calcula tu RPM exacto a partir de tus ingresos y visualizaciones con la fórmula: RPM = (Ingresos / Vistas) * 1000.',
    category: 'ingresos',
    subcategory: 'publicidad',
    iconName: 'TrendingUp',
    popularRank: 2,
    badge: 'Popular',
    fields: [
      {
        id: 'revenue',
        label: 'Ingresos Totales Obtenidos ($ USD)',
        type: 'currency',
        defaultValue: 350,
        min: 0.01,
        max: 10000000,
        step: 1,
        prefix: '$',
        placeholder: 'Ej. 350',
        tooltip: 'Dinero total generado por esas visualizaciones según YouTube Studio.',
      },
      {
        id: 'views',
        label: 'Número de Vistas Totales',
        type: 'number',
        defaultValue: 100000,
        min: 1,
        max: 1000000000,
        step: 1000,
        placeholder: 'Ej. 100000',
        tooltip: 'Total de visualizaciones del video o periodo seleccionado.',
      },
    ],
    presets: [
      { label: '$350 Ingresos / 100.000 Vistas (RPM: $3.50)', values: { revenue: 350, views: 100000 } },
      { label: '$150 Ingresos / 50.000 Vistas (RPM: $3.00)', values: { revenue: 150, views: 50000 } },
      { label: '$800 Ingresos / 100.000 Vistas (RPM: $8.00)', values: { revenue: 800, views: 100000 } },
    ],
    calculate: (inputs) => {
      const revenue = Number(inputs.revenue) || 0;
      const views = Number(inputs.views) || 0;

      if (views <= 0) {
        return {
          primaryValue: '$0.00 USD',
          primaryLabel: 'RPM Calculado',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un número de vistas mayor que 0.',
          recommendations: ['El número de vistas debe ser superior a cero.'],
        };
      }

      if (revenue <= 0) {
        return {
          primaryValue: '$0.00 USD',
          primaryLabel: 'RPM Calculado',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un importe de ingresos mayor que 0.',
          recommendations: ['Introduce los ingresos obtenidos para calcular tu RPM.'],
        };
      }

      // Mathematical formula: RPM = (Ingresos / Vistas) * 1000
      const rpm = calculateRPM(revenue, views);
      const formattedRpm = `$${rpm.toFixed(2)} USD`;

      return {
        primaryValue: formattedRpm,
        primaryLabel: 'RPM Calculado (por 1.000 vistas)',
        secondaryMetrics: [
          { label: 'Ingresos Evaluados', value: `$${revenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD`, subValue: `${views.toLocaleString('es-ES')} vistas` },
          { label: 'Ingreso por 1 Vista', value: `$${(revenue / views).toFixed(4)} USD`, subValue: 'Por reproducción' },
          { label: 'Proyección 1M Vistas', value: `$${(rpm * 1000).toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD`, highlight: true },
        ],
        formulaExplanation: `Fórmula: RPM = (Ingresos / Vistas) × 1000\nCálculo: ($${revenue} / ${views.toLocaleString('es-ES')}) × 1.000 = ${formattedRpm}`,
        benchmarkText: 'El RPM representa los ingresos obtenidos por cada 1.000 vistas según los datos introducidos. A diferencia del CPM (que mide el costo publicitario bruto), el RPM refleja tu ganancia neta real.',
        benchmarkStatus: rpm >= 3.0 ? 'optimal' : 'average',
        recommendations: [
          'El RPM representa los ingresos obtenidos por cada 1.000 vistas según los datos introducidos.',
          'No confundir RPM con CPM: el CPM es el costo publicitario bruto que paga el anunciante, mientras que el RPM es tu ingreso neto final.',
          'Para subir tu RPM, enfócate en contenidos orientados a audiencias con mayor poder adquisitivo o videos de mayor duración.',
        ],
        rawOutput: { rpm, revenue, views },
      };
    },
    seo: {
      title: 'Calculadora de RPM de YouTube - Calcula tus Ingresos por 1.000 Vistas',
      metaDescription: 'Calcula tu RPM real de YouTube con la fórmula matemática oficial: RPM = (Ingresos / Vistas) * 1000. Comprende tu ganancia neta por cada mil reproducciones.',
      h1: 'Calculadora de RPM de YouTube',
      keywords: ['calculadora rpm youtube', 'calcular rpm youtube formula', 'ingresos por 1000 vistas youtube', 'cpm vs rpm youtube'],
      summary: 'El RPM (Revenue Per Mille) muestra los ingresos netos que recibe un creador por cada 1.000 reproducciones totales en su canal de YouTube.',
      formulaMarkdown: '`RPM = (Ingresos / Vistas) * 1000`',
      howToSteps: [
        'Ingresa los ingresos totales obtenidos en el periodo (ej. $350 USD).',
        'Introduce las visualizaciones totales obtenidas (ej. 100.000 vistas).',
        'Haz clic en "Calcular RPM".',
        'Obtén tu RPM neto y su desglose paso a paso.',
      ],
      tipsToImprove: [
        'Un canal con $350 USD de ingresos y 100.000 vistas tiene un RPM exacto de $3.50 USD.',
        'El RPM contabiliza todas las visualizaciones, incluso las que no mostraron anuncios.',
      ],
      faqs: [
        {
          question: '¿Qué significa RPM en YouTube?',
          answer: 'RPM significa Revenue Per Mille (Ingreso por Mil). Representa la cantidad de dinero que gana un creador por cada 1.000 reproducciones totales de sus videos tras aplicar la comisión del 45% de YouTube.',
        },
        {
          question: '¿En qué se diferencia el RPM del CPM?',
          answer: 'El CPM es el coste que pagan los anunciantes por cada 1.000 impresiones de anuncios. El RPM es lo que tú recibes por cada 1.000 visualizaciones totales de video (incluyendo vistas sin anuncios).',
        },
      ],
    },
    relatedSlugs: ['calculadora-cpm-youtube', 'calculadora-ganancias-youtube', 'comparador-rpm-pais'],
  },

  // 3. Calculadora de CPM de YouTube
  {
    id: 'cpm',
    slug: 'calculadora-cpm-youtube',
    name: 'Calculadora de CPM de YouTube',
    tagline: 'Costo por Cada 1.000 Impresiones Publicitarias Brutas',
    shortDescription: 'Calcula el CPM que pagan los anunciantes por mostrar publicidad en tus videos con la fórmula: CPM = (Importe / Impresiones) * 1000.',
    category: 'ingresos',
    subcategory: 'publicidad',
    iconName: 'BarChart3',
    popularRank: 4,
    fields: [
      {
        id: 'cost',
        label: 'Coste Publicitario / Ingresos Brutos ($ USD)',
        type: 'currency',
        defaultValue: 500,
        min: 0.01,
        max: 10000000,
        step: 1,
        prefix: '$',
        placeholder: 'Ej. 500',
        tooltip: 'Importe publicitario bruto pagado por los anunciantes.',
      },
      {
        id: 'impressions',
        label: 'Impresiones de Anuncios Totales',
        type: 'number',
        defaultValue: 100000,
        min: 1,
        max: 1000000000,
        step: 1000,
        placeholder: 'Ej. 100000',
        tooltip: 'Número total de veces que se mostraron anuncios en los videos.',
      },
    ],
    presets: [
      { label: '$500 Importe / 100.000 Impresiones (CPM: $5.00)', values: { cost: 500, impressions: 100000 } },
      { label: '$300 Importe / 50.000 Impresiones (CPM: $6.00)', values: { cost: 300, impressions: 50000 } },
      { label: '$1.200 Importe / 100.000 Impresiones (CPM: $12.00)', values: { cost: 1200, impressions: 100000 } },
    ],
    calculate: (inputs) => {
      const cost = Number(inputs.cost) || 0;
      const impressions = Number(inputs.impressions) || 0;

      if (impressions <= 0) {
        return {
          primaryValue: '$0.00 USD',
          primaryLabel: 'CPM Calculado',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un número de impresiones mayor que 0.',
          recommendations: ['El número de impresiones debe ser mayor que cero.'],
        };
      }

      if (cost <= 0) {
        return {
          primaryValue: '$0.00 USD',
          primaryLabel: 'CPM Calculado',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un importe mayor que 0.',
          recommendations: ['Introduce el importe publicitario bruto.'],
        };
      }

      // Mathematical formula: CPM = (Importe / Impresiones) * 1000
      const cpm = calculateCPM(cost, impressions);
      const formattedCpm = `$${cpm.toFixed(2)} USD`;
      const creatorShareEstimated = cpm * 0.55; // 55% creator share benchmark

      return {
        primaryValue: formattedCpm,
        primaryLabel: 'CPM Calculado (Costo por 1.000 impresiones)',
        secondaryMetrics: [
          { label: 'Importe Evaluado', value: `$${cost.toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD`, subValue: `${impressions.toLocaleString('es-ES')} impresiones` },
          { label: 'Reparto Creador (55%)', value: `~$${creatorShareEstimated.toFixed(2)} USD`, subValue: 'Estimación antes de vistas sin anuncios' },
          { label: 'Comisión YouTube (45%)', value: `~$${(cpm * 0.45).toFixed(2)} USD`, subValue: 'Por cada 1.000 impresiones' },
        ],
        formulaExplanation: `Fórmula: CPM = (Importe / Impresiones) × 1000\nCálculo: ($${cost} / ${impressions.toLocaleString('es-ES')}) × 1.000 = ${formattedCpm}`,
        benchmarkText: 'CPM y RPM representan métricas diferentes. Un CPM determinado no equivale directamente al ingreso que recibirá un creador, ya que YouTube retiene el 45% y no todas las visualizaciones reproducen anuncios.',
        benchmarkStatus: cpm >= 5.0 ? 'optimal' : 'average',
        recommendations: [
          'CPM y RPM representan métricas diferentes: el CPM mide lo que pagan los anunciantes y el RPM lo que tú recibes netamente.',
          'Evita asumir que un CPM de $5 significa que ganarás $5 por cada 1.000 vistas de video.',
          'Los anunciantes pagan más CPM por audiencias adultas con alto poder adquisitivo y decisiones de compra.',
        ],
        rawOutput: { cpm, cost, impressions },
      };
    },
    seo: {
      title: 'Calculadora de CPM de YouTube - Costo por Mil Impresiones Publicitarias',
      metaDescription: 'Calcula el CPM de tus videos con la fórmula matemática: CPM = (Importe / Impresiones) * 1000. Entiende la diferencia entre CPM y RPM en YouTube.',
      h1: 'Calculadora de CPM de YouTube',
      keywords: ['calculadora cpm youtube', 'calcular cpm anuncios youtube', 'formula cpm youtube', 'cpm vs rpm'],
      summary: 'Calcula el costo por mil impresiones (CPM) que los anunciantes pagan en YouTube y comprende el reparto del 55% para creadores.',
      formulaMarkdown: '`CPM = (Importe / Impresiones) * 1000`',
      howToSteps: [
        'Introduce el costo publicitario o importe bruto pagado por los anunciantes.',
        'Ingresa las impresiones de anuncios recibidas.',
        'Presiona "Calcular CPM".',
        'Examina el desglose del reparto 55% creador / 45% plataforma.',
      ],
      tipsToImprove: [
        'Importe = $500 e Impresiones = 100.000 equivale a un CPM de $5.00 USD.',
        'No confundir CPM con las ganancias reales del canal.',
      ],
      faqs: [
        {
          question: '¿Por qué el creador no recibe el CPM completo?',
          answer: 'En el Programa de Socios de YouTube, los creadores reciben el 55% de los ingresos publicitarios netos y YouTube retiene el 45%. Además, no todos los espectadores ven anuncios en cada reproducción.',
        },
      ],
    },
    relatedSlugs: ['calculadora-rpm-youtube', 'calculadora-ganancias-youtube', 'comparador-rpm-pais'],
  },

  // 4. Calculadora de Ingresos Mensuales
  {
    id: 'ingresos-mensuales',
    slug: 'calculadora-ingresos-mensuales',
    name: 'Calculadora de Ingresos Mensuales',
    tagline: 'Proyecta tus Ganancias Mensuales según Vistas Diarias y RPM',
    shortDescription: 'Calcula tus visualizaciones mensuales e ingresos estimados a partir de tus vistas diarias con las fórmulas oficiales de AdSense.',
    category: 'ingresos',
    subcategory: 'publicidad',
    iconName: 'Calendar',
    popularRank: 5,
    fields: [
      {
        id: 'dailyViews',
        label: 'Vistas Diarias Promedio',
        type: 'number',
        defaultValue: 10000,
        min: 1,
        max: 100000000,
        step: 500,
        placeholder: 'Ej. 10000',
        tooltip: 'Promedio de visualizaciones diarias de todos tus videos combinados.',
      },
      {
        id: 'rpm',
        label: 'RPM ($ USD por 1.000 vistas)',
        type: 'number',
        defaultValue: 3.0,
        min: 0.01,
        max: 100,
        step: 0.1,
        prefix: '$',
        placeholder: 'Ej. 3.00',
        tooltip: 'Ingreso promedio neto por cada 1.000 visualizaciones.',
      },
      {
        id: 'days',
        label: 'Días del Mes',
        type: 'number',
        defaultValue: 30,
        min: 1,
        max: 31,
        step: 1,
        placeholder: '30',
        tooltip: 'Cantidad de días a evaluar en el mes (por defecto: 30).',
      },
    ],
    presets: [
      { label: '10.000 vistas/día × 30 días (RPM $3) ➔ $900', values: { dailyViews: 10000, rpm: 3.0, days: 30 } },
      { label: '5.000 vistas/día × 30 días (RPM $2.5) ➔ $375', values: { dailyViews: 5000, rpm: 2.5, days: 30 } },
      { label: '50.000 vistas/día × 30 días (RPM $4) ➔ $6.000', values: { dailyViews: 50000, rpm: 4.0, days: 30 } },
    ],
    calculate: (inputs) => {
      const dailyViews = Number(inputs.dailyViews) || 0;
      const rpm = Number(inputs.rpm) || 0;
      const days = Number(inputs.days) || 30;

      if (dailyViews <= 0) {
        return {
          primaryValue: '$0.00 USD',
          primaryLabel: 'Ingresos mensuales estimados',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un número de vistas diarias mayor que 0.',
          recommendations: ['Ingresa tus vistas diarias promedio.'],
        };
      }

      if (rpm <= 0) {
        return {
          primaryValue: '$0.00 USD',
          primaryLabel: 'Ingresos mensuales estimados',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un RPM mayor que 0.',
          recommendations: ['Ingresa tu RPM estimado.'],
        };
      }

      // Formulas:
      // Vistas mensuales = Vistas diarias * Días
      // Ingresos mensuales = (Vistas mensuales / 1000) * RPM
      const { monthlyViews, monthlyEarnings } = calculateMonthlyEarnings(dailyViews, rpm, days);
      const formattedEarnings = `$${monthlyEarnings.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;

      return {
        primaryValue: formattedEarnings,
        primaryLabel: 'Ingresos mensuales estimados',
        secondaryMetrics: [
          { label: 'Vistas Mensuales Estimadas', value: `${monthlyViews.toLocaleString('es-ES')} vistas`, subValue: `${dailyViews.toLocaleString('es-ES')} vistas/día × ${days} días`, highlight: true },
          { label: 'Ingreso Diario Estimado', value: `$${((dailyViews / 1000) * rpm).toFixed(2)} USD`, subValue: 'Por día' },
          { label: 'Proyección Anual (×12)', value: `$${(monthlyEarnings * 12).toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD`, isPositive: true },
        ],
        formulaExplanation: `Fórmulas aplicadas:
1. Vistas mensuales = Vistas diarias × Días = ${dailyViews.toLocaleString('es-ES')} × ${days} = ${monthlyViews.toLocaleString('es-ES')} vistas.
2. Ingresos mensuales = (Vistas mensuales / 1000) × RPM = (${monthlyViews.toLocaleString('es-ES')} / 1.000) × $${rpm.toFixed(2)} = ${formattedEarnings}`,
        benchmarkText: 'Esta es una estimación basada en el RPM y ritmo de visualizaciones introducidos. Los ingresos mensuales reales pueden variar según la estabilidad de las vistas y la estacionalidad.',
        benchmarkStatus: monthlyEarnings >= 500 ? 'optimal' : 'average',
        recommendations: [
          'Vistas mensuales estimadas: ' + monthlyViews.toLocaleString('es-ES') + ' vistas.',
          'Ingresos mensuales estimados: ' + formattedEarnings + '.',
          'Publicar con regularidad ayuda a sostener el volumen de vistas diarias.',
        ],
        rawOutput: { monthlyViews, monthlyEarnings, dailyViews, rpm, days },
      };
    },
    seo: {
      title: 'Calculadora de Ingresos Mensuales de YouTube - Proyección de Dinero al Mes',
      metaDescription: 'Calcula cuántas vistas mensuales y cuánto dinero mensual generará tu canal de YouTube según tus vistas diarias y tu RPM estimado.',
      h1: 'Calculadora de Ingresos Mensuales de YouTube',
      keywords: ['calculadora ingresos mensuales youtube', 'cuanto gana un youtuber al mes', 'calcular dinero mensual youtube', 'vistas mensuales youtube'],
      summary: 'Proyecta tus visualizaciones mensuales e ingresos estimados multiplicando tus vistas diarias por los días del mes y aplicando tu RPM neto.',
      formulaMarkdown: '`Vistas Mensuales = Vistas Diarias * Días` | `Ingresos Mensuales = (Vistas Mensuales / 1000) * RPM`',
      howToSteps: [
        'Introduce tus visualizaciones diarias promedio (ej. 10.000 vistas/día).',
        'Ingresa tu RPM promedio (ej. $3.00 USD).',
        'Indica el número de días del mes a proyectar (por defecto 30).',
        'Consulta las vistas mensuales estimadas y los ingresos mensuales calculados.',
      ],
      tipsToImprove: [
        'Con 10.000 vistas diarias y un RPM de $3 en 30 días, generas 300.000 vistas y $900 USD al mes.',
      ],
      faqs: [
        {
          question: '¿Cuándo paga YouTube los ingresos del mes?',
          answer: 'Google AdSense emite los pagos acumulados del mes anterior entre los días 21 y 26 de cada mes, siempre que hayas superado el umbral mínimo de $100 USD.',
        },
      ],
    },
    relatedSlugs: ['calculadora-ingresos-anuales', 'calculadora-ganancias-youtube', 'vistas-para-ganar-100-dolares'],
  },

  // 5. Calculadora de Ingresos Anuales
  {
    id: 'ingresos-anuales',
    slug: 'calculadora-ingresos-anuales',
    name: 'Calculadora de Ingresos Anuales',
    tagline: 'Proyección Anual de Ingresos y Vistas en YouTube',
    shortDescription: 'Calcula tus visualizaciones anuales e ingresos proyectados en 12 meses a partir de tus vistas mensuales y RPM.',
    category: 'ingresos',
    subcategory: 'publicidad',
    iconName: 'CalendarDays',
    popularRank: 6,
    fields: [
      {
        id: 'monthlyViews',
        label: 'Vistas Mensuales Promedio',
        type: 'number',
        defaultValue: 300000,
        min: 1,
        max: 1000000000,
        step: 5000,
        placeholder: 'Ej. 300000',
        tooltip: 'Total de reproducciones que recibe tu canal cada mes.',
      },
      {
        id: 'rpm',
        label: 'RPM ($ USD por 1.000 vistas)',
        type: 'number',
        defaultValue: 3.0,
        min: 0.01,
        max: 100,
        step: 0.1,
        prefix: '$',
        placeholder: 'Ej. 3.00',
        tooltip: 'Ingreso promedio neto por cada 1.000 reproducciones.',
      },
      {
        id: 'months',
        label: 'Número de Meses',
        type: 'number',
        defaultValue: 12,
        min: 1,
        max: 12,
        step: 1,
        placeholder: '12',
        tooltip: 'Periodo de proyección en meses (por defecto: 12 meses).',
      },
    ],
    presets: [
      { label: '300.000 vistas/mes (RPM $3) ➔ $10.800/año', values: { monthlyViews: 300000, rpm: 3.0, months: 12 } },
      { label: '100.000 vistas/mes (RPM $2.5) ➔ $3.000/año', values: { monthlyViews: 100000, rpm: 2.5, months: 12 } },
      { label: '1.000.000 vistas/mes (RPM $4) ➔ $48.000/año', values: { monthlyViews: 1000000, rpm: 4.0, months: 12 } },
    ],
    calculate: (inputs) => {
      const monthlyViews = Number(inputs.monthlyViews) || 0;
      const rpm = Number(inputs.rpm) || 0;
      const months = Number(inputs.months) || 12;

      if (monthlyViews <= 0) {
        return {
          primaryValue: '$0.00 USD',
          primaryLabel: 'Ingresos anuales proyectados',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un número de vistas mensuales mayor que 0.',
          recommendations: ['Ingresa tus vistas mensuales.'],
        };
      }

      if (rpm <= 0) {
        return {
          primaryValue: '$0.00 USD',
          primaryLabel: 'Ingresos anuales proyectados',
          secondaryMetrics: [],
          formulaExplanation: 'Introduzca un RPM mayor que 0.',
          recommendations: ['Ingresa tu RPM estimado.'],
        };
      }

      // Formulas:
      // Vistas anuales = Vistas mensuales * 12
      // Ingresos anuales = (Vistas anuales / 1000) * RPM
      const { annualViews, annualEarnings } = calculateAnnualEarnings(monthlyViews, rpm, months);
      const formattedAnnual = `$${annualEarnings.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;

      return {
        primaryValue: formattedAnnual,
        primaryLabel: 'Ingresos anuales proyectados',
        secondaryMetrics: [
          { label: 'Vistas Anuales Proyectadas', value: `${annualViews.toLocaleString('es-ES')} vistas`, subValue: `${monthlyViews.toLocaleString('es-ES')} vistas/mes × ${months} meses`, highlight: true },
          { label: 'Ingreso Mensual Promedio', value: `$${((monthlyViews / 1000) * rpm).toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD`, subValue: 'Por mes' },
          { label: 'Ingreso Diario Promedio', value: `$${(annualEarnings / 365).toFixed(2)} USD`, isPositive: true },
        ],
        formulaExplanation: `Fórmulas aplicadas:
1. Vistas anuales = Vistas mensuales × ${months} = ${monthlyViews.toLocaleString('es-ES')} × ${months} = ${annualViews.toLocaleString('es-ES')} vistas.
2. Ingresos anuales = (Vistas anuales / 1000) × RPM = (${annualViews.toLocaleString('es-ES')} / 1.000) × $${rpm.toFixed(2)} = ${formattedAnnual}`,
        benchmarkText: 'Esta es una proyección matemática y no una garantía de ingresos. Los ingresos anuales reales pueden experimentar variaciones estacionales significativas, especialmente en el cuarto trimestre (Q4).',
        benchmarkStatus: annualEarnings >= 5000 ? 'optimal' : 'average',
        recommendations: [
          'Esta es una proyección matemática anual y no una garantía de ingresos.',
          'Los meses de Octubre, Noviembre y Diciembre (Q4) suelen tener un RPM entre un 20% y 50% superior.',
          'Construye videos que se busquen todo el año (evergreen) para mantener tus vistas constantes mes a mes.',
        ],
        rawOutput: { annualViews, annualEarnings, monthlyViews, rpm, months },
      };
    },
    seo: {
      title: 'Calculadora de Ingresos Anuales de YouTube - Proyección de Ganancias al Año',
      metaDescription: 'Proyecta cuánto dinero gana un canal de YouTube al año según sus visualizaciones mensuales y RPM. Fórmulas oficiales y transparentes.',
      h1: 'Calculadora de Ingresos Anuales de YouTube',
      keywords: ['calculadora ingresos anuales youtube', 'cuanto gana un youtuber al año', 'proyeccion ingresos anuales adsense', 'vistas anuales youtube'],
      summary: 'Calcula tus ingresos anuales proyectados en YouTube a partir de tus visualizaciones mensuales con la fórmula matemática: (Vistas Anuales / 1000) * RPM.',
      formulaMarkdown: '`Vistas Anuales = Vistas Mensuales * 12` | `Ingresos Anuales = (Vistas Anuales / 1000) * RPM`',
      howToSteps: [
        'Introduce tus visualizaciones mensuales promedio (ej. 300.000 vistas/mes).',
        'Ingresa tu RPM estimado (ej. $3.00 USD).',
        'Indica el número de meses de la proyección (por defecto 12 meses).',
        'Obtén la proyección anual de ingresos y reproducciones.',
      ],
      tipsToImprove: [
        '300.000 vistas mensuales con RPM $3 equivalen a 3.600.000 vistas anuales y $10.800 USD al año.',
      ],
      faqs: [
        {
          question: '¿Por qué el RPM cambia a lo largo del año?',
          answer: 'En el primer trimestre (Q1, enero-marzo) los anunciantes reducen presupuestos y el RPM baja. En el cuarto trimestre (Q4, octubre-diciembre) con el Black Friday y Navidad, el gasto publicitario sube considerablemente.',
        },
      ],
    },
    relatedSlugs: ['calculadora-ingresos-mensuales', 'calculadora-ganancias-youtube', 'vistas-para-ganar-100-dolares'],
  },
];
