import React from 'react';
import {
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
  Sparkles,
} from 'lucide-react';
import { CalculatorConfig } from '../types';

interface CalculatorCardProps {
  tool: CalculatorConfig;
  onSelect: (slug: string) => void;
  featured?: boolean;
}

const ICONS: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  DollarSign: <DollarSign className="w-6 h-6" />,
  BarChart3: <BarChart3 className="w-6 h-6" />,
  MousePointerClick: <MousePointerClick className="w-6 h-6" />,
  Clock: <Clock className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  Sliders: <Sliders className="w-6 h-6" />,
  HardDrive: <HardDrive className="w-6 h-6" />,
  Target: <Target className="w-6 h-6" />,
  Calendar: <Calendar className="w-6 h-6" />,
  CalendarDays: <CalendarDays className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
  Scale: <Scale className="w-6 h-6" />,
  Calculator: <Calculator className="w-6 h-6" />,
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; darkBg: string; darkText: string; label: string }> = {
  ingresos: { bg: 'bg-red-50', text: 'text-red-600', darkBg: 'dark:bg-red-950/40', darkText: 'dark:text-red-400', label: 'Ingresos' },
  analytics: { bg: 'bg-blue-50', text: 'text-blue-600', darkBg: 'dark:bg-blue-950/40', darkText: 'dark:text-blue-400', label: 'Analytics' },
  video: { bg: 'bg-green-50', text: 'text-green-600', darkBg: 'dark:bg-green-950/40', darkText: 'dark:text-green-400', label: 'Vídeo' },
  seo: { bg: 'bg-amber-50', text: 'text-amber-600', darkBg: 'dark:bg-amber-950/40', darkText: 'dark:text-amber-400', label: 'SEO' },
};

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ tool, onSelect, featured = false }) => {
  const catStyle = CATEGORY_COLORS[tool.category] || {
    bg: 'bg-red-50',
    text: 'text-red-600',
    darkBg: 'dark:bg-red-950/40',
    darkText: 'dark:text-red-400',
    label: tool.category,
  };

  return (
    <div
      id={`card-tool-${tool.id}`}
      onClick={() => onSelect(tool.slug)}
      className={`group relative flex flex-col justify-between p-4 sm:p-5 bg-white dark:bg-[#1F1F1F] rounded-xl border transition-all duration-200 cursor-pointer ${
        featured
          ? 'border-red-500 dark:border-red-500 shadow-md ring-1 ring-red-500/20'
          : 'border-gray-200 dark:border-[#2F2F2F] hover:border-red-300 dark:hover:border-red-800 hover:shadow-sm'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200 shrink-0 ${
              featured
                ? 'bg-[#FF0000] text-white shadow-xs'
                : `${catStyle.bg} ${catStyle.text} ${catStyle.darkBg} ${catStyle.darkText} group-hover:bg-[#FF0000] group-hover:text-white dark:group-hover:bg-[#FF0000] dark:group-hover:text-white`
            }`}
          >
            {ICONS[tool.iconName] || <TrendingUp className="w-6 h-6" />}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#2A2A2A] px-2 py-0.5 rounded">
              {catStyle.label}
            </span>
            {tool.badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {tool.badge}
              </span>
            )}
          </div>
        </div>

        <h3 className="font-bold text-sm sm:text-base text-[#212121] dark:text-white group-hover:text-[#FF0000] dark:group-hover:text-[#FF4E45] transition-colors leading-snug">
          {tool.name}
        </h3>

        <p className={`text-xs mt-0.5 mb-2 line-clamp-1 ${featured ? 'text-red-500 dark:text-red-400 font-semibold' : 'text-gray-400 dark:text-gray-500'}`}>
          {tool.tagline}
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{tool.shortDescription}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2F2F2F] flex items-center justify-between">
        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
          Cálculo instantáneo
        </span>
        <button
          id={`btn-use-tool-${tool.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(tool.slug);
          }}
          className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#FF0000] hover:bg-[#E60000] px-3 py-1.5 rounded-lg transition-colors shadow-xs group-hover:translate-x-0.5 cursor-pointer"
        >
          Calcular
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

