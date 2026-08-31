import React, { useState } from 'react';
import { analyzeTitle, TitleAnalysisResult } from '../../../utils/seoTextProcessing';
import { SeoScore } from '../SeoScore';
import { AnalysisResult } from '../AnalysisResult';
import { CopyButton } from '../CopyButton';
import { analytics } from '../../../utils/analytics';
import { Type, Sparkles, AlertCircle, CheckCircle2, Search } from 'lucide-react';

export const TitleAnalyzerView: React.FC = () => {
  const [title, setTitle] = useState('Cómo Jugar GTA 6 en PC: Guía Completa Paso a Paso (2026)');
  const [keyword, setKeyword] = useState('GTA 6');
  const [result, setResult] = useState<TitleAnalysisResult>(() =>
    analyzeTitle(
      'Cómo Jugar GTA 6 en PC: Guía Completa Paso a Paso (2026)',
      'GTA 6'
    )
  );

  const handleAnalyze = () => {
    if (!title.trim()) return;
    const res = analyzeTitle(title, keyword);
    setResult(res);
    analytics.trackTitleAnalyzed('Analizador de Títulos', { title, score: res.overallScore });
  };

  const strengths: string[] = [];
  const warnings: string[] = [];

  if (result.charCount >= 45 && result.charCount <= 70) {
    strengths.push(`Longitud óptima (${result.charCount} caracteres) para evitar recortes en móviles.`);
  } else if (result.charCount > 70) {
    warnings.push(`Longitud extendida (${result.charCount} caracteres): los móviles suelen truncar después de ~60 caracteres.`);
  } else if (result.charCount < 30) {
    warnings.push(`Título breve (${result.charCount} caracteres): podría faltar contexto o un beneficio explícito.`);
  }

  if (result.keywordFound) {
    strengths.push(`Palabra clave "${keyword}" detectada en posición ${result.keywordPosition === 'start' ? 'inicial (muy recomendada)' : result.keywordPosition}.`);
  } else if (keyword.trim()) {
    warnings.push(`La palabra clave objetivo "${keyword}" no se encuentra dentro del título.`);
  }

  if (result.hasNumbers) {
    strengths.push(`Incluye números (${result.numbersList.join(', ')}), lo cual facilita el escaneo visual.`);
  }

  if (result.hasQuestionMark) {
    strengths.push('Estructurado como pregunta que apela a la curiosidad o solución de dudas.');
  }

  if (result.isAllUppercase) {
    warnings.push('El título contiene más de un 85% de mayúsculas sostenidas.');
  }

  if (result.repeatedWords.length > 0) {
    warnings.push(`Palabras repetidas detectadas: ${result.repeatedWords.join(', ')}.`);
  }

  return (
    <div className="space-y-6">
      {/* Input panel */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-900 dark:text-white">
            Título a Analizar
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Escribe el título de tu video..."
            className="w-full p-3.5 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] dark:focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 rounded-xl text-gray-900 dark:text-white text-base outline-hidden transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-[#FF0000]" />
            Palabra Clave Objetivo (Opcional)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Ej: GTA 6"
              className="flex-1 p-3 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] dark:focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 rounded-xl text-gray-900 dark:text-white text-sm outline-hidden"
            />
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!title.trim()}
              className="px-6 py-3 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
            >
              <Type className="w-4 h-4" />
              <span>Analizar Título</span>
            </button>
          </div>
        </div>
      </div>

      {/* Score gauge & detailed breakdown */}
      <SeoScore
        score={result.overallScore}
        title="Puntuación de Optimización Textual del Título"
        subtitle="Evaluación objetiva de longitud, legibilidad, palabras clave y estructura retórica"
        breakdown={[
          {
            label: 'Longitud y Visibilidad',
            points: result.scoreBreakdown.lengthScore,
            maxPoints: 25,
            notes: `${result.charCount} caracteres (${result.lengthStatus})`,
          },
          {
            label: 'Presencia de Keyword',
            points: result.scoreBreakdown.keywordScore,
            maxPoints: 25,
            notes: result.keywordFound
              ? `Keyword en posición ${result.keywordPosition}`
              : 'Keyword no detectada',
          },
          {
            label: 'Legibilidad y Claridad',
            points: result.scoreBreakdown.readabilityScore,
            maxPoints: 20,
            notes: result.readabilityLevel,
          },
          {
            label: 'Estructura Tipográfica',
            points: result.scoreBreakdown.structureScore,
            maxPoints: 15,
            notes: `${result.uppercasePercentage}% mayúsculas`,
          },
          {
            label: 'Factores de Interés / Gancho',
            points: result.scoreBreakdown.interestScore,
            maxPoints: 15,
            notes: result.hasNumbers || result.hasQuestionMark ? 'Preguntas o números' : 'Sin elementos de intriga',
          },
        ]}
      />

      {/* Strengths & Actionable Recommendations */}
      <AnalysisResult
        strengths={strengths}
        warnings={warnings}
        recommendations={result.recommendations}
        readabilityNote={`Nivel de legibilidad: ${result.readabilityLevel} (${result.readabilityScore}/100). El título consta de ${result.wordCount} palabras y ${result.charCount} caracteres.`}
      />
    </div>
  );
};
