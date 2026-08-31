import React, { useState } from 'react';
import { Search, Sparkles, DollarSign, TrendingUp, Film } from 'lucide-react';
import { CALCULATORS, CATEGORIES, INCOME_SUBCATEGORIES, ANALYTICS_SUBCATEGORIES, VIDEO_SUBCATEGORIES } from '../data/calculators';
import { CalculatorCard } from '../components/CalculatorCard';
import { ToolCategory, IncomeSubcategory, AnalyticsSubcategory, VideoSubcategory } from '../types';
import { AdPlacement } from '../components/AdPlacement';

interface CalculatorsDirectoryProps {
  onNavigateTool: (slug: string) => void;
  initialCategory?: ToolCategory | 'all';
}

export const CalculatorsDirectory: React.FC<CalculatorsDirectoryProps> = ({
  onNavigateTool,
  initialCategory = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<IncomeSubcategory | AnalyticsSubcategory | VideoSubcategory | 'all'>('all');
  const [query, setQuery] = useState('');

  const filtered = CALCULATORS.filter((tool) => {
    const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSub =
      selectedSubcategory === 'all' ||
      tool.subcategory === selectedSubcategory;
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      tool.name.toLowerCase().includes(q) ||
      tool.shortDescription.toLowerCase().includes(q) ||
      tool.seo.keywords.some((k) => k.toLowerCase().includes(q));

    return matchesCat && matchesSub && matchesQuery;
  });

  return (
    <div id="calculators-directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-950/50 text-[#FF0000] dark:text-[#FF4E45] rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{CALCULATORS.length} Herramientas Matemáticas Verificadas</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#212121] dark:text-white tracking-tight">
          Directorio de Calculadoras para YouTube
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed">
          Explora nuestra biblioteca especializada en ingresos de YouTube, métricas de retención, CTR, conversiones, proyecciones compuestas, YouTube Shorts y objetivos financieros. Todas las herramientas son 100% gratuitas, sin registro y basadas en fórmulas matemáticas transparentes.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="space-y-3 p-4 bg-white dark:bg-[#1F1F1F] rounded-xl border border-gray-200 dark:border-[#2F2F2F] shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="directory-search-input"
              type="text"
              placeholder="Buscar calculadora (ej. CTR, Retención, RPM, Shorts)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-[#272727] border border-transparent dark:border-[#383838] rounded-full text-xs font-semibold text-[#212121] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-[#FF0000] outline-none"
            />
          </div>

          {/* Main Category Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubcategory('all');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#FF0000] text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#333333] text-gray-700 dark:text-gray-200'
              }`}
            >
              Todas ({CALCULATORS.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.id === 'imagenes') {
                    onNavigateTool('imagenes');
                    return;
                  }
                  if (cat.id === 'seo') {
                    onNavigateTool('seo');
                    return;
                  }
                  setSelectedCategory(cat.id);
                  setSelectedSubcategory('all');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF0000] text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#333333] text-gray-700 dark:text-gray-200'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Subcategory Pills for "Dinero e ingresos" */}
        {selectedCategory === 'ingresos' && (
          <div className="pt-3 border-t border-gray-100 dark:border-[#2F2F2F] flex flex-wrap items-center gap-2 animate-in fade-in duration-200">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mr-1 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#FF0000]" />
              Subcategorías de Ingresos:
            </span>
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedSubcategory === 'all'
                  ? 'bg-zinc-800 dark:bg-white text-white dark:text-[#121212]'
                  : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333]'
              }`}
            >
              Todas de Ingresos (14)
            </button>
            {INCOME_SUBCATEGORIES.map((sub) => {
              const count = CALCULATORS.filter(
                (c) => c.category === 'ingresos' && c.subcategory === sub.id
              ).length;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.id as IncomeSubcategory)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    selectedSubcategory === sub.id
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <span>{sub.emoji}</span>
                  <span>{sub.name}</span>
                  <span className="opacity-70 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Subcategory Pills for "Analytics de YouTube" */}
        {selectedCategory === 'analytics' && (
          <div className="pt-3 border-t border-gray-100 dark:border-[#2F2F2F] flex flex-wrap items-center gap-2 animate-in fade-in duration-200">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mr-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#FF0000]" />
              Subcategorías de Analytics:
            </span>
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedSubcategory === 'all'
                  ? 'bg-zinc-800 dark:bg-white text-white dark:text-[#121212]'
                  : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333]'
              }`}
            >
              Todas de Analytics (17)
            </button>
            {ANALYTICS_SUBCATEGORIES.map((sub) => {
              const count = CALCULATORS.filter(
                (c) => c.category === 'analytics' && c.subcategory === sub.id
              ).length;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.id as AnalyticsSubcategory)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    selectedSubcategory === sub.id
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <span>{sub.emoji}</span>
                  <span>{sub.name}</span>
                  <span className="opacity-70 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Subcategory Pills for "Video y Producción" */}
        {selectedCategory === 'video' && (
          <div className="pt-3 border-t border-gray-100 dark:border-[#2F2F2F] flex flex-wrap items-center gap-2 animate-in fade-in duration-200">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mr-1 flex items-center gap-1">
              <Film className="w-3.5 h-3.5 text-[#FF0000]" />
              Subcategorías de Video:
            </span>
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedSubcategory === 'all'
                  ? 'bg-zinc-800 dark:bg-white text-white dark:text-[#121212]'
                  : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333]'
              }`}
            >
              Todas de Video ({CALCULATORS.filter((c) => c.category === 'video').length})
            </button>
            {VIDEO_SUBCATEGORIES.map((sub) => {
              const count = CALCULATORS.filter(
                (c) => c.category === 'video' && c.subcategory === sub.id
              ).length;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.id as VideoSubcategory)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    selectedSubcategory === sub.id
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <span>{sub.emoji}</span>
                  <span>{sub.name}</span>
                  <span className="opacity-70 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1F1F1F] rounded-xl border border-dashed border-gray-300 dark:border-[#383838]">
            <p className="text-base font-bold text-[#212121] dark:text-white">No encontramos herramientas con ese criterio</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Intenta con otro término o limpia los filtros.</p>
          </div>
        ) : (
          filtered.map((tool) => (
            <CalculatorCard key={tool.id} tool={tool} onSelect={onNavigateTool} />
          ))
        )}
      </div>

      <AdPlacement slotId="directory-bottom" format="horizontal-banner" />
    </div>
  );
};

