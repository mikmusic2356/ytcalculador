import React, { useState } from 'react';
import { SeoToolConfig, SeoSubcategory } from '../../types';
import { SEO_SUBCATEGORIES_CONFIG, SEO_TOOLS } from '../../data/seoToolsData';
import { SEOHead } from '../SEOHead';
import { AdPlacement } from '../AdPlacement';
import { FormulaExplanation } from './FormulaExplanation';
import {
  ChevronRight,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sliders,
  Search,
  Type,
  FileText,
  Hash,
  Tag,
  PieChart,
  Sparkle,
} from 'lucide-react';

import { Breadcrumbs } from '../Breadcrumbs';

interface SeoToolLayoutProps {
  tool: SeoToolConfig;
  children: React.ReactNode;
  onNavigate?: (slug: string) => void;
  onCategoryNavigate?: (categoryId: string) => void;
}

const getSubcategoryIcon = (subId: SeoSubcategory) => {
  switch (subId) {
    case 'keywords':
      return Search;
    case 'titulos':
      return Type;
    case 'descripciones':
      return FileText;
    case 'hashtags':
      return Hash;
    case 'tags':
      return Tag;
    case 'asistente':
      return PieChart;
    case 'limpieza':
      return Sparkle;
    default:
      return Search;
  }
};

