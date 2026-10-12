import { useAuth } from "@/context/auth";
import { getExpenseByReference } from "@/services/expenses";
import { getIncomingByReference } from "@/services/incomings";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

export function useDetailsTransactions() {
  const { reference } = useLocalSearchParams<{ reference: string }>();
  const { session } = useAuth();

  const query = useQuery({
    queryKey: ["details", reference, session?.user.id],
    queryFn: async () => {
      const [incomings, outgoings] = await Promise.all([
        getIncomingByReference(reference),
        getExpenseByReference(reference),
      ]);
      return { incomings, outgoings };
    },
    enabled: !!reference && !!session?.user.id,
  });

  return {
    reference,
    incomings: query.data?.incomings,
    expenses: query.data?.outgoings,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
