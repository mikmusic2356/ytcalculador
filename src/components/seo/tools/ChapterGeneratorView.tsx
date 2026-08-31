import React, { useState } from 'react';
import { parseAndValidateTimestamps } from '../../../utils/seoTextProcessing';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { Clock, CheckCircle2, AlertTriangle, HelpCircle, ArrowDownUp } from 'lucide-react';

const INITIAL_TIMESTAMPS = `00:00 Introducción y Resumen
01:15 ¿Qué es lo nuevo en esta versión?
03:40 Demostración práctica paso a paso
06:20 Consejos clave y errores comunes
08:10 Conclusiones finales`;

export const ChapterGeneratorView: React.FC = () => {
  const [inputText, setInputText] = useState(INITIAL_TIMESTAMPS);
  const [result, setResult] = useState(() => parseAndValidateTimestamps(INITIAL_TIMESTAMPS));

  const handleValidate = () => {
    const res = parseAndValidateTimestamps(inputText);
    setResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Editor Card */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF0000]" />
            Editor y Validador de Capítulos
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Introduce tus marcas de tiempo en cualquier orden o formato (ej: "00:00 Intro" o "Intro - 00:00").
          </p>
        </div>

        <textarea
          rows={7}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setResult(parseAndValidateTimestamps(e.target.value));
          }}
          placeholder="00:00 Intro&#10;01:30 Sección 1&#10;04:00 Sección 2"
          className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
        />

        {/* Validation Checklist Banner */}
        <div className="p-4 rounded-xl border space-y-2 bg-gray-50 dark:bg-[#222222] border-gray-200 dark:border-[#2E2E2E]">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-gray-900 dark:text-white">
              Estado de Validación para YouTube:
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                result.isValidForYouTube
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
              }`}
            >
              {result.isValidForYouTube ? '✓ Válido para Barra Segmentada' : 'Requiere Ajustes'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
            <div className="flex items-center gap-2">
              {result.hasFirstZeroTimestamp ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span className="text-gray-700 dark:text-gray-300">Inicia en 00:00</span>
            </div>

            <div className="flex items-center gap-2">
              {result.hasMinimumChapters ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span className="text-gray-700 dark:text-gray-300">Mínimo 3 capítulos ({result.items.filter(i => i.isValid).length})</span>
            </div>

            <div className="flex items-center gap-2">
              {result.hasChronologicalOrder ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span className="text-gray-700 dark:text-gray-300">Orden cronológico</span>
            </div>
          </div>

          {result.issues.length > 0 && (
            <div className="pt-2 text-xs text-amber-800 dark:text-amber-300 space-y-1">
              {result.issues.map((iss, idx) => (
                <p key={idx} className="flex items-start gap-1.5">
                  <span>•</span>
                  <span>{iss}</span>
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Output Formatted */}
        {result.formattedOutput && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Formato Limpio y Ordenado para tu Descripción:
              </span>
              <CopyButton
                textToCopy={result.formattedOutput}
                label="Copiar Capítulos"
                size="sm"
                variant="primary"
                toolName="Validador de Capítulos"
              />
            </div>
            <textarea
              rows={5}
              value={result.formattedOutput}
              readOnly
              className="w-full p-3 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-xs font-mono outline-hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};
