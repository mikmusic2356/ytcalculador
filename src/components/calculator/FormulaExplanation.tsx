import React from 'react';
import { Lightbulb, Check } from 'lucide-react';

interface FormulaExplanationProps {
  title?: string;
  formula: string;
  exampleCalculation?: string;
  explanationSteps?: string[];
  notes?: string;
}

export const FormulaExplanation: React.FC<FormulaExplanationProps> = ({
  title = 'Explicación de la Fórmula Matemática',
  formula,
  exampleCalculation,
  explanationSteps = [],
  notes,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#2F2F2F] space-y-3">
      <div className="font-bold text-sm text-[#212121] dark:text-white flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
        <span>{title}</span>
      </div>

      {/* Formula Box */}
      <div className="bg-white dark:bg-[#1F1F1F] p-3 rounded-lg border border-gray-200 dark:border-[#333333] space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Fórmula Oficial Aplicada
        </div>
        <div className="text-xs sm:text-sm font-mono font-bold text-[#FF0000] dark:text-[#FF4E45]">
          {formula}
        </div>
      </div>

      {/* Step Breakdown */}
      {exampleCalculation && (
        <div className="text-xs font-mono bg-white dark:bg-[#1F1F1F] p-3 rounded-lg border border-gray-200 dark:border-[#333333] text-[#212121] dark:text-gray-200 whitespace-pre-line leading-relaxed">
          {exampleCalculation}
        </div>
      )}

      {explanationSteps.length > 0 && (
        <ul className="space-y-1.5 pt-1">
          {explanationSteps.map((step, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      )}

      {notes && (
        <p className="text-[11px] text-gray-500 dark:text-gray-400 italic pt-1">
          {notes}
        </p>
      )}
    </div>
  );
};
