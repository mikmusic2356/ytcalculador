import React from 'react';

interface AdPlacementProps {
  slotId: string;
  format?: 'horizontal-banner' | 'in-content' | 'sidebar-square' | 'footer-anchor';
  className?: string;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({ slotId, format = 'horizontal-banner', className = '' }) => {
  return (
    <div
      id={`ad-slot-${slotId}`}
      className={`my-6 mx-auto w-full transition-all ${className}`}
      aria-label="Espacio publicitario"
    >
      <div className="text-[9px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider text-center mb-1 select-none">
        Publicidad Patrocinada • Google AdSense
      </div>
      <div
        className={`rounded-xl border border-dashed border-gray-300 dark:border-[#383838] bg-white dark:bg-[#1A1A1A] flex flex-col items-center justify-center p-4 text-center transition-colors hover:border-gray-400 dark:hover:border-gray-600 mx-auto ${
          format === 'horizontal-banner'
            ? 'h-24 sm:h-28 max-w-4xl'
            : format === 'sidebar-square'
            ? 'h-64 max-w-xs'
            : format === 'in-content'
            ? 'h-28 max-w-3xl'
            : 'h-20 max-w-5xl'
        }`}
      >
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          Espacio optimizado para Google AdSense
        </span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
          {format} • ID: {slotId} • Carga diferida no intrusiva
        </span>
      </div>
    </div>
  );
};

