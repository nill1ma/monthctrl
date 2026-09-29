import {
    createExpense,
    deleteExpense,
    getExpenseById,
    getExpenseByReference,
    updateExpense,
} from "@/services/expenses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useExpenses(reference?: string, id?: string) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["expenses", reference],
    queryFn: () => getExpenseByReference(reference!),
    enabled: !!reference,
  });

  const { mutateAsync: createMutation, isPending: isCreating } = useMutation({
    mutationFn: createExpense,
    mutationKey: ["create-expense"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({
        queryKey: ["incomings-expenses-transactions"],
      });
    },
  });

  const { data: dataSingleExpense, isLoading: isLoadingSingleExpense } =
    useQuery({
      queryKey: ["expense", id],
      queryFn: () => getExpenseById(id!),
      enabled: !!id,
    });

  const { mutateAsync: updateMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateExpense,
    mutationKey: ["update-expense"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({
        queryKey: ["incomings-expenses-transactions"],
      });
    },
  });

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteExpense,
    mutationKey: ["delete-expense"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({
        queryKey: ["incomings-expenses-transactions"],
      });
    },
  });

  return {
    data,
    isLoading,
    deleteMutation: mutate,
    isDeleting,
    createMutation,
    isCreating,
    updateMutation,
    isUpdating,
    dataSingleExpense,
    isLoadingSingleExpense,
  };
}
