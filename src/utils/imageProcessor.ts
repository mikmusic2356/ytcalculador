import JSZip from 'jszip';
import { ImageFormatRegistry, ImageFormatDefinition } from './imageFormatRegistry';

export interface ImageProcessingOptions {
  targetFormat: 'jpeg' | 'png' | 'webp' | 'avif' | 'ico' | string;
  quality?: number; // 1 to 100
  targetMaxSizeBytes?: number; // Optional max file size cap
  matteColor?: string; // Hex color for non-transparent backgrounds (e.g. '#ffffff')
  resize?: {
    enabled: boolean;
    mode: 'original' | 'width' | 'height' | 'percentage' | 'custom';
    width: number;
    height: number;
    percentage: number;
    keepAspectRatio: boolean;
  };
  crop?: {
    enabled: boolean;
    x: number; // percentage 0 to 100 or pixels
    y: number;
    width: number;
    height: number;
    aspectRatioPreset?: 'free' | '16:9' | '9:16' | '1:1' | '4:3' | '3:2';
  };
  rotation?: 0 | 90 | 180 | 270;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  stripMetadata?: boolean;
}

export interface ProcessedImageResult {
  blob: Blob;
  dataUrl: string;
  filename: string;
  format: string;
  extension: string;
  width: number;
  height: number;
  sizeBytes: number;
  sizeFormatted: string;
  savingsPercentage: number; // vs original
  isSmaller: boolean;
  isLossless: boolean;
  processingTimeMs: number;
}

export interface LoadedImageInfo {
  file: File;
  name: string;
  format: ImageFormatDefinition;
  width: number;
  height: number;
  aspectRatio: string;
  aspectRatioNumeric: number;
  megapixels: number;
  sizeBytes: number;
  sizeFormatted: string;
  hasAlphaChannel: boolean;
  orientation: 'horizontal' | 'vertical' | 'cuadrada';
  sourceUrl: string;
  imageElement: HTMLImageElement;
  hasExifEstimate: boolean;
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function calculateAspectRatioString(width: number, height: number): string {
  if (!width || !height) return '1:1';
  const divisor = gcd(Math.round(width), Math.round(height));
  const w = Math.round(width / divisor);
  const h = Math.round(height / divisor);

  // Match common standard ratios
  const ratio = width / height;
  if (Math.abs(ratio - 16 / 9) < 0.02) return '16:9';
  if (Math.abs(ratio - 9 / 16) < 0.02) return '9:16 (Vertical)';
  if (Math.abs(ratio - 4 / 3) < 0.02) return '4:3';
  if (Math.abs(ratio - 3 / 2) < 0.02) return '3:2';
  if (Math.abs(ratio - 1) < 0.02) return '1:1 (Cuadrada)';
  if (Math.abs(ratio - 21 / 9) < 0.03) return '21:9 (Ultrawide)';

  if (w <= 32 && h <= 32) {
    return `${w}:${h}`;
  }
  return `${ratio.toFixed(2)}:1`;
}

/**
 * Load and inspect an image File
 */
export async function loadAndAnalyzeImage(file: File): Promise<LoadedImageInfo> {
  const format = ImageFormatRegistry.detectFormat(file);
  const sourceUrl = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      const megapixels = Number(((width * height) / 1000000).toFixed(2));
      const aspectRatio = calculateAspectRatioString(width, height);
      const aspectRatioNumeric = Number((width / height).toFixed(3));

      let orientation: 'horizontal' | 'vertical' | 'cuadrada' = 'horizontal';
      if (width > height) orientation = 'horizontal';
      else if (height > width) orientation = 'vertical';
      else orientation = 'cuadrada';

      // Check alpha channel via small offscreen canvas sample
      let hasAlphaChannel = false;
      if (format.supportsTransparency) {
        try {
          const sampleCanvas = document.createElement('canvas');
          const sampleW = Math.min(width, 100);
          const sampleH = Math.min(height, 100);
          sampleCanvas.width = sampleW;
          sampleCanvas.height = sampleH;
          const ctx = sampleCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, sampleW, sampleH);
            const imgData = ctx.getImageData(0, 0, sampleW, sampleH).data;
            for (let i = 3; i < imgData.length; i += 4) {
              if (imgData[i] < 250) {
                hasAlphaChannel = true;
                break;
              }
            }
          }
        } catch {
          hasAlphaChannel = format.id === 'png';
        }
      }

      const hasExifEstimate =
        format.id === 'jpeg' || format.id === 'heic' || file.name.toLowerCase().includes('img') || file.name.toLowerCase().includes('dsc');

      resolve({
        file,
        name: file.name,
        format,
        width,
        height,
        aspectRatio,
        aspectRatioNumeric,
        megapixels,
        sizeBytes: file.size,
        sizeFormatted: formatBytes(file.size),
        hasAlphaChannel,
        orientation,
        sourceUrl,
        imageElement: img,
        hasExifEstimate,
      });
    };

    img.onerror = () => {
      reject(new Error(`No se pudo leer la imagen "${file.name}". Verifica que el archivo sea una imagen válida.`));
    };

    img.src = sourceUrl;
  });
}

