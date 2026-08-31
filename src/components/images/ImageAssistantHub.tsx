import React, { useState, useRef } from 'react';
import {
  LoadedImageInfo,
  loadAndAnalyzeImage,
} from '../../utils/imageProcessor';
import { PrivacyBadge } from './PrivacyBadge';
import { ImageSingleEditor, EditorTabMode } from './ImageSingleEditor';
import { ImageBatchProcessor } from './ImageBatchProcessor';
import { IMAGE_TOOLS } from '../../data/imageToolsData';
import { AdPlacement } from '../AdPlacement';
import {
  Upload,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Zap,
  Minimize2,
  Scaling,
  Crop,
  ShieldCheck,
  Globe,
  FileImage,
  ArrowRight,
  FolderArchive,
  RefreshCw,
  RotateCw,
} from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface ImageAssistantHubProps {
  initialToolSlug?: string;
  onNavigate: (path: string) => void;
}

export const ImageAssistantHub: React.FC<ImageAssistantHubProps> = ({
  initialToolSlug,
  onNavigate,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [loadedImage, setLoadedImage] = useState<LoadedImageInfo | null>(null);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<'hub' | 'single' | 'batch'>('hub');
  const [activeTabMode, setActiveTabMode] = useState<EditorTabMode>('convert');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Match initial tool slug if provided
  const activeToolDef = initialToolSlug ? IMAGE_TOOLS.find((t) => t.slug === initialToolSlug) : undefined;

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/') || f.name.match(/\.(heic|heif|svg|ico|bmp|tiff|tif)$/i));
    if (files.length === 0) return;

    setIsLoading(true);

    if (files.length > 1) {
      setBatchFiles(files);
      setMode('batch');
      setIsLoading(false);
      analytics.trackImageUploaded('Carga en Lote', { count: files.length });
    } else {
      try {
        const file = files[0];
        const info = await loadAndAnalyzeImage(file);
        setLoadedImage(info);
        setMode('single');
        setIsLoading(false);
        analytics.trackImageUploaded('Editor Individual', {
          format: info.format.shortName,
          sizeBytes: info.sizeBytes,
        });
      } catch (err: any) {
        alert(err.message || 'No se pudo cargar la imagen.');
        setIsLoading(false);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleSelectTool = (toolInitialMode: EditorTabMode, slug?: string) => {
    setActiveTabMode(toolInitialMode);
    if (slug) {
      onNavigate(`/imagenes/${slug}`);
    } else {
      fileInputRef.current?.click();
    }
  };

  // If in single editor mode
  if (mode === 'single' && loadedImage) {
    return (
      <div className="space-y-6">
        <AdPlacement slotId="img-editor-top" format="horizontal-banner" />
        <ImageSingleEditor
          imageInfo={loadedImage}
          initialMode={activeToolDef?.initialMode || activeTabMode}
          initialTargetFormat={activeToolDef?.defaultTargetFormat}
          initialQuality={activeToolDef?.defaultQuality}
          initialRequireMatte={activeToolDef?.requireMatte}
          onReplaceImage={() => {
            setLoadedImage(null);
            setMode('hub');
          }}
        />
        <AdPlacement slotId="img-editor-bottom" format="horizontal-banner" />
      </div>
    );
  }

  // If in batch processor mode
  if (mode === 'batch') {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => {
            setBatchFiles([]);
            setMode('hub');
          }}
          className="text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white flex items-center gap-1 cursor-pointer"
        >
          ← Volver al Asistente de imágenes
        </button>
        <AdPlacement slotId="img-batch-top" format="horizontal-banner" />
        <ImageBatchProcessor
          initialFiles={batchFiles}
          onBackToSingle={() => setMode('hub')}
        />
        <AdPlacement slotId="img-batch-bottom" format="horizontal-banner" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-[#FF0000] text-xs font-extrabold tracking-wide uppercase">
          <ImageIcon className="w-3.5 h-3.5" />
          Suite Profesional para Creadores
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
          🖼️ Asistente de imágenes
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-medium">
          Convierte, optimiza y prepara tus imágenes gratis.
        </p>
      </div>

      {/* Espacio Publicitario 1: Banner Superior */}
      <AdPlacement slotId="img-hub-top" format="horizontal-banner" />

      {/* Primary Clean Dropzone Card */}
      <div className="max-w-2xl mx-auto">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer select-none ${
            dragActive
              ? 'border-[#FF0000] bg-red-50/50 dark:bg-red-950/20 scale-[1.01]'
              : 'border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1A1A1A] hover:border-[#FF0000] hover:bg-gray-50/60 dark:hover:bg-[#202020]'
          } shadow-sm`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.heic,.heif,.svg,.ico,.bmp,.tiff,.tif"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.dataTransfer?.files || e.target.files);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-[#FF0000] flex items-center justify-center shadow-xs">
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Arrastra una o varias imágenes aquí
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                o haz clic para explorar en tu equipo
              </p>
            </div>

            <button
              type="button"
              className="px-6 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold text-xs rounded-xl shadow-xs transition-all pointer-events-none"
            >
              Seleccionar imagen
            </button>

            <p className="text-[11px] text-gray-400 dark:text-gray-400">
              Soporta JPG, PNG, WebP, AVIF, SVG, GIF, BMP, ICO y HEIC (iPhone)
            </p>
          </div>
        </div>

        {/* Local Processing Guarantee Badge */}
        <div className="mt-4">
          <PrivacyBadge />
        </div>
      </div>

      {/* Espacio Publicitario 2: Intermedio In-Content */}
      <AdPlacement slotId="img-hub-mid" format="in-content" />

      {/* Interactive Action Modes Selector Grid */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
            <span>¿Qué quieres hacer?</span>
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Selecciona una herramienta para comenzar
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            {
              id: 'convert',
              slug: 'convertir-a-png',
              icon: RefreshCw,
              title: '🔄 Convertir',
              desc: 'Cambiar formato (JPG, PNG, WebP...)',
              color: 'text-red-500',
            },
            {
              id: 'compress',
              slug: 'comprimir-imagen',
              icon: Minimize2,
              title: '🗜️ Comprimir',
              desc: 'Reducir tamaño en KB y MB',
              color: 'text-amber-500',
            },
            {
              id: 'resize',
              slug: 'redimensionar-imagen',
              icon: Scaling,
              title: '📐 Redimensionar',
              desc: 'Cambiar píxeles o porcentaje',
              color: 'text-blue-500',
            },
            {
              id: 'crop',
              slug: 'recortar-imagen',
              icon: Crop,
              title: '✂️ Recortar',
              desc: '16:9, 9:16 Shorts, 1:1',
              color: 'text-emerald-500',
            },
            {
              id: 'rotate',
              slug: 'girar-imagen',
              icon: RotateCw,
              title: '🔄 Girar',
              desc: 'Rotar 90° y efecto espejo',
              color: 'text-cyan-500',
            },
            {
              id: 'metadata',
              slug: 'eliminar-metadatos',
              icon: ShieldCheck,
              title: '🧹 Metadatos',
              desc: 'Eliminar EXIF y ubicación GPS',
              color: 'text-purple-500',
            },
            {
              id: 'favicon',
              slug: 'generador-favicon',
              icon: Globe,
              title: '🌟 Favicon',
              desc: 'Crear favicon.ico y paquete PWA',
              color: 'text-teal-500',
            },
            {
              id: 'optimize',
              slug: 'optimizar-web',
              icon: Zap,
              title: '⚡ Optimizar Web',
              desc: 'Recomendación para SEO',
              color: 'text-indigo-500',
            },
            {
              id: 'batch',
              slug: 'comprimir-imagen',
              icon: FolderArchive,
              title: '📦 Por Lotes',
              desc: 'Convertir múltiples imágenes',
              color: 'text-rose-500',
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => {
                  if (action.id === 'batch') {
                    fileInputRef.current?.click();
                  } else {
                    onNavigate(`/imagenes/${action.slug}`);
                  }
                }}
                className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E] hover:border-[#FF0000] dark:hover:border-[#FF0000] hover:shadow-md transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-extrabold text-gray-900 dark:text-white group-hover:text-[#FF0000] transition-colors">
                    {action.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#FF0000] group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {action.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Espacio Publicitario 3: Entre Acciones Rápidas y Catálogo */}
      <AdPlacement slotId="img-hub-grid" format="horizontal-banner" />

      {/* Directory of Specific Conversion Tools */}
      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-[#2E2E2E]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">
            Herramientas y Conversiones Especializadas
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {IMAGE_TOOLS.length} herramientas disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {IMAGE_TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => onNavigate(`/imagenes/${tool.slug}`)}
              className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E] hover:border-[#FF0000] dark:hover:border-[#FF0000] hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-[#FF0000] transition-colors">
                    {tool.name}
                  </span>
                  {tool.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-50 dark:bg-red-950/50 text-[#FF0000]">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {tool.shortDescription}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 dark:border-[#2A2A2A] flex items-center justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400">
                <span className="truncate">Soporta: {tool.acceptedFormatsText}</span>
                <span className="text-[#FF0000] group-hover:translate-x-1 transition-transform">Abrir →</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Espacio Publicitario 4: Banner Inferior */}
      <AdPlacement slotId="img-hub-bottom" format="horizontal-banner" />
    </div>
  );
};
