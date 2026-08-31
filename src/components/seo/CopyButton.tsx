import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  toolName?: string;
  id?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copiar',
  copiedLabel = '¡Copiado!',
  className = '',
  size = 'md',
  variant = 'secondary',
  toolName = 'SEO Tool',
  id,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!textToCopy) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      setCopied(true);
      analytics.trackCopyButtonClicked(toolName, { length: textToCopy.length });

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Fallback silent
    }
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[#FF0000] hover:bg-[#CC0000] text-white shadow-sm font-semibold hover:shadow-md',
    secondary:
      'bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#333333] text-gray-800 dark:text-gray-200 font-medium',
    outline:
      'border border-gray-300 dark:border-[#383838] hover:border-gray-400 dark:hover:border-[#555] text-gray-700 dark:text-gray-300 font-medium bg-transparent',
    ghost:
      'hover:bg-gray-100 dark:hover:bg-[#272727] text-gray-600 dark:text-gray-400 font-medium bg-transparent',
  };

  return (
    <button
      id={id || `btn-copy-${Math.random().toString(36).substring(7)}`}
      type="button"
      onClick={handleCopy}
      disabled={!textToCopy}
      className={`inline-flex items-center justify-center rounded-lg transition-all cursor-pointer select-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      title={label}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            {copiedLabel}
          </span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 shrink-0" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
