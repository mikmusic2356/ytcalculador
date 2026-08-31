import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

interface PrivacyBadgeProps {
  className?: string;
  minimal?: boolean;
}

export const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({ className = '', minimal = false }) => {
  if (minimal) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/60 ${className}`}
      >
        <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        <span>🔒 Procesamiento 100% Local</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200 ${className}`}
    >
      <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div className="text-xs leading-relaxed">
        <p className="font-bold flex items-center gap-1 text-emerald-800 dark:text-emerald-200">
          <span>🔒 Privacidad Total Garantizada — Procesamiento Local</span>
        </p>
        <p className="text-emerald-700/90 dark:text-emerald-300/80 mt-0.5">
          Tus imágenes se procesan directamente en la memoria de tu navegador mediante HTML5 Canvas y WebAssembly.
          <strong className="font-semibold ml-1">Nunca se suben ni se almacenan en ningún servidor externo.</strong>
        </p>
      </div>
    </div>
  );
};
