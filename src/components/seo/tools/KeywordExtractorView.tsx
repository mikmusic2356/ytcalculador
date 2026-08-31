import React, { useState } from 'react';
import { extractKeywordsFromText, ExtractedKeywordFrequency } from '../../../utils/seoTextProcessing';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { Search, Sparkles, Filter, BarChart3 } from 'lucide-react';

const SAMPLE_TEXT = `En este video analizamos a fondo el tráiler oficial de GTA 6, su fecha de lanzamiento y los requisitos para PC en 2026. Revisamos las nuevas mecánicas de juego, el mapa de Vice City, las físicas del motor gráfico y cómo optimizar el rendimiento. Si eres fanático de Grand Theft Auto, suscríbete para más guías y noticias actualizadas sobre GTA 6.`;

export const KeywordExtractorView: React.FC = () => {
  const [inputText, setInputText] = useState(SAMPLE_TEXT);
  const [activeTab, setActiveTab] = useState<'all' | 'unigram' | 'bigram' | 'trigram'>('all');
  const [extractedData, setExtractedData] = useState(() => extractKeywordsFromText(SAMPLE_TEXT));

  const handleExtract = () => {
    if (!inputText.trim()) return;
    setExtractedData(extractKeywordsFromText(inputText));
  };

  const allKeywords: ExtractedKeywordFrequency[] = [
    ...extractedData.topTrigrams,
    ...extractedData.topBigrams,
    ...extractedData.topUnigrams,
  ];

  const displayedKeywords =
    activeTab === 'all'
      ? allKeywords
      : activeTab === 'trigram'
      ? extractedData.topTrigrams
      : activeTab === 'bigram'
      ? extractedData.topBigrams
      : extractedData.topUnigrams;

  const commaSeparated = displayedKeywords.map((k) => k.term).join(', ');

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Extractor de Palabras Clave y Frases Relevantes
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Pega una transcripción, guión o borrador de video para extraer automáticamente términos clave individuales y frases compuestas (bigramas/trigramas).
          </p>
        </div>

        <textarea
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Pega el texto del guión o descripción aquí..."
          className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs outline-hidden"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
              Palabras analizadas: {extractedData.totalWords}
            </span>
          </div>

          <button
            type="button"
            onClick={handleExtract}
            disabled={!inputText.trim()}
            className="px-6 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Extraer Palabras Clave</span>
          </button>
        </div>
      </div>

      {/* Extracted list */}
      {displayedKeywords.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#2E2E2E] pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#FF0000]" />
                {displayedKeywords.length} Palabras y Frases Clave Extraídas
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ordenadas por frecuencia y densidad en el texto
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton
                textToCopy={commaSeparated}
                label="Copiar con Comas"
                variant="primary"
                size="sm"
                toolName="Extractor de Palabras Clave"
              />
              <DownloadButton content={commaSeparated} filename="keywords-extraidas.txt" size="sm" />
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: `Todas (${allKeywords.length})` },
              { id: 'trigram', label: `Frases de 3 palabras (${extractedData.topTrigrams.length})` },
              { id: 'bigram', label: `Frases de 2 palabras (${extractedData.topBigrams.length})` },
              { id: 'unigram', label: `Palabras individuales (${extractedData.topUnigrams.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#FF0000] text-white'
                    : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {displayedKeywords.map((kw, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 dark:bg-[#222222] border border-gray-200 dark:border-[#2E2E2E] rounded-xl flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {kw.term}
                  </p>
                  <span className="text-[10px] text-gray-400">
                    Densidad: {kw.densityPercentage}% ({kw.type})
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950/40 text-[#FF0000] text-xs font-bold rounded-lg font-mono shrink-0">
                  {kw.count}x
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <textarea
              rows={3}
              value={commaSeparated}
              readOnly
              className="w-full p-3.5 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};
