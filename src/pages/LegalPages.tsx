import React, { useState } from 'react';
import { ShieldCheck, FileText, Info, Mail, Send, CheckCircle2, Heart } from 'lucide-react';
import { saveCookiePreferences, getStoredCookiePreferences } from '../components/CookieBanner';

interface LegalPageProps {
  type: 'privacidad' | 'cookies' | 'terminos' | 'sobre-nosotros' | 'contacto';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Sugerencia de nueva calculadora',
    message: '',
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <div id="legal-content-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Política de Privacidad */}
      {type === 'privacidad' && (
        <div className="bg-white dark:bg-[#1F1F1F] p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-[#2F2F2F] shadow-xs space-y-6 text-[#212121] dark:text-zinc-200 text-sm leading-relaxed">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-[#2F2F2F] pb-4">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-950/40 text-[#FF0000] dark:text-[#FF4E45] rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#212121] dark:text-white">Política de Privacidad</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">Última actualización: 1 de Enero de 2026</p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#212121] dark:text-white">1. Compromiso con la Privacidad</h2>
            <p className="text-gray-600 dark:text-zinc-300">
              En <strong>YouTubeCalculador</strong> respetamos y protegemos la privacidad de todos nuestros usuarios.
              Nuestra plataforma funciona bajo el principio de <em>"Privacy-First"</em>: los cálculos numéricos se procesan
              en el navegador del cliente y no solicitamos cuentas bancarias, credenciales de inicio de sesión de YouTube ni
              claves privadas.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#212121] dark:text-white">2. Datos Recopilados</h2>
            <p className="text-gray-600 dark:text-zinc-300">
              Recopilamos únicamente datos técnicos y telemetría disociada y agregada (como número de veces que se utiliza
              una calculadora específica o páginas visitadas) para optimizar el rendimiento y la velocidad del sitio.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#212121] dark:text-white">3. Publicidad y Google AdSense</h2>
            <p className="text-gray-600 dark:text-zinc-300">
              YouTubeCalculador se financia a través de anuncios publicitarios suministrados por Google AdSense. Google y sus
              socios pueden utilizar cookies para publicar anuncios basados en las visitas previas de los usuarios a este u
              otros sitios web. Puedes gestionar tus preferencias de cookies en cualquier momento desde nuestro banner de
              configuración.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#212121] dark:text-white">4. Derechos del Usuario (RGPD y CCPA)</h2>
            <p className="text-gray-600 dark:text-zinc-300">
              Cualquier usuario tiene derecho a solicitar información sobre el tratamiento de datos o solicitar la eliminación
              de datos temporales de almacenamiento local desde su propio navegador web.
            </p>
          </section>
        </div>
      )}

      {/* 2. Política de Cookies */}
      {type === 'cookies' && (
        <div className="bg-white dark:bg-[#1F1F1F] p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-[#2F2F2F] shadow-xs space-y-6 text-[#212121] dark:text-zinc-200 text-sm leading-relaxed">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-[#2F2F2F] pb-4">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-950/40 text-[#FF0000] dark:text-[#FF4E45] rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#212121] dark:text-white">Política de Cookies</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">Gestión y transparencia de cookies</p>
            </div>
          </div>

          <p className="text-gray-600 dark:text-zinc-300">
            Una cookie es un pequeño archivo de texto que un sitio web almacena en tu dispositivo para recordar tus
            preferencias.
          </p>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#212121] dark:text-white">Tipos de Cookies que utilizamos:</h2>
            <ul className="space-y-2 list-disc pl-5 text-gray-600 dark:text-zinc-300">
              <li>
                <strong>Cookies Técnicas / Esenciales:</strong> Necesarias para recordar el estado de tus fórmulas, inputs y
                preferencias de privacidad.
              </li>
              <li>
                <strong>Cookies de Analítica:</strong> Nos permiten medir de forma 100% anónima el volumen de cálculos
                ejecutados.
              </li>
              <li>
                <strong>Cookies Publicitarias (AdSense):</strong> Utilizadas por Google para servir anuncios contextuales y
                relevantes.
              </li>
            </ul>
          </section>

          <div className="p-4 bg-gray-50 dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-[#2F2F2F] flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300">¿Deseas modificar tus preferencias actuales?</span>
            <button
              onClick={() => {
                const prefs = getStoredCookiePreferences();
                saveCookiePreferences({ ...prefs, saved: false });
                window.location.reload();
              }}
              className="px-3.5 py-1.5 bg-[#FF0000] text-white text-xs font-bold rounded-lg hover:bg-[#E60000] cursor-pointer shadow-xs"
            >
              Abrir Configurador
            </button>
          </div>
        </div>
      )}

      {/* 3. Términos y Condiciones */}
      {type === 'terminos' && (
        <div className="bg-white dark:bg-[#1F1F1F] p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-[#2F2F2F] shadow-xs space-y-6 text-[#212121] dark:text-zinc-200 text-sm leading-relaxed">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-[#2F2F2F] pb-4">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-950/40 text-[#FF0000] dark:text-[#FF4E45] rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#212121] dark:text-white">Términos y Condiciones de Uso</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">Condiciones del servicio y estimaciones</p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#212121] dark:text-white">1. Naturaleza Estimativa</h2>
            <p className="text-gray-600 dark:text-zinc-300">
              Todas las calculadoras y herramientas de <strong>YouTubeCalculador</strong> ofrecen simulaciones y
              estimaciones matemáticas basadas en modelos estándar y promedios del mercado. Los ingresos reales de un
              canal de YouTube dependen de factores dinámicos como la estacionalidad publicitaria (Q4 vs Q1), subastas de
              Google Ads, país de la audiencia, categoría de contenido y tasas de bloqueo de anuncios.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#212121] dark:text-white">2. Exención de Marcas Comerciales</h2>
            <p className="text-gray-600 dark:text-zinc-300">
              YouTube™ es una marca comercial de Google LLC. YouTubeCalculador no está respaldado, patrocinado ni vinculado
              contractualmente a Google LLC ni a YouTube.
            </p>
          </section>
        </div>
      )}

      {/* 4. Sobre Nosotros */}
      {type === 'sobre-nosotros' && (
        <div className="bg-white dark:bg-[#1F1F1F] p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-[#2F2F2F] shadow-xs space-y-6 text-[#212121] dark:text-zinc-200 text-sm leading-relaxed">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-[#2F2F2F] pb-4">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-950/40 text-[#FF0000] dark:text-[#FF4E45] rounded-lg flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#212121] dark:text-white">Sobre YouTubeCalculador</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">Herramientas profesionales creadas para creadores</p>
            </div>
          </div>

          <p className="text-sm font-semibold text-[#212121] dark:text-white">
            Nacimos con una misión simple: democratizar el acceso a herramientas analíticas de alta precisión para todos
            los creadores de YouTube en español y a nivel global.
          </p>

          <p className="text-gray-600 dark:text-zinc-300">
            Muchos creadores dedican cientos de horas a planificar videos sin saber con claridad cuánto ganarán por cada mil
            visitas, qué bitrate necesitan para evitar la compresión de YouTube o cuántos días les tomará alcanzar las 4.000
            horas de reproducción para el YPP.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-gray-50 dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-[#2F2F2F]">
              <h4 className="font-bold text-[#212121] dark:text-white text-xs mb-1">100% Gratis</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sin muros de pago, sin suscripciones obligatorias.</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-[#2F2F2F]">
              <h4 className="font-bold text-[#212121] dark:text-white text-xs mb-1">Fórmulas Precisas</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Modelos matemáticos documentados paso a paso.</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#141414] rounded-xl border border-gray-200 dark:border-[#2F2F2F]">
              <h4 className="font-bold text-[#212121] dark:text-white text-xs mb-1">Privacidad Total</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tus datos numéricos no salen de tu navegador.</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. Contacto */}
      {type === 'contacto' && (
        <div className="bg-white dark:bg-[#1F1F1F] p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-[#2F2F2F] shadow-xs space-y-6 text-[#212121] dark:text-zinc-200 text-sm leading-relaxed">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-[#2F2F2F] pb-4">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-950/40 text-[#FF0000] dark:text-[#FF4E45] rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#212121] dark:text-white">Contacto y Sugerencias</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">¿Tienes una idea para una nueva calculadora o encontraste un error?</p>
            </div>
          </div>

          {contactSubmitted ? (
            <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-300">¡Mensaje recibido con éxito!</h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
                Gracias por ponerte en contacto. Nuestro equipo revisa periódicamente las sugerencias de la comunidad para
                crear nuevas herramientas útiles.
              </p>
              <button
                onClick={() => setContactSubmitted(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 max-w-xl">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#212121] dark:text-zinc-200">Tu Nombre o Canal</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="ej. Carlos Creador"
                  className="w-full px-3.5 py-2 bg-gray-100 dark:bg-[#141414] border border-transparent dark:border-[#383838] rounded-lg text-xs font-medium text-[#212121] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-[#FF0000] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#212121] dark:text-zinc-200">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="ej. contacto@micorreo.com"
                  className="w-full px-3.5 py-2 bg-gray-100 dark:bg-[#141414] border border-transparent dark:border-[#383838] rounded-lg text-xs font-medium text-[#212121] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-[#FF0000] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#212121] dark:text-zinc-200">Asunto</label>
                <select
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-100 dark:bg-[#141414] border border-transparent dark:border-[#383838] rounded-lg text-xs font-medium text-[#212121] dark:text-white focus:ring-2 focus:ring-[#FF0000] outline-none"
                >
                  <option value="Sugerencia de nueva calculadora">Sugerencia de nueva calculadora</option>
                  <option value="Reporte de error o fórmula">Reporte de error o fórmula</option>
                  <option value="Propuesta de colaboración">Propuesta de colaboración</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#212121] dark:text-zinc-200">Mensaje</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Explícanos tu duda o la fórmula de la herramienta que te gustaría ver en YouTubeCalculador..."
                  className="w-full px-3.5 py-2 bg-gray-100 dark:bg-[#141414] border border-transparent dark:border-[#383838] rounded-lg text-xs font-medium text-[#212121] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-[#FF0000] outline-none"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 bg-[#FF0000] hover:bg-[#E60000] text-white font-bold text-xs rounded-full transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Enviar Mensaje
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
