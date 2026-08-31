import React, { useState } from 'react';
import { CopyButton } from './CopyButton';
import { DownloadButton } from './DownloadButton';
import { Check, Plus, Tag, Filter } from 'lucide-react';

export interface KeywordListItem {
  keyword: string;
  category?: string;
  patternType?: string;
  charCount?: number;
  wordCount?: number;
}

interface KeywordListProps {
  items: KeywordListItem[];
  title?: string;
  toolName?: string;
  showFilters?: boolean;
  categories?: string[];
  onSelectKeyword?: (keyword: string) => void;
  id?: string;
}

export const KeywordList: React.FC<KeywordListProps> = ({
  items,
  title = 'Palabras Clave e Ideas Generadas',
  toolName = 'Generador de Keywords',
  showFilters = true,
  categories,
  onSelectKeyword,
  id = 'keyword-list-component',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const availableCategories =
    categories ||
    Array.from(new Set(items.map((i) => i.category).filter(Boolean))) as string[];

  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter((i) => i.category === selectedCategory);

  const toggleSelect = (kw: string) => {
    const next = new Set(selectedItems);
    if (next.has(kw)) {
      next.delete(kw);
    } else {
      next.add(kw);
    }
    setSelectedItems(next);
  };

  const selectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map((i) => i.keyword)));
    }
  };

  const textToCopyAll = (
    selectedItems.size > 0
      ? Array.from(selectedItems)
      : filteredItems.map((i) => i.keyword)
  ).join('\n');

  const commaSeparatedAll = (
    selectedItems.size > 0
      ? Array.from(selectedItems)
      : filteredItems.map((i) => i.keyword)
  ).join(', ');

  const handleCopySingle = async (kw: string) => {
    try {
      await navigator.clipboard.writeText(kw);
      setCopiedItem(kw);
      setTimeout(() => setCopiedItem(null), 1500);
    } catch {
      // fallback
    }
  };

  if (items.length === 0) return null;

  return (
    <div
      id={id}
      className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-200 dark:border-[#2E2E2E] shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-[#2E2E2E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs font-bold rounded-full">
              {filteredItems.length} ideas
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {selectedItems.size > 0
              ? `${selectedItems.size} seleccionadas para exportar o copiar`
              : 'Haz clic en una idea para copiarla o seleccionarla'}
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={selectAll}
            className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-[#252525] hover:bg-gray-200 dark:hover:bg-[#303030] text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer transition-colors"
          >
            {selectedItems.size === filteredItems.length
              ? 'Deseleccionar todas'
              : 'Seleccionar todas'}
          </button>
          <CopyButton
            textToCopy={textToCopyAll}
            label={`Copiar (${selectedItems.size > 0 ? selectedItems.size : filteredItems.length})`}
            size="sm"
            variant="primary"
            toolName={toolName}
          />
          <CopyButton
            textToCopy={commaSeparatedAll}
            label="Con comas (,)"
            size="sm"
            variant="secondary"
            toolName={toolName}
          />
          <DownloadButton
            content={textToCopyAll}
            filename="keywords-youtube.txt"
            size="sm"
          />
        </div>
      </div>

      {/* Category filters */}
      {showFilters && availableCategories.length > 0 && (
        <div className="px-4 py-3 bg-gray-50/50 dark:bg-[#1E1E1E]/50 border-b border-gray-100 dark:border-[#2E2E2E] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-semibold shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Filtros:
          </div>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === 'all'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-black shadow-xs'
                : 'bg-white dark:bg-[#282828] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333]'
            }`}
          >
            Todos ({items.length})
          </button>
          {availableCategories.map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#FF0000] text-white shadow-xs'
                    : 'bg-white dark:bg-[#282828] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Grid of keywords */}
      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[520px] overflow-y-auto">
        {filteredItems.map((item, idx) => {
          const isSelected = selectedItems.has(item.keyword);
          const isCopied = copiedItem === item.keyword;

          return (
            <div
              key={idx}
              className={`group p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-red-50/70 dark:bg-red-950/20 border-red-300 dark:border-red-900/50'
                  : 'bg-gray-50/70 dark:bg-[#222222]/70 hover:bg-gray-100/80 dark:hover:bg-[#282828] border-gray-200/80 dark:border-[#2F2F2F]'
              }`}
            >
              <div
                onClick={() => toggleSelect(item.keyword)}
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer select-none"
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#FF0000] border-[#FF0000] text-white'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1A1A1A]'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.keyword}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
                    {item.category && (
                      <span className="flex items-center gap-1 font-semibold text-gray-500 dark:text-gray-400">
                        <Tag className="w-3 h-3" />
                        {item.category}
                      </span>
                    )}
                    {item.patternType && <span>• {item.patternType}</span>}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                {onSelectKeyword && (
                  <button
                    type="button"
                    onClick={() => onSelectKeyword(item.keyword)}
                    title="Usar en Asistente / Título"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleCopySingle(item.keyword)}
                  title="Copiar término"
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                    isCopied
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'bg-white dark:bg-[#2C2C2C] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#383838]'
                  }`}
                >
                  {isCopied ? '¡Listo!' : 'Copiar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
