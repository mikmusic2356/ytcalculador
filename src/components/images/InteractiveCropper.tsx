import React, { useState, useRef, useEffect } from 'react';
import { LoadedImageInfo } from '../../utils/imageProcessor';
import { Crop, Check, RotateCcw } from 'lucide-react';

interface InteractiveCropperProps {
  imageInfo: LoadedImageInfo;
  cropPreset: 'free' | '16:9' | '9:16' | '1:1' | '4:3' | '3:2';
  onPresetChange: (preset: 'free' | '16:9' | '9:16' | '1:1' | '4:3' | '3:2') => void;
  cropBox: { x: number; y: number; width: number; height: number };
  onCropBoxChange: (box: { x: number; y: number; width: number; height: number }) => void;
  onApplyCrop: () => void;
  onResetCrop: () => void;
}

export const InteractiveCropper: React.FC<InteractiveCropperProps> = ({
  imageInfo,
  cropPreset,
  onPresetChange,
  cropBox,
  onCropBoxChange,
  onApplyCrop,
  onResetCrop,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDim, setContainerDim] = useState({ width: 400, height: 300 });

  // Ratio definitions
  const ratios: Record<string, number | null> = {
    free: null,
    '16:9': 16 / 9,
    '9:16': 9 / 16,
    '1:1': 1,
    '4:3': 4 / 3,
    '3:2': 3 / 2,
  };

  // Adjust crop box when preset changes
  const applyPresetRatio = (preset: 'free' | '16:9' | '9:16' | '1:1' | '4:3' | '3:2') => {
    onPresetChange(preset);
    const targetRatio = ratios[preset];

    if (!targetRatio) {
      // Full image
      onCropBoxChange({
        x: 0,
        y: 0,
        width: imageInfo.width,
        height: imageInfo.height,
      });
      return;
    }

    const imgW = imageInfo.width;
    const imgH = imageInfo.height;
    let newW = imgW;
    let newH = Math.round(newW / targetRatio);

    if (newH > imgH) {
      newH = imgH;
      newW = Math.round(newH * targetRatio);
    }

    const newX = Math.round((imgW - newW) / 2);
    const newY = Math.round((imgH - newH) / 2);

    onCropBoxChange({
      x: Math.max(0, newX),
      y: Math.max(0, newY),
      width: Math.min(imgW, newW),
      height: Math.min(imgH, newH),
    });
  };

  // Calculate percentage coordinates for display on preview
  const scaleX = containerDim.width / (imageInfo.width || 1);
  const scaleY = containerDim.height / (imageInfo.height || 1);

  const displayLeft = (cropBox.x / imageInfo.width) * 100;
  const displayTop = (cropBox.y / imageInfo.height) * 100;
  const displayWidth = (cropBox.width / imageInfo.width) * 100;
  const displayHeight = (cropBox.height / imageInfo.height) * 100;

  return (
    <div className="space-y-4">
      {/* Preset Selector Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-1 flex items-center gap-1">
          <Crop className="w-3.5 h-3.5 text-[#FF0000]" />
          Proporción:
        </span>
        {[
          { id: '16:9', label: '16:9 (YouTube)', desc: 'Miniaturas y videos horizontales' },
          { id: '9:16', label: '9:16 (Shorts)', desc: 'YouTube Shorts y TikTok' },
          { id: '1:1', label: '1:1 (Cuadrado)', desc: 'Avatares e iconos' },
          { id: '4:3', label: '4:3 (Clásico)', desc: 'Fotografía tradicional' },
          { id: '3:2', label: '3:2 (Cámara)', desc: 'Sensor réflex DSLR' },
          { id: 'free', label: 'Libre', desc: 'Área personalizada' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => applyPresetRatio(item.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              cropPreset === item.id
                ? 'bg-[#FF0000] text-white shadow-xs'
                : 'bg-gray-100 dark:bg-[#272727] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333]'
            }`}
            title={item.desc}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Visual Crop Box Preview */}
      <div className="relative rounded-xl overflow-hidden bg-neutral-900 border border-gray-200 dark:border-[#333] flex items-center justify-center p-2 min-h-[260px] max-h-[420px]">
        <div ref={containerRef} className="relative inline-block max-w-full max-h-[380px] select-none">
          <img
            src={imageInfo.sourceUrl}
            alt={imageInfo.name}
            className="max-h-[380px] w-auto max-w-full object-contain rounded-md block opacity-80"
            onLoad={(e) => {
              const target = e.currentTarget;
              setContainerDim({ width: target.clientWidth, height: target.clientHeight });
            }}
          />

          {/* Dark Overlay outside crop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'rgba(0, 0, 0, 0.45)',
            }}
          />

          {/* Highlighted Active Crop Zone */}
          <div
            className="absolute border-2 border-[#FF0000] shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] transition-all cursor-move"
            style={{
              left: `${displayLeft}%`,
              top: `${displayTop}%`,
              width: `${displayWidth}%`,
              height: `${displayHeight}%`,
            }}
          >
            {/* Rule of Thirds Grid */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div />
            </div>

            {/* Corner Handles */}
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white border border-[#FF0000] rounded-xs" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border border-[#FF0000] rounded-xs" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white border border-[#FF0000] rounded-xs" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white border border-[#FF0000] rounded-xs" />

            {/* Current Dimensions Pill */}
            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow-xs pointer-events-none">
              {cropBox.width} × {cropBox.height} px
            </div>
          </div>
        </div>
      </div>

      {/* Manual Fine-Tuning Inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 dark:bg-[#1E1E1E] p-3 rounded-xl border border-gray-200 dark:border-[#2F2F2F] text-xs">
        <div>
          <label className="block text-gray-500 dark:text-gray-400 font-semibold mb-1">Posición X (px)</label>
          <input
            type="number"
            min={0}
            max={imageInfo.width - 10}
            value={cropBox.x}
            onChange={(e) => onCropBoxChange({ ...cropBox, x: Math.max(0, Number(e.target.value)) })}
            className="w-full bg-white dark:bg-[#2A2A2A] border border-gray-300 dark:border-[#383838] rounded-lg px-2.5 py-1.5 text-gray-900 dark:text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-gray-500 dark:text-gray-400 font-semibold mb-1">Posición Y (px)</label>
          <input
            type="number"
            min={0}
            max={imageInfo.height - 10}
            value={cropBox.y}
            onChange={(e) => onCropBoxChange({ ...cropBox, y: Math.max(0, Number(e.target.value)) })}
            className="w-full bg-white dark:bg-[#2A2A2A] border border-gray-300 dark:border-[#383838] rounded-lg px-2.5 py-1.5 text-gray-900 dark:text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-gray-500 dark:text-gray-400 font-semibold mb-1">Ancho Recorte (px)</label>
          <input
            type="number"
            min={10}
            max={imageInfo.width}
            value={cropBox.width}
            onChange={(e) => onCropBoxChange({ ...cropBox, width: Math.max(10, Number(e.target.value)) })}
            className="w-full bg-white dark:bg-[#2A2A2A] border border-gray-300 dark:border-[#383838] rounded-lg px-2.5 py-1.5 text-gray-900 dark:text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-gray-500 dark:text-gray-400 font-semibold mb-1">Alto Recorte (px)</label>
          <input
            type="number"
            min={10}
            max={imageInfo.height}
            value={cropBox.height}
            onChange={(e) => onCropBoxChange({ ...cropBox, height: Math.max(10, Number(e.target.value)) })}
            className="w-full bg-white dark:bg-[#2A2A2A] border border-gray-300 dark:border-[#383838] rounded-lg px-2.5 py-1.5 text-gray-900 dark:text-white font-mono"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onResetCrop}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-[#282828] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restablecer Recorte
        </button>

        <button
          type="button"
          onClick={onApplyCrop}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-200 text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
        >
          <Check className="w-4 h-4 text-emerald-500" />
          Confirmar y Aplicar Recorte
        </button>
      </div>
    </div>
  );
};
