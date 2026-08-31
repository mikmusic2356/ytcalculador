import React from 'react';
import { Sparkles, ArrowRight, Layers } from 'lucide-react';
import { ToolRegistry, RegisteredTool } from '../services/toolRegistry';

interface RelatedToolsProps {
  currentRoute?: string;
  currentToolId?: string;
  category?: string;
  limit?: number;
  onNavigate: (route: string) => void;
  title?: string;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({
  currentRoute,
  currentToolId,
  category,
  limit = 4,
  onNavigate,
  title = 'Herramientas Relacionadas Recomendadas',
}) => {
  const allTools = ToolRegistry.getAll().filter((t) => t.published && t.route && t.route.startsWith('/'));

  // Locate current tool in registry if available
  const currentTool = currentRoute
    ? ToolRegistry.getByRoute(currentRoute)
    : currentToolId
    ? allTools.find((t) => t.id === currentToolId)
    : undefined;

  const targetCategory = category || currentTool?.category;
  const currentPath = currentTool?.route || currentRoute;

  // Filter tools: same category, different route, prioritizing specific image/seo relationships
  let related = allTools.filter((t) => {
    if (t.route === currentPath || t.id === currentTool?.id) return false;
    if (t.kind === 'static') return false; // don't show static privacy/cookies/admin as related tool cards
    if (targetCategory && t.category === targetCategory) return true;
    return false;
  });

  // Fallback to most popular tools if not enough in same category
  if (related.length < limit) {
    const fallback = allTools.filter(
      (t) =>
        t.route !== currentPath &&
        t.kind !== 'static' &&
        !related.some((r) => r.id === t.id)
    );
    related = [...related, ...fallback];
  }

  const finalTools = related.slice(0, limit);

  if (finalTools.length === 0) return null;

  return (
    <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-[#2F2F2F]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF0000]" />
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
            {title}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            if (targetCategory === 'imagenes') onNavigate('/imagenes');
            else if (targetCategory === 'seo') onNavigate('/seo');
            else onNavigate('/calculadoras');
          }}
          className="text-xs font-bold text-[#FF0000] dark:text-[#FF4E45] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {finalTools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => onNavigate(tool.route)}
            className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-zinc-200 dark:border-[#2E2E2E] hover:border-[#FF0000] dark:hover:border-[#FF0000] text-left group transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-[#2A2A2A] text-zinc-600 dark:text-zinc-400 group-hover:bg-red-50 dark:group-hover:bg-red-950/40 group-hover:text-red-600 transition-colors">
                  {tool.category}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
              </div>

              <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white group-hover:text-[#FF0000] transition-colors line-clamp-1 mb-1">
                {tool.name}
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                {tool.shortDescription}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-[#2A2A2A] flex items-center justify-between text-[10px] text-zinc-400 font-mono">
              <span className="truncate max-w-[140px]">{tool.route}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Gratis</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
