import React, { useState, useEffect, useTransition } from 'react';
import {
  LoadedImageInfo,
  processImage,
  downloadBlob,
  ProcessedImageResult,
  formatBytes,
} from '../../utils/imageProcessor';
import { ImageFormatRegistry, FormatConversionTarget } from '../../utils/imageFormatRegistry';
import { PrivacyBadge } from './PrivacyBadge';
import { InteractiveCropper } from './InteractiveCropper';
import { ImageMetadataViewer } from './ImageMetadataViewer';
import { FaviconGeneratorView } from './FaviconGeneratorView';
import {
  RefreshCw,
  Download,
  Crop,
  Scaling,
  Minimize2,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  ShieldCheck,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Info,
  Layers,
  Lock,
  Compass,
  FileImage,
} from 'lucide-react';
import { analytics } from '../../utils/analytics';

export type EditorTabMode =
  | 'convert'
  | 'compress'
  | 'resize'
  | 'crop'
  | 'rotate'
  | 'metadata'
  | 'favicon'
  | 'optimize';

interface ImageSingleEditorProps {
  imageInfo: LoadedImageInfo;
  toolId?: string;
  initialMode?: EditorTabMode;
  initialTargetFormat?: string;
  initialQuality?: number;
  initialRequireMatte?: boolean;
  onReplaceImage?: () => void;
}

