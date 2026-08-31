import React, { useState } from 'react';
import { cleanSeoText } from '../../../utils/seoTextProcessing';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { Eraser, CheckCircle2, ArrowRight } from 'lucide-react';

const SAMPLE_RAW_TEXT = `  GTA 6  guía    completa  y   análisis   oficial   en   2026.


Puntos clave:
• Novedades de Vice City...
• Nuevos personajes!!!   

Visita:  https://sitio.com    `;

export const TextCleanerView: React.FC = () => {
  const [inputText, setInputText] = useState(SAMPLE_RAW_TEXT);
  const [result, setResult] = useState(() => cleanSeoText(SAMPLE_RAW_TEXT));

  const handleClean = () => {
    const res = cleanSeoText(inputText);
    setResult(res);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Limpiador de Texto para Títulos y Descripciones
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Elimina espacios duplicados, saltos de línea repetidos, caracteres invisibles y normaliza signos de puntuación.
          </p>
        </div>

        <textarea
          rows={6}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setResult(cleanSeoText(e.target.value));
          }}
          placeholder="Pega el texto a limpiar aquí..."
          className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClean}
            className="px-6 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-2"
          >
            <Eraser className="w-4 h-4" />
            <span>Limpiar Texto</span>
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white dark:bg-[#1A1A1A] rounded-xl border border-gray-200 dark:border-[#2E2E2E] text-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Caracteres Antes</span>
          <p className="text-xl font-black text-gray-900 dark:text-white">{result.originalLength}</p>
        </div>
        <div className="p-3.5 bg-white dark:bg-[#1A1A1A] rounded-xl border border-gray-200 dark:border-[#2E2E2E] text-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Caracteres Después</span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{result.cleanedLength}</p>
        </div>
        <div className="p-3.5 bg-white dark:bg-[#1A1A1A] rounded-xl border border-gray-200 dark:border-[#2E2E2E] text-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Espacios Reducidos</span>
          <p className="text-xl font-black text-[#FF0000]">{result.spacesRemoved}</p>
        </div>
        <div className="p-3.5 bg-white dark:bg-[#1A1A1A] rounded-xl border border-gray-200 dark:border-[#2E2E2E] text-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Líneas Reducidas</span>
          <p className="text-xl font-black text-[#FF0000]">{result.linesRemoved}</p>
        </div>
      </div>

      {/* Output result */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#2E2E2E] pb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Texto Limpio y Normalizado
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Listo para usar en YouTube Studio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton
              textToCopy={result.cleanedText}
              label="Copiar Texto Limpio"
              variant="primary"
              size="sm"
              toolName="Limpiador de Texto"
            />
            <DownloadButton content={result.cleanedText} filename="texto-limpio.txt" size="sm" />
          </div>
        </div>

        <textarea
          rows={6}
          value={result.cleanedText}
          readOnly
          className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
        />
      </div>
    </div>
  );
};
