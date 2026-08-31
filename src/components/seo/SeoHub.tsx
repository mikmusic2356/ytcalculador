import React, { useState, useMemo } from 'react';
import { SEO_TOOLS, SEO_SUBCATEGORIES_CONFIG } from '../../data/seoToolsData';
import { SeoSubcategory } from '../../types';
import { AdPlacement } from '../AdPlacement';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Type,
  FileText,
  Hash,
  Tag,
  PieChart,
  Sparkle,
  Sliders,
  CheckCircle2,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface SeoHubProps {
  onNavigate: (path: string) => void;
}

export const SeoHub: React.FC<SeoHubProps> = ({ onNavigate }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTools = useMemo(() => {
    return SEO_TOOLS.filter((tool) => {
      const matchesSub =
        selectedSubcategory === 'todos' || tool.subcategory === selectedSubcategory;
      const matchesSearch =
        !searchQuery.trim() ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.seo.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSub && matchesSearch;
    });
  }, [selectedSubcategory, searchQuery]);

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

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#0F0F0F] text-gray-900 dark:text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Hero Header */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl border border-gray-200 dark:border-[#2E2E2E] p-6 sm:p-10 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/40 text-[#FF0000]">
              Categoría 5 • Optimización Textual y Metadatos
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
              ⚡ 23 Herramientas 100% Gratuitas
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
              🔎 SEO para YouTube
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
              Investiga palabras clave, estructura títulos persuasivos, prepara descripciones con capítulos, genera hashtags y audita la coherencia de tus metadatos antes de publicar.
            </p>
          </div>

          {/* Ethics & Processing Notice */}
          <div className="p-4 bg-gray-50 dark:bg-[#222222] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] flex items-start gap-3 text-xs text-gray-600 dark:text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p>
              <strong>Metodología Transparente y Procesamiento Local:</strong> Las evaluaciones se basan en reglas lingüísticas, límites de visualización de YouTube y análisis estadístico en tu navegador. No prometemos fórmulas mágicas para engañar al algoritmo; te ayudamos a crear metadatos claros y ordenados para tu audiencia y motores de búsqueda.
            </p>
          </div>
        </div>

        {/* Ad Placement: Top Banner */}
        <AdPlacement slotId="seo-hub-top" format="horizontal-banner" />

        {/* Filters & Search Control Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar entre las 23 herramientas de SEO..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-2xl text-xs sm:text-sm text-gray-900 dark:text-white outline-hidden shadow-xs"
              />
            </div>

            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 shrink-0">
              Mostrando {filteredTools.length} de {SEO_TOOLS.length} herramientas
            </span>
          </div>

          {/* Subcategory Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setSelectedSubcategory('todos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedSubcategory === 'todos'
                  ? 'bg-[#FF0000] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252525] border border-gray-200 dark:border-[#333]'
              }`}
            >
              ⭐ Todas ({SEO_TOOLS.length})
            </button>
            {SEO_SUBCATEGORIES_CONFIG.map((sub) => {
              const IconComp = getSubcategoryIcon(sub.id);
              const count = SEO_TOOLS.filter((t) => t.subcategory === sub.id).length;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubcategory(sub.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedSubcategory === sub.id
                      ? 'bg-[#FF0000] text-white shadow-xs'
                      : 'bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252525] border border-gray-200 dark:border-[#333]'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>
                    {sub.name} ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => {
            const SubIcon = getSubcategoryIcon(tool.subcategory);
            return (
              <div
                key={tool.id}
                onClick={() => onNavigate(`/seo/${tool.slug}`)}
                className="group bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] hover:border-red-400 dark:hover:border-red-600/50 p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 text-[#FF0000] flex items-center justify-center">
                      <SubIcon className="w-5 h-5" />
                    </div>
                    {tool.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[#FF0000] transition-colors line-clamp-1">
                      {tool.name}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {tool.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-[#2A2A2A] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    {tool.subcategory}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF0000] group-hover:translate-x-1 transition-transform">
                    <span>Abrir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ad Placement: Mid Content Banner */}
        <AdPlacement slotId="seo-hub-mid" format="horizontal-banner" />

        {/* Educational Pillar Section */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl border border-gray-200 dark:border-[#2E2E2E] p-6 sm:p-10 space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Principios Clave del SEO en YouTube para Creadores
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Guía técnica y mejores prácticas para optimizar tus videos de forma honesta y efectiva.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2 p-5 bg-gray-50 dark:bg-[#222222] rounded-2xl border border-gray-100 dark:border-[#2C2C2C]">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-[#FF0000]" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Títulos Claros y Front-Loaded
                </h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Coloca la palabra clave o el valor principal en los primeros 45 caracteres. Los usuarios móviles solo ven hasta ~60 caracteres antes de que el texto sea cortado.
              </p>
            </div>

            <div className="space-y-2 p-5 bg-gray-50 dark:bg-[#222222] rounded-2xl border border-gray-100 dark:border-[#2C2C2C]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  El Primer Pliegue de la Descripción
                </h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Las primeras 3 líneas (hasta 200 caracteres) son visibles antes de presionar "Mostrar más". Escribe aquí el gancho principal y tu palabra clave.
              </p>
            </div>

            <div className="space-y-2 p-5 bg-gray-50 dark:bg-[#222222] rounded-2xl border border-gray-100 dark:border-[#2C2C2C]">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Etiquetas y Errores Ortográficos
                </h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                YouTube utiliza las etiquetas principalmente si el contenido suele escribirse con errores comunes. Mantén tus etiquetas enfocadas y no superes los 500 caracteres.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
