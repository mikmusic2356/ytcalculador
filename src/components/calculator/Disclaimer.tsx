import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

interface DisclaimerProps {
  text?: string;
  type?: 'standard' | 'warning' | 'shorts';
}

export const Disclaimer: React.FC<DisclaimerProps> = ({
  text,
  type = 'standard',
}) => {
  if (type === 'shorts') {
    return (
      <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 rounded-xl text-xs text-purple-950 dark:text-purple-200 flex items-start gap-2.5 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold mb-0.5">Aviso sobre YouTube Shorts:</strong>
          <span>
            {text ||
              'Los ingresos de Shorts pueden variar significativamente y el RPM puede ser muy diferente al de los videos largos. Introduzca un RPM estimado para realizar la proyección.'}
          </span>
        </div>
      </div>
    );
  }

  if (type === 'warning') {
    return (
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold mb-0.5">Nota de Estimación:</strong>
          <span>
            {text ||
              'Esta es una estimación basada en los parámetros introducidos. Los ingresos reales pueden variar según la audiencia, temática, estacionalidad y anuncios reproducidos.'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#2F2F2F] rounded-xl text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2.5 leading-relaxed">
      <ShieldCheck className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5" />
      <div>
        <strong className="block font-bold text-[#212121] dark:text-white mb-0.5">Transparencia de Datos:</strong>
        <span>
          {text ||
            'Esta herramienta utiliza fórmulas matemáticas abiertas basadas en el modelo de monetización de YouTube. No está afiliada oficialmente con Google LLC ni YouTube.'}
        </span>
      </div>
    </div>
  );
};
