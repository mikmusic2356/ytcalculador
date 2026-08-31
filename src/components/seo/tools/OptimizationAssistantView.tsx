import React, { useState } from 'react';
import { auditVideoSeo, VideoSeoAuditResult } from '../../../utils/seoTextProcessing';
import { SeoScore } from '../SeoScore';
import { AnalysisResult } from '../AnalysisResult';
import { CopyButton } from '../CopyButton';
import { CheckSquare, AlertCircle, CheckCircle2, Search, Sliders } from 'lucide-react';

export const OptimizationAssistantView: React.FC = () => {
  const [keyword, setKeyword] = useState('GTA 6');
  const [title, setTitle] = useState('Cómo Jugar GTA 6 en PC: Guía de Instalación y Requisitos (2026)');
  const [description, setDescription] = useState(
    'En este video te mostramos cómo jugar GTA 6 en PC con la mejor configuración gráfica.\n\n00:00 Introducción\n01:30 Requisitos mínimos\n04:00 Guía paso a paso\n07:00 Conclusiones\n\n#GTA6 #Gaming #PC'
  );
  const [tagsInput, setTagsInput] = useState('gta 6, gameplay gta 6, como jugar gta 6 en pc, requisitos gta 6');
  const [hashtagsInput, setHashtagsInput] = useState('#GTA6 #Gaming #PC');

  const tagsArray = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
  const hashtagsArray = hashtagsInput.split(/[\s,]+/).map((h) => h.trim()).filter(Boolean);

  const [audit, setAudit] = useState<VideoSeoAuditResult>(() =>
    auditVideoSeo({
      title,
      description,
      keyword,
      tags: tagsArray,
      hashtags: hashtagsArray,
    })
  );

  const handleRunChecklist = () => {
    const res = auditVideoSeo({
      title,
      description,
      keyword,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      hashtags: hashtagsInput.split(/[\s,]+/).map((h) => h.trim()).filter(Boolean),
    });
    setAudit(res);
  };

  return (
    <div className="space-y-6">
      {/* Input panel */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#FF0000]" />
            Checklist de Metadatos de Video
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Cruza la información entre tu título, descripción, keyword y etiquetas antes de publicar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Palabra Clave Principal Objetivo
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Ej: GTA 6"
              className="w-full p-3 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs outline-hidden"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Título del Video
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título completo..."
              className="w-full p-3 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Descripción Completa del Video
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Pega la descripción completa..."
            className="w-full p-3 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Tags (con comas)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="tag1, tag2..."
              className="w-full p-3 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-xs outline-hidden"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Hashtags
            </label>
            <input
              type="text"
              value={hashtagsInput}
              onChange={(e) => setHashtagsInput(e.target.value)}
              placeholder="#tag1 #tag2..."
              className="w-full p-3 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-xs outline-hidden"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleRunChecklist}
            className="px-6 py-3 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Verificar Checklist de Coherencia</span>
          </button>
        </div>
      </div>

      {/* Results & Score */}
      <SeoScore
        score={audit.overallScore}
        title="Puntuación Global de Optimización Textual"
        subtitle="Evaluación ponderada: Título (30%), Descripción (25%), Keywords (20%), Tags (15%), Hashtags (10%)"
        breakdown={[
          {
            label: 'Título del Video',
            points: audit.titleScore,
            maxPoints: 30,
            notes: audit.breakdown.titleNotes.join(' • '),
          },
          {
            label: 'Cuerpo de la Descripción',
            points: audit.descriptionScore,
            maxPoints: 25,
            notes: audit.breakdown.descNotes.join(' • '),
          },
          {
            label: 'Coherencia de la Palabra Clave',
            points: audit.keywordsScore,
            maxPoints: 20,
            notes: audit.breakdown.keywordNotes.join(' • '),
          },
          {
            label: 'Etiquetas / Tags',
            points: audit.tagsScore,
            maxPoints: 15,
            notes: audit.breakdown.tagsNotes.join(' • '),
          },
          {
            label: 'Hashtags',
            points: audit.hashtagsScore,
            maxPoints: 10,
            notes: audit.breakdown.hashtagNotes.join(' • '),
          },
        ]}
      />

      <AnalysisResult
        recommendations={audit.actionableRecommendations}
        strengths={[
          ...audit.breakdown.titleNotes.filter((n) => !n.includes('ausente') && !n.includes('recorte')),
          ...audit.breakdown.descNotes.filter((n) => !n.includes('No se detectaron')),
          ...audit.breakdown.keywordNotes.filter((n) => n.includes('presente') || n.includes('total')),
        ]}
        warnings={[
          ...audit.breakdown.titleNotes.filter((n) => n.includes('ausente') || n.includes('recorte')),
          ...audit.breakdown.descNotes.filter((n) => n.includes('No se detectaron') || n.includes('breve')),
          ...audit.breakdown.keywordNotes.filter((n) => n.includes('No se ha') || n.includes('parcial')),
        ]}
      />
    </div>
  );
};
