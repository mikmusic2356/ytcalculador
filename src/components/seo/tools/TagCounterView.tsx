import React, { useState } from 'react';
import { calculateTagsLength } from '../../../utils/seoTextProcessing';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { Tag, X, AlertTriangle, CheckCircle2, Sliders } from 'lucide-react';

const INITIAL_TAGS_INPUT = 'gta 6, gameplay gta 6, trailer gta 6 en español, como jugar gta 6 pc, trucos de gta 6, fecha de lanzamiento gta 6, analisis completo gta 6, requisitos gta 6';

export const TagCounterView: React.FC = () => {
  const [inputText, setInputText] = useState(INITIAL_TAGS_INPUT);
  const [maxLimit, setMaxLimit] = useState<number>(500);

  const rawTags = inputText
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const calc = calculateTagsLength(rawTags, maxLimit);

  const removeTag = (indexToRemove: number) => {
    const updated = rawTags.filter((_, idx) => idx !== indexToRemove);
    setInputText(updated.join(', '));
  };

  return (
    <div className="space-y-6">
      {/* Editor & Limit Card */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Pega tus Tags Separados por Comas
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Controla el límite oficial de 500 caracteres de YouTube Studio.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">Límite:</span>
            <input
              type="number"
              value={maxLimit}
              onChange={(e) => setMaxLimit(parseInt(e.target.value, 10) || 500)}
              className="w-20 p-2 text-xs font-bold bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-lg text-gray-900 dark:text-white outline-hidden text-center"
            />
            <span className="text-xs text-gray-400">chars</span>
          </div>
        </div>

        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="tag 1, tag 2, tag 3..."
          className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
        />

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span
              className={calc.isOverLimit ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}
            >
              {calc.totalChars} / {maxLimit} caracteres ocupados ({calc.tagCount} tags)
            </span>
            <span
              className={calc.isOverLimit ? 'text-red-500 font-bold' : 'text-gray-500 dark:text-gray-400'}
            >
              {calc.isOverLimit
                ? `Excedido por ${Math.abs(calc.remainingChars)} caracteres`
                : `${calc.remainingChars} restantes`}
            </span>
          </div>

          <div className="w-full bg-gray-100 dark:bg-[#2A2A2A] h-3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                calc.isOverLimit
                  ? 'bg-red-500'
                  : calc.totalChars > maxLimit * 0.85
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{
                width: `${Math.min(100, (calc.totalChars / maxLimit) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <CopyButton
            textToCopy={calc.formattedCommaString}
            label="Copiar Tags"
            variant="primary"
            size="sm"
            toolName="Contador de Tags"
          />
        </div>
      </div>

      {/* Interactive Tag Chips with 1-click removal */}
      {rawTags.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#FF0000]" />
              Tags Individuales (Haz clic en la ✕ para eliminar uno si te pasas del límite)
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {rawTags.map((tag, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 bg-gray-50 dark:bg-[#222222] hover:bg-gray-100 dark:hover:bg-[#282828] border border-gray-200 dark:border-[#2E2E2E] rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 transition-all"
              >
                <span>{tag}</span>
                <span className="text-[10px] text-gray-400 font-mono">({tag.length}c)</span>
                <button
                  type="button"
                  onClick={() => removeTag(idx)}
                  className="p-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-950/60 hover:text-red-600 text-gray-400 cursor-pointer transition-colors"
                  title="Eliminar tag"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
