import React, { useState } from 'react';
import { extractTagsFromTitle } from '../../../utils/seoTextProcessing';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { Tag, Sparkles, FileText } from 'lucide-react';

export const TagFromTitleView: React.FC = () => {
  const [title, setTitle] = useState('Cómo Jugar GTA 6 en PC: Guía Completa de Instalación y Requisitos (2026)');
  const [tags, setTags] = useState<string[]>(() =>
    extractTagsFromTitle('Cómo Jugar GTA 6 en PC: Guía Completa de Instalación y Requisitos (2026)')
  );

  const handleExtract = () => {
    if (!title.trim()) return;
    const res = extractTagsFromTitle(title);
    setTags(res);
  };

  const commaSeparated = tags.join(', ');

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-900 dark:text-white">
            Título de tu Video
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Pega el título completo..."
            className="w-full p-3.5 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-sm outline-hidden"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleExtract}
            disabled={!title.trim()}
            className="px-6 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Extraer Tags desde Título</span>
          </button>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#2E2E2E] pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#FF0000]" />
                {tags.length} Etiquetas Extraídas del Título
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Términos clave y n-gramas relevantes filtrados
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton
                textToCopy={commaSeparated}
                label="Copiar con Comas"
                variant="primary"
                size="sm"
                toolName="Tags desde Título"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((t, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-gray-50 dark:bg-[#222222] border border-gray-200 dark:border-[#2E2E2E] rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-200"
              >
                {t}
              </span>
            ))}
          </div>

          <textarea
            rows={3}
            value={commaSeparated}
            readOnly
            className="w-full p-3.5 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
          />
        </div>
      )}
    </div>
  );
};
