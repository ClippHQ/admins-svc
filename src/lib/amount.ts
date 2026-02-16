
export const supportedCurrencies = [
  'USDT',
  'USDC',
  'BUSD',
  'DAI',
  'GHS',
  'KES',
  'UGX',
  'NGN',
  'USD',
  'EUR',
  'GBP',
  'BWP',
  'MWK',
  'RWF',
  'TZS',
  'ZMW'
] as const;

export type Currency = (typeof supportedCurrencies)[number];

interface FormatAmountParams {
  amount: number;
  currency?: string;
  fractionDigits?: number;
  notation?: 'compact' | 'standard' | 'scientific' | 'engineering' | undefined;
  spaceBetweenValue?: boolean;
  stripIfInteger?: boolean;
  withDecimals?: boolean;
}

export function formatAmount({
  currency,
  amount,
  spaceBetweenValue,
  withDecimals,
  fractionDigits = 2,
  stripIfInteger,
  notation
}: FormatAmountParams) {
  const currencySymbol =
    CURRENCY_SYMBOL_MAP[currency?.toUpperCase() as Currency]?.symbol ??
    currency?.toUpperCase() ??
    '';

  const space = spaceBetweenValue || currencySymbol.length >= 3 ? ' ' : '';

  let parsedAmount = Number(amount);
  const isNegative = parsedAmount < 0;
  parsedAmount = Math.abs(parsedAmount);
  if (Number.isNaN(parsedAmount)) {
    parsedAmount = 0;
  }


  return (
    (isNegative ? '-' : '') +
    currencySymbol +
    space +
    new Intl.NumberFormat(undefined, {
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits:
        withDecimals || parsedAmount === 0 ? fractionDigits : 0,
      notation: notation,
      trailingZeroDisplay: stripIfInteger ? 'stripIfInteger' : 'auto'
    }).format(parsedAmount)
  );
}

export const CURRENCY_SYMBOL_MAP: Record<
  Currency,
  { position: 'prefix' | 'postfix'; symbol: string }
> = {
  BUSD: { position: 'prefix', symbol: '' },
  BWP: { position: 'prefix', symbol: 'BWP' },
  DAI: { position: 'prefix', symbol: '' },
  EUR: { position: 'prefix', symbol: '€' },
  GBP: { position: 'prefix', symbol: '£' },
  GHS: { position: 'prefix', symbol: 'GH₵' },
  KES: { position: 'prefix', symbol: 'Ksh' },
  MWK: { position: 'prefix', symbol: 'MWK' },
  NGN: { position: 'prefix', symbol: '₦' },
  RWF: { position: 'prefix', symbol: 'RWF' },
  TZS: { position: 'prefix', symbol: 'TZS' },
  UGX: { position: 'prefix', symbol: 'USh' },
  USD: { position: 'prefix', symbol: '$' },
  USDC: { position: 'prefix', symbol: '$' },
  USDT: { position: 'prefix', symbol: '$' },
  ZMW: { position: 'prefix', symbol: 'ZMW' }
};