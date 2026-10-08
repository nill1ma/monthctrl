import { resetPassword } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";

export function useResetPassword() {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (newPassword: string) => resetPassword(newPassword),
  });

  return { resetPasswordMutate: mutateAsync, isPending, error };
}
