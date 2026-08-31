import React, { useState } from 'react';
import { generateTitleFormulas } from '../../../utils/seoTextProcessing';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { Wand2, Sparkles, Check, Sliders, Type } from 'lucide-react';

export const TitleGeneratorView: React.FC = () => {
  const [topic, setTopic] = useState('GTA 6');
  const [keyword, setKeyword] = useState('GTA 6');
  const [tone, setTone] = useState<
    'curioso' | 'emocional' | 'directo' | 'polemico' | 'educativo' | 'reaccion' | 'misterio' | 'entretenimiento'
  >('educativo');
  const [titles, setTitles] = useState<string[]>(() =>
    generateTitleFormulas('GTA 6', 'GTA 6', 'educativo')
  );

  const handleGenerate = () => {
    const list = generateTitleFormulas(topic, keyword, tone);
    setTitles(list);
  };

  const tonesList: Array<{
    id: typeof tone;
    label: string;
    desc: string;
  }> = [
    { id: 'educativo', label: '🎓 Educativo / Tutorial', desc: 'Guías paso a paso, errores y cursos' },
    { id: 'directo', label: '🎯 Directo / Análisis', desc: 'Reseñas objetivas, comparativas y guías rápidas' },
    { id: 'curioso', label: '❓ Curioso / Pregunta', desc: 'Preguntas intrigantes y datos poco conocidos' },
    { id: 'polemico', label: '🔥 Polémico / Debate', desc: 'Mitos, verdades incómodas y contrastes' },
    { id: 'emocional', label: '❤️ Experiencia Personal', desc: 'Primeras impresiones y lecciones aprendidas' },
    { id: 'reaccion', label: '😲 Reacción en Vivo', desc: 'Momentos destacados y análisis en directo' },
    { id: 'misterio', label: '🕵️ Enigma / Misterio', desc: 'Secretos ocultos y teorías explicadas' },
    { id: 'entretenimiento', label: '🎮 Retos y Humor', desc: 'Desafíos, experimentos y juegos' },
  ];

  const allTitlesText = titles.join('\n');

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Tema General del Video
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ej: GTA 6 o Fotografía Nocturna"
              className="w-full p-3.5 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-sm outline-hidden"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Palabra Clave Exacta a Incluir
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Ej: GTA 6"
              className="w-full p-3.5 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-sm outline-hidden"
            />
          </div>
        </div>

        {/* Tone Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#FF0000]" />
            Selecciona el Tono y Estilo de Comunicación:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {tonesList.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTone(t.id);
                  const gen = generateTitleFormulas(topic, keyword, t.id);
                  setTitles(gen);
                }}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  tone === t.id
                    ? 'bg-red-50/70 dark:bg-red-950/30 border-[#FF0000] text-[#FF0000] shadow-xs'
                    : 'bg-gray-50 dark:bg-[#222222] border-gray-200 dark:border-[#303030] text-gray-800 dark:text-gray-200 hover:border-gray-400'
                }`}
              >
                <p className="text-xs font-bold truncate">{t.label}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                  {t.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!keyword.trim() && !topic.trim()}
            className="px-6 py-3 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            <span>Generar Propuestas de Título</span>
          </button>
        </div>
      </div>

      {/* Generated Titles List */}
      {titles.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-[#2E2E2E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {titles.length} Propuestas Estructuradas de Título
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Fórmulas retóricas probadas para mejorar el interés y la claridad
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton
                textToCopy={allTitlesText}
                label="Copiar Todos"
                size="sm"
                variant="primary"
                toolName="Generador de Títulos"
              />
              <DownloadButton
                content={allTitlesText}
                filename="titulos-propuestas-youtube.txt"
                size="sm"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-[#2A2A2A]">
            {titles.map((t, idx) => (
              <div
                key={idx}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/70 dark:hover:bg-[#222222]/70 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-[#282828] text-gray-600 dark:text-gray-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {t}
                    </p>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {t.length} caracteres
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <CopyButton
                    textToCopy={t}
                    label="Copiar"
                    size="sm"
                    variant="secondary"
                    toolName="Generador de Títulos"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
