import React, { useState } from 'react';
import { clusterKeywords, KeywordCluster } from '../../../utils/seoTextProcessing';
import { KeywordGroupCard } from '../KeywordGroupCard';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { FolderTree, Sparkles, X, ListPlus } from 'lucide-react';

const INITIAL_KEYWORDS = `gta 6 trailer oficial
gta 6 gameplay español
gta 6 fecha de lanzamiento
como jugar gta 6 en pc
trucos de gta 6
requisitos minimos gta 6
analisis completo gta 6
trailer reaccion gta 6
gta 6 mapa vice city
noticias gta 6 novedades
curiosidades de gta 6
descargar gta 6`;

export const KeywordClustererView: React.FC = () => {
  const [inputText, setInputText] = useState(INITIAL_KEYWORDS);
  const [clusters, setClusters] = useState<KeywordCluster[]>(() =>
    clusterKeywords(INITIAL_KEYWORDS.split('\n'))
  );

  const handleCluster = () => {
    const rawList = inputText
      .split(/[\n,]/)
      .map((k) => k.trim())
      .filter(Boolean);
    const result = clusterKeywords(rawList);
    setClusters(result);
  };

  const exportAllFormatted = clusters
    .map(
      (c) =>
        `📁 ${c.title.toUpperCase()} (${c.keywords.length} términos):\n${c.keywords.map((k) => `  • ${k}`).join('\n')}`
    )
    .join('\n\n');

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Lista de Palabras Clave a Agrupar
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pega una lista de palabras clave (una por línea o separadas por comas).
            </p>
          </div>
          {inputText && (
            <button
              type="button"
              onClick={() => setInputText('')}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Limpiar
            </button>
          )}
        </div>

        <textarea
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Pega aquí tus palabras clave, una por línea..."
          className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] dark:focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 rounded-xl text-gray-900 dark:text-white text-sm font-mono outline-hidden transition-all"
        />

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {inputText.split(/[\n,]/).filter((l) => l.trim().length > 0).length} palabras clave ingresadas
          </span>
          <button
            type="button"
            onClick={handleCluster}
            disabled={!inputText.trim()}
            className="px-5 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-2"
          >
            <FolderTree className="w-4 h-4" />
            <span>Agrupar por Similitud</span>
          </button>
        </div>
      </div>

      {clusters.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E]">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-[#FF0000]" />
                {clusters.length} Grupos Temáticos Identificados
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Agrupados por similitud léxica e intersección de tokens
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton
                textToCopy={exportAllFormatted}
                label="Copiar Todos los Grupos"
                size="sm"
                variant="primary"
                toolName="Agrupador de Keywords"
              />
              <DownloadButton
                content={exportAllFormatted}
                filename="clusters-keywords.txt"
                size="sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clusters.map((cluster) => (
              <KeywordGroupCard
                key={cluster.id}
                title={cluster.title}
                keywords={cluster.keywords}
                similarityScore={cluster.similarityScore}
                toolName="Agrupador de Keywords"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
