import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  X,
  TrendingUp,
  DollarSign,
  BarChart3,
  MousePointerClick,
  Clock,
  Users,
  Zap,
  Activity,
  Sliders,
  HardDrive,
  Target,
  Calendar,
  CalendarDays,
  Globe,
  Scale,
  Calculator,
  ArrowRight,
  Image as ImageIcon,
  RefreshCw,
  Minimize2,
  Scaling,
  Crop,
  ShieldCheck,
} from 'lucide-react';
import { CALCULATORS } from '../data/calculators';
import { IMAGE_TOOLS } from '../data/imageToolsData';
import { SEO_TOOLS } from '../data/seoToolsData';
import { CalculatorConfig } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (slug: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="w-5 h-5 text-[#FF0000]" />,
  DollarSign: <DollarSign className="w-5 h-5 text-[#FF0000]" />,
  BarChart3: <BarChart3 className="w-5 h-5 text-[#FF0000]" />,
  MousePointerClick: <MousePointerClick className="w-5 h-5 text-[#FF0000]" />,
  Clock: <Clock className="w-5 h-5 text-[#FF0000]" />,
  Users: <Users className="w-5 h-5 text-[#FF0000]" />,
  Zap: <Zap className="w-5 h-5 text-[#FF0000]" />,
  Activity: <Activity className="w-5 h-5 text-[#FF0000]" />,
  Sliders: <Sliders className="w-5 h-5 text-[#FF0000]" />,
  HardDrive: <HardDrive className="w-5 h-5 text-[#FF0000]" />,
  Target: <Target className="w-5 h-5 text-[#FF0000]" />,
  Calendar: <Calendar className="w-5 h-5 text-[#FF0000]" />,
  CalendarDays: <CalendarDays className="w-5 h-5 text-[#FF0000]" />,
  Globe: <Globe className="w-5 h-5 text-[#FF0000]" />,
  Scale: <Scale className="w-5 h-5 text-[#FF0000]" />,
  Calculator: <Calculator className="w-5 h-5 text-[#FF0000]" />,
  Image: <ImageIcon className="w-5 h-5 text-[#FF0000]" />,
  RefreshCw: <RefreshCw className="w-5 h-5 text-[#FF0000]" />,
  Minimize2: <Minimize2 className="w-5 h-5 text-[#FF0000]" />,
  Scaling: <Scaling className="w-5 h-5 text-[#FF0000]" />,
  Crop: <Crop className="w-5 h-5 text-[#FF0000]" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-[#FF0000]" />,
};

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectTool }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredCalculators = CALCULATORS.filter((calc) => {
    if (!q) return true;
    return (
      calc.name.toLowerCase().includes(q) ||
      calc.shortDescription.toLowerCase().includes(q) ||
      calc.tagline.toLowerCase().includes(q) ||
      calc.seo.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const filteredImageTools = IMAGE_TOOLS.filter((tool) => {
    if (!q) return true;
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.shortDescription.toLowerCase().includes(q) ||
      tool.tagline.toLowerCase().includes(q) ||
      tool.seo.keywords.some((k) => k.toLowerCase().includes(q)) ||
      'asistente de imagenes convertir comprimir formato recortar redimensionar favicon metadata exif'.includes(q)
    );
  });

  const filteredSeoTools = SEO_TOOLS.filter((tool) => {
    if (!q) return true;
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.shortDescription.toLowerCase().includes(q) ||
      tool.seo.keywords.some((k) => k.toLowerCase().includes(q)) ||
      'seo youtube palabras clave titulos descripciones tags hashtags capitulos'.includes(q)
    );
  });

  const totalResults =
    filteredCalculators.length + filteredImageTools.length + filteredSeoTools.length;

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="search-modal-container"
        className="w-full max-w-2xl bg-white dark:bg-[#1F1F1F] rounded-xl shadow-2xl border border-gray-200 dark:border-[#2F2F2F] overflow-hidden text-[#212121] dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input bar */}
        <div className="p-4 border-b border-gray-100 dark:border-[#2F2F2F] flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
          <input
            ref={inputRef}
            id="search-tools-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="¿Qué quieres calcular o convertir? (ej. RPM, CTR, PNG a JPG, WebP, comprimir...)"
            className="w-full text-sm font-semibold bg-transparent border-none outline-none text-[#212121] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[10px] font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-[#2A2A2A] px-2 py-1 rounded">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-gray-100 dark:divide-[#2A2A2A]">
          {totalResults === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p className="text-sm font-bold">No encontramos ninguna herramienta con ese término</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Prueba buscando "RPM", "Shorts", "JPG a PNG", "comprimir" o "CTR".
              </p>
            </div>
          ) : (
            <>
              {/* Image Tools Results */}
              {filteredImageTools.length > 0 && (
                <div className="pb-2">
                  <div className="px-3 py-1.5 text-[11px] font-extrabold text-[#FF0000] uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" /> Asistente de Imágenes (100% Local)
                  </div>
                  {filteredImageTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        onSelectTool(`imagenes/${tool.slug}`);
                        onClose();
                      }}
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-[#272727] rounded-lg transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 bg-red-50 dark:bg-red-950/40 text-[#FF0000] rounded-lg flex items-center justify-center group-hover:bg-[#FF0000] group-hover:text-white transition-colors shrink-0">
                          {ICON_MAP[tool.iconName] || <ImageIcon className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#212121] dark:text-white group-hover:text-[#FF0000] transition-colors">
                              {tool.name}
                            </span>
                            {tool.badge && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                            {tool.shortDescription}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF0000] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}

              {/* SEO Tools Results */}
              {filteredSeoTools.length > 0 && (
                <div className="pb-2">
                  <div className="px-3 py-1.5 text-[11px] font-extrabold text-[#FF0000] uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" /> 🔎 SEO para YouTube (23 Herramientas)
                  </div>
                  {filteredSeoTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        onSelectTool(`seo/${tool.slug}`);
                        onClose();
                      }}
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-[#272727] rounded-lg transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 bg-red-50 dark:bg-red-950/40 text-[#FF0000] rounded-lg flex items-center justify-center group-hover:bg-[#FF0000] group-hover:text-white transition-colors shrink-0">
                          <Search className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#212121] dark:text-white group-hover:text-[#FF0000] transition-colors">
                              {tool.name}
                            </span>
                            {tool.badge && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                            {tool.shortDescription}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF0000] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}

              {/* Calculators Results */}
              {filteredCalculators.map((tool: CalculatorConfig) => (
                <button
                  key={tool.id}
                  id={`search-result-${tool.id}`}
                  onClick={() => {
                    onSelectTool(tool.slug);
                    onClose();
                  }}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-[#272727] rounded-lg transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-red-50 dark:bg-red-950/40 text-[#FF0000] dark:text-[#FF4E45] rounded-lg flex items-center justify-center group-hover:bg-[#FF0000] group-hover:text-white dark:group-hover:text-white transition-colors shrink-0">
                      {ICON_MAP[tool.iconName] || <TrendingUp className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#212121] dark:text-white group-hover:text-[#FF0000] dark:group-hover:text-[#FF4E45] transition-colors">
                          {tool.name}
                        </span>
                        {tool.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{tool.shortDescription}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-[#FF0000] dark:group-hover:text-[#FF4E45] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </>
          )}
        </div>

        {/* Quick Footer */}
        <div className="p-3 bg-gray-50 dark:bg-[#181818] border-t border-gray-100 dark:border-[#2F2F2F] flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
          <span>{totalResults} herramientas disponibles</span>
          <span>100% Gratuitas, locales y sin registro</span>
        </div>
      </div>
    </div>
  );
};


