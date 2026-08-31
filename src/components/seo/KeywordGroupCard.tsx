import React, { useState } from 'react';
import { CopyButton } from './CopyButton';
import { ChevronDown, ChevronUp, Folder, Check } from 'lucide-react';

interface KeywordGroupCardProps {
  title: string;
  keywords: string[];
  badge?: string;
  similarityScore?: number;
  initiallyOpen?: boolean;
  toolName?: string;
  id?: string;
}

export const KeywordGroupCard: React.FC<KeywordGroupCardProps> = ({
  title,
  keywords,
  badge,
  similarityScore,
  initiallyOpen = true,
  toolName = 'Agrupador de Keywords',
  id,
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [copiedSingle, setCopiedSingle] = useState<string | null>(null);

  const textToCopyAll = keywords.join('\n');
  const commaSeparated = keywords.join(', ');

  const handleCopyOne = async (kw: string) => {
    try {
      await navigator.clipboard.writeText(kw);
      setCopiedSingle(kw);
      setTimeout(() => setCopiedSingle(null), 1500);
    } catch {
      // fallback
    }
  };

  return (
    <div
      id={id || `group-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] shadow-sm overflow-hidden transition-all"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-gray-50/60 dark:bg-[#202020]/60 border-b border-gray-100 dark:border-[#2A2A2A]">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 flex-1 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/40 text-[#FF0000] flex items-center justify-center shrink-0">
            <Folder className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                {title}
              </h4>
              {badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 dark:bg-[#333] text-gray-700 dark:text-gray-300">
                  {badge}
                </span>
              )}
              {similarityScore !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                  {similarityScore}% similitud léxica
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {keywords.length} términos agrupados
            </p>
          </div>
        </div>

        {/* Group Actions */}
        <div className="flex items-center gap-2">
          <CopyButton
            textToCopy={textToCopyAll}
            label="Copiar Grupo"
            size="sm"
            variant="secondary"
            toolName={toolName}
          />
          <CopyButton
            textToCopy={commaSeparated}
            label="Con comas"
            size="sm"
            variant="ghost"
            toolName={toolName}
          />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Keywords Body */}
      {isOpen && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {keywords.map((kw, idx) => {
            const isCopied = copiedSingle === kw;
            return (
              <div
                key={idx}
                className="p-2.5 bg-gray-50 dark:bg-[#222222] rounded-xl border border-gray-100 dark:border-[#2C2C2C] flex items-center justify-between gap-2 hover:border-gray-300 dark:hover:border-[#444] transition-colors"
              >
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                  {kw}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyOne(kw)}
                  className={`px-2 py-0.5 text-[11px] rounded-md font-semibold transition-all cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-white dark:bg-[#2F2F2F] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3A3A3A]'
                  }`}
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-600 inline" /> : 'Copiar'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
