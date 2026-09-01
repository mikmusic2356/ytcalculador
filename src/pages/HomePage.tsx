import React, { useState } from 'react';
import {
  Search,
  TrendingUp,
  Award,
  ArrowRight,
  DollarSign,
  Clock,
  MousePointerClick,
  CheckCircle2,
  Target,
  Zap,
  Globe,
  Sliders,
  Sparkles,
  Activity,
  Users,
  Columns,
} from 'lucide-react';
import { CALCULATORS, CATEGORIES, INCOME_SUBCATEGORIES, ANALYTICS_SUBCATEGORIES, VIDEO_SUBCATEGORIES } from '../data/calculators';
import { CalculatorCard } from '../components/CalculatorCard';
import { AdPlacement } from '../components/AdPlacement';
import { ToolCategory, IncomeSubcategory, AnalyticsSubcategory, VideoSubcategory } from '../types';

interface HomePageProps {
  onNavigateTool: (slug: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateTool, onOpenSearch }) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<IncomeSubcategory | AnalyticsSubcategory | VideoSubcategory | 'all'>('all');

  // Interactive Live Mini RPM widget
  const [miniViews, setMiniViews] = useState<number>(100000);
  const [miniRevenue, setMiniRevenue] = useState<number>(350);

  const miniRpm = miniViews > 0 ? ((miniRevenue / miniViews) * 1000).toFixed(2) : '0.00';
  const rpmRatio = Math.min(Math.max((Number(miniRpm) / 6) * 100, 10), 100);

  const popularTools = CALCULATORS.filter((c) => c.popularRank && c.popularRank <= 6).sort(
    (a, b) => (a.popularRank || 99) - (b.popularRank || 99)
  );

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSearch.trim()) {
      onOpenSearch();
      return;
    }
    const match = CALCULATORS.find(
      (c) =>
        c.name.toLowerCase().includes(heroSearch.toLowerCase()) ||
        c.shortDescription.toLowerCase().includes(heroSearch.toLowerCase()) ||
        c.seo.keywords.some((k) => k.toLowerCase().includes(heroSearch.toLowerCase()))
    );
    if (match) {
      onNavigateTool(match.slug);
    } else {
      onOpenSearch();
    }
  };

  const filteredCategoryTools = CALCULATORS.filter((c) => {
    const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchSub =
      selectedSubcategory === 'all' ||
      c.subcategory === selectedSubcategory;
    return matchCat && matchSub;
  });

  return (
    <div id="homepage-container" className="space-y-8 sm:space-y-12 pb-16">
      {/* 1. Header Banner */}
      <section className="bg-white dark:bg-[#181818] border-b border-gray-200 dark:border-[#272727] py-6 sm:py-8 px-4 sm:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plataforma #1 de Estimación para Creadores</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#212121] dark:text-white leading-tight tracking-tight mb-2">
              Calculadoras de Ingresos y Métricas de YouTube
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
              Calcula ingresos por AdSense, RPM, CPM, ganancias en Shorts, metas en dólares ($100, $500, $1.000) y optimiza tu canal con fórmulas matemáticas explícitas.
            </p>
          </div>

          {/* Quick Search on Banner */}
          <form onSubmit={handleHeroSearchSubmit} className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="¿Qué quieres calcular? (ej. RPM, $100, Shorts)..."
              className="w-full bg-gray-100 dark:bg-[#272727] border border-transparent dark:border-[#383838] rounded-full pl-9 pr-4 py-2 text-xs text-[#212121] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-[#FF0000] outline-none"
            />
          </form>
        </div>
      </section>

      {/* 2. Main 12-col Showcase Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Col 8: Fast Grid + Live Interactive Calculator */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Quick 4-box Category Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Ganancias de YouTube */}
              <div
                onClick={() => onNavigateTool('calculadora-ganancias-youtube')}
                className="bg-white dark:bg-[#1F1F1F] border border-gray-200 dark:border-[#2F2F2F] p-4 rounded-xl flex items-center gap-4 hover:border-red-300 dark:hover:border-red-800 transition-colors cursor-pointer shadow-xs group"
              >
                <div className="w-12 h-12 bg-red-50 dark:bg-red-950/40 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 group-hover:bg-[#FF0000] group-hover:text-white dark:group-hover:bg-[#FF0000] dark:group-hover:text-white transition-colors shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#212121] dark:text-white group-hover:text-[#FF0000] dark:group-hover:text-[#FF4E45] transition-colors">
                    Calculadora de Ganancias
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Estima ingresos diarios y mensuales</p>
                </div>
              </div>

              {/* Card 2: RPM (Featured) */}
              <div
                onClick={() => onNavigateTool('calculadora-rpm-youtube')}
                className="bg-white dark:bg-[#1F1F1F] border border-red-500 dark:border-red-500 p-4 rounded-xl flex items-center gap-4 shadow-md ring-1 ring-red-500/20 cursor-pointer"
              >
                <div className="w-12 h-12 bg-[#FF0000] rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#212121] dark:text-white">Calculadora de RPM</h3>
                  <p className="text-xs text-red-500 dark:text-red-400 font-medium">Ingreso neto por 1.000 vistas</p>
                </div>
              </div>

              {/* Card 3: Metas de Ingresos */}
              <div
                onClick={() => onNavigateTool('vistas-para-ganar-100-dolares')}
                className="bg-white dark:bg-[#1F1F1F] border border-gray-200 dark:border-[#2F2F2F] p-4 rounded-xl flex items-center gap-4 hover:border-red-300 dark:hover:border-red-800 transition-colors cursor-pointer shadow-xs group"
              >
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:bg-[#FF0000] group-hover:text-white dark:group-hover:bg-[#FF0000] dark:group-hover:text-white transition-colors shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#212121] dark:text-white group-hover:text-[#FF0000] dark:group-hover:text-[#FF4E45] transition-colors">
                    ¿Vistas para Ganar $100?
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Umbral de pago de Google AdSense</p>
                </div>
              </div>

              {/* Card 4: YouTube Shorts */}
              <div
                onClick={() => onNavigateTool('calculadora-ganancias-shorts')}
                className="bg-white dark:bg-[#1F1F1F] border border-gray-200 dark:border-[#2F2F2F] p-4 rounded-xl flex items-center gap-4 hover:border-red-300 dark:hover:border-red-800 transition-colors cursor-pointer shadow-xs group"
              >
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-[#FF0000] group-hover:text-white dark:group-hover:bg-[#FF0000] dark:group-hover:text-white transition-colors shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#212121] dark:text-white group-hover:text-[#FF0000] dark:group-hover:text-[#FF4E45] transition-colors">
                    Ganancias de Shorts
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Monetización del feed de Shorts</p>
                </div>
              </div>
            </div>

            {/* Quick Live RPM Calculator Component */}
            <div className="bg-white dark:bg-[#1F1F1F] border border-gray-200 dark:border-[#2F2F2F] rounded-xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-lg text-[#212121] dark:text-white">Calculadora Rápida de RPM</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Prueba instantánea con tus visualizaciones e ingresos actuales</p>
                </div>
                <span className="text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-[#2A2A2A] px-2 py-1 rounded font-bold text-gray-500 dark:text-gray-400">
                  Fórmula 55/45
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Inputs */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="mini-views-input" className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">Visualizaciones Totales</label>
                    <input
                      id="mini-views-input"
                      aria-label="Visualizaciones Totales"
                      type="number"
                      value={miniViews}
                      onChange={(e) => setMiniViews(Math.max(1, Number(e.target.value) || 0))}
                      className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#141414] rounded-lg px-3 py-2 text-sm focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none font-semibold text-[#212121] dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="mini-revenue-input" className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">Ingresos Estimados ($ USD)</label>
                    <input
                      id="mini-revenue-input"
                      aria-label="Ingresos Estimados en Dólares"
                      type="number"
                      value={miniRevenue}
                      onChange={(e) => setMiniRevenue(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full border border-gray-300 dark:border-[#383838] bg-white dark:bg-[#141414] rounded-lg px-3 py-2 text-sm focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none font-semibold text-[#212121] dark:text-white"
                    />
                  </div>

                  <button
                    onClick={() => onNavigateTool('calculadora-rpm-youtube')}
                    className="w-full bg-[#FF0000] hover:bg-[#E60000] text-white font-bold py-3 rounded-lg text-sm shadow-md shadow-red-500/20 uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Abrir Calculadora Completa</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Live Gauge Result Box */}
                <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-[#333333]">
                  <span className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold mb-1">Tu RPM Estimado</span>
                  <div className="text-4xl sm:text-5xl font-black text-[#FF0000] mb-2 tracking-tight">
                    ${miniRpm}
                  </div>
                  <p className="text-[11px] text-center text-gray-500 dark:text-gray-400 leading-relaxed px-4">
                    Ganas <strong>${miniRpm} USD</strong> por cada 1.000 reproducciones monetizadas.
                  </p>

                  <div className="mt-4 w-full h-1.5 bg-gray-200 dark:bg-[#2A2A2A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FF0000] transition-all duration-300 rounded-full"
                      style={{ width: `${rpmRatio}%` }}
                    />
                  </div>
                  <div className="flex justify-between w-full mt-1.5 text-[9px] text-gray-400 dark:text-gray-500 font-bold">
                    <span>BAJO (&lt;$1.50)</span>
                    <span>PROMEDIO ($2-$4)</span>
                    <span>ALTO (&gt;$5)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Subcategories Quick Navigation & Popular Rankings */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Dinero e Ingresos Subcategories Box */}
            <div className="bg-[#212121] dark:bg-[#181818] text-white rounded-xl p-5 shadow-lg border border-transparent dark:border-[#2F2F2F] flex-shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#FF0000] flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  Estructura de Ingresos
                </h3>
                <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded font-bold">
                  14 Herramientas
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Herramientas organizadas por subcategorías según tu objetivo monetario:
              </p>

              <div className="space-y-2 pt-1">
                {INCOME_SUBCATEGORIES.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedCategory('ingresos');
                      setSelectedSubcategory(sub.id as IncomeSubcategory);
                      const el = document.getElementById('categories-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full p-2.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{sub.emoji}</span>
                      <div>
                        <span className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                          {sub.name}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Rankings Card */}
            <div className="bg-white dark:bg-[#1F1F1F] border border-gray-200 dark:border-[#2F2F2F] rounded-xl p-5 shadow-xs flex-1">
              <h3 className="text-xs font-bold uppercase mb-4 text-[#212121] dark:text-white">Ranking de Popularidad</h3>
              <div className="space-y-3.5">
                <div
                  onClick={() => onNavigateTool('calculadora-ganancias-youtube')}
                  className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-[#272727] cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-gray-100 dark:bg-[#2A2A2A] flex items-center justify-center font-bold text-xs text-[#212121] dark:text-white">
                    01
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#212121] dark:text-white truncate">Calculadora Ganancias</div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500">42.3k cálculos</div>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+12%</div>
                </div>

                <div
                  onClick={() => onNavigateTool('calculadora-rpm-youtube')}
                  className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-[#272727] cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-red-50 dark:bg-red-950/50 text-[#FF0000] flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#212121] dark:text-white truncate">Calculadora RPM</div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500">31.8k cálculos</div>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+5%</div>
                </div>

                <div
                  onClick={() => onNavigateTool('vistas-para-ganar-100-dolares')}
                  className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-[#272727] cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-gray-100 dark:bg-[#2A2A2A] flex items-center justify-center font-bold text-xs text-[#212121] dark:text-white">
                    03
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#212121] dark:text-white truncate">¿Vistas para Ganar $100?</div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500">22.4k cálculos</div>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+18%</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Top Banner Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdPlacement slotId="homepage-top" format="horizontal-banner" />
      </div>

      {/* 3. Sección "Herramientas Populares" */}
      <section id="popular-tools-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF0000]">
              <TrendingUp className="w-4 h-4" />
              <span>Más Utilizadas por Creadores</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#212121] dark:text-white mt-1">
              Herramientas Populares
            </h2>
          </div>
          <button
            onClick={() => onNavigateTool('todas')}
            className="text-xs font-bold text-[#FF0000] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Ver todas las {CALCULATORS.length} calculadoras <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {popularTools.map((tool) => (
            <CalculatorCard
              key={tool.id}
              tool={tool}
              featured={tool.popularRank === 1}
              onSelect={onNavigateTool}
            />
          ))}
        </div>
      </section>

      {/* Spotlight: Asistente de Imágenes (100% Local y Privado) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black text-white border border-zinc-800 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-[#FF4E45] text-xs font-black tracking-wide uppercase">
                <span>🖼️ ASISTENTE DE IMÁGENES</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Conversor y Optimizador de Miniaturas
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Convierte JPG a PNG, WebP, AVIF, comprime por KB exactos, redimensiona y recorta a 16:9 con procesamiento 100% privado en tu navegador.
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                <span className="px-2 py-0.5 rounded-lg bg-zinc-800 text-gray-200 font-bold">🔒 100% Privado</span>
                <span className="px-2 py-0.5 rounded-lg bg-zinc-800 text-gray-200 font-bold">⚡ Sin servidor</span>
                <span className="px-2 py-0.5 rounded-lg bg-zinc-800 text-gray-200 font-bold">📦 En lote</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTool('imagenes')}
              className="w-full sm:w-auto px-6 py-3 bg-[#FF0000] hover:bg-[#CC0000] active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer self-start"
            >
              <span>Abrir Imágenes (17 Tools)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-950/40 via-zinc-900 to-black text-white border border-red-900/30 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-[#FF4E45] text-xs font-black tracking-wide uppercase">
                <span>🔎 NUEVA CATEGORÍA 5 • SEO YOUTUBE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Optimización de Títulos, Keywords & Metadatos
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                23 herramientas gratuitas: clustering de palabras clave, contador y comparador de títulos, descripciones con capítulos, hashtags y auditoría SEO transparente.
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                <span className="px-2 py-0.5 rounded-lg bg-zinc-800 text-gray-200 font-bold">🔎 23 Herramientas</span>
                <span className="px-2 py-0.5 rounded-lg bg-zinc-800 text-gray-200 font-bold">✍️ Fórmulas de Títulos</span>
                <span className="px-2 py-0.5 rounded-lg bg-zinc-800 text-gray-200 font-bold">⏱️ Capítulos</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTool('seo')}
              className="w-full sm:w-auto px-6 py-3 bg-[#FF0000] hover:bg-[#CC0000] active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer self-start"
            >
              <span>Abrir SEO para YouTube (23 Tools)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Sección de Categorías con Filtro y Subcategorías */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#212121] dark:text-white">
            Explora por Categoría & Subcategoría
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Calculadoras estructuradas para cada etapa de tu canal: ingresos publicitarios, metas en dólares, Shorts, comparativas y métricas técnicas.
          </p>
        </div>

        {/* Category Pill Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubcategory('all');
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#212121] dark:bg-white text-white dark:text-[#0F0F0F] shadow-xs'
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
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#FF0000] text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#333333] text-gray-700 dark:text-gray-200'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Subcategories for "Dinero e ingresos" */}
        {selectedCategory === 'ingresos' && (
          <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-xl border border-gray-200 dark:border-[#2F2F2F]">
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedSubcategory === 'all'
                  ? 'bg-zinc-800 dark:bg-white text-white dark:text-[#121212]'
                  : 'bg-white dark:bg-[#262626] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333]'
              }`}
            >
              Todas las de Ingresos (14)
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
                      : 'bg-white dark:bg-[#262626] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333]'
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

        {/* Subcategories for "Analytics de YouTube" */}
        {selectedCategory === 'analytics' && (
          <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-xl border border-gray-200 dark:border-[#2F2F2F]">
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedSubcategory === 'all'
                  ? 'bg-zinc-800 dark:bg-white text-white dark:text-[#121212]'
                  : 'bg-white dark:bg-[#262626] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333]'
              }`}
            >
              Todas las de Analytics (17)
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
                      : 'bg-white dark:bg-[#262626] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333]'
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

        {/* Subcategories for "Video y Producción" */}
        {selectedCategory === 'video' && (
          <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-xl border border-gray-200 dark:border-[#2F2F2F]">
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedSubcategory === 'all'
                  ? 'bg-zinc-800 dark:bg-white text-white dark:text-[#121212]'
                  : 'bg-white dark:bg-[#262626] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333]'
              }`}
            >
              Todas las de Video ({CALCULATORS.filter((c) => c.category === 'video').length})
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
                      : 'bg-white dark:bg-[#262626] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333]'
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

        {/* Filtered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredCategoryTools.map((tool) => (
            <CalculatorCard key={tool.id} tool={tool} onSelect={onNavigateTool} />
          ))}
        </div>
      </section>

      {/* Mid Content Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdPlacement slotId="homepage-mid" format="horizontal-banner" />
      </div>

      {/* 5. Sección Informativa: ¿Por qué YouTubeCalculador? */}
      <section id="info-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#212121] dark:bg-[#181818] text-white rounded-2xl p-8 sm:p-10 overflow-hidden relative shadow-lg border border-transparent dark:border-[#2F2F2F]">
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-red-400 rounded-full text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-[#FF0000]" />
              <span>Transparencia y Precisión Matemática</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Fórmulas Explícitas y Estimaciones Transparentes
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              En YouTubeCalculador no usamos cifras inventadas ni garantizamos ingresos fijos. Cada cálculo utiliza las fórmulas matemáticas oficiales del ecosistema de YouTube (reparto 55/45 de AdSense, fondo común de Shorts y métricas de CPM/RPM), indicando siempre de forma transparente los factores que pueden hacer variar tus ingresos reales.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-red-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#FF0000]" />
                  Fórmulas Transparentes
                </div>
                <p className="text-xs text-gray-400">
                  Desglose paso a paso de cada cálculo matemático en pantalla.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-red-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#FF0000]" />
                  Avisos de Estimación
                </div>
                <p className="text-xs text-gray-400">
                  Aclaraciones claras sobre la variación de RPM por país, nicho y estacionalidad.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-red-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#FF0000]" />
                  100% Gratuito y Privado
                </div>
                <p className="text-xs text-gray-400">
                  Cálculos ejecutados localmente en tu navegador sin necesidad de registro.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
