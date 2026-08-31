import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false, className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle-button"
      onClick={toggleTheme}
      className={`relative flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 cursor-pointer select-none text-xs font-semibold ${
        isDark
          ? 'bg-[#272727] hover:bg-[#333333] text-amber-300 border border-[#383838]'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
      } ${className}`}
      title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
      aria-label={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 rotate-0 scale-100" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-200 rotate-0 scale-100" />
        )}
      </div>
      {showLabel && (
        <span className="truncate">
          {isDark ? 'Modo Claro' : 'Modo Oscuro'}
        </span>
      )}
    </button>
  );
};
