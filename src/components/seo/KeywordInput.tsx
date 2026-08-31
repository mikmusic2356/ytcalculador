import React from 'react';
import { Search, Sparkles, X } from 'lucide-react';

interface KeywordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  examples?: string[];
  onSelectExample?: (example: string) => void;
  loading?: boolean;
  buttonLabel?: string;
  id?: string;
}

export const KeywordInput: React.FC<KeywordInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Introduce una palabra clave o tema (ej: "gta 6")',
  label = 'Palabra Clave o Tema Principal',
  helperText = 'Escribe el concepto central de tu video para generar variaciones e ideas relevantes.',
  examples = ['GTA 6', 'Podcast de Creadores', 'Finanzas Personales', 'Tutorial de Premiere'],
  onSelectExample,
  loading = false,
  buttonLabel = 'Generar Ideas',
  id = 'input-keyword-seed',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="block text-sm font-bold text-gray-900 dark:text-white"
          >
            {label}
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Limpiar
            </button>
          )}
        </div>
      )}

      <div className="relative flex items-center">
        <div className="absolute left-4 text-gray-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-32 py-3.5 bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-[#383838] focus:border-[#FF0000] dark:focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 rounded-xl text-gray-900 dark:text-white text-base shadow-xs placeholder-gray-400 dark:placeholder-gray-500 outline-hidden transition-all"
        />
        {onSubmit && (
          <button
            id="btn-submit-keyword"
            type="button"
            onClick={onSubmit}
            disabled={!value.trim() || loading}
            className="absolute right-2 px-4 py-2 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-lg text-sm font-bold shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{buttonLabel}</span>
          </button>
        )}
      </div>

      {helperText && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      )}

      {examples && examples.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            Ejemplos:
          </span>
          {examples.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange(ex);
                if (onSelectExample) onSelectExample(ex);
              }}
              className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-[#252525] hover:bg-gray-200 dark:hover:bg-[#303030] text-gray-700 dark:text-gray-300 rounded-md transition-colors cursor-pointer"
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
