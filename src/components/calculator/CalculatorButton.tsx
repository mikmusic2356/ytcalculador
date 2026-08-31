import React from 'react';
import { Zap, RotateCcw } from 'lucide-react';

interface CalculatorButtonProps {
  onCalculate: () => void;
  onReset: () => void;
  calculateLabel?: string;
  disabled?: boolean;
}

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  onCalculate,
  onReset,
  calculateLabel = 'Calcular',
  disabled = false,
}) => {
  return (
    <div className="pt-3 border-t border-gray-100 dark:border-[#2F2F2F] flex flex-col sm:flex-row items-center gap-3">
      <button
        id="btn-main-calculate"
        type="button"
        onClick={onCalculate}
        disabled={disabled}
        className={`w-full sm:flex-1 py-3 px-6 text-white text-sm font-extrabold rounded-lg transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer ${
          disabled
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70'
            : 'bg-[#FF0000] hover:bg-[#E60000] active:scale-[0.99]'
        }`}
      >
        <Zap className="w-4 h-4 fill-white" />
        <span>{calculateLabel}</span>
      </button>

      <button
        id="btn-reset-calculation"
        type="button"
        onClick={onReset}
        className="w-full sm:w-auto py-3 px-4 bg-gray-100 dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#353535] text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        title="Restablecer a valores iniciales"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Nuevo cálculo</span>
      </button>
    </div>
  );
};
