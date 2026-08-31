import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Eye,
  Calculator,
  Flame,
  Download,
  RotateCcw,
  BarChart2,
  Lock,
  Unlock,
  Layers,
  Sparkles,
  Search,
  Globe,
  Edit3,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { metricsService } from '../services/metrics';
import { AggregatedStats, MetricEvent } from '../types';
import { CALCULATORS } from '../data/calculators';
import { ToolRegistry, RegisteredTool } from '../services/toolRegistry';

export const AdminDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ytcalc_admin_auth') === 'true';
  });

  // 3-Factor Authentication Form State
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    accessKey: '',
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [stats, setStats] = useState<AggregatedStats>(metricsService.getStats());
  const [events, setEvents] = useState<MetricEvent[]>(metricsService.getRecentEvents());
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'image_stats' | 'cookies' | 'activity' | 'adsense' | 'seo_urls'>('overview');
  const [toolSearch, setToolSearch] = useState('');

  // Cookie System State (Turso DB)
  const [cookieStatsData, setCookieStatsData] = useState<{
    summary: {
      totalRecords: number;
      acceptedAll: number;
      rejectedOptional: number;
      customPreferences: number;
      analyticsAllowed: number;
      adsAllowed: number;
    };
    settings: {
      bannerTitle: string;
      bannerDescription: string;
      bannerEnabled: boolean;
      requireExplicitConsent: boolean;
      cookieExpiryDays: number;
    };
    recentConsents: Array<{
      id: number;
      visitorId: string;
      consentType: string;
      necessary: boolean;
      analytics: boolean;
      advertising: boolean;
      userAgent: string;
      createdAt: number;
    }>;
  }>({
    summary: { totalRecords: 0, acceptedAll: 0, rejectedOptional: 0, customPreferences: 0, analyticsAllowed: 0, adsAllowed: 0 },
    settings: {
      bannerTitle: 'Privacidad y Cookies en YouTubeCalculador',
      bannerDescription: 'Utilizamos cookies técnicas necesarias y analítica anónima.',
      bannerEnabled: true,
      requireExplicitConsent: true,
      cookieExpiryDays: 365,
    },
    recentConsents: [],
  });

  const [cookieSettingsForm, setCookieSettingsForm] = useState({
    bannerTitle: '',
    bannerDescription: '',
    bannerEnabled: true,
    requireExplicitConsent: true,
    cookieExpiryDays: 365,
  });
  const [cookieSaveSuccess, setCookieSaveSuccess] = useState(false);

  // Image Tools Conversions Stats State (Turso DB)
  const [imageStatsData, setImageStatsData] = useState<{
    grandTotal: number;
    toolSummary: Array<{
      tool_id: string;
      tool_name: string;
      count: number;
      formats: Record<string, number>;
    }>;
    recentConversions: Array<{
      id: number;
      tool_id: string;
      tool_name: string;
      event: string;
      format_from: string;
      format_to: string;
      created_at: number;
    }>;
  }>({ grandTotal: 0, toolSummary: [], recentConversions: [] });
  const [imgToolFilter, setImgToolFilter] = useState('all');
  const [imgPeriodFilter, setImgPeriodFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');

  // SEO URLs Admin State
  const [registryTools, setRegistryTools] = useState<RegisteredTool[]>(() => ToolRegistry.getAll());
  const [seoSearchQuery, setSeoSearchQuery] = useState('');
  const [seoCategoryFilter, setSeoCategoryFilter] = useState('all');
  const [seoStatusFilter, setSeoStatusFilter] = useState('all');
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{
    route: string;
    h1: string;
    title: string;
    metaDescription: string;
    indexable: boolean;
    published: boolean;
  }>({
    route: '',
    h1: '',
    title: '',
    metaDescription: '',
    indexable: true,
    published: true,
  });

  const fetchCookieStats = async () => {
    try {
      const res = await fetch('/api/admin/cookie-stats');
      if (res.ok) {
        const data = await res.json();
        setCookieStatsData(data);
        if (data.settings && !cookieSettingsForm.bannerTitle) {
          setCookieSettingsForm({
            bannerTitle: data.settings.bannerTitle,
            bannerDescription: data.settings.bannerDescription,
            bannerEnabled: data.settings.bannerEnabled,
            requireExplicitConsent: data.settings.requireExplicitConsent,
            cookieExpiryDays: data.settings.cookieExpiryDays,
          });
        }
      }
    } catch {
      // ignore
    }
  };

  const handleSaveCookieSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/cookie-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cookieSettingsForm),
      });
      if (res.ok) {
        setCookieSaveSuccess(true);
        setTimeout(() => setCookieSaveSuccess(false), 3000);
        fetchCookieStats();
      }
    } catch {
      // ignore
    }
  };

  const fetchImageStats = async () => {
    try {
      const res = await fetch(`/api/admin/image-stats?tool_id=${imgToolFilter}&period=${imgPeriodFilter}`);
      if (res.ok) {
        const data = await res.json();
        setImageStatsData(data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const refresh = async () => {
      await metricsService.syncFromDatabase();
      await ToolRegistry.syncFromDatabase();
      setRegistryTools(ToolRegistry.getAll());
      setStats(metricsService.getStats());
      setEvents(metricsService.getRecentEvents());
      fetchImageStats();
      fetchCookieStats();
    };
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [imgToolFilter, imgPeriodFilter]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password,
          accessKey: loginForm.accessKey,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('ytcalc_admin_auth', 'true');
        sessionStorage.setItem('ytcalc_admin_token', data.token);
      } else {
        setLoginError(data.error || 'Credenciales incorrectas. Acceso denegado.');
      }
    } catch {
      setLoginError('Error al conectar con el servidor de autenticación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ytcalc_admin_auth');
    sessionStorage.removeItem('ytcalc_admin_token');
  };

  const handleResetData = () => {
    if (window.confirm('¿Estás seguro de que deseas restablecer las métricas a los valores predeterminados?')) {
      metricsService.resetMetrics();
      setStats(metricsService.getStats());
      setEvents(metricsService.getRecentEvents());
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(metricsService.exportMetricsJson());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ytcalculador_metrics_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isAuthenticated) {
    return (
      <div id="admin-login-screen" className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-[#1F1F1F] rounded-3xl border border-zinc-200 dark:border-[#2F2F2F] p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-zinc-900 dark:bg-black text-white rounded-2xl flex items-center justify-center mx-auto shadow-md border border-zinc-700">
              <ShieldAlert className="w-7 h-7 text-[#FF0000]" />
            </div>
            <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
              Portal Administrativo Seguro
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
              Requiere 3 factores de verificación: Usuario, Contraseña y Clave de Acceso Alfanumérica.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {loginError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400">
                {loginError}
              </div>
            )}

            {/* 1. Usuario */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                1. Usuario Administrador
              </label>
              <input
                type="text"
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Nombre de usuario"
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-[#141414] border border-zinc-300 dark:border-[#383838] rounded-xl text-xs font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF0000]"
                autoFocus
              />
            </div>

            {/* 2. Contraseña */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                2. Contraseña Maestra
              </label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-[#141414] border border-zinc-300 dark:border-[#383838] rounded-xl text-xs font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF0000]"
              />
            </div>

            {/* 3. Clave Alfanumérica */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                <span>3. Clave de Acceso Alfanumérica</span>
                <span className="text-[10px] text-zinc-400 font-mono">Token 3FA</span>
              </label>
              <input
                type="text"
                required
                value={loginForm.accessKey}
                onChange={(e) => setLoginForm({ ...loginForm, accessKey: e.target.value })}
                placeholder="KEY-XXXX-XXXX-XXXX"
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-[#141414] border border-zinc-300 dark:border-[#383838] rounded-xl text-xs font-mono font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FF0000] tracking-wider"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#FF0000] hover:bg-[#CC0000] active:scale-98 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Unlock className="w-4 h-4" />
              {isSubmitting ? 'Verificando con Turso...' : 'Verificar y Desbloquear'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-zinc-100 dark:border-[#2F2F2F]">
            <button
              onClick={onExit}
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors font-medium cursor-pointer"
            >
              ← Volver a YouTubeCalculador
            </button>
          </div>
        </div>
      </div>
    );
  }

  const topTool = stats.popularTools && stats.popularTools.length > 0 
    ? stats.popularTools[0] 
    : { name: 'Sin datos aún', count: 0 };

  const filteredTools = stats.popularTools.filter((t) =>
    t.name.toLowerCase().includes(toolSearch.toLowerCase()) || t.slug.toLowerCase().includes(toolSearch.toLowerCase())
  );

  return (
    <div id="admin-dashboard-view" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-[#2F2F2F] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-zinc-900 dark:bg-[#272727] text-white rounded-lg">
              <ShieldAlert className="w-5 h-5 text-[#FF0000]" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Dashboard Administrativo</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Métricas de uso anónimas, rendimiento de calculadoras y preparación de monetización
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-[#1F1F1F] border border-zinc-300 dark:border-[#383838] hover:bg-zinc-50 dark:hover:bg-[#2A2A2A] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar JSON
          </button>
          <button
            onClick={handleResetData}
            className="px-3.5 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-[#1F1F1F] border border-zinc-300 dark:border-[#383838] hover:bg-zinc-50 dark:hover:bg-[#2A2A2A] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Restablecer a valores iniciales"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* 5 Primary Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Usuarios */}
        <div className="p-5 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Usuarios Reales</span>
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white mt-2">
            {stats.totalUniqueVisitors.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            {stats.totalUniqueVisitors > 0 ? `${stats.totalUniqueVisitors} únicos en Turso DB` : 'Base de datos en tiempo real'}
          </span>
        </div>

        {/* 2. Visitas */}
        <div className="p-5 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Visitas Totales</span>
            <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white mt-2">
            {stats.totalViews.toLocaleString()}
          </div>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mt-1 block">
            Páginas vistas registradas
          </span>
        </div>

        {/* 3. Cálculos */}
        <div className="p-5 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Cálculos Totales</span>
            <Calculator className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white mt-2">
            {stats.totalCalculations.toLocaleString()}
          </div>
          <span className="text-[11px] text-red-600 dark:text-red-400 font-bold flex items-center gap-1 mt-1">
            {stats.totalCalculations > 0 ? `${stats.totalCalculations} cálculos ejecutados` : '0 cálculos'}
          </span>
        </div>

        {/* 4. Herramientas Utilizadas */}
        <div className="p-5 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Herramientas Activas</span>
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white mt-2">
            {registryTools.filter((t) => t.published).length}
          </div>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mt-1 block">
            {registryTools.length} registradas (100% operativas)
          </span>
        </div>

        {/* 5. Herramienta Más Popular */}
        <div className="p-5 bg-zinc-900 dark:bg-black text-white rounded-2xl border border-zinc-800 dark:border-[#2F2F2F] shadow-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Herramienta Top #1</span>
            <Flame className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
          <div className="text-lg font-bold text-white mt-2 truncate">
            {topTool.name}
          </div>
          <span className="text-[11px] text-zinc-400 font-mono mt-1 block">
            {topTool.count.toLocaleString()} usos
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-[#2F2F2F] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#272727]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4" />
            Visión General & Gráficos
          </span>
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            activeTab === 'tools'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#272727]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Flame className="w-4 h-4" />
            Ranking de Herramientas ({stats.popularTools.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            activeTab === 'activity'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#272727]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Registro en Vivo ({events.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('adsense')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            activeTab === 'adsense'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#272727]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            Probador AdSense
          </span>
        </button>
        <button
          onClick={() => setActiveTab('image_stats')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            activeTab === 'image_stats'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#272727]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span className="text-sm">🖼️</span>
            Conversiones Imágenes ({imageStatsData.grandTotal.toLocaleString()})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('cookies')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            activeTab === 'cookies'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#272727]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span className="text-sm">🍪</span>
            Sistema Cookies & Privacidad ({cookieStatsData.summary.totalRecords})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('seo_urls')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            activeTab === 'seo_urls'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#272727]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Globe className="w-4 h-4" />
            SEO → URLs ({registryTools.length})
          </span>
        </button>
      </div>

      {/* Tab 1: Overview & Charts */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Daily Calculations Chart */}
            <div className="lg:col-span-8 p-6 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">Cálculos y Visitas Diarias</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Tendencia de actividad en los últimos 7 días</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <span className="w-2.5 h-2.5 bg-red-600 rounded-full" /> Cálculos
                  </span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <span className="w-2.5 h-2.5 bg-zinc-300 dark:bg-zinc-600 rounded-full" /> Vistas
                  </span>
                </div>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.dailyCalculations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="calcGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DC2626" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717A' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#71717A' }} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#18181B', borderRadius: '8px', border: 'none', color: '#FFF', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#A1A1AA" fill="transparent" strokeWidth={2} />
                    <Area type="monotone" dataKey="calculations" stroke="#DC2626" fill="url(#calcGrad)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown Pie Chart */}
            <div className="lg:col-span-4 p-6 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">Distribución por Categoría</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Cálculos agrupados por temática</p>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryDistribution}
                      dataKey="count"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={45}
                      paddingAngle={3}
                    >
                      {stats.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#18181B', borderRadius: '8px', border: 'none', color: '#FFF', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-[#2F2F2F]">
                {stats.categoryDistribution.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      {cat.label}
                    </span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-white">{cat.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hourly Traffic Bar Chart */}
          <div className="p-6 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Actividad por Horario (UTC)</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Picos de uso a lo largo del día</p>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.hourlyActivity} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#71717A' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#71717A' }} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#18181B', borderRadius: '8px', border: 'none', color: '#FFF', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#DC2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Full Tools Ranking Table */}
      {activeTab === 'tools' && (
        <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Ranking Oficial de Calculadoras</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Herramientas ordenadas por número total de ejecuciones</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar herramienta..."
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 dark:bg-[#141414] border border-zinc-300 dark:border-[#383838] rounded-xl text-xs text-zinc-900 dark:text-white outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-[#2F2F2F] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Calculadora</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3">Cálculos Realizados</th>
                  <th className="py-3 px-3">% del Total</th>
                  <th className="py-3 px-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-[#2F2F2F]">
                {filteredTools.map((tool, idx) => {
                  const pct = ((tool.count / (stats.totalCalculations || 1)) * 100).toFixed(1);
                  return (
                    <tr key={tool.slug} className="hover:bg-zinc-50 dark:hover:bg-[#272727] transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-zinc-400 dark:text-zinc-500">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-zinc-900 dark:text-white">{tool.name}</div>
                        <div className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">/{tool.slug}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-[#272727] text-zinc-700 dark:text-zinc-300 font-semibold uppercase text-[10px]">
                          {tool.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-zinc-900 dark:text-white font-mono">
                        {tool.count.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-zinc-100 dark:bg-[#272727] rounded-full h-1.5 overflow-hidden">
                            <div className="bg-red-600 h-full rounded-full" style={{ width: `${Math.min(100, Number(pct) * 2)}%` }} />
                          </div>
                          <span className="font-mono text-zinc-500 dark:text-zinc-400">{pct}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          Activa
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Image Tools Conversion Usage Statistics (Turso DB) */}
      {activeTab === 'image_stats' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-5 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <span>🖼️</span> Estadísticas de Uso de Imágenes (Turso DB)
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Volumen real de conversiones ejecutadas de forma 100% privada y local por los usuarios
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Tool Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-zinc-500">Herramienta:</span>
                <select
                  value={imgToolFilter}
                  onChange={(e) => setImgToolFilter(e.target.value)}
                  className="px-3 py-1.5 bg-zinc-100 dark:bg-[#2A2A2A] border border-zinc-200 dark:border-[#383838] rounded-xl text-xs font-bold text-zinc-900 dark:text-white outline-none cursor-pointer"
                >
                  <option value="all">Todas las herramientas</option>
                  {registryTools
                    .filter((t) => t.category === 'imagenes' && t.kind === 'image')
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Period Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-zinc-500">Período:</span>
                <select
                  value={imgPeriodFilter}
                  onChange={(e) => setImgPeriodFilter(e.target.value as any)}
                  className="px-3 py-1.5 bg-zinc-100 dark:bg-[#2A2A2A] border border-zinc-200 dark:border-[#383838] rounded-xl text-xs font-bold text-zinc-900 dark:text-white outline-none cursor-pointer"
                >
                  <option value="all">Histórico Completo</option>
                  <option value="today">Últimas 24 Horas</option>
                  <option value="7days">Últimos 7 Días</option>
                  <option value="30days">Últimos 30 Días</option>
                </select>
              </div>
            </div>
          </div>

          {/* KPI Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Conversiones Totales</span>
              <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
                {imageStatsData.grandTotal.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
                Registros en Turso DB
              </span>
            </div>

            <div className="p-5 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Herramientas Utilizadas</span>
              <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
                {imageStatsData.toolSummary.length}
              </div>
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Con conversiones registradas
              </span>
            </div>

            <div className="p-5 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Privacidad del Usuario</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                100% Local
              </div>
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Cero almacenamiento de archivos
              </span>
            </div>
          </div>

          {/* Ranking Table of Image Conversions */}
          <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] p-6 shadow-xs space-y-4">
            <h4 className="text-base font-bold text-zinc-900 dark:text-white">
              Desglose de Conversiones por Herramienta y Formato
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-[#2F2F2F] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Herramienta</th>
                    <th className="py-3 px-3">Total Conversiones</th>
                    <th className="py-3 px-3">Formatos Utilizados</th>
                    <th className="py-3 px-3 text-right">% del Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-[#2F2F2F]">
                  {imageStatsData.toolSummary.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-zinc-400 dark:text-zinc-500 font-medium">
                        No hay conversiones registradas en el período seleccionado.
                      </td>
                    </tr>
                  ) : (
                    imageStatsData.toolSummary.map((item) => {
                      const pct = ((item.count / (imageStatsData.grandTotal || 1)) * 100).toFixed(1);
                      return (
                        <tr key={item.tool_id} className="hover:bg-zinc-50 dark:hover:bg-[#272727] transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-zinc-900 dark:text-white text-sm">
                              {item.tool_name}
                            </div>
                            <span className="text-[10px] text-zinc-400 font-mono">id: {item.tool_id}</span>
                          </td>
                          <td className="py-3.5 px-3 font-black text-sm text-red-600 dark:text-red-400 font-mono">
                            {item.count.toLocaleString()} conversiones
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="flex flex-wrap gap-1.5">
                              {Object.entries(item.formats).map(([fmt, count]) => (
                                <span
                                  key={fmt}
                                  className="px-2 py-0.5 bg-zinc-100 dark:bg-[#2A2A2A] rounded-md font-mono text-[10px] text-zinc-700 dark:text-zinc-300 font-semibold"
                                >
                                  {fmt.toUpperCase()} ({count})
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-zinc-900 dark:text-white">
                            {pct}%
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Live Conversions Stream */}
          <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] p-6 shadow-xs space-y-4">
            <h4 className="text-base font-bold text-zinc-900 dark:text-white flex items-center justify-between">
              <span>Registro de Conversiones Recientes en Vivo</span>
              <span className="text-xs font-mono text-zinc-400 font-normal">
                {imageStatsData.recentConversions.length} registros
              </span>
            </h4>

            <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-[#2F2F2F] font-mono text-xs">
              {imageStatsData.recentConversions.length === 0 ? (
                <div className="p-6 text-center text-zinc-400">Sin conversiones registradas aún.</div>
              ) : (
                imageStatsData.recentConversions.map((conv) => (
                  <div key={conv.id} className="py-2.5 px-2 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-[#272727]">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 bg-red-50 dark:bg-red-950/50 text-red-600 rounded text-[10px] font-bold uppercase">
                        {conv.event}
                      </span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {conv.tool_name}
                      </span>
                      <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-[#2A2A2A] rounded text-[10px] text-zinc-600 dark:text-zinc-400 font-mono">
                        {conv.format_from.toUpperCase()} → {conv.format_to.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-zinc-400 text-[11px]">
                      {new Date(conv.created_at).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Cookies & Privacy Consent Management (Turso DB) */}
      {activeTab === 'cookies' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="p-5 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <span>🍪</span> Sistema de Cookies y Consentimiento RGPD / ePrivacy (Turso DB)
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Auditoría en tiempo real de preferencias de usuarios, registro de consentimientos y configuración del banner
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              RGPD / ePrivacy Activo
            </span>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total Consents */}
            <div className="p-5 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Registros Totales</span>
              <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
                {cookieStatsData.summary.totalRecords.toLocaleString()}
              </div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Decisiones de cookies registradas
              </span>
            </div>

            {/* 2. Aceptadas Todas */}
            <div className="p-5 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Aceptaron Todo</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {cookieStatsData.summary.acceptedAll.toLocaleString()}
              </div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                {cookieStatsData.summary.totalRecords > 0 ? `${((cookieStatsData.summary.acceptedAll / cookieStatsData.summary.totalRecords) * 100).toFixed(1)}% tasa de aceptación` : '0%'}
              </span>
            </div>

            {/* 3. Solo Necesarias */}
            <div className="p-5 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Solo Necesarias</span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {cookieStatsData.summary.rejectedOptional.toLocaleString()}
              </div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Rechazaron cookies opcionales
              </span>
            </div>

            {/* 4. Personalizadas */}
            <div className="p-5 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Personalizadas</span>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {cookieStatsData.summary.customPreferences.toLocaleString()}
              </div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Ajustaron categorías manualmente
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Banner Configuration Form */}
            <div className="lg:col-span-5 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] p-6 shadow-xs space-y-4">
              <div className="border-b border-zinc-100 dark:border-[#2F2F2F] pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Configuración del Banner</h4>
                  <p className="text-xs text-zinc-400">Parámetros globales sincronizados en Turso</p>
                </div>
                {cookieSaveSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Guardado
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveCookieSettings} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Título del Banner</label>
                  <input
                    type="text"
                    value={cookieSettingsForm.bannerTitle}
                    onChange={(e) => setCookieSettingsForm({ ...cookieSettingsForm, bannerTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#141414] border border-zinc-300 dark:border-[#383838] rounded-xl font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Ej. Privacidad y Cookies en YouTubeCalculador"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Mensaje Informativo</label>
                  <textarea
                    rows={3}
                    value={cookieSettingsForm.bannerDescription}
                    onChange={(e) => setCookieSettingsForm({ ...cookieSettingsForm, bannerDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#141414] border border-zinc-300 dark:border-[#383838] rounded-xl font-medium text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-red-600 resize-none"
                    placeholder="Descripción legal y técnica..."
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-[#252525] rounded-xl border border-zinc-200 dark:border-[#333]">
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block">Banner Activo</span>
                    <span className="text-[10px] text-zinc-400">Mostrar aviso a nuevos visitantes</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookieSettingsForm.bannerEnabled}
                    onChange={(e) => setCookieSettingsForm({ ...cookieSettingsForm, bannerEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-[#252525] rounded-xl border border-zinc-200 dark:border-[#333]">
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white block">Expiración de Cookies</span>
                    <span className="text-[10px] text-zinc-400">Días de validez del consentimiento</span>
                  </div>
                  <span className="font-bold text-zinc-900 dark:text-white font-mono bg-zinc-200 dark:bg-[#333] px-2 py-0.5 rounded">
                    365 días
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  Guardar Configuración en Turso
                </button>
              </form>
            </div>

            {/* Right Column: Real-time Consent Audit Log */}
            <div className="lg:col-span-7 bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-[#2F2F2F] pb-3">
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Registro de Auditoría de Consentimientos</h4>
                  <p className="text-xs text-zinc-400">Últimos consentimientos almacenados en Turso (RGPD)</p>
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  {cookieStatsData.recentConsents.length} registros
                </span>
              </div>

              <div className="max-h-96 overflow-y-auto divide-y divide-zinc-100 dark:divide-[#2F2F2F] font-mono text-xs">
                {cookieStatsData.recentConsents.length === 0 ? (
                  <div className="p-8 text-center text-zinc-400">
                    No hay registros de consentimiento en Turso aún.
                  </div>
                ) : (
                  cookieStatsData.recentConsents.map((item) => (
                    <div key={item.id} className="py-2.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-zinc-50 dark:hover:bg-[#272727] transition-colors">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.consentType === 'all'
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                              : item.consentType === 'essential_only'
                              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                              : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                          }`}
                        >
                          {item.consentType === 'all' ? 'Aceptó Todo' : item.consentType === 'essential_only' ? 'Solo Esenciales' : 'Personalizado'}
                        </span>
                        <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                          ID: <code className="text-zinc-900 dark:text-white">{item.visitorId.slice(0, 14)}...</code>
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="text-emerald-600 font-bold">Tec: ✓</span>
                          <span className={item.analytics ? 'text-emerald-600 font-bold' : 'text-zinc-400'}>
                            Ana: {item.analytics ? '✓' : '✗'}
                          </span>
                          <span className={item.advertising ? 'text-emerald-600 font-bold' : 'text-zinc-400'}>
                            Ads: {item.advertising ? '✓' : '✗'}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400">
                          {new Date(item.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Real-Time Event Log Stream */}
      {activeTab === 'activity' && (
        <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Registro de Telemetría Anónima en Vivo</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Últimos eventos procesados en el navegador (Privacy-First)</p>
            </div>
            <span className="px-2.5 py-1 bg-zinc-900 dark:bg-[#272727] text-white text-[11px] font-mono rounded-lg">
              {events.length} eventos recientes
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-zinc-100 dark:divide-[#2F2F2F] font-mono text-xs">
            {events.length === 0 ? (
              <div className="p-6 text-center text-zinc-400 dark:text-zinc-500">No hay eventos registrados en esta sesión.</div>
            ) : (
              events.map((evt, idx) => (
                <div key={idx} className="py-2.5 px-2 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-[#272727]">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        evt.type === 'calculation_completed'
                          ? 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300'
                          : evt.type === 'tool_viewed'
                          ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                          : 'bg-zinc-100 dark:bg-[#2A2A2A] text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {evt.type}
                    </span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{evt.toolSlug || 'Página general'}</span>
                  </div>
                  <span className="text-zinc-400 dark:text-zinc-500 text-[11px]">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: AdSense Space Tester */}
      {activeTab === 'adsense' && (
        <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Configuración & Vista Previa de Google AdSense</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Validación de ubicaciones de anuncios sin interferir con las herramientas ni forzar clics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#2F2F2F] space-y-2">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Políticas AdSense Verificadas:</h4>
              <ul className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5">
                <li className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                  ✓ Separación visual nítida ("Publicidad Patrocinada")
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                  ✓ Botones de cálculo a más de 40px de distancia de los bloques publicitarios
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                  ✓ Cero trampas de clics ni ventanas emergentes agresivas
                </li>
                <li className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                  ✓ Banner de consentimiento de cookies RGPD/CCPA integrado
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#2F2F2F] space-y-2">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Espacios Reservados en el Layout:</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Cada calculadora cuenta con 2 posiciones estratégicas: <code>top-banner</code> (728x90 adaptable) y <code>mid-content</code> (responsive).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: SEO -> URLs Administration */}
      {activeTab === 'seo_urls' && (
        <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl border border-zinc-200 dark:border-[#2F2F2F] p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md">
                  SEO
                </span>
                <span className="text-zinc-400">→</span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">URLs & Configuración SEO</h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Gestión centralizada del ToolRegistry: rutas individuales, H1, SEO Title, Meta Description, indexabilidad y estado.
              </p>
            </div>
            <div className="text-xs font-mono bg-zinc-100 dark:bg-[#141414] px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-[#2F2F2F] text-zinc-600 dark:text-zinc-300">
              Total Herramientas: <strong className="text-red-600">{registryTools.length}</strong>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={seoSearchQuery}
                onChange={(e) => setSeoSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, ID o ruta..."
                className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#383838] rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>

            <div>
              <select
                value={seoCategoryFilter}
                onChange={(e) => setSeoCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#383838] rounded-xl text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-red-600 outline-none cursor-pointer"
              >
                <option value="all">Todas las Categorías</option>
                <option value="ingresos">Ingresos / Monetización</option>
                <option value="analytics">Analítica / Métricas</option>
                <option value="video">Video / Formatos</option>
                <option value="imagenes">Asistente Imágenes</option>
                <option value="seo">Suite SEO</option>
                <option value="guia">Guías</option>
                <option value="general">Generales / Hubs</option>
                <option value="legal">Legales</option>
              </select>
            </div>

            <div>
              <select
                value={seoStatusFilter}
                onChange={(e) => setSeoStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-[#383838] rounded-xl text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-red-600 outline-none cursor-pointer"
              >
                <option value="all">Todos los Estados e Indexabilidad</option>
                <option value="published">Estado: Activo / Publicado</option>
                <option value="draft">Estado: Borrador / Desactivado</option>
                <option value="indexable">Indexable (index, follow)</option>
                <option value="noindex">No Indexable (noindex)</option>
              </select>
            </div>
          </div>

          {/* URLs Table */}
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-[#2F2F2F]">
            <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-300">
              <thead className="bg-zinc-50 dark:bg-[#141414] border-b border-zinc-200 dark:border-[#2F2F2F] text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Herramienta & Categoría</th>
                  <th className="py-3 px-4">Ruta (Route)</th>
                  <th className="py-3 px-4">H1 & SEO Title</th>
                  <th className="py-3 px-4">Meta Description</th>
                  <th className="py-3 px-4 text-center">Indexable</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-[#2F2F2F]">
                {registryTools
                  .filter((item) => {
                    const matchesQuery =
                      !seoSearchQuery ||
                      item.name.toLowerCase().includes(seoSearchQuery.toLowerCase()) ||
                      item.id.toLowerCase().includes(seoSearchQuery.toLowerCase()) ||
                      item.route.toLowerCase().includes(seoSearchQuery.toLowerCase());

                    const matchesCategory =
                      seoCategoryFilter === 'all' || item.category === seoCategoryFilter;

                    const matchesStatus =
                      seoStatusFilter === 'all' ||
                      (seoStatusFilter === 'published' && item.published) ||
                      (seoStatusFilter === 'draft' && !item.published) ||
                      (seoStatusFilter === 'indexable' && item.indexable) ||
                      (seoStatusFilter === 'noindex' && !item.indexable);

                    return matchesQuery && matchesCategory && matchesStatus;
                  })
                  .map((item) => {
                    const isEditing = editingToolId === item.id;

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-zinc-50/50 dark:hover:bg-[#272727]/50 transition-colors ${
                          isEditing ? 'bg-red-50/30 dark:bg-red-950/20' : ''
                        }`}
                      >
                        {/* 1. Name & Category */}
                        <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-white">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold">{item.name}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 bg-zinc-100 dark:bg-[#2A2A2A] text-zinc-600 dark:text-zinc-400 rounded text-[10px] uppercase font-mono">
                                {item.category}
                              </span>
                              {item.subcategory && (
                                <span className="text-[10px] text-zinc-400">/{item.subcategory}</span>
                              )}
                              <span className="text-[10px] text-zinc-400 font-mono">id: {item.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Route */}
                        <td className="py-3 px-4 font-mono text-blue-600 dark:text-blue-400">
                          {isEditing ? (
                            <div className="space-y-1">
                              <input
                                type="text"
                                value={editFormData.route}
                                onChange={(e) => setEditFormData({ ...editFormData, route: e.target.value })}
                                placeholder="/categoria/mi-ruta"
                                className="w-full px-2 py-1 bg-white dark:bg-[#141414] border border-blue-400 dark:border-blue-500 rounded text-xs text-blue-600 dark:text-blue-400 focus:ring-1 focus:ring-red-600 font-mono"
                              />
                              {editFormData.route !== item.route && (
                                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-sans font-bold">
                                  ⚡ Creará redirección 301 automática desde <code>{item.route}</code>
                                </p>
                              )}
                            </div>
                          ) : (
                            <a
                              href={item.route}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline flex items-center gap-1"
                              title="Abrir URL en pestaña nueva"
                            >
                              <span>{item.route}</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          )}
                        </td>

                        {/* 3. H1 & SEO Title */}
                        <td className="py-3 px-4 max-w-xs">
                          {isEditing ? (
                            <div className="space-y-1.5">
                              <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase">H1:</label>
                                <input
                                  type="text"
                                  value={editFormData.h1}
                                  onChange={(e) => setEditFormData({ ...editFormData, h1: e.target.value })}
                                  className="w-full px-2 py-1 bg-white dark:bg-[#141414] border border-zinc-300 dark:border-[#444] rounded text-xs text-zinc-900 dark:text-white focus:ring-1 focus:ring-red-600"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase">SEO Title:</label>
                                <input
                                  type="text"
                                  value={editFormData.title}
                                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                  className="w-full px-2 py-1 bg-white dark:bg-[#141414] border border-zinc-300 dark:border-[#444] rounded text-xs text-zinc-900 dark:text-white focus:ring-1 focus:ring-red-600"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="font-semibold text-zinc-900 dark:text-white truncate" title={item.h1}>
                                <span className="text-zinc-400 font-normal">H1: </span>{item.h1}
                              </div>
                              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate" title={item.seo.title}>
                                <span className="text-zinc-400 font-normal">Title: </span>{item.seo.title}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* 4. Meta Description */}
                        <td className="py-3 px-4 max-w-xs">
                          {isEditing ? (
                            <div>
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Meta Description:</label>
                              <textarea
                                rows={2}
                                value={editFormData.metaDescription}
                                onChange={(e) => setEditFormData({ ...editFormData, metaDescription: e.target.value })}
                                className="w-full px-2 py-1 bg-white dark:bg-[#141414] border border-zinc-300 dark:border-[#444] rounded text-xs text-zinc-900 dark:text-white focus:ring-1 focus:ring-red-600 resize-none"
                              />
                            </div>
                          ) : (
                            <div className="line-clamp-2 text-zinc-600 dark:text-zinc-300 text-[11px]" title={item.seo.metaDescription}>
                              {item.seo.metaDescription}
                            </div>
                          )}
                        </td>

                        {/* 5. Indexable */}
                        <td className="py-3 px-4 text-center">
                          {isEditing ? (
                            <input
                              type="checkbox"
                              checked={editFormData.indexable}
                              onChange={(e) => setEditFormData({ ...editFormData, indexable: e.target.checked })}
                              className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                            />
                          ) : (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.indexable
                                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                              }`}
                            >
                              {item.indexable ? 'Indexable' : 'Noindex'}
                            </span>
                          )}
                        </td>

                        {/* 6. Status */}
                        <td className="py-3 px-4 text-center">
                          {isEditing ? (
                            <select
                              value={editFormData.published ? 'published' : 'draft'}
                              onChange={(e) => setEditFormData({ ...editFormData, published: e.target.value === 'published' })}
                              className="px-2 py-1 bg-white dark:bg-[#141414] border border-zinc-300 dark:border-[#444] rounded text-xs text-zinc-900 dark:text-white focus:ring-1 focus:ring-red-600 cursor-pointer"
                            >
                              <option value="published">Activo</option>
                              <option value="draft">Borrador</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.published
                                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                              }`}
                            >
                              {item.published ? 'Activo' : 'Borrador'}
                            </span>
                          )}
                        </td>

                        {/* 7. Actions */}
                        <td className="py-3 px-4 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={async () => {
                                  // If route changed, execute 301 redirection via updateRoute
                                  if (editFormData.route && editFormData.route !== item.route) {
                                    ToolRegistry.updateRoute(item.id, editFormData.route);
                                  }

                                  // Update SEO and metadata fields locally
                                  const updatedItem: RegisteredTool = {
                                    ...item,
                                    route: editFormData.route || item.route,
                                    h1: editFormData.h1,
                                    published: editFormData.published,
                                    indexable: editFormData.indexable,
                                    robots: editFormData.indexable ? 'index, follow' : 'noindex, nofollow',
                                    seo: {
                                      ...item.seo,
                                      title: editFormData.title,
                                      h1: editFormData.h1,
                                      metaDescription: editFormData.metaDescription,
                                    },
                                  };
                                  ToolRegistry.register(updatedItem);
                                  setRegistryTools(ToolRegistry.getAll());
                                  setEditingToolId(null);

                                  // If image tool, persist to Turso Database
                                  if (item.kind === 'image' || item.category === 'imagenes') {
                                    try {
                                      await fetch(`/api/admin/image-tools/${item.id}`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          name: item.name,
                                          category: item.category,
                                          route: editFormData.route || item.route,
                                          status: editFormData.published ? 'active' : 'draft',
                                          h1: editFormData.h1,
                                          seoTitle: editFormData.title,
                                          metaDescription: editFormData.metaDescription,
                                          indexable: editFormData.indexable,
                                        }),
                                      });
                                    } catch {
                                      // Ignore network errors
                                    }
                                  }
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                                title="Guardar cambios"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Guardar
                              </button>
                              <button
                                onClick={() => setEditingToolId(null)}
                                className="px-2 py-1 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                title="Cancelar"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingToolId(item.id);
                                setEditFormData({
                                  route: item.route,
                                  h1: item.h1 || item.seo.h1 || item.name,
                                  title: item.seo.title,
                                  metaDescription: item.seo.metaDescription,
                                  indexable: item.indexable,
                                  published: item.published,
                                });
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-[#272727] hover:bg-zinc-200 dark:hover:bg-[#333] rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                              title="Editar SEO y URL"
                            >
                              <Edit3 className="w-3 h-3" />
                              Editar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
