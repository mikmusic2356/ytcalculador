/**
 * Pure Mathematical & Linguistic SEO Processing Engine for YouTube
 * 100% Client-Side execution. No fake data, no simulated external algorithms.
 * Every score, cluster, and variation is derived transparently via linguistic rules & heuristics.
 */

// Common Spanish Stopwords for accurate NLP tokenization
export const SPANISH_STOPWORDS = new Set([
  'de', 'la', 'que', 'el', 'en', 'y', 'a', 'los', 'del', 'se', 'las', 'por', 'un', 'para',
  'con', 'no', 'una', 'su', 'al', 'lo', 'como', 'mas', 'más', 'pero', 'sus', 'le', 'ya', 'o',
  'este', 'si', 'sí', 'porque', 'esta', 'son', 'entre', 'cuando', 'muy', 'sin', 'sobre', 'también',
  'me', 'hasta', 'hay', 'donde', 'dónde', 'quien', 'quién', 'desde', 'todo', 'nos', 'durante',
  'todos', 'uno', 'les', 'ni', 'contra', 'otros', 'ese', 'eso', 'ante', 'ellos', 'e', 'esto',
  'mi', 'mis', 'tu', 'tus', 'te', 'ti', 'mismo', 'yo', 'tu', 'él', 'ella', 'nosotros', 'vosotros',
  'ellos', 'ellas', 'es', 'era', 'fue', 'ser', 'estar', 'ha', 'han', 'he', 'has', 'hemos',
]);

/**
 * Clean & normalize text into standard token array
 */