/**
 * Core image transformer and converter
 */
export async function processImage(
  imageInfo: LoadedImageInfo,
  options: ImageProcessingOptions
): Promise<ProcessedImageResult> {
  const startTime = performance.now();
  const img = imageInfo.imageElement;

  // 1. Calculate Crop Bounds
  let srcX = 0;
  let srcY = 0;
  let srcW = imageInfo.width;
  let srcH = imageInfo.height;

  if (options.crop && options.crop.enabled && options.crop.width > 0 && options.crop.height > 0) {
    srcX = Math.max(0, Math.min(options.crop.x, imageInfo.width - 1));
    srcY = Math.max(0, Math.min(options.crop.y, imageInfo.height - 1));
    srcW = Math.max(1, Math.min(options.crop.width, imageInfo.width - srcX));
    srcH = Math.max(1, Math.min(options.crop.height, imageInfo.height - srcY));
  }

  // 2. Calculate Final Output Dimensions (Resizing)
  let destW = srcW;
  let destH = srcH;

  if (options.resize && options.resize.enabled) {
    const { mode, width, height, percentage, keepAspectRatio } = options.resize;
    if (mode === 'percentage' && percentage > 0) {
      const scale = percentage / 100;
      destW = Math.round(srcW * scale);
      destH = Math.round(srcH * scale);
    } else if (mode === 'width' && width > 0) {
      destW = Math.round(width);
      destH = keepAspectRatio ? Math.round((destW / srcW) * srcH) : destH;
    } else if (mode === 'height' && height > 0) {
      destH = Math.round(height);
      destW = keepAspectRatio ? Math.round((destH / srcH) * srcW) : destW;
    } else if (mode === 'custom' || mode === 'original') {
      if (width > 0 && height > 0) {
        destW = Math.round(width);
        destH = Math.round(height);
      }
    }
  }

  destW = Math.max(1, destW);
  destH = Math.max(1, destH);

  // 3. Handle Rotation and Flip
  const rotation = options.rotation || 0;
  const isRotated90or270 = rotation === 90 || rotation === 270;
  const canvasW = isRotated90or270 ? destH : destW;
  const canvasH = isRotated90or270 ? destW : destH;

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('No se pudo inicializar el contexto de renderizado Canvas.');
  }

  // Smoothing settings for high fidelity resizing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 4. Fill Matte background if target format doesn't support transparency (e.g. JPG)
  const targetFmt = options.targetFormat.toLowerCase();
  const isTargetTransparent = targetFmt === 'png' || targetFmt === 'webp' || targetFmt === 'avif' || targetFmt === 'ico';

  if (!isTargetTransparent || options.matteColor) {
    ctx.fillStyle = options.matteColor || '#ffffff';
    ctx.fillRect(0, 0, canvasW, canvasH);
  }

  // 5. Apply transformations (Rotation & Flip)
  ctx.save();
  ctx.translate(canvasW / 2, canvasH / 2);

  if (rotation !== 0) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  const flipX = options.flipHorizontal ? -1 : 1;
  const flipY = options.flipVertical ? -1 : 1;
  ctx.scale(flipX, flipY);

  // Draw the cropped source image into destW x destH
  ctx.drawImage(
    img,
    srcX,
    srcY,
    srcW,
    srcH,
    -destW / 2,
    -destH / 2,
    destW,
    destH
  );

  ctx.restore();

  // 6. Determine MIME type and quality
  let mimeType = 'image/png';
  let extension = 'png';
  let isLossless = true;

  if (targetFmt === 'jpeg' || targetFmt === 'jpg') {
    mimeType = 'image/jpeg';
    extension = 'jpg';
    isLossless = false;
  } else if (targetFmt === 'webp') {
    mimeType = 'image/webp';
    extension = 'webp';
    isLossless = false;
  } else if (targetFmt === 'avif') {
    mimeType = ImageFormatRegistry.isMimeExportSupported('image/avif') ? 'image/avif' : 'image/webp';
    extension = mimeType === 'image/avif' ? 'avif' : 'webp';
    isLossless = false;
  } else if (targetFmt === 'ico') {
    mimeType = 'image/png'; // Will be encapsulated to .ico if requested
    extension = 'ico';
    isLossless = true;
  }

  const qualityDecimal = Math.max(0.01, Math.min(1.0, (options.quality ?? 85) / 100));

  // 7. Generate Blob
  let blob: Blob;

  if (options.targetMaxSizeBytes && options.targetMaxSizeBytes > 0 && !isLossless) {
    // Iterative quality search to meet max target size
    blob = await findOptimalQualityBlob(canvas, mimeType, options.targetMaxSizeBytes, qualityDecimal);
  } else {
    blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (b) => resolve(b || new Blob([], { type: mimeType })),
        mimeType,
        qualityDecimal
      );
    });
  }

  // If ICO format was selected, wrap in ICO header container
  if (targetFmt === 'ico') {
    blob = await createIcoBlobFromCanvas(canvas);
  }

  const dataUrl = URL.createObjectURL(blob);
  const originalBaseName = imageInfo.name.substring(0, imageInfo.name.lastIndexOf('.')) || imageInfo.name;
  const filename = `${originalBaseName}.${extension}`;

  const sizeBytes = blob.size;
  const originalBytes = imageInfo.sizeBytes;
  const savingsPercentage = originalBytes > 0 ? Number((((originalBytes - sizeBytes) / originalBytes) * 100).toFixed(1)) : 0;
  const isSmaller = sizeBytes < originalBytes;
  const processingTimeMs = Math.round(performance.now() - startTime);

  return {
    blob,
    dataUrl,
    filename,
    format: extension.toUpperCase(),
    extension,
    width: canvasW,
    height: canvasH,
    sizeBytes,
    sizeFormatted: formatBytes(sizeBytes),
    savingsPercentage,
    isSmaller,
    isLossless,
    processingTimeMs,
  };
}

