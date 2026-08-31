import React, { useState } from 'react';
import {
  generateLinguisticKeywords,
  generateTitleFormulas,
  generateStructuredDescription,
  parseAndValidateTimestamps,
  generateHashtags,
  generateTagsFromInput,
  auditVideoSeo,
  VideoSeoAuditResult,
} from '../../../utils/seoTextProcessing';
import { SeoScore } from '../SeoScore';
import { AnalysisResult } from '../AnalysisResult';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { analytics } from '../../../utils/analytics';
import {
  Sparkles,
  Lightbulb,
  Search,
  Key,
  Type,
  FileText,
  Clock,
  Hash,
  Tag,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Download,
  Share2,
  Sliders,
} from 'lucide-react';

interface WizardState {
  step: number;
  idea: string;
  category: string;
  keyword: string;
  title: string;
  description: string;
  timestamps: string;
  hashtags: string[];
  tags: string[];
}

export const GeneralSeoWizardView: React.FC = () => {
  const [state, setState] = useState<WizardState>({
    step: 1,
    idea: 'Tutorial de edición y animación para videos de YouTube',
    category: 'Educación y Tecnología',
    keyword: 'edición de video para youtube',
    title: 'Cómo Editar Videos para YouTube desde Cero: Guía Completa (2026)',
    description: '',
    timestamps: `00:00 Introducción y Resumen\n01:15 Configuración del Proyecto\n03:40 Cortes Dinámicos y Ritmo\n06:20 Animaciones y Texto\n09:00 Conclusiones`,
    hashtags: ['#EdicionDeVideo', '#YouTubeTutorial', '#CreadoresDeContenido'],
    tags: ['edicion de video', 'como editar videos', 'tutorial youtube', 'curso de edicion', 'premiere pro', 'capcut pc'],
  });

  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([]);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [auditResult, setAuditResult] = useState<VideoSeoAuditResult | null>(null);

  const steps = [
    { num: 1, title: 'Idea', icon: Lightbulb },
    { num: 2, title: 'Keywords', icon: Search },
    { num: 3, title: 'Keyword Principal', icon: Key },
    { num: 4, title: 'Título', icon: Type },
    { num: 5, title: 'Descripción', icon: FileText },
    { num: 6, title: 'Capítulos', icon: Clock },
    { num: 7, title: 'Hashtags', icon: Hash },
    { num: 8, title: 'Etiquetas', icon: Tag },
    { num: 9, title: 'Auditoría y Exportación', icon: CheckCircle2 },
  ];

  const goToStep = (s: number) => {
    if (s === 2 && generatedKeywords.length === 0) {
      const kw = generateLinguisticKeywords(state.idea || 'tutorial', 'all').map((k) => k.keyword);
      setGeneratedKeywords(kw);
    }
    if (s === 4 && generatedTitles.length === 0) {
      const titles = generateTitleFormulas(state.idea, state.keyword, 'educativo');
      setGeneratedTitles(titles);
    }
    if (s === 5 && !state.description) {
      const desc = generateStructuredDescription({
        title: state.title,
        topic: state.idea,
        keyword: state.keyword,
        contentType: 'Tutorial',
      });
      setState((prev) => ({ ...prev, description: desc }));
    }
    if (s === 7 && state.hashtags.length <= 3) {
      const h = generateHashtags(state.keyword || state.idea, 6);
      setState((prev) => ({ ...prev, hashtags: h }));
    }
    if (s === 8 && state.tags.length <= 3) {
      const t = generateTagsFromInput(state.keyword, state.title);
      setState((prev) => ({ ...prev, tags: t.allCombined }));
    }
    if (s === 9) {
      const audit = auditVideoSeo({
        title: state.title,
        description: state.description,
        keyword: state.keyword,
        tags: state.tags,
        hashtags: state.hashtags,
      });
      setAuditResult(audit);
    }

    setState((prev) => ({ ...prev, step: s }));
  };

  const nextStep = () => {
    if (state.step < 9) goToStep(state.step + 1);
  };
  const prevStep = () => {
    if (state.step > 1) goToStep(state.step - 1);
  };

  // Full export pack
  const fullPackText = `================================================
PAQUETE COMPLETO DE METADATOS SEO - YOUTUBECALCULADOR
================================================

📌 PALABRA CLAVE PRINCIPAL:
${state.keyword}

🎬 TÍTULO DEL VIDEO (${state.title.length} caracteres):
${state.title}

📝 DESCRIPCIÓN:
${state.description}

⏱️ CAPÍTULOS / TIMESTAMPS:
${state.timestamps}

🏷️ HASHTAGS:
${state.hashtags.join(' ')}

🔖 ETIQUETAS / TAGS (${state.tags.join(', ').length} caracteres):
${state.tags.join(', ')}

================================================
Auditoría Final Textual: ${auditResult?.overallScore || 85}/100 Puntos
================================================`;

  return (
    <div className="space-y-6">
      {/* 9-Step Interactive Stepper Bar */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-4 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto gap-2 pb-2 sm:pb-0 scrollbar-thin">
          {steps.map((st) => {
            const Icon = st.icon;
            const isCompleted = state.step > st.num;
            const isCurrent = state.step === st.num;

            return (
              <button
                key={st.num}
                type="button"
                onClick={() => goToStep(st.num)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold shrink-0 cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-[#FF0000] text-white shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                    : 'bg-gray-50 text-gray-500 dark:bg-[#242424] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2C2C2C]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {st.num}. {st.title}
                </span>
                <span className="sm:hidden">{st.num}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Contents */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-6">
        {/* STEP 1: Idea */}
        {state.step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#FF0000]" />
                Paso 1: Define la Idea o Concepto de tu Video
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Escribe en una frase clara de qué tratará tu video.
              </p>
            </div>

            <textarea
              rows={3}
              value={state.idea}
              onChange={(e) => setState({ ...state, idea: e.target.value })}
              placeholder="Ej: Cómo invertir en bienes raíces desde cero..."
              className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-sm outline-hidden"
            />
          </div>
        )}

        {/* STEP 2: Keywords */}
        {state.step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-[#FF0000]" />
                Paso 2: Explorar Ideas de Palabras Clave
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Selecciona la que mejor encaje o escribe tu propia palabra clave.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {generatedKeywords.map((k, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setState({ ...state, keyword: k })}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold cursor-pointer transition-all ${
                    state.keyword === k
                      ? 'bg-red-50 dark:bg-red-950/30 border-[#FF0000] text-[#FF0000]'
                      : 'bg-gray-50 dark:bg-[#222222] border-gray-200 dark:border-[#303030] text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Keyword Selection */}
        {state.step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-[#FF0000]" />
                Paso 3: Confirma tu Palabra Clave Principal
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Este término se usará como eje para el título, descripción y etiquetas.
              </p>
            </div>

            <input
              type="text"
              value={state.keyword}
              onChange={(e) => setState({ ...state, keyword: e.target.value })}
              className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-base font-bold outline-hidden"
            />
          </div>
        )}

        {/* STEP 4: Title */}
        {state.step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-[#FF0000]" />
                Paso 4: Título del Video ({state.title.length}/70 chars)
              </h3>
              <span className="text-xs font-mono text-gray-400">{state.title.length} chars</span>
            </div>

            <input
              type="text"
              value={state.title}
              onChange={(e) => setState({ ...state, title: e.target.value })}
              className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-sm outline-hidden"
            />

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                Sugerencias de títulos estructurados:
              </span>
              <div className="space-y-2">
                {generatedTitles.slice(0, 4).map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setState({ ...state, title: t })}
                    className="w-full p-2.5 bg-gray-50 dark:bg-[#222222] hover:bg-gray-100 dark:hover:bg-[#282828] border border-gray-200 dark:border-[#2E2E2E] rounded-xl text-left text-xs font-semibold text-gray-800 dark:text-gray-200 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Description */}
        {state.step === 5 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FF0000]" />
                Paso 5: Descripción Completa del Video
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Estructurada en ganchos, llamada a la acción y enlaces.
              </p>
            </div>

            <textarea
              rows={8}
              value={state.description}
              onChange={(e) => setState({ ...state, description: e.target.value })}
              className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
            />
          </div>
        )}

        {/* STEP 6: Timestamps */}
        {state.step === 6 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF0000]" />
                Paso 6: Capítulos y Marcas de Tiempo
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Asegúrate de incluir 00:00 al inicio y al menos 3 capítulos.
              </p>
            </div>

            <textarea
              rows={6}
              value={state.timestamps}
              onChange={(e) => setState({ ...state, timestamps: e.target.value })}
              className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
            />
          </div>
        )}

        {/* STEP 7: Hashtags */}
        {state.step === 7 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#FF0000]" />
                Paso 7: Hashtags del Video
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Se recomienda usar entre 3 y 6 hashtags relevantes.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {state.hashtags.map((h, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-gray-50 dark:bg-[#222222] border border-gray-200 dark:border-[#2E2E2E] rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 font-mono"
                >
                  {h}
                </span>
              ))}
            </div>

            <input
              type="text"
              value={state.hashtags.join(' ')}
              onChange={(e) =>
                setState({
                  ...state,
                  hashtags: e.target.value.split(/\s+/).filter(Boolean),
                })
              }
              className="w-full p-3 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
            />
          </div>
        )}

        {/* STEP 8: Tags */}
        {state.step === 8 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#FF0000]" />
                Paso 8: Etiquetas / Tags ({state.tags.join(', ').length}/500 chars)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Separadas por comas para YouTube Studio.
              </p>
            </div>

            <textarea
              rows={4}
              value={state.tags.join(', ')}
              onChange={(e) =>
                setState({
                  ...state,
                  tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                })
              }
              className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
            />
          </div>
        )}

        {/* STEP 9: Final Audit & Export */}
        {state.step === 9 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Paso 9: Paquete SEO Final y Auditoría de Metadatos
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Todos tus metadatos estructurados y listos para publicar.
              </p>
            </div>

            {auditResult && (
              <SeoScore
                score={auditResult.overallScore}
                title="Puntuación Global del Paquete de Video"
                subtitle="Evaluación objetiva de coherencia entre título, descripción, etiquetas y hashtags"
                breakdown={[
                  { label: 'Título', points: auditResult.titleScore, maxPoints: 30 },
                  { label: 'Descripción', points: auditResult.descriptionScore, maxPoints: 25 },
                  { label: 'Keyword', points: auditResult.keywordsScore, maxPoints: 20 },
                  { label: 'Tags', points: auditResult.tagsScore, maxPoints: 15 },
                  { label: 'Hashtags', points: auditResult.hashtagsScore, maxPoints: 10 },
                ]}
              />
            )}

            {/* Complete preview textarea */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Contenido Completo del Paquete:
                </span>
                <div className="flex items-center gap-2">
                  <CopyButton
                    textToCopy={fullPackText}
                    label="Copiar Todo el Paquete"
                    variant="primary"
                    size="sm"
                    toolName="Asistente SEO Completo"
                  />
                  <DownloadButton
                    content={fullPackText}
                    filename={`paquete-seo-${state.keyword.replace(/\s+/g, '-')}.txt`}
                    size="sm"
                  />
                </div>
              </div>

              <textarea
                rows={12}
                value={fullPackText}
                readOnly
                className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Wizard Controls Bottom */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#2E2E2E]">
          <button
            type="button"
            onClick={prevStep}
            disabled={state.step === 1}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300 font-bold text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-[#242424] disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Paso Anterior</span>
          </button>

          <span className="text-xs font-bold text-gray-400">
            Paso {state.step} de 9
          </span>

          {state.step < 9 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-5 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Siguiente Paso</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <CopyButton
              textToCopy={fullPackText}
              label="Copiar Paquete"
              variant="primary"
              size="sm"
              toolName="Asistente SEO Completo"
            />
          )}
        </div>
      </div>
    </div>
  );
};
