import React, { useEffect } from 'react';
import { FAQItem } from '../types';
import { ToolRegistry } from '../services/toolRegistry';
import { getSiteUrl, getAbsoluteUrl } from '../config/site';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  canonical?: string; // Alias for canonicalUrl
  route?: string;
  robots?: string;
  type?: 'website' | 'article';
  ogType?: 'website' | 'article';
  ogImage?: string;
  faqs?: FAQItem[];
  howToSteps?: string[];
  toolName?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title: propTitle,
  description: propDescription,
  canonicalUrl: propCanonicalUrl,
  canonical: propCanonical,
  route: propRoute,
  robots: propRobots,
  type: propType,
  ogType: propOgType,
  ogImage: propOgImage,
  faqs: propFaqs,
  howToSteps: propHowToSteps,
  toolName: propToolName,
}) => {
  useEffect(() => {
    // 1. Resolve active route from prop or browser location
    const currentPath =
      propRoute ||
      (typeof window !== 'undefined' ? window.location.pathname : '/');

    // 2. Fetch registry metadata for this route as fallback/base
    const registryMeta = ToolRegistry.getMetadataForRoute(currentPath);

    // 3. Compute final merged metadata
    const finalTitle = propTitle
      ? (propTitle.includes('YouTubeCalculador') ? propTitle : `${propTitle} | YouTubeCalculador`)
      : registryMeta.title;

    const finalDescription = propDescription || registryMeta.metaDescription;

    const rawCanonical = propCanonicalUrl || propCanonical || registryMeta.canonical;
    const finalCanonical = rawCanonical.startsWith('http')
      ? rawCanonical
      : getAbsoluteUrl(rawCanonical);

    const finalRobots = propRobots || registryMeta.robots || 'index, follow';
    const finalOgType = propOgType || propType || registryMeta.openGraph.type || 'website';
    const finalToolName = propToolName || registryMeta.toolName;
    const finalFaqs = propFaqs || registryMeta.faqs;
    const finalHowTo = propHowToSteps || registryMeta.howToSteps;
    const finalImage = propOgImage || registryMeta.openGraph.image || getAbsoluteUrl('/icon.png');

    // --- DOM UPDATES ---

    // A. Document Title
    document.title = finalTitle;

    // Helper for creating or updating meta tags
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // B. Meta Description
    setMetaTag('name', 'description', finalDescription);

    // C. Meta Robots
    setMetaTag('name', 'robots', finalRobots);

    // D. Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', finalCanonical);

    // E. Open Graph Tags
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDescription);
    setMetaTag('property', 'og:url', finalCanonical);
    setMetaTag('property', 'og:type', finalOgType);
    setMetaTag('property', 'og:site_name', 'YouTubeCalculador');
    setMetaTag('property', 'og:locale', 'es_ES');
    if (finalImage) {
      setMetaTag('property', 'og:image', finalImage);
    }

    // F. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', finalDescription);
    if (finalImage) {
      setMetaTag('name', 'twitter:image', finalImage);
    }

    // G. Dynamic JSON-LD Structured Data
    const jsonLdElements: HTMLElement[] = [];

    // Remove any previous dynamic SEO scripts first
    document.querySelectorAll('script[data-dynamic-seo="true"]').forEach((s) => s.remove());

    // 1. WebApplication Schema (for calculators, converters, and tools)
    if (finalToolName) {
      const appSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: finalToolName,
        url: finalCanonical,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: finalDescription,
      };

      const scriptApp = document.createElement('script');
      scriptApp.type = 'application/ld+json';
      scriptApp.text = JSON.stringify(appSchema);
      scriptApp.setAttribute('data-dynamic-seo', 'true');
      document.head.appendChild(scriptApp);
      jsonLdElements.push(scriptApp);
    }

    // 2. FAQ Schema
    if (finalFaqs && finalFaqs.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: finalFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      };

      const scriptFaq = document.createElement('script');
      scriptFaq.type = 'application/ld+json';
      scriptFaq.text = JSON.stringify(faqSchema);
      scriptFaq.setAttribute('data-dynamic-seo', 'true');
      document.head.appendChild(scriptFaq);
      jsonLdElements.push(scriptFaq);
    }

    // 3. HowTo Schema (if steps provided)
    if (finalHowTo && finalHowTo.length > 0 && finalToolName) {
      const howToSchema = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `Cómo usar ${finalToolName}`,
        description: finalDescription,
        step: finalHowTo.map((stepText, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          text: stepText,
        })),
      };

      const scriptHowTo = document.createElement('script');
      scriptHowTo.type = 'application/ld+json';
      scriptHowTo.text = JSON.stringify(howToSchema);
      scriptHowTo.setAttribute('data-dynamic-seo', 'true');
      document.head.appendChild(scriptHowTo);
      jsonLdElements.push(scriptHowTo);
    }

    return () => {
      // Cleanup dynamically added script tags on unmount/page change
      jsonLdElements.forEach((el) => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, [
    propTitle,
    propDescription,
    propCanonicalUrl,
    propCanonical,
    propRoute,
    propRobots,
    propType,
    propOgType,
    propOgImage,
    propFaqs,
    propHowToSteps,
    propToolName,
  ]);

  return null;
};
