import React, { useState } from 'react';
import { BookOpen, Clock, Calendar, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { GUIDES } from '../data/guides';
import { GuideArticle } from '../types';
import { CALCULATORS } from '../data/calculators';
import { CalculatorCard } from '../components/CalculatorCard';
import { AdPlacement } from '../components/AdPlacement';

interface GuidesPageProps {
  onNavigateTool: (slug: string) => void;
  initialGuideSlug?: string | null;
}

export const GuidesPage: React.FC<GuidesPageProps> = ({ onNavigateTool, initialGuideSlug }) => {
  const [selectedGuide, setSelectedGuide] = useState<GuideArticle | null>(() => {
    if (initialGuideSlug) {
      return GUIDES.find((g) => g.slug === initialGuideSlug) || null;
    }
    return null;
  });

  if (selectedGuide) {
    const relatedTools = CALCULATORS.filter((c) => selectedGuide.relatedToolSlugs.includes(c.slug));

    return (
      <div id="guide-article-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <button
          onClick={() => setSelectedGuide(null)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-[#FF0000] dark:hover:text-[#FF4E45] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a todas las guías
        </button>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="px-2.5 py-0.5 rounded-md bg-red-50 dark:bg-red-950/40 text-[#FF0000] dark:text-[#FF4E45] font-bold uppercase text-[10px]">
              {selectedGuide.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {selectedGuide.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {selectedGuide.date}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#212121] dark:text-white tracking-tight leading-tight">
            {selectedGuide.title}
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium bg-gray-50 dark:bg-[#1F1F1F] p-4 rounded-xl border border-gray-200 dark:border-[#2F2F2F]">
            {selectedGuide.summary}
          </p>
        </div>

        <AdPlacement slotId={`guide-top-${selectedGuide.id}`} format="horizontal-banner" />

        {/* Article Body */}
        <article className="prose prose-zinc dark:prose-invert max-w-none text-[#212121] dark:text-gray-200 text-sm leading-relaxed space-y-4 whitespace-pre-line bg-white dark:bg-[#1F1F1F] p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-[#2F2F2F] shadow-xs">
          {selectedGuide.content}
        </article>

        {/* Related Calculators */}
        {relatedTools.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-[#2F2F2F]">
            <h3 className="text-base font-bold text-[#212121] dark:text-white">
              Calculadoras recomendadas para esta guía:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedTools.map((tool) => (
                <CalculatorCard key={tool.id} tool={tool} onSelect={onNavigateTool} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="guides-list-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-[#FF0000] dark:text-[#FF4E45] text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Guías Estratégicas para Creadores de Contenido</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#212121] dark:text-white tracking-tight">
          Aprende a Escalar tu Canal y Optimizar tus Ingresos
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed">
          Artículos formativos escritos con datos reales del algoritmo de YouTube, métricas de retención y consejos prácticos para maximizar tu RPM y reproducciones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {GUIDES.map((guide) => (
          <div
            key={guide.id}
            onClick={() => setSelectedGuide(guide)}
            className="p-5 bg-white dark:bg-[#1F1F1F] rounded-xl border border-gray-200 dark:border-[#2F2F2F] hover:border-red-300 dark:hover:border-red-800 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="px-2.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-[#FF0000] dark:text-[#FF4E45] font-bold uppercase text-[10px]">
                  {guide.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {guide.readTime}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#212121] dark:text-white hover:text-[#FF0000] dark:hover:text-[#FF4E45] transition-colors leading-snug">
                {guide.title}
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                {guide.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2F2F2F] flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{guide.date}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedGuide(guide);
                }}
                className="text-xs font-bold text-[#FF0000] dark:text-[#FF4E45] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Leer guía <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
