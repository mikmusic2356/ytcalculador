import React from 'react';
import { IMAGE_TOOLS } from '../data/imageToolsData';
import { ImageAssistantHub } from '../components/images/ImageAssistantHub';
import { ImageToolDetailView } from '../components/images/ImageToolDetailView';
import { SEOHead } from '../components/SEOHead';

interface ImagesPageProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const ImagesPage: React.FC<ImagesPageProps> = ({ currentPath, onNavigate }) => {
  // Check if this is a subroute under /imagenes/
  const cleanPath = currentPath.split('?')[0].replace(/\/$/, '');
  const pathParts = cleanPath.split('/').filter(Boolean);

  let toolSlug: string | null = null;
  if (pathParts.length >= 2 && pathParts[0] === 'imagenes') {
    toolSlug = pathParts[1];
  }

  const activeTool = toolSlug ? IMAGE_TOOLS.find((t) => t.slug === toolSlug) : null;

  if (activeTool) {
    return <ImageToolDetailView tool={activeTool} onNavigate={onNavigate} />;
  }

  return (
    <>
      <SEOHead
        title="Asistente de Imágenes Online Gratis | Convertir, Comprimir, Redimensionar"
        description="Convierte JPG a PNG, PNG a JPG, WebP, AVIF, comprime imágenes sin perder calidad, redimensiona, recorta a 16:9 y elimina metadatos EXIF. 100% local en tu navegador."
        canonical="/imagenes"
        type="website"
      />
      <ImageAssistantHub onNavigate={onNavigate} />
    </>
  );
};
