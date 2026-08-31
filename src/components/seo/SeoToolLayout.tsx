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
