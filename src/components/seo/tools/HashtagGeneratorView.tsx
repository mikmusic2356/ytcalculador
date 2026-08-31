import React, { useState } from 'react';
import { generateHashtags } from '../../../utils/seoTextProcessing';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { Hash, Sparkles, Sliders } from 'lucide-react';

export const HashtagGeneratorView: React.FC = () => {
  const [topic, setTopic] = useState('GTA 6');
  const [count, setCount] = useState<number>(10);
  const [hashtags, setHashtags] = useState<string[]>(() => generateHashtags('GTA 6', 10));

  const handleGenerate = () => {
    if (!topic.trim()) return;
    const res = generateHashtags(topic, count);
    setHashtags(res);
  };

  const singleLineText = hashtags.join(' ');
  const commaSeparated = hashtags.join(', ');

  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-900 dark:text-white">
            Tema o Título del Video
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej: GTA 6 Gameplay o Curso de Edición"
            className="w-full p-3.5 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-sm outline-hidden"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Cantidad de Hashtags:
            </span>
            <div className="flex items-center gap-1.5">
              {[5, 10, 15].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    setCount(n);
                    setHashtags(generateHashtags(topic, n));
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    count === n
                      ? 'bg-[#FF0000] text-white'
                      : 'bg-gray-100 dark:bg-[#252525] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!topic.trim()}
            className="px-6 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Hash className="w-4 h-4" />
            <span>Generar Hashtags</span>
          </button>
        </div>
      </div>

      {/* Results Card */}
      {hashtags.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#2E2E2E] pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#FF0000]" />
                {hashtags.length} Hashtags Generados en Formato CamelCase
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Listos para pegar en tu descripción o título
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <CopyButton
                textToCopy={singleLineText}
                label="Copiar Espaciados"
                variant="primary"
                size="sm"
                toolName="Generador de Hashtags"
              />
              <CopyButton
                textToCopy={commaSeparated}
                label="Con Comas"
                variant="secondary"
                size="sm"
                toolName="Generador de Hashtags"
              />
            </div>
          </div>

          {/* Chips Grid */}
          <div className="flex flex-wrap gap-2.5">
            {hashtags.map((h, idx) => (
              <div
                key={idx}
                className="group px-3.5 py-2 bg-gray-50 dark:bg-[#222222] border border-gray-200 dark:border-[#2E2E2E] hover:border-red-300 dark:hover:border-red-900/50 rounded-xl flex items-center gap-2 transition-all"
              >
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {h}
                </span>
                <CopyButton
                  textToCopy={h}
                  label="Copiar"
                  size="sm"
                  variant="ghost"
                  className="p-0 text-[10px] opacity-70 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Texto Completo para la Descripción:
            </span>
            <input
              type="text"
              value={singleLineText}
              readOnly
              className="w-full p-3 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};
