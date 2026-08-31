import React from 'react';
import { HelpCircle, AlertCircle } from 'lucide-react';

export interface CalculatorInputFieldProps {
  id: string;
  label: string;
  type: 'number' | 'slider' | 'select' | 'currency' | 'duration';
  value: any;
  onChange: (value: any) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  tooltip?: string;
  options?: Array<{ label: string; value: string | number }>;
  errorMessage?: string | null;
}

export const CalculatorInput: React.FC<CalculatorInputFieldProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  prefix,
  suffix,
  placeholder,
  tooltip,
  options,
  errorMessage,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={`input-${id}`}
          className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1.5"
        >
          {label}
          {tooltip && (
            <span className="group relative cursor-help">
              <HelpCircle className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-56 p-2 bg-[#212121] dark:bg-[#141414] text-white text-[11px] rounded-md shadow-lg z-20 pointer-events-none leading-tight border border-transparent dark:border-[#383838]">
                {tooltip}
              </span>
            </span>
          )}
        </label>
        {type === 'slider' && (
          <span className="text-xs font-bold text-[#FF0000] dark:text-[#FF4E45] bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded">
            {Number(value).toLocaleString('es-ES')} {unit || ''}
          </span>
        )}
      </div>

      {/* Select Field */}
      {type === 'select' && (
        <select
          id={`input-${id}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#383838] rounded-lg text-sm font-medium text-[#212121] dark:text-white focus:bg-white dark:focus:bg-[#1F1F1F] focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] outline-none transition-all cursor-pointer"
        >
          {options?.map((opt) => (
            <option
              key={String(opt.value)}
              value={opt.value}
              className="bg-white dark:bg-[#1F1F1F] text-[#212121] dark:text-white"
            >
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* Slider Field */}
      {type === 'slider' && (
        <div className="space-y-2 pt-1">
          <input
            id={`input-${id}`}
            type="range"
            min={min || 0}
            max={max || 100000}
            step={step || 100}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-[#2E2E2E] rounded-lg appearance-none cursor-pointer accent-[#FF0000]"
          />
          <div className="flex justify-between text-[11px] text-gray-400 dark:text-gray-500 font-medium">
            <span>{min?.toLocaleString('es-ES')}</span>
            <span>{max?.toLocaleString('es-ES')}</span>
          </div>
        </div>
      )}

      {/* Number / Currency / Duration inputs */}
      {['number', 'currency', 'duration'].includes(type) && (
        <div className="relative rounded-lg">
          {prefix && (
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 font-bold text-sm">
              {prefix}
            </span>
          )}
          <input
            id={`input-${id}`}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value === 0 ? '' : value}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === '') {
                onChange(0);
              } else {
                const parsed = parseFloat(raw);
                onChange(isNaN(parsed) ? 0 : parsed);
              }
            }}
            placeholder={placeholder || (min !== undefined ? `Mín. ${min}` : '0')}
            className={`w-full py-2.5 bg-gray-50 dark:bg-[#141414] border ${
              errorMessage
                ? 'border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 dark:border-[#383838] focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000]'
            } rounded-lg text-sm font-semibold text-[#212121] dark:text-white focus:bg-white dark:focus:bg-[#1F1F1F] outline-none transition-all ${
              prefix ? 'pl-8' : 'pl-3.5'
            } ${suffix || unit ? 'pr-16' : 'pr-3.5'}`}
          />
          {(suffix || unit) && (
            <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 text-xs font-semibold">
              {suffix || unit}
            </span>
          )}
        </div>
      )}

      {/* Validation Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-medium pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
