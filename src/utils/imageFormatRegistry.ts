export interface ImageFormatDefinition {
  id: string;
  name: string;
  shortName: string;
  extensions: string[];
  mimeTypes: string[];
  supportsQuality: boolean;
  supportsTransparency: boolean;
  isVector: boolean;
  category: 'raster' | 'vector' | 'photo' | 'icon';
  description: string;
  canExportInBrowser: boolean;
  canImportInBrowser: boolean;
  recommendedFor: string;
}

export interface FormatConversionTarget {
  formatId: string;
  name: string;
  extension: string;
  mimeType: string;
  supportsQuality: boolean;
  supportsTransparency: boolean;
  requiresTransparencyMatte: boolean;
  isAvailableInBrowser: boolean;
  badge?: string;
  description: string;
}

class ImageFormatRegistryClass {
  private supportedExportMimes: Set<string> = new Set(['image/png', 'image/jpeg']);
  private hasCheckedBrowserSupport = false;

  public readonly formats: Record<string, ImageFormatDefinition> = {
    png: {
      id: 'png',
      name: 'PNG (Portable Network Graphics)',
      shortName: 'PNG',
      extensions: ['png'],
      mimeTypes: ['image/png'],
      supportsQuality: false,
      supportsTransparency: true,
      isVector: false,
      category: 'raster',
      description: 'Compresión sin pérdida con soporte total de canal alfa y transparencia. Ideal para gráficos, logos y capturas.',
      canExportInBrowser: true,
      canImportInBrowser: true,
      recommendedFor: 'Logotipos, capturas con texto, transparencias y stickers.',
    },
    jpeg: {
      id: 'jpeg',
      name: 'JPG / JPEG (Joint Photographic Experts Group)',
      shortName: 'JPG',
      extensions: ['jpg', 'jpeg', 'jfif'],
      mimeTypes: ['image/jpeg', 'image/jpg'],
      supportsQuality: true,
      supportsTransparency: false,
      isVector: false,
      category: 'raster',
      description: 'Estándar fotográfico universal con compresión con pérdida ajustable. Máxima compatibilidad.',
      canExportInBrowser: true,
      canImportInBrowser: true,
      recommendedFor: 'Fotografías de miniaturas, banners reales y fondos sin transparencia.',
    },
    webp: {
      id: 'webp',
      name: 'WebP (Google Web Picture)',
      shortName: 'WebP',
      extensions: ['webp'],
      mimeTypes: ['image/webp'],
      supportsQuality: true,
      supportsTransparency: true,
      isVector: false,
      category: 'raster',
      description: 'Formato moderno desarrollado por Google. Proporciona una compresión 30-50% superior a JPG y PNG manteniendo calidad y transparencia.',
      canExportInBrowser: true,
      canImportInBrowser: true,
      recommendedFor: 'Imágenes web ultrarrápidas, miniaturas optimizadas para SEO y carga móvil.',
    },
    avif: {
      id: 'avif',
      name: 'AVIF (AV1 Image File Format)',
      shortName: 'AVIF',
      extensions: ['avif'],
      mimeTypes: ['image/avif'],
      supportsQuality: true,
      supportsTransparency: true,
      isVector: false,
      category: 'raster',
      description: 'Formato de compresión de última generación basado en el códec AV1. Máximo ahorro de peso con alta fidelidad cromática.',
      canExportInBrowser: false, // Will be verified dynamically
      canImportInBrowser: true,
      recommendedFor: 'Sitios web de vanguardia que buscan la máxima optimización de Core Web Vitals.',
    },
    svg: {
      id: 'svg',
      name: 'SVG (Scalable Vector Graphics)',
      shortName: 'SVG',
      extensions: ['svg'],
      mimeTypes: ['image/svg+xml'],
      supportsQuality: false,
      supportsTransparency: true,
      isVector: true,
      category: 'vector',
      description: 'Gráficos vectoriales infinitamente escalables sin pixelación basados en XML.',
      canExportInBrowser: false, // Exporting to raster is supported, vectorizing arbitrary raster in client is rasterized
      canImportInBrowser: true,
      recommendedFor: 'Iconos, logotipos e ilustraciones escalables a cualquier resolución.',
    },
    gif: {
      id: 'gif',
      name: 'GIF (Graphics Interchange Format)',
      shortName: 'GIF',
      extensions: ['gif'],
      mimeTypes: ['image/gif'],
      supportsQuality: false,
      supportsTransparency: true,
      isVector: false,
      category: 'raster',
      description: 'Formato clásico limitado a 256 colores. Soporta transparencia indexada.',
      canExportInBrowser: true,
      canImportInBrowser: true,
      recommendedFor: 'Animaciones simples y gráficos con paleta reducida.',
    },
    bmp: {
      id: 'bmp',
      name: 'BMP (Bitmap Windows)',
      shortName: 'BMP',
      extensions: ['bmp', 'dib'],
      mimeTypes: ['image/bmp', 'image/x-ms-bmp'],
      supportsQuality: false,
      supportsTransparency: false,
      isVector: false,
      category: 'raster',
      description: 'Mapa de bits sin comprimir clásico de sistemas Windows.',
      canExportInBrowser: true,
      canImportInBrowser: true,
      recommendedFor: 'Imágenes heredadas de sistemas Windows.',
    },
    ico: {
      id: 'ico',
      name: 'ICO (Icono de Windows / Favicon)',
      shortName: 'ICO',
      extensions: ['ico'],
      mimeTypes: ['image/x-icon', 'image/vnd.microsoft.icon'],
      supportsQuality: false,
      supportsTransparency: true,
      isVector: false,
      category: 'icon',
      description: 'Contenedor multi-resolución para favicons de navegadores y accesos directos.',
      canExportInBrowser: true,
      canImportInBrowser: true,
      recommendedFor: 'Favicons para sitios web (favicon.ico) en tamaños 16x16, 32x32 y 48x48.',
    },
    heic: {
      id: 'heic',
      name: 'HEIC / HEIF (High Efficiency Image Container)',
      shortName: 'HEIC',
      extensions: ['heic', 'heif'],
      mimeTypes: ['image/heic', 'image/heif'],
      supportsQuality: true,
      supportsTransparency: true,
      isVector: false,
      category: 'photo',
      description: 'Formato fotográfico de alta eficiencia utilizado por cámaras iPhone (iOS) y smartphones modernos.',
      canExportInBrowser: false,
      canImportInBrowser: true, // Supported via native decode or JS pipeline
      recommendedFor: 'Fotos tomadas con iPhone/iPad para convertir a JPG/PNG universal.',
    },
    tiff: {
      id: 'tiff',
      name: 'TIFF / TIF (Tagged Image File Format)',
      shortName: 'TIFF',
      extensions: ['tiff', 'tif'],
      mimeTypes: ['image/tiff'],
      supportsQuality: false,
      supportsTransparency: true,
      isVector: false,
      category: 'raster',
      description: 'Formato profesional sin pérdida para escaneado e impresión editorial.',
      canExportInBrowser: false,
      canImportInBrowser: true,
      recommendedFor: 'Impresión y archivo fotográfico sin pérdida.',
    },
  };

