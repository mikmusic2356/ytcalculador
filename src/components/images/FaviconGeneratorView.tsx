import React, { useState, useEffect } from 'react';
import {
  LoadedImageInfo,
  generateFaviconPackage,
  downloadBlob,
  createIcoBlobFromCanvas,
} from '../../utils/imageProcessor';
import { Globe, Download, Copy, Check, Sparkles, FolderArchive, Layers } from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface FaviconGeneratorViewProps {
  imageInfo: LoadedImageInfo;
}

export const FaviconGeneratorView: React.FC<FaviconGeneratorViewProps> = ({ imageInfo }) => {
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [previews, setPreviews] = useState<{ size: number; dataUrl: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const generate = async () => {
      setLoading(true);
      try {
        const result = await generateFaviconPackage(imageInfo);
        if (isMounted) {
          setZipBlob(result.zipBlob);
          setPreviews(result.previews);
          setLoading(false);
          analytics.trackFaviconGenerated('Generador de Favicon', {
            originalName: imageInfo.name,
          });
        }
      } catch (err) {
        console.error('Error generating favicons:', err);
        setLoading(false);
      }
    };
    generate();

    return () => {
      isMounted = false;
    };
  }, [imageInfo]);

  const htmlCode = `<!-- Favicon & PWA Icons Generated with YouTubeCalculador -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadZip = () => {
    if (zipBlob) {
      downloadBlob(zipBlob, 'paquete-favicon-completo.zip');
      analytics.trackImageDownloaded('Favicon ZIP Completo', {
        format: 'zip',
      });
    }
  };

  const handleDownloadSingle = (dataUrl: string, filename: string) => {
    fetch(dataUrl)
      .then((res) => res.blob())
      .then((b) => downloadBlob(b, filename));
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2F2F2F] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#FF0000] text-white shadow-xs">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>Paquete Completo de Favicon y Aplicaciones Web (PWA)</span>
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Generado automáticamente a partir de tu imagen centrada. Compatible con todos los navegadores, iOS y Android.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadZip}
          disabled={loading || !zipBlob}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
        >
          <FolderArchive className="w-4 h-4" />
          {loading ? 'Generando paquete...' : 'Descargar Todo en ZIP (.zip)'}
        </button>
      </div>

      {/* Browser Tab Simulation Preview */}
      <div className="p-4 rounded-xl bg-gray-100 dark:bg-[#181818] border border-gray-200 dark:border-[#2E2E2E]">
        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 block mb-2">
          Simulación de Pestaña del Navegador:
        </span>
        <div className="max-w-md bg-white dark:bg-[#252525] rounded-t-xl px-4 py-2 border-t border-x border-gray-300 dark:border-[#383838] flex items-center gap-2 shadow-xs">
          {previews.length > 0 ? (
            <img
              src={previews[0].dataUrl}
              alt="Favicon preview"
              className="w-4 h-4 rounded-xs object-contain"
            />
          ) : (
            <div className="w-4 h-4 rounded-xs bg-gray-300 animate-pulse" />
          )}
          <span className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
            Mi Sitio Web Oficial — Inicio
          </span>
          <span className="text-gray-400 text-xs ml-auto">×</span>
        </div>
      </div>

      {/* Resolutions Grid */}
      <div className="space-y-3">
        <h5 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#FF0000]" />
          Resoluciones y Archivos Generados
        </h5>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {previews.map((item) => (
            <div
              key={item.size}
              className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E] flex flex-col items-center text-center justify-between gap-2"
            >
              <div className="w-14 h-14 bg-white dark:bg-[#282828] rounded-lg border border-gray-200 dark:border-[#3A3A3A] flex items-center justify-center p-1 shadow-xs">
                <img
                  src={item.dataUrl}
                  alt={item.label}
                  style={{ width: `${Math.min(item.size, 48)}px`, height: `${Math.min(item.size, 48)}px` }}
                  className="object-contain"
                />
              </div>

              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block font-mono">
                  {item.size}×{item.size}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 block line-clamp-1">
                  {item.label}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleDownloadSingle(item.dataUrl, `favicon-${item.size}x${item.size}.png`)}
                className="w-full py-1 text-[10px] font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white bg-gray-200/70 dark:bg-[#2D2D2D] hover:bg-gray-300 dark:hover:bg-[#3D3D3D] rounded-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" /> PNG
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* HTML Integration Snippet */}
      <div className="p-4 rounded-xl bg-zinc-900 text-white space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-300 font-mono">Código HTML para tu &lt;head&gt;</span>
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-lg text-white transition-colors cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCode ? '¡Copiado!' : 'Copiar Código'}
          </button>
        </div>
        <pre className="p-3 rounded-lg bg-black/60 font-mono text-[11px] text-gray-300 overflow-x-auto border border-zinc-800 leading-relaxed">
          {htmlCode}
        </pre>
      </div>
    </div>
  );
};
