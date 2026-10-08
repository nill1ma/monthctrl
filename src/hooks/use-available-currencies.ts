import { useAuth } from "@/context/auth";
import { getCurrenciesInRange } from "@/services/currency-totals";
import { useQuery } from "@tanstack/react-query";

export function useAvailableCurrencies(
  referenceStart: string,
  referenceEnd: string,
) {
  const { session } = useAuth();

  const { data: currencies = [] } = useQuery({
    queryKey: [
      "currencies",
      "range",
      session?.user.id,
      referenceStart,
      referenceEnd,
    ],
    queryFn: () =>
      getCurrenciesInRange(session!.user.id, referenceStart, referenceEnd),
    enabled: !!session?.user.id && !!referenceStart && !!referenceEnd,
  });

  return { currencies };
}
