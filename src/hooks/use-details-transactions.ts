import { getExpenseByReference } from "@/services/expenses";
import { getIncomingByReference } from "@/services/incomings";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

export function useDetailsTransactions() {
  const { reference } = useLocalSearchParams<{ reference: string }>();

  const query = useQuery({
    queryKey: ["details", reference],
    queryFn: async () => {
      const [incomings, outgoings] = await Promise.all([
        getIncomingByReference(reference),
        getExpenseByReference(reference),
      ]);
      return { incomings, outgoings };
    },
    enabled: !!reference,
  });

  return {
    reference,
    incomings: query.data?.incomings,
    expenses: query.data?.outgoings,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
