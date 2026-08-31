import React, { useState } from 'react';
import { inferKeywordsFromTitleAndDesc } from '../../../utils/seoTextProcessing';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { Sparkles, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export const KeywordsFromTitleDescView: React.FC = () => {
  const [title, setTitle] = useState('GTA 6 en PC: Guía de Instalación y Requisitos (2026)');
  const [desc, setDesc] = useState(
    'En este video te mostramos cómo jugar GTA 6 en PC con la mejor configuración gráfica. Requisitos oficiales y consejos de optimización.'
  );
  const [result, setResult] = useState(() =>
    inferKeywordsFromTitleAndDesc(
      'GTA 6 en PC: Guía de Instalación y Requisitos (2026)',
      'En este video te mostramos cómo jugar GTA 6 en PC con la mejor configuración gráfica. Requisitos oficiales y consejos de optimización.'
    )
  );

  const handleExtract = () => {
    const res = inferKeywordsFromTitleAndDesc(title, desc);
    setResult(res);
  };

  const allTags = [
    result.primaryKeywordSuggested.term,
    ...result.secondaryKeywords.map((k) => k.term),
    ...result.longTailPhrases.map((k) => k.term),
  ];

  const allKeywordsComma = allTags.join(', ');

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Generador de Keywords Cruzadas (Título + Descripción)
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Cruza términos presentes en ambos campos para identificar las coincidencias más sólidas y generar etiquetas coherentes.
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Título del Video
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título..."
            className="w-full p-3 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs outline-hidden"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Descripción del Video
          </label>
          <textarea
            rows={4}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Descripción..."
            className="w-full p-3 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs outline-hidden"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleExtract}
            className="px-6 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Extraer y Cruzar Términos</span>
          </button>
        </div>
      </div>

      {/* Primary suggested */}
      {result.primaryKeywordSuggested && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl space-y-1.5">
          <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Palabra Clave Principal Detectada:
          </h4>
          <p className="text-sm font-extrabold text-emerald-900 dark:text-emerald-100">
            "{result.primaryKeywordSuggested.term}"
          </p>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
            {result.primaryKeywordSuggested.reason}
          </p>
        </div>
      )}

      {/* Combined output */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#2E2E2E] pb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF0000]" />
              {allTags.length} Etiquetas Generadas del Análisis Conjunto
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton
              textToCopy={allKeywordsComma}
              label="Copiar con Comas"
              variant="primary"
              size="sm"
              toolName="Keywords Cruzadas"
            />
            <DownloadButton content={allKeywordsComma} filename="keywords-cruzadas.txt" size="sm" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {allTags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-gray-50 dark:bg-[#222222] border border-gray-200 dark:border-[#2E2E2E] rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>

        <textarea
          rows={3}
          value={allKeywordsComma}
          readOnly
          className="w-full p-3.5 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
        />
      </div>
    </div>
  );
};
