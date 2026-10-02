import { useAuth } from "@/context/auth";
import {
  getDistinctReferences,
  getTransactionsByReferences,
} from "@/services/list";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const PAGE_SIZE = 5;

export function useListTransactions() {
  const { session } = useAuth();

  // ─────────────────────────────────────────────
  // Query 1: paginação por reference
  // ─────────────────────────────────────────────
  const referencesQuery = useInfiniteQuery({
    queryKey: ["transaction-references", session?.user.id],
    queryFn: ({ pageParam = 1 }) =>
      getDistinctReferences(pageParam, session!.user.id, PAGE_SIZE),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (sum, page) => sum + page.references.length,
        0,
      );
      return loaded < lastPage.totalElements ? allPages.length + 1 : undefined;
    },
    enabled: !!session,
    initialPageParam: 1,
  });

  const references = useMemo(
    () =>
      Array.from(
        new Set(referencesQuery.data?.pages.flatMap((p) => p.references) ?? []),
      ),
    [referencesQuery.data],
  );

  // ─────────────────────────────────────────────
  // Query 2: dados da view para as references
  // ─────────────────────────────────────────────
  const transactionsQuery = useQuery({
    queryKey: ["transactions-by-references", session?.user.id, references],
    queryFn: () => getTransactionsByReferences(references, session!.user.id),
    enabled: !!session && references.length > 0,
  });

  return {
    references,
    transactions: transactionsQuery.data ?? [],
    isLoading: referencesQuery.isLoading || transactionsQuery.isLoading,
    isError: referencesQuery.isError || transactionsQuery.isError,
    fetchNextPage: referencesQuery.fetchNextPage,
    hasNextPage: referencesQuery.hasNextPage,
    isFetchingNextPage: referencesQuery.isFetchingNextPage,
  };
}
