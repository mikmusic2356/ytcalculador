import React, { useEffect, useState } from 'react';
import { ShieldCheck, Settings, X, Check } from 'lucide-react';
import { CookiePreferences } from '../types';
import { CookieManager } from '../utils/cookies';

const COOKIE_STORAGE_KEY = 'ytcalc_cookie_consent_v1';

export const getStoredCookiePreferences = (): CookiePreferences => {
  try {
    const fromCookie = CookieManager.get(COOKIE_STORAGE_KEY);
    if (fromCookie) {
      return JSON.parse(fromCookie);
    }
    const saved = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return {
    necessary: true,
    analytics: false,
    advertising: false,
    saved: false,
  };
};

export const saveCookiePreferences = (prefs: CookiePreferences) => {
  try {
    const serialized = JSON.stringify({ ...prefs, saved: true });
    localStorage.setItem(COOKIE_STORAGE_KEY, serialized);
    CookieManager.set(COOKIE_STORAGE_KEY, serialized, { days: 365 });
  } catch {
    // ignore
  }
};

export const CookieBanner: React.FC<{ onOpenPreferences?: () => void }> = () => {
  const [prefs, setPrefs] = useState<CookiePreferences>(getStoredCookiePreferences());
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const current = getStoredCookiePreferences();
    if (!current.saved) {
      setIsOpen(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const all = {
      necessary: true,
      analytics: true,
      advertising: true,
      saved: true,
    };
    setPrefs(all);
    saveCookiePreferences(all);
    setIsOpen(false);
    setShowModal(false);

    // Persist consent to Turso DB
    try {
      const visitorId = CookieManager.getOrCreateVisitorId();
      fetch('/api/cookies/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          consentType: 'all',
          necessary: true,
          analytics: true,
          advertising: true,
        }),
      }).catch(() => {});
    } catch {
      // Ignore
    }
  };

  const handleRejectNonEssential = () => {
    const essentialOnly = {
      necessary: true,
      analytics: false,
      advertising: false,
      saved: true,
    };
    setPrefs(essentialOnly);
    saveCookiePreferences(essentialOnly);
    setIsOpen(false);
    setShowModal(false);

    // Persist rejection of optional cookies to Turso DB
    try {
      const visitorId = CookieManager.getOrCreateVisitorId();
      fetch('/api/cookies/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          consentType: 'essential_only',
          necessary: true,
          analytics: false,
          advertising: false,
        }),
      }).catch(() => {});
    } catch {
      // Ignore
    }
  };

  const handleSaveCustom = (custom: CookiePreferences) => {
    setPrefs(custom);
    saveCookiePreferences(custom);
    setIsOpen(false);
    setShowModal(false);

    // Persist custom consent to Turso DB
    try {
      const visitorId = CookieManager.getOrCreateVisitorId();
      fetch('/api/cookies/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          consentType: 'custom',
          necessary: custom.necessary,
          analytics: custom.analytics,
          advertising: custom.advertising,
        }),
      }).catch(() => {});
    } catch {
      // Ignore
    }
  };

  return (
    <>
      {/* Quick Banner on first visit */}
      {isOpen && !showModal && (
        <div
          id="cookie-banner"
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#212121]/95 text-white backdrop-blur-sm border-t border-gray-800 shadow-2xl transition-all"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-600/20 text-[#FF0000] rounded-lg shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-sm text-gray-300">
                <p className="font-bold text-white mb-0.5">Privacidad y Cookies en YouTubeCalculador</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Utilizamos cookies técnicas necesarias para el funcionamiento de las herramientas y cookies de analítica
                  anónima para medir el uso de las calculadoras y preparar el servicio para monetización con AdSense.
                  Puedes aceptar todas o personalizar tu consentimiento.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
              <button
                id="btn-cookie-config"
                onClick={() => setShowModal(true)}
                className="px-3.5 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                Configurar
              </button>
              <button
                id="btn-cookie-reject"
                onClick={handleRejectNonEssential}
                className="px-3.5 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              >
                Solo necesarias
              </button>
              <button
                id="btn-cookie-accept"
                onClick={handleAcceptAll}
                className="px-4 py-2 text-xs font-bold text-white bg-[#FF0000] hover:bg-red-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Granular Modal for Preferences */}
      {showModal && (
        <div
          id="cookie-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
        >
          <div
            id="cookie-modal-card"
            className="w-full max-w-lg bg-white dark:bg-[#1F1F1F] rounded-xl shadow-2xl border border-gray-200 dark:border-[#2F2F2F] overflow-hidden text-[#212121] dark:text-white animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="p-5 border-b border-gray-100 dark:border-[#2F2F2F] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-50 dark:bg-red-950/40 text-[#FF0000] dark:text-[#FF4E45] rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#212121] dark:text-white">Centro de Preferencias de Privacidad</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Gestiona qué datos y cookies permites en YouTubeCalculador</p>
                </div>
              </div>
              <button
                id="btn-close-cookie-modal"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-sm">
              {/* Necessary */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#2F2F2F] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#212121] dark:text-white">1. Cookies Técnicas y Esenciales</span>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-200 dark:bg-[#2F2F2F] px-2 py-0.5 rounded">
                    Siempre Activas
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Indispensables para recordar los parámetros ingresados en las calculadoras, el estado de sesión y tus
                  preferencias de privacidad. No almacenan ningún dato de identificación personal.
                </p>
              </div>

              {/* Analytics */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#2F2F2F] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#212121] dark:text-white">2. Cookies de Analítica y Estadísticas</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="toggle-cookie-analytics"
                      type="checkbox"
                      checked={prefs.analytics}
                      onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF0000]"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Permiten registrar eventos anónimos de conteo de cálculos y visitas para saber qué herramientas son más
                  populares y optimizar la plataforma para todos los creadores.
                </p>
              </div>

              {/* Advertising */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-[#2F2F2F] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#212121] dark:text-white">3. Cookies de Publicidad (Google AdSense)</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="toggle-cookie-ads"
                      type="checkbox"
                      checked={prefs.advertising}
                      onChange={(e) => setPrefs({ ...prefs, advertising: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF0000]"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Permiten la personalización de anuncios no invasivos gestionados por Google AdSense para sostener los
                  costos de servidor y mantener las herramientas 100% gratuitas para siempre.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-[#2F2F2F] bg-gray-50 dark:bg-[#181818] flex items-center justify-end gap-3">
              <button
                id="btn-save-custom-cookie"
                onClick={() => handleSaveCustom({ ...prefs, saved: true })}
                className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-[#272727] border border-gray-300 dark:border-[#383838] hover:bg-gray-100 dark:hover:bg-[#333333] rounded-lg transition-colors cursor-pointer"
              >
                Guardar preferencias
              </button>
              <button
                id="btn-modal-accept-all"
                onClick={handleAcceptAll}
                className="px-4 py-2 text-xs font-bold text-white bg-[#FF0000] hover:bg-[#E60000] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-4 h-4" />
                Aceptar todas
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
