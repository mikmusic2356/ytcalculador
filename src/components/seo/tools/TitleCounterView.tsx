import React, { useState } from 'react';
import { CopyButton } from '../CopyButton';
import { Type, Smartphone, Monitor, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';

export const TitleCounterView: React.FC = () => {
  const [title, setTitle] = useState('GTA 6: Tráiler Oficial Revelado y Todo lo que Sabemos');

  const charCount = title.length;
  const wordCount = title.trim() ? title.trim().split(/\s+/).length : 0;
  const charsWithoutSpaces = title.replace(/\s+/g, '').length;

  const MOBILE_MAX_RECOMMENDED = 60;
  const DESKTOP_MAX_RECOMMENDED = 70;
  const YOUTUBE_ABSOLUTE_LIMIT = 100;

  let statusColor = 'text-emerald-600 dark:text-emerald-400';
  let statusBadge = 'Longitud Óptima';
  if (charCount > YOUTUBE_ABSOLUTE_LIMIT) {
    statusColor = 'text-red-600 dark:text-red-400';
    statusBadge = 'Supera el límite de YouTube';
  } else if (charCount > DESKTOP_MAX_RECOMMENDED) {
    statusColor = 'text-amber-600 dark:text-amber-400';
    statusBadge = 'Se truncará en pantallas móviles';
  } else if (charCount < 25 && charCount > 0) {
    statusColor = 'text-blue-600 dark:text-blue-400';
    statusBadge = 'Título breve';
  }

  // Simulated visual truncations
  const mobileVisible =
    title.length > MOBILE_MAX_RECOMMENDED
      ? `${title.slice(0, MOBILE_MAX_RECOMMENDED)}...`
      : title;
  const desktopVisible =
    title.length > DESKTOP_MAX_RECOMMENDED
      ? `${title.slice(0, DESKTOP_MAX_RECOMMENDED)}...`
      : title;

  return (
    <div className="space-y-6">
      {/* Editor Card */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-gray-900 dark:text-white">
            Escribe o pega el Título de tu Video
          </label>
          <span className={`text-xs font-bold ${statusColor}`}>{statusBadge}</span>
        </div>

        <div className="relative">
          <textarea
            rows={3}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Escribe el título aquí..."
            className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] dark:focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 rounded-xl text-gray-900 dark:text-white text-base outline-hidden transition-all"
          />
        </div>

        {/* Realtime Character Gauge Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-gray-500 dark:text-gray-400">
              {charCount} de {YOUTUBE_ABSOLUTE_LIMIT} caracteres permitidos
            </span>
            <span
              className={
                charCount > YOUTUBE_ABSOLUTE_LIMIT
                  ? 'text-red-500'
                  : 'text-gray-700 dark:text-gray-300'
              }
            >
              {YOUTUBE_ABSOLUTE_LIMIT - charCount} restantes
            </span>
          </div>

          <div className="w-full bg-gray-100 dark:bg-[#2A2A2A] h-3 rounded-full overflow-hidden relative">
            {/* Safe zones markers */}
            <div
              className="absolute top-0 bottom-0 bg-amber-400/30 w-0.5 z-10"
              style={{ left: `${(MOBILE_MAX_RECOMMENDED / YOUTUBE_ABSOLUTE_LIMIT) * 100}%` }}
              title="Corte móvil (~60 chars)"
            />
            <div
              className="absolute top-0 bottom-0 bg-blue-400/30 w-0.5 z-10"
              style={{ left: `${(DESKTOP_MAX_RECOMMENDED / YOUTUBE_ABSOLUTE_LIMIT) * 100}%` }}
              title="Corte ordenador (~70 chars)"
            />
            {/* Progress fill */}
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                charCount > YOUTUBE_ABSOLUTE_LIMIT
                  ? 'bg-red-500'
                  : charCount > DESKTOP_MAX_RECOMMENDED
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{
                width: `${Math.min(100, (charCount / YOUTUBE_ABSOLUTE_LIMIT) * 100)}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
            <span>0</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              📱 Móvil (~60)
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              💻 Desktop (~70)
            </span>
            <span className="text-red-500 font-semibold">100 Máx</span>
          </div>
        </div>

        {/* Counter Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-gray-50 dark:bg-[#222222] rounded-xl border border-gray-100 dark:border-[#2C2C2C] text-center">
            <span className="text-[11px] text-gray-400 font-bold uppercase">
              Caracteres
            </span>
            <p className="text-xl font-black text-gray-900 dark:text-white">
              {charCount}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-[#222222] rounded-xl border border-gray-100 dark:border-[#2C2C2C] text-center">
            <span className="text-[11px] text-gray-400 font-bold uppercase">
              Palabras
            </span>
            <p className="text-xl font-black text-gray-900 dark:text-white">
              {wordCount}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-[#222222] rounded-xl border border-gray-100 dark:border-[#2C2C2C] text-center">
            <span className="text-[11px] text-gray-400 font-bold uppercase">
              Sin Espacios
            </span>
            <p className="text-xl font-black text-gray-900 dark:text-white">
              {charsWithoutSpaces}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <CopyButton
            textToCopy={title}
            label="Copiar Título"
            variant="primary"
            toolName="Contador de Caracteres de Título"
          />
        </div>
      </div>

      {/* Visual Previews in Mobile & Desktop Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF0000]" />
          Simulación de Visualización en YouTube
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mobile Preview */}
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-amber-500" />
                Vista en Teléfono Móvil
              </span>
              <span className="text-[11px] text-gray-400">~60 chars visibles</span>
            </div>

            <div className="p-3.5 bg-gray-100 dark:bg-[#252525] rounded-xl space-y-2">
              <div className="w-full aspect-video bg-gray-300 dark:bg-[#333] rounded-lg flex items-center justify-center text-xs text-gray-500 font-semibold">
                Miniatura 16:9
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-[#444] shrink-0" />
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                    {mobileVisible || 'Título de ejemplo de tu video'}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    Tu Canal • 15 k vistas • hace 2 horas
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Preview */}
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-blue-500" />
                Vista en Ordenador de Escritorio
              </span>
              <span className="text-[11px] text-gray-400">~70 chars visibles</span>
            </div>

            <div className="p-3.5 bg-gray-100 dark:bg-[#252525] rounded-xl space-y-2">
              <div className="w-full aspect-video bg-gray-300 dark:bg-[#333] rounded-lg flex items-center justify-center text-xs text-gray-500 font-semibold">
                Miniatura 16:9
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-[#444] shrink-0" />
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                    {desktopVisible || 'Título de ejemplo de tu video'}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    Tu Canal • 15 k vistas • hace 2 horas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
