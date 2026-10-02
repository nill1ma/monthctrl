export async function fetchExchangeRates(
  base: string,
  targets: string[],
): Promise<Record<string, number>> {
  if (targets.length === 0) return {};

  const response = await fetch(
    `https://api.frankfurter.app/latest?from=${base}&to=${targets.join(",")}`,
  );

  if (!response.ok) throw new Error("Failed to fetch exchange rates");

  const data = await response.json();
  return data.rates as Record<string, number>;
}
