import type { CurrencyCode } from '@/types';

const STATIC_RATES_TO_ETB: Record<CurrencyCode, number> = {
  ETB: 1,
  USD: 131.50,
  EUR: 147.20,
  GBP: 166.80,
};

const STATIC_RATES_TO_USD: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 1.12,
  GBP: 1.27,
  ETB: 0.0076,
};

export interface ConvertedAmount {
  original: number;
  currency: CurrencyCode;
  etb: number;
  usd: number;
}

export function convertCurrency(
  amount: number,
  from: CurrencyCode
): ConvertedAmount {
  return {
    original: amount,
    currency: from,
    etb: Math.round(amount * STATIC_RATES_TO_ETB[from] * 100) / 100,
    usd: Math.round(amount * STATIC_RATES_TO_USD[from] * 100) / 100,
  };
}

export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  locale = 'en-US'
): string {
  const symbols: Record<CurrencyCode, string> = {
    EUR: '€', USD: '$', ETB: 'ETB ', GBP: '£',
  };
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `${symbols[currency]}${formatted}`;
}

export function formatFundingRange(
  minAmount: number | null,
  maxAmount: number | null,
  currency: CurrencyCode
): string {
  if (minAmount && maxAmount) {
    return `${formatCurrency(minAmount, currency)} – ${formatCurrency(maxAmount, currency)}`;
  }
  if (maxAmount) return `Up to ${formatCurrency(maxAmount, currency)}`;
  if (minAmount) return `From ${formatCurrency(minAmount, currency)}`;
  return 'Variable';
}

export { STATIC_RATES_TO_ETB, STATIC_RATES_TO_USD };
