export interface ImageToolDefinition {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  iconName: string;
  badge?: string;
  popularRank?: number;
  initialMode: 'convert' | 'compress' | 'resize' | 'crop' | 'rotate' | 'metadata' | 'favicon' | 'optimize';
  defaultTargetFormat?: 'png' | 'jpeg' | 'webp' | 'avif' | 'ico';
  defaultQuality?: number;
  defaultResizeMode?: 'original' | 'width' | 'height' | 'percentage' | 'custom';
  defaultCropRatio?: 'free' | '16:9' | '9:16' | '1:1' | '4:3' | '3:2';
  requireMatte?: boolean;
  acceptedFormatsText: string;
  seo: {
    title: string;
    metaDescription: string;
    h1: string;
    keywords: string[];
    summary: string;
    howToSteps: string[];
    comparisonPoints: Array<{ title: string; desc: string }>;
    tipsToImprove: string[];
    faqs: Array<{ question: string; answer: string }>;
  };
  relatedSlugs: string[];
}

export const IMAGE_TOOLS: ImageToolDefinition[] = [
  // 1. Convertir JPG a PNG
  {
    id: 'convert-jpg-to-png',
    slug: 'convertir-jpg-a-png',
    name: 'Convertir JPG a PNG',
    tagline: 'Convierte tus Imágenes JPG y JPEG a Formato PNG sin Pérdida',
    shortDescription: 'Transforma fotos e imágenes JPG a formato PNG en alta definición de forma local en tu navegador con máxima fidelidad.',
    iconName: 'FileImage',
    popularRank: 1,
    badge: 'Popular',
    initialMode: 'convert',
    defaultTargetFormat: 'png',
    acceptedFormatsText: 'JPG, JPEG, JFIF',
    seo: {
      title: 'Convertir JPG a PNG Online Gratis | Sin Pérdida y 100% Local',
      metaDescription: 'Convierte imágenes JPG a PNG al instante en tu navegador. Sin subir archivos a ningún servidor, máxima privacidad y calidad original.',
      h1: 'Convertidor de JPG a PNG Online',
      keywords: ['convertir jpg a png', 'pasar foto jpg a png', 'convertidor jpg a png gratis', 'transformar jpeg a png'],
      summary: 'El formato PNG utiliza compresión sin pérdida (lossless), lo que evita la degradación progresiva de artefactos visuales propia del algoritmo JPEG.',
      howToSteps: [
        'Arrastra tu imagen JPG o haz clic en "Seleccionar imagen".',
        'El formato de salida "PNG" se seleccionará automáticamente.',
        'Opcionalmente redimensiona o recorta si lo necesitas.',
        'Haz clic en "Descargar imagen" para guardar el archivo .png.',
      ],
      comparisonPoints: [
        { title: 'PNG (Sin Pérdida)', desc: 'Mantiene bordes nítidos, texto legible y permite edición posterior sin pérdida de calidad.' },
        { title: 'JPG (Con Pérdida)', desc: 'Ideal para compresión agresiva pero pierde nitidez en bordes duros y texto.' },
      ],
      tipsToImprove: [
        'Utiliza PNG si planeas añadir transparencias o continuar editando la imagen en Photoshop o Canva.',
      ],
      faqs: [
        {
          question: '¿Por qué convertir un archivo JPG a PNG?',
          answer: 'PNG no degrada la imagen cada vez que se guarda y es el formato estándar para logotipos, capturas de pantalla y gráficos con texto.',
        },
        {
          question: '¿Se envía mi fotografía a algún servidor?',
          answer: 'No. Todo el procesamiento se realiza 100% en tu navegador mediante Canvas y Web APIs, garantizando total privacidad.',
        },
      ],
    },
    relatedSlugs: ['convertir-png-a-jpg', 'convertir-jpg-a-webp', 'comprimir-imagen'],
  },

  // 2. Convertir PNG a JPG
  {
    id: 'convert-png-to-jpg',
    slug: 'convertir-png-a-jpg',
    name: 'Convertir PNG a JPG',
    tagline: 'Convierte PNG a JPG con Control de Calidad y Reemplazo de Transparencia',
    shortDescription: 'Reduce el peso de imágenes PNG convirtiéndolas a JPG con slider de calidad y selector de color de fondo para transparencias.',
    iconName: 'Image',
    popularRank: 2,
    badge: 'Popular',
    initialMode: 'convert',
    defaultTargetFormat: 'jpeg',
    defaultQuality: 85,
    requireMatte: true,
    acceptedFormatsText: 'PNG, APNG',
    seo: {
      title: 'Convertir PNG a JPG Online Gratis | Reemplazo de Fondo y Calidad',
      metaDescription: 'Convierte archivos PNG a JPG/JPEG al instante. Ajusta la compresión y elige el color de fondo para las áreas transparentes.',
      h1: 'Convertidor de PNG a JPG Online',
      keywords: ['convertir png a jpg', 'pasar png a jpeg', 'convertidor png a jpg gratis', 'quitar transparencia png a jpg'],
      summary: 'El formato JPG es ideal para reducir el tamaño de archivo de fotografías pesadas en PNG, logrando ahorros de hasta un 70-80% de espacio.',
      howToSteps: [
        'Sube tu archivo PNG arrastrándolo a la zona de carga.',
        'Ajusta el slider de Calidad (recomendado 80-90%).',
        'Si tu PNG tiene transparencia, elige el color de fondo (blanco, negro o personalizado).',
        'Descarga tu archivo JPG optimizado.',
      ],
      comparisonPoints: [
        { title: 'Transparencia en JPG', desc: 'El formato JPG no admite canal alfa (transparencia). Las áreas transparentes se rellenan con el color seleccionado.' },
        { title: 'Ahorro de Peso', desc: 'Una imagen PNG de 3 MB puede reducirse a 400 KB en JPG sin pérdida visual perceptible.' },
      ],
      tipsToImprove: [
        'Para miniaturas de YouTube o fotos de blog, un JPG al 85% de calidad ofrece el mejor equilibrio entre peso y nitidez.',
      ],
      faqs: [
        {
          question: '¿Qué pasa con el fondo transparente al convertir a JPG?',
          answer: 'Como JPG no soporta transparencia, nuestra herramienta te permite elegir el color de relleno (blanco por defecto, negro o color personalizado).',
        },
      ],
    },
    relatedSlugs: ['convertir-jpg-a-png', 'convertir-png-a-webp', 'comprimir-imagen'],
  },

  // 3. Convertir WebP a JPG
  {
    id: 'convert-webp-to-jpg',
    slug: 'convertir-webp-a-jpg',
    name: 'Convertir WebP a JPG',
    tagline: 'Convierte Imágenes WebP a Formato Universal JPG / JPEG',
    shortDescription: 'Convierte archivos WebP descargados de internet a formato JPG compatible con cualquier visor, editor y red social.',
    iconName: 'RefreshCw',
    popularRank: 3,
    initialMode: 'convert',
    defaultTargetFormat: 'jpeg',
    defaultQuality: 90,
    acceptedFormatsText: 'WebP',
    seo: {
      title: 'Convertir WebP a JPG Online | Compatible con Todos los Programas',
      metaDescription: 'Convierte imágenes WebP a JPG en segundos. Haz tus imágenes compatibles con Photoshop, Word, Windows y redes sociales.',
      h1: 'Convertidor de WebP a JPG Online',
      keywords: ['convertir webp a jpg', 'pasar webp a jpeg', 'abrir webp en photoshop', 'convertidor webp a jpg gratis'],
      summary: 'WebP es excelente para la web pero muchos programas de edición antiguos no pueden abrirlo directamente. Convertirlo a JPG resuelve la incompatibilidad.',
      howToSteps: [
        'Sube tu imagen en formato WebP.',
        'Verifica la calidad deseada en el control deslizante.',
        'Pulsa "Descargar imagen" para obtener tu archivo .jpg estándar.',
      ],
      comparisonPoints: [
        { title: 'Compatibilidad Universal', desc: 'JPG funciona en el 100% de los dispositivos, sistemas operativos y suites de diseño.' },
        { title: 'Conversión Instantánea', desc: 'Decodificación nativa rápida en el navegador sin intermediarios.' },
      ],
      tipsToImprove: ['Mantén la calidad al 90% para evitar dobles pérdidas de compresión al pasar de WebP a JPG.'],
      faqs: [
        {
          question: '¿Por qué no puedo abrir archivos WebP en algunos programas?',
          answer: 'WebP es un formato moderno de Google. Editores clásicos o herramientas de oficina requieren JPG o PNG para máxima compatibilidad.',
        },
      ],
    },
    relatedSlugs: ['convertir-webp-a-png', 'convertir-jpg-a-webp', 'convertir-png-a-jpg'],
  },

  // 4. Convertir JPG a WebP
  {
    id: 'convert-jpg-to-webp',
    slug: 'convertir-jpg-a-webp',
    name: 'Convertir JPG a WebP',
    tagline: 'Optimiza tus Fotos JPG a Formato WebP con Reducción de 30% a 50% de Peso',
    shortDescription: 'Acelera la carga de tu web o blog convirtiendo fotos JPG a WebP con calidad superior y menor tiempo de carga.',
    iconName: 'Zap',
    popularRank: 4,
    badge: 'Web Vitals',
    initialMode: 'convert',
    defaultTargetFormat: 'webp',
    defaultQuality: 82,
    acceptedFormatsText: 'JPG, JPEG',
    seo: {
      title: 'Convertir JPG a WebP Online | Ahorro de Peso para SEO y Web',
      metaDescription: 'Convierte fotos JPG a formato WebP moderno. Reduce el peso un 30-50% manteniendo la misma calidad visual.',
      h1: 'Convertir JPG a WebP para Web y SEO',
      keywords: ['convertir jpg a webp', 'pasar jpeg a webp', 'optimizar imagenes webp', 'mejorar core web vitals webp'],
      summary: 'Google recomienda usar formatos de próxima generación como WebP para mejorar el puntaje de PageSpeed y la experiencia de usuario.',
      howToSteps: ['Selecciona tu JPG.', 'Ajusta la calidad WebP (80% recomendado).', 'Descarga la imagen lista para subir a tu servidor.'],
      comparisonPoints: [
        { title: 'WebP vs JPG', desc: 'WebP logra entre 25% y 35% menor peso que un JPG con la misma calidad visual aparente.' },
      ],
      tipsToImprove: ['Para imágenes de portada y banners web, un WebP al 80% es el estándar de oro en la industria.'],
      faqs: [
        {
          question: '¿Qué navegadores soportan WebP?',
          answer: 'Más del 97% de los navegadores actuales (Chrome, Safari, Firefox, Edge, Opera) soportan WebP de forma nativa.',
        },
      ],
    },
    relatedSlugs: ['convertir-png-a-webp', 'convertir-webp-a-jpg', 'comprimir-imagen'],
  },

  // 5. Convertir PNG a WebP
  {
    id: 'convert-png-to-webp',
    slug: 'convertir-png-a-webp',
    name: 'Convertir PNG a WebP',
    tagline: 'Conserva la Transparencia y Reduce hasta un 70% el Peso de tus PNG',
    shortDescription: 'Convierte gráficos y logotipos PNG transparentes a WebP manteniendo el canal alfa con un peso drásticamente inferior.',
    iconName: 'Layers',
    popularRank: 5,
    initialMode: 'convert',
    defaultTargetFormat: 'webp',
    defaultQuality: 85,
    acceptedFormatsText: 'PNG',
    seo: {
      title: 'Convertir PNG a WebP Transparente Online | Máxima Optimización',
      metaDescription: 'Convierte archivos PNG a WebP manteniendo 100% la transparencia. Reduce el peso de logos y stickers.',
      h1: 'Convertidor de PNG a WebP con Transparencia',
      keywords: ['convertir png a webp', 'webp transparente', 'reducir peso logo png', 'pasar png a webp online'],
      summary: 'A diferencia de JPG, WebP sí admite transparencia alfa completa de 8 bits mientras reduce drásticamente el tamaño del archivo PNG.',
      howToSteps: ['Sube tu PNG con fondo transparente.', 'Comprueba que WebP conserva el canal alfa.', 'Descarga el archivo ligero.'],
      comparisonPoints: [
        { title: 'Transparencia Preservada', desc: 'WebP soporta canal alfa completo sin requerir fondo opaco.' },
      ],
      tipsToImprove: ['Usa WebP para los logos de tu encabezado para acelerar la métrica LCP (Largest Contentful Paint).'],
      faqs: [
        {
          question: '¿WebP mantiene los bordes suaves y la sombra transparente?',
          answer: 'Sí. WebP maneja transparencia de 8 bits con soporte para semitransparencias y sombras suaves.',
        },
      ],
    },
    relatedSlugs: ['convertir-jpg-a-webp', 'convertir-png-a-jpg', 'optimizar-web'],
  },

  // 6. Convertir WebP a PNG
  {
    id: 'convert-webp-to-png',
    slug: 'convertir-webp-a-png',
    name: 'Convertir WebP a PNG',
    tagline: 'Convierte WebP a PNG sin Pérdida Conservando Transparencia',
    shortDescription: 'Transforma imágenes WebP en archivos PNG estándar de máxima calidad para editar en cualquier software de diseño.',
    iconName: 'Sparkles',
    popularRank: 6,
    initialMode: 'convert',
    defaultTargetFormat: 'png',
    acceptedFormatsText: 'WebP',
    seo: {
      title: 'Convertir WebP a PNG Online Gratis | Calidad Original y Transparente',
      metaDescription: 'Convierte imágenes WebP a PNG sin pérdida. Conserva transparencias y hazlas editables en cualquier programa.',
      h1: 'Convertir WebP a PNG Online',
      keywords: ['convertir webp a png', 'pasar webp a png transparente', 'guardar webp como png', 'convertidor webp a png'],
      summary: 'Convierte imágenes WebP descargadas de páginas web a archivos PNG listos para importar en Illustrator, Photoshop o Premiere.',
      howToSteps: ['Sube el archivo WebP.', 'Selecciona PNG como destino.', 'Descarga el PNG transparente.'],
      comparisonPoints: [
        { title: 'Fidelidad Máxima', desc: 'La exportación PNG garantiza que no se introduzcan nuevos artefactos de compresión.' },
      ],
      tipsToImprove: ['Excelente opción si descargaste un sticker o icono en WebP y necesitas editarlo en capas.'],
      faqs: [
        {
          question: '¿Se mantiene la transparencia al pasar de WebP a PNG?',
          answer: 'Sí, toda la información de transparencia se transfiere íntegramente al archivo PNG resultante.',
        },
      ],
    },
    relatedSlugs: ['convertir-webp-a-jpg', 'convertir-png-a-webp', 'convertir-jpg-a-png'],
  },

  // 7. Convertir SVG a PNG
  {
    id: 'convert-svg-to-png',
    slug: 'convertir-svg-a-png',
    name: 'Convertir SVG a PNG',
    tagline: 'Rasteriza tus Gráficos Vectoriales SVG en PNG de Alta Resolución (hasta 4K / 3840px)',
    shortDescription: 'Convierte archivos vectoriales SVG a imágenes PNG nítidas seleccionando el ancho de salida (512px, 1024px, 1920px, 4K o personalizado).',
    iconName: 'Maximize2',
    popularRank: 7,
    badge: 'Vectorial',
    initialMode: 'resize',
    defaultTargetFormat: 'png',
    acceptedFormatsText: 'SVG',
    seo: {
      title: 'Convertir SVG a PNG en Alta Resolución | 1080p, 4K y Personalizado',
      metaDescription: 'Convierte archivos SVG vectoriales a PNG transparente de alta definición. Elige la resolución exacta (512px, 1080p, 4K o personalizada).',
      h1: 'Convertidor de SVG a PNG de Alta Resolución',
      keywords: ['convertir svg a png', 'pasar svg a png 4k', 'rasterizar svg', 'convertidor vectorial a png'],
      summary: 'Los archivos SVG son vectores matemáticos. Nuestra herramienta los renderiza a cualquier resolución rasterizada con nitidez cristalina.',
      howToSteps: [
        'Sube tu archivo .svg.',
        'Elige el tamaño deseado: 512px, 1024px, 1920px (Full HD), 3840px (4K) o escribe dimensiones personalizadas.',
        'Descarga tu PNG con transparencia perfecta.',
      ],
      comparisonPoints: [
        { title: 'Escalado Infinito', desc: 'Como el SVG es vectorial, puedes exportar a 4K sin sufrir pixelación ni pérdida de calidad.' },
      ],
      tipsToImprove: ['Para miniaturas de YouTube o avatares de perfil, genera el PNG a 1024px o 1920px para máxima definición.'],
      faqs: [
        {
          question: '¿Por qué mi SVG no se pixela al agrandarlo?',
          answer: 'Porque los SVG contienen curvas matemáticas, no píxeles fijos. Se renderizan con precisión a la resolución elegida.',
        },
      ],
    },
    relatedSlugs: ['convertir-png-a-jpg', 'redimensionar-imagen', 'generador-favicon'],
  },

  // 8. Comprimir Imagen
  {
    id: 'compress-image',
    slug: 'comprimir-imagen',
    name: 'Comprimir Imagen',
    tagline: 'Reduce el Tamaño en KB/MB de tus Imágenes con Control de Calidad y Tamaño Objetivo',
    shortDescription: 'Comprime imágenes JPG, PNG, WebP y AVIF reduciendo hasta un 80% de peso sin pérdida visual perceptible. Compatible con tamaño máximo en KB.',
    iconName: 'Minimize2',
    popularRank: 8,
    badge: 'Herramienta Top',
    initialMode: 'compress',
    defaultQuality: 80,
    acceptedFormatsText: 'JPG, PNG, WebP, AVIF, GIF, BMP',
    seo: {
      title: 'Comprimir Imágenes Online Gratis | Reducir Peso en KB y MB',
      metaDescription: 'Comprime fotos JPG, PNG y WebP al instante. Ajusta la calidad o define un tamaño máximo (500KB, 1MB, 2MB). 100% privado en tu navegador.',
      h1: 'Comprimir Imágenes Online sin Perder Calidad',
      keywords: ['comprimir imagen', 'reducir peso foto', 'comprimir jpg online', 'reducir mb de una imagen', 'comprimir foto a 500kb'],
      summary: 'Optimiza el peso de tus fotos para subirlas más rápido a plataformas web, correos electrónicos y miniaturas de YouTube.',
      howToSteps: [
        'Arrastra una o varias imágenes a la herramienta.',
        'Ajusta el slider de calidad o selecciona un límite de tamaño (ej. Máximo 1 MB).',
        'Observa la comparativa en vivo de peso original vs resultado.',
        'Descarga la imagen comprimida.',
      ],
      comparisonPoints: [
        { title: 'Compresión Inteligente', desc: 'Elimina información redundante e imperceptible para el ojo humano, manteniendo colores vibrantes.' },
      ],
      tipsToImprove: ['Un nivel de compresión del 80-85% suele reducir el peso a la mitad sin ninguna pérdida visible en pantallas normales.'],
      faqs: [
        {
          question: '¿Puedo comprimir varias imágenes a la vez?',
          answer: 'Sí. Puedes subir múltiples archivos y procesarlos en lote con descarga individual o en un archivo ZIP.',
        },
      ],
    },
    relatedSlugs: ['redimensionar-imagen', 'optimizar-web', 'convertir-jpg-a-webp'],
  },

  // 9. Redimensionar Imagen
  {
    id: 'resize-image',
    slug: 'redimensionar-imagen',
    name: 'Redimensionar Imagen',
    tagline: 'Cambia las Dimensiones en Píxeles o Porcentaje Manteniendo la Proporción',
    shortDescription: 'Modifica el ancho y alto de tus fotos en píxeles exactos o porcentaje con bloqueo de relación de aspecto y previsualización en tiempo real.',
    iconName: 'Scaling',
    popularRank: 9,
    initialMode: 'resize',
    acceptedFormatsText: 'JPG, PNG, WebP, SVG, BMP',
    seo: {
      title: 'Redimensionar Imágenes Online | Cambiar Tamaño en Píxeles o %',
      metaDescription: 'Cambia el ancho y alto de cualquier imagen en píxeles o porcentaje. Mantén la proporción y descarga al instante.',
      h1: 'Redimensionador de Imágenes Online',
      keywords: ['redimensionar imagen', 'cambiar tamano foto pixeles', 'escalar imagen online', 'cambiar resolucion imagen'],
      summary: 'Ajusta tus fotos a los requisitos exactos de portadas de YouTube (1280x720), banners (2560x1440) o publicaciones de Instagram.',
      howToSteps: [
        'Sube tu imagen.',
        'Indica el nuevo ancho o alto (la casilla "Mantener proporción" ajustará el otro valor automáticamente).',
        'O selecciona un porcentaje (ej. 50% para reducir a la mitad).',
        'Descarga la imagen redimensionada.',
      ],
      comparisonPoints: [
        { title: 'Algoritmo de Remuestreo', desc: 'Utilizamos interpolación bicúbica de alta calidad para evitar bordes dentados y desenfoques.' },
      ],
      tipsToImprove: ['Para miniaturas de YouTube, asegúrate de que tu imagen mida exactamente 1280 × 720 píxeles.'],
      faqs: [
        {
          question: '¿Qué significa mantener la proporción?',
          answer: 'Significa que al modificar el ancho, el alto se ajusta automáticamente para evitar que la imagen se estire o deforme.',
        },
      ],
    },
    relatedSlugs: ['recortar-imagen', 'comprimir-imagen', 'generador-favicon'],
  },

  // 10. Recortar Imagen
  {
    id: 'crop-image',
    slug: 'recortar-imagen',
    name: 'Recortar Imagen',
    tagline: 'Recorta Fotos con Proporciones 16:9, 9:16, 1:1, 4:3 o Área Libre',
    shortDescription: 'Encuadra y recorta tus imágenes fácilmente para YouTube (16:9), Shorts / TikTok (9:16), avatares cuadrados (1:1) o fotos clásicas (4:3).',
    iconName: 'Crop',
    popularRank: 10,
    badge: 'Creadores',
    initialMode: 'crop',
    defaultCropRatio: '16:9',
    acceptedFormatsText: 'JPG, PNG, WebP, BMP',
    seo: {
      title: 'Recortar Imágenes Online | Preajustes 16:9, 9:16, 1:1 y Libre',
      metaDescription: 'Recorta fotos con precisión para miniaturas de YouTube (16:9), Shorts verticales (9:16) y fotos de perfil (1:1). Rápido y gratis.',
      h1: 'Recortador de Imágenes Online con Proporciones',
      keywords: ['recortar imagen online', 'recortar foto 16 9', 'recortar para shorts 9 16', 'recortar imagen cuadrada'],
      summary: 'Adapta cualquier fotografía a los formatos estándar de redes sociales y plataformas de video sin deformar la imagen.',
      howToSteps: [
        'Sube la imagen que deseas recortar.',
        'Elige una proporción: 16:9 (YouTube), 9:16 (Shorts), 1:1 (Avatar) o Libre.',
        'Arrastra el recuadro para centrar la toma.',
        'Pulsa "Recortar y descargar".',
      ],
      comparisonPoints: [
        { title: '16:9 Panorámico', desc: 'Formato estándar de miniaturas de YouTube y videos horizontales.' },
        { title: '9:16 Vertical', desc: 'Formato ideal para YouTube Shorts, Instagram Reels y TikTok.' },
      ],
      tipsToImprove: ['Aplica la regla de los tercios situando el sujeto principal en las intersecciones de la cuadrícula de recorte.'],
      faqs: [
        {
          question: '¿El recorte disminuye la calidad de la parte conservada?',
          answer: 'No. Los píxeles dentro del área seleccionada se conservan al 100% de su resolución nativa.',
        },
      ],
    },
    relatedSlugs: ['redimensionar-imagen', 'comprimir-imagen', 'convertir-jpg-a-png'],
  },

  // 10b. Girar Imagen
  {
    id: 'rotate-image',
    slug: 'girar-imagen',
    name: 'Girar y Voltear Imagen',
    tagline: 'Rota Fotos 90°, 180°, 270° y Voltea Horizontal o Verticalmente',
    shortDescription: 'Corrige la orientación de fotos tomadas de lado o al revés. Gira en sentido horario o antihorario y crea efectos espejo horizontal o vertical.',
    iconName: 'RotateCw',
    popularRank: 10,
    badge: 'Edición Rápida',
    initialMode: 'rotate',
    acceptedFormatsText: 'JPG, PNG, WebP, GIF, BMP, AVIF',
    seo: {
      title: 'Girar Imagen Online Gratis | Rotar 90°, 180° y Voltear Espejo',
      metaDescription: 'Gira fotos e imágenes 90 grados, 180 o 270 al instante. Corrige la orientación vertical/horizontal y voltea en espejo. 100% gratis y local.',
      h1: 'Girar y Rotar Imágenes Online Gratis',
      keywords: ['girar imagen online', 'rotar foto 90 grados', 'voltear imagen horizontalmente', 'rotar foto al reves online', 'efecto espejo imagen'],
      summary: 'Corrige rápidamente imágenes tomadas con el teléfono en orientación incorrecta o aplica efecto espejo horizontal para composiciones visuales.',
      howToSteps: [
        'Sube la imagen que deseas rotar o voltear.',
        'Haz clic en los botones "Girar 90°" hacia la derecha o izquierda.',
        'Usa "Voltear Horizontal" o "Voltear Vertical" para efecto espejo si lo necesitas.',
        'Pulsa "Descargar imagen" con la nueva orientación corregida.',
      ],
      comparisonPoints: [
        { title: 'Rotación sin Pérdida', desc: 'Preserva la calidad fotográfica exacta y los píxeles originales durante el giro.' },
        { title: 'Efecto Espejo (Flip)', desc: 'Invierte horizontal o verticalmente la imagen con un solo clic.' },
      ],
      tipsToImprove: ['Ideal para corregir fotos de móvil que se abren de costado debido a problemas de orientación en la etiqueta EXIF.'],
      faqs: [
        {
          question: '¿Por qué algunas fotos tomadas con el celular se ven de lado?',
          answer: 'Muchas cámaras guardan la orientación en un metadato EXIF que ciertos visores no leen. Al rotarla y guardarla aquí, la rotación queda fijada permanentemente en los píxeles.',
        },
        {
          question: '¿Puedo voltear la imagen como un espejo?',
          answer: 'Sí, dispones de botones específicos para voltear horizontalmente (efecto espejo) y verticalmente.',
        },
      ],
    },
    relatedSlugs: ['recortar-imagen', 'redimensionar-imagen', 'comprimir-imagen'],
  },

  // 11. Eliminar Metadatos
  {
    id: 'remove-metadata',
    slug: 'eliminar-metadatos',
    name: 'Eliminar Metadatos de Imagen (EXIF y GPS)',
    tagline: 'Limpia Información de Ubicación GPS, Cámara y Fecha para Proteger tu Privacidad',
    shortDescription: 'Elimina metadatos EXIF, coordenadas GPS de ubicación, modelo de cámara y fecha antes de compartir tus fotos en internet.',
    iconName: 'ShieldCheck',
    popularRank: 11,
    badge: 'Privacidad',
    initialMode: 'metadata',
    acceptedFormatsText: 'JPG, JPEG, HEIC, PNG',
    seo: {
      title: 'Eliminar Metadatos EXIF y GPS de Fotos Online | 100% Privado',
      metaDescription: 'Borra datos de geolocalización GPS, cámara, fecha y metadatos EXIF de tus fotos antes de publicarlas. Procesamiento 100% local.',
      h1: 'Eliminar Metadatos EXIF y GPS de Imágenes',
      keywords: ['eliminar metadatos foto', 'quitar gps de fotos', 'borrar exif online', 'limpiar privacidad imagen'],
      summary: 'Las cámaras y smartphones incrustan datos ocultos como tu ubicación exacta (coordenadas GPS) en cada foto. Esta herramienta los elimina por completo.',
      howToSteps: [
        'Sube tu foto tomada con móvil o cámara.',
        'Revisa los datos técnicos detectados.',
        'Pulsa "Eliminar metadatos y descargar" para generar una copia limpia y anónima.',
      ],
      comparisonPoints: [
        { title: 'Antes de Limpiar', desc: 'Contiene modelo de dispositivo, fecha/hora exacta y coordenadas de mapa GPS.' },
        { title: 'Después de Limpiar', desc: 'Solo contiene los píxeles visuales puros sin ningún rastro de metadatos privados.' },
      ],
      tipsToImprove: ['Limpia siempre las fotos tomadas en tu hogar antes de compartirlas públicamente en foros o redes sociales.'],
      faqs: [
        {
          question: '¿Cómo funciona la eliminación de metadatos?',
          answer: 'Redibujamos la imagen píxel a píxel en un Canvas local en tu navegador, creando un nuevo archivo que no incluye cabeceras EXIF ni etiquetas GPS.',
        },
      ],
    },
    relatedSlugs: ['comprimir-imagen', 'convertir-jpg-a-png', 'redimensionar-imagen'],
  },

  // 12. Generador de Favicon
  {
    id: 'favicon-generator',
    slug: 'generador-favicon',
    name: 'Generador de Favicon',
    tagline: 'Crea tu Archivo favicon.ico y Paquete Completo para Web y Aplicaciones PWA',
    shortDescription: 'Genera el archivo favicon.ico y todos los tamaños estándar (16x16, 32x32, 48x48, 180x180 Apple, 192x192, 512x512) con código HTML listo para copiar.',
    iconName: 'Globe',
    popularRank: 12,
    badge: 'Web & PWA',
    initialMode: 'favicon',
    acceptedFormatsText: 'PNG, JPG, SVG, WebP',
    seo: {
      title: 'Generador de Favicon.ico Online | Paquete Completo PNG y HTML',
      metaDescription: 'Crea el archivo favicon.ico y todos los iconos para navegadores, iOS y Android PWA con código HTML y descarga en ZIP.',
      h1: 'Generador de Favicon.ico y Paquete Web',
      keywords: ['generador de favicon', 'crear favicon ico online', 'favicon 16x16 32x32', 'icono pestaña navegador'],
      summary: 'El favicon es el icono que aparece en las pestañas del navegador, marcadores y accesos directos de móviles.',
      howToSteps: [
        'Sube tu logo o imagen cuadrada (mínimo 512×512 recomendado).',
        'Previsualiza cómo se verá en la pestaña del navegador.',
        'Descarga el archivo favicon.ico o el paquete ZIP con todos los tamaños y código HTML.',
      ],
      comparisonPoints: [
        { title: 'favicon.ico Multicapa', desc: 'Incluye resoluciones de 16x16, 32x32 y 48x48 dentro de un solo archivo .ico.' },
        { title: 'Iconos PWA y Apple', desc: 'Incluye apple-touch-icon (180px) y android-chrome (192px y 512px) listos para instalar.' },
      ],
      tipsToImprove: ['Usa un diseño con alto contraste y pocos detalles para que sea fácilmente reconocible en un tamaño pequeño de 16x16 píxeles.'],
      faqs: [
        {
          question: '¿Qué archivos incluye el paquete ZIP?',
          answer: 'Incluye favicon.ico, PNGs de 16x16, 32x32, 48x48, 180x180, 192x192, 512x512, site.webmanifest y el código HTML para copiar en tu <head>.',
        },
      ],
    },
    relatedSlugs: ['convertir-svg-a-png', 'redimensionar-imagen', 'convertir-png-a-webp'],
  },

  // 13. Optimizar Imagen para Web
  {
    id: 'optimize-web',
    slug: 'optimizar-web',
    name: 'Optimizar Imagen para Web',
    tagline: 'Diagnóstico Inteligente y Recomendación de Formato para Máxima Velocidad Web',
    shortDescription: 'Sube tu imagen y el sistema te recomendará el mejor formato (WebP o JPG optimizado) para lograr el máximo ahorro de peso sin perder nitidez.',
    iconName: 'Compass',
    popularRank: 13,
    initialMode: 'optimize',
    defaultTargetFormat: 'webp',
    defaultQuality: 82,
    acceptedFormatsText: 'PNG, JPG, JPEG, WebP, BMP',
    seo: {
      title: 'Optimizar Imágenes para Web | Diagnóstico y Ahorro Máximo',
      metaDescription: 'Optimiza imágenes para páginas web, tiendas online y blogs. Recomendación automática de formato y compresión para acelerar tu sitio.',
      h1: 'Optimizador de Imágenes para Web y SEO',
      keywords: ['optimizar imagen web', 'reducir peso imagen pagespeed', 'optimizar fotos ecommerce', 'mejorar velocidad web fotos'],
      summary: 'Las imágenes pesadas son la causa #1 de lentitud en páginas web. Optimizarlas mejora las conversiones y el posicionamiento en Google.',
      howToSteps: [
        'Sube cualquier imagen.',
        'El sistema evaluará el tipo de contenido (foto vs gráfico) y propondrá la mejor combinación de formato y calidad.',
        'Descarga la versión optimizada con ahorro de hasta el 75%.',
      ],
      comparisonPoints: [
        { title: 'Recomendación Inteligente', desc: 'Detecta si la imagen contiene transparencias para sugerir WebP/PNG o fotografías para sugerir WebP/JPG.' },
      ],
      tipsToImprove: ['Combina la conversión a WebP con un límite de ancho de 1920px para banners para no cargar píxeles innecesarios.'],
      faqs: [
        {
          question: '¿Es WebP siempre la mejor opción?',
          answer: 'En el 90% de los casos sí, porque ofrece menor peso tanto para fotos como para gráficos con transparencia.',
        },
      ],
    },
    relatedSlugs: ['comprimir-imagen', 'convertir-jpg-a-webp', 'convertir-png-a-webp'],
  },

  // 14. Convertir a PNG (Página global)
  {
    id: 'convert-to-png-all',
    slug: 'convertir-a-png',
    name: 'Convertir a PNG',
    tagline: 'Convierte Cualquier Archivo de Imagen (JPG, WEBP, GIF, BMP, SVG, AVIF) a PNG',
    shortDescription: 'Convertidor universal a formato PNG sin pérdida con soporte para transparencias y máxima fidelidad de color.',
    iconName: 'FileImage',
    popularRank: 14,
    initialMode: 'convert',
    defaultTargetFormat: 'png',
    acceptedFormatsText: 'JPG, WEBP, GIF, BMP, SVG, AVIF, HEIC, TIFF',
    seo: {
      title: 'Convertir Imágenes a PNG Online Gratis | Universal y Sin Pérdida',
      metaDescription: 'Convierte cualquier formato de imagen a PNG al instante. Soporta JPG, WebP, GIF, BMP, SVG y AVIF. 100% privado en tu navegador.',
      h1: 'Convertidor Universal a Formato PNG',
      keywords: ['convertir a png', 'pasar imagen a png', 'convertidor a png gratis', 'transformar a formato png'],
      summary: 'Convierte fotos, ilustraciones y capturas de cualquier formato a archivos PNG compatibles con todos los programas de edición.',
      howToSteps: ['Sube tu archivo de imagen.', 'Comprueba la previsualización.', 'Descarga tu nuevo archivo .png.'],
      comparisonPoints: [
        { title: 'Formato PNG', desc: 'Estándar universal sin pérdida compatible con todos los navegadores y programas de diseño.' },
      ],
      tipsToImprove: ['Ideal para unificar archivos de diferentes orígenes en un solo formato estándar.'],
      faqs: [
        {
          question: '¿Qué formatos puedo convertir a PNG?',
          answer: 'Puedes convertir JPG, WebP, SVG, GIF, BMP, AVIF y TIFF a PNG directamente en tu navegador.',
        },
      ],
    },
    relatedSlugs: ['convertir-a-jpg', 'convertir-a-webp', 'convertir-jpg-a-png'],
  },

  // 15. Convertir a JPG (Página global)
  {
    id: 'convert-to-jpg-all',
    slug: 'convertir-a-jpg',
    name: 'Convertir a JPG',
    tagline: 'Convierte Cualquier Formato (PNG, WEBP, BMP, AVIF, SVG) a JPG / JPEG',
    shortDescription: 'Convierte cualquier imagen a JPG con control de compresión y selector de color para reemplazar fondos transparentes.',
    iconName: 'Image',
    popularRank: 15,
    initialMode: 'convert',
    defaultTargetFormat: 'jpeg',
    defaultQuality: 85,
    requireMatte: true,
    acceptedFormatsText: 'PNG, WEBP, BMP, AVIF, SVG, HEIC, TIFF',
    seo: {
      title: 'Convertir Imágenes a JPG Online Gratis | Compatible y Rápido',
      metaDescription: 'Convierte PNG, WebP, SVG y otros formatos a JPG. Controla la calidad y el color de fondo para transparencias.',
      h1: 'Convertidor Universal a Formato JPG',
      keywords: ['convertir a jpg', 'pasar imagen a jpeg', 'convertidor universal a jpg', 'transformar foto a jpg'],
      summary: 'JPG es el formato con mayor compatibilidad en el mundo, ideal para fotografías e impresión digital.',
      howToSteps: [
        'Sube tu imagen en cualquier formato.',
        'Elige el nivel de calidad JPG (80-90%).',
        'Descarga tu archivo .jpg.',
      ],
      comparisonPoints: [
        { title: 'Compatibilidad 100%', desc: 'Se abre en cualquier teléfono, televisor, consola o programa informático.' },
      ],
      tipsToImprove: ['Si la imagen original tenía fondo transparente, elige fondo blanco o el color que mejor combine con tu diseño.'],
      faqs: [
        {
          question: '¿Por qué convertir a JPG?',
          answer: 'Para garantizar que cualquier persona o aplicación pueda abrir la imagen sin problemas de incompatibilidad.',
        },
      ],
    },
    relatedSlugs: ['convertir-a-png', 'convertir-a-webp', 'convertir-png-a-jpg'],
  },

  // 16. Convertir a WebP (Página global)
  {
    id: 'convert-to-webp-all',
    slug: 'convertir-a-webp',
    name: 'Convertir a WebP',
    tagline: 'Convierte tus Imágenes a Formato WebP para Máxima Velocidad y Ahorro de Datos',
    shortDescription: 'Herramienta integral para transformar JPG, PNG y BMP a WebP con compresión de última generación y soporte para transparencia.',
    iconName: 'Zap',
    popularRank: 16,
    initialMode: 'convert',
    defaultTargetFormat: 'webp',
    defaultQuality: 82,
    acceptedFormatsText: 'JPG, PNG, BMP, GIF, SVG',
    seo: {
      title: 'Convertir Imágenes a WebP Online | Formato Moderno y Ligero',
      metaDescription: 'Convierte tus imágenes a WebP en segundos. Reduce el peso un 30-50% manteniendo alta calidad y transparencias.',
      h1: 'Convertidor Universal a Formato WebP',
      keywords: ['convertir a webp', 'pasar imagenes a webp', 'convertidor webp online', 'formato webp proximo generacion'],
      summary: 'Adopta el formato recomendado por Google para mejorar el rendimiento web y el posicionamiento SEO.',
      howToSteps: ['Sube tus imágenes.', 'Ajusta la calidad.', 'Descarga tus archivos WebP optimizados.'],
      comparisonPoints: [
        { title: 'Menor Consumo de Ancho de Banda', desc: 'Ahorra datos a tus visitantes en conexiones móviles.' },
      ],
      tipsToImprove: ['Reemplaza los PNG pesados de tu sitio web por WebP para acelerar la carga hasta 3 veces.'],
      faqs: [
        {
          question: '¿Puedo convertir varias imágenes a la vez a WebP?',
          answer: 'Sí, puedes convertir lotes completos de fotos a WebP y descargarlos en un solo archivo ZIP.',
        },
      ],
    },
    relatedSlugs: ['convertir-a-png', 'convertir-a-jpg', 'convertir-jpg-a-webp'],
  },

  // 17. Convertir a AVIF (Página global)
  {
    id: 'convert-to-avif-all',
    slug: 'convertir-a-avif',
    name: 'Convertir a AVIF',
    tagline: 'Convierte a Formato AVIF de Nueva Generación Basado en el Códec AV1',
    shortDescription: 'Experimenta la compresión más avanzada de la industria fotográfica con AVIF para el máximo ahorro de peso.',
    iconName: 'Sparkles',
    popularRank: 17,
    initialMode: 'convert',
    defaultTargetFormat: 'avif',
    defaultQuality: 80,
    acceptedFormatsText: 'JPG, PNG, WebP, BMP',
    seo: {
      title: 'Convertir Imágenes a AVIF Online | Compresión Códec AV1',
      metaDescription: 'Convierte fotos a formato AVIF de última generación. Máximo ahorro de peso con alta fidelidad cromática.',
      h1: 'Convertidor a Formato AVIF de Próxima Generación',
      keywords: ['convertir a avif', 'pasar imagen a avif', 'codec av1 imagen', 'formato avif online'],
      summary: 'AVIF es el formato de compresión más moderno, ofreciendo un ahorro superior incluso al formato WebP.',
      howToSteps: ['Sube tu imagen.', 'Selecciona AVIF (con fallback a WebP en navegadores compatibles).', 'Descarga el archivo ultracompacto.'],
      comparisonPoints: [
        { title: 'Códec AV1', desc: 'Excelente conservación de degradados suaves y reducción de grano.' },
      ],
      tipsToImprove: ['Verifica la compatibilidad de tu navegador o utiliza etiquetas <picture> con fallback a WebP en tu código HTML.'],
      faqs: [
        {
          question: '¿Qué ventajas tiene AVIF frente a WebP?',
          answer: 'AVIF puede lograr entre un 15% y 20% más de compresión que WebP en imágenes complejas con gradientes de color.',
        },
      ],
    },
    relatedSlugs: ['convertir-a-webp', 'convertir-a-jpg', 'comprimir-imagen'],
  },
];
