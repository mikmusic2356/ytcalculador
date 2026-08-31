import { CalculatorConfig } from '../../types';
import {
  calculateVideoBitrateSize,
  calculateVideoFileSize,
  convertDuration,
  calculateFps,
  calculateFrames,
  calculateCompressionReduction,
} from '../../utils/mathFormulas';

export const VIDEO_ENCODING_CALCULATORS: CalculatorConfig[] = [
  // 1. Calculadora de Bitrate
  {
    id: 'bitrate-calculator',
    slug: 'calculadora-bitrate',
    name: 'Calculadora de Bitrate de Video y Audio',
    tagline: 'Calcula el Bitrate Total y el Tamaño Estimado de tus Archivos de Video',
    shortDescription: 'Introduce la resolución, FPS, duración y tasas de bits de video y audio para estimar el peso en MB/GB y la configuración de renderizado.',
    category: 'video',
    subcategory: 'video',
    iconName: 'Sliders',
    popularRank: 10,
    badge: 'Popular',
    fields: [
      {
        id: 'resolution',
        label: 'Resolución de Video',
        type: 'select',
        defaultValue: '1080p',
        options: [
          { label: '720p HD (1280x720)', value: '720p' },
          { label: '1080p Full HD (1920x1080)', value: '1080p' },
          { label: '1440p 2K (2560x1440 - Códec VP09)', value: '1440p' },
          { label: '4K Ultra HD (3840x2160)', value: '4k' },
          { label: '8K Ultra HD (7680x4320)', value: '8k' },
        ],
      },
      {
        id: 'fps',
        label: 'Tasa de Fotogramas (FPS)',
        type: 'select',
        defaultValue: '60',
        options: [
          { label: '24 FPS (Cine / Estándar)', value: '24' },
          { label: '30 FPS (Video estándar / Vlogs)', value: '30' },
          { label: '60 FPS (Alta fluidez / Gaming)', value: '60' },
          { label: '120 FPS (Cámara lenta)', value: '120' },
        ],
      },
      {
        id: 'durationMinutes',
        label: 'Duración del Video (Minutos)',
        type: 'number',
        defaultValue: 10,
        min: 0.1,
        max: 720,
        step: 0.5,
        placeholder: 'Ej. 10',
      },
      {
        id: 'videoBitrateMbps',
        label: 'Bitrate de Video (Mbps)',
        type: 'number',
        defaultValue: 8,
        min: 0.1,
        max: 500,
        step: 0.5,
        placeholder: 'Ej. 8',
      },
      {
        id: 'audioBitrateKbps',
        label: 'Bitrate de Audio (Kbps)',
        type: 'number',
        defaultValue: 192,
        min: 32,
        max: 512,
        step: 16,
        placeholder: 'Ej. 192',
      },
    ],
    presets: [
      {
        label: '1080p 60fps Estándar (8 Mbps + 192 kbps)',
        values: { resolution: '1080p', fps: '60', durationMinutes: 10, videoBitrateMbps: 8, audioBitrateKbps: 192 },
      },
      {
        label: '1440p 60fps 2K YouTube (24 Mbps + 384 kbps)',
        values: { resolution: '1440p', fps: '60', durationMinutes: 15, videoBitrateMbps: 24, audioBitrateKbps: 384 },
      },
      {
        label: '4K 60fps Máxima Calidad (50 Mbps + 384 kbps)',
        values: { resolution: '4k', fps: '60', durationMinutes: 20, videoBitrateMbps: 50, audioBitrateKbps: 384 },
      },
    ],
    calculate: (inputs) => {
      const durationMinutes = Number(inputs.durationMinutes) || 10;
      const videoBitrateMbps = Number(inputs.videoBitrateMbps) || 8;
      const videoBitrateKbps = videoBitrateMbps * 1000;
      const audioBitrateKbps = Number(inputs.audioBitrateKbps) || 192;

      const result = calculateVideoBitrateSize(durationMinutes, videoBitrateKbps, audioBitrateKbps);

      const displaySize =
        result.sizeGB >= 1
          ? `${result.sizeGB.toFixed(2)} GB`
          : `${result.sizeMB.toFixed(0)} MB`;

      const breakdownData = [
        { name: 'Video (Mbps)', value: Number(videoBitrateMbps.toFixed(2)) },
        { name: 'Audio (Mbps eq.)', value: Number((audioBitrateKbps / 1000).toFixed(3)) },
      ];

      return {
        primaryValue: displaySize,
        primaryLabel: 'Tamaño Estimado de Archivo',
        secondaryMetrics: [
          { label: 'Bitrate Total Combinado', value: `${result.totalBitrateMbps.toFixed(2)} Mbps`, highlight: true },
          { label: 'Duración en Segundos', value: `${result.durationSeconds} seg` },
          { label: 'Tamaño en MegaBytes', value: `${result.sizeMB.toFixed(1)} MB` },
          { label: 'Tiempo Subida (50 Mbps)', value: `~${Math.ceil((result.sizeMB * 8) / 50 / 60)} min` },
        ],
        formulaExplanation: `Cálculo de Bitrate y Tamaño:\n• Bitrate Total = Video (${videoBitrateMbps} Mbps = ${videoBitrateKbps} Kbps) + Audio (${audioBitrateKbps} Kbps) = ${result.totalBitrateKbps} Kbps (${result.totalBitrateMbps.toFixed(2)} Mbps)\n• Duración: ${durationMinutes} min = ${result.durationSeconds} segundos\n• Total bits = ${result.totalBitrateKbps} Kbps × 1.000 × ${result.durationSeconds}s = ${result.totalBits.toLocaleString()} bits\n• Tamaño en Bytes = bits ÷ 8 = ${Math.round(result.totalBytes).toLocaleString()} Bytes\n• Tamaño = ${result.sizeMB.toFixed(2)} MB / ${result.sizeGB.toFixed(3)} GB`,
        benchmarkText: 'El tamaño real final puede variar según el códec (H.264, H.265/HEVC, AV1), tasa de bits variable (VBR), metadatos y perfil de codificación.',
        benchmarkStatus: 'info',
        recommendations: [
          'Para YouTube, exportar en 1440p o 4K fuerza el códec VP09/AV1 en los servidores de Google, evitando la compresión pixelada de AVC1 en 1080p.',
          'Si utilizas VBR 2-pass (tasa variable de 2 pasadas), el renderizado tardará el doble pero optimizará el tamaño en escenas con poco movimiento.',
        ],
        breakdownData,
        rawOutput: result,
      };
    },
    seo: {
      title: 'Calculadora de Bitrate de Video y Audio | Estimar Tamaño en MB y GB',
      metaDescription: 'Calcula el bitrate total y el tamaño estimado de archivo para tus videos de YouTube según resolución, FPS, audio y tasa de bits.',
      h1: 'Calculadora de Bitrate de Video y Audio',
      keywords: ['calculadora bitrate video', 'calcular tamano video bitrate', 'bitrate youtube 1080p 4k', 'kbps mbps video'],
      summary: 'Calcula con precisión el bitrate combinado de video y audio y el peso estimado del archivo renderizado antes de exportar.',
      formulaMarkdown: '`Tamaño (Bytes) = ((Bitrate Video Kbps + Bitrate Audio Kbps) × 1.000 × Segundos) / 8`',
      howToSteps: [
        'Selecciona la resolución y tasa de fotogramas (FPS) del proyecto.',
        'Introduce la duración en minutos del video.',
        'Ajusta el bitrate de video en Mbps y el bitrate de audio en Kbps.',
        'Obtén el tamaño estimado en Megabytes y Gigabytes.',
      ],
      tipsToImprove: [
        'Usa 384 Kbps AAC estéreo para la máxima fidelidad sonora en YouTube.',
        'Un bitrate de 8 a 12 Mbps es ideal para 1080p a 60fps con códec H.264.',
      ],
      faqs: [
        {
          question: '¿Por qué el tamaño real de mi video difiere del cálculo?',
          answer: 'El cálculo matemático asume un Bitrate Constante (CBR). Si usas Bitrate Variable (VBR), el programa asigna menos datos a escenas estáticas y más a escenas con mucho movimiento, alterando el peso final.',
        },
        {
          question: '¿Qué diferencia hay entre Kbps y Mbps?',
          answer: '1 Mbps equivale exactamente a 1.000 Kbps (o 1.024 Kbps en binario). Los bitrates de video se suelen expresar en Mbps y los de audio en Kbps.',
        },
      ],
    },
    relatedSlugs: ['calculadora-tamano-video', 'calculadora-compresion-video', 'calculadora-tiempo-grabacion'],
  },

  // 2. Calculadora de Tamaño de Archivo de Video
  {
    id: 'video-file-size',
    slug: 'calculadora-tamano-video',
    name: 'Calculadora de Tamaño de Archivo de Video',
    tagline: 'Convierte Duración y Tasa de Bits en KB, MB, GB y TB',
    shortDescription: 'Calcula el peso exacto en múltiples unidades de almacenamiento a partir de la duración y el bitrate total de renderizado.',
    category: 'video',
    subcategory: 'video',
    iconName: 'HardDrive',
    popularRank: 11,
    badge: 'Esencial',
    fields: [
      {
        id: 'durationMinutes',
        label: 'Duración del Video (Minutos)',
        type: 'number',
        defaultValue: 15,
        min: 0.1,
        max: 1440,
        step: 0.5,
        placeholder: 'Ej. 15',
      },
      {
        id: 'totalBitrateMbps',
        label: 'Bitrate Total (Mbps)',
        type: 'number',
        defaultValue: 16,
        min: 0.1,
        max: 500,
        step: 0.5,
        placeholder: 'Ej. 16',
      },
    ],
    presets: [
      { label: 'Video YouTube 10 min @ 10 Mbps (750 MB)', values: { durationMinutes: 10, totalBitrateMbps: 10 } },
      { label: 'Podcast 60 min @ 12 Mbps (5.4 GB)', values: { durationMinutes: 60, totalBitrateMbps: 12 } },
      { label: 'Gameplay 4K 30 min @ 45 Mbps (10.1 GB)', values: { durationMinutes: 30, totalBitrateMbps: 45 } },
    ],
    calculate: (inputs) => {
      const minutes = Number(inputs.durationMinutes) || 15;
      const bitrateMbps = Number(inputs.totalBitrateMbps) || 16;
      const durationSeconds = minutes * 60;
      const totalBitrateKbps = bitrateMbps * 1000;

      const res = calculateVideoFileSize(durationSeconds, totalBitrateKbps);

      return {
        primaryValue: res.bestUnitLabel,
        primaryLabel: 'Tamaño Aproximado del Archivo',
        secondaryMetrics: [
          { label: 'GigaBytes (GB)', value: `${res.sizeGB.toFixed(2)} GB`, highlight: true },
          { label: 'MegaBytes (MB)', value: `${res.sizeMB.toFixed(0)} MB` },
          { label: 'KiloBytes (KB)', value: `${Math.round(res.sizeKB).toLocaleString()} KB` },
          { label: 'TeraBytes (TB)', value: `${res.sizeTB.toFixed(4)} TB` },
        ],
        formulaExplanation: `Fórmula: Tamaño = (Bitrate Total Mbps × Duración en Segundos) ÷ 8 bits/Byte\n• (${bitrateMbps} Mbps × ${durationSeconds} seg) ÷ 8 = ${res.sizeMB.toFixed(2)} MB (${res.sizeGB.toFixed(2)} GB).`,
        benchmarkText: 'Recuerda que YouTube permite subir archivos individuales de hasta 256 GB o 12 horas de duración.',
        benchmarkStatus: 'optimal',
        recommendations: [
          'Para archivos superiores a 5 GB, utiliza subidas programadas en YouTube Studio para que el procesamiento 4K termine antes de publicar.',
        ],
        breakdownData: [
          { name: 'MB', value: Math.round(res.sizeMB) },
          { name: 'GB (x100)', value: Number((res.sizeGB * 100).toFixed(1)) },
        ],
        rawOutput: res,
      };
    },
    seo: {
      title: 'Calculadora de Tamaño de Archivo de Video en MB, GB y TB',
      metaDescription: 'Calcula cuánto pesará tu archivo de video antes de renderizar y subirlo a YouTube o guardarlo en tu disco duro.',
      h1: 'Calculadora de Tamaño de Archivo de Video',
      keywords: ['tamano archivo video', 'calcular peso video gb mb', 'calculadora bitrate peso video', 'peso video youtube'],
      summary: 'Estima el espacio en disco y el peso de cualquier exportación de video en KB, MB, GB y TB.',
      formulaMarkdown: '`Tamaño (MB) = (Bitrate Mbps × Segundos) / 8`',
      howToSteps: ['Introduce la duración en minutos.', 'Indica la tasa de bits en Mbps.', 'Obtén el peso en todas las unidades.'],
      tipsToImprove: ['Usa códec H.265/HEVC para reducir el tamaño a la mitad con idéntica calidad visual que H.264.'],
      faqs: [
        {
          question: '¿Cuántos MB son 1 GB de video?',
          answer: 'En almacenamiento digital estándar binario, 1 GB equivale a 1.024 MB (o 1.000 MB en sistema decimal comercial).',
        },
      ],
    },
    relatedSlugs: ['calculadora-bitrate', 'calculadora-almacenamiento-video', 'calculadora-compresion-video'],
  },

  // 3. Calculadora de Duración de Video
  {
    id: 'video-duration',
    slug: 'calculadora-duracion-video',
    name: 'Calculadora y Conversor de Duración de Video',
    tagline: 'Convierte Segundos, Minutos, Horas y Código de Tiempo HH:MM:SS',
    shortDescription: 'Convierte fácilmente duraciones de video entre segundos, minutos y horas con formato estandarizado de reproducción.',
    category: 'video',
    subcategory: 'video',
    iconName: 'Clock',
    popularRank: 16,
    fields: [
      {
        id: 'durationValue',
        label: 'Valor de Duración',
        type: 'number',
        defaultValue: 7200,
        min: 1,
        max: 864000,
        step: 1,
        placeholder: 'Ej. 7200',
      },
      {
        id: 'unit',
        label: 'Unidad de Origen',
        type: 'select',
        defaultValue: 'seconds',
        options: [
          { label: 'Segundos (s)', value: 'seconds' },
          { label: 'Minutos (min)', value: 'minutes' },
          { label: 'Horas (h)', value: 'hours' },
        ],
      },
    ],
    presets: [
      { label: '7.200 Segundos (2 Horas exactas)', values: { durationValue: 7200, unit: 'seconds' } },
      { label: '90 Minutos (1.5 Horas)', values: { durationValue: 90, unit: 'minutes' } },
      { label: '8 Horas (28.800 Segundos)', values: { durationValue: 8, unit: 'hours' } },
    ],
    calculate: (inputs) => {
      const val = Number(inputs.durationValue) || 7200;
      const unit = (inputs.unit as 'seconds' | 'minutes' | 'hours') || 'seconds';

      const res = convertDuration(val, unit);

      let primaryText = `${res.hours.toFixed(2)} horas`;
      if (unit === 'hours') {
        primaryText = `${res.minutes.toFixed(0)} minutos (${res.seconds.toLocaleString()}s)`;
      }

      return {
        primaryValue: res.formattedTimecode,
        primaryLabel: 'Formato de Tiempo (HH:MM:SS)',
        secondaryMetrics: [
          { label: 'Horas Totales', value: `${res.hours.toFixed(2)} h`, highlight: true },
          { label: 'Minutos Totales', value: `${res.minutes.toFixed(1)} min` },
          { label: 'Segundos Totales', value: `${res.seconds.toLocaleString()} s` },
          { label: 'Equivalente en Días', value: `${(res.hours / 24).toFixed(2)} días` },
        ],
        formulaExplanation: `Conversión de Duración (${val} ${unit}):\n• Horas = ${res.hours.toFixed(3)} h\n• Minutos = ${res.minutes.toFixed(1)} min\n• Segundos = ${res.seconds.toLocaleString()} s\n• Código de Tiempo: ${res.formattedTimecode}`,
        benchmarkStatus: 'optimal',
        recommendations: [
          'Los videos de más de 8 minutos en YouTube permiten insertar pausas publicitarias intermedias (mid-rolls) para aumentar los ingresos publicitarios.',
        ],
        breakdownData: [
          { name: 'Horas', value: Number(res.hours.toFixed(2)) },
          { name: 'Minutos', value: Number(res.minutes.toFixed(1)) },
        ],
        rawOutput: res,
      };
    },
    seo: {
      title: 'Calculadora y Conversor de Duración de Video | Segundos a Horas y HH:MM:SS',
      metaDescription: 'Convierte segundos a minutos y horas con formato de tiempo HH:MM:SS para calcular tiempos de edición y metraje en YouTube.',
      h1: 'Calculadora y Conversor de Duración de Video',
      keywords: ['convertir segundos a horas video', 'calculadora duracion video', 'formato hh mm ss video', 'minutos a segundos'],
      summary: 'Conversor rápido y preciso entre unidades de tiempo y formato de código de tiempo para editores de video.',
      formulaMarkdown: '`Horas = Segundos / 3600 | Minutos = Segundos / 60`',
      howToSteps: ['Introduce el número.', 'Selecciona si son segundos, minutos u horas.', 'Obtén la conversión instantánea y el formato HH:MM:SS.'],
      tipsToImprove: ['Para YouTube Shorts, asegúrate de que la duración total sea estrictamente inferior a 60 segundos.'],
      faqs: [
        {
          question: '¿Cómo convertir 7200 segundos a horas?',
          answer: 'Divide 7200 entre 3600: 7200 / 3600 = 2 horas exactas (02:00:00).',
        },
      ],
    },
    relatedSlugs: ['conversor-timecode', 'calculadora-fps-video', 'calculadora-frames-video'],
  },

  // 4. Calculadora de FPS
  {
    id: 'fps-calculator',
    slug: 'calculadora-fps-video',
    name: 'Calculadora de FPS (Fotogramas por Segundo)',
    tagline: 'Calcula la Tasa de Fotogramas a partir de los Frames Totales y la Duración',
    shortDescription: 'Calcula la tasa exacta de fotogramas por segundo (FPS) de un clip conociendo el conteo total de frames y los segundos de reproducción.',
    category: 'video',
    subcategory: 'video',
    iconName: 'Film',
    popularRank: 18,
    fields: [
      {
        id: 'frames',
        label: 'Número Total de Frames',
        type: 'number',
        defaultValue: 3000,
        min: 1,
        max: 5000000,
        step: 1,
        placeholder: 'Ej. 3000',
      },
      {
        id: 'durationSeconds',
        label: 'Duración del Clip (Segundos)',
        type: 'number',
        defaultValue: 100,
        min: 0.1,
        max: 86400,
        step: 0.5,
        placeholder: 'Ej. 100',
      },
    ],
    presets: [
      { label: '3.000 frames en 100 segundos (30 FPS)', values: { frames: 3000, durationSeconds: 100 } },
      { label: '7.200 frames en 120 segundos (60 FPS)', values: { frames: 7200, durationSeconds: 120 } },
      { label: '14.400 frames en 600 segundos (24 FPS Cine)', values: { frames: 14400, durationSeconds: 600 } },
    ],
    calculate: (inputs) => {
      const frames = Number(inputs.frames) || 3000;
      const duration = Number(inputs.durationSeconds) || 100;

      const fps = calculateFps(frames, duration);
      const framesCalculated = calculateFrames(fps, duration);

      return {
        primaryValue: `${fps.toFixed(2)} FPS`,
        primaryLabel: 'Tasa de Fotogramas por Segundo (FPS)',
        secondaryMetrics: [
          { label: 'Frames Totales', value: frames.toLocaleString(), highlight: true },
          { label: 'Duración en Minutos', value: `${(duration / 60).toFixed(2)} min` },
          { label: 'Duración de 1 Frame', value: `${(1000 / (fps || 1)).toFixed(2)} ms` },
          { label: 'Frames por Minuto', value: `${Math.round(fps * 60).toLocaleString()} frames` },
        ],
        formulaExplanation: `Fórmula: FPS = Total de Frames ÷ Duración en Segundos\n• ${frames.toLocaleString()} frames ÷ ${duration} seg = ${fps.toFixed(2)} FPS.\n• Inversa: Frames = FPS × Segundos = ${fps.toFixed(2)} × ${duration}s = ${framesCalculated.toLocaleString()} frames.`,
        benchmarkText: 'Los estándares más comunes en video digital son 24 FPS (cinematográfico), 30 FPS (televisión/redes) y 60 FPS (videojuegos/deportes).',
        benchmarkStatus: 'optimal',
        recommendations: [
          'Grabar a 60 FPS o 120 FPS te permite ralentizar el video en postproducción a 24 FPS (cámara lenta al 40% o 20%) con total fluidez.',
        ],
        breakdownData: [
          { name: 'FPS', value: Number(fps.toFixed(1)) },
          { name: 'Duración (s)', value: duration },
        ],
        rawOutput: { fps, frames, duration },
      };
    },
    seo: {
      title: 'Calculadora de FPS de Video | Fotogramas por Segundo',
      metaDescription: 'Calcula los FPS de un video a partir del número total de frames y la duración en segundos con fórmulas matemáticas exactas.',
      h1: 'Calculadora de FPS (Fotogramas por Segundo)',
      keywords: ['calculadora fps video', 'calcular frames por segundo', 'formula fps video', 'conteo frames duracion'],
      summary: 'Determina la frecuencia de cuadro de tus videos o calcula el total de fotogramas requeridos para cualquier duración.',
      formulaMarkdown: '`FPS = Frames / Duración en Segundos`',
      howToSteps: ['Introduce el número de fotogramas.', 'Indica la duración en segundos.', 'Obtén los FPS resultantes.'],
      tipsToImprove: ['YouTube soporta hasta 60 FPS. Los videos a 60 FPS ofrecen una experiencia mucho más nítida y fluida en escenas de acción.'],
      faqs: [
        {
          question: '¿Qué es mejor para YouTube, 30 FPS o 60 FPS?',
          answer: 'Para vlogs, tutoriales y podcasts, 30 FPS es suficiente y produce archivos más ligeros. Para gaming, deportes y contenido con mucho movimiento, 60 FPS es la mejor opción.',
        },
      ],
    },
    relatedSlugs: ['calculadora-frames-video', 'conversor-fps', 'conversor-timecode'],
  },

  // 5. Calculadora de Frames
  {
    id: 'frames-calculator',
    slug: 'calculadora-frames-video',
    name: 'Calculadora de Frames Totales de Video',
    tagline: 'Calcula Cuántos Fotogramas Contiene un Video según los FPS y la Duración',
    shortDescription: 'Multiplica la tasa de cuadros por segundo por los minutos o segundos de metraje para obtener el total de fotogramas a renderizar.',
    category: 'video',
    subcategory: 'video',
    iconName: 'Layers',
    popularRank: 22,
    fields: [
      {
        id: 'fps',
        label: 'Tasa de Cuadros (FPS)',
        type: 'select',
        defaultValue: '30',
        options: [
          { label: '24 FPS (Cine)', value: '24' },
          { label: '25 FPS (PAL Europa)', value: '25' },
          { label: '29.97 FPS (NTSC TV)', value: '29.97' },
          { label: '30 FPS (Estándar Web)', value: '30' },
          { label: '50 FPS (PAL Alta)', value: '50' },
          { label: '60 FPS (YouTube 60fps)', value: '60' },
          { label: '120 FPS (Slow Motion)', value: '120' },
        ],
      },
      {
        id: 'durationMinutes',
        label: 'Duración del Video (Minutos)',
        type: 'number',
        defaultValue: 2,
        min: 0.05,
        max: 600,
        step: 0.1,
        placeholder: 'Ej. 2',
      },
    ],
    presets: [
      { label: '2 minutos @ 30 FPS (3.600 frames)', values: { fps: '30', durationMinutes: 2 } },
      { label: '10 minutos @ 60 FPS (36.000 frames)', values: { fps: '60', durationMinutes: 10 } },
      { label: '1 minuto @ 24 FPS (1.440 frames)', values: { fps: '24', durationMinutes: 1 } },
    ],
    calculate: (inputs) => {
      const fps = Number(inputs.fps) || 30;
      const minutes = Number(inputs.durationMinutes) || 2;
      const durationSeconds = minutes * 60;

      const totalFrames = calculateFrames(fps, durationSeconds);

      return {
        primaryValue: `${totalFrames.toLocaleString()} frames`,
        primaryLabel: 'Fotogramas Totales a Renderizar',
        secondaryMetrics: [
          { label: 'Duración en Segundos', value: `${durationSeconds} s`, highlight: true },
          { label: 'FPS Seleccionados', value: `${fps} fps` },
          { label: 'Frames por Segundo', value: `${fps} cuadros/s` },
          { label: 'Frames por Minuto', value: `${Math.round(fps * 60).toLocaleString()} cuadros/min` },
        ],
        formulaExplanation: `Fórmula: Total de Frames = FPS × Duración en Segundos\n• ${fps} FPS × (${minutes} min × 60s) = ${fps} × ${durationSeconds}s = ${totalFrames.toLocaleString()} frames.`,
        benchmarkStatus: 'optimal',
        recommendations: [
          'En animación 3D o exportación de secuencias PNG, conocer el total de frames te permite estimar el tiempo de render por cuadro.',
        ],
        breakdownData: [
          { name: 'Frames Totales', value: totalFrames },
        ],
        rawOutput: { totalFrames, fps, durationSeconds },
      };
    },
    seo: {
      title: 'Calculadora de Frames Totales de Video | Fotogramas según FPS',
      metaDescription: 'Calcula cuántos fotogramas tiene un video a partir de sus FPS y su duración en minutos o segundos.',
      h1: 'Calculadora de Frames Totales de Video',
      keywords: ['calcular frames video', 'conteo fotogramas video', 'cuantos frames tiene un video', 'frames 30fps 60fps'],
      summary: 'Calcula la cantidad total de imágenes individuales que componen un archivo de video según su velocidad de fotogramas.',
      formulaMarkdown: '`Total Frames = FPS × Duración en Segundos`',
      howToSteps: ['Elige los FPS del proyecto.', 'Indica la duración en minutos.', 'Visualiza el total de cuadros calculados.'],
      tipsToImprove: ['Un video de 10 minutos a 60 FPS requiere procesar exactamente 36.000 imágenes individuales.'],
      faqs: [
        {
          question: '¿Cuántos fotogramas hay en 1 minuto a 30 FPS?',
          answer: 'En 1 minuto (60 segundos) a 30 FPS hay exactamente 30 × 60 = 1.800 fotogramas.',
        },
      ],
    },
    relatedSlugs: ['calculadora-fps-video', 'conversor-timecode', 'calculadora-duracion-video'],
  },

  // 6. Calculadora de Compresión de Video
  {
    id: 'compression-calculator',
    slug: 'calculadora-compresion-video',
    name: 'Calculadora de Compresión y Ahorro de Espacio',
    tagline: 'Calcula el Porcentaje de Reducción y los Megabytes Ahorrados tras Comprimir',
    shortDescription: 'Compara el tamaño del archivo original con el archivo comprimido (Handbrake, H.265, AV1) y conoce el ahorro exacto de almacenamiento.',
    category: 'video',
    subcategory: 'video',
    iconName: 'Minimize2',
    popularRank: 17,
    badge: 'Ahorro',
    fields: [
      {
        id: 'originalSizeMB',
        label: 'Tamaño Original (MB o GB)',
        type: 'number',
        defaultValue: 2048,
        min: 1,
        max: 500000,
        step: 10,
        placeholder: 'Ej. 2048 (2 GB)',
      },
      {
        id: 'compressedSizeMB',
        label: 'Tamaño Comprimido (MB)',
        type: 'number',
        defaultValue: 800,
        min: 1,
        max: 500000,
        step: 10,
        placeholder: 'Ej. 800',
      },
    ],
    presets: [
      { label: 'Video 2 GB (2048 MB) a 800 MB (60.9% reducción)', values: { originalSizeMB: 2048, compressedSizeMB: 800 } },
      { label: 'Master ProRes 10 GB a MP4 1.5 GB (85% reducción)', values: { originalSizeMB: 10240, compressedSizeMB: 1536 } },
      { label: 'Video 500 MB optimizado a 150 MB (70% reducción)', values: { originalSizeMB: 500, compressedSizeMB: 150 } },
    ],
    calculate: (inputs) => {
      const orig = Number(inputs.originalSizeMB) || 2048;
      const comp = Number(inputs.compressedSizeMB) || 800;

      const res = calculateCompressionReduction(orig, comp);

      return {
        primaryValue: `${res.reductionPercent.toFixed(1)}%`,
        primaryLabel: 'Porcentaje de Reducción de Tamaño',
        secondaryMetrics: [
          { label: 'Espacio Ahorrado (MB)', value: `${res.savedSpaceMB.toFixed(0)} MB`, highlight: true, isPositive: true },
          { label: 'Espacio Ahorrado (GB)', value: `${res.savedSpaceGB.toFixed(2)} GB`, isPositive: true },
          { label: 'Factor de Compresión', value: `${res.compressionRatio.toFixed(2)}:1` },
          { label: 'Tamaño Final Restante', value: `${comp.toFixed(0)} MB` },
        ],
        formulaExplanation: `Fórmula de Reducción:\n• Reducción (%) = ((Tamaño Original - Tamaño Final) ÷ Tamaño Original) × 100\n• ((${orig} MB - ${comp} MB) ÷ ${orig} MB) × 100 = (${res.savedSpaceMB.toFixed(0)} ÷ ${orig}) × 100 = ${res.reductionPercent.toFixed(1)}%\n• Espacio Ahorrado = ${res.savedSpaceMB.toFixed(0)} MB (${res.savedSpaceGB.toFixed(2)} GB).`,
        benchmarkText: 'El códec HEVC/H.265 y AV1 suelen lograr entre un 40% y 60% de reducción frente a H.264 sin pérdida perceptible de calidad visual.',
        benchmarkStatus: res.reductionPercent >= 50 ? 'optimal' : 'average',
        recommendations: [
          'Utiliza programas como HandBrake o FFmpeg con el preset CRF 20-22 (Constant Rate Factor) para obtener la máxima compresión con nitidez impecable.',
        ],
        breakdownData: [
          { name: 'Tamaño Final', value: comp },
          { name: 'Espacio Ahorrado', value: Math.round(res.savedSpaceMB) },
        ],
        rawOutput: res,
      };
    },
    seo: {
      title: 'Calculadora de Compresión de Video | Reducción de Tamaño y Espacio Ahorrado',
      metaDescription: 'Calcula el porcentaje de reducción de tamaño y los GB ahorrados tras comprimir tus videos con Handbrake, H.264, H.265 o AV1.',
      h1: 'Calculadora de Compresión de Video',
      keywords: ['calculadora compresion video', 'reduccion tamano video porcentaje', 'ahorro espacio video', 'comprimir video youtube'],
      summary: 'Mide la eficiencia de compresión y el espacio de disco ahorrado entre el archivo original y la versión optimizada.',
      formulaMarkdown: '`Reducción (%) = ((Tamaño Original - Tamaño Final) / Tamaño Original) × 100`',
      howToSteps: ['Introduce el peso en MB del archivo original.', 'Introduce el peso del archivo comprimido.', 'Consulta el porcentaje de reducción y los GB ahorrados.'],
      tipsToImprove: ['El códec AV1 ofrece la mayor tasa de compresión del mercado, soportado de forma nativa por YouTube y navegadores modernos.'],
      faqs: [
        {
          question: '¿Comprimir un video reduce su calidad en YouTube?',
          answer: 'Si utilizas códecs modernos con un bitrate adecuado (CRF 18-22), la compresión es visualmente imperceptible para el ojo humano y acelera drásticamente el tiempo de subida a YouTube Studio.',
        },
      ],
    },
    relatedSlugs: ['calculadora-tamano-video', 'calculadora-bitrate', 'calculadora-almacenamiento-video'],
  },
];
