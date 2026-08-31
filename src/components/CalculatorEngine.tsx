import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Layers,
  Sparkles,
  Bot,
  Globe,
  TrendingUp,
  Split,
  Table as TableIcon,
} from 'lucide-react';
import { CalculatorConfig, CalculationResult } from '../types';
import { CALCULATORS } from '../data/calculators';
import { analytics } from '../utils/analytics';
import {
  CurrencyCode,
  formatCurrencyAmount,
  convertFromUSD,
  SUPPORTED_CURRENCIES,
} from '../utils/currency';
import {
  DEFAULT_SAMPLE_COUNTRIES,
  CountryRPMData,
  calculateCountryRPMComparison,
  calculateViewMilestones,
  calculateLongVsShorts,
} from '../utils/mathFormulas';

// Reusable modular components
import { CalculatorLayout } from './calculator/CalculatorLayout';
import { CalculatorInput } from './calculator/CalculatorInput';
import { CalculatorButton } from './calculator/CalculatorButton';
import { CalculatorResult } from './calculator/CalculatorResult';
import { FormulaExplanation } from './calculator/FormulaExplanation';
import { Disclaimer } from './calculator/Disclaimer';
import { FAQSection } from './calculator/FAQSection';
import { RelatedTools } from './calculator/RelatedTools';

interface CalculatorEngineProps {
  tool: CalculatorConfig;
  onNavigateTool: (slug: string) => void;
}

