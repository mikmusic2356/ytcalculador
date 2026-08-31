import React, { useState } from 'react';
import { analyzeHashtags, HashtagsAnalysis } from '../../../utils/seoTextProcessing';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { Hash, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const INITIAL_TAGS = '#GTA6 #Gaming #gta6 #PlayStation5 #Trailer 2026 #Gaming #PC';

export const HashtagAnalyzerView: React.FC = () => {
  const [input, setInput] = useState(INITIAL_TAGS);
  const [analysis, setAnalysis] = useState<HashtagsAnalysis>(() => analyzeHashtags(INITIAL_TAGS));

  const handleAnalyze = () => {
    const res = analyzeHashtags(input);
    setAnalysis(res);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Pega tu Bloque de Hashtags
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Detecta duplicados (sin importar mayúsculas/minúsculas), errores de espacios y formato inválido.
          </p>
        </div>

        <textarea
          rows={5}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setAnalysis(analyzeHashtags(e.target.value));
          }}
          placeholder="#tag1 #tag2 #tag3..."
          className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAnalyze}
            className="px-6 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-2"
          >
            <Hash className="w-4 h-4" />
            <span>Analizar Sintaxis y Duplicados</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase">Total Hashtags</span>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{analysis.total}</p>
        </div>
        <div className="p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase">Únicos</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{analysis.uniqueCount}</p>
        </div>
        <div className="p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase">Duplicados</span>
          <p className={`text-2xl font-black ${analysis.duplicateCount > 0 ? 'text-amber-500' : 'text-gray-400'}`}>
            {analysis.duplicateCount}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase">Con Errores</span>
          <p className={`text-2xl font-black ${analysis.invalidCount > 0 ? 'text-red-500' : 'text-gray-400'}`}>
            {analysis.invalidCount}
          </p>
        </div>
      </div>

      {/* Individual hashtag list */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          Inspección Detallada de Cada Hashtag
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {analysis.list.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                !item.isValid
                  ? 'bg-red-50/70 dark:bg-red-950/20 border-red-200 dark:border-red-900/40'
                  : item.isDuplicate
                  ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                  : 'bg-gray-50 dark:bg-[#222222] border-gray-200 dark:border-[#2C2C2C]'
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 dark:text-white font-mono truncate">
                  {item.tag}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                  {!item.isValid && (
                    <span className="text-red-600 dark:text-red-400 font-bold">
                      ⚠️ Inválido (contiene espacios o caracteres no permitidos)
                    </span>
                  )}
                  {item.isDuplicate && (
                    <span className="text-amber-600 dark:text-amber-400 font-bold">
                      🔄 Duplicado detectado
                    </span>
                  )}
                  {item.isValid && !item.isDuplicate && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      ✓ Válido ({item.length} chars)
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
