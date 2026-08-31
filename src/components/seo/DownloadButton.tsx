import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';

interface DownloadButtonProps {
  content: string;
  filename?: string;
  mimeType?: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  content,
  filename = 'youtube-seo-export.txt',
  mimeType = 'text/plain;charset=utf-8',
  label = 'Descargar (.txt)',
  className = '',
  size = 'md',
  id,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
    }, 2000);
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      id={id || `btn-download-${Math.random().toString(36).substring(7)}`}
      type="button"
      onClick={handleDownload}
      disabled={!content}
      className={`inline-flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#333333] text-gray-800 dark:text-gray-200 font-medium transition-all cursor-pointer select-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${sizeClasses[size]} ${className}`}
    >
      {downloaded ? (
        <>
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-emerald-600 dark:text-emerald-400">¡Descargado!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 shrink-0" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
