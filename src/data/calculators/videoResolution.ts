import { CalculatorConfig } from '../../types';
import {
  calculateAspectRatio,
  calculate16by9,
  calculate9by16,
  calculate4by3,
  calculateScaledResolution,
  verifyAspectRatio,
} from '../../utils/mathFormulas';

export const VIDEO_RESOLUTION_CALCULATORS: CalculatorConfig[] = [
  // 7. Calculadora de Relación de Aspecto
  {
    id: 'aspect-ratio',
    slug: 'calculadora-relacion-aspecto',
    name: 'Calculadora de Relación de Aspecto (Aspect Ratio)',
    tagline: 'Calcula y Simplifica la Proporción de Ancho y Alto de Cualquier Pantalla o Video',
    shortDescription: 'Introduce el ancho y alto en píxeles para obtener la relación de aspecto simplificada (16:9, 9:16, 4:3, 21:9, 1:1) o calcular dimensiones proporcionales.',
    category: 'video',
    subcategory: 'resolucion',
    iconName: 'Maximize',
    popularRank: 12,
    badge: 'Popular',
    fields: [
      {
        id: 'width',
        label: 'Ancho en Píxeles (Width)',
        type: 'number',
        defaultValue: 1920,
        min: 1,
        max: 16384,
        step: 2,
        placeholder: 'Ej. 1920',
      },
      {
        id: 'height',
        label: 'Alto en Píxeles (Height)',
        type: 'number',
        defaultValue: 1080,
        min: 1,
        max: 16384,
        step: 2,
        placeholder: 'Ej. 1080',
      },
    ],
    presets: [
      { label: 'Full HD 1920x1080 (16:9 Estándar)', values: { width: 1920, height: 1080 } },
      { label: 'Shorts / TikTok 1080x1920 (9:16 Vertical)', values: { width: 1080, height: 1920 } },
      { label: '2K 2560x1440 (16:9 QHD)', values: { width: 2560, height: 1440 } },
      { label: '4K Ultra HD 3840x2160 (16:9 UHD)', values: { width: 3840, height: 2160 } },
      { label: 'Ultrawide 3440x1440 (21:9 Cine)', values: { width: 3440, height: 1440 } },
      { label: 'Instagram Post 1080x1080 (1:1 Cuadrado)', values: { width: 1080, height: 1080 } },
    ],
    calculate: (inputs) => {
      const w = Number(inputs.width) || 1920;
      const h = Number(inputs.height) || 1080;

      const res = calculateAspectRatio(w, h);
      const standardText = res.standardName || 'Personalizada';

      return {
        primaryValue: res.ratioText,
        primaryLabel: 'Relación de Aspecto Simplificada',
        secondaryMetrics: [
          { label: 'Formato Reconocido', value: standardText, highlight: true },
          { label: 'Ratio Decimal (W/H)', value: res.ratioDecimal.toFixed(3) },
          { label: 'Resolución Total', value: `${(w * h / 1000000).toFixed(2)} Megapíxeles` },
          { label: 'Píxeles Totales', value: `${(w * h).toLocaleString()} px` },
        ],
        formulaExplanation: `Cálculo de Proporción:\n• Máximo Común Divisor (MCD) de ${w} y ${h}\n• Ancho simplificado = ${w} ÷ MCD = ${res.simplifiedWidth}\n• Alto simplificado = ${h} ÷ MCD = ${res.simplifiedHeight}\n• Proporción = ${res.ratioText} (Decimal: ${res.ratioDecimal.toFixed(4)})`,
        benchmarkText: res.isStandard
          ? `La resolución ${w}x${h} cumple con el estándar de la industria ${standardText}.`
          : 'Esta proporción no es estándar en YouTube. Los reproductores mostrarán barras negras laterales o superiores (pillarbox/letterbox).',
        benchmarkStatus: res.isStandard ? 'optimal' : 'needs-work',
        recommendations: [
          'YouTube utiliza 16:9 como formato nativo para computadoras y televisores, y 9:16 para la experiencia vertical de YouTube Shorts en smartphones.',
        ],
        breakdownData: [
          { name: 'Ancho Relativo', value: res.simplifiedWidth },
          { name: 'Alto Relativo', value: res.simplifiedHeight },
        ],
        rawOutput: res,
      };
    },
    seo: {
      title: 'Calculadora de Relación de Aspecto | 16:9, 9:16, 4:3 y Aspect Ratio',
      metaDescription: 'Calcula la relación de aspecto exacta de cualquier imagen o video introduciendo ancho y alto en píxeles. Simplificación matemática con MCD.',
      h1: 'Calculadora de Relación de Aspecto (Aspect Ratio)',
      keywords: ['calculadora relacion de aspecto', 'aspect ratio calculator', 'calcular 16 9 resolucion', 'proporcion video youtube'],
      summary: 'Herramienta matemática para simplificar dimensiones en píxeles a relaciones de aspecto cinematográficas y digitales.',
      formulaMarkdown: '`Ratio = (Ancho / MCD) : (Alto / MCD)`',
      howToSteps: ['Introduce el ancho en píxeles.', 'Introduce el alto en píxeles.', 'Obtén la proporción simplificada instantáneamente.'],
      tipsToImprove: ['Para evitar barras negras en YouTube, mantén siempre tus videos en múltiplos exactos de 16:9 o 9:16.'],
      faqs: [
        {
          question: '¿Qué relación de aspecto tiene 1920x1080?',
          answer: '1920x1080 tiene una relación de aspecto de 16:9, ya que el Máximo Común Divisor entre 1920 y 1080 es 120 (1920/120=16 y 1080/120=9).',
        },
      ],
    },
    relatedSlugs: ['calculadora-16-9', 'calculadora-9-16', 'calculadora-dimensiones-video'],
  },

  // 8. Calculadora 16:9
  {
    id: 'aspect-16-9',
    slug: 'calculadora-16-9',
    name: 'Calculadora de Dimensiones 16:9 (Panorámico)',
    tagline: 'Calcula Ancho o Alto manteniendo la Proporción Panorámica Estándar de YouTube',
    shortDescription: 'Introduce el ancho o el alto para obtener de forma automática la dimensión complementaria perfecta en formato panorámico 16:9.',
    category: 'video',
    subcategory: 'resolucion',
    iconName: 'Tv',
    popularRank: 13,
    badge: 'YouTube Standard',
    fields: [
      {
        id: 'dimensionValue',
        label: 'Valor de Dimensión (Píxeles)',
        type: 'number',
        defaultValue: 1920,
        min: 16,
        max: 16384,
        step: 2,
        placeholder: 'Ej. 1920',
      },
      {
        id: 'dimensionType',
        label: 'Dimensión Introducida',
        type: 'select',
        defaultValue: 'width',
        options: [
          { label: 'Ancho (Calcular Alto 16:9)', value: 'width' },
          { label: 'Alto (Calcular Ancho 16:9)', value: 'height' },
        ],
      },
    ],
    presets: [
      { label: 'Ancho 1920px -> Alto 1080px (1080p FHD)', values: { dimensionValue: 1920, dimensionType: 'width' } },
      { label: 'Ancho 2560px -> Alto 1440px (1440p 2K)', values: { dimensionValue: 2560, dimensionType: 'width' } },
      { label: 'Ancho 3840px -> Alto 2160px (4K UHD)', values: { dimensionValue: 3840, dimensionType: 'width' } },
      { label: 'Alto 720px -> Ancho 1280px (720p HD)', values: { dimensionValue: 720, dimensionType: 'height' } },
    ],
    calculate: (inputs) => {
      const val = Number(inputs.dimensionValue) || 1920;
      const type = (inputs.dimensionType as 'width' | 'height') || 'width';

      const res = calculate16by9(val, type);

      return {
        primaryValue: `${res.width} × ${res.height} px`,
        primaryLabel: 'Resolución 16:9 Calculada',
        secondaryMetrics: [
          { label: type === 'width' ? 'Alto Resultante' : 'Ancho Resultante', value: `${type === 'width' ? res.height : res.width} px`, highlight: true },
          { label: 'Relación de Aspecto', value: '16:9 (1.778:1)' },
          { label: 'Total Megapíxeles', value: `${((res.width * res.height) / 1000000).toFixed(2)} MP` },
          { label: 'Píxeles Totales', value: `${(res.width * res.height).toLocaleString()} px` },
        ],
        formulaExplanation:
          type === 'width'
            ? `Fórmula: Alto = Ancho × (9 / 16)\n• Alto = ${val} × (9 ÷ 16) = ${val} × 0.5625 = ${res.height} píxeles.`
            : `Fórmula: Ancho = Alto × (16 / 9)\n• Ancho = ${val} × (16 ÷ 9) = ${val} × 1.7778 = ${res.width} píxeles.`,
        benchmarkText: 'Resoluciones 16:9 reconocidas en YouTube: 1280x720 (720p), 1920x1080 (1080p), 2560x1440 (1440p), 3840x2160 (4K), 7680x4320 (8K).',
        benchmarkStatus: 'optimal',
        recommendations: [
          'Mantener números pares (preferiblemente divisibles por 8 o 16) garantiza una compatibilidad óptima con los decodificadores de video por hardware (H.264/HEVC).',
        ],
        breakdownData: [
          { name: 'Ancho (16)', value: res.width },
          { name: 'Alto (9)', value: res.height },
        ],
        rawOutput: res,
      };
    },
    seo: {
      title: 'Calculadora 16:9 | Calcular Ancho y Alto en Proporción Panorámica',
      metaDescription: 'Calcula dimensiones en formato 16:9 para video, miniaturas y pantallas. Introduce el ancho o alto y obtén la resolución exacta.',
      h1: 'Calculadora de Dimensiones 16:9',
      keywords: ['calculadora 16 9', 'calcular resolucion 16 9', 'ancho y alto 16 9', 'resoluciones 16 9 youtube'],
      summary: 'Calculadora especializada para formato panorámico 16:9 de YouTube, televisión y monitores.',
      formulaMarkdown: '`Alto = Ancho × (9 / 16) | Ancho = Alto × (16 / 9)`',
      howToSteps: ['Introduce el ancho o el alto en píxeles.', 'Elige qué dimensión estás aportando.', 'Obtén la resolución 16:9 complementaria.'],
      tipsToImprove: ['Las miniaturas de YouTube deben medir exactamente 1280x720 píxeles para mantener la relación 16:9 con un peso inferior a 2 MB.'],
      faqs: [
        {
          question: '¿Si tengo un ancho de 1920, cuánto debe ser el alto en 16:9?',
          answer: 'El alto debe ser 1920 × (9/16) = 1080 píxeles (resolución Full HD 1080p).',
        },
      ],
    },
    relatedSlugs: ['calculadora-9-16', 'calculadora-relacion-aspecto', 'calculadora-escalado-video'],
  },

  // 9. Calculadora 9:16 (Shorts / Vertical)
  {
    id: 'aspect-9-16',
    slug: 'calculadora-9-16',
    name: 'Calculadora de Dimensiones 9:16 (Vertical / Shorts)',
    tagline: 'Dimensiones Perfectas para YouTube Shorts, Reels y TikTok',
    shortDescription: 'Calcula la resolución vertical exacta en proporción 9:16 para tus videos cortos de YouTube Shorts, Instagram Reels y TikTok.',
    category: 'video',
    subcategory: 'resolucion',
    iconName: 'Smartphone',
    popularRank: 14,
    badge: 'Shorts & TikTok',
    fields: [
      {
        id: 'dimensionValue',
        label: 'Valor de Dimensión (Píxeles)',
        type: 'number',
        defaultValue: 1080,
        min: 16,
        max: 16384,
        step: 2,
        placeholder: 'Ej. 1080',
      },
      {
        id: 'dimensionType',
        label: 'Dimensión Introducida',
        type: 'select',
        defaultValue: 'width',
        options: [
          { label: 'Ancho (Calcular Alto Vertical 9:16)', value: 'width' },
          { label: 'Alto (Calcular Ancho Vertical 9:16)', value: 'height' },
        ],
      },
    ],
    presets: [
      { label: '1080px ancho -> 1920px alto (1080x1920 Full HD Vertical)', values: { dimensionValue: 1080, dimensionType: 'width' } },
      { label: '1440px ancho -> 2560px alto (1440x2560 2K Vertical)', values: { dimensionValue: 1440, dimensionType: 'width' } },
      { label: '720px ancho -> 1280px alto (720x1280 HD Vertical)', values: { dimensionValue: 720, dimensionType: 'width' } },
    ],
    calculate: (inputs) => {
      const val = Number(inputs.dimensionValue) || 1080;
      const type = (inputs.dimensionType as 'width' | 'height') || 'width';

      const res = calculate9by16(val, type);

      return {
        primaryValue: `${res.width} × ${res.height} px`,
        primaryLabel: 'Resolución Vertical 9:16',
        secondaryMetrics: [
          { label: type === 'width' ? 'Alto Calculado' : 'Ancho Calculado', value: `${type === 'width' ? res.height : res.width} px`, highlight: true },
          { label: 'Formato', value: '9:16 (0.562:1 Vertical)' },
          { label: 'Total Megapíxeles', value: `${((res.width * res.height) / 1000000).toFixed(2)} MP` },
          { label: 'Recomendado', value: '1080 × 1920 px' },
        ],
        formulaExplanation:
          type === 'width'
            ? `Fórmula: Alto = Ancho × (16 / 9)\n• Alto = ${val} × (16 ÷ 9) = ${val} × 1.7778 = ${res.height} píxeles.`
            : `Fórmula: Ancho = Alto × (9 / 16)\n• Ancho = ${val} × (9 ÷ 16) = ${val} × 0.5625 = ${res.width} píxeles.`,
        benchmarkText: 'Las resoluciones estándar en 9:16 para YouTube Shorts son 720x1280, 1080x1920 y 1440x2560.',
        benchmarkStatus: 'optimal',
        recommendations: [
          'Ubica los textos y elementos interactivos en la zona central segura para evitar que queden tapados por los botones laterales y el título de YouTube Shorts.',
        ],
        breakdownData: [
          { name: 'Ancho (9)', value: res.width },
          { name: 'Alto (16)', value: res.height },
        ],
        rawOutput: res,
      };
    },
    seo: {
      title: 'Calculadora 9:16 | Resoluciones Verticales para YouTube Shorts y TikTok',
      metaDescription: 'Calcula dimensiones en formato vertical 9:16 para YouTube Shorts, Instagram Reels y TikTok con medidas exactas en píxeles.',
      h1: 'Calculadora de Dimensiones 9:16 (Vertical)',
      keywords: ['calculadora 9 16', 'resolucion youtube shorts', 'medidas video vertical', '1080x1920 shorts'],
      summary: 'Calculadora especializada para contenido vertical en plataformas móviles.',
      formulaMarkdown: '`Alto = Ancho × (16 / 9) | Ancho = Alto × (9 / 16)`',
      howToSteps: ['Introduce el ancho deseado (ej. 1080).', 'Calcula la altura vertical proporcional (1920).'],
      tipsToImprove: ['Renderizar Shorts en 1440x2560 ayuda a retener la máxima nitidez tras la compresión de YouTube.'],
      faqs: [
        {
          question: '¿Cuál es la resolución ideal para un YouTube Short?',
          answer: 'La resolución recomendada por YouTube es 1080 × 1920 píxeles a 30 o 60 FPS con una duración máxima de 60 segundos.',
        },
      ],
    },
    relatedSlugs: ['calculadora-16-9', 'calculadora-relacion-aspecto', 'calculadora-escalado-video'],
  },

  // 10. Calculadora 4:3
  {
    id: 'aspect-4-3',
    slug: 'calculadora-4-3',
    name: 'Calculadora de Dimensiones 4:3 (Formato Clásico)',
    tagline: 'Calcula Resoluciones para Video Retro, Televisión Clásica e iPad',
    shortDescription: 'Obtén medidas exactas en proporción 4:3 para adaptaciones de video antiguo, monitores retro o pantallas de tabletas.',
    category: 'video',
    subcategory: 'resolucion',
    iconName: 'Monitor',
    popularRank: 24,
    fields: [
      {
        id: 'dimensionValue',
        label: 'Valor de Dimensión (Píxeles)',
        type: 'number',
        defaultValue: 1024,
        min: 16,
        max: 16384,
        step: 2,
        placeholder: 'Ej. 1024',
      },
      {
        id: 'dimensionType',
        label: 'Dimensión Introducida',
        type: 'select',
        defaultValue: 'width',
        options: [
          { label: 'Ancho (Calcular Alto 4:3)', value: 'width' },
          { label: 'Alto (Calcular Ancho 4:3)', value: 'height' },
        ],
      },
    ],
    presets: [
      { label: '1024px ancho -> 768px alto (XGA 4:3 Clásico)', values: { dimensionValue: 1024, dimensionType: 'width' } },
      { label: '1440px ancho -> 1080px alto (1440x1080 HD 4:3)', values: { dimensionValue: 1440, dimensionType: 'width' } },
      { label: '640px ancho -> 480px alto (VGA 480p Clásico)', values: { dimensionValue: 640, dimensionType: 'width' } },
    ],
    calculate: (inputs) => {
      const val = Number(inputs.dimensionValue) || 1024;
      const type = (inputs.dimensionType as 'width' | 'height') || 'width';

      const res = calculate4by3(val, type);

      return {
        primaryValue: `${res.width} × ${res.height} px`,
        primaryLabel: 'Resolución 4:3 Calculada',
        secondaryMetrics: [
          { label: type === 'width' ? 'Alto Calculado' : 'Ancho Calculado', value: `${type === 'width' ? res.height : res.width} px`, highlight: true },
          { label: 'Proporción', value: '4:3 (1.333:1)' },
          { label: 'Píxeles Totales', value: `${(res.width * res.height).toLocaleString()} px` },
          { label: 'Megapíxeles', value: `${((res.width * res.height) / 1000000).toFixed(2)} MP` },
        ],
        formulaExplanation:
          type === 'width'
            ? `Fórmula: Alto = Ancho × (3 / 4)\n• Alto = ${val} × 0.75 = ${res.height} píxeles.`
            : `Fórmula: Ancho = Alto × (4 / 3)\n• Ancho = ${val} × 1.3333 = ${res.width} píxeles.`,
        benchmarkText: 'Resoluciones clásicas 4:3: 640x480 (VGA), 800x600 (SVGA), 1024x768 (XGA), 1440x1080 (HD 4:3).',
        benchmarkStatus: 'optimal',
        recommendations: [
          'Al subir un video 4:3 a YouTube, el reproductor adaptará automáticamente el marco para evitar barras negras en dispositivos móviles.',
        ],
        breakdownData: [
          { name: 'Ancho (4)', value: res.width },
          { name: 'Alto (3)', value: res.height },
        ],
        rawOutput: res,
      };
    },
    seo: {
      title: 'Calculadora 4:3 | Dimensiones en Proporción Clásica y TV Antigua',
      metaDescription: 'Calcula resoluciones y dimensiones en relación de aspecto 4:3 para videos retro, tabletas y adaptaciones audiovisuales.',
      h1: 'Calculadora de Dimensiones 4:3',
      keywords: ['calculadora 4 3', 'proporcion 4 3 resolucion', 'calcular ancho alto 4 3', 'medidas 4 3 pixeles'],
      summary: 'Calculadora especializada para formato tradicional 4:3 de televisión e informática clásica.',
      formulaMarkdown: '`Alto = Ancho × (3 / 4) | Ancho = Alto × (4 / 3)`',
      howToSteps: ['Introduce el valor de ancho o alto.', 'Obtén la medida proporcional 4:3.'],
      tipsToImprove: ['Para remasterizar material 4:3 a 16:9 sin recortar bordes, utiliza escalado pillarbox con fondos difuminados.'],
      faqs: [
        {
          question: '¿Qué resolución tiene 1080p en 4:3?',
          answer: 'En 4:3, una altura de 1080 píxeles requiere un ancho de 1440 píxeles (1440x1080).',
        },
      ],
    },
    relatedSlugs: ['calculadora-16-9', 'calculadora-relacion-aspecto', 'calculadora-dimensiones-video'],
  },

  // 11. Calculadora de Escalado de Video
  {
    id: 'video-scaling',
    slug: 'calculadora-escalado-video',
    name: 'Calculadora de Escalado de Video y Resolución',
    tagline: 'Calcula Nuevas Dimensiones por Porcentaje (Downscale / Upscale)',
    shortDescription: 'Escala resoluciones de video hacia arriba o hacia abajo aplicando un porcentaje o recalculando proporciones exactas.',
    category: 'video',
    subcategory: 'resolucion',
    iconName: 'Minimize',
    popularRank: 21,
    fields: [
      {
        id: 'origWidth',
        label: 'Ancho Original (Píxeles)',
        type: 'number',
        defaultValue: 1920,
        min: 16,
        max: 16384,
        step: 2,
        placeholder: 'Ej. 1920',
      },
      {
        id: 'origHeight',
        label: 'Alto Original (Píxeles)',
        type: 'number',
        defaultValue: 1080,
        min: 16,
        max: 16384,
        step: 2,
        placeholder: 'Ej. 1080',
      },
      {
        id: 'scalePercent',
        label: 'Porcentaje de Escala (%)',
        type: 'number',
        defaultValue: 50,
        min: 1,
        max: 1000,
        step: 5,
        placeholder: 'Ej. 50 (Mitad de tamaño)',
      },
    ],
    presets: [
      { label: '1080p al 50% de escala (960x540 qHD)', values: { origWidth: 1920, origHeight: 1080, scalePercent: 50 } },
      { label: '1080p al 75% de escala (1440x810)', values: { origWidth: 1920, origHeight: 1080, scalePercent: 75 } },
      { label: '1080p al 200% Upscale 4K (3840x2160)', values: { origWidth: 1920, origHeight: 1080, scalePercent: 200 } },
      { label: '4K al 50% Downscale 1080p (1920x1080)', values: { origWidth: 3840, origHeight: 2160, scalePercent: 50 } },
    ],
    calculate: (inputs) => {
      const origW = Number(inputs.origWidth) || 1920;
      const origH = Number(inputs.origHeight) || 1080;
      const scale = Number(inputs.scalePercent) || 50;

      const res = calculateScaledResolution(origW, origH, scale);

      return {
        primaryValue: `${res.newWidth} × ${res.newHeight} px`,
        primaryLabel: `Nueva Resolución (${scale}% de Escala)`,
        secondaryMetrics: [
          { label: 'Píxeles Resultantes', value: `${(res.totalPixelsNew / 1000000).toFixed(2)} MP`, highlight: true },
          { label: 'Píxeles Originales', value: `${(res.totalPixelsOriginal / 1000000).toFixed(2)} MP` },
          { label: scale < 100 ? 'Reducción de Píxeles' : 'Incremento de Píxeles', value: `${Math.abs(res.pixelReductionPercent).toFixed(1)}%` },
          { label: 'Factor de Escala', value: `${(scale / 100).toFixed(2)}x` },
        ],
        formulaExplanation: `Fórmula de Escalado:\n• Nuevo Ancho = Ancho Original (${origW}px) × (${scale} ÷ 100) = ${res.newWidth}px\n• Nuevo Alto = Alto Original (${origH}px) × (${scale} ÷ 100) = ${res.newHeight}px\n• Píxeles: de ${res.totalPixelsOriginal.toLocaleString()} px a ${res.totalPixelsNew.toLocaleString()} px.`,
        benchmarkStatus: 'optimal',
        recommendations: [
          'Al reducir la escala (downscaling de 4K a 1080p), la imagen retiene un mayor rango dinámico y nitidez debido al sobremuestreo (oversampling).',
        ],
        breakdownData: [
          { name: 'Píxeles Nuevos (k)', value: Math.round(res.totalPixelsNew / 1000) },
          { name: 'Píxeles Originales (k)', value: Math.round(res.totalPixelsOriginal / 1000) },
        ],
        rawOutput: res,
      };
    },
    seo: {
      title: 'Calculadora de Escalado de Video | Redimensionar Resoluciones y Píxeles',
      metaDescription: 'Calcula la resolución final de un video tras aplicar un porcentaje de escala (downscale / upscale) manteniendo las proporciones exactas.',
      h1: 'Calculadora de Escalado de Video y Resolución',
      keywords: ['calculadora escalado video', 'downscale video resolucion', 'escalar video porcentaje', 'redimensionar video pixeles'],
      summary: 'Calcula las nuevas dimensiones en píxeles al aplicar porcentajes de escala en proyectos de edición y render.',
      formulaMarkdown: '`Nuevo Ancho = Ancho × (% / 100) | Nuevo Alto = Alto × (% / 100)`',
      howToSteps: ['Introduce el ancho y alto original.', 'Especifica el porcentaje de escala.', 'Obtén la nueva resolución en píxeles.'],
      tipsToImprove: ['Asegúrate de que los píxeles resultantes sean números pares para evitar errores en códecs H.264.'],
      faqs: [
        {
          question: '¿Qué resolución resulta de escalar 1920x1080 al 50%?',
          answer: 'Resulta exactamente 960 × 540 píxeles (resolución qHD, con una reducción del 75% en el número total de píxeles).',
        },
      ],
    },
    relatedSlugs: ['calculadora-16-9', 'calculadora-relacion-aspecto', 'calculadora-dimensiones-video'],
  },

  // 12. Calculadora de Dimensiones de Video y Verificador de Aspecto
  {
    id: 'aspect-verifier',
    slug: 'calculadora-dimensiones-video',
    name: 'Calculadora y Verificador de Dimensiones de Video',
    tagline: 'Comprueba si una Resolución Cumple Exactamente la Relación 16:9, 9:16, 4:3 o 1:1',
    shortDescription: 'Verifica matemáticamente si una resolución personalizada mantiene con precisión la proporción seleccionada o presenta distorsiones.',
    category: 'video',
    subcategory: 'resolucion',
    iconName: 'CheckCircle2',
    popularRank: 23,
    fields: [
      {
        id: 'width',
        label: 'Ancho en Píxeles',
        type: 'number',
        defaultValue: 1920,
        min: 16,
        max: 16384,
        step: 2,
        placeholder: 'Ej. 1920',
      },
      {
        id: 'height',
        label: 'Alto en Píxeles',
        type: 'number',
        defaultValue: 1080,
        min: 16,
        max: 16384,
        step: 2,
        placeholder: 'Ej. 1080',
      },
      {
        id: 'expectedRatio',
        label: 'Proporción Objetivo a Verificar',
        type: 'select',
        defaultValue: '16:9',
        options: [
          { label: '16:9 (Panorámico YouTube)', value: '16:9' },
          { label: '9:16 (Vertical Shorts / TikTok)', value: '9:16' },
          { label: '4:3 (Clásico)', value: '4:3' },
          { label: '1:1 (Cuadrado)', value: '1:1' },
        ],
      },
    ],
    presets: [
      { label: '1920x1080 verificado en 16:9 (✅ Exacto)', values: { width: 1920, height: 1080, expectedRatio: '16:9' } },
      { label: '1920x1000 verificado en 16:9 (❌ Desviación de 80px)', values: { width: 1920, height: 1000, expectedRatio: '16:9' } },
      { label: '1080x1920 verificado en 9:16 (✅ Exacto)', values: { width: 1080, height: 1920, expectedRatio: '9:16' } },
    ],
    calculate: (inputs) => {
      const w = Number(inputs.width) || 1920;
      const h = Number(inputs.height) || 1080;
      const expectedRatio = (inputs.expectedRatio as '16:9' | '9:16' | '4:3' | '1:1') || '16:9';

      const res = verifyAspectRatio(w, h, expectedRatio);

      const statusLabel = res.isMatch
        ? `✅ Corresponde exactamente a ${expectedRatio}`
        : `❌ No corresponde a ${expectedRatio} (Diferencia de ${res.differencePixels}px)`;

      return {
        primaryValue: statusLabel,
        primaryLabel: 'Estado de Verificación de Proporción',
        secondaryMetrics: [
          { label: 'Proporción Objetivo', value: expectedRatio, highlight: true },
          { label: 'Alto Correcto para este Ancho', value: `${res.expectedHeightForWidth} px`, isPositive: res.isMatch },
          { label: 'Ancho Correcto para este Alto', value: `${res.expectedWidthForHeight} px` },
          { label: 'Ratio Decimal Actual', value: res.actualRatioDecimal.toFixed(3) },
        ],
        formulaExplanation: `Verificación Matemática:\n• Dimensiones introducidas: ${w} × ${h} px (Ratio: ${res.actualRatioDecimal.toFixed(4)})\n• Ratio esperado para ${expectedRatio}: ${res.expectedRatioDecimal.toFixed(4)}\n• Para ancho ${w}px, la altura exacta requerida es ${res.expectedHeightForWidth}px.\n• Desviación detectada: ${res.differencePixels} píxeles.`,
        benchmarkText: res.isMatch
          ? 'Las dimensiones son matemáticamente exactas. Se mostrarán sin barras negras ni distorsión en reproductores estándar.'
          : `Para corregir la proporción, ajusta la altura a ${res.expectedHeightForWidth}px o el ancho a ${res.expectedWidthForHeight}px.`,
        benchmarkStatus: res.isMatch ? 'optimal' : 'needs-work',
        recommendations: [
          res.isMatch
            ? '¡Excelente! Esta resolución se integrará limpiamente en la interfaz de YouTube.'
            : `Modifica tu lienzo de edición a ${w} × ${res.expectedHeightForWidth} px para eliminar las bandas negras.`,
        ],
        breakdownData: [
          { name: 'Alto Introducido', value: h },
          { name: 'Alto Esperado', value: res.expectedHeightForWidth },
        ],
        rawOutput: res,
      };
    },
    seo: {
      title: 'Verificador y Calculadora de Dimensiones de Video | Validar 16:9, 9:16 y 4:3',
      metaDescription: 'Comprueba si las dimensiones de tu video cumplen exactamente la relación de aspecto 16:9, 9:16 o 4:3 y corrige desviaciones de píxeles.',
      h1: 'Calculadora y Verificador de Dimensiones de Video',
      keywords: ['verificar relacion aspecto video', 'comprobar 16 9 resolucion', 'dimensiones correctas video youtube', 'calculadora aspecto exacto'],
      summary: 'Herramienta de verificación para diseñadores y editores de video para evitar distorsiones de aspecto.',
      formulaMarkdown: '`Diferencia = | Alto Introducido - (Ancho / Ratio Objetivo) |`',
      howToSteps: ['Introduce ancho y alto.', 'Selecciona la proporción objetivo.', 'Verifica si coincide exactamente y consulta el ajuste necesario.'],
      tipsToImprove: ['Las desviaciones de aspecto provocan que YouTube añada márgenes negros alrededor del reproductor.'],
      faqs: [
        {
          question: '¿Por qué mi video tiene barras negras a los lados en YouTube?',
          answer: 'Porque las dimensiones del archivo no corresponden exactamente al estándar 16:9 del reproductor de YouTube, por lo que la plataforma rellena el espacio sobrante con barras negras.',
        },
      ],
    },
    relatedSlugs: ['calculadora-relacion-aspecto', 'calculadora-16-9', 'calculadora-9-16'],
  },
];
