import React, { useState } from 'react';
import {
  Search,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Calculadoras', path: '/calculadoras' },
    { label: 'Categorías', path: '/categorias' },
    { label: '🖼️ Imágenes', path: '/imagenes' },
    { label: '🔎 SEO', path: '/seo' },
    { label: 'Guías', path: '/guias' },
    { label: 'Sobre nosotros', path: '/sobre-nosotros' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#0F0F0F] border-b border-gray-200 dark:border-[#272727] shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          {/* Logo / Brand Name */}
          <button
            id="brand-logo"
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2 group cursor-pointer text-left select-none shrink-0"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tighter text-[#212121] dark:text-white">
                YouTube
              </span>
              <span className="text-xl font-light bg-[#FF0000] text-white px-2 py-0.5 rounded-md shadow-xs">
                Calculador
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleNavClick(item.path)}
                  className={`transition-colors cursor-pointer text-sm font-semibold ${
                    isActive
                      ? 'text-[#FF0000] font-bold'
                      : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Search, ThemeToggle & Admin Link */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              id="btn-open-search-modal"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#333333] text-gray-600 dark:text-gray-300 hover:text-[#212121] dark:hover:text-white rounded-full text-xs font-medium transition-colors cursor-pointer"
              title="Buscar herramientas (Cmd+K / Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <span className="hidden sm:inline">¿Qué quieres calcular?</span>
              <span className="sm:hidden">Buscar</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-[#1E1E1E] rounded border border-gray-200 dark:border-[#383838] text-gray-400 dark:text-gray-400">
                ⌘K
              </kbd>
            </button>

            {/* Dark / Light Mode Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-[#212121] dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors cursor-pointer"
              aria-label="Menú móvil"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="lg:hidden border-t border-gray-200 dark:border-[#272727] bg-white dark:bg-[#181818] px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150 shadow-lg">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-red-50 dark:bg-red-950/40 text-[#FF0000]'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#272727]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="pt-3 border-t border-gray-100 dark:border-[#272727] flex items-center justify-start text-xs px-2">
            <ThemeToggle showLabel className="py-1.5" />
          </div>
        </div>
      )}
    </header>
  );
};

