import React, { useState } from 'react';
import { KeywordInput } from '../KeywordInput';
import { KeywordGroupCard } from '../KeywordGroupCard';
import { generateRelatedKeywordsGrouped, RelatedKeywordsResult } from '../../../utils/seoTextProcessing';
import { analytics } from '../../../utils/analytics';
import { HelpCircle, FolderTree, Sparkles } from 'lucide-react';

export const RelatedKeywordsView: React.FC = () => {
  const [seed, setSeed] = useState('GTA 6');
  const [result, setResult] = useState<RelatedKeywordsResult>(() =>
    generateRelatedKeywordsGrouped('GTA 6')
  );

  const handleGenerate = () => {
    if (!seed.trim()) return;
    const res = generateRelatedKeywordsGrouped(seed);
    setResult(res);
    analytics.trackKeywordGenerated('Keywords Relacionadas', { seed, count: 25 });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <KeywordInput
          value={seed}
          onChange={setSeed}
          onSubmit={handleGenerate}
          label="Término para Explorar Preguntas y Relacionadas"
          helperText="Organiza tu concepto en preguntas clave, sinónimos, variaciones directas y frases long-tail."
          examples={['GTA 6', 'Podcast', 'Iphone 16', 'Photoshop', 'Invertir en Bolsa']}
          buttonLabel="Organizar Términos"
        />
      </div>

      {result.seed && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-[#FF0000]" />
              Grupos Semánticos para "{result.seed}"
            </h3>
          </div>

          <div className="space-y-4">
            <KeywordGroupCard
              title="❓ Preguntas Frecuentes de la Audiencia"
              keywords={result.questions}
              badge="Ideas de Capítulos"
              toolName="Palabras Relacionadas"
            />
            <KeywordGroupCard
              title="🎯 Frases Long-Tail Específicas"
              keywords={result.longTail}
              badge="Alta Especificidad"
              toolName="Palabras Relacionadas"
            />
            <KeywordGroupCard
              title="🔄 Variaciones y Formatos de Video"
              keywords={result.variations}
              badge="Formatos"
              toolName="Palabras Relacionadas"
            />
            <KeywordGroupCard
              title="📚 Sinónimos y Términos Afines"
              keywords={result.synonymsAndTerms}
              badge="Semántica"
              toolName="Palabras Relacionadas"
            />
            <KeywordGroupCard
              title="🔍 Búsquedas Potenciales Directas"
              keywords={result.potentialSearches}
              badge="Consultas"
              toolName="Palabras Relacionadas"
            />
          </div>
        </div>
      )}
    </div>
  );
};
