import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CalculatorConfig } from '../../types';
import { CalculatorCard } from '../CalculatorCard';

interface RelatedToolsProps {
  currentToolSlug: string;
  allCalculators: CalculatorConfig[];
  relatedSlugs: string[];
  onSelectTool: (slug: string) => void;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({
  currentToolSlug,
  allCalculators,
  relatedSlugs,
  onSelectTool,
}) => {
  // Find related tools
  let related = allCalculators.filter(
    (c) => c.slug !== currentToolSlug && relatedSlugs.includes(c.slug)
  );

  // If less than 3, fallback to same category tools
  if (related.length < 3) {
    const currentTool = allCalculators.find((c) => c.slug === currentToolSlug);
    const categoryMatches = allCalculators.filter(
      (c) =>
        c.slug !== currentToolSlug &&
        c.category === (currentTool?.category || 'ingresos') &&
        !related.some((r) => r.slug === c.slug)
    );
    related = [...related, ...categoryMatches].slice(0, 3);
  } else {
    related = related.slice(0, 3);
  }

  if (related.length === 0) return null;

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#212121] dark:text-white">
          Herramientas Relacionadas Recomendadas
        </h3>
        <button
          onClick={() => onSelectTool('todas')}
          className="text-xs font-bold text-[#FF0000] dark:text-[#FF4E45] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {related.map((relTool) => (
          <CalculatorCard
            key={relTool.id}
            tool={relTool}
            onSelect={onSelectTool}
          />
        ))}
      </div>
    </div>
  );
};
