import React from 'react';
import { BookOpen } from 'lucide-react';
import toolArticlesData from '../../data/toolArticlesData.json';

interface ToolBlogArticle {
  whatIs: string;
  origin: string;
  howCalculated: string;
  whatFor: string;
  useCases: string;
}

const articlesMap = toolArticlesData as Record<string, ToolBlogArticle>;

interface ToolBlogSectionProps {
  tool: {
    slug: string;
    name: string;
    category?: string;
    subcategory?: string;
    shortDescription?: string;
    formula?: {
      displayFormula?: string;
      explanation?: string;
    };
  };
}

export const ToolBlogSection: React.FC<ToolBlogSectionProps> = ({ tool }) => {
  const customArticle = articlesMap[tool.slug];

  const blog = customArticle || {
    whatIs: `**${tool.name}** es una herramienta analítica y calculadora matemática especializada para creadores de YouTube, diseñada para procesar métricas precisas sin estimaciones empíricas.`,
    origin: `Surgió con el desarrollo del algoritmo de YouTube Studio y la necesidad de métricas auditadas y transparentes dentro del Programa de Socios de YouTube (YPP).`,
    howCalculated: `Se calcula aplicando formulaciones matemáticas oficiales basadas en el reparto de ingresos de Google AdSense y directrices técnicas de YouTube Creator Academy.`,
    whatFor: `Sirve para planificar presupuestos, diagnosticar la retención de audiencia y maximizar la rentabilidad de cada video producido.`,
    useCases: `**Caso 1:** Creadores que evalúan semanalmente el rendimiento de sus subidas. **Caso 2:** Agencias que auditan canales de clientes para negociar acuerdos comerciales.`,
  };

  return (
    <section className="bg-white dark:bg-[#1F1F1F] rounded-2xl border border-gray-200 dark:border-[#2F2F2F] p-6 sm:p-8 space-y-8 text-[#212121] dark:text-gray-200 shadow-xs">
      <div className="border-b border-gray-100 dark:border-[#2F2F2F] pb-4 flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-950/50 text-[#FF0000] dark:text-[#FF4E45] text-xs font-bold rounded-md mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Artículo Editorial y Análisis Metodológico</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#212121] dark:text-white tracking-tight">
            Todo lo que debes saber sobre {tool.name}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fundamentos conceptuales, origen histórico, modelo de cálculo, importancia estratégica y casos de uso prácticos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {/* Párrafo 1: ¿Qué es? */}
        <div className="space-y-2 p-4 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200/80 dark:border-[#2F2F2F]">
          <h3 className="text-sm sm:text-base font-bold text-[#212121] dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center text-xs font-black">1</span>
            ¿Qué es y en qué consiste {tool.name}?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
            {blog.whatIs}
          </p>
        </div>

        {/* Párrafo 2: ¿De dónde viene? */}
        <div className="space-y-2 p-4 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200/80 dark:border-[#2F2F2F]">
          <h3 className="text-sm sm:text-base font-bold text-[#212121] dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-black">2</span>
            Origen histórico: ¿De dónde viene esta métrica en el ecosistema digital?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
            {blog.origin}
          </p>
        </div>

        {/* Párrafo 3: ¿Cómo se calcula? */}
        <div className="space-y-2 p-4 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200/80 dark:border-[#2F2F2F]">
          <h3 className="text-sm sm:text-base font-bold text-[#212121] dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-black">3</span>
            ¿Cómo se calcula paso a paso? Modelo matemático y variables
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
            {blog.howCalculated}
          </p>
        </div>

        {/* Párrafo 4: ¿Para qué sirve? */}
        <div className="space-y-2 p-4 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200/80 dark:border-[#2F2F2F]">
          <h3 className="text-sm sm:text-base font-bold text-[#212121] dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-black">4</span>
            ¿Para qué sirve y por qué es fundamental para tu canal?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
            {blog.whatFor}
          </p>
        </div>

        {/* Párrafo 5: Casos de uso */}
        <div className="space-y-2 p-4 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200/80 dark:border-[#2F2F2F]">
          <h3 className="text-sm sm:text-base font-bold text-[#212121] dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-black">5</span>
            Casos de uso prácticos y ejemplos reales de aplicación
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
            {blog.useCases}
          </p>
        </div>
      </div>
    </section>
  );
};
