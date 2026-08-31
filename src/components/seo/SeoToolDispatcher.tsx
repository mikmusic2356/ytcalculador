import React from 'react';
import { SeoToolConfig } from '../../types';
import { SeoToolLayout } from './SeoToolLayout';

// Interactive Tool Views
import { KeywordGeneratorView } from './tools/KeywordGeneratorView';
import { RelatedKeywordsView } from './tools/RelatedKeywordsView';
import { KeywordClustererView } from './tools/KeywordClustererView';
import { KeywordAnalyzerView } from './tools/KeywordAnalyzerView';
import { TitleCounterView } from './tools/TitleCounterView';
import { TitleAnalyzerView } from './tools/TitleAnalyzerView';
import { TitleComparatorView } from './tools/TitleComparatorView';
import { TitleGeneratorView } from './tools/TitleGeneratorView';
import { DescriptionCounterView } from './tools/DescriptionCounterView';
import { DescriptionGeneratorView } from './tools/DescriptionGeneratorView';
import { DescriptionFormatterView } from './tools/DescriptionFormatterView';
import { ChapterGeneratorView } from './tools/ChapterGeneratorView';
import { HashtagGeneratorView } from './tools/HashtagGeneratorView';
import { HashtagAnalyzerView } from './tools/HashtagAnalyzerView';
import { HashtagCleanerView } from './tools/HashtagCleanerView';
import { TagGeneratorView } from './tools/TagGeneratorView';
import { TagFromTitleView } from './tools/TagFromTitleView';
import { TagCounterView } from './tools/TagCounterView';
import { OptimizationAssistantView } from './tools/OptimizationAssistantView';
import { VideoSeoAuditView } from './tools/VideoSeoAuditView';
import { TextCleanerView } from './tools/TextCleanerView';
import { KeywordExtractorView } from './tools/KeywordExtractorView';
import { KeywordsFromTitleDescView } from './tools/KeywordsFromTitleDescView';
import { GeneralSeoWizardView } from './tools/GeneralSeoWizardView';

interface Props {
  tool: SeoToolConfig;
  onNavigate?: (slug: string) => void;
  onCategoryNavigate?: (categoryId: string) => void;
}

export const SeoToolDispatcher: React.FC<Props> = ({
  tool,
  onNavigate,
  onCategoryNavigate,
}) => {
  const renderToolComponent = () => {
    switch (tool.slug) {
      // 1. Keywords
      case 'generador-keywords-youtube':
        return <KeywordGeneratorView onSelectKeyword={(kw) => onNavigate?.(`analizador-keywords?q=${encodeURIComponent(kw)}`)} />;
      case 'palabras-clave-youtube':
        return <RelatedKeywordsView />;
      case 'agrupador-keywords':
        return <KeywordClustererView />;
      case 'analizador-keywords':
        return <KeywordAnalyzerView />;

      // 2. Títulos
      case 'contador-caracteres-titulo':
        return <TitleCounterView />;
      case 'analizador-titulo-youtube':
        return <TitleAnalyzerView />;
      case 'comparador-titulos-youtube':
        return <TitleComparatorView />;
      case 'generador-titulos-youtube':
        return <TitleGeneratorView />;

      // 3. Descripciones y Capítulos
      case 'contador-caracteres-descripcion':
        return <DescriptionCounterView />;
      case 'generador-descripcion-youtube':
        return <DescriptionGeneratorView />;
      case 'formateador-descripcion-youtube':
        return <DescriptionFormatterView />;
      case 'generador-capitulos-youtube':
        return <ChapterGeneratorView />;

      // 4. Hashtags
      case 'generador-hashtags-youtube':
        return <HashtagGeneratorView />;
      case 'analizador-hashtags-youtube':
        return <HashtagAnalyzerView />;
      case 'limpiador-hashtags-youtube':
        return <HashtagCleanerView />;

      // 5. Tags
      case 'generador-tags-youtube':
        return <TagGeneratorView />;
      case 'generador-tags-desde-titulo':
        return <TagFromTitleView />;
      case 'contador-tags-youtube':
        return <TagCounterView />;

      // 6. Asistente y Auditoría
      case 'asistente-seo-youtube':
        return <GeneralSeoWizardView />;
      case 'asistente-optimizacion-youtube':
        return <OptimizationAssistantView />;
      case 'analizador-seo-youtube':
        return <VideoSeoAuditView />;

      // 7. Limpieza y Utilidades
      case 'limpiador-texto-seo':
        return <TextCleanerView />;
      case 'extractor-keywords-youtube':
        return <KeywordExtractorView />;
      case 'keywords-desde-titulo-descripcion':
        return <KeywordsFromTitleDescView />;

      default:
        return <GeneralSeoWizardView />;
    }
  };

  return (
    <SeoToolLayout
      tool={tool}
      onNavigate={onNavigate}
      onCategoryNavigate={onCategoryNavigate}
    >
      {renderToolComponent()}
    </SeoToolLayout>
  );
};
