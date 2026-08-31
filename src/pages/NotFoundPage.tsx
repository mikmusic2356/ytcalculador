import React, { useState } from 'react';
import { Search, Home, Flame, Layers, ArrowRight } from 'lucide-react';
import { ToolRegistry } from '../services/toolRegistry';
import { SEOHead } from '../components/SEOHead';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
  onOpenSearch?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const allTools = ToolRegistry.getAll().filter((t) => t.published && t.route && t.route.startsWith('/'));

  const popularTools = allTools
    .filter((t) => t.kind !== 'static')
    .slice(0, 6);

  const searchResults = query.trim()
    ? allTools
        .filter(
          (t) =>
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.route.toLowerCase().includes(query.toLowerCase()) ||
            t.shortDescription.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <div className="min-h-[75vh] flex flex-col justify-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEOHead
        title="404: Página no encontrada | YouTubeCalculador"
        description="La página o herramienta que buscas no existe o ha sido movida. Explora nuestras calculadoras de YouTube, asistente de imágenes y suite SEO."
        robots="noindex, follow"
      />

      {/* Hero 404 */}
      <div className="text-center space-y-4">
        <span className="px-3.5 py-1 text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-950/50 rounded-full border border-red-200 dark:border-red-900/40">
          Error 404
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
          Página no encontrada
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          La ruta que intentas visitar no existe o ha cambiado de dirección. Utiliza el buscador o navega por nuestras herramientas más populares.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto pt-2 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar herramienta por nombre o tema (ej. RPM, JPG, SEO)..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1E1E1E] border border-zinc-300 dark:border-[#383838] rounded-2xl text-xs sm:text-sm font-medium text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-red-600 outline-none shadow-xs transition-all"
            />
          </div>

          {/* Quick search dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-zinc-200 dark:border-[#333] shadow-xl p-2 z-20 divide-y divide-zinc-100 dark:divide-[#2F2F2F]">
              {searchResults.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => onNavigate(tool.route)}
                  className="w-full p-2.5 text-left hover:bg-zinc-50 dark:hover:bg-[#272727] rounded-xl flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-red-600">
                      {tool.name}
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">{tool.route}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-600" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('/')}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-full transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Ir al Inicio</span>
          </button>
          <button
            onClick={() => onNavigate('/calculadoras')}
            className="px-5 py-2.5 bg-white dark:bg-[#1E1E1E] border border-zinc-300 dark:border-[#383838] hover:bg-zinc-50 dark:hover:bg-[#2A2A2A] text-zinc-800 dark:text-zinc-200 font-bold text-xs sm:text-sm rounded-full transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Ver Calculadoras</span>
          </button>
        </div>
      </div>

      {/* Main Hub Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('/calculadoras')}
          className="p-5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-zinc-200 dark:border-[#2F2F2F] hover:border-red-600 text-left transition-all group cursor-pointer"
        >
          <span className="text-2xl mb-2 block">📊</span>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-red-600 transition-colors">
            Calculadoras de YouTube
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Calcula RPM, CPM, ganancias de Shorts y métricas de retención.
          </p>
        </button>

        <button
          onClick={() => onNavigate('/imagenes')}
          className="p-5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-zinc-200 dark:border-[#2F2F2F] hover:border-red-600 text-left transition-all group cursor-pointer"
        >
          <span className="text-2xl mb-2 block">🖼️</span>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-red-600 transition-colors">
            Asistente de Imágenes
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Convierte JPG, PNG, WebP, comprime y recorta 100% en tu navegador.
          </p>
        </button>

        <button
          onClick={() => onNavigate('/seo')}
          className="p-5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-zinc-200 dark:border-[#2F2F2F] hover:border-red-600 text-left transition-all group cursor-pointer"
        >
          <span className="text-2xl mb-2 block">🔎</span>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-red-600 transition-colors">
            Suite SEO para YouTube
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Generador de keywords, fórmulas de títulos, tags y auditoría.
          </p>
        </button>
      </div>

      {/* Popular Tools Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-red-600 fill-red-600" />
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            Herramientas Más Utilizadas
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {popularTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onNavigate(tool.route)}
              className="p-4 rounded-xl bg-white dark:bg-[#1E1E1E] border border-zinc-200 dark:border-[#2F2F2F] hover:border-red-600 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-[#272727]">
                  {tool.category}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-600 transition-all" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white group-hover:text-red-600 transition-colors">
                {tool.name}
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                {tool.shortDescription}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
