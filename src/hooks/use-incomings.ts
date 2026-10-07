import { useToast } from "@/context/toast";
import {
  createIncoming,
  deleteIncoming,
  deleteIncomingsByReference,
  getIncomingByReference,
  getIncomingsById,
  updateIncoming,
} from "@/services/incomings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIntl } from "react-intl";
import { useBackupDebounce } from "./use-backup-debounce";

export function useIncomings(reference?: string, id?: string) {
  const queryClient = useQueryClient();
  const debounceBackup = useBackupDebounce();
  const { showToast } = useToast();
  const { formatMessage } = useIntl();

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
      debounceBackup();
      showToast(formatMessage({ id: "toast.incoming.created" }));
    },
    onError: () => {
      showToast(formatMessage({ id: "toast.error" }), "error");
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
      debounceBackup();
      showToast(formatMessage({ id: "toast.incoming.updated" }));
    },
    onError: () => {
      showToast(formatMessage({ id: "toast.error" }), "error");
    },
  });

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteIncoming,
    mutationKey: ["delete-incoming"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomings"] });
      queryClient.invalidateQueries({
        queryKey: ["transactions-by-references"],
      });
      queryClient.invalidateQueries({
        queryKey: ["incomings-expenses-transactions"],
      });
      queryClient.refetchQueries({ queryKey: ["details"] });
      debounceBackup();
      showToast(formatMessage({ id: "toast.incoming.deleted" }));
    },
    onError: () => {
      showToast(formatMessage({ id: "toast.error" }), "error");
    },
  });

  const {
    mutate: deleteIncomingsByReferenceMutate,
    isPending: isDeletingByReference,
  } = useMutation({
    mutationFn: deleteIncomingsByReference,
    mutationKey: ["delete-incomings-by-reference"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomings"] });
      queryClient.invalidateQueries({
        queryKey: ["transactions-by-references"],
      });
      queryClient.invalidateQueries({
        queryKey: ["incomings-expenses-transactions"],
      });
      queryClient.refetchQueries({ queryKey: ["details"] });
      debounceBackup();
      showToast(formatMessage({ id: "toast.incoming.deleted" }));
    },
    onError: () => {
      showToast(formatMessage({ id: "toast.error" }), "error");
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
    deleteIncomingsByReferenceMutate,
    isDeletingByReference,
  };
}
