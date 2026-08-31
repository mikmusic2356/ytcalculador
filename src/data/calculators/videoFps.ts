import { CalculatorConfig } from '../../types';
import {
  calculateDurationFromFrames,
  convertFpsMetrics,
  parseTimecodeToSeconds,
  secondsToTimecode,
} from '../../utils/mathFormulas';

export const VIDEO_FPS_CALCULATORS: CalculatorConfig[] = [
  // 17. Calculadora de Duración según Frames
  {
    id: 'duration-from-frames',
    slug: 'calculadora-duracion-frames',
    name: 'Calculadora de Duración según Fotogramas (Frames)',
    tagline: 'Calcula el Tiempo Exacto en Segundos y Código de Tiempo a partir de los Frames',
    shortDescription: 'Calcula cuántos segundos, minutos y código de tiempo (HH:MM:SS:FF) representa una cantidad dada de fotogramas a una tasa de FPS determinada.',
    category: 'video',
    subcategory: 'fps_tiempo',
    iconName: 'Clock',
    popularRank: 26,
    badge: 'Edición',
    fields: [
      {
        id: 'framesCount',
        label: 'Número Total de Fotogramas (Frames)',
        type: 'number',
        defaultValue: 3600,
        min: 1,
        max: 10000000,
        step: 1,
        placeholder: 'Ej. 3600',
      },
      {
        id: 'fpsRate',
        label: 'Velocidad de Cuadro (FPS)',
        type: 'select',
        defaultValue: '30',
        options: [
          { label: '24 FPS (Cine)', value: '24' },
          { label: '25 FPS (PAL Europa)', value: '25' },
          { label: '29.97 FPS (NTSC TV)', value: '29.97' },
          { label: '30 FPS (Estándar Web)', value: '30' },
          { label: '50 FPS (PAL Alta)', value: '50' },
          { label: '60 FPS (YouTube 60fps)', value: '60' },
          { label: '120 FPS (Cámara lenta)', value: '120' },
        ],
      },
    ],
    presets: [
      { label: '3.600 frames @ 30 FPS (2 Minutos)', values: { framesCount: 3600, fpsRate: '30' } },
      { label: '18.000 frames @ 60 FPS (5 Minutos)', values: { framesCount: 18000, fpsRate: '60' } },
      { label: '1.440 frames @ 24 FPS (1 Minuto Cine)', values: { framesCount: 1440, fpsRate: '24' } },
    ],
    calculate: (inputs) => {
      const frames = Number(inputs.framesCount) || 3600;
      const fps = Number(inputs.fpsRate) || 30;

      const res = calculateDurationFromFrames(frames, fps);

      return {
        primaryValue: res.timecode,
        primaryLabel: 'Código de Tiempo (HH:MM:SS:FF)',
        secondaryMetrics: [
          { label: 'Duración en Segundos', value: `${res.seconds.toFixed(2)} s`, highlight: true },
          { label: 'Duración en Minutos', value: `${res.minutes.toFixed(2)} min` },
          { label: 'Frames Totales', value: frames.toLocaleString() },
          { label: 'FPS Utilizados', value: `${fps} fps` },
        ],
        formulaExplanation: `Fórmula: Duración = Total de Frames ÷ FPS\n• ${frames.toLocaleString()} frames ÷ ${fps} FPS = ${res.seconds.toFixed(2)} segundos (${res.minutes.toFixed(2)} minutos)\n• Timecode SMPTE = ${res.timecode}`,
        benchmarkStatus: 'optimal',
        recommendations: [
          'En animación y efectos visuales (VFX), esta conversión es fundamental para sincronizar secuencias de renders 3D con la pista de audio.',
        ],
        breakdownData: [
          { name: 'Segundos', value: Number(res.seconds.toFixed(1)) },
          { name: 'Minutos', value: Number(res.minutes.toFixed(2)) },
        ],
        rawOutput: res,
      };
    },
    seo: {
      title: 'Calculadora de Duración según Frames | Convertir Fotogramas a Tiempo',
      metaDescription: 'Calcula la duración en segundos, minutos y código de tiempo HH:MM:SS a partir del número de fotogramas y la tasa de FPS.',
      h1: 'Calculadora de Duración según Frames',
      keywords: ['duracion segun frames', 'convertir frames a segundos', 'calcular tiempo fotogramas', 'timecode frames 30fps 60fps'],
      summary: 'Conversor de fotogramas a tiempo de metraje para editores y animadores de video.',
      formulaMarkdown: '`Segundos = Frames / FPS | Minutos = Frames / (FPS × 60)`',
      howToSteps: ['Introduce el total de fotogramas.', 'Selecciona los FPS del proyecto.', 'Obtén la duración y el timecode exacto.'],
      tipsToImprove: ['A 60 FPS, cada segundo contiene el doble de fotogramas que a 30 FPS, permitiendo animaciones dos veces más fluidas.'],
      faqs: [
        {
          question: '¿Cuánto duran 3.600 frames a 30 FPS?',
          answer: '3.600 frames a 30 FPS duran exactamente 120 segundos (2 minutos, timecode 00:02:00:00).',
        },
      ],
    },
    relatedSlugs: ['conversor-fps', 'conversor-timecode', 'calculadora-fps-video'],
  },

  // 18. Conversor de FPS
  {
    id: 'fps-converter',
    slug: 'conversor-fps',
    name: 'Conversor y Analizador de FPS (Frame Rates)',
    tagline: 'Compara Milisegundos por Frame, Cuadros por Minuto y Estándares de Cine y Video',
    shortDescription: 'Calcula la duración en milisegundos de un frame individual, la cadencia por minuto/hora y analiza las diferencias entre 24, 30, 60 y 120 FPS.',
    category: 'video',
    subcategory: 'fps_tiempo',
    iconName: 'Activity',
    popularRank: 27,
    badge: 'Técnico',
    fields: [
      {
        id: 'fps',
        label: 'Tasa de Fotogramas (FPS)',
        type: 'number',
        defaultValue: 60,
        min: 1,
        max: 1000,
        step: 1,
        placeholder: 'Ej. 60 (o 24, 30, 120, etc.)',
      },
    ],
    presets: [
      { label: '24 FPS - Cine Tradicional (41.67 ms/frame)', values: { fps: 24 } },
      { label: '30 FPS - Video Estándar / TV (33.33 ms/frame)', values: { fps: 30 } },
      { label: '60 FPS - Alta Fluidez / Gaming (16.67 ms/frame)', values: { fps: 60 } },
      { label: '120 FPS - Cámara Lenta Suave (8.33 ms/frame)', values: { fps: 120 } },
    ],
    calculate: (inputs) => {
      const fps = Number(inputs.fps) || 60;
      const res = convertFpsMetrics(fps);

      let standardDesc = 'Tasa Personalizada';
      if (fps === 24) standardDesc = 'Estándar Cinematográfico (Look de Cine)';
      else if (fps === 25) standardDesc = 'Estándar PAL (Europa, TV y Broadcast)';
      else if (fps === 30 || Math.abs(fps - 29.97) < 0.1) standardDesc = 'Estándar NTSC / YouTube Estándar';
      else if (fps === 50) standardDesc = 'Alta Frecuencia PAL';
      else if (fps === 60) standardDesc = 'Alta Fluidez para YouTube y Gaming';
      else if (fps === 120) standardDesc = 'Cámara Lenta 5x (al reproducir a 24fps)';

      return {
        primaryValue: `${res.frameDurationMs.toFixed(2)} ms`,
        primaryLabel: 'Duración de 1 Fotograma en Pantalla',
        secondaryMetrics: [
          { label: 'Perfil / Estándar', value: standardDesc, highlight: true },
          { label: 'Fotogramas por Minuto', value: `${res.framesPerMinute.toLocaleString()} frames` },
          { label: 'Fotogramas por Hora', value: `${res.framesPerHour.toLocaleString()} frames` },
          { label: 'Frecuencia (Hz)', value: `${fps} Hz` },
        ],
        formulaExplanation: `Métricas de Frecuencia de Cuadro:\n• Duración por frame = 1.000 ms ÷ ${fps} FPS = ${res.frameDurationMs.toFixed(3)} milisegundos\n• Frames por Minuto = ${fps} × 60s = ${res.framesPerMinute.toLocaleString()} frames\n• Frames por Hora = ${fps} × 3.600s = ${res.framesPerHour.toLocaleString()} frames.`,
        benchmarkText: 'A 60 FPS el tiempo de exposición por cuadro es de solo 16.6 ms, reduciendo notablemente el desenfoque de movimiento (motion blur).',
        benchmarkStatus: 'optimal',
        recommendations: [
          'Aplica la regla de obturación de 180 grados: graba con una velocidad de obturación igual al doble de tus FPS (ej. 1/50s para 24fps, 1/120s para 60fps) para un desenfoque de movimiento natural.',
        ],
        breakdownData: [
          { name: '24 FPS (ms)', value: 41.67 },
          { name: '30 FPS (ms)', value: 33.33 },
          { name: '60 FPS (ms)', value: 16.67 },
          { name: '120 FPS (ms)', value: 8.33 },
        ],
        rawOutput: { ...res, fps },
      };
    },
    seo: {
      title: 'Conversor y Analizador de FPS | Milisegundos por Frame y Comparativa',
      metaDescription: 'Calcula la duración en milisegundos por frame para cualquier tasa de FPS (24, 25, 30, 60, 120) y compara estándares de cine y video.',
      h1: 'Conversor y Analizador de FPS',
      keywords: ['conversor fps ms', 'duracion frame milisegundos', 'comparar 24fps 30fps 60fps', 'cuantos fotogramas por segundo'],
      summary: 'Herramienta técnica para calcular la cadencia temporal y la duración de exposición de fotogramas.',
      formulaMarkdown: '`Duración Frame (ms) = 1.000 / FPS`',
      howToSteps: ['Introduce la tasa de fotogramas por segundo (FPS).', 'Consulta la duración de cada cuadro en milisegundos y la cadencia horaria.'],
      tipsToImprove: ['Utiliza la regla del obturador de 180° (shutter speed = 1 / (2 * FPS)) para conseguir desenfoque cinemático orgánico.'],
      faqs: [
        {
          question: '¿Cuántos milisegundos dura un frame a 60 FPS?',
          answer: 'A 60 FPS, cada fotograma dura exactamente 1000 / 60 = 16.67 milisegundos en pantalla.',
        },
      ],
    },
    relatedSlugs: ['calculadora-duracion-frames', 'conversor-timecode', 'calculadora-fps-video'],
  },

  // 19. Conversor de Tiempo para Edición (Timecode SMPTE)
  {
    id: 'timecode-converter',
    slug: 'conversor-timecode',
    name: 'Conversor de Tiempo para Edición (Timecode SMPTE)',
    tagline: 'Convierte Códigos de Tiempo HH:MM:SS:FF a Segundos, Minutos y Frames',
    shortDescription: 'Convierte bidireccionalmente entre código de tiempo SMPTE de edición (Premiere, DaVinci, Final Cut), segundos decimales y frames totales según los FPS.',
    category: 'video',
    subcategory: 'fps_tiempo',
    iconName: 'Tv',
    popularRank: 28,
    badge: 'Pro Edit',
    fields: [
      {
        id: 'timecodeString',
        label: 'Código de Tiempo (HH:MM:SS:FF o Segundos)',
        type: 'select',
        defaultValue: '00:01:30:15',
        options: [
          { label: '00:01:30:15 (1 min 30 seg 15 frames)', value: '00:01:30:15' },
          { label: '00:00:45:00 (45 segundos exactos)', value: '00:00:45:00' },
          { label: '00:10:00:00 (10 minutos exactos)', value: '00:10:00:00' },
          { label: '01:00:00:00 (1 hora exacta)', value: '01:00:00:00' },
          { label: '00:05:22:12 (5 min 22 seg 12 frames)', value: '00:05:22:12' },
        ],
      },
      {
        id: 'fpsRate',
        label: 'Tasa de Fotogramas del Proyecto (FPS)',
        type: 'select',
        defaultValue: '30',
        options: [
          { label: '24 FPS (Cine)', value: '24' },
          { label: '25 FPS (PAL)', value: '25' },
          { label: '29.97 FPS (NTSC Drop-Frame)', value: '29.97' },
          { label: '30 FPS (Web Estándar)', value: '30' },
          { label: '50 FPS (PAL 50)', value: '50' },
          { label: '60 FPS (Alta Fluidez)', value: '60' },
        ],
      },
    ],
    presets: [
      { label: '00:01:30:15 @ 30 FPS -> 90.5 segundos', values: { timecodeString: '00:01:30:15', fpsRate: '30' } },
      { label: '00:05:00:00 @ 60 FPS -> 18.000 frames', values: { timecodeString: '00:05:00:00', fpsRate: '60' } },
      { label: '00:10:00:00 @ 24 FPS -> 14.400 frames', values: { timecodeString: '00:10:00:00', fpsRate: '24' } },
    ],
    calculate: (inputs) => {
      const tc = String(inputs.timecodeString || '00:01:30:15');
      const fps = Number(inputs.fpsRate) || 30;

      const totalSeconds = parseTimecodeToSeconds(tc, fps);
      const totalFrames = Math.round(totalSeconds * fps);
      const totalMinutes = totalSeconds / 60;
      const formattedTc = secondsToTimecode(totalSeconds, fps);

      return {
        primaryValue: `${totalSeconds.toFixed(2)} segundos`,
        primaryLabel: `Tiempo Decimal (@ ${fps} FPS)`,
        secondaryMetrics: [
          { label: 'Código SMPTE Normalizado', value: formattedTc, highlight: true },
          { label: 'Fotogramas Totales', value: `${totalFrames.toLocaleString()} frames` },
          { label: 'Minutos Decimales', value: `${totalMinutes.toFixed(3)} min` },
          { label: 'FPS Seleccionados', value: `${fps} fps` },
        ],
        formulaExplanation: `Conversión SMPTE Timecode (${tc} @ ${fps}fps):\n• Desglose: Horas × 3600 + Minutos × 60 + Segundos + (Frames ÷ ${fps})\n• Segundos Totales = ${totalSeconds.toFixed(3)} s\n• Frames Totales = ${totalSeconds.toFixed(3)}s × ${fps} = ${totalFrames.toLocaleString()} frames\n• Timecode Formateado = ${formattedTc}`,
        benchmarkText: 'El formato SMPTE es el estándar universal en Premiere Pro, DaVinci Resolve, Final Cut Pro y Avid Media Composer.',
        benchmarkStatus: 'optimal',
        recommendations: [
          'Asegúrate de que la tasa de FPS de tu secuencia de edición coincida exactamente con la tasa de exportación para evitar desfases de audio (audio drift).',
        ],
        breakdownData: [
          { name: 'Segundos', value: Number(totalSeconds.toFixed(1)) },
          { name: 'Minutos', value: Number(totalMinutes.toFixed(2)) },
        ],
        rawOutput: { totalSeconds, totalFrames, totalMinutes, timecode: formattedTc, fps },
      };
    },
    seo: {
      title: 'Conversor de Timecode para Edición | SMPTE a Segundos y Frames',
      metaDescription: 'Convierte código de tiempo SMPTE (HH:MM:SS:FF) a segundos, minutos y frames totales para Premiere Pro, DaVinci Resolve y Final Cut.',
      h1: 'Conversor de Timecode para Edición de Video',
      keywords: ['conversor timecode smpte', 'convertir timecode a segundos', 'timecode a frames davinci premiere', 'calcular timecode fps'],
      summary: 'Conversor bidireccional de código de tiempo profesional para flujos de trabajo de edición y postproducción.',
      formulaMarkdown: '`Segundos = Horas × 3600 + Minutos × 60 + Segundos + (Frames / FPS)`',
      howToSteps: ['Introduce el código de tiempo (HH:MM:SS:FF).', 'Selecciona los FPS del proyecto.', 'Obtén los segundos y frames exactos.'],
      tipsToImprove: ['En proyectos NTSC a 29.97 FPS, recuerda considerar el modo drop-frame si necesitas coincidencia exacta con el reloj de pared.'],
      faqs: [
        {
          question: '¿A cuántos segundos equivale el timecode 00:01:30:15 a 30 FPS?',
          answer: 'Equivale exactamente a 1 minuto y 30.5 segundos (90,5 segundos = 2.715 frames totales).',
        },
      ],
    },
    relatedSlugs: ['calculadora-duracion-frames', 'conversor-fps', 'calculadora-duracion-video'],
  },
];
