import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/auth";
import { getCurrencyTotals } from "@/services/currency-totals";

export function useCurrencyTotals() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["currency-totals", session?.user.id],
    queryFn: () => getCurrencyTotals(session!.user.id),
    enabled: !!session,
  });
}
