import React from 'react';
import { Award, AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface SeoScoreProps {
  score: number; // 0 to 100
  title?: string;
  subtitle?: string;
  breakdown?: Array<{
    label: string;
    points: number;
    maxPoints: number;
    notes?: string;
  }>;
  showBreakdown?: boolean;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
}

export const SeoScore: React.FC<SeoScoreProps> = ({
  score,
  title = 'Puntuación de Optimización Textual',
  subtitle = 'Basada en reglas lingüísticas y estructurales transparentes',
  breakdown,
  showBreakdown = true,
  size = 'md',
  id = 'seo-score-widget',
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  let colorClass = 'text-red-500 stroke-red-500 bg-red-500';
  let badgeColor = 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400';
  let statusText = 'Requiere Optimización';
  let StatusIcon = AlertCircle;

  if (clampedScore >= 80) {
    colorClass = 'text-emerald-500 stroke-emerald-500 bg-emerald-500';
    badgeColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400';
    statusText = 'Excelente Estructura';
    StatusIcon = CheckCircle2;
  } else if (clampedScore >= 60) {
    colorClass = 'text-amber-500 stroke-amber-500 bg-amber-500';
    badgeColor = 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400';
    statusText = 'Aceptable con Mejoras';
    StatusIcon = Info;
  }

  // Circular gauge calculations
  const radius = size === 'lg' ? 44 : size === 'md' ? 36 : 28;
  const strokeWidth = size === 'lg' ? 7 : size === 'md' ? 6 : 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div
      id={id}
      className="p-5 sm:p-6 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] shadow-sm space-y-4"
    >
      <div className="flex flex-col sm:flex-row items-center gap-5 justify-between">
        <div className="flex items-center gap-4">
          {/* Circular progress gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg
              className="transform -rotate-90"
              width={(radius + strokeWidth) * 2}
              height={(radius + strokeWidth) * 2}
            >
              {/* Background ring */}
              <circle
                cx={radius + strokeWidth}
                cy={radius + strokeWidth}
                r={radius}
                className="stroke-gray-200 dark:stroke-[#2E2E2E]"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Progress ring */}
              <circle
                cx={radius + strokeWidth}
                cy={radius + strokeWidth}
                r={radius}
                className={`transition-all duration-700 ease-out ${colorClass}`}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span
                className={`font-black tracking-tight ${
                  size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-base'
                } text-gray-900 dark:text-white`}
              >
                {clampedScore}
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500">
                / 100
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#FF0000]" />
                {title}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${badgeColor}`}>
                <StatusIcon className="w-3 h-3" />
                {statusText}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Breakdown progress bars */}
      {showBreakdown && breakdown && breakdown.length > 0 && (
        <div className="pt-3 border-t border-gray-100 dark:border-[#2E2E2E] space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Desglose de Factores Evaluados
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {breakdown.map((item, idx) => {
              const pct = item.maxPoints > 0 ? Math.round((item.points / item.maxPoints) * 100) : 0;
              return (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 dark:bg-[#222222] rounded-xl border border-gray-100 dark:border-[#2C2C2C] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {item.label}
                    </span>
                    <span className="font-mono font-bold text-gray-600 dark:text-gray-400">
                      {item.points} / {item.maxPoints} pts ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-[#333333] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.max(4, Math.min(100, pct))}%` }}
                    />
                  </div>
                  {item.notes && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                      {item.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
