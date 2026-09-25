import React from 'react';
import { CalculatorConfig } from '../../types';
import { BookOpen, Sparkles, HelpCircle, History, Calculator, Target, Lightbulb } from 'lucide-react';

interface ToolBlogSectionProps {
  tool: CalculatorConfig;
}

export const ToolBlogSection: React.FC<ToolBlogSectionProps> = ({ tool }) => {
  // Generate tailored contextual blog content based on tool ID, category, and metadata
  const generateBlogContent = () => {
    const name = tool.name;
    const cat = tool.category;
    const subcat = tool.subcategory || '';
    const formulaStr = tool.formula?.displayFormula || 'Fórmula matemática algorítmica';
    const explanation = tool.formula?.explanation || tool.shortDescription;

    // 1. ¿Qué es?
    let whatIs = `**${name}** es una herramienta analítica y calculadora matemática diseñada específicamente para creadores de contenido en YouTube, agencias de medios y editores digitales. Su propósito fundamental es transformar métricas complejas de YouTube Studio en estimaciones financieras y operativas precisas, permitiendo proyectar ingresos brutos y netos, rendimiento de visualizaciones y eficiencia algorítmica sin margen de error. En el ecosistema digital actual, comprender este indicador es indispensable para planificar presupuestos, fijar tarifas con patrocinadores y evaluar la rentabilidad real de cada hora invertida en producción audiovisual.`;

    // 2. ¿De dónde viene?
    let origin = `Esta métrica tiene su origen directo en la evolución del programa de monetización publicitaria de Google y la arquitectura del **YouTube Partner Program (YPP)**. Con el lanzamiento de Google AdSense en 2003 y su posterior integración total con YouTube tras la adquisición de 2006, la industria digital adoptó estándares del marketing tradicional (como el modelo de costos por mil impresiones o CPM de la prensa y televisión), adaptándolos a subastas en tiempo real (RTB). Con los años y la llegada del nuevo panel de YouTube Studio en 2020, YouTube introdujo métricas normalizadas (como el RPM y la tasa de clics CTR) para brindar mayor transparencia a los creadores frente a la volatilidad de las subastas publicitarias globales y la estacionalidad del mercado (Q1 vs Q4).`;

    // 3. ¿Cómo se calcula?
    let howCalculated = `El cálculo exacto ejecutado por esta herramienta se basa en el modelo aritmético oficial: **${formulaStr}**. En este proceso, el algoritmo procesa variables clave como el volumen de visualizaciones válidas, el porcentaje de reparto de ingresos oficial de Google (55% para el creador y 45% para YouTube en videos largos, o el modelo de Creator Pool en Shorts), la duración del video y la tasa de interacción de la audiencia. Cada variable es normalizada de forma local en tu navegador para garantizar que las cifras resultantes reflejen con precisión las liquidaciones finales que verás reflejadas en tu cuenta de AdSense y en los informes analíticos de YouTube Studio.`;

    // 4. ¿Para qué sirve?
    let whatFor = `Utilizar la herramienta **${name}** sirve como una brújula estratégica para optimizar tanto la producción como la monetización de tu canal. Te permite identificar con claridad si tu contenido está rindiendo por encima o por debajo del promedio de tu nicho, detectar fugas de ingresos por falta de pausas publicitarias (mid-rolls) o retención deficiente, y simular escenarios futuros antes de lanzar una serie de videos o emprender una inversión en equipo de grabación. Además, elimina la incertidumbre al negociar acuerdos comerciales de patrocinio directo, dándote datos objetivos sobre el valor comercial por cada mil espectadores que atraes.`;

    // 5. Casos de uso
    let useCases = `Existen múltiples escenarios donde esta herramienta resulta indispensable: **1) Creadores en fase de crecimiento**, que necesitan proyectar cuándo alcanzarán el umbral mínimo de pago de AdSense ($100 USD) o cuántas visualizaciones requieren para vivir a tiempo completo de YouTube. **2) Canales monetizados consolidados**, que buscan comparar el rendimiento de videos largos frente a Shorts para optimizar su calendario de publicación semanal. **3) Consultores y agencias de marketing**, que auditan canales de clientes para calcular el retorno de inversión (ROI), renegociar contratos de patrocinio de marca y diseñar estrategias de optimización de CTR y retención de audiencia basadas en datos empíricos.`;

    // Custom tailoring for specific subcategories
    if (subcat === 'publicidad' || cat === 'ingresos') {
      whatIs = `**${name}** es una calculadora de ingresos publicitarios diseñada para modelar de forma precisa las ganancias generadas a través de Google AdSense y el Programa de Socios de YouTube (YPP). Permite a los creadores descomponer sus ingresos brutos de subasta y estimar el dinero neto en su moneda local, teniendo en cuenta la variabilidad geográfica de los anunciantes y la categoría temática de los videos.`;
      origin = `El concepto de ingresos publicitarios por mil impresiones nació de la necesidad de cuantificar el valor del inventario publicitario en medios masivos. En YouTube, Google revolucionó este modelo al permitir que los anunciantes pujen en subastas automáticas en tiempo real (Google Ads) por aparecer en los videos de los creadores. El sistema divide los ingresos otorgando el 55% al creador de contenido y el 45% a la plataforma, convirtiendo a YouTube en la mayor plataforma de economía de creadores del mundo.`;
      howCalculated = `La estimación matemática se calcula aplicando la fórmula: **${formulaStr}**. Se toma el número de reproducciones estimadas o reales, se dividen entre 1.000 unidades y se multiplican por el RPM (Revenue Per Mille) asignado o el CPM efectivo descontando la tasa de inventario monetizable. ${explanation}`;
      whatFor = `Esta calculadora sirve para establecer metas financieras realistas, planificar el presupuesto de producción de futuros proyectos y determinar qué temáticas de video generan mayor rentabilidad por hora de trabajo. Te ayuda a entender por qué dos canales con las mismas visitas pueden tener ingresos radicalmente distintos según su público objetivo y duración de video.`;
      useCases = `**Caso 1:** Un canal educativo con 100.000 visitas mensuales en España que desea saber cuánto ganará al insertar pausas publicitarias cada 4 minutos. **Caso 2:** Un creador de tecnología que planea lanzar un video patrocinado y necesita cotizar su tarifa base calculando el valor publicitario generado por sus visualizaciones orgánicas habituales.`;
    } else if (subcat === 'shorts') {
      whatIs = `**${name}** es una herramienta especializada en estimar los ingresos y reproducciones requeridas dentro del ecosistema vertical de YouTube Shorts. A diferencia de los videos estándar, los Shorts operan bajo una estructura de reparto colectivo denominada *Piscina de Creadores* (Creator Pool).`;
      origin = `YouTube introdujo el Fondo de Shorts en 2021 como respuesta al crecimiento del video corto, y en febrero de 2023 lo reemplazó por el modelo oficial de monetización dentro del YPP. En este sistema, los anuncios se reproducen entre videos en el feed continuo, agrupando todos los ingresos de un país en una bolsa común sujeta a deducciones por derechos musicales.`;
      howCalculated = `El cálculo se estructura según: **${formulaStr}**. Se multiplica el volumen de visualizaciones en el feed de Shorts por el RPM medio del formato (generalmente entre $0.015 y $0.06 USD por cada 1.000 vistas), ajustando las deducciones correspondientes al uso de música comercial de la biblioteca.`;
      whatFor = `Sirve para que los creadores de formato vertical comprendan la escala de volumen necesaria para generar ingresos significativos. Mientras un video largo puede ser muy rentable con 20.000 vistas, un Short requiere cientos de miles de visualizaciones para alcanzar cifras similares debido a la menor densidad de anuncios por minuto de consumo.`;
      useCases = `**Caso 1:** Un creador de tutoriales cortos que busca determinar si le resulta más rentable publicar 5 Shorts al día o 1 video largo semanal de 10 minutos. **Caso 2:** Un canal que busca verificar cuántos millones de reproducciones le faltan para cumplir con el requisito de 10M de visualizaciones de Shorts para monetizar el canal.`;
    } else if (cat === 'analytics' || subcat === 'rendimiento') {
      whatIs = `**${name}** es una calculadora de análisis de rendimiento que evalúa métricas críticas de interacción y consumo, como el CTR (Click-Through Rate), el tiempo de visualización acumulado (Watch Time) y la tasa media de retención de audiencia.`;
      origin = `El algoritmo de recomendación de YouTube evolucionó a partir de 2012, pasando de priorizar únicamente el número de clics o vistas a priorizar la satisfacción del usuario, el tiempo total de permanencia (Watch Time) y el porcentaje medio visto. Estas métricas determinan si un video será sugerido en la página de inicio (Browse Features) o en la barra lateral de videos recomendados.`;
      howCalculated = `La métrica se procesa mediante la relación matemática: **${formulaStr}**. Se comparan las impresiones servidas frente a los clics efectivos, o la duración total del contenido frente a los minutos promedio consumidos por cada espectador.`;
      whatFor = `Permite a los creadores diagnosticar la salud de sus miniaturas y guiones. Un CTR bajo indica que la portada y el título no están generando suficiente interés visual, mientras que una retención deficiente señala que el inicio del video no cumple la promesa inicial de la miniatura.`;
      useCases = `**Caso 1:** Un canal que realiza pruebas A/B de miniaturas para identificar qué diseño incrementa el CTR de un 4% a un 8.5%. **Caso 2:** Un creador que analiza en qué minuto exacto de sus videos cae la curva de retención para reestructurar el ritmo y las llamadas a la acción (CTAs) de sus próximos guiones.`;
    } else if (cat === 'video') {
      whatIs = `**${name}** es una calculadora técnica orientada a la ingeniería de video, compresión digital, cálculo de tasas de bits (bitrate) y optimización de códecs para la plataforma de YouTube.`;
      origin = `YouTube procesa más de 500 horas de video por minuto en sus centros de datos globales. Para optimizar el ancho de banda y la velocidad de entrega, el sistema comprime todos los archivos subidos utilizando códecs como AVC1 (H.264), VP09 y AV01, asignando diferentes calidades según la resolución y popularidad del contenido.`;
      howCalculated = `El cálculo se efectúa aplicando las ecuaciones de flujo de datos multimedia: **${formulaStr}**, vinculando la resolución en píxeles, la tasa de cuadros por segundo (FPS), la profundidad de color y la tasa de bits en megabits por segundo (Mbps).`;
      whatFor = `Ayuda a editores y creadores a seleccionar los ajustes ideales de exportación en Premiere Pro, DaVinci Resolve o Final Cut, garantizando que el video no sufra pixelación en escenas complejas y evitando tiempos de subida y renderizado innecesariamente largos.`;
      useCases = `**Caso 1:** Un creador de videojuegos con escenas de alta velocidad que busca forzar el códec VP09 exportando a 1440p (2K) para evitar el efecto de bloques de compresión. **Caso 2:** Un editor que necesita calcular con exactitud el peso final en gigabytes de una serie de 10 episodios antes de subirlos a la nube.`;
    }

    return { whatIs, origin, howCalculated, whatFor, useCases };
  };

  const blog = generateBlogContent();

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
            Fundamentos, origen histórico, modelo de cálculo, importancia estratégica y aplicaciones prácticas para creadores.
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
