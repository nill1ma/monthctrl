import { useToast } from "@/context/toast";
import {
  createExpense,
  deleteExpense,
  getExpenseById,
  getExpenseByReference,
  updateExpense,
} from "@/services/expenses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIntl } from "react-intl";
import { useBackupDebounce } from "./use-backup-debounce";

export function useExpenses(reference?: string, id?: string) {
  const queryClient = useQueryClient();
  const debounceBackup = useBackupDebounce();
  const { showToast } = useToast();
  const { formatMessage } = useIntl();

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
      debounceBackup();
      showToast(formatMessage({ id: "toast.expense.created" }));
    },
    onError: () => {
      showToast(formatMessage({ id: "toast.error" }), "error");
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
    mutationKey: ["update-expense", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({
        queryKey: ["incomings-expenses-transactions"],
      });
      queryClient.invalidateQueries({ queryKey: ["expense"] });
      queryClient.refetchQueries({ queryKey: ["details"] });
      debounceBackup();
      showToast(formatMessage({ id: "toast.expense.updated" }));
    },
    onError: () => {
      showToast(formatMessage({ id: "toast.error" }), "error");
    },
  });

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteExpense,
    mutationKey: ["delete-expense"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({
        queryKey: ["transactions-by-references"],
      });
      queryClient.invalidateQueries({
        queryKey: ["incomings-expenses-transactions"],
      });
      queryClient.refetchQueries({ queryKey: ["details"] });
      debounceBackup();
      showToast(formatMessage({ id: "toast.expense.deleted" }));
    },
    onError: () => {
      showToast(formatMessage({ id: "toast.error" }), "error");
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
