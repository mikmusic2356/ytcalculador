import React, { useState, useEffect, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { CookieBanner } from './components/CookieBanner';
import { SEOHead } from './components/SEOHead';
import { HomePage } from './pages/HomePage';
import { ToolRegistry } from './services/toolRegistry';
import { CALCULATORS } from './data/calculators';
import { IMAGE_TOOLS } from './data/imageToolsData';
import { SEO_TOOLS } from './data/seoToolsData';
import { GUIDES } from './data/guides';

// Lazy-loaded routes for code splitting and instant initial FCP/LCP
const CalculatorsDirectory = React.lazy(() =>
  import('./pages/CalculatorsDirectory').then((m) => ({ default: m.CalculatorsDirectory }))
);
const GuidesPage = React.lazy(() =>
  import('./pages/GuidesPage').then((m) => ({ default: m.GuidesPage }))
);
const LegalPage = React.lazy(() =>
  import('./pages/LegalPages').then((m) => ({ default: m.LegalPage }))
);
const ImagesPage = React.lazy(() =>
  import('./pages/ImagesPage').then((m) => ({ default: m.ImagesPage }))
);
const SeoPage = React.lazy(() =>
  import('./pages/SeoPage').then((m) => ({ default: m.SeoPage }))
);
const CalculatorEngine = React.lazy(() =>
  import('./components/CalculatorEngine').then((m) => ({ default: m.CalculatorEngine }))
);
const AdminDashboard = React.lazy(() =>
  import('./components/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const NotFoundPage = React.lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

const PageLoadingFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center p-8">
    <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Automatic 301 redirection handling
  useEffect(() => {
    const cleanPath = currentPath.split('?')[0].replace(/\/+$/, '') || '/';
    const redirectTarget = ToolRegistry.getRedirectForRoute(cleanPath);
    if (redirectTarget && redirectTarget !== cleanPath) {
      window.history.replaceState({}, '', redirectTarget);
      setCurrentPath(redirectTarget);
    }
  }, [currentPath]);

  // Sync with browser back/forward history and database
  useEffect(() => {
    ToolRegistry.syncFromDatabase();
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation helper that updates history without page refresh
  const navigate = (path: string) => {
    let cleanPath = path;
    if (!cleanPath.startsWith('/')) {
      cleanPath = `/${cleanPath}`;
    }

    // Check for 301 redirection
    const redirectTarget = ToolRegistry.getRedirectForRoute(cleanPath);
    const finalPath = redirectTarget || cleanPath;

    window.history.pushState({}, '', finalPath);
    setCurrentPath(finalPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTool = (slug: string) => {
    if (slug === 'todas') {
      navigate('/calculadoras');
    } else {
      navigate(`/${slug}`);
    }
  };

  // Resolve current active calculator if on a tool slug route
  const cleanCurrentPath = currentPath.split('?')[0].replace(/\/+$/, '') || '/';
  const pathSegments = cleanCurrentPath.replace(/^\//, '').split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1] || '';
  const firstSegment = pathSegments[0] || '';

  // 1. First check directly in ToolRegistry
  const registeredTool = ToolRegistry.getByRoute(cleanCurrentPath);

  // Alias mapping for SEO friendly alternative URLs
  const SLUG_ALIASES: Record<string, string> = {
    'calculadora-vistas-para-ganar-100': 'vistas-para-ganar-100-dolares',
    'calculadora-vistas-para-ganar-500': 'vistas-para-ganar-500-dolares',
    'calculadora-vistas-para-ganar-1000': 'vistas-para-ganar-1000-dolares',
    'comparador-rpm-paises': 'comparador-rpm-pais',
    'calculadora-vistas-shorts': 'calculadora-vistas-shorts-ingresos',
    'calculadora-ingresos-mensuales-youtube': 'calculadora-ingresos-mensuales',
    'calculadora-ingresos-anuales-youtube': 'calculadora-ingresos-anuales',
    'calculadora-ctr': 'calculadora-ctr-youtube',
    'calculadora-retencion': 'calculadora-retencion-youtube',
    'calculadora-watch-time': 'calculadora-watch-time-youtube',
    'calculadora-horas-reproduccion': 'calculadora-watch-time-youtube',
    'calculadora-duracion-media-youtube': 'calculadora-duracion-media-visualizacion',
    'calculadora-suscriptores-youtube': 'calculadora-conversion-suscriptores',
    'calculadora-crecimiento-youtube': 'calculadora-crecimiento-porcentual',
    'proyeccion-canal-youtube': 'proyeccion-crecimiento-canal',
    'comparador-videos': 'comparador-videos-youtube',
    'comparador-periodos': 'comparador-periodos-youtube',
    'comparador-metricas': 'comparador-metricas-youtube',
    'comparador-rendimiento': 'comparador-rendimiento-youtube',
    // Video and Production aliases
    'calculadora-bitrate-youtube': 'calculadora-bitrate',
    'calculadora-tamano-archivo-video': 'calculadora-tamano-video',
    'calculadora-duracion': 'calculadora-duracion-video',
    'calculadora-fps': 'calculadora-fps-video',
    'calculadora-frames': 'calculadora-frames-video',
    'calculadora-compresion': 'calculadora-compresion-video',
    'calculadora-relacion-aspecto-video': 'calculadora-relacion-aspecto',
    'calculadora-aspecto-16-9': 'calculadora-16-9',
    'calculadora-shorts-9-16': 'calculadora-9-16',
    'calculadora-aspecto-4-3': 'calculadora-4-3',
    'calculadora-escalado': 'calculadora-escalado-video',
    'calculadora-dimensiones': 'calculadora-dimensiones-video',
    'calculadora-espacio-video': 'calculadora-espacio-necesario',
    'calculadora-horas-grabacion': 'calculadora-tiempo-grabacion',
    'calculadora-almacenamiento-grabacion': 'calculadora-almacenamiento-video',
    'calculadora-duracion-segun-frames': 'calculadora-duracion-frames',
    'conversor-tiempo-edicion': 'conversor-timecode',
  };

  const resolvedSlug =
    SLUG_ALIASES[lastSegment] ||
    SLUG_ALIASES[firstSegment] ||
    lastSegment ||
    firstSegment;

  const activeTool =
    CALCULATORS.find((c) => c.slug === resolvedSlug) ||
    CALCULATORS.find((c) => c.slug === firstSegment);

  // Resolve current image tool if on an image tool slug
  const activeImageTool =
    IMAGE_TOOLS.find((t) => t.slug === resolvedSlug) ||
    IMAGE_TOOLS.find((t) => t.slug === lastSegment) ||
    (firstSegment === 'imagenes' && IMAGE_TOOLS.find((t) => t.slug === lastSegment));

  // Resolve current SEO tool if on an SEO tool slug
  const activeSeoTool =
    SEO_TOOLS.find((t) => t.slug === resolvedSlug) ||
    SEO_TOOLS.find((t) => t.slug === lastSegment) ||
    (firstSegment === 'seo' && SEO_TOOLS.find((t) => t.slug === lastSegment));

  // Resolve current guide if on a guide slug
  const activeGuide =
    GUIDES.find((g) => g.slug === resolvedSlug || g.slug === lastSegment || g.slug === firstSegment);

  // Static/hub routes known
  const isKnownRoute =
    cleanCurrentPath === '/' ||
    cleanCurrentPath === '/calculadoras' ||
    cleanCurrentPath === '/categorias' ||
    cleanCurrentPath === '/imagenes' ||
    cleanCurrentPath.startsWith('/imagenes/') ||
    cleanCurrentPath === '/seo' ||
    cleanCurrentPath.startsWith('/seo/') ||
    cleanCurrentPath === '/guias' ||
    cleanCurrentPath.startsWith('/guias/') ||
    cleanCurrentPath === '/admin' ||
    cleanCurrentPath === '/politica-privacidad' ||
    cleanCurrentPath === '/politica-cookies' ||
    cleanCurrentPath === '/terminos' ||
    cleanCurrentPath === '/sobre-nosotros' ||
    cleanCurrentPath === '/contacto' ||
    Boolean(registeredTool) ||
    Boolean(activeTool) ||
    Boolean(activeImageTool) ||
    Boolean(activeSeoTool) ||
    Boolean(activeGuide);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] dark:bg-[#0F0F0F] text-[#212121] dark:text-[#F1F1F1] font-sans antialiased selection:bg-[#FF0000] selection:text-white transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={handleSelectTool}
      />

      {/* Main Dynamic View Routing */}
      <main className="flex-1">
        <Suspense fallback={<PageLoadingFallback />}>
          {/* 1. Admin Dashboard */}
          {cleanCurrentPath === '/admin' ? (
            <>
              <SEOHead
                title="Panel Administrativo"
                description="Dashboard de métricas, telemetría y configuración del sistema YouTubeCalculador."
              />
              <AdminDashboard onExit={() => navigate('/')} />
            </>
          ) : activeTool ? (
            /* 2. Dynamic Calculator View */
            <>
              <SEOHead
                title={activeTool.seo.title}
                description={activeTool.seo.metaDescription}
                route={`/${activeTool.slug}`}
                faqs={activeTool.seo.faqs}
                howToSteps={activeTool.seo.howToSteps}
                toolName={activeTool.name}
              />
              <CalculatorEngine tool={activeTool} onNavigateTool={handleSelectTool} />
            </>
          ) : cleanCurrentPath.startsWith('/imagenes') || activeImageTool ? (
            /* 3. Image Assistant Suite (100% Local) */
            <ImagesPage
              currentPath={activeImageTool ? `/imagenes/${activeImageTool.slug}` : cleanCurrentPath}
              onNavigate={navigate}
            />
          ) : cleanCurrentPath.startsWith('/seo') || activeSeoTool ? (
            /* 4. YouTube SEO Suite (23 Local Text & Metadata Tools) */
            <SeoPage
              currentPath={activeSeoTool ? `/seo/${activeSeoTool.slug}` : cleanCurrentPath}
              onNavigate={navigate}
            />
          ) : cleanCurrentPath === '/calculadoras' || cleanCurrentPath === '/categorias' ? (
            /* 5. Full Calculators Directory */
            <>
              <SEOHead
                title="Todas las Calculadoras para YouTube (100% Gratuitas)"
                description="Directorio con todas las herramientas de cálculo de ingresos, RPM, CPM, CTR, horas de reproducción y optimización técnica para creadores de YouTube."
              />
              <CalculatorsDirectory onNavigateTool={handleSelectTool} />
            </>
          ) : cleanCurrentPath === '/guias' || activeGuide || cleanCurrentPath.startsWith('/guias/') ? (
            /* 6. Creator Strategy Guides */
            <>
              <SEOHead
                title={activeGuide ? `${activeGuide.title} - Guía para Creadores` : 'Guías y Estrategias para Creadores de YouTube'}
                description={
                  activeGuide
                    ? activeGuide.summary
                    : 'Aprende a escalar tu canal de YouTube, aumentar tu RPM y diseñar miniaturas de alto impacto.'
                }
                route={activeGuide ? `/guias/${activeGuide.slug}` : '/guias'}
              />
              <GuidesPage
                onNavigateTool={handleSelectTool}
                onNavigateGuide={navigate}
                initialGuideSlug={activeGuide?.slug || null}
              />
            </>
          ) : cleanCurrentPath === '/politica-privacidad' ? (
            <>
              <SEOHead
                title="Política de Privacidad"
                description="Política de privacidad y protección de datos anónima de YouTubeCalculador."
              />
              <LegalPage type="privacidad" />
            </>
          ) : cleanCurrentPath === '/politica-cookies' ? (
            <>
              <SEOHead
                title="Política de Cookies"
                description="Información detallada sobre las cookies técnicas, de analítica y de Google AdSense utilizadas en YouTubeCalculador."
              />
              <LegalPage type="cookies" />
            </>
          ) : cleanCurrentPath === '/terminos' ? (
            <>
              <SEOHead
                title="Términos y Condiciones"
                description="Términos de servicio y condiciones de uso de las calculadoras para YouTube."
              />
              <LegalPage type="terminos" />
            </>
          ) : cleanCurrentPath === '/sobre-nosotros' ? (
            <>
              <SEOHead
                title="Sobre Nosotros"
                description="Conoce la misión de YouTubeCalculador: democratizar las herramientas analíticas para todos los creadores de YouTube."
              />
              <LegalPage type="sobre-nosotros" />
            </>
          ) : cleanCurrentPath === '/contacto' ? (
            <>
              <SEOHead
                title="Contacto y Sugerencias"
                description="Envía tus preguntas o sugiere nuevas calculadoras para el equipo de YouTubeCalculador."
              />
              <LegalPage type="contacto" />
            </>
          ) : cleanCurrentPath === '/' ? (
            /* 7. Homepage */
            <>
              <SEOHead
                title="Calculadoras y Herramientas Gratuitas para YouTube"
                description="Calcula tus ingresos, RPM, CPM, CTR, horas de reproducción y optimiza tu canal de YouTube gratis y sin registro."
              />
              <HomePage onNavigateTool={handleSelectTool} onOpenSearch={() => setIsSearchOpen(true)} />
            </>
          ) : (
            /* 8. Custom 404 Page (Fallback) */
            <NotFoundPage onNavigate={navigate} onOpenSearch={() => setIsSearchOpen(true)} />
          )}
        </Suspense>
      </main>

      {/* Persistent Footer */}
      <Footer onNavigate={navigate} />

      {/* Privacy & Cookie Consent Banner */}
      <CookieBanner />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

