import { CalculatorConfig } from '../../types';
import {
  calculateStorageNeeded,
  calculateRecordingTime,
  calculateBatchStorage,
  calculateVideoBitrateSize,
} from '../../utils/mathFormulas';

export const VIDEO_STORAGE_CALCULATORS: CalculatorConfig[] = [
  // 13. Calculadora de Espacio Necesario
  {
    id: 'storage-needed',
    slug: 'calculadora-espacio-necesario',
    name: 'Calculadora de Espacio Necesario para Almacenamiento',
    tagline: 'Calcula los Gigabytes o Terabytes Necesarios para Almacenar tu Catálogo de Videos',
    shortDescription: 'Calcula el almacenamiento total requerido en tu disco duro o SSD según la cantidad de videos, su duración media y el bitrate de grabación.',
    category: 'video',
    subcategory: 'almacenamiento',
    iconName: 'HardDrive',
    popularRank: 15,
    badge: 'Capacidad',
    fields: [
      {
        id: 'videoCount',
        label: 'Cantidad de Videos',
        type: 'number',
        defaultValue: 50,
        min: 1,
        max: 10000,
        step: 5,
        placeholder: 'Ej. 50',
      },
      {
        id: 'durationMinutes',
        label: 'Duración Promedio por Video (Minutos)',
        type: 'number',
        defaultValue: 15,
        min: 1,
        max: 600,
        step: 1,
        placeholder: 'Ej. 15',
      },
      {
        id: 'bitrateMbps',
        label: 'Bitrate Promedio (Mbps)',
        type: 'number',
        defaultValue: 20,
        min: 1,
        max: 500,
        step: 1,
        placeholder: 'Ej. 20 (Grabación 1080p/4K)',
      },
    ],
    presets: [
      { label: '10 Videos de 15 min @ 20 Mbps (~22 GB)', values: { videoCount: 10, durationMinutes: 15, bitrateMbps: 20 } },
      { label: '50 Videos de 15 min @ 20 Mbps (~110 GB)', values: { videoCount: 50, durationMinutes: 15, bitrateMbps: 20 } },
      { label: '100 Videos de 20 min @ 35 Mbps (~512 GB / 0.5 TB)', values: { videoCount: 100, durationMinutes: 20, bitrateMbps: 35 } },
      { label: '250 Videos de 30 min 4K @ 60 Mbps (~3.3 TB)', values: { videoCount: 250, durationMinutes: 30, bitrateMbps: 60 } },
    ],
    calculate: (inputs) => {
      const count = Number(inputs.videoCount) || 50;
      const duration = Number(inputs.durationMinutes) || 15;
      const bitrate = Number(inputs.bitrateMbps) || 20;

      const res = calculateStorageNeeded(count, duration, bitrate);

      const displayPrimary =
        res.totalSizeTB >= 1
          ? `${res.totalSizeTB.toFixed(2)} TB`
          : `${res.totalSizeGB.toFixed(1)} GB`;

      return {
        primaryValue: displayPrimary,
        primaryLabel: `Almacenamiento Total para ${count} Videos`,
        secondaryMetrics: [
          { label: 'Tamaño por Video Individual', value: `${res.sizePerVideoGB.toFixed(2)} GB`, highlight: true },
          { label: 'Disco SSD Recomendado (+15%)', value: `${res.recommendedStorageGB.toFixed(1)} GB`, isPositive: true },
          { label: 'Equivalente en TeraBytes', value: `${res.totalSizeTB.toFixed(3)} TB` },
          { label: 'Duración Total Acumulada', value: `${((count * duration) / 60).toFixed(1)} horas` },
        ],
        formulaExplanation: `Cálculo de Almacenamiento:\n• Tamaño por video = (${duration} min × 60s × ${bitrate} Mbps) ÷ 8 ÷ 1.024 = ${res.sizePerVideoGB.toFixed(2)} GB\n• Almacenamiento Total = ${res.sizePerVideoGB.toFixed(2)} GB × ${count} videos = ${res.totalSizeGB.toFixed(2)} GB (${res.totalSizeTB.toFixed(3)} TB)\n• Capacidad de disco sugerida con 15% de margen: ${res.recommendedStorageGB.toFixed(1)} GB.`,
        benchmarkText: 'Recomendamos mantener los discos duros y SSD con al menos un 15-20% de espacio libre para no degradar su velocidad de lectura/escritura.',
        benchmarkStatus: 'optimal',
        recommendations: [
          'Para creadores activos con más de 50 videos al año, un disco externo SSD NVMe de 2 TB o un sistema NAS RAID ofrece la mayor velocidad y seguridad.',
        ],
        breakdownData: [
          { name: '10 Videos (GB)', value: Number((res.sizePerVideoGB * 10).toFixed(1)) },
          { name: '50 Videos (GB)', value: Number((res.sizePerVideoGB * 50).toFixed(1)) },
          { name: '100 Videos (GB)', value: Number((res.sizePerVideoGB * 100).toFixed(1)) },
        ],
        rawOutput: res,
      };
    },
    seo: {
      title: 'Calculadora de Espacio Necesario para Almacenar Videos | GB y TB',
      metaDescription: 'Calcula el espacio de disco SSD necesario para guardar tus grabaciones de video según la cantidad, duración y tasa de bits.',
      h1: 'Calculadora de Espacio Necesario para Almacenamiento',
      keywords: ['calculadora espacio almacenamiento video', 'cuanto disco necesito videos', 'calcular terabytes videos', 'peso catalogo videos youtube'],
      summary: 'Estima la capacidad de almacenamiento necesaria para proyectos audiovisuales y bibliotecas de contenido.',
      formulaMarkdown: '`Espacio Total = (Duración × Segundos × Bitrate / 8) × Cantidad de Videos`',
      howToSteps: ['Introduce el número de videos.', 'Indica la duración media.', 'Especifica el bitrate y obtén los GB y TB necesarios.'],
      tipsToImprove: ['Archiva proyectos antiguos en discos duros HDD tradicionales y utiliza SSDs rápidos solo para edición activa.'],
      faqs: [
        {
          question: '¿Cuánto ocupan 50 videos de 15 minutos en 1080p?',
          answer: 'Con un bitrate promedio de 20 Mbps, 50 videos de 15 minutos ocupan aproximadamente 110 GB de almacenamiento.',
        },
      ],
    },
    relatedSlugs: ['calculadora-tiempo-grabacion', 'calculadora-almacenamiento-video', 'calculadora-tamano-video'],
  },

  // 14. Calculadora de Tiempo de Grabación
  {
    id: 'recording-time',
    slug: 'calculadora-tiempo-grabacion',
    name: 'Calculadora de Tiempo de Grabación',
    tagline: 'Calcula Cuánto Tiempo Puedes Grabar según el Espacio Disponible en tu Tarjeta SD o Disco',
    shortDescription: 'Descubre cuántas horas y minutos de metraje continuo puedes registrar en tu tarjeta de memoria o SSD en función del bitrate de tu cámara.',
    category: 'video',
    subcategory: 'almacenamiento',
    iconName: 'Video',
    popularRank: 19,
    badge: 'Cámara & SD',
    fields: [
      {
        id: 'availableStorageGB',
        label: 'Espacio Libre en Tarjeta / Disco (GB)',
        type: 'number',
        defaultValue: 128,
        min: 1,
        max: 32768,
        step: 8,
        placeholder: 'Ej. 128 (Tarjeta SD de 128 GB)',
      },
      {
        id: 'bitrateMbps',
        label: 'Bitrate de Grabación de la Cámara (Mbps)',
        type: 'number',
        defaultValue: 50,
        min: 1,
        max: 2000,
        step: 5,
        placeholder: 'Ej. 50 (Sony 4K / Canon 1080p)',
      },
    ],
    presets: [
      { label: 'Tarjeta SD 64 GB @ 50 Mbps 4K (~2.8 Horas)', values: { availableStorageGB: 64, bitrateMbps: 50 } },
      { label: 'Tarjeta SD 128 GB @ 100 Mbps 4K (~2.8 Horas)', values: { availableStorageGB: 128, bitrateMbps: 100 } },
      { label: 'Tarjeta SD 256 GB @ 50 Mbps (~11.6 Horas)', values: { availableStorageGB: 256, bitrateMbps: 50 } },
      { label: 'SSD 1 TB (1000 GB) @ 150 Mbps ProRes (~15 Horas)', values: { availableStorageGB: 1000, bitrateMbps: 150 } },
    ],
    calculate: (inputs) => {
      const storageGB = Number(inputs.availableStorageGB) || 128;
      const bitrate = Number(inputs.bitrateMbps) || 50;

      const res = calculateRecordingTime(storageGB, bitrate);

      return {
        primaryValue: res.formattedTime,
        primaryLabel: 'Tiempo Estimado de Grabación Posible',
        secondaryMetrics: [
          { label: 'Horas Totales', value: `${res.totalHours.toFixed(2)} h`, highlight: true },
          { label: 'Minutos Totales', value: `${Math.round(res.totalMinutes).toLocaleString()} min` },
          { label: 'Segundos Totales', value: `${Math.round(res.totalSeconds).toLocaleString()} s` },
          { label: 'Tasa de Consumo de Disco', value: `${((bitrate / 8) * 60 / 1024).toFixed(2)} GB/min` },
        ],
        formulaExplanation: `Fórmula de Tiempo de Grabación:\n• Capacidad disponible en bits = ${storageGB} GB × 1.024³ × 8 = ${Math.round(storageGB * 1024 * 1024 * 1024 * 8).toLocaleString()} bits\n• Bitrate de grabación = ${bitrate} Mbps (${bitrate * 1000 * 1000} bps)\n• Tiempo = bits ÷ bps = ${Math.round(res.totalSeconds).toLocaleString()} segundos = ${res.totalHours.toFixed(2)} horas (${res.formattedTime}).`,
        benchmarkText: 'Advertencia: El almacenamiento real formateado en tarjetas SD y discos suele ser un 7-10% menor que la capacidad nominal de la etiqueta.',
        benchmarkStatus: 'optimal',
        recommendations: [
          'Lleva siempre tarjetas SD de repuesto y formatea la tarjeta directamente dentro de la cámara antes de empezar a grabar.',
        ],
        breakdownData: [
          { name: 'Horas de Grabación', value: Number(res.totalHours.toFixed(1)) },
          { name: 'Minutos (÷10)', value: Number((res.totalMinutes / 10).toFixed(1)) },
        ],
        rawOutput: res,
      };
    },
    seo: {
      title: 'Calculadora de Tiempo de Grabación | Cuánto Cabe en Tarjeta SD y SSD',
      metaDescription: 'Calcula cuántas horas y minutos puedes grabar con tu cámara según la capacidad en GB de tu tarjeta de memoria y el bitrate de video.',
      h1: 'Calculadora de Tiempo de Grabación',
      keywords: ['calculadora tiempo grabacion camara', 'cuanto cabe tarjeta sd 128gb', 'horas grabacion 4k sd', 'bitrate camara tiempo'],
      summary: 'Calcula la duración máxima de grabación continua que permite cualquier soporte de almacenamiento.',
      formulaMarkdown: '`Tiempo (s) = (Espacio GB × 1024³ × 8) / (Bitrate Mbps × 1.000.000)`',
      howToSteps: ['Introduce el espacio en GB de tu tarjeta.', 'Indica el bitrate de grabación en Mbps.', 'Descubre las horas y minutos exactos disponibles.'],
      tipsToImprove: ['Para grabar en 4K a 100 Mbps o más, asegúrate de que tu tarjeta tenga certificación V30 o V60 (UHS-II).'],
      faqs: [
        {
          question: '¿Cuántas horas de video 4K caben en una tarjeta SD de 128 GB?',
          answer: 'A un bitrate estándar de 100 Mbps (como en cámaras Sony Alpha), caben aproximadamente 2 horas y 50 minutos de metraje continuo.',
        },
      ],
    },
    relatedSlugs: ['calculadora-espacio-necesario', 'calculadora-almacenamiento-video', 'calculadora-bitrate'],
  },

  // 15. Calculadora de Almacenamiento para Videos / Grabación
  {
    id: 'batch-storage',
    slug: 'calculadora-almacenamiento-video',
    name: 'Calculadora de Almacenamiento para Grabación y Lotes',
    tagline: 'Desglose de Espacio por Video Individual, 10, 50 y 100 Grabaciones',
    shortDescription: 'Calcula el consumo de almacenamiento por toma individual y proyecta el volumen total para lotes de 10, 50 y 100 sesiones de rodaje.',
    category: 'video',
    subcategory: 'almacenamiento',
    iconName: 'Server',
    popularRank: 20,
    fields: [
      {
        id: 'durationMinutes',
        label: 'Duración de Cada Grabación (Minutos)',
        type: 'number',
        defaultValue: 20,
        min: 1,
        max: 600,
        step: 1,
        placeholder: 'Ej. 20',
      },
      {
        id: 'bitrateMbps',
        label: 'Bitrate de Grabación (Mbps)',
        type: 'number',
        defaultValue: 25,
        min: 1,
        max: 500,
        step: 5,
        placeholder: 'Ej. 25',
      },
      {
        id: 'batchCount',
        label: 'Cantidad Personalizada de Grabaciones',
        type: 'number',
        defaultValue: 24,
        min: 1,
        max: 1000,
        step: 1,
        placeholder: 'Ej. 24',
      },
    ],
    presets: [
      { label: '20 min @ 25 Mbps (3.66 GB por video)', values: { durationMinutes: 20, bitrateMbps: 25, batchCount: 24 } },
      { label: '45 min @ 40 Mbps 4K (13.2 GB por video)', values: { durationMinutes: 45, bitrateMbps: 40, batchCount: 10 } },
      { label: '10 min @ 15 Mbps Vlogs (1.1 GB por video)', values: { durationMinutes: 10, bitrateMbps: 15, batchCount: 50 } },
    ],
    calculate: (inputs) => {
      const duration = Number(inputs.durationMinutes) || 20;
      const bitrate = Number(inputs.bitrateMbps) || 25;
      const batchCount = Number(inputs.batchCount) || 24;

      const res = calculateBatchStorage(duration, bitrate, batchCount);

      return {
        primaryValue: `${res.batchTotalGB.toFixed(1)} GB`,
        primaryLabel: `Espacio Total para ${batchCount} Grabaciones`,
        secondaryMetrics: [
          { label: 'Video Individual', value: `${res.singleVideoGB.toFixed(2)} GB`, highlight: true },
          { label: '10 Grabaciones', value: `${res.tenVideosGB.toFixed(1)} GB` },
          { label: '50 Grabaciones', value: `${res.fiftyVideosGB.toFixed(1)} GB` },
          { label: '100 Grabaciones', value: `${res.hundredVideosGB.toFixed(1)} GB (${(res.hundredVideosGB / 1024).toFixed(2)} TB)` },
        ],
        formulaExplanation: `Cálculo por Lotes:\n• Tamaño por video = (${duration} min × 60s × ${bitrate} Mbps) ÷ 8 ÷ 1.024 = ${res.singleVideoGB.toFixed(2)} GB\n• Total para ${batchCount} grabaciones = ${res.singleVideoGB.toFixed(2)} GB × ${batchCount} = ${res.batchTotalGB.toFixed(2)} GB.`,
        benchmarkStatus: 'optimal',
        recommendations: [
          'Aplica la regla de copia de seguridad 3-2-1: 3 copias de tu material, en 2 soportes distintos y 1 copia fuera del estudio (nube o disco externo).',
        ],
        breakdownData: [
          { name: '1 Video', value: Number(res.singleVideoGB.toFixed(1)) },
          { name: '10 Videos', value: Number(res.tenVideosGB.toFixed(1)) },
          { name: '50 Videos', value: Number(res.fiftyVideosGB.toFixed(1)) },
          { name: '100 Videos', value: Number(res.hundredVideosGB.toFixed(1)) },
        ],
        rawOutput: res,
      };
    },
    seo: {
      title: 'Calculadora de Almacenamiento para Videos y Grabaciones por Lotes',
      metaDescription: 'Calcula el peso por video y el almacenamiento acumulado para 10, 50 y 100 sesiones de grabación según duración y bitrate.',
      h1: 'Calculadora de Almacenamiento para Grabaciones',
      keywords: ['calculadora almacenamiento grabacion', 'peso por video gb', 'espacio 10 50 100 videos', 'calcular gb necesarios grabar'],
      summary: 'Proyección detallada de almacenamiento para producciones continuas y planes de archivo a largo plazo.',
      formulaMarkdown: '`Tamaño Lote = ((Duración × 60 × Bitrate) / 8 / 1024) × Cantidad`',
      howToSteps: ['Introduce la duración por sesión.', 'Ajusta el bitrate.', 'Consulta el desglose para 10, 50 y 100 grabaciones.'],
      tipsToImprove: ['Elimina clips descartados (b-roll fallido, tomas falsas) antes de archivar para ahorrar hasta un 40% de espacio.'],
      faqs: [
        {
          question: '¿Cuánto almacenamiento necesito para grabar 1 video semanal durante un año?',
          answer: 'Para 52 videos de 20 minutos a 25 Mbps necesitarás aproximadamente 190 GB al año de material en bruto.',
        },
      ],
    },
    relatedSlugs: ['calculadora-espacio-necesario', 'calculadora-tiempo-grabacion', 'calculadora-tamano-por-bitrate'],
  },

  // 16. Calculadora de Tamaño de Archivo por Bitrate (Presets Rápidos)
  {
    id: 'bitrate-quick-size',
    slug: 'calculadora-tamano-por-bitrate',
    name: 'Calculadora de Tamaño de Archivo por Bitrate (Presets Rápidos)',
    tagline: 'Compara el Peso de tu Video con Diferentes Tasas de Bits (64 Kbps a 100 Mbps)',
    shortDescription: 'Introduce la duración y selecciona rápidamente entre los bitrates más habituales de la industria para conocer el peso estimado.',
    category: 'video',
    subcategory: 'almacenamiento',
    iconName: 'Zap',
    popularRank: 25,
    fields: [
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
        id: 'selectedBitrate',
        label: 'Tasa de Bits (Preset Rápido)',
        type: 'select',
        defaultValue: '8000',
        options: [
          { label: '64 Kbps (Audio Voz)', value: '64' },
          { label: '128 Kbps (Audio MP3 Estándar)', value: '128' },
          { label: '256 Kbps (Audio Alta Fidelidad)', value: '256' },
          { label: '1 Mbps (Video 480p SD)', value: '1000' },
          { label: '5 Mbps (Video 720p HD)', value: '5000' },
          { label: '8 Mbps (Video 1080p Estándar)', value: '8000' },
          { label: '10 Mbps (Video 1080p Alta Calidad)', value: '10000' },
          { label: '20 Mbps (Video 2K 1440p)', value: '20000' },
          { label: '50 Mbps (Video 4K UHD)', value: '50000' },
          { label: '100 Mbps (Video 4K Alta Tasa / ProRes)', value: '100000' },
        ],
      },
    ],
    presets: [
      { label: '10 minutos @ 8 Mbps 1080p (600 MB)', values: { durationMinutes: 10, selectedBitrate: '8000' } },
      { label: '10 minutos @ 50 Mbps 4K (3.75 GB)', values: { durationMinutes: 10, selectedBitrate: '50000' } },
      { label: '60 minutos @ 1 Mbps Podcast (450 MB)', values: { durationMinutes: 60, selectedBitrate: '1000' } },
    ],
    calculate: (inputs) => {
      const minutes = Number(inputs.durationMinutes) || 10;
      const bitrateKbps = Number(inputs.selectedBitrate) || 8000;
      const bitrateMbps = bitrateKbps / 1000;

      const res = calculateVideoBitrateSize(minutes, bitrateKbps, 0);

      const displaySize =
        res.sizeGB >= 1
          ? `${res.sizeGB.toFixed(2)} GB`
          : `${res.sizeMB.toFixed(0)} MB`;

      return {
        primaryValue: displaySize,
        primaryLabel: `Tamaño Estimado @ ${bitrateMbps >= 1 ? `${bitrateMbps} Mbps` : `${bitrateKbps} Kbps`}`,
        secondaryMetrics: [
          { label: 'Tasa de Bits Seleccionada', value: bitrateMbps >= 1 ? `${bitrateMbps} Mbps` : `${bitrateKbps} Kbps`, highlight: true },
          { label: 'MegaBytes Totales', value: `${res.sizeMB.toFixed(1)} MB` },
          { label: 'GigaBytes Totales', value: `${res.sizeGB.toFixed(3)} GB` },
          { label: 'Duración en Segundos', value: `${res.durationSeconds} s` },
        ],
        formulaExplanation: `Fórmula Rápida: (${bitrateKbps} Kbps × 1.000 × ${res.durationSeconds}s) ÷ 8 ÷ 1.048.576 = ${res.sizeMB.toFixed(1)} MB (${res.sizeGB.toFixed(3)} GB).`,
        benchmarkText: 'El resultado es una estimación basada en CBR. El tamaño real puede variar según la codificación, complejidad visual y configuración del archivo.',
        benchmarkStatus: 'info',
        recommendations: [
          'Compara los presets de 8 Mbps (1080p) vs 50 Mbps (4K) para planificar el tiempo de subida a YouTube.',
        ],
        breakdownData: [
          { name: '1 Mbps (MB)', value: Number(((minutes * 60 * 1000) / 8 / 1024).toFixed(0)) },
          { name: '8 Mbps (MB)', value: Number(((minutes * 60 * 8000) / 8 / 1024).toFixed(0)) },
          { name: '20 Mbps (MB)', value: Number(((minutes * 60 * 20000) / 8 / 1024).toFixed(0)) },
          { name: '50 Mbps (MB)', value: Number(((minutes * 60 * 50000) / 8 / 1024).toFixed(0)) },
        ],
        rawOutput: res,
      };
    },
    seo: {
      title: 'Calculadora Rápida de Tamaño de Archivo por Bitrate | 64 Kbps a 100 Mbps',
      metaDescription: 'Compara al instante el peso en MB y GB de tu video para diferentes tasas de bits desde 64 Kbps hasta 100 Mbps.',
      h1: 'Calculadora de Tamaño de Archivo por Bitrate',
      keywords: ['tamano por bitrate rapido', 'peso video 8mbps 50mbps', 'calculadora bitrate megabytes', 'comparar bitrate tamano video'],
      summary: 'Herramienta de referencia rápida para estimar el peso de archivos audiovisuales según presets estándar.',
      formulaMarkdown: '`Tamaño (MB) = (Kbps × 1000 × Segundos) / 8 / 1024 / 1024`',
      howToSteps: ['Introduce la duración del archivo.', 'Elige una tasa de bits de la lista desplegable.', 'Obtén el tamaño estimado.'],
      tipsToImprove: ['Para transmisiones en vivo (streaming en YouTube), una tasa de 6 a 9 Mbps es la recomendada para 1080p60.'],
      faqs: [
        {
          question: '¿Cuánto pesa un video de 10 minutos a 8 Mbps?',
          answer: 'Un video de 10 minutos (600 segundos) a 8 Mbps pesa aproximadamente 600 MB.',
        },
      ],
    },
    relatedSlugs: ['calculadora-bitrate', 'calculadora-tamano-video', 'calculadora-espacio-necesario'],
  },
];
