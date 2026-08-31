import { SeoToolConfig, SeoSubcategory } from '../types';

export const SEO_SUBCATEGORIES_CONFIG: Array<{
  id: SeoSubcategory;
  name: string;
  shortName: string;
  emoji: string;
  description: string;
  icon: string;
}> = [
  {
    id: 'keywords',
    name: 'Palabras Clave',
    shortName: 'Keywords',
    emoji: '🔎',
    description: 'Generador de ideas lingüísticas, términos relacionados, clustering y analizador de frecuencia de palabras.',
    icon: 'Search',
  },
  {
    id: 'titulos',
    name: 'Títulos',
    shortName: 'Títulos',
    emoji: '✍️',
    description: 'Contador de caracteres en tiempo real, analizador de legibilidad, comparador A/B/C y generador de fórmulas.',
    icon: 'Type',
  },
  {
    id: 'descripciones',
    name: 'Descripciones',
    shortName: 'Descripciones',
    emoji: '📝',
    description: 'Plantillas estructuradas, contador de líneas y enlaces, formateador limpio y validador de capítulos/timestamps.',
    icon: 'FileText',
  },
  {
    id: 'hashtags',
    name: 'Hashtags',
    shortName: 'Hashtags',
    emoji: '#️⃣',
    description: 'Generador de hashtags #CamelCase, análisis de sintaxis y limpiador de etiquetas duplicadas.',
    icon: 'Hash',
  },
  {
    id: 'tags',
    name: 'Tags y Etiquetas',
    shortName: 'Tags',
    emoji: '🏷️',
    description: 'Generador de etiquetas exactas y long-tail, extractor desde título y medidor de caracteres con límite configurable.',
    icon: 'Tag',
  },
  {
    id: 'asistente',
    name: 'Asistente y Auditoría SEO',
    shortName: 'Asistente',
    emoji: '🧠',
    description: 'Auditor integral de video con puntuación de optimización textual transparente (30% Título, 25% Desc, 20% KW, 15% Tags, 10% Hash).',
    icon: 'Sparkles',
  },
  {
    id: 'limpieza',
    name: 'Limpieza y Organización',
    shortName: 'Limpieza',
    emoji: '🧹',
    description: 'Limpiador de espacios y líneas vacías, extractor de frecuencia N-gramas y derivador de keywords desde título y descripción.',
    icon: 'Sparkle',
  },
];

