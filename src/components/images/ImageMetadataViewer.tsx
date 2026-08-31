import React from 'react';
import { LoadedImageInfo, formatBytes } from '../../utils/imageProcessor';
import { ShieldCheck, ShieldAlert, Sparkles, Download, Info, CheckCircle2, Lock } from 'lucide-react';

interface ImageMetadataViewerProps {
  imageInfo: LoadedImageInfo;
  onCleanAndDownload: () => void;
  isProcessing?: boolean;
}

export const ImageMetadataViewer: React.FC<ImageMetadataViewerProps> = ({
  imageInfo,
  onCleanAndDownload,
  isProcessing = false,
}) => {
  return (
    <div className="space-y-5">
      {/* Privacy Status Banner */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-900 dark:text-amber-200">
            Metadatos y Privacidad en Fotografías Digitales
          </p>
          <p className="text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
            Las fotos tomadas con teléfonos (iPhone, Android) o cámaras digitales suelen contener etiquetas EXIF con
            tu ubicación GPS exacta, modelo de dispositivo, fecha, hora y número de serie.
            Al procesar la imagen con nuestro sistema, se redibuja en un Canvas local eliminando el 100% de esta información privada.
          </p>
        </div>
      </div>

      {/* Technical Data Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E]">
          <span className="text-gray-500 dark:text-gray-400 font-semibold block mb-0.5">Nombre de archivo</span>
          <span className="font-bold text-gray-900 dark:text-white truncate block" title={imageInfo.name}>
            {imageInfo.name}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E]">
          <span className="text-gray-500 dark:text-gray-400 font-semibold block mb-0.5">Formato detectado</span>
          <span className="font-bold text-gray-900 dark:text-white uppercase">
            {imageInfo.format.shortName} ({imageInfo.format.category})
          </span>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E]">
          <span className="text-gray-500 dark:text-gray-400 font-semibold block mb-0.5">Tamaño de archivo</span>
          <span className="font-bold text-gray-900 dark:text-white font-mono">
            {imageInfo.sizeFormatted} ({imageInfo.sizeBytes.toLocaleString()} bytes)
          </span>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E]">
          <span className="text-gray-500 dark:text-gray-400 font-semibold block mb-0.5">Dimensiones exactas</span>
          <span className="font-bold text-gray-900 dark:text-white font-mono">
            {imageInfo.width} × {imageInfo.height} px
          </span>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E]">
          <span className="text-gray-500 dark:text-gray-400 font-semibold block mb-0.5">Relación de aspecto</span>
          <span className="font-bold text-[#FF0000]">{imageInfo.aspectRatio}</span>
          <span className="text-gray-400 dark:text-gray-400 ml-1 text-[11px]">({imageInfo.orientation})</span>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E]">
          <span className="text-gray-500 dark:text-gray-400 font-semibold block mb-0.5">Resolución total</span>
          <span className="font-bold text-gray-900 dark:text-white font-mono">
            {imageInfo.megapixels} Megapíxeles
          </span>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E]">
          <span className="text-gray-500 dark:text-gray-400 font-semibold block mb-0.5">Canal de Transparencia (Alfa)</span>
          <span className={`font-bold inline-flex items-center gap-1 ${imageInfo.hasAlphaChannel ? 'text-emerald-600' : 'text-gray-600 dark:text-gray-400'}`}>
            {imageInfo.hasAlphaChannel ? 'Detectada (Fondo transparente)' : 'Sin canal alfa (Opaca)'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E]">
          <span className="text-gray-500 dark:text-gray-400 font-semibold block mb-0.5">Geolocalización GPS</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">
            {imageInfo.hasExifEstimate ? 'Potencialmente presente' : 'No detectada'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E]">
          <span className="text-gray-500 dark:text-gray-400 font-semibold block mb-0.5">Privacidad del archivo</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> Procesamiento 100% Local
          </span>
        </div>
      </div>

      {/* Privacy Scrub Action Box */}
      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              Eliminar Metadatos EXIF, GPS y Dispositivo
            </h4>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
              Genera una versión idéntica en píxeles pero totalmente anónima y segura para compartir en internet.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCleanAndDownload}
          disabled={isProcessing}
          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isProcessing ? 'Procesando copia limpia...' : 'Eliminar Metadatos y Descargar'}
        </button>
      </div>
    </div>
  );
};
