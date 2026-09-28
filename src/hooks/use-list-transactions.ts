import { useAuth } from "@/context/auth";
import { getIncomingsExpensesTransactions } from "@/services/list";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useListTransactions() {
  const { session } = useAuth();

  const query = useInfiniteQuery({
    queryKey: ["transactions", session?.user.id],
    queryFn: ({ pageParam }) =>
      getIncomingsExpensesTransactions(pageParam, session!.user.id),
    getNextPageParam: (lastPage, allPages) =>
      allPages.length * 2 < lastPage.totalElements
        ? allPages.length + 1
        : undefined,
    enabled: !!session,
    initialPageParam: 1,
  });

  const transactions = query.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    transactions,
    isLoading: query.isLoading,
    isError: query.isError,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
