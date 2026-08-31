import React, { useState, useRef } from 'react';
import { ImageToolDefinition, IMAGE_TOOLS } from '../../data/imageToolsData';
import { LoadedImageInfo, loadAndAnalyzeImage } from '../../utils/imageProcessor';
import { ImageSingleEditor } from './ImageSingleEditor';
import { PrivacyBadge } from './PrivacyBadge';
import { SEOHead } from '../SEOHead';
import { AdPlacement } from '../AdPlacement';
import { Breadcrumbs } from '../Breadcrumbs';
import { RelatedTools as RegistryRelatedTools } from '../RelatedTools';
import {
  Upload,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
} from 'lucide-react';
import { analytics } from '../../utils/analytics';

import { ToolRegistry } from '../../services/toolRegistry';

interface ImageToolDetailViewProps {
  tool: ImageToolDefinition;
  onNavigate: (path: string) => void;
}

export const ImageToolDetailView: React.FC<ImageToolDetailViewProps> = ({
  tool,
  onNavigate,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [loadedImage, setLoadedImage] = useState<LoadedImageInfo | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic registered tool metadata from Turso / ToolRegistry
  const currentRoute = `/imagenes/${tool.slug}`;
  const registeredInfo = ToolRegistry.getByRoute(currentRoute) || ToolRegistry.getById(tool.id);

  const seoTitle = registeredInfo?.seo?.title || tool.seo.title;
  const seoDesc = registeredInfo?.seo?.metaDescription || tool.seo.metaDescription;
  const seoH1 = registeredInfo?.h1 || registeredInfo?.seo?.h1 || tool.seo.h1;
  const robots = registeredInfo ? registeredInfo.robots : 'index, follow';

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter(
      (f) => f.type.startsWith('image/') || f.name.match(/\.(heic|heif|svg|ico|bmp|tiff|tif)$/i)
    );
    if (files.length === 0) return;

    try {
      const file = files[0];
      const info = await loadAndAnalyzeImage(file);
      setLoadedImage(info);
      analytics.trackImageUploaded(tool.name, {
        format: info.format.shortName,
        sizeBytes: info.sizeBytes,
      });
    } catch (err: any) {
      alert(err.message || 'No se pudo cargar la imagen.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-10">
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        route={registeredInfo?.route || currentRoute}
        robots={robots}
        faqs={tool.seo.faqs}
        howToSteps={tool.seo.howToSteps}
        toolName={registeredInfo?.name || tool.name}
        type="article"
      />

      {/* Header & Breadcrumb */}
      <div className="space-y-3">
        <Breadcrumbs
          items={[
            { label: 'Imágenes', path: '/imagenes' },
            { label: registeredInfo?.name || tool.name },
          ]}
          onNavigate={onNavigate}
        />

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-50 dark:bg-red-950/50 text-[#FF0000]">
              {tool.badge || 'Herramienta Gratuita'}
            </span>
            <PrivacyBadge minimal />
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {seoH1}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            {tool.tagline}
          </p>
        </div>
      </div>

      {/* Espacio Publicitario 1: Banner Superior */}
      <AdPlacement slotId={`img-tool-top-${tool.id}`} format="horizontal-banner" />

      {/* Main Interactive Workstation or Upload Area */}
      {loadedImage ? (
        <div className="space-y-4">
          <ImageSingleEditor
            imageInfo={loadedImage}
            toolId={tool.id}
            initialMode={tool.initialMode}
            initialTargetFormat={tool.defaultTargetFormat}
            initialQuality={tool.defaultQuality}
            initialRequireMatte={tool.requireMatte}
            onReplaceImage={() => setLoadedImage(null)}
          />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
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
              accept="image/*,.heic,.heif,.svg,.ico,.bmp,.tiff,.tif"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFiles(e.target.files);
                }
              }}
            />

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-[#FF0000] flex items-center justify-center shadow-xs">
                <Upload className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Arrastra tu imagen para {tool.name.toLowerCase()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  o haz clic para buscar en tu dispositivo
                </p>
              </div>

              <button
                type="button"
                className="px-6 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold text-xs rounded-xl shadow-xs transition-all pointer-events-none"
              >
                Seleccionar imagen
              </button>

              <span className="text-[11px] text-gray-400 font-medium">
                Archivos recomendados: {tool.acceptedFormatsText}
              </span>
            </div>
          </div>

          <PrivacyBadge />
        </div>
      )}

      {/* Espacio Publicitario 2: Intermedio In-Content */}
      <AdPlacement slotId={`img-tool-mid-${tool.id}`} format="in-content" />

      {/* Rich Editorial & SEO Content Sections */}
      <div className="pt-8 border-t border-gray-200 dark:border-[#2E2E2E] space-y-8">
        {/* Step-by-Step How-To */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E] shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#FF0000]" />
            ¿Cómo usar esta herramienta paso a paso?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {tool.seo.howToSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] space-y-1.5 text-xs"
              >
                <span className="w-6 h-6 rounded-full bg-[#FF0000] text-white font-bold flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
                <p className="font-semibold text-gray-800 dark:text-gray-200 leading-relaxed pt-1">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Comparison Points */}
        {tool.seo.comparisonPoints.length > 0 && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              Comparativa Técnica y Cuándo Utilizar Cada Opción
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tool.seo.comparisonPoints.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 space-y-1 text-xs"
                >
                  <h3 className="font-extrabold text-indigo-950 dark:text-indigo-200 text-sm">
                    {pt.title}
                  </h3>
                  <p className="text-indigo-900/80 dark:text-indigo-300/80 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pro Tips */}
        {tool.seo.tipsToImprove.length > 0 && (
          <div className="p-6 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-3">
            <h2 className="text-base font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Consejos de Optimización para Creadores
            </h2>
            <ul className="space-y-2 text-xs text-amber-900/90 dark:text-amber-300/90 leading-relaxed list-disc list-inside font-medium">
              {tool.seo.tipsToImprove.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Espacio Publicitario 3: Entre Consejos y Preguntas Frecuentes */}
        <AdPlacement slotId={`img-tool-tips-${tool.id}`} format="horizontal-banner" />

        {/* FAQs Accordion with Schema.org metadata */}
        {tool.seo.faqs.length > 0 && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-[#2E2E2E] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#FF0000]" />
              Preguntas Frecuentes
            </h2>
            <div className="space-y-2">
              {tool.seo.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-gray-200 dark:border-[#2F2F2F] rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left font-bold text-xs text-gray-900 dark:text-white flex items-center justify-between gap-3 bg-gray-50 dark:bg-[#252525] hover:bg-gray-100 dark:hover:bg-[#2B2B2B] transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white dark:bg-[#1E1E1E] text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-200 dark:border-[#2F2F2F]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Espacio Publicitario 4: Inferior antes de Herramientas Relacionadas */}
        <AdPlacement slotId={`img-tool-bottom-${tool.id}`} format="horizontal-banner" />

        {/* Dynamic Related Tools using ToolRegistry */}
        <RegistryRelatedTools
          currentRoute={`/imagenes/${tool.slug}`}
          category="imagenes"
          onNavigate={onNavigate}
          title="Herramientas de Imagen Recomendadas"
        />
      </div>
    </div>
  );
};
