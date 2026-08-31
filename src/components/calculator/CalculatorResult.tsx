import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Share2,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from 'recharts';

export interface ResultMetric {
  label: string;
  value: string;
  subValue?: string;
  highlight?: boolean;
  isPositive?: boolean;
}

export interface CalculatorResultProps {
  primaryLabel: string;
  primaryValue: string;
  basedOnText: string;
  formulaCalculationText: string;
  estimationNote?: string;
  secondaryMetrics?: ResultMetric[];
  benchmarkStatus?: 'optimal' | 'average' | 'needs-work';
  benchmarkText?: string;
  breakdownData?: Array<{ name: string; value: number }>;
  toolName: string;
}

export const CalculatorResult: React.FC<CalculatorResultProps> = ({
  primaryLabel,
  primaryValue,
  basedOnText,
  formulaCalculationText,
  estimationNote = 'Esta es una estimación basada en el RPM introducido. Los ingresos reales pueden variar.',
  secondaryMetrics = [],
  benchmarkStatus,
  benchmarkText,
  breakdownData,
  toolName,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${toolName}\n${primaryLabel}: ${primaryValue}\nBasado en: ${basedOnText}\nFórmula: ${formulaCalculationText}\nCalculado gratis en YouTubeCalculador.com`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: toolName,
          text: `Calculé mi ${primaryLabel}: ${primaryValue} en YouTubeCalculador`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-white dark:bg-[#1F1F1F] rounded-xl border border-gray-200 dark:border-[#2F2F2F] p-6 sm:p-7 shadow-xs space-y-5">
      {/* Primary Highlight Hero Box */}
      <div className="relative overflow-hidden rounded-xl bg-[#212121] dark:bg-[#141414] text-white p-6 sm:p-7 shadow-lg border border-transparent dark:border-[#2F2F2F]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF0000]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {primaryLabel}
            </span>
            {benchmarkStatus && (
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  benchmarkStatus === 'optimal'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : benchmarkStatus === 'needs-work'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-white/10 text-gray-300'
                }`}
              >
                {benchmarkStatus === 'optimal' && <CheckCircle2 className="w-3 h-3" />}
                {benchmarkStatus === 'needs-work' && <AlertCircle className="w-3 h-3" />}
                {benchmarkStatus === 'optimal'
                  ? 'Excelente'
                  : benchmarkStatus === 'needs-work'
                  ? 'Optimizable'
                  : 'Estándar'}
              </span>
            )}
          </div>

          {/* Big Number Output */}
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            {primaryValue}
          </div>

          {/* "Basado en..." block */}
          {basedOnText && (
            <div className="pt-2 text-xs text-gray-300 border-t border-white/10 flex items-center gap-2">
              <span className="font-bold text-gray-400">Basado en:</span>
              <span className="font-semibold text-white">{basedOnText}</span>
            </div>
          )}

          {/* Formula calculation step breakdown */}
          {formulaCalculationText && (
            <div className="text-xs font-mono bg-black/40 text-emerald-300 px-3 py-2 rounded-lg border border-white/10">
              <span className="text-gray-400 font-sans mr-1.5 font-bold">Fórmula:</span>
              {formulaCalculationText}
            </div>
          )}

          {/* Benchmark context */}
          {benchmarkText && (
            <p className="text-xs text-gray-300 leading-relaxed pt-1">
              {benchmarkText}
            </p>
          )}

          {/* Copy and Share buttons */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
            <button
              id="btn-copy-result"
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar resultado'}</span>
            </button>
            <button
              id="btn-share-result"
              onClick={handleShare}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Estimation Note Badge */}
      {estimationNote && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-lg text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>{estimationNote}</span>
        </div>
      )}

      {/* Secondary Metrics */}
      {secondaryMetrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {secondaryMetrics.map((sec, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl border transition-colors ${
                sec.highlight
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-red-950 dark:text-red-200'
                  : 'bg-gray-50 dark:bg-[#141414] border-gray-200 dark:border-[#2F2F2F] text-[#212121] dark:text-white'
              }`}
            >
              <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 truncate">
                {sec.label}
              </div>
              <div className="text-base sm:text-lg font-bold text-[#212121] dark:text-white mt-0.5">
                {sec.value}
              </div>
              {sec.subValue && (
                <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {sec.subValue}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Chart Visualizer if breakdown data exists */}
      {breakdownData && breakdownData.length > 0 && (
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#2F2F2F] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#FF0000]" />
              Proyección Visual de Rendimiento
            </span>
          </div>
          <div className="h-40 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888888' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#888888' }} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#212121',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="value" fill="#FF0000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
