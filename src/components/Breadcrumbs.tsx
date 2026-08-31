import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  onNavigate,
  className = '',
}) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Migas de pan"
      className={`flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium overflow-x-auto no-scrollbar py-1 ${className}`}
    >
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="hover:text-[#FF0000] dark:hover:text-[#FF4E45] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
        title="Ir al inicio"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Inicio</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-zinc-600 shrink-0" />
            {isLast || !item.path ? (
              <span
                className="text-zinc-900 dark:text-white font-bold truncate max-w-[200px] sm:max-w-none"
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => item.path && onNavigate(item.path)}
                className="hover:text-[#FF0000] dark:hover:text-[#FF4E45] transition-colors truncate max-w-[150px] sm:max-w-none cursor-pointer shrink-0"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