/**
 * Iterative binary search for quality to stay within target max size
 */
async function findOptimalQualityBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  targetBytes: number,
  initialQuality: number
): Promise<Blob> {
  let low = 0.05;
  let high = Math.max(initialQuality, 0.95);
  let bestBlob: Blob | null = null;

  for (let step = 0; step < 5; step++) {
    const q = (low + high) / 2;
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b || new Blob([], { type: mimeType })), mimeType, q);
    });

    if (blob.size <= targetBytes) {
      bestBlob = blob;
      low = q; // Can we get higher quality while still under target?
    } else {
      high = q; // Need lower quality
    }
  }

  if (bestBlob) return bestBlob;

  // Fallback to lowest tested quality
  return new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b || new Blob([], { type: mimeType })), mimeType, low);
  });
}

/**
 * Generate a valid .ico file containing modern PNG directory entries
 */
export async function createIcoBlobFromCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
  // Render square sizes (16, 32, 48)
  const sizes = [16, 32, 48];
  const pngBlobs: { width: number; height: number; buffer: ArrayBuffer }[] = [];

  for (const s of sizes) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = s;
    tempCanvas.height = s;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.imageSmoothingEnabled = true;
      tempCtx.imageSmoothingQuality = 'high';
      tempCtx.drawImage(canvas, 0, 0, s, s);
      const b = await new Promise<Blob>((res) => tempCanvas.toBlob((blob) => res(blob!), 'image/png'));
      const buffer = await b.arrayBuffer();
      pngBlobs.push({ width: s, height: s, buffer });
    }
  }

  // Calculate total header and data sizes
  const count = pngBlobs.length;
  const headerSize = 6 + count * 16;
  let totalSize = headerSize;
  for (const item of pngBlobs) {
    totalSize += item.buffer.byteLength;
  }

  const icoBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(icoBuffer);

  // ICONDIR Header
  view.setUint16(0, 0, true); // Reserved
  view.setUint16(2, 1, true); // Type (1 = ICO)
  view.setUint16(4, count, true); // Count

  let currentOffset = headerSize;
  for (let i = 0; i < count; i++) {
    const item = pngBlobs[i];
    const entryOffset = 6 + i * 16;
    view.setUint8(entryOffset + 0, item.width >= 256 ? 0 : item.width); // Width
    view.setUint8(entryOffset + 1, item.height >= 256 ? 0 : item.height); // Height
    view.setUint8(entryOffset + 2, 0); // Palette count
    view.setUint8(entryOffset + 3, 0); // Reserved
    view.setUint16(entryOffset + 4, 1, true); // Color planes
    view.setUint16(entryOffset + 6, 32, true); // Bit count
    view.setUint32(entryOffset + 8, item.buffer.byteLength, true); // Bytes in res
    view.setUint32(entryOffset + 12, currentOffset, true); // Offset

    // Copy PNG bytes
    const u8Dest = new Uint8Array(icoBuffer, currentOffset, item.buffer.byteLength);
    u8Dest.set(new Uint8Array(item.buffer));

    currentOffset += item.buffer.byteLength;
  }

  return new Blob([icoBuffer], { type: 'image/x-icon' });
}

