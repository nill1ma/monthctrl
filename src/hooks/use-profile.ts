import { useAuth } from "@/context/auth";
import { useToast } from "@/context/toast";
import { getMyProfile, updateMyProfile } from "@/services/profiles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIntl } from "react-intl";

export function useProfile() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { formatMessage } = useIntl();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", session?.user.id],
    queryFn: getMyProfile,
    enabled: !!session,
  });

  const { mutateAsync: saveProfile, isPending: isProfileSaving } = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showToast(formatMessage({ id: "toast.profile.updated" }));
    },
    onError: () => {
      showToast(formatMessage({ id: "toast.error" }), "error");
    },
  });

  return {
    profile,
    isProfileLoading,
    saveProfile,
    isProfileSaving,
  };
}
