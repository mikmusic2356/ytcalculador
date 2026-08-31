import React, { useState } from 'react';
import { formatDescription } from '../../../utils/seoTextProcessing';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { Sliders, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

const DIRTY_SAMPLE = `En este video analizamos     GTA 6 en 2026.



Descubre todos los secretos y el mapa oficial.   Suscribete al canal:  https://youtube.com/@micanal

#gta6 #Gaming #GTA6   #video #gaming #gta6`;

export const DescriptionFormatterView: React.FC = () => {
  const [inputText, setInputText] = useState(DIRTY_SAMPLE);
  const [result, setResult] = useState(() => formatDescription(DIRTY_SAMPLE));

  const handleFormat = () => {
    const res = formatDescription(inputText);
    setResult(res);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Formateador y Normalizador de Descripción
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Pega una descripción desordenada para limpiar espacios excesivos, saltos de línea repetidos y duplicados de hashtags.
          </p>
        </div>

        <textarea
          rows={7}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Pega tu descripción sin formatear..."
          className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleFormat}
            disabled={!inputText.trim()}
            className="px-6 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <Sliders className="w-4 h-4" />
            <span>Formatear y Limpiar Texto</span>
          </button>
        </div>
      </div>

      {/* Changes summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-white dark:bg-[#1A1A1A] rounded-xl border border-gray-200 dark:border-[#2E2E2E] text-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Párrafos Limpios</span>
          <p className="text-xl font-black text-gray-900 dark:text-white">{result.paragraphsCount}</p>
        </div>
        <div className="p-3.5 bg-white dark:bg-[#1A1A1A] rounded-xl border border-gray-200 dark:border-[#2E2E2E] text-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Enlaces Detectados</span>
          <p className="text-xl font-black text-gray-900 dark:text-white">{result.linksCount}</p>
        </div>
        <div className="p-3.5 bg-white dark:bg-[#1A1A1A] rounded-xl border border-gray-200 dark:border-[#2E2E2E] text-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Hashtags Únicos</span>
          <p className="text-xl font-black text-gray-900 dark:text-white">{result.hashtagsCount}</p>
        </div>
      </div>

      {/* Output card */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Descripción Limpia y Formateada
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {result.changesMade.join(' • ')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton
              textToCopy={result.cleanedText}
              label="Copiar Limpio"
              variant="primary"
              size="sm"
              toolName="Formateador de Descripción"
            />
            <DownloadButton content={result.cleanedText} filename="descripcion-limpia.txt" size="sm" />
          </div>
        </div>

        <textarea
          rows={9}
          value={result.cleanedText}
          readOnly
          className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
        />
      </div>
    </div>
  );
};
