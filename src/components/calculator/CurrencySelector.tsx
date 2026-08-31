import React from 'react';
import { CurrencyCode, SUPPORTED_CURRENCIES } from '../../utils/currency';

interface CurrencySelectorProps {
  selectedCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-1 hidden sm:inline">
        Moneda:
      </span>
      <div className="inline-flex bg-gray-100 dark:bg-[#272727] p-0.5 rounded-lg border border-gray-200 dark:border-[#383838]">
        {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((curr) => {
          const isSelected = selectedCurrency === curr;
          const config = SUPPORTED_CURRENCIES[curr];
          return (
            <button
              key={curr}
              type="button"
              onClick={() => onCurrencyChange(curr)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                isSelected
                  ? 'bg-white dark:bg-[#1A1A1A] text-[#FF0000] dark:text-[#FF4E45] shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-[#212121] dark:hover:text-white'
              }`}
              title={config.name}
            >
              <span>{config.flag}</span>
              <span>{curr}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