export const SEO_TOOLS: SeoToolConfig[] = [
  // ==========================================
  // 1. PALABRAS CLAVE
  // ==========================================
  {
    id: 'keyword-generator',
    slug: 'generador-keywords-youtube',
    name: 'Generador de Palabras Clave',
    tagline: 'Genera Variaciones y Patrones Lingüísticos para Ideas de Búsqueda',
    shortDescription: 'Introduce un término base y explora variaciones por intención de búsqueda (tutorial, noticias, entretenimiento, comparaciones y reacción). 100% heurística lingüística sin métricas simuladas.',
    subcategory: 'keywords',
    iconName: 'Search',
    popularRank: 1,
    badge: 'Popular',
    seo: {
      title: 'Generador de Palabras Clave para YouTube | Variaciones e Ideas Gratis',
      metaDescription: 'Genera variaciones lingüísticas e ideas de keywords para tus videos de YouTube. Filtra por intención informativa, tutorial, comparativas y entretenimiento.',
      h1: 'Generador de Palabras Clave e Ideas para YouTube',
      keywords: ['generador palabras clave youtube', 'keywords para videos youtube', 'ideas de busqueda youtube', 'variaciones de keywords youtube gratis'],
      summary: 'Esta herramienta genera variaciones semánticas y sintácticas en español basadas en estructuras comunes de búsqueda en YouTube. No genera números de volumen ficticios; se enfoca en expandir tus ideas temáticas.',
      howToSteps: [
        'Escribe tu palabra clave o tema principal (ej: "gta 6" o "podcast").',
        'Selecciona la intención de búsqueda deseada (Tutorial, Educativo, Reacción, Comparación o Todas).',
        'Explora las variaciones generadas y copia con 1 clic las que mejor se adapten a tu próximo video.',
      ],
      comparisonPoints: [
        { title: 'Variaciones Lingüísticas Reales', desc: 'Aplica reglas gramaticales y modismos en español para proponer frases naturales.' },
        { title: 'Filtro por Intención de Búsqueda', desc: 'Clasifica según el objetivo del espectador (aprender, entretenerse, comparar).' },
      ],
      tipsToImprove: [
        'Utiliza términos específicos en lugar de palabras excesivamente genéricas para obtener combinaciones más útiles.',
        'Combina la palabra clave base con calificadores de actualidad como el año en curso para contenido temporal.',
      ],
      faqs: [
        {
          question: '¿Estas palabras clave tienen volumen de búsqueda garantizado?',
          answer: 'No mostramos estimaciones ficticias de volumen. Son propuestas lingüísticas reales estructuradas según los patrones de búsqueda habituales de usuarios hispanohablantes.',
        },
        {
          question: '¿Cómo elijo la mejor palabra clave para mi título?',
          answer: 'Elige aquella que describa con mayor precisión y honestidad lo que el espectador encontrará dentro de tu video.',
        },
      ],
    },
    relatedSlugs: ['palabras-clave-youtube', 'agrupador-keywords', 'generador-titulos-youtube'],
  },

  {
    id: 'related-keywords',
    slug: 'palabras-clave-youtube',
    name: 'Generador de Palabras Relacionadas',
    tagline: 'Preguntas Frecuentes, Sinónimos y Frases Long-Tail por Grupos',
    shortDescription: 'Organiza un tema en preguntas (cómo, cuándo, cuánto), términos afines, variaciones directas y frases largas listas para tu guión o descripción.',
    subcategory: 'keywords',
    iconName: 'HelpCircle',
    popularRank: 2,
    badge: 'Organizador',
    seo: {
      title: 'Palabras Relacionadas y Preguntas para YouTube | Long Tail Gratis',
      metaDescription: 'Descubre preguntas frecuentes, sinónimos y frases long-tail relacionadas con tu tema para crear contenido que responda dudas reales.',
      h1: 'Generador de Términos y Preguntas Relacionadas para YouTube',
      keywords: ['palabras relacionadas youtube', 'preguntas para videos youtube', 'long tail keywords youtube', 'sinonimos para seo youtube'],
      summary: 'Agrupa automáticamente tu término principal en preguntas frecuentes, sinónimos y frases de cola larga (long-tail) para enriquecer títulos y capítulos.',
      howToSteps: [
        'Introduce el término o producto principal de tu video.',
        'Revisa los 5 grupos generados: Variaciones, Sinónimos, Preguntas, Long Tail y Búsquedas Potenciales.',
        'Copia grupos enteros o preguntas individuales para estructurar las secciones de tu video.',
      ],
      tipsToImprove: [
        'Usa las preguntas frecuentes como títulos de capítulos en tu descripción para retener a la audiencia que busca respuestas directas.',
      ],
      faqs: [
        {
          question: '¿Por qué responder preguntas específicas en el video?',
          answer: 'Los espectadores que buscan preguntas concretas suelen tener alta intención de visualización y mayor tiempo de retención si respondes rápido a su duda.',
        },
      ],
    },
    relatedSlugs: ['generador-keywords-youtube', 'agrupador-keywords', 'generador-capitulos-youtube'],
  },

  {
    id: 'keyword-clusterer',
    slug: 'agrupador-keywords',
    name: 'Agrupador de Keywords (Clustering)',
    tagline: 'Agrupa Listas de Palabras Clave por Similitud Textual y Temática',
    shortDescription: 'Pega tu lista desordenada de palabras y agrúpalas automáticamente mediante similitud léxica e intersección de tokens.',
    subcategory: 'keywords',
    iconName: 'FolderTree',
    popularRank: 6,
    seo: {
      title: 'Agrupador de Keywords para YouTube Online | Clustering de Palabras',
      metaDescription: 'Agrupa listas de palabras clave por similitud textual y semántica. Organiza tus ideas en categorías temáticas claras.',
      h1: 'Agrupador de Palabras Clave por Similitud Textual',
      keywords: ['agrupador de keywords', 'clustering palabras clave', 'organizar lista keywords', 'agrupar palabras clave youtube'],
      summary: 'Algoritmo de clustering local basado en coincidencia de tokens y distancia léxica Jaccard. Permite ordenar decenas de términos en grupos manejables.',
      howToSteps: [
        'Pega una lista de palabras clave (una por línea o separadas por comas).',
        'Haz clic en "Agrupar Keywords".',
        'Obtén tarjetas de grupos temáticos con botón de copiado individual o grupal.',
      ],
      tipsToImprove: [
        'Dedica un video individual a cada grupo temático en lugar de intentar abarcar todos los grupos en un solo video.',
      ],
      faqs: [
        {
          question: '¿Cómo determina la herramienta los grupos?',
          answer: 'Compara las raíces léxicas y tokens compartidos entre cada palabra clave en el navegador, calculando un coeficiente de similitud de conjunto.',
        },
      ],
    },
    relatedSlugs: ['analizador-keywords', 'generador-keywords-youtube', 'extractor-keywords-youtube'],
  },

  {
    id: 'keyword-analyzer',
    slug: 'analizador-keywords',
    name: 'Analizador de Lista de Keywords',
    tagline: 'Métricas Reales: Frecuencia, Longitud, Palabras Únicas y Densidad',
    shortDescription: 'Analiza matemáticamente cualquier lista de términos: detecta duplicados, densidad de palabras más repetidas y conteo de caracteres.',
    subcategory: 'keywords',
    iconName: 'BarChart2',
    popularRank: 12,
    seo: {
      title: 'Analizador de Lista de Keywords | Frecuencia y Métricas Textuales',
      metaDescription: 'Analiza tu lista de palabras clave: frecuencia léxica, duplicados, longitud de caracteres y porcentaje de términos long-tail.',
      h1: 'Analizador Matemático de Listas de Palabras Clave',
      keywords: ['analizador de keywords', 'frecuencia de palabras clave', 'metricas de texto seo', 'analisis lista palabras clave'],
      summary: 'Evalúa la distribución léxica, longitud promedio y presencia de términos numéricos o frases largas en tus listas de palabras clave.',
      howToSteps: [
        'Pega tu lista de palabras clave.',
        'Revisa el resumen matemático: palabras únicas, duplicados y distribución de longitud.',
        'Inspecciona el gráfico de frecuencia de las palabras más repetidas.',
      ],
      tipsToImprove: ['Evita la repetición excesiva de la misma palabra en listas de tags para no saturar con términos redundantes.'],
      faqs: [
        {
          question: '¿Qué es una keyword long-tail?',
          answer: 'Es una frase de 4 o más palabras que describe una búsqueda muy específica (por ejemplo: "cómo instalar mods en gta 6 pc").',
        },
      ],
    },
    relatedSlugs: ['agrupador-keywords', 'contador-tags-youtube', 'extractor-keywords-youtube'],
  },

  // ==========================================
  // 2. TÍTULOS
  // ==========================================
  {
    id: 'title-character-counter',
    slug: 'contador-caracteres-titulo',
    name: 'Contador de Caracteres del Título',
    tagline: 'Conteo en Tiempo Real y Vista Previa Visual Desktop/Móvil',
    shortDescription: 'Mide caracteres totales, palabras y caracteres sin espacios con simulación visual de visibilidad en YouTube sin límites arbitrarios.',
    subcategory: 'titulos',
    iconName: 'Hash',
    popularRank: 4,
    badge: 'Esencial',
    seo: {
      title: 'Contador de Caracteres de Título para YouTube | Preview Visual',
      metaDescription: 'Cuenta caracteres y palabras de tu título de YouTube en tiempo real. Previsualiza cómo se verá en móviles y ordenadores.',
      h1: 'Contador de Caracteres y Vista Previa de Títulos',
      keywords: ['contador caracteres titulo youtube', 'limite caracteres titulo youtube', 'medir titulo video youtube', 'simulador titulo youtube'],
      summary: 'Muestra el número exacto de caracteres y palabras de tu título junto con una representación visual de corte de texto en pantallas móviles.',
      howToSteps: [
        'Escribe o pega el título de tu video.',
        'Observa el conteo de caracteres, palabras y caracteres sin espacios al instante.',
        'Revisa la previsualización visual en formato tarjeta de YouTube.',
      ],
      tipsToImprove: [
        'Aunque YouTube permite hasta 100 caracteres, los primeros 50 a 65 caracteres son los más visibles en la mayoría de teléfonos móviles.',
      ],
      faqs: [
        {
          question: '¿Cuál es el límite oficial de caracteres para títulos en YouTube?',
          answer: 'El límite máximo permitido por YouTube es de 100 caracteres. Sin embargo, en feeds móviles suele truncarse visualmente a partir de los 60-70 caracteres con puntos suspensivos.',
        },
      ],
    },
    relatedSlugs: ['analizador-titulo-youtube', 'comparador-titulos-youtube', 'generador-titulos-youtube'],
  },

  {
    id: 'title-analyzer',
    slug: 'analizador-titulo-youtube',
    name: 'Analizador de Título y Puntuación Textual',
    tagline: 'Puntuación de Optimización Textual (0-100) y Diagnóstico Completo',
    shortDescription: 'Evalúa claridad, presencia de keyword, balance de mayúsculas, números, preguntas y legibilidad con fórmula matemática transparente.',
    subcategory: 'titulos',
    iconName: 'CheckCircle2',
    popularRank: 3,
    badge: 'Diagnóstico',
    seo: {
      title: 'Analizador de Títulos de YouTube | Puntuación Textual y Consejos',
      metaDescription: 'Analiza tu título de YouTube: longitud, legibilidad, presencia de keyword, ganchos y puntuación de optimización textual transparente.',
      h1: 'Analizador de Títulos para Videos de YouTube',
      keywords: ['analizador titulos youtube', 'score titulo youtube', 'optimizar titulo youtube', 'legibilidad titulo video'],
      summary: 'Calcula una puntuación de optimización textual basada en reglas objetivas: longitud balanceada, inclusión de palabra clave, ausencia de mayúsculas sostenidas y elementos de intriga.',
      howToSteps: [
        'Escribe tu título propuesto.',
        '(Opcional) Introduce la palabra clave que deseas posicionar.',
        'Recibe tu Puntuación de Optimización Textual detallada y recomendaciones directas.',
      ],
      comparisonPoints: [
        { title: 'Fórmula Transparente', desc: 'Desglosa la puntuación en Longitud (25%), Keyword (25%), Legibilidad (20%), Estructura (15%) e Interés (15%).' },
        { title: 'Sin Promesas Mágicas', desc: 'No simula CTR oficial; evalúa la claridad y redacción del texto en español.' },
      ],
      tipsToImprove: [
        'Sitúa la palabra clave principal en los primeros 30 caracteres para que los espectadores identifiquen el tema de un vistazo.',
      ],
      faqs: [
        {
          question: '¿Por qué se llama Puntuación de Optimización Textual y no YouTube SEO Score?',
          answer: 'Porque YouTube no publica una puntuación oficial de SEO. Nuestra métrica evalúa objetivamente la calidad técnica, ortográfica y estructural del texto que introduces.',
        },
      ],
    },
    relatedSlugs: ['comparador-titulos-youtube', 'generador-titulos-youtube', 'contador-caracteres-titulo'],
  },

  {
    id: 'title-comparator',
    slug: 'comparador-titulos-youtube',
    name: 'Comparador de Títulos (A vs B vs C)',
    tagline: 'Compara Hasta 3 Propuestas de Título Lado a Lado',
    shortDescription: 'Analiza tres opciones de título simultáneamente. Compara longitud, palabras clave, ganchos y puntuación técnica para elegir con criterio.',
    subcategory: 'titulos',
    iconName: 'Columns',
    popularRank: 7,
    seo: {
      title: 'Comparador de Títulos de YouTube Online | Test A/B/C Textual',
      metaDescription: 'Compara hasta 3 títulos para tu video de YouTube. Analiza diferencias de longitud, legibilidad y presencia de palabras clave lado a lado.',
      h1: 'Comparador de Títulos de YouTube (A vs B vs C)',
      keywords: ['comparador titulos youtube', 'test ab titulos youtube', 'comparar opciones titulo video', 'elegir mejor titulo youtube'],
      summary: 'Permite contrastar tres enfoques de titulación diferentes antes de publicar tu video, facilitando la toma de decisiones informada.',
      howToSteps: [
        'Escribe el Título A y el Título B (y opcionalmente el Título C).',
        'Indica la palabra clave principal de tu video.',
        'Revisa la tabla comparativa con las métricas de cada propuesta.',
      ],
      tipsToImprove: [
        'Prueba tres enfoques distintos: uno directo/educativo, uno con pregunta intrigante y uno con un dato o número específico.',
      ],
      faqs: [
        {
          question: '¿Esta herramienta puede predecir cuál tendrá más clics?',
          answer: 'No. El CTR final depende de la miniatura, la competencia y el interés de la audiencia. La herramienta compara la solidez textual y el formato de cada opción.',
        },
      ],
    },
    relatedSlugs: ['analizador-titulo-youtube', 'generador-titulos-youtube', 'contador-caracteres-titulo'],
  },

  {
    id: 'title-generator',
    slug: 'generador-titulos-youtube',
    name: 'Generador de Títulos',
    tagline: '10 a 20 Propuestas Estructuradas por Fórmulas y Tonos',
    shortDescription: 'Crea múltiples opciones de títulos seleccionando el tono: curioso, educativo, directo, polémico, misterio, reacción o entretenimiento.',
    subcategory: 'titulos',
    iconName: 'Wand2',
    popularRank: 5,
    badge: 'Creativo',
    seo: {
      title: 'Generador de Títulos para YouTube Gratis | Fórmulas y Tonos',
      metaDescription: 'Genera de 10 a 20 ideas de títulos para YouTube según tu tema y tono (educativo, curioso, directo, reacción, misterio o polémico).',
      h1: 'Generador de Títulos e Ideas para Videos de YouTube',
      keywords: ['generador titulos youtube', 'ideas titulos videos', 'formulas titulos youtube', 'creador de titulos youtube gratis'],
      summary: 'Genera propuestas basadas en fórmulas retóricas clásicas: listas, guías paso a paso, preguntas provocativas y declaraciones de valor.',
      howToSteps: [
        'Introduce el tema principal y tu palabra clave.',
        'Elige el tono deseado (Educativo, Curioso, Directo, Polémico, etc.).',
        'Copia el título que más resuene con tu audiencia y personalízalo.',
      ],
      tipsToImprove: [
        'Nunca utilices promesas engañosas (clickbait deshonesto). Asegúrate de que el contenido del video cumpla la promesa del título.',
      ],
      faqs: [
        {
          question: '¿Los títulos generados garantizan viralidad?',
          answer: 'No prometemos viralidad. Ofrecemos estructuras de comunicación probadas para redactar títulos más claros, atractivos y honestos.',
        },
      ],
    },
    relatedSlugs: ['analizador-titulo-youtube', 'comparador-titulos-youtube', 'generador-descripcion-youtube'],
  },

  // ==========================================
  // 3. DESCRIPCIONES
  // ==========================================
  {
    id: 'desc-character-counter',
    slug: 'contador-caracteres-descripcion',
    name: 'Contador de Caracteres de Descripción',
    tagline: 'Mide Caracteres, Palabras, Líneas, Enlaces y Hashtags en Vivo',
    shortDescription: 'Controla la longitud de tu descripción respecto al límite de 5.000 caracteres de YouTube y revisa el corte del primer pliegue.',
    subcategory: 'descripciones',
    iconName: 'AlignLeft',
    popularRank: 8,
    seo: {
      title: 'Contador de Caracteres de Descripción para YouTube | Enlaces y Líneas',
      metaDescription: 'Cuenta caracteres, palabras, líneas, URLs y hashtags en tu descripción de YouTube. Previsualiza las primeras 3 líneas del snippet.',
      h1: 'Contador de Caracteres y Elementos de Descripción',
      keywords: ['contador caracteres descripcion youtube', 'limite caracteres descripcion youtube', 'contar palabras descripcion video', 'verificador descripcion youtube'],
      summary: 'Monitorea en tiempo real los 5 elementos clave de una descripción: caracteres totales, conteo de palabras, párrafos, enlaces detectados y hashtags.',
      howToSteps: [
        'Pega o redacta tu descripción en el editor.',
        'Observa el balance de caracteres restantes respecto al límite de 5.000 de YouTube.',
        'Revisa el número de enlaces y hashtags detectados automáticamente.',
      ],
      tipsToImprove: [
        'Las primeras 2-3 líneas de tu descripción son las únicas visibles antes de hacer clic en "Mostrar más". Coloca ahí la información más crucial.',
      ],
      faqs: [
        {
          question: '¿Cuántos caracteres permite YouTube en la descripción?',
          answer: 'YouTube permite hasta 5.000 caracteres por descripción de video.',
        },
      ],
    },
    relatedSlugs: ['generador-descripcion-youtube', 'formateador-descripcion-youtube', 'generador-capitulos-youtube'],
  },

  {
    id: 'desc-generator',
    slug: 'generador-descripcion-youtube',
    name: 'Generador de Descripción Estructurada',
    tagline: 'Crea una Plantilla Completa: Intro, Contenido, CTA, Enlaces y Hashtags',
    shortDescription: 'Genera descripciones limpias y organizadas con espacios preparados para tus enlaces, redes, llamada a la acción y capítulos.',
    subcategory: 'descripciones',
    iconName: 'FileEdit',
    popularRank: 9,
    badge: 'Plantilla',
    seo: {
      title: 'Generador de Descripciones para YouTube Gratis | Plantilla Completa',
      metaDescription: 'Crea descripciones profesionales para tus videos de YouTube con estructura probada: introducción, puntos clave, enlaces, CTA y hashtags.',
      h1: 'Generador de Descripciones Estructuradas para YouTube',
      keywords: ['generador descripcion youtube', 'plantilla descripcion video youtube', 'crear descripcion youtube gratis', 'modelo descripcion youtube'],
      summary: 'Estructura una descripción profesional con secciones bien delimitadas para retener a los espectadores y guiar sus acciones.',
      howToSteps: [
        'Ingresa el título de tu video y la palabra clave.',
        '(Opcional) Agrega notas adicionales o enlaces a incluir.',
        'Copia la descripción estructurada y reemplaza los marcadores [Pega aquí tu enlace] con tus links reales.',
      ],
      tipsToImprove: [
        'Siempre incluye una llamada a la acción clara pero no invasiva (por ejemplo, invitar a comentar una pregunta específica del video).',
      ],
      faqs: [
        {
          question: '¿La herramienta inventa enlaces externos?',
          answer: 'No. La herramienta coloca marcadores de posición limpios como [Pega aquí tu enlace] para que pegues con total seguridad tus propios links reales.',
        },
      ],
    },
    relatedSlugs: ['formateador-descripcion-youtube', 'generador-capitulos-youtube', 'contador-caracteres-descripcion'],
  },

  {
    id: 'desc-formatter',
    slug: 'formateador-descripcion-youtube',
    name: 'Formateador y Limpiador de Descripción',
    tagline: 'Organiza Párrafos, Encabezados, Enlaces y Limpia Espacios',
    shortDescription: 'Pega una descripción desordenada y organízala con saltos de línea limpios, eliminación de espacios dobles y unificación de hashtags.',
    subcategory: 'descripciones',
    iconName: 'Sliders',
    popularRank: 13,
    seo: {
      title: 'Formateador de Descripciones de YouTube | Limpieza de Párrafos y Links',
      metaDescription: 'Formatea y organiza descripciones de YouTube: elimina espacios dobles, limpia líneas vacías y agrupa enlaces y hashtags.',
      h1: 'Formateador y Organizador de Descripciones',
      keywords: ['formatear descripcion youtube', 'limpiar descripcion video', 'organizar texto descripcion youtube', 'quitar espacios dobles descripcion'],
      summary: 'Convierte textos amontonados en descripciones legibles con vista previa antes y después.',
      howToSteps: [
        'Pega el texto desordenado de tu descripción.',
        'Pulsa "Formatear Descripción".',
        'Revisa el panel Antes / Después y copia el texto optimizado.',
      ],
      tipsToImprove: [
        'Separar el texto en párrafos de 2 o 3 líneas facilita enormemente la lectura en pantallas de smartphones.',
      ],
      faqs: [
        {
          question: '¿Modifica el significado de mi texto?',
          answer: 'No. Únicamente normaliza espacios, elimina líneas en blanco duplicadas y agrupa elementos para mejorar la legibilidad.',
        },
      ],
    },
    relatedSlugs: ['generador-descripcion-youtube', 'generador-capitulos-youtube', 'limpiador-texto-seo'],
  },

  {
    id: 'chapter-generator',
    slug: 'generador-capitulos-youtube',
    name: 'Generador y Validador de Capítulos (Timestamps)',
    tagline: 'Valida Formato 00:00, Orden Cronológico y Reglas de YouTube',
    shortDescription: 'Crea marcas de tiempo válidas para la barra de progreso de YouTube. Corrige desórdenes cronológicos y convierte formatos automáticamente.',
    subcategory: 'descripciones',
    iconName: 'Clock',
    popularRank: 10,
    badge: 'Validador',
    seo: {
      title: 'Generador de Capítulos para YouTube | Validador de Timestamps',
      metaDescription: 'Crea y valida capítulos y timestamps para YouTube. Verifica el inicio en 00:00, orden cronológico y duración mínima de 10 segundos.',
      h1: 'Generador y Validador de Capítulos (Marcas de Tiempo)',
      keywords: ['generador capitulos youtube', 'timestamps youtube validador', 'marcas de tiempo video youtube', 'formato capitulos youtube'],
      summary: 'Asegura que tus marcas de tiempo cumplan todos los requisitos de YouTube para activar la barra de video segmentada.',
      howToSteps: [
        'Introduce tus marcas de tiempo (ej: "00:00 Intro", o "Intro - 01:30").',
        'El sistema valida automáticamente: inicio en 00:00, mínimo 3 capítulos y orden cronológico.',
        'Copia el bloque listo para pegar directamente en tu descripción.',
      ],
      comparisonPoints: [
        { title: 'Auto-Corrector Cronológico', desc: 'Reordena los timestamps si los escribiste desordenados.' },
        { title: 'Conversor Bidireccional', desc: 'Acepta formatos como "01:20 Tema" o "Tema - 01:20" y los estandariza.' },
      ],
      tipsToImprove: [
        'Pon nombres descriptivos y atractivos a cada capítulo para que aparezcan en los resultados de Google Video Search.',
      ],
      faqs: [
        {
          question: '¿Cuáles son las reglas de YouTube para que funcionen los capítulos?',
          answer: '1) El primer timestamp debe ser 00:00 exactamente. 2) Debe haber al menos 3 capítulos en orden cronológico. 3) Cada capítulo debe durar al menos 10 segundos.',
        },
      ],
    },
    relatedSlugs: ['generador-descripcion-youtube', 'contador-caracteres-descripcion', 'formateador-descripcion-youtube'],
  },

  // ==========================================
  // 4. HASHTAGS
  // ==========================================
  {
    id: 'hashtag-generator',
    slug: 'generador-hashtags-youtube',
    name: 'Generador de Hashtags',
    tagline: 'Genera Etiquetas #CamelCase y Minúsculas para tu Nicho',
    shortDescription: 'Crea hashtags relevantes y correctamente formateados sin espacios para incluir al final de tu descripción o título.',
    subcategory: 'hashtags',
    iconName: 'Hash',
    popularRank: 11,
    seo: {
      title: 'Generador de Hashtags para YouTube Gratis | Formato CamelCase',
      metaDescription: 'Genera hashtags optimizados para YouTube según tu temática. Crea etiquetas sin espacios listas para copiar en descripción o título.',
      h1: 'Generador de Hashtags para Videos de YouTube',
      keywords: ['generador hashtags youtube', 'hashtags para videos youtube', 'creador hashtags youtube gratis', 'etiquetas gato youtube'],
      summary: 'Genera combinaciones de hashtags con formato #CamelCase para facilitar la lectura visual y la categorización temática.',
      howToSteps: [
        'Escribe el tema o nombre de tu video.',
        'Selecciona cuántos hashtags deseas generar (recomendado: 3 a 10).',
        'Copia todos con 1 clic en formato línea o separados por comas.',
      ],
      tipsToImprove: [
        'Los primeros 3 hashtags de tu descripción suelen aparecer sobre el título del video en algunas versiones de la app de YouTube.',
      ],
      faqs: [
        {
          question: '¿Poner muchos hashtags garantiza visitas?',
          answer: 'No. YouTube recomienda moderación (3 a 15 hashtags). Si utilizas más de 60 hashtags en un video, YouTube ignorará todos los hashtags de ese video.',
        },
      ],
    },
    relatedSlugs: ['analizador-hashtags-youtube', 'limpiador-hashtags-youtube', 'generador-tags-youtube'],
  },

  {
    id: 'hashtag-analyzer',
    slug: 'analizador-hashtags-youtube',
    name: 'Analizador de Hashtags',
    tagline: 'Detecta Duplicados, Caracteres Inválidos y Conteo Total',
    shortDescription: 'Comprueba que tus hashtags no contengan espacios prohibidos, caracteres no soportados o repeticiones innecesarias.',
    subcategory: 'hashtags',
    iconName: 'SearchCode',
    popularRank: 16,
    seo: {
      title: 'Analizador de Hashtags de YouTube | Sintaxis y Duplicados',
      metaDescription: 'Analiza tu lista de hashtags de YouTube: detecta duplicados sin importar mayúsculas, errores de sintaxis y caracteres inválidos.',
      h1: 'Analizador de Sintaxis y Duplicados de Hashtags',
      keywords: ['analizador hashtags youtube', 'verificar hashtags youtube', 'errores en hashtags', 'hashtags duplicados youtube'],
      summary: 'Verifica la integridad sintáctica de tus hashtags para evitar que queden rotos en la plataforma.',
      howToSteps: [
        'Pega tu conjunto de hashtags.',
        'Inspecciona el listado para ver si hay etiquetas duplicadas o caracteres incompatibles.',
        'Corrige cualquier advertencia señalada en el informe.',
      ],
      tipsToImprove: ['Los hashtags no deben contener espacios ni signos como puntos o guiones en medio de la palabra.'],
      faqs: [
        {
          question: '¿Por qué un hashtag con espacios no funciona en YouTube?',
          answer: 'En la sintaxis web de hashtags, el primer espacio en blanco corta el enlace, dejando el resto del texto como texto plano sin etiquetar.',
        },
      ],
    },
    relatedSlugs: ['limpiador-hashtags-youtube', 'generador-hashtags-youtube', 'generador-tags-youtube'],
  },

  {
    id: 'hashtag-cleaner',
    slug: 'limpiador-hashtags-youtube',
    name: 'Limpiador de Hashtags',
    tagline: 'Elimina Duplicados (Case-Insensitive) y Normaliza el Formato',
    shortDescription: 'Limpia listas caóticas de hashtags: convierte "#GTA #gta #Gta #Gaming" en una lista única y limpia sin repeticiones.',
    subcategory: 'hashtags',
    iconName: 'Sparkles',
    popularRank: 17,
    seo: {
      title: 'Limpiador de Hashtags Online | Eliminar Duplicados y Espacios',
      metaDescription: 'Elimina hashtags duplicados ignorando mayúsculas y minúsculas. Copia una lista única y formateada al instante.',
      h1: 'Limpiador y Deduplicador de Hashtags',
      keywords: ['limpiador hashtags youtube', 'eliminar hashtags duplicados', 'depurar hashtags online', 'unificar hashtags'],
      summary: 'Filtra y elimina repeticiones en tus etiquetas de hashtag manteniendo solo una versión limpia de cada término.',
      howToSteps: [
        'Pega el texto con hashtags duplicados o repetidos.',
        'Pulsa "Limpiar Hashtags".',
        'Obtén la lista sin duplicados lista para copiar en una línea o en lista.',
      ],
      tipsToImprove: ['Mantén tus hashtags concisos y directamente relacionados con el nicho del video.'],
      faqs: [
        {
          question: '¿Distingue entre mayúsculas y minúsculas?',
          answer: 'Para YouTube #Gaming y #gaming apuntan exactamente a la misma página temática. La herramienta elimina los duplicados sin importar cómo estén escritos.',
        },
      ],
    },
    relatedSlugs: ['analizador-hashtags-youtube', 'generador-hashtags-youtube', 'limpiador-texto-seo'],
  },

  // ==========================================
  // 5. TAGS Y ETIQUETAS
  // ==========================================
  {
    id: 'tag-generator',
    slug: 'generador-tags-youtube',
    name: 'Generador de Tags y Etiquetas',
    tagline: 'Crea Etiquetas Exactas, Variaciones y Frases Long-Tail',
    shortDescription: 'Genera una lista completa de etiquetas basada en tu palabra clave y título. Formato listo para copiar y pegar en el campo de YouTube.',
    subcategory: 'tags',
    iconName: 'Tag',
    popularRank: 14,
    badge: 'Útil',
    seo: {
      title: 'Generador de Tags para YouTube Gratis | Etiquetas con Comas',
      metaDescription: 'Genera tags y etiquetas para tus videos de YouTube. Crea términos exactos, variaciones y frases long-tail listas para copiar con comas.',
      h1: 'Generador de Etiquetas (Tags) para Videos de YouTube',
      keywords: ['generador tags youtube', 'etiquetas para videos youtube', 'tags youtube copiar y pegar', 'creador de tags youtube gratis'],
      summary: 'Genera una lista equilibrada de etiquetas cortas y frases largas separadas por comas para rellenar fácilmente la casilla de tags de YouTube Studio.',
      howToSteps: [
        'Escribe tu palabra clave principal y opcionalmente el título del video.',
        'Revisa las etiquetas generadas divididas en exactas, variaciones y long-tail.',
        'Pulsa "Copiar todos los tags" para obtener el formato separado por comas.',
      ],
      tipsToImprove: [
        'Según la propia ayuda oficial de YouTube, los tags son especialmente útiles para capturar errores ortográficos comunes que cometen los usuarios al buscar.',
      ],
      faqs: [
        {
          question: '¿Los tags son el factor más importante del SEO de YouTube?',
          answer: 'No. YouTube ha aclarado oficialmente que el título, la miniatura y la descripción tienen mucho mayor peso en el descubrimiento que los tags.',
        },
      ],
    },
    relatedSlugs: ['generador-tags-desde-titulo', 'contador-tags-youtube', 'generador-keywords-youtube'],
  },

  {
    id: 'tags-from-title',
    slug: 'generador-tags-desde-titulo',
    name: 'Generador de Tags desde Título',
    tagline: 'Extrae Automáticamente Términos y Frases Clave de tu Título',
    shortDescription: 'Pega el título de tu video y extrae automáticamente combinaciones de palabras, entidades y frases listas como etiquetas.',
    subcategory: 'tags',
    iconName: 'FileText',
    popularRank: 15,
    seo: {
      title: 'Generador de Tags desde Título de YouTube | Extractor Rápido',
      metaDescription: 'Extrae tags y etiquetas relevantes directamente del título de tu video de YouTube. Copia con comas en 1 segundo.',
      h1: 'Extractor de Tags a Partir del Título del Video',
      keywords: ['tags desde titulo youtube', 'extraer tags de titulo', 'convertir titulo a tags youtube', 'generar etiquetas desde titulo'],
      summary: 'Tokeniza el título de tu video, elimina palabras vacías en español y construye bigramas y trigramas para generar etiquetas coherentes.',
      howToSteps: [
        'Pega el título final de tu video.',
        'La herramienta extrae las palabras clave y combinaciones más relevantes.',
        'Copia la lista de tags con formato separado por comas listo para YouTube Studio.',
      ],
      tipsToImprove: [
        'Utiliza el título completo como tu primera etiqueta exacta para reforzar la concordancia.',
      ],
      faqs: [
        {
          question: '¿Elimina palabras irrelevantes como "de", "la", "el"?',
          answer: 'Sí. El motor lingüístico filtra preposiciones y artículos para dejar únicamente términos con significado sustantivo.',
        },
      ],
    },
    relatedSlugs: ['generador-tags-youtube', 'contador-tags-youtube', 'analizador-titulo-youtube'],
  },

  {
    id: 'tag-counter',
    slug: 'contador-tags-youtube',
    name: 'Contador de Caracteres de Tags',
    tagline: 'Controla el Límite de 500 Caracteres con Chips Interactivos',
    shortDescription: 'Pega tus tags separados por comas y verifica cuántos caracteres ocupas respecto al límite configurable (500 chars por defecto).',
    subcategory: 'tags',
    iconName: 'Hash',
    popularRank: 18,
    seo: {
      title: 'Contador de Caracteres de Tags para YouTube | Límite 500 Chars',
      metaDescription: 'Cuenta caracteres y número de etiquetas de YouTube. Controla el límite de 500 caracteres y elimina tags individuales con chips.',
      h1: 'Contador de Caracteres y Medidor de Tags de YouTube',
      keywords: ['contador caracteres tags youtube', 'limite 500 caracteres tags youtube', 'contar etiquetas youtube', 'verificar tags youtube studio'],
      summary: 'Evita el error de "las etiquetas superan el límite de 500 caracteres" en YouTube Studio con medición exacta en tiempo real.',
      howToSteps: [
        'Pega tus etiquetas separadas por comas en el campo de texto.',
        'Visualiza el total de caracteres ocupados y los caracteres restantes.',
        'Elimina tags sobrantes haciendo clic en sus etiquetas interactivas.',
      ],
      tipsToImprove: [
        'Aprovecha entre 350 y 480 caracteres con términos relevantes sin necesidad de forzar los 500 exactos con palabras de relleno.',
      ],
      faqs: [
        {
          question: '¿Las comas y espacios cuentan para el límite de 500 caracteres?',
          answer: 'Sí. YouTube contabiliza todos los caracteres de las etiquetas incluyendo los separadores.',
        },
      ],
    },
    relatedSlugs: ['generador-tags-youtube', 'generador-tags-desde-titulo', 'analizador-keywords'],
  },

  // ==========================================
  // 6. ASISTENTE Y AUDITORÍA SEO
  // ==========================================
  {
    id: 'seo-assistant-tool',
    slug: 'asistente-optimizacion-youtube',
    name: 'Asistente de Optimización de Video',
    tagline: 'Diagnóstico Cruzado: Título, Descripción, Keyword, Tags y Hashtags',
    shortDescription: 'Introduce todos los elementos de tu video y recibe un checklist de coherencia con recomendaciones accionables y claras.',
    subcategory: 'asistente',
    iconName: 'CheckSquare',
    popularRank: 19,
    badge: 'Checklist',
    seo: {
      title: 'Asistente de Optimización de Video para YouTube | Diagnóstico Completo',
      metaDescription: 'Revisa la coherencia entre tu título, descripción, keyword y tags. Checklist integral de buenas prácticas antes de publicar.',
      h1: 'Asistente de Optimización de Metadatos de Video',
      keywords: ['asistente optimizacion youtube', 'checklist seo youtube', 'auditar metadatos video', 'revisar video antes de publicar youtube'],
      summary: 'Cruza los textos de tu video para verificar que la palabra clave aparezca en los lugares correctos y que la estructura sea completa.',
      howToSteps: [
        'Introduce tu palabra clave principal, título y descripción.',
        '(Opcional) Agrega tus tags y hashtags.',
        'Revisa el checklist con indicadores verdes y advertencias de mejora.',
      ],
      tipsToImprove: [
        'Realizar este checklist antes de presionar "Publicar" te asegura no olvidar elementos clave como timestamps o llamadas a la acción.',
      ],
      faqs: [
        {
          question: '¿Si cumplo todo el checklist mi video será el número 1 en búsquedas?',
          answer: 'No existe ninguna garantía de posición fija. El algoritmo de YouTube premia principalmente la satisfacción del espectador (retención, clics y tiempo de visualización). La optimización asegura que tu contenido sea comprensible y fácil de indexar.',
        },
      ],
    },
    relatedSlugs: ['analizador-seo-youtube', 'asistente-seo-youtube', 'analizador-titulo-youtube'],
  },

  {
    id: 'video-seo-analyzer',
    slug: 'analizador-seo-youtube',
    name: 'Analizador de SEO de Video (Auditoría)',
    tagline: 'Puntuación Ponderada Transparente: Título (30%), Desc (25%), KW (20%), Tags (15%), Hash (10%)',
    shortDescription: 'Obtén un informe completo de optimización textual con barras de progreso por sección y desglose matemático documentado.',
    subcategory: 'asistente',
    iconName: 'PieChart',
    popularRank: 20,
    badge: 'Auditoría',
    seo: {
      title: 'Analizador de SEO de Video para YouTube | Puntuación Transparente',
      metaDescription: 'Audita el SEO de tu video de YouTube con una fórmula transparente documentada: Título (30%), Descripción (25%), Keywords (20%), Tags (15%) y Hashtags (10%).',
      h1: 'Auditor y Analizador de SEO de Video de YouTube',
      keywords: ['analizador seo video youtube', 'auditoria seo youtube gratis', 'puntuacion seo video', 'optimizar metadatos youtube'],
      summary: 'Evalúa la completitud y coherencia de los metadatos de tu video mediante un modelo de puntuación matemática transparente.',
      howToSteps: [
        'Rellena los campos de tu video: Título, Descripción, Keyword, Tags y Hashtags.',
        'Pulsa "Realizar Auditoría SEO".',
        'Analiza las barras de puntuación por categoría y descarga o copia tu informe.',
      ],
      comparisonPoints: [
        { title: 'Fórmula 100% Documentada', desc: 'Título 30% + Descripción 25% + Coherencia de Keywords 20% + Tags 15% + Hashtags 10%.' },
        { title: 'Transparencia Ética', desc: 'Indica claramente que es una evaluación de completitud textual interna, no una métrica propietaria de Google.' },
      ],
      tipsToImprove: [
        'Mejora la puntuación completando los campos con menor puntaje antes de publicar el video.',
      ],
      faqs: [
        {
          question: '¿Cómo se calcula la puntuación total?',
          answer: 'Se calcula sumando las puntuaciones individuales ponderadas: Título (hasta 30 pts), Descripción (hasta 25 pts), Coherencia de Keywords (hasta 20 pts), Tags (hasta 15 pts) y Hashtags (hasta 10 pts).',
        },
      ],
    },
    relatedSlugs: ['asistente-optimizacion-youtube', 'asistente-seo-youtube', 'analizador-titulo-youtube'],
  },

  // ==========================================
  // 7. LIMPIEZA Y ORGANIZACIÓN
  // ==========================================
  {
    id: 'seo-text-cleaner',
    slug: 'limpiador-texto-seo',
    name: 'Limpiador de Texto SEO',
    tagline: 'Elimina Espacios Dobles, Líneas Vacías y Duplicados con 1 Clic',
    shortDescription: 'Depura cualquier texto: elimina artefactos de copiado, saltos de línea redundantes, espacios excesivos y párrafos repetidos.',
    subcategory: 'limpieza',
    iconName: 'Sparkle',
    popularRank: 21,
    seo: {
      title: 'Limpiador de Texto SEO Online | Quitar Espacios Dobles y Líneas',
      metaDescription: 'Limpia textos y descripciones: elimina espacios dobles, líneas vacías redundantes y párrafos duplicados al instante.',
      h1: 'Limpiador y Depurador de Texto SEO',
      keywords: ['limpiador de texto seo', 'quitar espacios dobles online', 'eliminar lineas vacias repetidas', 'limpiar texto para youtube'],
      summary: 'Normaliza la tipografía y los espacios en blanco de cualquier fragmento de texto para un acabado profesional.',
      howToSteps: [
        'Pega el texto que deseas depurar.',
        'Haz clic en "Limpiar Texto".',
        'Revisa el contador de modificaciones y copia el texto pulido.',
      ],
      tipsToImprove: ['Ideal para limpiar textos copiados desde procesadores de texto que arrastran saltos de línea irregulares.'],
      faqs: [
        {
          question: '¿Conserva los saltos de párrafo normales?',
          answer: 'Sí. Mantiene los saltos de párrafo individuales y únicamente elimina los espacios en blanco excesivos y líneas vacías triples o cuádruples.',
        },
      ],
    },
    relatedSlugs: ['formateador-descripcion-youtube', 'limpiador-hashtags-youtube', 'extractor-keywords-youtube'],
  },

  {
    id: 'keyword-extractor',
    slug: 'extractor-keywords-youtube',
    name: 'Extractor de Keywords desde Texto',
    tagline: 'Identifica Palabras y Frases más Frecuentes (1, 2 y 3 Términos)',
    shortDescription: 'Pega un guión o descripción larga y extrae automáticamente los unigramas, bigramas y trigramas más repetidos con su densidad.',
    subcategory: 'limpieza',
    iconName: 'FileSearch',
    popularRank: 22,
    seo: {
      title: 'Extractor de Keywords desde Texto y Descripciones | Análisis N-Gramas',
      metaDescription: 'Extrae las palabras clave más frecuentes de cualquier texto o descripción. Analiza unigramas, bigramas y trigramas con porcentajes de densidad.',
      h1: 'Extractor de Palabras y Frases Clave desde Texto',
      keywords: ['extractor keywords texto', 'extraer palabras clave descripcion', 'frecuencia de palabras texto', 'analisis n gramas texto'],
      summary: 'Analiza la frecuencia y densidad léxica de palabras individuales y combinaciones de 2 y 3 palabras en textos extensos.',
      howToSteps: [
        'Pega el texto de tu guión o descripción.',
        'Pulsa "Extraer Palabras Clave".',
        'Examina la tabla de frecuencia ordenada por unigramas, bigramas y trigramas.',
      ],
      tipsToImprove: [
        'Verifica que las palabras más frecuentes correspondan realmente al tema central del video y no a muletillas.',
      ],
      faqs: [
        {
          question: '¿La frecuencia de palabras determina el ranking de un video?',
          answer: 'No directamente. Repetir una palabra excesivamente (keyword stuffing) puede resultar contraproducente. La extracción sirve para verificar que estás tratando los conceptos correctos de forma natural.',
        },
      ],
    },
    relatedSlugs: ['keywords-desde-titulo-descripcion', 'analizador-keywords', 'generador-keywords-youtube'],
  },

  {
    id: 'keywords-from-title-desc',
    slug: 'keywords-desde-titulo-descripcion',
    name: 'Generador de Keywords desde Título y Descripción',
    tagline: 'Infiere la Keyword Principal y Términos Secundarios con Justificación',
    shortDescription: 'Introduce tu título y descripción para que el motor identifique los términos nucleares y te explique por qué fueron seleccionados.',
    subcategory: 'limpieza',
    iconName: 'Layers',
    popularRank: 23,
    seo: {
      title: 'Generador de Keywords desde Título y Descripción | Inferencia Semántica',
      metaDescription: 'Infiere palabras clave principales y secundarias a partir de tu título y descripción con explicación justificada de selección.',
      h1: 'Generador de Palabras Clave desde Título y Descripción',
      keywords: ['keywords desde titulo y descripcion', 'inferir palabras clave video', 'identificar keyword principal youtube', 'sugerir keywords texto'],
      summary: 'Cruza la información léxica de tu título y descripción para extraer una palabra clave principal sugerida y términos secundarios con sus motivos.',
      howToSteps: [
        'Ingresa el título y la descripción de tu video.',
        'Haz clic en "Analizar e Inferir Keywords".',
        'Revisa la palabra clave principal detectada junto con la justificación lingüística.',
      ],
      tipsToImprove: [
        'Asegúrate de que la palabra clave sugerida coincida con lo que tenías en mente al planear tu video.',
      ],
      faqs: [
        {
          question: '¿Por qué incluye una explicación para cada término?',
          answer: 'Para que comprendas exactamente qué coincidencia léxica o densidad justificó la selección del término sin procesos de caja negra.',
        },
      ],
    },
    relatedSlugs: ['extractor-keywords-youtube', 'analizador-seo-youtube', 'asistente-optimizacion-youtube'],
  },

  // ==========================================
  // 8. ASISTENTE CENTRAL EN 9 PASOS
  // ==========================================
  {
    id: 'general-seo-wizard',
    slug: 'asistente-seo-youtube',
    name: 'Asistente SEO de YouTube (Flujo Guiado)',
    tagline: 'Guía Interactiva Paso a Paso (Paso 1 al 9) para Preparar tu Video',
    shortDescription: 'Crea paso a paso todo el paquete de metadatos de tu video: desde la idea y keyword principal, hasta títulos, descripción, capítulos, tags y auditoría final.',
    subcategory: 'asistente',
    iconName: 'Compass',
    popularRank: 1,
    badge: 'Suite Completa',
    seo: {
      title: 'Asistente SEO de YouTube Paso a Paso | Flujo Guiado Completo',
      metaDescription: 'Prepara el SEO de tu video en 9 pasos guiados: tema, keywords, títulos, descripción estructurada, hashtags, tags y diagnóstico final con copiado total.',
      h1: 'Asistente SEO Guiado de YouTube (Paso a Paso)',
      keywords: ['asistente seo youtube', 'guia seo youtube paso a paso', 'suite seo youtube gratis', 'preparar video youtube seo'],
      summary: 'Flujo completo e interactivo en 9 pasos que te acompaña en la preparación integral de los metadatos de tu video antes de publicarlo en YouTube.',
      howToSteps: [
        'Paso 1: Introduce el tema central de tu video.',
        'Paso 2: Define o selecciona tu palabra clave principal.',
        'Paso 3: Explora y añade variaciones de keywords.',
        'Paso 4: Elige o redacta tu título entre las propuestas generadas.',
        'Paso 5: Estructura tu descripción con enlaces y llamadas a la acción.',
        'Paso 6: Selecciona tus hashtags principales.',
        'Paso 7: Genera tu bloque de etiquetas con formato separado por comas.',
        'Paso 8: Realiza la auditoría de coherencia integral.',
        'Paso 9: Revisa las recomendaciones y copia el paquete completo de metadatos.',
      ],
      comparisonPoints: [
        { title: 'Flujo 100% Interactivo', desc: 'Permite avanzar, retroceder y editar cada sección en tiempo real.' },
        { title: 'Exportación y Copiado Unificado', desc: 'Copia cada elemento por separado o todo el paquete con un solo clic.' },
      ],
      tipsToImprove: [
        'Guarda una copia de tus metadatos finalizados para mantener coherencia en tus futuras series o listas de reproducción.',
      ],
      faqs: [
        {
          question: '¿Debo completar los 9 pasos obligatoriamente?',
          answer: 'Puedes saltar directamente a cualquier paso que necesites o recorrer el flujo guiado completo para una optimización exhaustiva.',
        },
      ],
    },
    relatedSlugs: ['analizador-seo-youtube', 'generador-keywords-youtube', 'generador-titulos-youtube'],
  },
];
