import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';

interface AnalysisResultProps {
  strengths?: string[];
  warnings?: string[];
  recommendations?: string[];
  readabilityNote?: string;
  id?: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({
  strengths = [],
  warnings = [],
  recommendations = [],
  readabilityNote,
  id = 'analysis-result-panel',
}) => {
  return (
    <div id={id} className="space-y-4">
      {/* Readability & Overview note */}
      {readabilityNote && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-blue-950 dark:text-blue-200">
              Evaluación de Legibilidad y Claridad
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              {readabilityNote}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths / Puntos Fuertes */}
        {strengths.length > 0 && (
          <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl space-y-3">
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Puntos Fuertes Detectados ({strengths.length})
            </h4>
            <ul className="space-y-2 text-xs text-emerald-950 dark:text-emerald-200">
              {strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings / Advertencias */}
        {warnings.length > 0 && (
          <div className="p-4 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl space-y-3">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              Aspectos a Revisar ({warnings.length})
            </h4>
            <ul className="space-y-2 text-xs text-amber-950 dark:text-amber-200">
              {warnings.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actionable recommendations */}
      {recommendations.length > 0 && (
        <div className="p-4 sm:p-5 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2E2E2E] rounded-2xl shadow-xs space-y-3">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            Recomendaciones Directas de Mejora
          </h4>
          <div className="space-y-2">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 dark:bg-[#222222] rounded-xl border border-gray-100 dark:border-[#2C2C2C] flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300"
              >
                <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-[#333] text-gray-700 dark:text-gray-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