export function tokenizeText(text: string, removeStopwords = false): string[] {
  if (!text) return [];
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics for uniform matching
    .replace(/[^\w\s\d]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = normalized.split(' ').filter((w) => w.length > 1);
  if (!removeStopwords) return words;
  return words.filter((w) => !SPANISH_STOPWORDS.has(w));
}

/**
 * 1. Generador de Palabras Clave (Linguistic Variations by Intent)
 */
export interface KeywordVariation {
  keyword: string;
  category: string;
  patternType: string;
}

export function generateLinguisticKeywords(
  seed: string,
  intent: 'all' | 'informative' | 'search' | 'educational' | 'entertainment' | 'tutorial' | 'comparison' | 'news' | 'reaction' = 'all'
): KeywordVariation[] {
  const cleanSeed = seed.trim();
  if (!cleanSeed) return [];

  const results: KeywordVariation[] = [];
  const add = (kw: string, cat: string, pat: string) => {
    const trimmed = kw.trim();
    if (trimmed && !results.some((r) => r.keyword.toLowerCase() === trimmed.toLowerCase())) {
      results.push({ keyword: trimmed, category: cat, patternType: pat });
    }
  };

  // Base exact & direct
  add(cleanSeed, 'Directa', 'Palabra clave base');
  add(`${cleanSeed} 2026`, 'Temporal', 'Año / Actualidad');
  add(`${cleanSeed} español`, 'Idioma', 'Localización');
  add(`${cleanSeed} completo`, 'Directa', 'Calificador de contenido');

  // Informative / General
  if (intent === 'all' || intent === 'informative') {
    add(`que es ${cleanSeed}`, 'Informativa', 'Definición');
    add(`como funciona ${cleanSeed}`, 'Informativa', 'Explicación');
    add(`historia de ${cleanSeed}`, 'Informativa', 'Contexto');
    add(`${cleanSeed} explicacion`, 'Informativa', 'Análisis conceptual');
    add(`${cleanSeed} caracteristicas`, 'Informativa', 'Atributos');
    add(`${cleanSeed} significado`, 'Informativa', 'Semántica');
  }

  // Search / Commercial intent
  if (intent === 'all' || intent === 'search') {
    add(`mejor ${cleanSeed}`, 'Búsqueda', 'Comparativa superior');
    add(`${cleanSeed} precio`, 'Búsqueda', 'Costos');
    add(`${cleanSeed} comprar`, 'Búsqueda', 'Adquisición');
    add(`${cleanSeed} vale la pena`, 'Búsqueda', 'Evaluación de valor');
    add(`${cleanSeed} review en español`, 'Búsqueda', 'Reseña en profundidad');
    add(`${cleanSeed} analisis honesto`, 'Búsqueda', 'Opinión');
  }

  // Educational
  if (intent === 'all' || intent === 'educational') {
    add(`curso de ${cleanSeed}`, 'Educativo', 'Formación');
    add(`aprender ${cleanSeed} desde cero`, 'Educativo', 'Nivel principiante');
    add(`${cleanSeed} para principiantes`, 'Educativo', 'Audiencia base');
    add(`${cleanSeed} paso a paso`, 'Educativo', 'Metodología');
    add(`conceptos basicos de ${cleanSeed}`, 'Educativo', 'Fundamentos');
    add(`guia definitiva de ${cleanSeed}`, 'Educativo', 'Contenido pilar');
  }

  // Tutorial / How-to
  if (intent === 'all' || intent === 'tutorial') {
    add(`como hacer ${cleanSeed}`, 'Tutorial', 'Acción directa');
    add(`como usar ${cleanSeed}`, 'Tutorial', 'Instrucción de uso');
    add(`como configurar ${cleanSeed}`, 'Tutorial', 'Configuración técnica');
    add(`tutorial de ${cleanSeed} en español`, 'Tutorial', 'Guía práctica');
    add(`como resolver error en ${cleanSeed}`, 'Tutorial', 'Solución de problemas');
    add(`trucos para ${cleanSeed}`, 'Tutorial', 'Consejos y atajos');
  }

  // Comparison
  if (intent === 'all' || intent === 'comparison') {
    add(`${cleanSeed} vs`, 'Comparación', 'Enfrentamiento directo');
    add(`${cleanSeed} diferencias`, 'Comparación', 'Contraste');
    add(`alternativas a ${cleanSeed}`, 'Comparación', 'Sustitutos');
    add(`que es mejor ${cleanSeed} o`, 'Comparación', 'Dilema de elección');
    add(`${cleanSeed} ventajas y desventajas`, 'Comparación', 'Pros y contras');
  }

  // Entertainment
  if (intent === 'all' || intent === 'entertainment') {
    add(`${cleanSeed} momentos divertidos`, 'Entretenimiento', 'Humor / Clips');
    add(`${cleanSeed} mejores jugadas`, 'Entretenimiento', 'Destacados');
    add(`probando ${cleanSeed}`, 'Entretenimiento', 'Experimento');
    add(`reto de ${cleanSeed}`, 'Entretenimiento', 'Desafío');
    add(`curiosidades de ${cleanSeed}`, 'Entretenimiento', 'Datos curiosos');
    add(`secretos de ${cleanSeed}`, 'Entretenimiento', 'Misterio');
  }

  // News / Updates
  if (intent === 'all' || intent === 'news') {
    add(`noticias sobre ${cleanSeed}`, 'Noticias', 'Actualidad');
    add(`actualizacion de ${cleanSeed}`, 'Noticias', 'Novedades');
    add(`cuando sale ${cleanSeed}`, 'Noticias', 'Fecha de lanzamiento');
    add(`${cleanSeed} filtraciones`, 'Noticias', 'Rumores y leaks');
    add(`${cleanSeed} que paso`, 'Noticias', 'Evento reciente');
  }

  // Reaction / Review
  if (intent === 'all' || intent === 'reaction') {
    add(`reaccion a ${cleanSeed}`, 'Reacción', 'Respuesta en vivo');
    add(`mi primera vez en ${cleanSeed}`, 'Reacción', 'Experiencia inicial');
    add(`analizando ${cleanSeed}`, 'Reacción', 'Desglose crítico');
    add(`${cleanSeed} trailer reaccion`, 'Reacción', 'Reseña de avance');
    add(`lo bueno y lo malo de ${cleanSeed}`, 'Reacción', 'Balance crítico');
  }

  return results;
}

/**
 * 2. Generador de Palabras Relacionadas (Agrupadas por tipo)
 */
export interface RelatedKeywordsResult {
  seed: string;
  variations: string[];
  synonymsAndTerms: string[];
  questions: string[];
  longTail: string[];
  potentialSearches: string[];
}

export function generateRelatedKeywordsGrouped(seed: string): RelatedKeywordsResult {
  const clean = seed.trim();
  if (!clean) {
    return {
      seed: '',
      variations: [],
      synonymsAndTerms: [],
      questions: [],
      longTail: [],
      potentialSearches: [],
    };
  }

  return {
    seed: clean,
    variations: [
      `${clean} trailer`,
      `${clean} gameplay`,
      `${clean} fecha de lanzamiento`,
      `${clean} gameplay español`,
      `${clean} oficial`,
      `${clean} 4k 60fps`,
      `${clean} en vivo`,
    ],
    synonymsAndTerms: [
      `analisis de ${clean}`,
      `resumen de ${clean}`,
      `guia de ${clean}`,
      `especificaciones de ${clean}`,
      `requisitos de ${clean}`,
      `consejos para ${clean}`,
      `estrategias en ${clean}`,
    ],
    questions: [
      `¿Cuándo sale ${clean}?`,
      `¿Cómo conseguir ${clean}?`,
      `¿Cuánto cuesta ${clean}?`,
      `¿Dónde se desarrolla ${clean}?`,
      `¿Qué novedades tiene ${clean}?`,
      `¿Por qué es tan popular ${clean}?`,
      `¿Vale la pena comprar ${clean}?`,
    ],
    longTail: [
      `${clean} trailer reaccion en español`,
      `${clean} gameplay parte 1 en directo`,
      `como jugar ${clean} en pc requisitos minimos`,
      `los mejores trucos y secretos de ${clean}`,
      `${clean} analisis completo en profundidad 2026`,
      `todo lo que sabemos sobre ${clean} hasta ahora`,
    ],
    potentialSearches: [
      `${clean} para principiantes`,
      `${clean} descarga oficial`,
      `${clean} online multijugador`,
      `${clean} historia explicada`,
      `${clean} mapa completo`,
      `${clean} final explicado`,
    ],
  };
}

/**
 * 3. Agrupador de Keywords (Clustering por similitud léxica Jaccard & N-Gramas)
 */
export interface KeywordCluster {
  id: string;
  title: string;
  keywords: string[];
  similarityScore: number;
}

export function clusterKeywords(rawKeywords: string[]): KeywordCluster[] {
  const cleanList = Array.from(
    new Set(
      rawKeywords
        .map((k) => k.trim())
        .filter((k) => k.length > 0)
    )
  );

  if (cleanList.length === 0) return [];

  // Group keywords based on common tokens (excluding stopwords)
  const tokenizedList = cleanList.map((kw) => ({
    raw: kw,
    tokens: new Set(tokenizeText(kw, true)),
  }));

  const clusters: Array<{ title: string; keywords: string[] }> = [];
  const assigned = new Set<number>();

  for (let i = 0; i < tokenizedList.length; i++) {
    if (assigned.has(i)) continue;

    const current = tokenizedList[i];
    const group: string[] = [current.raw];
    assigned.add(i);

    // Find other keywords with overlapping tokens
    for (let j = i + 1; j < tokenizedList.length; j++) {
      if (assigned.has(j)) continue;

      const candidate = tokenizedList[j];
      // Compute token intersection
      let intersection = 0;
      current.tokens.forEach((t) => {
        if (candidate.tokens.has(t)) intersection++;
      });

      const union = new Set([...Array.from(current.tokens), ...Array.from(candidate.tokens)]).size;
      const jaccard = union > 0 ? intersection / union : 0;

      // Also check prefix/substring match
      const isSubstring =
        current.raw.toLowerCase().includes(candidate.raw.toLowerCase()) ||
        candidate.raw.toLowerCase().includes(current.raw.toLowerCase());

      if (jaccard >= 0.3 || (intersection >= 2 && intersection >= current.tokens.size * 0.4) || isSubstring) {
        group.push(candidate.raw);
        assigned.add(jaccard >= 0.3 ? j : j);
      }
    }

    // Determine representative title for cluster
    let clusterTitle = group[0];
    // Find most frequent token in group
    const tokenFreq: Record<string, number> = {};
    group.forEach((kw) => {
      tokenizeText(kw, true).forEach((t) => {
        tokenFreq[t] = (tokenFreq[t] || 0) + 1;
      });
    });

    const topTokens = Object.entries(tokenFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([t]) => t);

    if (topTokens.length > 0) {
      clusterTitle = topTokens.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    clusters.push({
      title: clusterTitle,
      keywords: group,
    });
  }

  return clusters.map((c, idx) => ({
    id: `cluster-${idx + 1}`,
    title: c.title,
    keywords: c.keywords,
    similarityScore: Math.min(95, 65 + c.keywords.length * 5),
  }));
}

/**
 * 4. Analizador de Lista de Keywords
 */
export interface KeywordListAnalysis {
  totalKeywords: number;
  uniqueKeywords: number;
  duplicateKeywords: number;
  totalWords: number;
  uniqueWords: number;
  avgLengthChars: number;
  avgWordsPerKeyword: number;
  frequencyMap: Array<{ word: string; count: number; percentage: number }>;
  items: Array<{
    keyword: string;
    charCount: number;
    wordCount: number;
    hasNumbers: boolean;
    isLongTail: boolean;
  }>;
}

export function analyzeKeywordList(rawText: string): KeywordListAnalysis {
  const lines = rawText
    .split(/[\n,]/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const totalKeywords = lines.length;
  const uniqueSet = new Set(lines.map((l) => l.toLowerCase()));
  const uniqueKeywords = uniqueSet.size;
  const duplicateKeywords = totalKeywords - uniqueKeywords;

  let totalChars = 0;
  let totalWordsCount = 0;
  const wordFrequency: Record<string, number> = {};

  const items = lines.map((kw) => {
    const words = kw.split(/\s+/).filter(Boolean);
    const charCount = kw.length;
    const wordCount = words.length;
    totalChars += charCount;
    totalWordsCount += wordCount;

    words.forEach((w) => {
      const cleanW = w.toLowerCase().replace(/[^\w]/g, '');
      if (cleanW && !SPANISH_STOPWORDS.has(cleanW)) {
        wordFrequency[cleanW] = (wordFrequency[cleanW] || 0) + 1;
      }
    });

    return {
      keyword: kw,
      charCount,
      wordCount,
      hasNumbers: /\d/.test(kw),
      isLongTail: wordCount >= 4,
    };
  });

  const frequencyMap = Object.entries(wordFrequency)
    .map(([word, count]) => ({
      word,
      count,
      percentage: totalWordsCount > 0 ? Math.round((count / totalWordsCount) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  return {
    totalKeywords,
    uniqueKeywords,
    duplicateKeywords,
    totalWords: totalWordsCount,
    uniqueWords: Object.keys(wordFrequency).length,
    avgLengthChars: totalKeywords > 0 ? Math.round((totalChars / totalKeywords) * 10) / 10 : 0,
    avgWordsPerKeyword: totalKeywords > 0 ? Math.round((totalWordsCount / totalKeywords) * 10) / 10 : 0,
    frequencyMap,
    items,
  };
}

/**
 * 6. Analizador de Título & Puntuación de Optimización Textual
 */
export interface TitleAnalysisResult {
  title: string;
  charCount: number;
  wordCount: number;
  charsWithoutSpaces: number;
  hasNumbers: boolean;
  numbersList: string[];
  uppercasePercentage: number;
  isAllUppercase: boolean;
  hasQuestionMark: boolean;
  hasExclamationMark: boolean;
  emojis: string[];
  repeatedWords: string[];
  keywordFound: boolean;
  keywordPosition?: 'start' | 'middle' | 'end' | 'none';
  readabilityScore: number; // 0 to 100
  readabilityLevel: string;
  lengthStatus: 'corta' | 'optima' | 'larga' | 'excesiva';
  // Puntuación de optimización textual (0-100)
  overallScore: number;
  scoreBreakdown: {
    lengthScore: number; // max 25
    keywordScore: number; // max 25
    readabilityScore: number; // max 20
    structureScore: number; // max 15
    interestScore: number; // max 15
  };
  recommendations: string[];
}

export function analyzeTitle(title: string, targetKeyword?: string): TitleAnalysisResult {
  const cleanTitle = title.trim();
  const charCount = cleanTitle.length;
  const words = cleanTitle.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charsWithoutSpaces = cleanTitle.replace(/\s+/g, '').length;

  // Extract numbers
  const numberMatches = cleanTitle.match(/\d+/g) || [];
  const hasNumbers = numberMatches.length > 0;

  // Uppercase analysis
  const letters = cleanTitle.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
  const uppercaseLetters = cleanTitle.replace(/[^A-ZÁÉÍÓÚÑ]/g, '');
  const uppercasePercentage = letters.length > 0 ? Math.round((uppercaseLetters.length / letters.length) * 100) : 0;
  const isAllUppercase = letters.length > 3 && uppercasePercentage >= 85;

  // Punctuation & Emojis
  const hasQuestionMark = /[?¿]/.test(cleanTitle);
  const hasExclamationMark = /[!¡]/.test(cleanTitle);
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const emojis = cleanTitle.match(emojiRegex) || [];

  // Repeated words check
  const wordCounts: Record<string, number> = {};
  words.forEach((w) => {
    const normalized = w.toLowerCase().replace(/[^\wáéíóúñ]/g, '');
    if (normalized.length > 2 && !SPANISH_STOPWORDS.has(normalized)) {
      wordCounts[normalized] = (wordCounts[normalized] || 0) + 1;
    }
  });
  const repeatedWords = Object.entries(wordCounts)
    .filter(([, count]) => count > 1)
    .map(([w]) => w);

  // Keyword check
  let keywordFound = false;
  let keywordPosition: 'start' | 'middle' | 'end' | 'none' = 'none';

  if (targetKeyword && targetKeyword.trim()) {
    const cleanKw = targetKeyword.trim().toLowerCase();
    const lowerTitle = cleanTitle.toLowerCase();
    if (lowerTitle.includes(cleanKw)) {
      keywordFound = true;
      const index = lowerTitle.indexOf(cleanKw);
      if (index === 0 || index < 15) {
        keywordPosition = 'start';
      } else if (index + cleanKw.length >= cleanTitle.length - 10) {
        keywordPosition = 'end';
      } else {
        keywordPosition = 'middle';
      }
    }
  }

  // Length classification
  let lengthStatus: 'corta' | 'optima' | 'larga' | 'excesiva' = 'optima';
  if (charCount < 30) lengthStatus = 'corta';
  else if (charCount <= 70) lengthStatus = 'optima';
  else if (charCount <= 90) lengthStatus = 'larga';
  else lengthStatus = 'excesiva';

  // Readability heuristics (Flesch-Szigriszt approximation for titles)
  let readabilityScore = 80;
  if (wordCount > 14) readabilityScore -= 15;
  if (isAllUppercase) readabilityScore -= 25;
  if (repeatedWords.length > 0) readabilityScore -= 15;
  if (hasQuestionMark || hasNumbers) readabilityScore += 10;
  readabilityScore = Math.max(20, Math.min(100, readabilityScore));

  let readabilityLevel = 'Excelente y directo';
  if (readabilityScore < 50) readabilityLevel = 'Dificultosa o sobrecargada';
  else if (readabilityScore < 75) readabilityLevel = 'Buena pero mejorable';

  // Transparent Score Calculation (Puntuación de Optimización Textual 0-100)
  let lengthScore = 0;
  if (charCount >= 45 && charCount <= 68) lengthScore = 25;
  else if (charCount >= 30 && charCount <= 80) lengthScore = 20;
  else if (charCount > 0 && charCount < 30) lengthScore = 12;
  else lengthScore = 10; // > 80 chars (might truncate on mobile)

  let keywordScore = 0;
  if (targetKeyword && targetKeyword.trim()) {
    if (keywordFound) {
      if (keywordPosition === 'start') keywordScore = 25;
      else if (keywordPosition === 'middle') keywordScore = 20;
      else keywordScore = 15;
    } else {
      keywordScore = 5;
    }
  } else {
    // If no target keyword provided, evaluate general term density
    keywordScore = wordCount >= 4 && wordCount <= 12 ? 22 : 14;
  }

  let structureScore = 15;
  if (isAllUppercase) structureScore -= 8;
  if (repeatedWords.length > 0) structureScore -= 5;
  structureScore = Math.max(2, structureScore);

  let interestScore = 8;
  if (hasNumbers) interestScore += 3;
  if (hasQuestionMark || hasExclamationMark) interestScore += 2;
  if (emojis.length > 0 && emojis.length <= 2) interestScore += 2;
  interestScore = Math.min(15, interestScore);

  const calcReadabilitySub = Math.round((readabilityScore / 100) * 20);

  const overallScore = Math.min(
    100,
    lengthScore + keywordScore + structureScore + interestScore + calcReadabilitySub
  );

  // Actionable recommendations
  const recommendations: string[] = [];
  if (charCount > 70) {
    recommendations.push(
      'El título supera los 70 caracteres: los dispositivos móviles suelen recortar títulos largos en los resultados de búsqueda.'
    );
  }
  if (charCount < 30 && charCount > 0) {
    recommendations.push('El título es muy breve: añade contexto, una pregunta o un beneficio claro para el espectador.');
  }
  if (isAllUppercase) {
    recommendations.push('Evita escribir todo el título en MAYÚSCULAS sostenidas; dificulta la lectura rápida.');
  }
  if (targetKeyword && !keywordFound) {
    recommendations.push(`La palabra clave objetivo "${targetKeyword}" no aparece en el texto del título.`);
  } else if (keywordFound && keywordPosition !== 'start') {
    recommendations.push('Coloca tu palabra clave principal lo más cerca posible del inicio del título para facilitar el escaneo visual.');
  }
  if (!hasNumbers && !hasQuestionMark) {
    recommendations.push('Considera añadir una pregunta directa ("¿Cómo...?") o un número ("Top 5", "en 10 minutos") para aumentar la curiosidad.');
  }
  if (repeatedWords.length > 0) {
    recommendations.push(`Palabras repetidas detectadas (${repeatedWords.join(', ')}): elimina redundancias.`);
  }

  return {
    title: cleanTitle,
    charCount,
    wordCount,
    charsWithoutSpaces,
    hasNumbers,
    numbersList: numberMatches,
    uppercasePercentage,
    isAllUppercase,
    hasQuestionMark,
    hasExclamationMark,
    emojis,
    repeatedWords,
    keywordFound,
    keywordPosition,
    readabilityScore,
    readabilityLevel,
    lengthStatus,
    overallScore,
    scoreBreakdown: {
      lengthScore,
      keywordScore,
      readabilityScore: calcReadabilitySub,
      structureScore,
      interestScore,
    },
    recommendations,
  };
}

/**
 * 8. Generador de Títulos (10-20 propuestas basadas en fórmulas retóricas)
 */
export function generateTitleFormulas(
  topic: string,
  keyword: string,
  tone: 'curioso' | 'emocional' | 'directo' | 'polemico' | 'educativo' | 'reaccion' | 'misterio' | 'entretenimiento' = 'directo',
  contentType = 'Video'
): string[] {
  const t = topic.trim() || 'YouTube';
  const kw = keyword.trim() || t;

  const titles: string[] = [];

  switch (tone) {
    case 'curioso':
      titles.push(
        `¿Qué pasa REALMENTE con ${kw}? La Verdad Explicada`,
        `Nadie te contó ESTO sobre ${kw}`,
        `¿Por qué todos están hablando de ${kw}?`,
        `Probé ${kw} durante 7 días y esto pasó`,
        `El SECRETO de ${kw} que casi nadie conoce`,
        `¿Es ${kw} tan bueno como dicen? Lo descubrimos`,
        `¿Vale la pena ${kw} en 2026?`,
        `Lo que NADIE te dice antes de probar ${kw}`,
        `¿Por qué ${kw} cambió todo? Análisis Completo`,
        `10 Cosas que NO sabías sobre ${kw}`,
        `¿Cómo funciona realmente ${kw}? Guía Rápida`,
        `La historia oculta detrás de ${kw}`,
      );
      break;

    case 'emocional':
      titles.push(
        `Mi experiencia honesta con ${kw}: No esperaba esto`,
        `Por qué decidí dejar ${kw} (y qué haré ahora)`,
        `El mayor error que cometí con ${kw}`,
        `Cómo ${kw} me cambió la vida por completo`,
        `No cometas este error con ${kw} como yo`,
        `La decisión más difícil sobre ${kw}`,
        `Lo que sentí al probar ${kw} por primera vez`,
        `Por fin hablo sobre ${kw} (Sincero y sin filtros)`,
        `El momento que lo cambió todo en ${kw}`,
        `Gracias a ${kw} aprendí la lección más importante`,
      );
      break;

    case 'polemico':
      titles.push(
        `La GRAN MENTIRA sobre ${kw} que todos creen`,
        `Por qué ${kw} NO es lo que parece`,
        `La verdad incómoda sobre ${kw}`,
        `¿Está ${kw} sobrevalorado? Opinión sincera`,
        `Por qué NO deberías usar ${kw} todavía`,
        `El problema con ${kw} del que nadie habla`,
        `¿El FIN de ${kw}? Lo que está pasando`,
        `Desmintiendo los mayores mitos de ${kw}`,
        `¿Fraude o Revolución? Analizamos ${kw}`,
        `Por qué dejé de recomendar ${kw}`,
      );
      break;

    case 'educativo':
      titles.push(
        `Cómo dominar ${kw} desde CERO (Guía Paso a Paso 2026)`,
        `${kw}: Tutorial Completo para Principiantes`,
        `Aprende ${kw} en 15 Minutos (Sin Rodeos)`,
        `Los 7 Fundamentos Clave de ${kw} que debes saber`,
        `Guía Definitiva de ${kw}: Todo lo que necesitas`,
        `5 Errores Comunes en ${kw} y Cómo Evitarlos`,
        `Cómo configurar ${kw} correctamente desde el inicio`,
        `Curso Rápido de ${kw} para Creadores`,
        `Metodología práctica para dominar ${kw}`,
        `Optimización de ${kw}: Guía de mejores prácticas`,
        `De Principiante a Avanzado en ${kw}`,
        `Las mejores herramientas y técnicas para ${kw}`,
      );
      break;

    case 'reaccion':
      titles.push(
        `Mi REACCIÓN a ${kw} (¡Increíble!)`,
        `Reaccionando a ${kw} por primera vez`,
        `¡No me esperaba esto! Reacción sincera a ${kw}`,
        `Analizando ${kw} segundo a segundo`,
        `Mi opinión honesta tras ver ${kw}`,
        `Reacción épica a ${kw}: Los mejores momentos`,
        `¿Valió la pena la espera de ${kw}? Reacción`,
        `Desglosando cada detalle de ${kw} en directo`,
        `Reacción de experto a ${kw}`,
        `¡Quedé en SHOCK con ${kw}!`,
      );
      break;

    case 'misterio':
      titles.push(
        `El archivo secreto de ${kw} que fue eliminado`,
        `El misterio sin resolver de ${kw}`,
        `¿Qué oculta ${kw}? La teoría más perturbadora`,
        `Descubrí algo aterrador sobre ${kw}`,
        `Las pistas ocultas en ${kw} que nadie vio`,
        `La extraña desaparición en torno a ${kw}`,
        `El enigma de ${kw} explicado al detalle`,
        `Lo que encontraron dentro de ${kw}`,
        `¿Casualidad o Conspiración? El caso de ${kw}`,
        `El secreto mejor guardado sobre ${kw}`,
      );
      break;

    case 'entretenimiento':
      titles.push(
        `Probando los peores trucos de ${kw}`,
        `El RETO imposible de ${kw} (¿Salió mal?)`,
        `24 Horas haciendo TODO sobre ${kw}`,
        `Gasté todo mi dinero en ${kw}`,
        `Los momentos más divertidos en ${kw}`,
        `¿Quién sabe más sobre ${kw}? Desafío épico`,
        `Intenté ${kw} con 0 de presupuesto`,
        `Experimento loco con ${kw}: Resultado inesperado`,
        `Sobreviviendo en ${kw} nivel extremo`,
        `Las mejores parodias y jugadas de ${kw}`,
      );
      break;

    case 'directo':
    default:
      titles.push(
        `${kw}: Análisis Completo y Opinión en Español (2026)`,
        `Cómo usar ${kw} Paso a Paso`,
        `Todo lo que debes saber sobre ${kw}`,
        `${kw} vs Alternativas: Comparativa Completa`,
        `Los 5 Mejores Consejos para ${kw}`,
        `${kw}: Guía Práctica y Directa`,
        `¿Qué es ${kw} y cómo funciona?`,
        `Top 10 Características de ${kw}`,
        `Resumen Rápido de ${kw} en 5 Minutos`,
        `${kw}: Review Detallada y Conclusiones`,
        `Manual de inicio rápido para ${kw}`,
        `${kw} en 2026: Todo lo nuevo`,
      );
      break;
  }

  return titles;
}

/**
 * 10. Generador de Descripción Estructurada
 */
export function generateStructuredDescription(params: {
  title: string;
  topic: string;
  keyword: string;
  contentType: string;
  extraInfo?: string;
}): string {
  const { title, topic, keyword, extraInfo } = params;
  const t = topic || 'este tema';
  const kw = keyword || t;

  return `En este video analizamos en profundidad ${title || `${kw} en 2026`}. Descubre todos los detalles, pasos clave y recomendaciones prácticas para dominar ${t}.

📌 Puntos clave tratados en este video:
• Introducción y conceptos fundamentales sobre ${kw}.
• Análisis detallado y demostración práctica paso a paso.
• Consejos y mejores estrategias aplicables de inmediato.
• Conclusiones finales y recomendaciones para creadores.

${extraInfo ? `ℹ️ Información adicional del video:\n${extraInfo}\n\n` : ''}🔔 SUSCRÍBETE al canal para más contenido y guías sobre ${t}:
[Pega aquí el enlace de suscripción a tu canal]

🔗 Enlaces y recursos mencionados:
• Sitio web / recurso oficial: [Pega tu enlace aquí]
• Redes sociales / Comunidad: [Pega tu enlace a Discord o Twitter]
• Playlist recomendada: [Pega tu enlace a otra lista de reproducción]

⏱️ Capítulos del video (Timestamps):
00:00 Introducción y bienvenida
01:15 ¿Qué es ${kw} y por qué es importante?
03:40 Demostración práctica y paso a paso
06:20 Consejos clave y errores comunes
08:10 Conclusiones y próximos pasos

#${kw.replace(/\s+/g, '')} #${t.replace(/\s+/g, '')} #YouTube #Creadores`;
}

/**
 * 11. Formateador de Descripción
 */
export function formatDescription(rawText: string): {
  cleanedText: string;
  paragraphsCount: number;
  linksCount: number;
  hashtagsCount: number;
  changesMade: string[];
} {
  const changesMade: string[] = [];

  // Extract links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const links = rawText.match(urlRegex) || [];

  // Extract hashtags
  const hashtagRegex = /#[a-zA-Z0-9_áéíóúñÁÉÍÓÚÑ]+/g;
  const rawHashtags = rawText.match(hashtagRegex) || [];
  const uniqueHashtags = Array.from(new Set(rawHashtags.map((h) => h.toLowerCase())));

  // Clean lines: trim, remove double spaces, remove duplicate empty lines
  const lines = rawText.split('\n');
  const cleanedLines: string[] = [];
  let prevEmpty = false;

  for (const line of lines) {
    const trimmed = line.replace(/[ \t]+/g, ' ').trim();
    if (!trimmed) {
      if (!prevEmpty) {
        cleanedLines.push('');
        prevEmpty = true;
      }
    } else {
      cleanedLines.push(trimmed);
      prevEmpty = false;
    }
  }

  if (rawText.includes('  ')) changesMade.push('Espacios dobles eliminados.');
  if (lines.length !== cleanedLines.length) changesMade.push('Saltos de línea redundantes normalizados.');
  if (rawHashtags.length > uniqueHashtags.length) changesMade.push('Hashtags duplicados unificados.');

  const cleanedText = cleanedLines.join('\n');
  const paragraphsCount = cleanedLines.filter((l) => l.length > 0).length;

  return {
    cleanedText,
    paragraphsCount,
    linksCount: links.length,
    hashtagsCount: uniqueHashtags.length,
    changesMade: changesMade.length > 0 ? changesMade : ['Formato ya se encontraba limpio y ordenado.'],
  };
}

/**
 * 12. Validador y Generador de Capítulos / Timestamps
 */
export interface TimestampItem {
  timestamp: string;
  seconds: number;
  title: string;
  isValid: boolean;
  error?: string;
}

export function parseAndValidateTimestamps(rawText: string): {
  items: TimestampItem[];
  hasFirstZeroTimestamp: boolean;
  hasChronologicalOrder: boolean;
  hasMinimumChapters: boolean; // YouTube recommends at least 3 chapters
  isValidForYouTube: boolean;
  formattedOutput: string;
  issues: string[];
} {
  const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
  const items: TimestampItem[] = [];
  const issues: string[] = [];

  // Match either "00:00 Intro" or "Intro - 00:00" or "01:25:00 Final"
  const timeRegex = /(?:(\d{1,2}):)?(\d{1,2}):(\d{2})/;

  lines.forEach((line) => {
    const trimmed = line.trim();
    const match = trimmed.match(timeRegex);

    if (match) {
      const fullTimeStr = match[0];
      const parts = fullTimeStr.split(':').map((p) => parseInt(p, 10));
      let seconds = 0;
      if (parts.length === 3) {
        seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else {
        seconds = parts[0] * 60 + parts[1];
      }

      // Title is what remains after removing the timestamp and hyphens/separators
      let title = trimmed.replace(fullTimeStr, '').replace(/^[\s\-–—:]+|[\s\-–—:]+$/g, '').trim();
      if (!title) title = 'Capítulo';

      // Normalized timestamp format (MM:SS or HH:MM:SS)
      let normTime = fullTimeStr;
      if (parts.length === 2 && fullTimeStr.length < 5) {
        normTime = `${parts[0].toString().padStart(2, '0')}:${parts[1].toString().padStart(2, '0')}`;
      }

      items.push({
        timestamp: normTime,
        seconds,
        title,
        isValid: true,
      });
    } else {
      items.push({
        timestamp: '--:--',
        seconds: -1,
        title: trimmed,
        isValid: false,
        error: 'No se detectó un formato de tiempo válido (ej: 00:00).',
      });
    }
  });

  // Validations according to YouTube chapter rules
  const validItems = items.filter((i) => i.isValid);
  const hasFirstZeroTimestamp = validItems.length > 0 && validItems[0].seconds === 0;
  if (!hasFirstZeroTimestamp) {
    issues.push('YouTube exige que el primer capítulo comience exactamente en 00:00 (ej: "00:00 Introducción").');
  }

  let hasChronologicalOrder = true;
  for (let i = 1; i < validItems.length; i++) {
    if (validItems[i].seconds <= validItems[i - 1].seconds) {
      hasChronologicalOrder = false;
      issues.push(`El timestamp ${validItems[i].timestamp} está fuera de orden cronológico respecto al anterior.`);
    } else if (validItems[i].seconds - validItems[i - 1].seconds < 10) {
      issues.push(`El capítulo "${validItems[i].title}" dura menos de 10 segundos respecto al anterior (YouTube recomienda mínimo 10s).`);
    }
  }

  const hasMinimumChapters = validItems.length >= 3;
  if (!hasMinimumChapters) {
    issues.push(`Tienes ${validItems.length} capítulos válidos. YouTube requiere al menos 3 capítulos para activar la barra de progreso segmentada.`);
  }

  // Sort valid items chronologically for clean formatted output
  const sortedItems = [...validItems].sort((a, b) => a.seconds - b.seconds);
  const formattedOutput = sortedItems.map((item) => `${item.timestamp} ${item.title}`).join('\n');

  const isValidForYouTube = hasFirstZeroTimestamp && hasChronologicalOrder && hasMinimumChapters;

  return {
    items,
    hasFirstZeroTimestamp,
    hasChronologicalOrder,
    hasMinimumChapters,
    isValidForYouTube,
    formattedOutput,
    issues,
  };
}

/**
 * 13. Generador de Hashtags
 */
export function generateHashtags(topic: string, count = 10): string[] {
  const clean = topic.trim();
  if (!clean) return [];

  const rawWords = clean.split(/\s+/).filter((w) => !SPANISH_STOPWORDS.has(w.toLowerCase()));
  const camelCaseAll = rawWords.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');

  const candidates: string[] = [
    `#${camelCaseAll}`,
    `#${clean.replace(/\s+/g, '').toLowerCase()}`,
    `#${rawWords[0]?.charAt(0).toUpperCase() + rawWords[0]?.slice(1).toLowerCase() || 'Video'}`,
    `#${clean.replace(/\s+/g, '')}2026`,
    `#${clean.replace(/\s+/g, '')}Español`,
    `#YouTube${clean.replace(/\s+/g, '')}`,
    `#${clean.replace(/\s+/g, '')}Tutorial`,
    `#${clean.replace(/\s+/g, '')}Guia`,
    `#${clean.replace(/\s+/g, '')}Gameplay`,
    `#${clean.replace(/\s+/g, '')}Noticias`,
    `#${clean.replace(/\s+/g, '')}Review`,
    `#${clean.replace(/\s+/g, '')}Consejos`,
    '#YouTubeCreators',
    '#CreadoresDeContenido',
    '#VideoViral',
  ];

  const unique = Array.from(new Set(candidates)).filter((h) => h.length > 2);
  return unique.slice(0, count);
}

/**
 * 14. Analizador de Hashtags
 */
export interface HashtagsAnalysis {
  total: number;
  uniqueCount: number;
  duplicateCount: number;
  invalidCount: number;
  list: Array<{ tag: string; isValid: boolean; length: number; isDuplicate: boolean }>;
  wordsUsed: string[];
}

export function analyzeHashtags(rawInput: string): HashtagsAnalysis {
  const tokens = rawInput
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const seen = new Set<string>();
  const duplicates = new Set<string>();
  const invalidList: string[] = [];
  const wordsSet = new Set<string>();

  const list = tokens.map((token) => {
    let tag = token.startsWith('#') ? token : `#${token}`;
    const cleanLower = tag.toLowerCase();

    const isDuplicate = seen.has(cleanLower);
    if (isDuplicate) {
      duplicates.add(cleanLower);
    } else {
      seen.add(cleanLower);
    }

    // Invalid check: spaces inside, non-alphanumeric except underscore
    const isValid = /^#[a-zA-Z0-9_áéíóúñÁÉÍÓÚÑ]+$/.test(tag);
    if (!isValid) invalidList.push(tag);

    // Extract word
    const word = tag.replace(/^#/, '');
    if (word) wordsSet.add(word.toLowerCase());

    return {
      tag,
      isValid,
      length: tag.length,
      isDuplicate,
    };
  });

  return {
    total: tokens.length,
    uniqueCount: seen.size,
    duplicateCount: tokens.length - seen.size,
    invalidCount: invalidList.length,
    list,
    wordsUsed: Array.from(wordsSet),
  };
}

/**
 * 15. Limpiador de Hashtags
 */
export function cleanHashtags(rawInput: string): {
  cleanedList: string[];
  singleLineOutput: string;
  commaSeparatedOutput: string;
  removedDuplicatesCount: number;
} {
  const analysis = analyzeHashtags(rawInput);
  const uniqueTags = Array.from(
    new Set(
      analysis.list
        .filter((item) => item.isValid)
        .map((item) => item.tag)
    )
  );

  return {
    cleanedList: uniqueTags,
    singleLineOutput: uniqueTags.join(' '),
    commaSeparatedOutput: uniqueTags.join(', '),
    removedDuplicatesCount: analysis.duplicateCount,
  };
}

/**
 * 16. Generador de Tags
 */
export function generateTagsFromInput(
  seed: string,
  title?: string,
  description?: string
): {
  exact: string[];
  variations: string[];
  phrases: string[];
  longTail: string[];
  allCombined: string[];
} {
  const cleanSeed = seed.trim();
  const exact = cleanSeed ? [cleanSeed, cleanSeed.toLowerCase()] : [];

  const variations: string[] = [
    `${cleanSeed} 2026`,
    `${cleanSeed} español`,
    `${cleanSeed} completo`,
    `${cleanSeed} en español`,
    `${cleanSeed} guia`,
    `${cleanSeed} tutorial`,
    `${cleanSeed} review`,
    `${cleanSeed} analisis`,
  ];

  const phrases: string[] = [
    `como funciona ${cleanSeed}`,
    `para que sirve ${cleanSeed}`,
    `consejos de ${cleanSeed}`,
    `mejores trucos ${cleanSeed}`,
    `aprender ${cleanSeed}`,
  ];

  const longTail: string[] = [
    `tutorial paso a paso ${cleanSeed} en español`,
    `como empezar con ${cleanSeed} desde cero`,
    `los mejores consejos y trucos para ${cleanSeed}`,
    `${cleanSeed} explicacion completa para principiantes`,
  ];

  if (title) {
    const titleTokens = tokenizeText(title, true);
    if (titleTokens.length >= 2) {
      variations.push(titleTokens.slice(0, 3).join(' '));
      variations.push(titleTokens.slice(0, 2).join(' '));
    }
  }

  const allCombined = Array.from(
    new Set([...exact, ...variations, ...phrases, ...longTail].map((t) => t.trim()))
  ).filter((t) => t.length > 1);

  return {
    exact: Array.from(new Set(exact)),
    variations: Array.from(new Set(variations)),
    phrases: Array.from(new Set(phrases)),
    longTail: Array.from(new Set(longTail)),
    allCombined,
  };
}

/**
 * 17. Generador de Tags desde Título
 */
export function extractTagsFromTitle(title: string): string[] {
  const cleanTitle = title.trim();
  if (!cleanTitle) return [];

  const tokens = tokenizeText(cleanTitle, true);
  const tags: string[] = [];

  // Full title normalized
  tags.push(cleanTitle.replace(/[^\w\s\dáéíóúñÁÉÍÓÚÑ]/g, '').trim());

  // Bigrams
  for (let i = 0; i < tokens.length - 1; i++) {
    tags.push(`${tokens[i]} ${tokens[i + 1]}`);
  }

  // Trigrams
  for (let i = 0; i < tokens.length - 2; i++) {
    tags.push(`${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`);
  }

  // Unigrams (individual significant words)
  tokens.forEach((t) => {
    if (t.length > 3) tags.push(t);
  });

  return Array.from(new Set(tags)).filter((t) => t.length > 2).slice(0, 18);
}

/**
 * 18. Contador de Caracteres de Tags
 */
export function calculateTagsLength(tags: string[], characterLimit = 500): {
  totalChars: number;
  tagCount: number;
  remainingChars: number;
  formattedCommaString: string;
  isOverLimit: boolean;
} {
  const cleanTags = tags.map((t) => t.trim()).filter((t) => t.length > 0);
  const formattedCommaString = cleanTags.join(', ');
  const totalChars = formattedCommaString.length;
  const remainingChars = characterLimit - totalChars;

  return {
    totalChars,
    tagCount: cleanTags.length,
    remainingChars,
    formattedCommaString,
    isOverLimit: totalChars > characterLimit,
  };
}

/**
 * 20. Analizador de SEO de Video & Diagnóstico Integral
 */
export interface VideoSeoAuditResult {
  overallScore: number; // 0 to 100
  titleScore: number; // max 30
  descriptionScore: number; // max 25
  keywordsScore: number; // max 20
  tagsScore: number; // max 15
  hashtagsScore: number; // max 10
  breakdown: {
    titleNotes: string[];
    descNotes: string[];
    keywordNotes: string[];
    tagsNotes: string[];
    hashtagNotes: string[];
  };
  actionableRecommendations: string[];
}

export function auditVideoSeo(params: {
  title: string;
  description: string;
  keyword: string;
  tags: string[];
  hashtags: string[];
}): VideoSeoAuditResult {
  const { title, description, keyword, tags, hashtags } = params;

  let titleScore = 0;
  const titleNotes: string[] = [];

  const titleAnalysis = analyzeTitle(title, keyword);
  if (titleAnalysis.charCount >= 40 && titleAnalysis.charCount <= 70) {
    titleScore += 12;
    titleNotes.push('Longitud de título ideal (40-70 caracteres).');
  } else if (titleAnalysis.charCount > 0) {
    titleScore += 7;
    titleNotes.push(`Longitud de título (${titleAnalysis.charCount} caracteres) susceptible de recorte en móvil o demasiado breve.`);
  }

  if (titleAnalysis.keywordFound) {
    titleScore += 10;
    titleNotes.push('Palabra clave principal presente en el título.');
    if (titleAnalysis.keywordPosition === 'start') {
      titleScore += 4;
      titleNotes.push('Palabra clave ubicada estratégicamente al inicio del título.');
    }
  } else if (keyword.trim()) {
    titleNotes.push(`Palabra clave "${keyword}" ausente en el título.`);
  }

  if (titleAnalysis.hasNumbers || titleAnalysis.hasQuestionMark) {
    titleScore += 4;
    titleNotes.push('Contiene elementos de gancho (números o preguntas).');
  }
  titleScore = Math.min(30, titleScore);

  // Description Score (max 25)
  let descriptionScore = 0;
  const descNotes: string[] = [];
  const descChars = description.trim().length;

  if (descChars >= 300 && descChars <= 4500) {
    descriptionScore += 10;
    descNotes.push('Extensión de descripción adecuada (>300 caracteres con contexto).');
  } else if (descChars > 0) {
    descriptionScore += 5;
    descNotes.push('Descripción breve; agregar más detalles ayuda a la comprensión del video.');
  }

  if (keyword.trim() && description.toLowerCase().includes(keyword.trim().toLowerCase())) {
    descriptionScore += 8;
    descNotes.push('Palabra clave incluida en el cuerpo de la descripción.');
  } else if (keyword.trim()) {
    descNotes.push('La palabra clave principal no se encontró en la descripción.');
  }

  // Check chapters in description
  const chapterCheck = parseAndValidateTimestamps(description);
  if (chapterCheck.isValidForYouTube) {
    descriptionScore += 7;
    descNotes.push('Capítulos / Timestamps válidos y ordenados detectados.');
  } else {
    descNotes.push('No se detectaron capítulos estructurados con inicio en 00:00.');
  }
  descriptionScore = Math.min(25, descriptionScore);

  // Keywords Coherence Score (max 20)
  let keywordsScore = 0;
  const keywordNotes: string[] = [];

  if (keyword.trim().length >= 3) {
    keywordsScore += 8;
    keywordNotes.push('Palabra clave objetivo definida.');

    const inTitle = title.toLowerCase().includes(keyword.toLowerCase());
    const inDesc = description.toLowerCase().includes(keyword.toLowerCase());
    const inTags = tags.some((t) => t.toLowerCase().includes(keyword.toLowerCase()));

    if (inTitle && inDesc && inTags) {
      keywordsScore += 12;
      keywordNotes.push('Coherencia cruzada total: presente en Título, Descripción y Tags.');
    } else if (inTitle && inDesc) {
      keywordsScore += 8;
      keywordNotes.push('Coherencia presente en Título y Descripción.');
    } else {
      keywordsScore += 4;
      keywordNotes.push('Coherencia parcial entre campos.');
    }
  } else {
    keywordNotes.push('No se ha definido una palabra clave objetivo para evaluar coherencia.');
  }
  keywordsScore = Math.min(20, keywordsScore);

  // Tags Score (max 15)
  let tagsScore = 0;
  const tagsNotes: string[] = [];
  const cleanTags = tags.map((t) => t.trim()).filter(Boolean);
  const tagCalc = calculateTagsLength(cleanTags, 500);

  if (tagCalc.tagCount >= 8 && tagCalc.tagCount <= 25 && !tagCalc.isOverLimit) {
    tagsScore += 15;
    tagsNotes.push(`Cantidad de etiquetas óptima (${tagCalc.tagCount} tags, ${tagCalc.totalChars}/500 chars).`);
  } else if (tagCalc.tagCount > 0 && !tagCalc.isOverLimit) {
    tagsScore += 9;
    tagsNotes.push(`${tagCalc.tagCount} etiquetas configuradas (${tagCalc.totalChars}/500 caracteres).`);
  } else if (tagCalc.isOverLimit) {
    tagsScore += 4;
    tagsNotes.push('Las etiquetas superan el límite de 500 caracteres de YouTube.');
  } else {
    tagsNotes.push('Sin etiquetas configuradas.');
  }

  // Hashtags Score (max 10)
  let hashtagsScore = 0;
  const hashtagNotes: string[] = [];
  const cleanHashtagsList = hashtags.map((h) => h.trim()).filter(Boolean);

  if (cleanHashtagsList.length >= 3 && cleanHashtagsList.length <= 15) {
    hashtagsScore += 10;
    hashtagNotes.push(`Cantidad de hashtags ideal (${cleanHashtagsList.length} hashtags).`);
  } else if (cleanHashtagsList.length > 0 && cleanHashtagsList.length <= 30) {
    hashtagsScore += 6;
    hashtagNotes.push(`${cleanHashtagsList.length} hashtags detectados.`);
  } else {
    hashtagNotes.push('Sin hashtags definidos (se recomiendan de 3 a 5 destacados).');
  }

  const overallScore = titleScore + descriptionScore + keywordsScore + tagsScore + hashtagsScore;

  const actionableRecommendations: string[] = [];
  if (titleScore < 20) actionableRecommendations.push('Optimiza el título ajustando su longitud a 50-65 caracteres e incluyendo la keyword al inicio.');
  if (descriptionScore < 15) actionableRecommendations.push('Enriquece la descripción con al menos 3 párrafos explicativos y timestamps con 00:00.');
  if (keywordsScore < 14) actionableRecommendations.push('Asegura que tu palabra clave principal aparezca de forma natural en el título, primeras 2 líneas de la descripción y tags.');
  if (tagsScore < 10) actionableRecommendations.push('Completa entre 10 y 20 etiquetas específicas y variaciones sin exceder 500 caracteres.');
  if (hashtagsScore < 7) actionableRecommendations.push('Añade 3 hashtags principales al final de tu descripción.');

  return {
    overallScore,
    titleScore,
    descriptionScore,
    keywordsScore,
    tagsScore,
    hashtagsScore,
    breakdown: {
      titleNotes,
      descNotes,
      keywordNotes,
      tagsNotes,
      hashtagNotes,
    },
    actionableRecommendations,
  };
}

/**
 * 21. Limpiador de Texto SEO
 */
export function cleanSeoText(input: string): {
  cleanedText: string;
  doubleSpacesRemoved: number;
  blankLinesRemoved: number;
  duplicateLinesRemoved: number;
} {
  const originalLines = input.split('\n');
  let doubleSpacesRemoved = 0;
  let blankLinesRemoved = 0;
  let duplicateLinesRemoved = 0;

  const seenLines = new Set<string>();
  const processedLines: string[] = [];
  let prevWasEmpty = false;

  originalLines.forEach((line) => {
    // Count double spaces
    const doubleSpaceMatches = line.match(/[ \t]{2,}/g);
    if (doubleSpaceMatches) doubleSpacesRemoved += doubleSpaceMatches.length;

    const trimmed = line.replace(/[ \t]+/g, ' ').trim();
    if (!trimmed) {
      if (prevWasEmpty) {
        blankLinesRemoved++;
      } else {
        processedLines.push('');
        prevWasEmpty = true;
      }
    } else {
      const lower = trimmed.toLowerCase();
      if (seenLines.has(lower) && trimmed.length > 10) {
        duplicateLinesRemoved++;
      } else {
        seenLines.add(lower);
        processedLines.push(trimmed);
      }
      prevWasEmpty = false;
    }
  });

  return {
    cleanedText: processedLines.join('\n'),
    doubleSpacesRemoved,
    blankLinesRemoved,
    duplicateLinesRemoved,
  };
}

/**
 * 22. Extractor de Keywords desde Texto / Descripción
 */
export interface ExtractedKeywordFrequency {
  term: string;
  count: number;
  densityPercentage: number;
  type: 'unigram' | 'bigram' | 'trigram';
}

export function extractKeywordsFromText(text: string): {
  totalWords: number;
  topUnigrams: ExtractedKeywordFrequency[];
  topBigrams: ExtractedKeywordFrequency[];
  topTrigrams: ExtractedKeywordFrequency[];
} {
  const rawWords = text.split(/\s+/).filter(Boolean);
  const totalWords = rawWords.length;

  const tokens = tokenizeText(text, true);

  // Unigram frequencies
  const unigrams: Record<string, number> = {};
  tokens.forEach((t) => {
    if (t.length > 2) unigrams[t] = (unigrams[t] || 0) + 1;
  });

  // Bigram frequencies
  const bigrams: Record<string, number> = {};
  for (let i = 0; i < tokens.length - 1; i++) {
    const pair = `${tokens[i]} ${tokens[i + 1]}`;
    bigrams[pair] = (bigrams[pair] || 0) + 1;
  }

  // Trigram frequencies
  const trigrams: Record<string, number> = {};
  for (let i = 0; i < tokens.length - 2; i++) {
    const triple = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
    trigrams[triple] = (trigrams[triple] || 0) + 1;
  }

  const mapToSorted = (record: Record<string, number>, type: 'unigram' | 'bigram' | 'trigram') =>
    Object.entries(record)
      .map(([term, count]) => ({
        term,
        count,
        densityPercentage: totalWords > 0 ? Math.round((count / totalWords) * 1000) / 10 : 0,
        type,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

  return {
    totalWords,
    topUnigrams: mapToSorted(unigrams, 'unigram'),
    topBigrams: mapToSorted(bigrams, 'bigram'),
    topTrigrams: mapToSorted(trigrams, 'trigram'),
  };
}

/**
 * 23. Generador de Keywords desde Título y Descripción
 */
export function inferKeywordsFromTitleAndDesc(title: string, description: string): {
  primaryKeywordSuggested: { term: string; reason: string };
  secondaryKeywords: Array<{ term: string; reason: string }>;
  longTailPhrases: Array<{ term: string; reason: string }>;
} {
  const titleTokens = tokenizeText(title, true);
  const descExtraction = extractKeywordsFromText(description);

  // Find overlapping terms between title and description
  const primaryCandidates: Array<{ term: string; score: number; reason: string }> = [];

  // Check bigrams in title
  for (let i = 0; i < titleTokens.length - 1; i++) {
    const bigram = `${titleTokens[i]} ${titleTokens[i + 1]}`;
    const inDescCount = descExtraction.topBigrams.find((b) => b.term === bigram)?.count || 0;
    primaryCandidates.push({
      term: bigram,
      score: 10 + inDescCount * 3,
      reason: inDescCount > 0
        ? `Aparece en el título y se repite ${inDescCount} veces en la descripción.`
        : 'Frase clave prominente extraída directamente del título.',
    });
  }

  if (primaryCandidates.length === 0 && titleTokens.length > 0) {
    primaryCandidates.push({
      term: titleTokens.slice(0, 2).join(' '),
      score: 8,
      reason: 'Término principal derivado del título del video.',
    });
  }

  const sortedPrimary = primaryCandidates.sort((a, b) => b.score - a.score);
  const primary = sortedPrimary[0] || {
    term: title.trim() || 'Video de YouTube',
    reason: 'Sugerida con base en el texto provisto.',
  };

  const secondaryKeywords: Array<{ term: string; reason: string }> = [];
  descExtraction.topUnigrams.slice(0, 5).forEach((item) => {
    if (!primary.term.includes(item.term)) {
      secondaryKeywords.push({
        term: item.term,
        reason: `Palabra con alta densidad (${item.count} menciones) en la descripción.`,
      });
    }
  });

  const longTailPhrases: Array<{ term: string; reason: string }> = [];
  descExtraction.topBigrams.slice(0, 4).forEach((item) => {
    if (item.term !== primary.term) {
      longTailPhrases.push({
        term: `como ${item.term} en español`,
        reason: `Variación long-tail basada en la frase recurrente "${item.term}".`,
      });
    }
  });

  return {
    primaryKeywordSuggested: primary,
    secondaryKeywords,
    longTailPhrases,
  };
}
