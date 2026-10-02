import {
  createIncoming,
  deleteIncoming,
  getIncomingByReference,
  getIncomingsById,
  updateIncoming,
} from "@/services/incomings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useIncomings(reference?: string, id?: string) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["incomings", reference],
    queryFn: () => getIncomingByReference(reference!),
    enabled: !!reference,
  });

  const { data: dataSingleIncoming, isLoading: isLoadingSingleIncoming } =
    useQuery({
      queryKey: ["incoming", id],
      queryFn: () => getIncomingsById(id!),
      enabled: !!id,
    });

  const { mutateAsync: createMutation, isPending: isCreating } = useMutation({
    mutationFn: createIncoming,
    mutationKey: ["create-incoming"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomings"] });
      queryClient.invalidateQueries({
        queryKey: ["incomings-expenses-transactions"],
      });
      queryClient.invalidateQueries({ queryKey: ["transaction-references"] });
      queryClient.invalidateQueries({
        queryKey: ["transactions-by-references"],
      });
    },
  });

  const { mutateAsync: updateMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateIncoming,
    mutationKey: ["update-incoming"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomings"] });
      queryClient.invalidateQueries({
        queryKey: ["incomings-expenses-transactions"],
      });
      queryClient.invalidateQueries({ queryKey: ["incoming"] });
      queryClient.refetchQueries({ queryKey: ["details"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-references"] });
      queryClient.invalidateQueries({
        queryKey: ["transactions-by-references"],
      });
    },
  });

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteIncoming,
    mutationKey: ["delete-incoming"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomings"] });
      queryClient.invalidateQueries({
        queryKey: ["incomings-expenses-transactions"],
      });
    },
  });

  return {
    data,
    isLoading,
    dataSingleIncoming,
    isLoadingSingleIncoming,
    deleteMutation: mutate,
    createMutation,
    updateMutation,
    isCreating,
    isDeleting,
    isUpdating,
  };
}
