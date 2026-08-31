import React, { useState } from 'react';
import { KeywordInput } from '../KeywordInput';
import { KeywordList } from '../KeywordList';
import { generateLinguisticKeywords, KeywordVariation } from '../../../utils/seoTextProcessing';
import { analytics } from '../../../utils/analytics';
import { Sparkles, Layers } from 'lucide-react';

interface Props {
  onSelectKeyword?: (kw: string) => void;
}

export const KeywordGeneratorView: React.FC<Props> = ({ onSelectKeyword }) => {
  const [seed, setSeed] = useState('gta 6');
  const [intent, setIntent] = useState<'all' | 'informative' | 'search' | 'educational' | 'entertainment' | 'tutorial' | 'comparison' | 'news' | 'reaction'>('all');
  const [results, setResults] = useState<KeywordVariation[]>(() =>
    generateLinguisticKeywords('gta 6', 'all')
  );

  const handleGenerate = () => {
    if (!seed.trim()) return;
    const generated = generateLinguisticKeywords(seed, intent);
    setResults(generated);
    analytics.trackKeywordGenerated('Generador de Palabras Clave', { seed, count: generated.length });
  };

  const intentsList: Array<{ id: typeof intent; label: string }> = [
    { id: 'all', label: 'Todas las intenciones' },
    { id: 'tutorial', label: '🛠️ Tutoriales y Guías' },
    { id: 'educational', label: '🎓 Educativo / Cursos' },
    { id: 'search', label: '🔍 Reseñas y Compras' },
    { id: 'informative', label: '📖 Informativo / ¿Qué es?' },
    { id: 'comparison', label: '⚖️ Comparativas (vs)' },
    { id: 'entertainment', label: '🎮 Entretenimiento' },
    { id: 'news', label: '📰 Noticias y Lanzamiento' },
    { id: 'reaction', label: '😲 Reacción y Crítica' },
  ];

  return (
    <div className="space-y-6">
      {/* Control Card */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-5">
        <KeywordInput
          value={seed}
          onChange={setSeed}
          onSubmit={handleGenerate}
          label="Término Base para Generar Ideas"
          helperText="Escribe un tema central. El generador creará combinaciones basadas en patrones de consulta en español."
          examples={['GTA 6', 'Canva Pro', 'Inteligencia Artificial', 'Dieta Keto', 'Finanzas Personales']}
          buttonLabel="Generar Ideas"
        />

        {/* Intent Selectors */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#FF0000]" />
            Filtrar por Intención de Contenido:
          </label>
          <div className="flex flex-wrap gap-2">
            {intentsList.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setIntent(item.id);
                  const gen = generateLinguisticKeywords(seed, item.id);
                  setResults(gen);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  intent === item.id
                    ? 'bg-[#FF0000] text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-[#252525] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#303030]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <KeywordList
          items={results}
          title={`Ideas y Variaciones para "${seed}"`}
          toolName="Generador de Keywords"
          onSelectKeyword={onSelectKeyword}
        />
      )}
    </div>
  );
};
