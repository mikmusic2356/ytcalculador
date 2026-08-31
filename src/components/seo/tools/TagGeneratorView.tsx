import React, { useState } from 'react';
import { generateTagsFromInput } from '../../../utils/seoTextProcessing';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { Tag, Sparkles, Plus, Check } from 'lucide-react';

export const TagGeneratorView: React.FC = () => {
  const [keyword, setKeyword] = useState('GTA 6');
  const [title, setTitle] = useState('GTA 6 en PC: Guía y Requisitos Oficiales');
  const [tagsResult, setTagsResult] = useState(() =>
    generateTagsFromInput('GTA 6', 'GTA 6 en PC: Guía y Requisitos Oficiales')
  );

  const handleGenerate = () => {
    const res = generateTagsFromInput(keyword, title);
    setTagsResult(res);
  };

  const commaSeparated = tagsResult.allCombined.join(', ');
  const totalChars = commaSeparated.length;

  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Palabra Clave Principal
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Ej: GTA 6"
              className="w-full p-3.5 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-sm outline-hidden"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Título del Video (Opcional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Tráiler Oficial GTA 6..."
              className="w-full p-3.5 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-sm outline-hidden"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!keyword.trim()}
            className="px-6 py-3 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <Tag className="w-4 h-4" />
            <span>Generar Etiquetas con Comas</span>
          </button>
        </div>
      </div>

      {/* Output result */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#2E2E2E] pb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#FF0000]" />
              {tagsResult.allCombined.length} Tags Generados ({totalChars} / 500 caracteres)
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Formato separado por comas listo para pegar en la casilla de etiquetas de YouTube Studio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton
              textToCopy={commaSeparated}
              label="Copiar Todos los Tags"
              variant="primary"
              size="sm"
              toolName="Generador de Tags"
            />
            <DownloadButton content={commaSeparated} filename="tags-youtube.txt" size="sm" />
          </div>
        </div>

        {/* Tags Chips Display */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tagsResult.allCombined.map((t, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-gray-50 dark:bg-[#222222] border border-gray-200 dark:border-[#2E2E2E] rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5"
              >
                <span>{t}</span>
              </span>
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Texto Separado por Comas para YouTube Studio:
            </span>
            <textarea
              rows={4}
              value={commaSeparated}
              readOnly
              className="w-full p-3.5 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
