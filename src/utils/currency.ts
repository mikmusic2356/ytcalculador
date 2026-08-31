/**
 * Currency Definitions, Formatting, and Configurable Exchange Rates
 */

export type CurrencyCode = 'USD' | 'EUR' | 'MXN' | 'COP' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  exchangeRateToUSD: number; // 1 USD = X Currency
  decimals: number;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'Dólar estadounidense (USD)',
    flag: '🇺🇸',
    exchangeRateToUSD: 1.0,
    decimals: 2,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (EUR)',
    flag: '🇪🇺',
    exchangeRateToUSD: 0.92,
    decimals: 2,
  },
  MXN: {
    code: 'MXN',
    symbol: 'MX$',
    name: 'Peso mexicano (MXN)',
    flag: '🇲🇽',
    exchangeRateToUSD: 17.5,
    decimals: 2,
  },
  COP: {
    code: 'COP',
    symbol: 'COL$',
    name: 'Peso colombiano (COP)',
    flag: '🇨🇴',
    exchangeRateToUSD: 3950.0,
    decimals: 0,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'Libra esterlina (GBP)',
    flag: '🇬🇧',
    exchangeRateToUSD: 0.79,
    decimals: 2,
  },
};

/**
 * Format a number as currency using the given currency settings
 */
export function formatCurrencyAmount(
  amount: number,
  currencyCode: CurrencyCode = 'USD',
  showCode: boolean = false
): string {
  const config = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  const formatted = amount.toLocaleString('es-ES', {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  });

  if (currencyCode === 'EUR') {
    return `${formatted} ${config.symbol}${showCode ? ` ${currencyCode}` : ''}`;
  }

  return `${config.symbol}${formatted}${showCode ? ` ${currencyCode}` : ''}`;
}

/**
 * Independent currency conversion function (USD to target currency)
 */
export function convertFromUSD(amountInUSD: number, targetCurrency: CurrencyCode): number {
  const config = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.USD;
  return amountInUSD * config.exchangeRateToUSD;
}

/**
 * Independent currency conversion function (target currency to USD)
 */
export function convertToUSD(amountInCurrency: number, fromCurrency: CurrencyCode): number {
  const config = SUPPORTED_CURRENCIES[fromCurrency] || SUPPORTED_CURRENCIES.USD;
  if (config.exchangeRateToUSD === 0) return 0;
  return amountInCurrency / config.exchangeRateToUSD;
}