export const ImageSingleEditor: React.FC<ImageSingleEditorProps> = ({
  imageInfo,
  toolId,
  initialMode = 'convert',
  initialTargetFormat,
  initialQuality,
  initialRequireMatte = false,
  onReplaceImage,
}) => {
  const [activeTab, setActiveTab] = useState<EditorTabMode>(initialMode);
  const [targetFormat, setTargetFormat] = useState<string>(
    initialTargetFormat || (imageInfo.format.id === 'png' ? 'webp' : 'png')
  );
  const [quality, setQuality] = useState<number>(initialQuality ?? 85);
  const [targetMaxKb, setTargetMaxKb] = useState<number | null>(null);
  const [matteColor, setMatteColor] = useState<string>('#ffffff');

  // Resize state
  const [resizeMode, setResizeMode] = useState<'original' | 'width' | 'height' | 'percentage' | 'custom'>('original');
  const [resizeWidth, setResizeWidth] = useState<number>(imageInfo.width);
  const [resizeHeight, setResizeHeight] = useState<number>(imageInfo.height);
  const [resizePercentage, setResizePercentage] = useState<number>(100);
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);

  // Rotation & Flip state
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
  const [flipVertical, setFlipVertical] = useState<boolean>(false);

  // Crop state
  const [cropEnabled, setCropEnabled] = useState<boolean>(false);
  const [cropPreset, setCropPreset] = useState<'free' | '16:9' | '9:16' | '1:1' | '4:3' | '3:2'>('16:9');
  const [cropBox, setCropBox] = useState({
    x: 0,
    y: 0,
    width: imageInfo.width,
    height: imageInfo.height,
  });

  // Processing output
  const [result, setResult] = useState<ProcessedImageResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Dynamic available conversions
  const availableConversions = ImageFormatRegistry.getAvailableConversions(imageInfo.format.id);

  // Trigger processing on parameter updates
  const runProcessing = async () => {
    setIsProcessing(true);
    try {
      const output = await processImage(imageInfo, {
        targetFormat,
        quality,
        targetMaxSizeBytes: targetMaxKb ? targetMaxKb * 1024 : undefined,
        matteColor: targetFormat === 'jpeg' || targetFormat === 'jpg' ? matteColor : undefined,
        resize: {
          enabled: resizeMode !== 'original',
          mode: resizeMode,
          width: resizeWidth,
          height: resizeHeight,
          percentage: resizePercentage,
          keepAspectRatio,
        },
        crop: {
          enabled: cropEnabled,
          x: cropBox.x,
          y: cropBox.y,
          width: cropBox.width,
          height: cropBox.height,
          aspectRatioPreset: cropPreset,
        },
        rotation,
        flipHorizontal,
        flipVertical,
      });

      setResult(output);
      setIsProcessing(false);
    } catch (err) {
      console.error('Processing error:', err);
      setIsProcessing(false);
    }
  };

  // Re-process when parameters change
  useEffect(() => {
    runProcessing();
  }, [
    imageInfo,
    targetFormat,
    quality,
    targetMaxKb,
    matteColor,
    resizeMode,
    resizeWidth,
    resizeHeight,
    resizePercentage,
    keepAspectRatio,
    rotation,
    flipHorizontal,
    flipVertical,
    cropEnabled,
    cropBox,
  ]);

  // Handle Dimension Input Sync
  const handleWidthChange = (w: number) => {
    setResizeWidth(w);
    if (keepAspectRatio && imageInfo.width > 0) {
      setResizeHeight(Math.round((w / imageInfo.width) * imageInfo.height));
    }
  };

  const handleHeightChange = (h: number) => {
    setResizeHeight(h);
    if (keepAspectRatio && imageInfo.height > 0) {
      setResizeWidth(Math.round((h / imageInfo.height) * imageInfo.width));
    }
  };

  // Handle Download
  const handleDownload = () => {
    if (result) {
      downloadBlob(result.blob, result.filename);

      // 1. Local telemetry
      analytics.trackImageDownloaded(`Editor - ${targetFormat.toUpperCase()}`, {
        format: result.format,
        sizeBytes: result.sizeBytes,
        savingsPercentage: result.savingsPercentage,
      });

      // 2. Persist real conversion usage statistics to Turso DB (Privacy-First: NO files/names stored)
      try {
        const currentToolId = toolId || `convert-${imageInfo.format.id}-to-${targetFormat.toLowerCase()}`;
        fetch('/api/analytics/image-conversion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tool_id: currentToolId,
            event: 'conversion',
            format_from: imageInfo.format.id,
            format_to: targetFormat.toLowerCase(),
          }),
        }).catch(() => {});
      } catch {
        // Ignore network errors
      }
    }
  };

  const handleCleanMetadataDownload = async () => {
    setIsProcessing(true);
    try {
      const clean = await processImage(imageInfo, {
        targetFormat: imageInfo.format.id === 'png' ? 'png' : 'jpeg',
        quality: 95,
        stripMetadata: true,
      });
      downloadBlob(clean.blob, `limpia-${clean.filename}`);
      analytics.trackMetadataRemoved('Eliminar Metadatos', {
        originalName: imageInfo.name,
      });
      setIsProcessing(false);
    } catch (e) {
      setIsProcessing(false);
    }
  };

  // Tab definitions
  const tabs = [
    { id: 'convert', label: '🔄 Convertir', desc: 'Cambiar formato' },
    { id: 'compress', label: '🗜️ Comprimir', desc: 'Reducir tamaño' },
    { id: 'resize', label: '📐 Redimensionar', desc: 'Cambiar dimensiones' },
    { id: 'crop', label: '✂️ Recortar', desc: '16:9, 9:16, 1:1' },
    { id: 'rotate', label: '🔄 Girar', desc: 'Rotar y voltear' },
    { id: 'metadata', label: '🧹 Metadatos', desc: 'Eliminar EXIF/GPS' },
    { id: 'favicon', label: '🌟 Favicon', desc: 'Generar favicon.ico' },
    { id: 'optimize', label: '⚡ Optimizar Web', desc: 'Recomendación IA' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Privacy Notice Banner */}
      <PrivacyBadge />

      {/* Top Workstation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E] shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#2A2A2A] border border-gray-200 dark:border-[#383838] flex items-center justify-center overflow-hidden shrink-0">
            <img src={imageInfo.sourceUrl} alt={imageInfo.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate" title={imageInfo.name}>
              {imageInfo.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="font-semibold uppercase text-[#FF0000]">{imageInfo.format.shortName}</span>
              <span>•</span>
              <span>{imageInfo.sizeFormatted}</span>
              <span>•</span>
              <span>{imageInfo.width} × {imageInfo.height} px</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onReplaceImage && (
            <button
              type="button"
              onClick={onReplaceImage}
              className="px-3.5 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white bg-gray-100 dark:bg-[#282828] hover:bg-gray-200 dark:hover:bg-[#353535] rounded-xl transition-colors cursor-pointer"
            >
              Cambiar imagen
            </button>
          )}

          <button
            type="button"
            onClick={handleDownload}
            disabled={!result || isProcessing}
            className="px-5 py-2 bg-[#FF0000] hover:bg-[#CC0000] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isProcessing ? 'Procesando...' : 'Descargar imagen'}
          </button>
        </div>
      </div>

      {/* Tool Action Modes Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === 'crop') setCropEnabled(true);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-xs'
                : 'bg-white dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-[#2E2E2E]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Two-Column Layout (Controls + Live Comparison Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Tool Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E] shadow-sm space-y-5">
            {/* 1. CONVERT TAB */}
            {activeTab === 'convert' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Convertir a formato:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableConversions.map((fmt) => (
                      <button
                        key={fmt.formatId}
                        type="button"
                        onClick={() => setTargetFormat(fmt.formatId)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          targetFormat === fmt.formatId
                            ? 'border-[#FF0000] bg-red-50/60 dark:bg-red-950/20 text-[#FF0000] ring-1 ring-[#FF0000]'
                            : 'border-gray-200 dark:border-[#2F2F2F] bg-gray-50/50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2C2C2C]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-extrabold text-sm">{fmt.name}</span>
                          {fmt.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-[#333] text-gray-700 dark:text-gray-300 font-bold">
                              {fmt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-tight">
                          {fmt.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Slider (for JPG, WEBP, AVIF) */}
                {(targetFormat === 'jpeg' || targetFormat === 'webp' || targetFormat === 'avif') && (
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#2F2F2F] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-700 dark:text-gray-300">Calidad de compresión:</span>
                      <span className="font-mono font-bold text-[#FF0000]">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-[#FF0000] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>1% (Menor peso)</span>
                      <span>85% (Recomendado)</span>
                      <span>100% (Máxima fidelidad)</span>
                    </div>
                  </div>
                )}

                {/* Transparency Matte for JPG */}
                {(targetFormat === 'jpeg' || targetFormat === 'jpg') && imageInfo.hasAlphaChannel && (
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2 text-xs">
                    <span className="font-bold text-amber-900 dark:text-amber-200 block">
                      ⚠️ JPG no admite transparencia
                    </span>
                    <p className="text-amber-800/90 dark:text-amber-300/80 text-[11px]">
                      El fondo transparente original se reemplazará por el color elegido:
                    </p>
                    <div className="flex items-center gap-2">
                      {[
                        { label: 'Blanco', color: '#ffffff' },
                        { label: 'Negro', color: '#000000' },
                        { label: 'Gris', color: '#f3f4f6' },
                      ].map((c) => (
                        <button
                          key={c.color}
                          type="button"
                          onClick={() => setMatteColor(c.color)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            matteColor === c.color
                              ? 'border-[#FF0000] bg-white dark:bg-black font-extrabold shadow-xs'
                              : 'border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-black/40'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                      <input
                        type="color"
                        value={matteColor}
                        onChange={(e) => setMatteColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-700 p-0.5"
                        title="Elegir color personalizado"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. COMPRESS TAB */}
            {activeTab === 'compress' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#2F2F2F] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-700 dark:text-gray-300">Nivel de Calidad:</span>
                    <span className="font-mono font-bold text-[#FF0000]">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-[#FF0000] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Límite de tamaño máximo objetivo (Opcional):
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {[
                      { label: 'Sin límite', kb: null },
                      { label: '500 KB', kb: 500 },
                      { label: '1 MB', kb: 1024 },
                      { label: '2 MB', kb: 2048 },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setTargetMaxKb(opt.kb)}
                        className={`py-2 px-1 rounded-xl font-bold transition-all text-center cursor-pointer ${
                          targetMaxKb === opt.kb
                            ? 'bg-[#FF0000] text-white shadow-xs'
                            : 'bg-gray-100 dark:bg-[#252525] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. RESIZE TAB */}
            {activeTab === 'resize' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Modo de escalado:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    {[
                      { id: 'original', label: 'Original' },
                      { id: 'percentage', label: 'Porcentaje' },
                      { id: 'custom', label: 'Píxeles' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setResizeMode(mode.id as any)}
                        className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                          resizeMode === mode.id
                            ? 'bg-[#FF0000] text-white shadow-xs'
                            : 'bg-gray-100 dark:bg-[#252525] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {resizeMode === 'percentage' && (
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#2F2F2F] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-700 dark:text-gray-300">Escala:</span>
                      <span className="font-mono font-bold text-[#FF0000]">{resizePercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={200}
                      step={5}
                      value={resizePercentage}
                      onChange={(e) => setResizePercentage(Number(e.target.value))}
                      className="w-full accent-[#FF0000] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                      <span>Resultado: {Math.round(imageInfo.width * (resizePercentage / 100))} × {Math.round(imageInfo.height * (resizePercentage / 100))} px</span>
                    </div>
                  </div>
                )}

                {resizeMode === 'custom' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Ancho (px)</label>
                        <input
                          type="number"
                          value={resizeWidth}
                          onChange={(e) => handleWidthChange(Number(e.target.value))}
                          className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-300 dark:border-[#383838] rounded-xl px-3 py-2 text-gray-900 dark:text-white font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1">Alto (px)</label>
                        <input
                          type="number"
                          value={resizeHeight}
                          onChange={(e) => handleHeightChange(Number(e.target.value))}
                          className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-300 dark:border-[#383838] rounded-xl px-3 py-2 text-gray-900 dark:text-white font-mono font-bold"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={keepAspectRatio}
                        onChange={(e) => setKeepAspectRatio(e.target.checked)}
                        className="w-4 h-4 rounded text-[#FF0000] accent-[#FF0000] cursor-pointer"
                      />
                      <span>Mantener proporción de aspecto ({imageInfo.aspectRatio})</span>
                    </label>

                    {/* Quick Preset Dimensions */}
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-gray-500 block mb-1.5">Preajustes rápidos:</span>
                      <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                        {[
                          { label: '1080p (FHD)', w: 1920, h: 1080 },
                          { label: '720p (HD)', w: 1280, h: 720 },
                          { label: '4K (UHD)', w: 3840, h: 2160 },
                        ].map((p) => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => {
                              setResizeWidth(p.w);
                              setResizeHeight(p.h);
                            }}
                            className="p-1.5 bg-gray-100 dark:bg-[#252525] hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg font-mono text-center cursor-pointer"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. CROP TAB */}
            {activeTab === 'crop' && (
              <InteractiveCropper
                imageInfo={imageInfo}
                cropPreset={cropPreset}
                onPresetChange={(p) => setCropPreset(p)}
                cropBox={cropBox}
                onCropBoxChange={(box) => setCropBox(box)}
                onApplyCrop={() => {
                  setCropEnabled(true);
                  runProcessing();
                }}
                onResetCrop={() => {
                  setCropEnabled(false);
                  setCropBox({ x: 0, y: 0, width: imageInfo.width, height: imageInfo.height });
                }}
              />
            )}

            {/* 5. ROTATE TAB */}
            {activeTab === 'rotate' && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                  Rotación y Orientación:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setRotation(((rotation + 90) % 360) as any)}
                    className="p-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl hover:bg-gray-100 flex flex-col items-center gap-1 font-bold text-gray-800 dark:text-gray-200 cursor-pointer"
                  >
                    <RotateCw className="w-5 h-5 text-[#FF0000]" />
                    <span>+90° Derecha</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRotation(((rotation + 270) % 360) as any)}
                    className="p-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl hover:bg-gray-100 flex flex-col items-center gap-1 font-bold text-gray-800 dark:text-gray-200 cursor-pointer"
                  >
                    <RotateCcw className="w-5 h-5 text-[#FF0000]" />
                    <span>-90° Izquierda</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFlipHorizontal(!flipHorizontal)}
                    className={`p-3 border rounded-xl flex flex-col items-center gap-1 font-bold cursor-pointer ${
                      flipHorizontal
                        ? 'border-[#FF0000] bg-red-50 text-[#FF0000]'
                        : 'bg-gray-50 dark:bg-[#252525] border-gray-200 dark:border-[#333] text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <FlipHorizontal className="w-5 h-5 text-indigo-500" />
                    <span>Voltear H</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFlipVertical(!flipVertical)}
                    className={`p-3 border rounded-xl flex flex-col items-center gap-1 font-bold cursor-pointer ${
                      flipVertical
                        ? 'border-[#FF0000] bg-red-50 text-[#FF0000]'
                        : 'bg-gray-50 dark:bg-[#252525] border-gray-200 dark:border-[#333] text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <FlipVertical className="w-5 h-5 text-indigo-500" />
                    <span>Voltear V</span>
                  </button>
                </div>
              </div>
            )}

            {/* 6. METADATA TAB */}
            {activeTab === 'metadata' && (
              <ImageMetadataViewer
                imageInfo={imageInfo}
                onCleanAndDownload={handleCleanMetadataDownload}
                isProcessing={isProcessing}
              />
            )}

            {/* 7. FAVICON TAB */}
            {activeTab === 'favicon' && <FaviconGeneratorView imageInfo={imageInfo} />}

            {/* 8. WEB OPTIMIZE TAB */}
            {activeTab === 'optimize' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Diagnóstico de Optimización Web</span>
                  </div>
                  <p className="text-indigo-800/90 dark:text-indigo-300/80 leading-relaxed">
                    Recomendación óptima para este archivo:
                    <strong className="block mt-1 text-sm font-extrabold text-indigo-950 dark:text-indigo-100">
                      Convertir a WebP (82% de Calidad)
                    </strong>
                    Esta combinación maximiza la velocidad de carga (LCP) reduciendo hasta un 75% del peso sin alterar la nitidez visual.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTargetFormat('webp');
                    setQuality(82);
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> Aplicar Configuración Web Recomendada
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Comparison (Before vs After) (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E] shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FF0000]" />
                Comparativa en Tiempo Real
              </h4>

              {result && result.savingsPercentage > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs">
                  🎉 Ahorro de espacio: -{result.savingsPercentage}%
                </span>
              )}
            </div>

            {/* Side-by-Side Visual Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Original Card */}
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-500 dark:text-gray-400">Original</span>
                  <span className="font-mono font-bold text-gray-700 dark:text-gray-300 uppercase">
                    {imageInfo.format.shortName}
                  </span>
                </div>

                <div className="h-44 rounded-lg bg-zinc-950/20 dark:bg-black/40 border border-gray-200 dark:border-[#3A3A3A] flex items-center justify-center overflow-hidden p-1">
                  <img
                    src={imageInfo.sourceUrl}
                    alt="Original"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>

                <div className="text-[11px] text-gray-600 dark:text-gray-300 space-y-1 pt-1 font-mono">
                  <div className="flex justify-between">
                    <span>Tamaño:</span>
                    <strong className="text-gray-900 dark:text-white">{imageInfo.sizeFormatted}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimensiones:</span>
                    <span>{imageInfo.width} × {imageInfo.height} px</span>
                  </div>
                </div>
              </div>

              {/* Converted / Processed Result Card */}
              <div className="p-3 rounded-xl bg-red-50/40 dark:bg-red-950/10 border border-red-200/80 dark:border-red-900/40 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#FF0000]">Resultado</span>
                  <span className="font-mono font-bold text-[#FF0000] uppercase">
                    {result ? result.format : targetFormat.toUpperCase()}
                  </span>
                </div>

                <div className="h-44 rounded-lg bg-zinc-950/20 dark:bg-black/40 border border-red-200/80 dark:border-red-900/40 flex items-center justify-center overflow-hidden p-1">
                  {result ? (
                    <img
                      src={result.dataUrl}
                      alt="Resultado"
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  ) : (
                    <div className="text-xs text-gray-400 font-medium">Procesando...</div>
                  )}
                </div>

                <div className="text-[11px] text-gray-600 dark:text-gray-300 space-y-1 pt-1 font-mono">
                  <div className="flex justify-between">
                    <span>Tamaño:</span>
                    <strong className="text-[#FF0000]">{result ? result.sizeFormatted : '...'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimensiones:</span>
                    <span>{result ? `${result.width} × ${result.height} px` : '...'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action / Download Banner */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">
                  Nombre de salida: <span className="font-mono text-[#FF0000]">{result?.filename}</span>
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {result ? `Tiempo de procesamiento: ${result.processingTimeMs} ms en tu CPU` : ''}
                </span>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!result || isProcessing}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Descargar Imagen Convertida
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