export const CalculatorEngine: React.FC<CalculatorEngineProps> = ({
  tool,
  onNavigateTool,
}) => {
  // 1. Currency State
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');

  // 2. Form Inputs State
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    tool.fields.forEach((f) => {
      initial[f.id] = f.defaultValue;
    });
    return initial;
  });

  const [inputErrors, setInputErrors] = useState<Record<string, string | null>>({});
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  // 3. Country Comparator Custom State (for interactive editable table)
  const [customCountryData, setCustomCountryData] = useState<CountryRPMData[]>(
    DEFAULT_SAMPLE_COUNTRIES
  );

  // 4. AI Strategic Advisor State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  // Validation function
  const validateInputs = (vals: Record<string, any>): boolean => {
    const errors: Record<string, string | null> = {};
    let isValid = true;

    tool.fields.forEach((f) => {
      const val = Number(vals[f.id]);
      if (f.type === 'number' || f.type === 'currency' || f.type === 'slider') {
        if (vals[f.id] === '' || isNaN(val)) {
          errors[f.id] = 'Este campo es obligatorio.';
          isValid = false;
        } else if (f.min !== undefined && val < f.min) {
          errors[f.id] = `El valor mínimo es ${f.min}.`;
          isValid = false;
        } else if (f.max !== undefined && val > f.max) {
          errors[f.id] = `El valor máximo es ${f.max.toLocaleString('es-ES')}.`;
          isValid = false;
        } else if (val < 0) {
          errors[f.id] = 'El valor no puede ser negativo.';
          isValid = false;
        }
      }
    });

    setInputErrors(errors);
    return isValid;
  };

  // Sync inputs on tool change
  useEffect(() => {
    const initial: Record<string, any> = {};
    tool.fields.forEach((f) => {
      initial[f.id] = f.defaultValue;
    });
    setInputs(initial);
    setInputErrors({});
    setHasCalculated(false);
    setAiAnalysis(null);

    // Track analytics page view
    analytics.trackToolViewed(tool.slug, tool.category);

    // Calculate initial preview
    const res = tool.calculate(initial);
    setResult(res);
  }, [tool.id, tool.slug]);

  // Input change handler
  const handleInputChange = (fieldId: string, value: any) => {
    const updated = { ...inputs, [fieldId]: value };
    setInputs(updated);

    // Clear error for field
    if (inputErrors[fieldId]) {
      setInputErrors((prev) => ({ ...prev, [fieldId]: null }));
    }

    // Auto-recalculate
    const res = tool.calculate(updated);
    setResult(res);
  };

  // Apply preset handler
  const handleApplyPreset = (presetValues: Record<string, any>) => {
    const updated = { ...inputs, ...presetValues };
    setInputs(updated);
    setInputErrors({});
    const res = tool.calculate(updated);
    setResult(res);
  };

  // Primary Calculate click handler
  const handleCalculateClick = () => {
    analytics.trackCalculationStarted(tool.slug, tool.category);

    const isValid = validateInputs(inputs);
    if (!isValid) return;

    const res = tool.calculate(inputs);
    setResult(res);
    setHasCalculated(true);

    // Track completed calculation
    analytics.trackCalculationCompleted(tool.slug, tool.category, {
      hasBenchmark: !!res.benchmarkStatus,
      status: res.benchmarkStatus || 'none',
    });

    if (tool.subcategory === 'comparacion' || tool.slug.includes('comparador')) {
      analytics.trackComparisonCompleted(tool.slug, tool.category, {
        winner: (res.rawOutput as any)?.winner || 'calculated',
      });
    } else if (tool.slug.includes('proyeccion')) {
      analytics.trackProjectionGenerated(tool.slug, tool.category);
    }

    // Celebratory confetti if optimal outcome
    if (res.benchmarkStatus === 'optimal') {
      try {
        confetti({
          particleCount: 35,
          spread: 55,
          origin: { y: 0.6 },
          colors: ['#FF0000', '#22C55E', '#3B82F6'],
        });
      } catch {
        // ignore
      }
    }
  };

  // Reset / New Calculation handler
  const handleReset = () => {
    const initial: Record<string, any> = {};
    tool.fields.forEach((f) => {
      initial[f.id] = f.defaultValue;
    });
    setInputs(initial);
    setInputErrors({});
    const res = tool.calculate(initial);
    setResult(res);
    setHasCalculated(false);
    setAiAnalysis(null);

    analytics.trackNewCalculation(tool.slug, tool.category);
  };

  // Request AI advice
  const handleRequestAiAdvice = async () => {
    if (!result) return;
    setAiLoading(true);
    setAiAnalysis(null);

    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: tool.name,
          category: tool.category,
          inputs,
          resultPrimary: result.primaryValue,
          recommendations: result.recommendations,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiAnalysis(data.advice || 'Análisis completado.');
      } else {
        setAiAnalysis(
          `💡 Recomendación estratégica para ${tool.name}: Basado en tus parámetros (${result.primaryValue}), optimiza los primeros 30 segundos del video para retener a más del 50% de los espectadores y programa tus publicaciones en los horarios de mayor concurrencia de tu público objetivo.`
        );
      }
    } catch {
      setAiAnalysis(
        `💡 Recomendación estratégica para ${tool.name}: Para maximizar tus ingresos en YouTube, combina formatos de video largos (>8 minutos con anuncios intermedios) y contenidos en temáticas de alta intención de compra.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  // Helper to extract "Basado en" summary text
  const getBasedOnText = (): string => {
    if (tool.id === 'ganancias') {
      const views = Number(inputs.views) || 0;
      const rpm = Number(inputs.rpm) || 0;
      return `${views.toLocaleString('es-ES')} vistas, RPM: $${rpm.toFixed(2)} USD`;
    }
    if (tool.id === 'rpm') {
      const rev = Number(inputs.revenue) || 0;
      const views = Number(inputs.views) || 0;
      return `$${rev.toLocaleString('es-ES')} USD de ingresos, ${views.toLocaleString('es-ES')} vistas`;
    }
    if (tool.id === 'cpm') {
      const cost = Number(inputs.cost) || 0;
      const imp = Number(inputs.impressions) || 0;
      return `$${cost.toLocaleString('es-ES')} USD de importe, ${imp.toLocaleString('es-ES')} impresiones`;
    }
    if (tool.id === 'ingresos-mensuales') {
      const daily = Number(inputs.dailyViews) || 0;
      const rpm = Number(inputs.rpm) || 0;
      const days = Number(inputs.days) || 30;
      return `${daily.toLocaleString('es-ES')} vistas/día × ${days} días, RPM: $${rpm.toFixed(2)} USD`;
    }
    if (tool.id === 'ingresos-anuales') {
      const monthly = Number(inputs.monthlyViews) || 0;
      const rpm = Number(inputs.rpm) || 0;
      const months = Number(inputs.months) || 12;
      return `${monthly.toLocaleString('es-ES')} vistas/mes × ${months} meses, RPM: $${rpm.toFixed(2)} USD`;
    }
    if (tool.id.startsWith('vistas-')) {
      const rpm = Number(inputs.rpm) || 0;
      const target = Number(inputs.targetRevenue) || 100;
      return `Meta de $${target.toLocaleString('es-ES')} USD con RPM: $${rpm.toFixed(2)} USD`;
    }
    if (tool.id === 'ganancias-shorts') {
      const views = Number(inputs.views) || 0;
      const rpm = Number(inputs.rpm) || 0.05;
      return `${views.toLocaleString('es-ES')} vistas en Shorts, RPM: $${rpm.toFixed(3)} USD`;
    }
    if (tool.id === 'comparador-largo-shorts') {
      const lv = Number(inputs.longViews) || 0;
      const lr = Number(inputs.longRpm) || 0;
      const sv = Number(inputs.shortsViews) || 0;
      const sr = Number(inputs.shortsRpm) || 0;
      return `${lv.toLocaleString('es-ES')} vistas largas ($${lr} RPM) + ${sv.toLocaleString('es-ES')} Shorts ($${sr} RPM)`;
    }
    return '';
  };

  // Convert primary displayed value if user picked non-USD currency
  const getDisplayPrimaryValue = (): string => {
    if (!result) return '$0.00';
    if (selectedCurrency === 'USD') return result.primaryValue;

    // Check if result contains numeric USD amount that can be converted for reference
    const rawVal = (result.rawOutput as any)?.earnings ?? (result.rawOutput as any)?.totalMonthly ?? (result.rawOutput as any)?.monthlyEarnings ?? (result.rawOutput as any)?.totalAnnual ?? (result.rawOutput as any)?.totalEarnings ?? (result.rawOutput as any)?.rpm;
    
    if (typeof rawVal === 'number' && rawVal > 0 && !result.primaryValue.includes('vistas')) {
      const converted = convertFromUSD(rawVal, selectedCurrency);
      return `${formatCurrencyAmount(converted, selectedCurrency, true)} (~${result.primaryValue})`;
    }

    return result.primaryValue;
  };

  // Custom Country RPM edit handler
  const handleCountryRpmChange = (index: number, newRpm: number) => {
    const updated = [...customCountryData];
    updated[index] = { ...updated[index], sampleRpm: newRpm };
    setCustomCountryData(updated);
  };

  // Render Additional Sections for specific tools
  const renderAdditionalSection = () => {
    // 1. Tool 9: Comparador de RPM por País - Interactive Table
    if (tool.id === 'comparador-paises') {
      const currentViews = Number(inputs.views) || 100000;
      const comparisons = calculateCountryRPMComparison(currentViews, customCountryData);

      return (
        <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl border border-gray-200 dark:border-[#2F2F2F] p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#2F2F2F] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#FF0000]" />
                <h3 className="text-lg font-bold text-[#212121] dark:text-white">
                  Tabla Comparativa de Ingresos por País
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Proyección para {currentViews.toLocaleString('es-ES')} visualizaciones con{' '}
                <span className="font-semibold text-amber-600 dark:text-amber-400">Datos de ejemplo editables</span>.
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-lg border border-amber-300 dark:border-amber-900/50 self-start sm:self-auto">
              ✏️ Puedes editar los RPMs de la tabla
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#333333] text-gray-400 text-[11px] uppercase font-bold">
                  <th className="py-2.5 px-3">País</th>
                  <th className="py-2.5 px-3">RPM Ejemplo ($ USD)</th>
                  <th className="py-2.5 px-3">Fórmula Aplicada</th>
                  <th className="py-2.5 px-3 text-right">Ingresos Estimados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#2F2F2F]">
                {comparisons.map((c, i) => (
                  <tr key={c.countryCode} className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#212121] dark:text-white flex items-center gap-2">
                      <span className="text-base">{c.flag}</span>
                      <span>{c.countryName}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 font-bold">$</span>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="50"
                          value={customCountryData[i].sampleRpm}
                          onChange={(e) =>
                            handleCountryRpmChange(i, parseFloat(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#383838] rounded text-xs font-bold text-[#212121] dark:text-white focus:ring-1 focus:ring-[#FF0000] outline-none"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-gray-500 dark:text-gray-400">
                      ({currentViews.toLocaleString('es-ES')} / 1.000) × ${c.rpm.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      ${c.estimatedEarnings.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-gray-400 dark:text-gray-500 italic">
            * Los valores de RPM utilizados son estimaciones y pueden variar según canal, audiencia, contenido, temporada y otros factores.
          </p>
        </div>
      );
    }

    // 2. Tool 10: Comparador de Ingresos por Cantidad de Vistas - Milestone Table
    if (tool.id === 'comparador-vistas') {
      const currentRpm = Number(inputs.rpm) || 3.5;
      const milestones = calculateViewMilestones(currentRpm);

      return (
        <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl border border-gray-200 dark:border-[#2F2F2F] p-6 sm:p-7 space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-[#2F2F2F] pb-4">
            <TableIcon className="w-5 h-5 text-[#FF0000]" />
            <h3 className="text-lg font-bold text-[#212121] dark:text-white">
              Escalones de Tráfico: De 1.000 a 1.000.000 de Vistas
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#333333] text-gray-400 text-[11px] uppercase font-bold">
                  <th className="py-2.5 px-3">Visualizaciones</th>
                  <th className="py-2.5 px-3">Fórmula: (Vistas / 1.000) × RPM</th>
                  <th className="py-2.5 px-3 text-right">Ingresos Proyectados ($ USD)</th>
                  {selectedCurrency !== 'USD' && (
                    <th className="py-2.5 px-3 text-right text-gray-500">
                      Equivalente {selectedCurrency}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#2F2F2F]">
                {milestones.map((m) => (
                  <tr key={m.views} className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
                    <td className="py-3 px-3 font-bold text-[#212121] dark:text-white">
                      {m.label}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-gray-500 dark:text-gray-400">
                      ({m.views.toLocaleString('es-ES')} / 1.000) × ${currentRpm.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                      ${m.earnings.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </td>
                    {selectedCurrency !== 'USD' && (
                      <td className="py-3 px-3 text-right font-semibold text-gray-600 dark:text-gray-300">
                        {formatCurrencyAmount(convertFromUSD(m.earnings, selectedCurrency), selectedCurrency)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <CalculatorLayout
      tool={tool}
      selectedCurrency={selectedCurrency}
      onCurrencyChange={setSelectedCurrency}
      onNavigate={onNavigateTool}
      additionalSections={renderAdditionalSection()}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Form */}
        <div
          id="calculator-form-container"
          className="lg:col-span-6 bg-white dark:bg-[#1F1F1F] rounded-xl border border-gray-200 dark:border-[#2F2F2F] p-6 sm:p-7 shadow-xs space-y-6"
        >
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#2F2F2F] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#FF0000] text-white rounded-lg shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#212121] dark:text-white">
                Parámetros de Entrada
              </h2>
            </div>

            {/* Presets */}
            {tool.presets && tool.presets.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-[240px] sm:max-w-none">
                <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 hidden sm:inline">
                  Ejemplos:
                </span>
                {tool.presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset.values)}
                    className="text-[11px] font-medium px-2.5 py-1 bg-gray-100 dark:bg-[#2A2A2A] hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-400 text-gray-700 dark:text-gray-300 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {preset.label.split('(')[0]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {tool.fields.map((field) => (
              <CalculatorInput
                key={field.id}
                id={field.id}
                label={field.label}
                type={field.type}
                value={inputs[field.id] ?? field.defaultValue}
                onChange={(val) => handleInputChange(field.id, val)}
                min={field.min}
                max={field.max}
                step={field.step}
                unit={field.unit}
                prefix={field.prefix}
                suffix={field.suffix}
                placeholder={field.placeholder}
                tooltip={field.tooltip}
                options={field.options}
                errorMessage={inputErrors[field.id]}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <CalculatorButton
            onCalculate={handleCalculateClick}
            onReset={handleReset}
            calculateLabel={`Calcular ${tool.name.split(' ')[0] === 'Calculadora' ? 'Resultado' : 'Estimación'}`}
          />

          {/* Formula Explanation Component */}
          {result?.formulaExplanation && (
            <FormulaExplanation
              formula={tool.seo.formulaMarkdown || 'Ganancias = (Vistas / 1000) * RPM'}
              exampleCalculation={result.formulaExplanation}
              explanationSteps={result.recommendations?.slice(0, 2)}
            />
          )}

          {/* Specific Disclaimer */}
          <Disclaimer
            type={tool.subcategory === 'shorts' ? 'shorts' : 'warning'}
            text={
              tool.subcategory === 'shorts'
                ? 'Los ingresos de Shorts pueden variar significativamente y el RPM puede ser muy diferente al de los videos largos. Introduzca un RPM estimado para realizar la proyección.'
                : undefined
            }
          />
        </div>

        {/* Right Column: Live Calculation Result */}
        <div
          id="calculator-result-container"
          className="lg:col-span-6 space-y-6 sticky top-24"
        >
          {result && (
            <CalculatorResult
              primaryLabel={result.primaryLabel}
              primaryValue={getDisplayPrimaryValue()}
              basedOnText={getBasedOnText()}
              formulaCalculationText={result.formulaExplanation?.split('\n')[0] || ''}
              estimationNote={
                tool.subcategory === 'shorts'
                  ? 'Los ingresos de Shorts pueden variar significativamente y el RPM puede ser muy diferente al de los videos largos.'
                  : 'Esta es una estimación basada en el RPM introducido. Los ingresos reales pueden variar.'
              }
              secondaryMetrics={result.secondaryMetrics}
              benchmarkStatus={result.benchmarkStatus}
              benchmarkText={result.benchmarkText}
              breakdownData={result.breakdownData}
              toolName={tool.name}
            />
          )}

          {/* AI Strategic Advisor Card */}
          <div className="p-5 rounded-xl bg-linear-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-200 dark:border-red-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#FF0000] text-white rounded-lg">
                  <Bot className="w-4 h-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#212121] dark:text-white">
                  Asesor de Crecimiento & Monetización AI
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 dark:bg-red-900/50 text-[#FF0000] dark:text-[#FF4E45] rounded-full">
                Gemini 3.7 Flash
              </span>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Genera recomendaciones personalizadas para optimizar el RPM y multiplicar las reproducciones según tus métricas calculadas.
            </p>

            <button
              type="button"
              onClick={handleRequestAiAdvice}
              disabled={aiLoading}
              className="w-full py-2.5 px-4 bg-white dark:bg-[#1A1A1A] hover:bg-gray-50 dark:hover:bg-[#252525] text-gray-800 dark:text-gray-100 border border-red-200 dark:border-red-900/40 text-xs font-bold rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF0000]" />
              <span>{aiLoading ? 'Analizando métricas con IA...' : 'Obtener diagnóstico personalizado'}</span>
            </button>

            {aiAnalysis && (
              <div className="p-3.5 rounded-lg bg-white dark:bg-[#141414] border border-red-200/60 dark:border-red-900/50 text-xs text-gray-700 dark:text-gray-200 leading-relaxed space-y-2">
                <p className="font-medium">{aiAnalysis}</p>
              </div>
            )}
          </div>

          {/* YouTube Channel Sync Architecture Card */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#1A1A1A] border border-dashed border-gray-300 dark:border-[#383838] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-600/10 dark:bg-red-950/40 text-[#FF0000] flex items-center justify-center font-bold text-sm shrink-0">
                ▶
              </div>
              <div>
                <div className="text-xs font-bold text-[#212121] dark:text-white flex items-center gap-2">
                  <span>Conectar mi canal de YouTube</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-200 dark:bg-[#333] text-gray-600 dark:text-gray-300 rounded-md">
                    Modo Manual Activo
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Actualmente funciona con datos manuales. Próximamente podrás importar tus métricas reales con un solo clic vía YouTube Studio.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <FAQSection faqs={tool.seo.faqs} />

          {/* Related Tools */}
          <RelatedTools
            currentToolSlug={tool.slug}
            allCalculators={CALCULATORS}
            relatedSlugs={tool.relatedSlugs}
            onSelectTool={onNavigateTool}
          />
        </div>
      </div>
    </CalculatorLayout>
  );
};
