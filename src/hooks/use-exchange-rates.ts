import { useQuery } from "@tanstack/react-query";

import { fetchExchangeRates } from "@/services/exchange-rates";

export function useExchangeRates(base: string, targets: string[]) {
  const sortedTargets = [...targets].sort();

  return useQuery({
    queryKey: ["exchange-rates", base, sortedTargets.join(",")],
    queryFn: () => fetchExchangeRates(base, sortedTargets),
    enabled: sortedTargets.length > 0,
    staleTime: 1000 * 60 * 60,
  });
}
