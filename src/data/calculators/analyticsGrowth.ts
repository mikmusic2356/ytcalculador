import { CalculatorConfig } from '../../types';
import {
  calculateGrowthPercentage,
  calculateCompoundProjection,
  calculateChannelCompoundProjection,
} from '../../utils/mathFormulas';

export const ANALYTICS_GROWTH_CALCULATORS: CalculatorConfig[] = [
  // 1. Calculadora de Crecimiento Porcentual General
  {
    id: 'crecimiento-porcentual',
    slug: 'calculadora-crecimiento-porcentual',
    name: 'Calculadora de Crecimiento Porcentual',
    tagline: 'Mide la Variación Relativa y Absoluta de Cualquier Métrica de YouTube',
    shortDescription: 'Calcula el incremento o decremento porcentual entre dos valores para vistas, suscriptores, ingresos, likes o comentarios.',
    category: 'analytics',
    subcategory: 'crecimiento',
    iconName: 'Percent',
    popularRank: 11,
    badge: 'Crecimiento',
    fields: [
      {
        id: 'metricType',
        label: 'Tipo de Métrica a Comparar',
        type: 'select',
        defaultValue: 'vistas',
        options: [
          { label: 'Visualizaciones (Vistas)', value: 'vistas' },
          { label: 'Suscriptores', value: 'suscriptores' },
          { label: 'Ingresos Estimados ($)', value: 'ingresos' },
          { label: 'Watch Time (Horas)', value: 'watchtime' },
          { label: 'Me Gusta (Likes)', value: 'likes' },
          { label: 'Comentarios', value: 'comentarios' },
        ],
      },
      {
        id: 'initialValue',
        label: 'Valor Inicial (Período Anterior)',
        type: 'number',
        defaultValue: 50000,
        min: 0.01,
        max: 1000000000,
        step: 500,
        placeholder: 'Ej. 50000',
        tooltip: 'Cifra inicial del período previo.',
      },
      {
        id: 'finalValue',
        label: 'Valor Final (Período Actual)',
        type: 'number',
        defaultValue: 75000,
        min: 0,
        max: 1000000000,
        step: 500,
        placeholder: 'Ej. 75000',
        tooltip: 'Cifra resultante en el nuevo período.',
      },
    ],
    presets: [
      { label: '50.000 a 75.000 (+50.00%)', values: { metricType: 'vistas', initialValue: 50000, finalValue: 75000 } },
      { label: '1.000 a 2.500 (+150.00%)', values: { metricType: 'suscriptores', initialValue: 1000, finalValue: 2500 } },
      { label: '$250 a $600 (+140.00%)', values: { metricType: 'ingresos', initialValue: 250, finalValue: 600 } },
    ],
    calculate: (inputs) => {
      const initial = Number(inputs.initialValue) || 0;
      const final = Number(inputs.finalValue) || 0;
      const metric = String(inputs.metricType || 'vistas');

      if (initial <= 0) {
        return {
          primaryValue: '0.00%',
          primaryLabel: 'Crecimiento Porcentual',
          secondaryMetrics: [],
          formulaExplanation: 'El valor inicial debe ser mayor que 0.',
          recommendations: ['Introduce un valor inicial positivo.'],
        };
      }

      // Formula: Crecimiento (%) = ((Valor Final - Valor Inicial) / Valor Inicial) * 100
      const { growthPercentage, absoluteDifference, isPositive } = calculateGrowthPercentage(initial, final);

      const breakdownData = [
        { name: 'Valor Inicial', value: initial },
        { name: 'Diferencia Absoluta', value: Math.max(0, absoluteDifference) },
        { name: 'Valor Final', value: final },
      ];

      return {
        primaryValue: `${isPositive ? '+' : ''}${growthPercentage.toFixed(2)}%`,
        primaryLabel: 'Variación Porcentual',
        secondaryMetrics: [
          { label: 'Diferencia Absoluta', value: `${isPositive ? '+' : ''}${absoluteDifference.toLocaleString('es-ES')}`, highlight: true, isPositive },
          { label: 'Valor Inicial', value: initial.toLocaleString('es-ES') },
          { label: 'Valor Final', value: final.toLocaleString('es-ES') },
        ],
        formulaExplanation: `Fórmula: Crecimiento (%) = ((Valor final - Valor inicial) / Valor inicial) × 100\nCálculo: ((${final.toLocaleString('es-ES')} - ${initial.toLocaleString('es-ES')}) / ${initial.toLocaleString('es-ES')}) × 100 = (${absoluteDifference.toLocaleString('es-ES')} / ${initial.toLocaleString('es-ES')}) × 100 = ${isPositive ? '+' : ''}${growthPercentage.toFixed(2)}%`,
        benchmarkText: isPositive ? `Tu métrica de ${metric} experimentó un incremento neto del ${growthPercentage.toFixed(2)}%.` : `Tu métrica de ${metric} registró un retroceso del ${growthPercentage.toFixed(2)}%.`,
        benchmarkStatus: isPositive ? 'optimal' : 'needs-work',
        recommendations: [
          'Usa esta fórmula para medir tus tasas de crecimiento mes a mes (MoM) y año contra año (YoY).',
          'Monitorea si un aumento en vistas viene acompañado de un crecimiento porcentual equivalente en suscriptores e ingresos.',
        ],
        breakdownData,
        rawOutput: { growthPercentage, absoluteDifference, isPositive, initial, final, metric },
      };
    },
    seo: {
      title: 'Calculadora de Crecimiento Porcentual para YouTube',
      metaDescription: 'Calcula el incremento o decremento porcentual de cualquier métrica de YouTube con la fórmula oficial: ((Final - Inicial) / Inicial) * 100.',
      h1: 'Calculadora de Crecimiento Porcentual de YouTube',
      keywords: ['calculadora crecimiento porcentual youtube', 'como calcular crecimiento de canal', 'formula crecimiento porcentual youtube'],
      summary: 'Mide la evolución porcentual exacta de vistas, suscriptores, ingresos y engagement entre dos períodos.',
      formulaMarkdown: '`Crecimiento (%) = ((Valor Final - Valor Inicial) / Valor Inicial) * 100`',
      howToSteps: [
        'Selecciona el tipo de métrica a analizar.',
        'Introduce el valor inicial y el valor final.',
        'Haz clic en "Calcular Crecimiento Porcentual".',
      ],
      tipsToImprove: [
        'Un incremento de 50.000 a 75.000 unidades representa un crecimiento exacto del +50,00%.',
      ],
      faqs: [
        {
          question: '¿Cómo se interpreta una variación negativa en YouTube?',
          answer: 'Un resultado negativo indica que en el nuevo período obtuviste menos volumen que en el anterior. Es habitual tras el pico de un video viral hasta estabilizarse en una nueva base orgánica.',
        },
      ],
    },
    relatedSlugs: ['proyeccion-vistas-youtube', 'proyeccion-suscriptores-youtube', 'comparador-periodos-youtube'],
  },

  // 2. Proyección de Vistas de YouTube
  {
    id: 'proyeccion-vistas',
    slug: 'proyeccion-vistas-youtube',
    name: 'Calculadora de Proyección de Vistas',
    tagline: 'Calcula el Crecimiento Compuesto Futuro de tus Visualizaciones',
    shortDescription: 'Calcula la proyección matemática de vistas futuras mes a mes a partir de tu volumen actual y una tasa de crecimiento estimada.',
    category: 'analytics',
    subcategory: 'crecimiento',
    iconName: 'TrendingUp',
    popularRank: 12,
    badge: 'Crecimiento',
    fields: [
      {
        id: 'currentViews',
        label: 'Visualizaciones Mensuales Actuales',
        type: 'number',
        defaultValue: 50000,
        min: 100,
        max: 1000000000,
        step: 5000,
        placeholder: 'Ej. 50000',
        tooltip: 'Vistas que genera tu canal actualmente por mes.',
      },
      {
        id: 'growthRate',
        label: 'Tasa Estimada de Crecimiento Mensual (%)',
        type: 'number',
        defaultValue: 10,
        min: -50,
        max: 200,
        step: 1,
        placeholder: 'Ej. 10',
        tooltip: 'Porcentaje estimado de crecimiento intermensual (ej. 10%).',
      },
      {
        id: 'periods',
        label: 'Horizonte Temporal (Meses)',
        type: 'select',
        defaultValue: '6',
        options: [
          { label: '3 Meses (Corto Plazo)', value: '3' },
          { label: '6 Meses (Medio Plazo)', value: '6' },
          { label: '12 Meses (1 Año)', value: '12' },
          { label: '24 Meses (2 Años)', value: '24' },
        ],
      },
    ],
    presets: [
      { label: '50k vistas / 10% mensual en 6 meses ➔ 88.578 vistas/mes', values: { currentViews: 50000, growthRate: 10, periods: '6' } },
      { label: '100k vistas / 5% mensual en 12 meses ➔ 179.586 vistas/mes', values: { currentViews: 100000, growthRate: 5, periods: '12' } },
      { label: '20k vistas / 15% mensual en 12 meses ➔ 107.005 vistas/mes', values: { currentViews: 20000, growthRate: 15, periods: '12' } },
    ],
    calculate: (inputs) => {
      const views = Number(inputs.currentViews) || 0;
      const rate = Number(inputs.growthRate) || 0;
      const months = Number(inputs.periods) || 6;

      if (views <= 0) {
        return {
          primaryValue: '0 vistas',
          primaryLabel: 'Vistas Proyectadas',
          secondaryMetrics: [],
          formulaExplanation: 'Las visualizaciones actuales deben ser mayores que 0.',
          recommendations: ['Introduce tus vistas mensuales actuales.'],
        };
      }

      // Formula: Vistas futuras = Vistas actuales * (1 + tasa)^períodos
      const { finalValue, totalGrowthPercent, points } = calculateCompoundProjection(views, rate, months, 'meses');

      const breakdownData = points.map((p) => ({
        name: p.label,
        value: p.value,
      }));

      return {
        primaryValue: `${finalValue.toLocaleString('es-ES')} vistas/mes`,
        primaryLabel: `Vistas Proyectadas en el Mes ${months}`,
        secondaryMetrics: [
          { label: 'Crecimiento Acumulado', value: `+${totalGrowthPercent.toFixed(1)}%`, highlight: true, isPositive: totalGrowthPercent >= 0 },
          { label: 'Vistas Actuales', value: `${views.toLocaleString('es-ES')}/mes` },
          { label: 'Incremento Mensual Neto', value: `+${(finalValue - views).toLocaleString('es-ES')} vistas/mes` },
        ],
        formulaExplanation: `Fórmula de Crecimiento Compuesto:\nVistas Futuras = Vistas Actuales × (1 + Tasa)^Meses\nCálculo: ${views.toLocaleString('es-ES')} × (1 + ${(rate / 100).toFixed(2)})^${months} = ${views.toLocaleString('es-ES')} × ${Math.pow(1 + rate / 100, months).toFixed(4)} = ${finalValue.toLocaleString('es-ES')} vistas mensuales`,
        benchmarkText: `Aviso: Esta es una proyección matemática teórica basada exclusivamente en la tasa del ${rate}% introducida. El algoritmo de YouTube no garantiza crecimientos lineales ni exponenciales fijos.`,
        benchmarkStatus: 'info',
        recommendations: [
          'Mantener un crecimiento mensual compuesto del 10% duplica el tráfico de un canal en aproximadamente 7 meses (regla del 72).',
          'Acompaña las proyecciones de un calendario constante de publicaciones y optimización periódica de miniaturas.',
        ],
        breakdownData,
        rawOutput: { finalValue, totalGrowthPercent, points, views, rate, months },
      };
    },
    seo: {
      title: 'Calculadora de Proyección de Vistas de YouTube - Crecimiento Compuesto',
      metaDescription: 'Proyecta las visualizaciones futuras de tu canal de YouTube aplicando la fórmula matemática de interés compuesto: Vistas * (1 + tasa)^meses.',
      h1: 'Calculadora de Proyección de Vistas de YouTube',
      keywords: ['proyeccion vistas youtube', 'calculadora crecimiento vistas youtube', 'estimar reproducciones futuras youtube'],
      summary: 'Calcula la evolución de tus reproducciones mes a mes aplicando tasas de crecimiento compuesto teórico.',
      formulaMarkdown: '`Vistas Futuras = Vistas Actuales * (1 + Tasa)^Meses`',
      howToSteps: [
        'Ingresa tus vistas mensuales actuales.',
        'Establece la tasa de crecimiento mensual estimada (ej. 5%, 10%, 15%).',
        'Selecciona el plazo de proyección (3, 6, 12 o 24 meses).',
        'Analiza la tabla de progresión mensual.',
      ],
      tipsToImprove: [
        '50.000 vistas al 10% mensual durante 6 meses alcanzan exactamente 88.578 reproducciones mensuales (+77,16% de crecimiento total).',
      ],
      faqs: [
        {
          question: '¿Por qué se utiliza la fórmula de interés compuesto para las vistas?',
          answer: 'Porque a medida que un canal suma suscriptores y catálogo de videos indexados, las nuevas publicaciones se suman al fondo de catálogo (backlog) generando un efecto acumulativo.',
        },
      ],
    },
    relatedSlugs: ['proyeccion-suscriptores-youtube', 'proyeccion-crecimiento-canal', 'calculadora-crecimiento-porcentual'],
  },

  // 3. Proyección de Suscriptores de YouTube
  {
    id: 'proyeccion-suscriptores',
    slug: 'proyeccion-suscriptores-youtube',
    name: 'Calculadora de Proyección de Suscriptores',
    tagline: 'Proyecta el Tamaño Futuro de tu Comunidad de Suscriptores',
    shortDescription: 'Calcula el número estimado de suscriptores que tendrá tu canal mes a mes en base a una tasa de crecimiento compuesta.',
    category: 'analytics',
    subcategory: 'crecimiento',
    iconName: 'Users',
    popularRank: 13,
    badge: 'Crecimiento',
    fields: [
      {
        id: 'currentSubs',
        label: 'Suscriptores Actuales',
        type: 'number',
        defaultValue: 10000,
        min: 1,
        max: 1000000000,
        step: 500,
        placeholder: 'Ej. 10000',
        tooltip: 'Número actual de suscriptores en tu canal.',
      },
      {
        id: 'growthRate',
        label: 'Tasa Estimada de Crecimiento Mensual (%)',
        type: 'number',
        defaultValue: 8,
        min: -50,
        max: 200,
        step: 0.5,
        placeholder: 'Ej. 8',
        tooltip: 'Porcentaje de crecimiento mensual esperado (ej. 8%).',
      },
      {
        id: 'periods',
        label: 'Meses a Proyectar',
        type: 'select',
        defaultValue: '6',
        options: [
          { label: '3 Meses', value: '3' },
          { label: '6 Meses', value: '6' },
          { label: '12 Meses (1 Año)', value: '12' },
          { label: '24 Meses (2 Años)', value: '24' },
        ],
      },
    ],
    presets: [
      { label: '10k subs / 8% mensual en 6 meses ➔ 15.869 subs', values: { currentSubs: 10000, growthRate: 8, periods: '6' } },
      { label: '1k subs / 15% mensual en 12 meses ➔ 5.350 subs', values: { currentSubs: 1000, growthRate: 15, periods: '12' } },
      { label: '50k subs / 5% mensual en 12 meses ➔ 89.793 subs', values: { currentSubs: 50000, growthRate: 5, periods: '12' } },
    ],
    calculate: (inputs) => {
      const subs = Number(inputs.currentSubs) || 0;
      const rate = Number(inputs.growthRate) || 0;
      const months = Number(inputs.periods) || 6;

      if (subs <= 0) {
        return {
          primaryValue: '0 suscriptores',
          primaryLabel: 'Suscriptores Proyectados',
          secondaryMetrics: [],
          formulaExplanation: 'Los suscriptores actuales deben ser mayores que 0.',
          recommendations: ['Introduce tus suscriptores actuales.'],
        };
      }

      // Formula: Suscriptores futuros = Suscriptores actuales * (1 + tasa)^períodos
      const { finalValue, totalGrowthPercent, points } = calculateCompoundProjection(subs, rate, months, 'meses');

      const breakdownData = points.map((p) => ({
        name: p.label,
        value: p.value,
      }));

      return {
        primaryValue: `${finalValue.toLocaleString('es-ES')} suscriptores`,
        primaryLabel: `Comunidad Estimada en el Mes ${months}`,
        secondaryMetrics: [
          { label: 'Crecimiento Total', value: `+${totalGrowthPercent.toFixed(1)}%`, highlight: true, isPositive: totalGrowthPercent >= 0 },
          { label: 'Base Inicial', value: `${subs.toLocaleString('es-ES')} subs` },
          { label: 'Ganancia Neta Proyectada', value: `+${(finalValue - subs).toLocaleString('es-ES')} subs` },
        ],
        formulaExplanation: `Fórmula de Crecimiento Compuesto:\nSuscriptores Futuros = Suscriptores Actuales × (1 + Tasa)^Meses\nCálculo: ${subs.toLocaleString('es-ES')} × (1 + ${(rate / 100).toFixed(2)})^${months} = ${subs.toLocaleString('es-ES')} × ${Math.pow(1 + rate / 100, months).toFixed(4)} = ${finalValue.toLocaleString('es-ES')} suscriptores`,
        benchmarkText: `Aviso: Esta estimación representa un cálculo matemático estricto según la tasa introducida (${rate}% mensual). Los resultados reales dependerán del comportamiento del algoritmo y la retención del canal.`,
        benchmarkStatus: 'info',
        recommendations: [
          'Diversifica formatos combinando videos largos con Shorts para mantener la tasa de descubrimiento activa.',
          'Revisa mensualmente la diferencia entre tu crecimiento proyectado y tu crecimiento real para recalibrar tus objetivos.',
        ],
        breakdownData,
        rawOutput: { finalValue, totalGrowthPercent, points, subs, rate, months },
      };
    },
    seo: {
      title: 'Calculadora de Proyección de Suscriptores de YouTube',
      metaDescription: 'Calcula el número futuro de suscriptores de tu canal de YouTube aplicando fórmulas matemáticas de crecimiento compuesto mes a mes.',
      h1: 'Calculadora de Proyección de Suscriptores de YouTube',
      keywords: ['proyeccion suscriptores youtube', 'calcular crecimiento suscriptores youtube', 'cuantos suscriptores tendre youtube'],
      summary: 'Proyecta el tamaño de tu audiencia a 3, 6, 12 o 24 meses según tu tasa de captación mensual.',
      formulaMarkdown: '`Suscriptores Futuros = Suscriptores Actuales * (1 + Tasa)^Meses`',
      howToSteps: [
        'Ingresa tus suscriptores actuales.',
        'Indica tu tasa mensual de crecimiento.',
        'Selecciona el número de meses a simular.',
        'Revisa la proyección mes a mes.',
      ],
      tipsToImprove: [
        '10.000 suscriptores con un crecimiento mensual del 8% alcanzan 15.869 suscriptores en 6 meses (+58,69% de aumento).',
      ],
      faqs: [
        {
          question: '¿Cómo saber qué tasa de crecimiento mensual ingresar?',
          answer: 'Revisa en YouTube Studio tu crecimiento de los últimos 3 meses: divide los suscriptores ganados en el último mes entre tu total al inicio del mes y multiplícalo por 100.',
        },
      ],
    },
    relatedSlugs: ['proyeccion-vistas-youtube', 'proyeccion-crecimiento-canal', 'calculadora-crecimiento-suscriptores'],
  },

  // 4. Proyección de Crecimiento del Canal (Vistas y Suscriptores simultáneos)
  {
    id: 'proyeccion-canal',
    slug: 'proyeccion-crecimiento-canal',
    name: 'Calculadora de Proyección de Crecimiento del Canal',
    tagline: 'Simulación Integral Dual de Visualizaciones y Suscriptores',
    shortDescription: 'Calcula y visualiza la evolución simultánea de vistas mensuales y comunidad de suscriptores a medio y largo plazo.',
    category: 'analytics',
    subcategory: 'crecimiento',
    iconName: 'Sparkles',
    popularRank: 14,
    badge: 'Crecimiento',
    fields: [
      {
        id: 'currentViews',
        label: 'Vistas Mensuales Actuales',
        type: 'number',
        defaultValue: 100000,
        min: 100,
        max: 1000000000,
        step: 5000,
        placeholder: 'Ej. 100000',
        tooltip: 'Visualizaciones mensuales actuales.',
      },
      {
        id: 'currentSubs',
        label: 'Suscriptores Actuales',
        type: 'number',
        defaultValue: 15000,
        min: 1,
        max: 1000000000,
        step: 500,
        placeholder: 'Ej. 15000',
        tooltip: 'Número de suscriptores actuales del canal.',
      },
      {
        id: 'viewGrowthRate',
        label: 'Tasa Mensual Crecimiento Vistas (%)',
        type: 'number',
        defaultValue: 7,
        min: -50,
        max: 200,
        step: 0.5,
        placeholder: 'Ej. 7',
      },
      {
        id: 'subGrowthRate',
        label: 'Tasa Mensual Crecimiento Subs (%)',
        type: 'number',
        defaultValue: 6,
        min: -50,
        max: 200,
        step: 0.5,
        placeholder: 'Ej. 6',
      },
      {
        id: 'months',
        label: 'Período de Simulación (Meses)',
        type: 'select',
        defaultValue: '12',
        options: [
          { label: '6 Meses', value: '6' },
          { label: '12 Meses (1 Año)', value: '12' },
          { label: '24 Meses (2 Años)', value: '24' },
        ],
      },
    ],
    presets: [
      { label: '100k vistas (7%) & 15k subs (6%) a 12 meses', values: { currentViews: 100000, currentSubs: 15000, viewGrowthRate: 7, subGrowthRate: 6, months: '12' } },
      { label: '50k vistas (10%) & 5k subs (10%) a 12 meses', values: { currentViews: 50000, currentSubs: 5000, viewGrowthRate: 10, subGrowthRate: 10, months: '12' } },
    ],
    calculate: (inputs) => {
      const views = Number(inputs.currentViews) || 0;
      const subs = Number(inputs.currentSubs) || 0;
      const viewRate = Number(inputs.viewGrowthRate) || 0;
      const subRate = Number(inputs.subGrowthRate) || 0;
      const months = Number(inputs.months) || 12;

      if (views <= 0 || subs <= 0) {
        return {
          primaryValue: '0 vistas / 0 subs',
          primaryLabel: 'Proyección del Canal',
          secondaryMetrics: [],
          formulaExplanation: 'Ingresa valores iniciales mayores a 0.',
          recommendations: ['Ingresa tus vistas y suscriptores actuales.'],
        };
      }

      const { finalViews, finalSubs, viewGrowthPercent, subGrowthPercent, points } =
        calculateChannelCompoundProjection(views, subs, viewRate, subRate, months);

      const breakdownData = points.map((p) => ({
        name: p.label,
        value: p.views,
        subs: p.subscribers,
      }));

      return {
        primaryValue: `${finalViews.toLocaleString('es-ES')} vistas / ${finalSubs.toLocaleString('es-ES')} subs`,
        primaryLabel: `Estado Proyectado en el Mes ${months}`,
        secondaryMetrics: [
          { label: 'Crecimiento Vistas', value: `+${viewGrowthPercent.toFixed(1)}%`, highlight: true, isPositive: viewGrowthPercent >= 0 },
          { label: 'Crecimiento Suscriptores', value: `+${subGrowthPercent.toFixed(1)}%`, highlight: true, isPositive: subGrowthPercent >= 0 },
          { label: 'Ganancia Neta Vistas/mes', value: `+${(finalViews - views).toLocaleString('es-ES')}` },
        ],
        formulaExplanation: `Fórmulas compuestas aplicadas:\n1. Vistas en mes ${months} = ${views.toLocaleString('es-ES')} × (1 + ${viewRate / 100})^${months} = ${finalViews.toLocaleString('es-ES')} vistas/mes\n2. Suscriptores en mes ${months} = ${subs.toLocaleString('es-ES')} × (1 + ${subRate / 100})^${months} = ${finalSubs.toLocaleString('es-ES')} suscriptores`,
        benchmarkText: 'Proyección basada exclusivamente en la tasa de crecimiento introducida. Úsala como marco estratégico para la planificación de contenido.',
        benchmarkStatus: 'info',
        recommendations: [
          'Monitorea la correlación entre el crecimiento de vistas y el de suscriptores para asegurar una audiencia fiel y duradera.',
          'Define objetivos trimestrales basados en los hitos proyectados a los meses 3, 6 y 12.',
        ],
        breakdownData,
        rawOutput: { finalViews, finalSubs, viewGrowthPercent, subGrowthPercent, points, views, subs, viewRate, subRate, months },
      };
    },
    seo: {
      title: 'Calculadora de Proyección de Crecimiento del Canal de YouTube',
      metaDescription: 'Simula el crecimiento simultáneo de vistas y suscriptores de tu canal de YouTube a 6, 12 o 24 meses con fórmulas compuestas.',
      h1: 'Calculadora de Proyección de Crecimiento del Canal',
      keywords: ['proyeccion canal youtube', 'simulador crecimiento canal youtube', 'proyeccion vistas y suscriptores youtube'],
      summary: 'Herramienta de simulación integral para proyectar el futuro de tu canal a corto, medio y largo plazo.',
      formulaMarkdown: '`Valor Futuro = Valor Actual * (1 + Tasa)^Meses`',
      howToSteps: [
        'Introduce tus vistas y suscriptores actuales.',
        'Establece las tasas estimadas para cada métrica.',
        'Selecciona el plazo en meses.',
        'Analiza la proyección integral.',
      ],
      tipsToImprove: [
        'Permite planificar inversiones en equipamiento y producción con anticipación.',
      ],
      faqs: [
        {
          question: '¿Con qué frecuencia se debe recalcular la proyección del canal?',
          answer: 'Se recomienda actualizar los datos cada trimestre con las métricas reales del período para mantener proyecciones realistas.',
        },
      ],
    },
    relatedSlugs: ['proyeccion-vistas-youtube', 'proyeccion-suscriptores-youtube', 'comparador-periodos-youtube'],
  },

  // 5. Comparador de Crecimiento entre Períodos
  {
    id: 'comparador-crecimiento-periodos',
    slug: 'comparador-crecimiento-periodos',
    name: 'Comparador de Crecimiento entre Períodos',
    tagline: 'Compara el Rendimiento Global de tu Canal entre Dos Rangos de Fecha',
    shortDescription: 'Calcula la diferencia porcentual y absoluta entre dos períodos (mes anterior vs mes actual, trimestre vs trimestre).',
    category: 'analytics',
    subcategory: 'crecimiento',
    iconName: 'BarChart2',
    popularRank: 15,
    badge: 'Crecimiento',
    fields: [
      {
        id: 'viewsPeriodA',
        label: 'Vistas Período 1 (Anterior)',
        type: 'number',
        defaultValue: 80000,
        min: 1,
        max: 1000000000,
        step: 5000,
        placeholder: 'Ej. 80000',
      },
      {
        id: 'viewsPeriodB',
        label: 'Vistas Período 2 (Actual)',
        type: 'number',
        defaultValue: 110000,
        min: 0,
        max: 1000000000,
        step: 5000,
        placeholder: 'Ej. 110000',
      },
      {
        id: 'subsPeriodA',
        label: 'Suscriptores Período 1',
        type: 'number',
        defaultValue: 1200,
        min: 0,
        max: 100000000,
        step: 50,
        placeholder: 'Ej. 1200',
      },
      {
        id: 'subsPeriodB',
        label: 'Suscriptores Período 2',
        type: 'number',
        defaultValue: 1800,
        min: 0,
        max: 100000000,
        step: 50,
        placeholder: 'Ej. 1800',
      },
    ],
    presets: [
      { label: '80k vistas / 1.2k subs vs 110k vistas / 1.8k subs', values: { viewsPeriodA: 80000, viewsPeriodB: 110000, subsPeriodA: 1200, subsPeriodB: 1800 } },
      { label: '50k vistas / 800 subs vs 45k vistas / 700 subs', values: { viewsPeriodA: 50000, viewsPeriodB: 45000, subsPeriodA: 800, subsPeriodB: 700 } },
    ],
    calculate: (inputs) => {
      const vA = Number(inputs.viewsPeriodA) || 0;
      const vB = Number(inputs.viewsPeriodB) || 0;
      const sA = Number(inputs.subsPeriodA) || 0;
      const sB = Number(inputs.subsPeriodB) || 0;

      if (vA <= 0) {
        return {
          primaryValue: '0.00%',
          primaryLabel: 'Crecimiento de Vistas',
          secondaryMetrics: [],
          formulaExplanation: 'Las vistas del Período 1 deben ser mayores que 0.',
          recommendations: ['Introduce las vistas del Período 1.'],
        };
      }

      const viewGrowth = calculateGrowthPercentage(vA, vB);
      const subGrowth = calculateGrowthPercentage(sA, sB);

      const breakdownData = [
        { name: 'Vistas P1', value: vA },
        { name: 'Vistas P2', value: vB },
        { name: 'Subs P1', value: sA },
        { name: 'Subs P2', value: sB },
      ];

      return {
        primaryValue: `${viewGrowth.isPositive ? '+' : ''}${viewGrowth.growthPercentage.toFixed(1)}% Vistas`,
        primaryLabel: 'Evolución de Tráfico entre Períodos',
        secondaryMetrics: [
          { label: 'Crecimiento en Suscriptores', value: `${subGrowth.isPositive ? '+' : ''}${subGrowth.growthPercentage.toFixed(1)}%`, highlight: true, isPositive: subGrowth.isPositive },
          { label: 'Diferencia Neta Vistas', value: `${viewGrowth.isPositive ? '+' : ''}${viewGrowth.absoluteDifference.toLocaleString('es-ES')}` },
          { label: 'Diferencia Neta Subs', value: `${subGrowth.isPositive ? '+' : ''}${subGrowth.absoluteDifference.toLocaleString('es-ES')}` },
        ],
        formulaExplanation: `Cálculos:\n1. Crecimiento Vistas = ((${vB.toLocaleString('es-ES')} - ${vA.toLocaleString('es-ES')}) / ${vA.toLocaleString('es-ES')}) × 100 = ${viewGrowth.isPositive ? '+' : ''}${viewGrowth.growthPercentage.toFixed(2)}%\n2. Crecimiento Suscriptores = ((${sB.toLocaleString('es-ES')} - ${sA.toLocaleString('es-ES')}) / ${sA.toLocaleString('es-ES')}) × 100 = ${subGrowth.isPositive ? '+' : ''}${subGrowth.growthPercentage.toFixed(2)}%`,
        benchmarkText: viewGrowth.isPositive ? `Excelente: El período actual supera al anterior en un ${viewGrowth.growthPercentage.toFixed(1)}% en vistas y ${subGrowth.growthPercentage.toFixed(1)}% en suscriptores.` : `El período actual experimentó una contracción del ${viewGrowth.growthPercentage.toFixed(1)}% en vistas.`,
        benchmarkStatus: viewGrowth.isPositive ? 'optimal' : 'needs-work',
        recommendations: [
          'Compara los videos publicados en el Período 2 para identificar si un video individual causó la mayor parte de la diferencia.',
          'Analiza si factores estacionales (vacaciones, eventos anuales) influyeron en el comportamiento del público.',
        ],
        breakdownData,
        rawOutput: { viewGrowth, subGrowth, vA, vB, sA, sB },
      };
    },
    seo: {
      title: 'Comparador de Crecimiento entre Períodos de YouTube',
      metaDescription: 'Compara el crecimiento en vistas y suscriptores entre dos períodos en YouTube con fórmulas matemáticas explícitas.',
      h1: 'Comparador de Crecimiento entre Períodos de YouTube',
      keywords: ['comparador periodos youtube', 'crecimiento mes a mes youtube', 'comparar metricas periodos youtube'],
      summary: 'Mide la evolución neta y porcentual de tu canal entre dos meses, trimestres o años.',
      formulaMarkdown: '`Crecimiento (%) = ((Período B - Período A) / Período A) * 100`',
      howToSteps: [
        'Ingresa las vistas y suscriptores del período 1.',
        'Ingresa las vistas y suscriptores del período 2.',
        'Haz clic en "Comparar Crecimiento".',
      ],
      tipsToImprove: [
        'Compara períodos de igual duración (ej. 30 días contra 30 días) para obtener resultados matemáticamente consistentes.',
      ],
      faqs: [
        {
          question: '¿Por qué comparar períodos equivalentes es fundamental?',
          answer: 'Comparar meses de diferente duración o lapsos desiguales distorsiona el cálculo del crecimiento diario promedio.',
        },
      ],
    },
    relatedSlugs: ['comparador-periodos-youtube', 'calculadora-crecimiento-porcentual', 'proyeccion-crecimiento-canal'],
  },
];
