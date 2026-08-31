import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { CalculatorConfig } from '../../types';
import { CurrencyCode } from '../../utils/currency';
import { CurrencySelector } from './CurrencySelector';
import { AdPlacement } from '../AdPlacement';

import { Breadcrumbs } from '../Breadcrumbs';

interface CalculatorLayoutProps {
  tool: CalculatorConfig;
  selectedCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onNavigate?: (path: string) => void;
  children: React.ReactNode; // The 2-column form & result area
  additionalSections?: React.ReactNode; // Extra tables or comparators
}

export const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({
  tool,
  selectedCurrency,
  onCurrencyChange,
  onNavigate = () => {},
  children,
  additionalSections,
}) => {
  return (
    <div id={`calculator-view-${tool.id}`} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header breadcrumb & tool title */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumbs
            items={[
              { label: 'Calculadoras', path: '/calculadoras' },
              { label: tool.category.toUpperCase(), path: '/calculadoras' },
              ...(tool.subcategory ? [{ label: tool.subcategory }] : []),
              { label: tool.name },
            ]}
            onNavigate={onNavigate}
          />

          {/* Currency Selector on top right */}
          <CurrencySelector
            selectedCurrency={selectedCurrency}
            onCurrencyChange={onCurrencyChange}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#212121] dark:text-white tracking-tight">
              {tool.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 max-w-3xl leading-relaxed">
              {tool.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 dark:bg-red-950/50 text-[#FF0000] dark:text-[#FF4E45] text-xs font-bold rounded-full border border-red-200 dark:border-red-900/50">
              <Sparkles className="w-3 h-3" />
              100% Gratuito
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-[#272727] text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
              Sin Registro
            </span>
          </div>
        </div>
      </div>

      {/* Top Banner Slot */}
      <AdPlacement slotId={`top-banner-${tool.id}`} format="horizontal-banner" />

      {/* Main 2-Column Calculation Section */}
      {children}

      {/* Additional comparative tables (e.g. Country benchmarks, Milestone tables) */}
      {additionalSections}

      {/* Mid Content Ad */}
      <AdPlacement slotId={`mid-content-${tool.id}`} format="in-content" />

      {/* Editorial Guide & How-To Steps */}
      <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl border border-gray-200 dark:border-[#2F2F2F] p-6 sm:p-8 space-y-6 text-[#212121] dark:text-gray-200 shadow-xs">
        <div className="border-b border-gray-100 dark:border-[#2F2F2F] pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#212121] dark:text-white">
            Guía completa: {tool.seo.h1}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
            {tool.seo.summary}
          </p>
        </div>

        {/* How to steps */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#212121] dark:text-white">
            ¿Cómo utilizar esta calculadora paso a paso?
          </h3>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tool.seo.howToSteps.map((step, i) => (
              <li
                key={i}
                className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#2F2F2F] flex items-start gap-3"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF0000] text-white text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Tactical Tips */}
        {tool.seo.tipsToImprove && tool.seo.tipsToImprove.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-[#212121] dark:text-white">
              Estrategias recomendadas para optimizar tus ingresos
            </h3>
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-950 dark:text-amber-200 text-xs space-y-2">
              {tool.seo.tipsToImprove.map((tip, i) => (
                <p key={i} className="leading-relaxed flex items-start gap-2">
                  <span className="shrink-0">💡</span>
                  <span>{tip}</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