  constructor() {
    this.checkBrowserCapabilities();
  }

  public checkBrowserCapabilities(): void {
    if (typeof document === 'undefined' || this.hasCheckedBrowserSupport) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;

      // Check WEBP export
      const webpUrl = canvas.toDataURL('image/webp');
      if (webpUrl.startsWith('data:image/webp')) {
        this.supportedExportMimes.add('image/webp');
        this.formats.webp.canExportInBrowser = true;
      }

      // Check AVIF export
      const avifUrl = canvas.toDataURL('image/avif');
      if (avifUrl.startsWith('data:image/avif')) {
        this.supportedExportMimes.add('image/avif');
        this.formats.avif.canExportInBrowser = true;
      }

      this.hasCheckedBrowserSupport = true;
    } catch {
      // Browser canvas check failed, use safe defaults
      this.supportedExportMimes = new Set(['image/png', 'image/jpeg', 'image/webp']);
    }
  }

  /**
   * Detect format from file name or MIME type
   */
  public detectFormat(file: File | { name: string; type?: string }): ImageFormatDefinition {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const mime = file.type?.toLowerCase() || '';

    // First try exact MIME match
    for (const fmt of Object.values(this.formats)) {
      if (mime && fmt.mimeTypes.includes(mime)) {
        return fmt;
      }
    }

    // Then try extension match
    for (const fmt of Object.values(this.formats)) {
      if (fmt.extensions.includes(ext)) {
        return fmt;
      }
    }

    // Default fallback to JPEG
    return this.formats.jpeg;
  }

  /**
   * Get valid target conversion formats for an input format
   */
  public getAvailableConversions(inputFormatId: string): FormatConversionTarget[] {
    this.checkBrowserCapabilities();

    const targets: FormatConversionTarget[] = [];

    // Standard available export formats
    const exportCandidateIds = ['webp', 'jpeg', 'png', 'avif', 'ico'];

    for (const targetId of exportCandidateIds) {
      const fmt = this.formats[targetId];
      if (!fmt) continue;

      // Don't show same format as only conversion, but allow it for resizing/compression
      const isSame = targetId === inputFormatId || (targetId === 'jpeg' && inputFormatId === 'jpg');

      const isAvif = targetId === 'avif';
      const isAvailable = fmt.canExportInBrowser && (!isAvif || this.supportedExportMimes.has('image/avif'));

      if (targetId === 'ico') {
        targets.push({
          formatId: 'ico',
          name: 'ICO (Favicon)',
          extension: 'ico',
          mimeType: 'image/x-icon',
          supportsQuality: false,
          supportsTransparency: true,
          requiresTransparencyMatte: false,
          isAvailableInBrowser: true,
          badge: 'Icono Web',
          description: 'Genera favicon.ico para tu sitio web',
        });
        continue;
      }

      targets.push({
        formatId: fmt.id,
        name: fmt.shortName,
        extension: fmt.extensions[0],
        mimeType: fmt.mimeTypes[0],
        supportsQuality: fmt.supportsQuality,
        supportsTransparency: fmt.supportsTransparency,
        requiresTransparencyMatte: !fmt.supportsTransparency,
        isAvailableInBrowser: isAvailable,
        badge: isSame
          ? 'Mismo formato (Recomprimir/Redimensionar)'
          : targetId === 'webp'
          ? 'Recomendado Web'
          : targetId === 'png'
          ? 'Sin pérdida / Transparente'
          : undefined,
        description: fmt.description,
      });
    }

    return targets;
  }

  public isMimeExportSupported(mime: string): boolean {
    this.checkBrowserCapabilities();
    return this.supportedExportMimes.has(mime);
  }
}

export const ImageFormatRegistry = new ImageFormatRegistryClass();
