import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, ShieldCheck, Cpu } from 'lucide-react';

interface FormulaExplanationProps {
  title?: string;
  formulaDescription: string;
  weights?: Array<{ factor: string; percentage: string; explanation: string }>;
  limitationsNote?: string;
  id?: string;
}

export const FormulaExplanation: React.FC<FormulaExplanationProps> = ({
  title = 'Transparencia de la Fórmula y Procesamiento',
  formulaDescription,
  weights,
  limitationsNote = 'Esta herramienta opera mediante análisis léxico, sintáctico y estadístico en tu navegador. No inventamos volúmenes de búsqueda, CTR o rankings oficiales de YouTube.',
  id = 'formula-explanation-box',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      id={id}
      className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-4 sm:p-5 transition-all"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 text-left cursor-pointer select-none group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Conoce cómo calculamos y evaluamos estos datos sin trucos ni datos simulados
            </p>
          </div>
        </div>
        <div className="p-1 rounded-md text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-amber-200/60 dark:border-amber-900/40 space-y-4 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>{formulaDescription}</p>

          {weights && weights.length > 0 && (
            <div className="space-y-2">
              <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Ponderación de Factores:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {weights.map((w, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white dark:bg-[#1E1E1E] rounded-xl border border-amber-100 dark:border-[#2E2E2E] flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-gray-900 dark:text-white">{w.factor}</span>
                      <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">
                        {w.percentage}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                      {w.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 bg-white/80 dark:bg-[#1C1C1C] rounded-xl border border-amber-200/50 dark:border-amber-900/30 flex items-start gap-2.5 text-[11px] text-gray-600 dark:text-gray-400">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p>{limitationsNote}</p>
          </div>
        </div>
      )}
    </div>
  );
};
