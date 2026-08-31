import React, { useState } from 'react';
import { cleanHashtags } from '../../../utils/seoTextProcessing';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { Sparkles, CheckCircle2, Trash2 } from 'lucide-react';

const DIRTY_HASHTAGS = '#gta6 #Gaming #GTA6 #Trailer #gta6 #Playstation #GAMING #Trailer #Gaming';

export const HashtagCleanerView: React.FC = () => {
  const [input, setInput] = useState(DIRTY_HASHTAGS);
  const [result, setResult] = useState(() => cleanHashtags(DIRTY_HASHTAGS));

  const handleClean = () => {
    const res = cleanHashtags(input);
    setResult(res);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Limpiador y Deduplicador de Hashtags
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Pega una lista con hashtags repetidos o mal formateados para obtener una versión limpia sin duplicados.
          </p>
        </div>

        <textarea
          rows={5}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setResult(cleanHashtags(e.target.value));
          }}
          placeholder="#tag1 #tag2 #tag1..."
          className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClean}
            className="px-6 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Eliminar Duplicados</span>
          </button>
        </div>
      </div>

      {/* Output result */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#2E2E2E] pb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {result.cleanedList.length} Hashtags Únicos Resultantes
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {result.removedDuplicatesCount} repeticiones eliminadas
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <CopyButton
              textToCopy={result.singleLineOutput}
              label="Copiar Espaciados"
              variant="primary"
              size="sm"
              toolName="Limpiador de Hashtags"
            />
            <CopyButton
              textToCopy={result.commaSeparatedOutput}
              label="Con Comas"
              variant="secondary"
              size="sm"
              toolName="Limpiador de Hashtags"
            />
          </div>
        </div>

        {/* Display chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {result.cleanedList.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-gray-50 dark:bg-[#222222] border border-gray-200 dark:border-[#2E2E2E] rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 font-mono"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Formato en Línea:
          </span>
          <input
            type="text"
            value={result.singleLineOutput}
            readOnly
            className="w-full p-3 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
          />
        </div>
      </div>
    </div>
  );
};
