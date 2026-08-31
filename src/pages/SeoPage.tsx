import React from 'react';
import { SEO_TOOLS } from '../data/seoToolsData';
import { SeoHub } from '../components/seo/SeoHub';
import { SeoToolDispatcher } from '../components/seo/SeoToolDispatcher';
import { SEOHead } from '../components/SEOHead';

interface SeoPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const SeoPage: React.FC<SeoPageProps> = ({ currentPath, onNavigate }) => {
  // Check if this is a subroute under /seo/ or a direct tool slug
  const cleanPath = currentPath.split('?')[0].replace(/\/$/, '');
  const pathParts = cleanPath.split('/').filter(Boolean);

  let toolSlug: string | null = null;
  if (pathParts.length >= 2 && pathParts[0] === 'seo') {
    toolSlug = pathParts[1];
  } else if (pathParts.length === 1 && pathParts[0] !== 'seo') {
    toolSlug = pathParts[0];
  }

  const activeTool = toolSlug ? SEO_TOOLS.find((t) => t.slug === toolSlug) : null;

  if (activeTool) {
    return (
      <SeoToolDispatcher
        tool={activeTool}
        onNavigate={(slug) => onNavigate(`/seo/${slug}`)}
        onCategoryNavigate={(cat) => {
          if (cat === 'todos') onNavigate('/');
          else if (cat === 'seo') onNavigate('/seo');
          else onNavigate(`/${cat}`);
        }}
      />
    );
  }

  return (
    <>
      <SEOHead
        title="🔎 SEO para YouTube | 23 Herramientas Gratuitas de Optimización Textual"
        description="Generador de keywords, analizador de títulos, contador de caracteres, plantillas de descripciones con capítulos, generador de tags y auditoría SEO gratuita para YouTube."
        route="/seo"
      />
      <SeoHub onNavigate={onNavigate} />
    </>
  );
};
