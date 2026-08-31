import React, { useState } from 'react';
import { auditVideoSeo } from '../../../utils/seoTextProcessing';
import { SeoScore } from '../SeoScore';
import { AnalysisResult } from '../AnalysisResult';
import { ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const VideoSeoAuditView: React.FC = () => {
  const [title, setTitle] = useState('GTA 6: Guía Completa de Trucos y Secretos en Español (2026)');
  const [description, setDescription] = useState(
    'Descubre en esta guía completa los mejores trucos y secretos de GTA 6 en español.\n\n00:00 Introducción\n02:15 Mapa y secretos\n05:30 Guía de vehículos\n08:00 Despedida\n\n#GTA6 #Gaming #PlayStation5'
  );
  const [keyword, setKeyword] = useState('GTA 6');
  const [tagsInput, setTagsInput] = useState('gta 6, gameplay gta 6, trucos gta 6');

  const parsedTags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
  const parsedHashtags = (description.match(/#[a-zA-Z0-9_áéíóúñÁÉÍÓÚÑ]+/g) || []).map((h) => h.toLowerCase());

  const [audit, setAudit] = useState(() =>
    auditVideoSeo({
      title,
      description,
      keyword,
      tags: parsedTags,
      hashtags: parsedHashtags,
    })
  );

  const handleAudit = () => {
    const res = auditVideoSeo({
      title,
      description,
      keyword,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      hashtags: (description.match(/#[a-zA-Z0-9_áéíóúñÁÉÍÓÚÑ]+/g) || []).map((h) => h.toLowerCase()),
    });
    setAudit(res);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FF0000]" />
            Auditoría de Metadatos Textuales del Video
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Evalúa la consistencia de tu contenido según directrices de legibilidad, estructura y búsqueda en YouTube.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Palabra Clave Central
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
            Descripción del Video
          </label>
          <textarea
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Pega la descripción completa..."
            className="w-full p-3 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleAudit}
            className="px-6 py-3 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Auditar Metadatos Textuales</span>
          </button>
        </div>
      </div>

      <SeoScore
        score={audit.overallScore}
        title="Resultado de la Auditoría Textual"
        subtitle="Evaluación de coherencia temática, estructura y estándares técnicos"
        breakdown={[
          {
            label: 'Título',
            points: audit.titleScore,
            maxPoints: 30,
            notes: audit.breakdown.titleNotes.join(' • '),
          },
          {
            label: 'Descripción',
            points: audit.descriptionScore,
            maxPoints: 25,
            notes: audit.breakdown.descNotes.join(' • '),
          },
          {
            label: 'Presencia de Keyword',
            points: audit.keywordsScore,
            maxPoints: 20,
            notes: audit.breakdown.keywordNotes.join(' • '),
          },
          {
            label: 'Hashtags y Formato',
            points: audit.hashtagsScore,
            maxPoints: 10,
            notes: audit.breakdown.hashtagNotes.join(' • '),
          },
        ]}
      />

      <AnalysisResult
        recommendations={audit.actionableRecommendations}
        strengths={[
          ...audit.breakdown.titleNotes.filter((n) => !n.includes('ausente')),
          ...audit.breakdown.descNotes.filter((n) => !n.includes('No se detectaron')),
        ]}
        warnings={[
          ...audit.breakdown.titleNotes.filter((n) => n.includes('ausente')),
          ...audit.breakdown.descNotes.filter((n) => n.includes('No se detectaron')),
        ]}
      />
    </div>
  );
};
