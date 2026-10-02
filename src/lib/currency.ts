const CURRENCY_FLAGS: Record<string, string> = {
  CAD: "🇨🇦",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  USD: "🇺🇸",
  BRL: "🇧🇷",
};

export function getCurrencyFlag(currencyCode: string): string {
  return CURRENCY_FLAGS[currencyCode] ?? "💱";
}

export function getCurrencyDecimals(currencyCode: string): number {
  const { maximumFractionDigits } = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).resolvedOptions();

  return maximumFractionDigits ?? 2;
}

export function convertToDisplayCurrency(
  amount: number,
  fromCurrency: string,
  displayCurrency: string,
  rates: Record<string, number>,
): number | null {
  if (fromCurrency === displayCurrency) return amount;

  const rate = rates[fromCurrency];
  if (!rate) return null;

  return amount / rate;
}

export function applyCurrencyMask(rawText: string, decimals: number): string {
  const digits = rawText.replace(/\D/g, "");
  if (!digits) return "";

  if (decimals === 0) {
    return String(Number(digits));
  }

  const padded = digits.padStart(decimals + 1, "0");
  const intPart = padded.slice(0, -decimals).replace(/^0+(?=\d)/, "");
  const decPart = padded.slice(-decimals);

  return `${intPart}.${decPart}`;
}

export function formatCurrency(
  value: number,
  currencyCode: string,
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}