export const SeoToolLayout: React.FC<SeoToolLayoutProps> = ({
  tool,
  children,
  onNavigate,
  onCategoryNavigate,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const subcategoryConfig = SEO_SUBCATEGORIES_CONFIG.find(
    (s) => s.id === tool.subcategory
  );

  const SubIcon = getSubcategoryIcon(tool.subcategory);

  const relatedTools = SEO_TOOLS.filter((t) =>
    tool.relatedSlugs?.includes(t.slug)
  );

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#0F0F0F] text-gray-900 dark:text-white transition-colors duration-200">
      {/* 1. Dynamic SEO Metadata & Schema.org */}
      <SEOHead
        title={tool.seo.title}
        description={tool.seo.metaDescription}
        route={`/seo/${tool.slug}`}
        faqs={tool.seo.faqs}
        howToSteps={tool.seo.howToSteps}
        toolName={tool.name}
        type="article"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        {/* 2. Breadcrumbs & Subcategories Navigation Bar */}
        <div className="space-y-4">
          <Breadcrumbs
            items={[
              { label: 'SEO para YouTube', path: '/seo' },
              ...(subcategoryConfig ? [{ label: subcategoryConfig.name, path: '/seo' }] : []),
              { label: tool.name },
            ]}
            onNavigate={(path) => {
              if (onCategoryNavigate) {
                if (path === '/') onCategoryNavigate('todos');
                else if (path === '/seo') onCategoryNavigate('seo');
                else onCategoryNavigate(path.replace(/^\//, ''));
              }
            }}
          />

          {/* Subcategory Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {SEO_SUBCATEGORIES_CONFIG.map((sub) => {
              const isActive = sub.id === tool.subcategory;
              const IconComp = getSubcategoryIcon(sub.id);
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    // Navigate to the first tool of that subcategory
                    const firstToolOfSub = SEO_TOOLS.find(
                      (t) => t.subcategory === sub.id
                    );
                    if (firstToolOfSub && onNavigate) {
                      onNavigate(firstToolOfSub.slug);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white dark:bg-[#1F1F1F] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] border border-gray-200 dark:border-[#333]'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Header Hero Section */}
        <header className="bg-white dark:bg-[#1A1A1A] rounded-3xl border border-gray-200 dark:border-[#2E2E2E] p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 dark:bg-red-500/20 text-[#FF0000] flex items-center justify-center shrink-0">
              <SubIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF0000]">
                  {subcategoryConfig?.name || 'SEO YouTube'}
                </span>
                {tool.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300">
                    {tool.badge}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  Actualizado {currentYear}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-1">
                {tool.seo.h1 || tool.name}
              </h1>
            </div>
          </div>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            {tool.shortDescription}
          </p>
        </header>

        {/* Ad Placement 1: Top Banner */}
        <AdPlacement slotId={`seo-top-${tool.id}`} format="horizontal-banner" />

        {/* 4. MAIN INTERACTIVE TOOL CONTAINER */}
        <main
          id="main-tool-execution-container"
          className="space-y-6"
        >
          {children}
        </main>

        {/* Ad Placement 2: Mid-Content Banner */}
        <AdPlacement slotId={`seo-mid-${tool.id}`} format="in-content" />

        {/* 5. Mathematical & Processing Formula Box */}
        <FormulaExplanation
          formulaDescription={
            tool.seo.summary ||
            'Esta herramienta procesa el texto en el navegador aplicando reglas heurísticas, patrones gramaticales en español y cálculos estadísticos directos sin depender de servidores externos.'
          }
          weights={[
            {
              factor: 'Análisis Léxico',
              percentage: '40%',
              explanation: 'Tokenización, eliminación de stopwords y extracción de términos sustantivos.',
            },
            {
              factor: 'Estructura Sintáctica',
              percentage: '35%',
              explanation: 'Comprobación de longitud, posición de palabras y formatos de marcado.',
            },
            {
              factor: 'Densidad y Frecuencia',
              percentage: '25%',
              explanation: 'Cálculo exacto de repeticiones y balance de caracteres.',
            },
          ]}
        />

        {/* 6. Step-by-Step Educational Guide */}
        {tool.seo.howToSteps && tool.seo.howToSteps.length > 0 && (
          <section className="bg-white dark:bg-[#1A1A1A] rounded-3xl border border-gray-200 dark:border-[#2E2E2E] p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Cómo Utilizar esta Herramienta Paso a Paso
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {tool.seo.howToSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-[#222222] border border-gray-100 dark:border-[#2C2C2C] space-y-2"
                >
                  <span className="w-7 h-7 rounded-xl bg-[#FF0000] text-white text-xs font-black flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Practical Tips & Recommendations */}
        {tool.seo.tipsToImprove && tool.seo.tipsToImprove.length > 0 && (
          <section className="bg-white dark:bg-[#1A1A1A] rounded-3xl border border-gray-200 dark:border-[#2E2E2E] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Consejos Prácticos para Mejorar tus Resultados
              </h2>
            </div>
            <div className="space-y-2.5">
              {tool.seo.tipsToImprove.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-gray-50 dark:bg-[#222222] rounded-xl border border-gray-100 dark:border-[#2C2C2C] flex items-start gap-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ad Placement 3: Bottom Banner */}
        <AdPlacement slotId={`seo-bottom-${tool.id}`} format="horizontal-banner" />

        {/* 8. Frequently Asked Questions (FAQ) */}
        {tool.seo.faqs && tool.seo.faqs.length > 0 && (
          <section className="bg-white dark:bg-[#1A1A1A] rounded-3xl border border-gray-200 dark:border-[#2E2E2E] p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Preguntas Frecuentes
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Respuestas claras y fundamentadas sobre SEO y metadatos de YouTube
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {tool.seo.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-gray-200 dark:border-[#2D2D2D] rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left bg-gray-50/50 dark:bg-[#202020]/50 hover:bg-gray-100/50 dark:hover:bg-[#242424] cursor-pointer"
                    >
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {faq.question}
                      </span>
                      <div className="p-1 rounded-md text-gray-400">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="p-4 sm:p-5 bg-white dark:bg-[#1A1A1A] border-t border-gray-100 dark:border-[#2D2D2D] text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 5-Paragraph Comprehensive Blog for SEO Tools */}
        <section className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 sm:p-8 space-y-6 text-[#212121] dark:text-gray-200 shadow-xs">
          <div className="border-b border-gray-100 dark:border-[#2A2A2A] pb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-950/50 text-[#FF0000] dark:text-[#FF4E45] text-xs font-bold rounded-md mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Análisis Metodológico y Guía Editorial</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#212121] dark:text-white tracking-tight">
              Guía técnica y estratégica: {tool.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Descubre los fundamentos algorítmicos, el origen en los motores de búsqueda, el método de procesamiento y las mejores prácticas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {/* Párrafo 1 */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200/80 dark:border-[#2F2F2F] space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-[#212121] dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center text-xs font-black">1</span>
                ¿Qué es y cuál es el concepto de {tool.name}?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                <strong>{tool.name}</strong> es una herramienta de procesamiento de lenguaje natural (PLN) y optimización de metadatos creada para creadores de contenido de YouTube. Su función primordial es estructurar, analizar y perfeccionar la información textual que acompaña a tus videos (como títulos, descripciones, etiquetas y capítulos temporales) para que los sistemas de indexación de Google y YouTube interpreten con máxima fidelidad la temática, el valor y el público objetivo de cada publicación.
              </p>
            </div>

            {/* Párrafo 2 */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200/80 dark:border-[#2F2F2F] space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-[#212121] dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-black">2</span>
                Origen y evolución: ¿De dónde surge el SEO para video en YouTube?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                Desde la creación de YouTube en 2005 y su compra por Google, la plataforma se convirtió en el segundo motor de búsqueda más utilizado del planeta. Históricamente, los sistemas de recomendación dependían exclusivamente de palabras clave en etiquetas y títulos. Con el desarrollo de redes neuronales profundas (Deep Neural Networks) y modelos semánticos en 2016, YouTube empezó a priorizar la concordancia de intención de búsqueda, la naturalidad sintáctica y la coherencia semántica entre el título, la miniatura y la descripción.
              </p>
            </div>

            {/* Párrafo 3 */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200/80 dark:border-[#2F2F2F] space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-[#212121] dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-black">3</span>
                ¿Cómo procesa y calcula los resultados esta herramienta?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                La herramienta opera ejecutando algoritmos de segmentación textual, conteo de caracteres con límites de truncamiento en dispositivos móviles (como el límite de 60-70 caracteres en títulos visibles o los 5000 caracteres de descripciones), extracción de palabras clave long-tail y limpieza de caracteres inválidos. Todo el análisis se realiza de forma local en tu navegador con latencia cero, asegurando que tus datos y estrategias de contenido se mantengan privados.
              </p>
            </div>

            {/* Párrafo 4 */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200/80 dark:border-[#2F2F2F] space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-[#212121] dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-black">4</span>
                ¿Para qué sirve y cómo impacta en el crecimiento de tu canal?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                Implementar esta herramienta te permite evitar errores críticos como el *"keyword stuffing"* (relleno forzado de palabras clave) que puede ser penalizado por las políticas de spam de YouTube. Además, optimiza la legibilidad en pantallas de smartphones (donde se genera más del 70% del consumo), mejora la tasa de clics (CTR) orgánica y permite que tus videos antiguos sigan recibiendo tráfico continuo mediante búsquedas sugeridas a lo largo de los meses.
              </p>
            </div>

            {/* Párrafo 5 */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200/80 dark:border-[#2F2F2F] space-y-1.5">
              <h3 className="text-sm sm:text-base font-bold text-[#212121] dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-black">5</span>
                Casos de uso prácticos y aplicaciones reales
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                <strong>Caso 1: Lanzamiento de nuevo video:</strong> Un creador redacta 3 variaciones de título y utiliza la herramienta para verificar que la palabra clave principal no quede cortada por puntos suspensivos en móviles. <strong>Caso 2: Auditoría de catálogo:</strong> Un canal educativo revisa sus videos con bajo rendimiento para reorganizar las descripciones agregando marcas de tiempo (capítulos) y enlaces limpios, reactivando las visitas en YouTube Search y Google Video Search.
              </p>
            </div>
          </div>
        </section>

        {/* 9. Related Tools Carousel / Grid */}
        {relatedTools.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF0000]" />
                  Herramientas Relacionadas Recomendadas
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Combina estas utilidades para preparar un paquete de metadatos integral
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedTools.map((relTool) => (
                <div
                  key={relTool.id}
                  onClick={() => onNavigate && onNavigate(relTool.slug)}
                  className="p-5 bg-white dark:bg-[#1A1A1A] hover:bg-gray-50 dark:hover:bg-[#222222] border border-gray-200 dark:border-[#2E2E2E] rounded-2xl shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-[#FF0000] uppercase tracking-wider">
                      {relTool.subcategory}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#FF0000] transition-colors">
                      {relTool.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {relTool.tagline}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-gray-100 dark:border-[#2A2A2A] flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-[#FF0000]">
                    <span>Abrir herramienta</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
