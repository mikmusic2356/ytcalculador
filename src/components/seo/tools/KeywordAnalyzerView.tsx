import React, { useState } from 'react';
import { analyzeKeywordList, KeywordListAnalysis } from '../../../utils/seoTextProcessing';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { BarChart2, Hash, Type, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const SAMPLE_LIST = `gta 6 trailer oficial
gta 6 gameplay en español
como jugar gta 6 en pc
gta 6 fecha de lanzamiento
trucos de gta 6
analisis completo gta 6
gta 6 gameplay en español
mejores momentos gta 6
gta 6 precio y reserva
requisitos minimos gta 6 pc`;

export const KeywordAnalyzerView: React.FC = () => {
  const [inputText, setInputText] = useState(SAMPLE_LIST);
  const [analysis, setAnalysis] = useState<KeywordListAnalysis>(() =>
    analyzeKeywordList(SAMPLE_LIST)
  );

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    const res = analyzeKeywordList(inputText);
    setAnalysis(res);
  };

  return (
    <div className="space-y-6">
      {/* Input panel */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Pega tu Lista de Palabras Clave
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Analiza frecuencia de palabras, duplicados, términos long-tail y métricas léxicas reales.
          </p>
        </div>

        <textarea
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Pega tu lista de keywords aquí..."
          className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] dark:focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 rounded-xl text-gray-900 dark:text-white text-sm font-mono outline-hidden transition-all"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!inputText.trim()}
            className="px-5 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-2"
          >
            <BarChart2 className="w-4 h-4" />
            <span>Calcular Métricas Textuales</span>
          </button>
        </div>
      </div>

      {analysis.totalKeywords > 0 && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Total Keywords
              </span>
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {analysis.totalKeywords}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {analysis.uniqueKeywords} únicas
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Duplicados
              </span>
              <p
                className={`text-2xl font-black ${
                  analysis.duplicateKeywords > 0 ? 'text-amber-500' : 'text-emerald-500'
                }`}
              >
                {analysis.duplicateKeywords}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {analysis.duplicateKeywords === 0
                  ? 'Sin repeticiones'
                  : 'Términos idénticos'}
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Longitud Media
              </span>
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {analysis.avgLengthChars}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                caracteres por keyword
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Palabras / KW
              </span>
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {analysis.avgWordsPerKeyword}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                promedio de tokens
              </p>
            </div>
          </div>

          {/* Word Frequency Distribution */}
          {analysis.frequencyMap.length > 0 && (
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#FF0000]" />
                  Frecuencia de Palabras Clave Más Repetidas
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Excluyendo artículos y preposiciones comunes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {analysis.frequencyMap.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 dark:bg-[#222222] rounded-xl border border-gray-100 dark:border-[#2C2C2C] flex items-center justify-between"
                  >
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      #{idx + 1} {item.word}
                    </span>
                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950/40 text-[#FF0000] text-xs font-bold rounded-lg font-mono">
                      {item.count} veces ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed items list */}
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Desglose Individual de Términos
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-[#2A2A2A] max-h-80 overflow-y-auto">
              {analysis.items.map((it, idx) => (
                <div
                  key={idx}
                  className="py-2.5 flex items-center justify-between gap-3 text-xs"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200 truncate">
                    {it.keyword}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400 font-mono">
                      {it.charCount} chars
                    </span>
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400 font-mono">
                      {it.wordCount} palabras
                    </span>
                    {it.isLongTail && (
                      <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold">
                        Long-Tail
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
