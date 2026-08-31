import React, { useState } from 'react';
import { analyzeTitle, TitleAnalysisResult } from '../../../utils/seoTextProcessing';
import { CopyButton } from '../CopyButton';
import { Columns, Award, AlertCircle, CheckCircle2, Trophy, ArrowRight } from 'lucide-react';

export const TitleComparatorView: React.FC = () => {
  const [keyword, setKeyword] = useState('GTA 6');
  const [titleA, setTitleA] = useState('GTA 6: Guía Completa de Trucos y Secretos en Español');
  const [titleB, setTitleB] = useState('¿Vale la pena GTA 6? Mi Opinión Sincera tras 20 Horas de Juego');
  const [titleC, setTitleC] = useState('Top 10 Secretos Ocultos en el Tráiler de GTA 6 que Nadie Vio');

  const analysisA = analyzeTitle(titleA, keyword);
  const analysisB = analyzeTitle(titleB, keyword);
  const analysisC = analyzeTitle(titleC, keyword);

  const scores = [
    { label: 'Título A', title: titleA, score: analysisA.overallScore, analysis: analysisA },
    { label: 'Título B', title: titleB, score: analysisB.overallScore, analysis: analysisB },
    { label: 'Título C', title: titleC, score: analysisC.overallScore, analysis: analysisC },
  ].sort((a, b) => b.score - a.score);

  const bestOption = scores[0];

  return (
    <div className="space-y-6">
      {/* Keyword input */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Compara Opciones de Título para tu Video
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Analiza diferencias de longitud, legibilidad y presencia de palabras clave lado a lado.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-500 shrink-0">Keyword:</span>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Ej: GTA 6"
              className="p-2 text-xs bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-lg text-gray-900 dark:text-white outline-hidden w-full sm:w-40 font-bold"
            />
          </div>
        </div>

        {/* 3 Input Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-blue-600 dark:text-blue-400">Opción A</span>
              <span className="text-gray-400">{titleA.length} chars</span>
            </div>
            <textarea
              rows={3}
              value={titleA}
              onChange={(e) => setTitleA(e.target.value)}
              placeholder="Opción de título A..."
              className="w-full p-3 text-xs bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white outline-hidden"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-purple-600 dark:text-purple-400">Opción B</span>
              <span className="text-gray-400">{titleB.length} chars</span>
            </div>
            <textarea
              rows={3}
              value={titleB}
              onChange={(e) => setTitleB(e.target.value)}
              placeholder="Opción de título B..."
              className="w-full p-3 text-xs bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white outline-hidden"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-600 dark:text-emerald-400">Opción C</span>
              <span className="text-gray-400">{titleC.length} chars</span>
            </div>
            <textarea
              rows={3}
              value={titleC}
              onChange={(e) => setTitleC(e.target.value)}
              placeholder="Opción de título C..."
              className="w-full p-3 text-xs bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Best option highlight banner */}
      <div className="p-4 sm:p-5 bg-linear-to-r from-red-500/10 via-amber-500/10 to-transparent border border-red-200 dark:border-red-900/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF0000] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF0000]">
                Mayor Optimización Textual: {bestOption.label} ({bestOption.score}/100 pts)
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
              "{bestOption.title}"
            </p>
          </div>
        </div>
        <CopyButton
          textToCopy={bestOption.title}
          label={`Copiar ${bestOption.label}`}
          variant="primary"
          size="sm"
          toolName="Comparador de Títulos"
        />
      </div>

      {/* Side by side comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Título A', analysis: analysisA, title: titleA, color: 'border-blue-200 dark:border-blue-900/40' },
          { label: 'Título B', analysis: analysisB, title: titleB, color: 'border-purple-200 dark:border-purple-900/40' },
          { label: 'Título C', analysis: analysisC, title: titleC, color: 'border-emerald-200 dark:border-emerald-900/40' },
        ].map((col, idx) => (
          <div
            key={idx}
            className={`bg-white dark:bg-[#1A1A1A] rounded-2xl border ${col.color} p-5 space-y-4 shadow-xs flex flex-col justify-between`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  {col.label}
                </span>
                <span className="text-lg font-black text-gray-900 dark:text-white">
                  {col.analysis.overallScore} <span className="text-xs font-normal text-gray-400">/100</span>
                </span>
              </div>

              <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-3">
                "{col.title || 'Sin texto'}"
              </p>

              {/* Specs */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-[#2A2A2A] text-xs">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Caracteres:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {col.analysis.charCount} ({col.analysis.lengthStatus})
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Palabras:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{col.analysis.wordCount}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Keyword:</span>
                  <span
                    className={`font-bold ${
                      col.analysis.keywordFound ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {col.analysis.keywordFound ? `Sí (${col.analysis.keywordPosition})` : 'No'}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Ganchos:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {col.analysis.hasNumbers ? 'Números' : ''}{' '}
                    {col.analysis.hasQuestionMark ? 'Pregunta' : ''}
                    {!col.analysis.hasNumbers && !col.analysis.hasQuestionMark ? 'Directo' : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-[#2A2A2A]">
              <CopyButton
                textToCopy={col.title}
                label={`Copiar ${col.label}`}
                size="sm"
                variant="secondary"
                className="w-full"
                toolName="Comparador de Títulos"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
