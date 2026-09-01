import React from 'react';
import { Heart, ShieldCheck, ExternalLink, Lock } from 'lucide-react';
import { CALCULATORS } from '../data/calculators';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#212121] text-gray-400 border-t border-gray-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-gray-800">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FF0000] flex items-center justify-center text-white font-black text-sm shadow-xs">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                YouTube<span className="text-[#FF0000]">Calculador</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Plataforma libre y gratuita con herramientas analíticas, calculadoras de ingresos y optimización de
              rendimiento para creadores de contenido y YouTubers.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>Todas las calculadoras actualizadas a 2026</span>
            </div>
          </div>

          {/* Col 2: Popular Calculators */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Calculadoras Populares</h4>
            <ul className="space-y-1 text-xs">
              {CALCULATORS.slice(0, 5).map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => onNavigate(`/${tool.slug}`)}
                    className="hover:text-white transition-colors text-left cursor-pointer py-1 block w-full text-gray-400 hover:text-white"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Video & SEO Tools */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Herramientas & SEO</h4>
            <ul className="space-y-1 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/seo')}
                  className="text-red-400 hover:text-red-300 font-bold transition-colors text-left cursor-pointer flex items-center gap-1 py-1 block w-full"
                >
                  <span>SEO para YouTube (23)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/imagenes')}
                  className="text-gray-300 hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1 py-1 block w-full"
                >
                  <span>Asistente de Imágenes (17)</span>
                </button>
              </li>
              {CALCULATORS.slice(0, 4).map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => onNavigate(`/${tool.slug}`)}
                    className="hover:text-white transition-colors text-left cursor-pointer py-1 block w-full text-gray-400"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => onNavigate('/guias')} className="text-gray-400 hover:text-white font-medium cursor-pointer py-1 block w-full text-left">
                  Guías para Creadores →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Legal */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legal & Privacidad</h4>
            <ul className="space-y-1 text-xs">
              <li>
                <button onClick={() => onNavigate('/politica-privacidad')} className="hover:text-white transition-colors cursor-pointer py-1 block w-full text-left text-gray-400">
                  Política de Privacidad
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/politica-cookies')} className="hover:text-white transition-colors cursor-pointer py-1 block w-full text-left text-gray-400">
                  Política de Cookies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terminos')} className="hover:text-white transition-colors cursor-pointer py-1 block w-full text-left text-gray-400">
                  Términos y Condiciones
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/sobre-nosotros')} className="hover:text-white transition-colors cursor-pointer py-1 block w-full text-left text-gray-400">
                  Sobre Nosotros
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contacto')} className="hover:text-white transition-colors cursor-pointer py-1 block w-full text-left text-gray-400">
                  Contacto y Sugerencias
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="text-center md:text-left text-[11px] leading-relaxed max-w-2xl">
            <strong>Aviso de exención de responsabilidad:</strong> YouTubeCalculador es un recurso web independiente no oficial. YouTube™ y el logotipo de YouTube son marcas comerciales registradas de Google LLC. Este sitio web no está afiliado, respaldado ni administrado por YouTube ni por Google.
          </p>
          <div className="flex items-center gap-2 text-[11px] shrink-0 text-gray-400">
            <span>© {new Date().getFullYear()} YouTubeCalculador. Todos los derechos reservados.</span>
            <button
              onClick={() => onNavigate('/admin')}
              className="text-gray-600 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-300 p-1 rounded transition-colors cursor-pointer opacity-70 hover:opacity-100"
              title="Acceso administrativo"
              aria-label="Acceso administrativo"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