/**
 * Generate full Favicon Pack (16x16, 32x32, 48x48, 180x180, 192x192, 512x512, favicon.ico)
 */
export async function generateFaviconPackage(
  imageInfo: LoadedImageInfo
): Promise<{ zipBlob: Blob; previews: { size: number; dataUrl: string; label: string }[] }> {
  const zip = new JSZip();
  const sizes = [
    { size: 16, name: 'favicon-16x16.png', label: 'Favicon Clásico 16x16' },
    { size: 32, name: 'favicon-32x32.png', label: 'Favicon Estándar 32x32' },
    { size: 48, name: 'favicon-48x48.png', label: 'Acceso Directo 48x48' },
    { size: 180, name: 'apple-touch-icon.png', label: 'Apple Touch Icon 180x180' },
    { size: 192, name: 'android-chrome-192x192.png', label: 'Android PWA 192x192' },
    { size: 512, name: 'android-chrome-512x512.png', label: 'Splash Screen PWA 512x512' },
  ];

  const previews: { size: number; dataUrl: string; label: string }[] = [];

  // 1. Generate square base canvas
  const baseDim = Math.min(imageInfo.width, imageInfo.height);
  const srcX = (imageInfo.width - baseDim) / 2;
  const srcY = (imageInfo.height - baseDim) / 2;

  const baseCanvas = document.createElement('canvas');
  baseCanvas.width = baseDim;
  baseCanvas.height = baseDim;
  const baseCtx = baseCanvas.getContext('2d');
  if (baseCtx) {
    baseCtx.drawImage(imageInfo.imageElement, srcX, srcY, baseDim, baseDim, 0, 0, baseDim, baseDim);
  }

  // 2. Generate each resolution
  for (const item of sizes) {
    const c = document.createElement('canvas');
    c.width = item.size;
    c.height = item.size;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(baseCanvas, 0, 0, item.size, item.size);
      const b = await new Promise<Blob>((res) => c.toBlob((blob) => res(blob!), 'image/png'));
      zip.file(item.name, b);
      previews.push({
        size: item.size,
        dataUrl: URL.createObjectURL(b),
        label: item.label,
      });
    }
  }

  // 3. Generate multi-resolution favicon.ico
  const icoBlob = await createIcoBlobFromCanvas(baseCanvas);
  zip.file('favicon.ico', icoBlob);

  // 4. Add HTML embed snippet and manifest.json
  const htmlSnippet = `<!-- Favicon & PWA Icons Generated with YouTubeCalculador -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
`;
  zip.file('favicon-html-code.html', htmlSnippet);

  const manifest = JSON.stringify(
    {
      name: 'Mi Aplicación Web',
      short_name: 'App',
      icons: [
        { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
    },
    null,
    2
  );
  zip.file('site.webmanifest', manifest);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return { zipBlob, previews };
}

/**
 * Trigger file download in browser
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

/**
 * Create a ZIP of multiple processed files
 */
export async function downloadAllAsZip(
  items: { filename: string; blob: Blob }[],
  zipFilename: string = 'imagenes-procesadas.zip'
): Promise<void> {
  const zip = new JSZip();
  items.forEach((item) => {
    zip.file(item.filename, item.blob);
  });
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, zipFilename);
}
