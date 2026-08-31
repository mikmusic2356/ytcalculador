import React, { useState, useEffect } from 'react';
import {
  LoadedImageInfo,
  loadAndAnalyzeImage,
  processImage,
  downloadBlob,
  downloadAllAsZip,
  formatBytes,
  ProcessedImageResult,
} from '../../utils/imageProcessor';
import { ImageFormatRegistry } from '../../utils/imageFormatRegistry';
import { PrivacyBadge } from './PrivacyBadge';
import {
  FolderArchive,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Trash2,
  Plus,
  Layers,
  Sparkles,
} from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface BatchItem {
  id: string;
  file: File;
  info?: LoadedImageInfo;
  result?: ProcessedImageResult;
  status: 'pending' | 'processing' | 'completed' | 'error';
  errorMessage?: string;
  progress: number;
}

interface ImageBatchProcessorProps {
  initialFiles?: File[];
  onBackToSingle?: () => void;
}

export const ImageBatchProcessor: React.FC<ImageBatchProcessorProps> = ({
  initialFiles = [],
  onBackToSingle,
}) => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [targetFormat, setTargetFormat] = useState<'webp' | 'jpeg' | 'png' | 'avif'>('webp');
  const [quality, setQuality] = useState<number>(85);
  const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);
  const [matteColor, setMatteColor] = useState<string>('#ffffff');

  // Initialize with passed files
  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      addFiles(initialFiles);
    }
  }, [initialFiles]);

  const addFiles = async (files: File[]) => {
    const newItems: BatchItem[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).substring(2, 7)}`,
      file,
      status: 'pending',
      progress: 0,
    }));

    setItems((prev) => [...prev, ...newItems]);

    // Analyze files asynchronously
    for (const item of newItems) {
      try {
        const info = await loadAndAnalyzeImage(item.file);
        setItems((current) =>
          current.map((i) => (i.id === item.id ? { ...i, info } : i))
        );
      } catch (err: any) {
        setItems((current) =>
          current.map((i) =>
            i.id === item.id
              ? { ...i, status: 'error', errorMessage: err.message || 'Error cargando imagen' }
              : i
          )
        );
      }
    }
  };

  const processSingleItem = async (item: BatchItem, fmt = targetFormat, q = quality) => {
    if (!item.info) {
      try {
        const loaded = await loadAndAnalyzeImage(item.file);
        item.info = loaded;
      } catch (e: any) {
        setItems((curr) =>
          curr.map((i) => (i.id === item.id ? { ...i, status: 'error', errorMessage: e.message } : i))
        );
        return;
      }
    }

    setItems((curr) =>
      curr.map((i) => (i.id === item.id ? { ...i, status: 'processing', progress: 40 } : i))
    );

    try {
      const result = await processImage(item.info, {
        targetFormat: fmt,
        quality: q,
        matteColor: fmt === 'jpeg' ? matteColor : undefined,
      });

      setItems((curr) =>
        curr.map((i) =>
          i.id === item.id ? { ...i, status: 'completed', result, progress: 100 } : i
        )
      );

      analytics.trackConversionCompleted('Conversión en Lote', 'imagenes', {
        format: fmt,
        originalSize: item.file.size,
        resultSize: result.sizeBytes,
      });
    } catch (err: any) {
      setItems((curr) =>
        curr.map((i) =>
          i.id === item.id
            ? { ...i, status: 'error', errorMessage: err.message || 'Error al procesar', progress: 0 }
            : i
        )
      );
    }
  };

  const processAllPending = async () => {
    setIsProcessingAll(true);
    for (const item of items) {
      if (item.status !== 'completed') {
        await processSingleItem(item, targetFormat, quality);
      }
    }
    setIsProcessingAll(false);
  };

  const handleDownloadAllZip = async () => {
    const completedItems = items
      .filter((i) => i.status === 'completed' && i.result)
      .map((i) => ({
        filename: i.result!.filename,
        blob: i.result!.blob,
      }));

    if (completedItems.length > 0) {
      await downloadAllAsZip(completedItems, `imagenes-convertidas-${targetFormat}.zip`);
      analytics.trackImageDownloaded('Lote Completo ZIP', {
        count: completedItems.length,
        format: targetFormat,
      });
    }
  };

  const removeItem = (id: string) => {
    setItems((curr) => curr.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const totalOriginalBytes = items.reduce((acc, i) => acc + i.file.size, 0);
  const totalProcessedBytes = items.reduce(
    (acc, i) => acc + (i.result ? i.result.sizeBytes : i.file.size),
    0
  );
  const totalSavings =
    totalOriginalBytes > 0 && completedCount > 0
      ? Number((((totalOriginalBytes - totalProcessedBytes) / totalOriginalBytes) * 100).toFixed(1))
      : 0;

  return (
    <div className="space-y-6">
      {/* Privacy Notice */}
      <PrivacyBadge />

      {/* Batch Controls Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#FF0000]" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Conversión y Optimización en Lote ({items.length} imágenes)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="batch-file-input"
              className="px-3.5 py-2 bg-gray-100 dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#353535] text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#FF0000]" />
              Añadir más fotos
              <input
                id="batch-file-input"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    addFiles(Array.from(e.target.files));
                  }
                }}
              />
            </label>

            {items.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                title="Limpiar lista"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Global Batch Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-gray-100 dark:border-[#2A2A2A] text-xs">
          <div>
            <label className="block text-gray-500 dark:text-gray-400 font-bold mb-1.5">
              Convertir todas a:
            </label>
            <div className="grid grid-cols-4 gap-1 bg-gray-100 dark:bg-[#252525] p-1 rounded-xl">
              {(['webp', 'jpeg', 'png', 'avif'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setTargetFormat(fmt)}
                  className={`py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    targetFormat === fmt
                      ? 'bg-[#FF0000] text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {fmt === 'jpeg' ? 'JPG' : fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-gray-500 dark:text-gray-400 font-bold">
                Calidad de salida:
              </label>
              <span className="font-mono font-bold text-[#FF0000]">{quality}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={1}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-[#FF0000] cursor-pointer"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={processAllPending}
              disabled={isProcessingAll || items.length === 0}
              className="w-full py-2.5 bg-[#FF0000] hover:bg-[#CC0000] active:scale-95 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessingAll ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Procesando Lote...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" /> Convertir Todo el Lote
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Summary Badge if items converted */}
        {completedCount > 0 && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-emerald-800 dark:text-emerald-200">
                ✅ {completedCount} de {items.length} imágenes procesadas con éxito
              </span>
              <span className="text-emerald-700/80 dark:text-emerald-300/80 ml-2">
                (Ahorro total estimado: <strong>{totalSavings}%</strong> de espacio en disco)
              </span>
            </div>

            <button
              type="button"
              onClick={handleDownloadAllZip}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <FolderArchive className="w-4 h-4" />
              Descargar Todos en ZIP (.zip)
            </button>
          </div>
        )}
      </div>

      {/* Files List / Grid */}
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs"
          >
            <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
              <span className="text-gray-400 font-mono text-[11px] w-5">{idx + 1}.</span>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 dark:text-white truncate max-w-xs sm:max-w-sm" title={item.file.name}>
                  {item.file.name}
                </p>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">
                  <span>{formatBytes(item.file.size)}</span>
                  <span>•</span>
                  <span className="uppercase font-semibold">
                    {item.info ? item.info.format.shortName : item.file.type.split('/')[1] || 'IMG'}
                  </span>
                  {item.info && (
                    <>
                      <span>•</span>
                      <span>{item.info.width} × {item.info.height} px</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Status & Progress */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {item.status === 'pending' && (
                <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-[#282828] text-gray-600 dark:text-gray-400 font-medium">
                  Listo para convertir
                </span>
              )}

              {item.status === 'processing' && (
                <div className="flex items-center gap-2 text-[#FF0000] font-bold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Procesando...</span>
                </div>
              )}

              {item.status === 'completed' && item.result && (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {item.result.sizeFormatted}
                  </span>
                  {item.result.savingsPercentage > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                      -{item.result.savingsPercentage}%
                    </span>
                  )}
                </div>
              )}

              {item.status === 'error' && (
                <span className="text-red-500 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Error
                </span>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {item.status === 'completed' && item.result ? (
                  <button
                    type="button"
                    onClick={() => downloadBlob(item.result!.blob, item.result!.filename)}
                    className="p-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                    title="Descargar archivo"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => processSingleItem(item)}
                    className="p-2 text-gray-500 hover:text-black dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-[#282828] transition-colors cursor-pointer"
                    title="Convertir esta imagen"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-[#282828] transition-colors cursor-pointer"
                  title="Quitar de la lista"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
