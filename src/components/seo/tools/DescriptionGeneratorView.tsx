import React, { useState } from 'react';
import { generateStructuredDescription } from '../../../utils/seoTextProcessing';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { FileEdit, Sparkles, FileText, Check } from 'lucide-react';

export const DescriptionGeneratorView: React.FC = () => {
  const [title, setTitle] = useState('GTA 6 en PC: Guía de Instalación y Requisitos Mínimos (2026)');
  const [topic, setTopic] = useState('GTA 6 y optimización para computadoras');
  const [keyword, setKeyword] = useState('GTA 6');
  const [extraInfo, setExtraInfo] = useState('Probado en tarjeta gráfica RTX 4060 con 16GB de RAM.');
  const [generatedDesc, setGeneratedDesc] = useState<string>(() =>
    generateStructuredDescription({
      title: 'GTA 6 en PC: Guía de Instalación y Requisitos Mínimos (2026)',
      topic: 'GTA 6 y optimización para computadoras',
      keyword: 'GTA 6',
      contentType: 'Tutorial',
      extraInfo: 'Probado en tarjeta gráfica RTX 4060 con 16GB de RAM.',
    })
  );

  const handleGenerate = () => {
    const desc = generateStructuredDescription({
      title,
      topic,
      keyword,
      contentType: 'Tutorial',
      extraInfo,
    });
    setGeneratedDesc(desc);
  };

  return (
    <div className="space-y-6">
      {/* Input settings */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Título del Video
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título completo..."
              className="w-full p-3.5 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-sm outline-hidden"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Palabra Clave Principal
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

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Tema / Enfoque del Video
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej: Cómo configurar mods y rendimiento gráfico"
            className="w-full p-3 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-sm outline-hidden"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Notas o Información Específica (Opcional)
          </label>
          <input
            type="text"
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
            placeholder="Enlaces a mencionar, disclaimer, etc."
            className="w-full p-3 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-sm outline-hidden"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleGenerate}
            className="px-6 py-3 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-bold text-sm shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-2"
          >
            <FileEdit className="w-4 h-4" />
            <span>Generar Plantilla de Descripción</span>
          </button>
        </div>
      </div>

      {/* Generated output editor */}
      {generatedDesc && (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FF0000]" />
                Descripción Estructurada Generada
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Puedes editar el texto directamente antes de copiarlo.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton
                textToCopy={generatedDesc}
                label="Copiar Descripción"
                variant="primary"
                size="sm"
                toolName="Generador de Descripción"
              />
              <DownloadButton content={generatedDesc} filename="plantilla-descripcion.txt" size="sm" />
            </div>
          </div>

          <textarea
            rows={14}
            value={generatedDesc}
            onChange={(e) => setGeneratedDesc(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden leading-relaxed"
          />
        </div>
      )}
    </div>
  );
};
