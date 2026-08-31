import React, { useState } from 'react';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { AlignLeft, Link, Hash, FileText, Smartphone, AlertCircle } from 'lucide-react';

const SAMPLE_DESC = `En este video analizamos en profundidad todas las novedades y secretos confirmados sobre GTA 6 en 2026. 

📌 Puntos clave que veremos:
• Análisis completo del mapa y localizaciones
• Demostración gráfica y detalles técnicos
• Comparativa con entregas anteriores
• Conclusiones y fecha estimada

🔔 ¡SUSCRÍBETE para no perderte las próximas guías!
https://youtube.com/@tucanal?sub_confirmation=1

⏱️ Capítulos del video:
00:00 Introducción
01:30 ¿Qué sabemos del mapa?
04:15 Gráficos y motor de físicas
07:50 Veredicto final

#GTA6 #Gaming #GrandTheftAuto #PlayStation5`;

export const DescriptionCounterView: React.FC = () => {
  const [description, setDescription] = useState(SAMPLE_DESC);

  const charCount = description.length;
  const words = description.trim() ? description.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const lines = description.split('\n');
  const lineCount = lines.length;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const links = description.match(urlRegex) || [];

  const hashtagRegex = /#[a-zA-Z0-9_áéíóúñÁÉÍÓÚÑ]+/g;
  const hashtags = description.match(hashtagRegex) || [];

  const YOUTUBE_MAX_DESC = 5000;
  const remaining = YOUTUBE_MAX_DESC - charCount;

  // First 3 lines snippet preview
  const snippetLines = lines.slice(0, 3).join('\n');

  return (
    <div className="space-y-6">
      {/* Editor & Counts Card */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-gray-900 dark:text-white">
            Editor de Descripción
          </label>
          <span
            className={`text-xs font-bold ${
              remaining < 0 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {charCount} / {YOUTUBE_MAX_DESC} caracteres ({remaining} restantes)
          </span>
        </div>

        <textarea
          rows={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Pega o redacta tu descripción aquí..."
          className="w-full p-4 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#333] focus:border-[#FF0000] dark:focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 rounded-xl text-gray-900 dark:text-white text-sm outline-hidden font-mono leading-relaxed"
        />

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-gray-100 dark:bg-[#2A2A2A] h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                remaining < 0 ? 'bg-red-500' : charCount > 4000 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{
                width: `${Math.min(100, (charCount / YOUTUBE_MAX_DESC) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* 5 Elements Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 bg-gray-50 dark:bg-[#222222] rounded-xl border border-gray-100 dark:border-[#2C2C2C] text-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Caracteres</span>
            <p className="text-lg font-black text-gray-900 dark:text-white">{charCount}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-[#222222] rounded-xl border border-gray-100 dark:border-[#2C2C2C] text-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Palabras</span>
            <p className="text-lg font-black text-gray-900 dark:text-white">{wordCount}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-[#222222] rounded-xl border border-gray-100 dark:border-[#2C2C2C] text-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Líneas</span>
            <p className="text-lg font-black text-gray-900 dark:text-white">{lineCount}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-[#222222] rounded-xl border border-gray-100 dark:border-[#2C2C2C] text-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Enlaces</span>
            <p className="text-lg font-black text-gray-900 dark:text-white">{links.length}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-[#222222] rounded-xl border border-gray-100 dark:border-[#2C2C2C] text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Hashtags</span>
            <p className="text-lg font-black text-gray-900 dark:text-white">{hashtags.length}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <CopyButton
            textToCopy={description}
            label="Copiar Descripción"
            variant="primary"
            toolName="Contador de Descripción"
          />
          <DownloadButton content={description} filename="descripcion-youtube.txt" />
        </div>
      </div>

      {/* Snippet preview: First fold */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-500" />
            Primer Pliegue Visible (Snippet antes de "Mostrar más")
          </h3>
          <span className="text-xs text-gray-400">Primeras 3 líneas</span>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-[#222222] rounded-xl border border-gray-200 dark:border-[#2E2E2E] text-xs text-gray-800 dark:text-gray-200 font-sans whitespace-pre-wrap leading-relaxed">
          {snippetLines || 'No hay texto suficiente en las primeras líneas.'}
          <div className="mt-2 text-[#FF0000] font-bold cursor-pointer hover:underline inline-block">
            ...más
          </div>
        </div>
      </div>
    </div>
  );
};
