import { useAuth } from "@/context/auth";
import { useToast } from "@/context/toast";
import { changePassword } from "@/services/auth";
import { useState } from "react";
import { useIntl } from "react-intl";

export function useChangePassword() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { formatMessage } = useIntl();

  async function submitChangePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    setError(null);
    setIsLoading(true);

    const result = await changePassword(
      session!.user.email!,
      currentPassword,
      newPassword,
    );

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      showToast(formatMessage({ id: "toast.error" }), "error");
      return false;
    }

    showToast(formatMessage({ id: "toast.password.changed" }));
    return true;
  }

  return {
    submitChangePassword,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
