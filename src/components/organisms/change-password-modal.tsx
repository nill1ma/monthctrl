import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { Button, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { FormField } from "@/components/molecules/form-field";
import { useTheme } from "@/hooks/use-theme";
import {
    ChangePasswordFormValues,
    changePasswordSchema,
} from "@/schemas/change-password-schema";

import { useChangePassword } from "@/hooks/use-change-password";

type ChangePasswordModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function ChangePasswordModal({
  visible,
  onClose,
}: ChangePasswordModalProps) {
  const colors = useTheme();
  const { formatMessage } = useIntl();
  const { submitChangePassword, isLoading, error, clearError } =
    useChangePassword();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ChangePasswordFormValues) {
    const success = await submitChangePassword(
      values.currentPassword,
      values.newPassword,
    );

    if (success) {
      reset();
      onClose();
    }
  }

  function handleClose() {
    reset();
    clearError();
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable
          style={[styles.card, { backgroundColor: colors.backgroundElement }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            {formatMessage({ id: "profile.changePassword" })}
          </Text>

          <FormField
            control={control}
            name="currentPassword"
            label={formatMessage({ id: "profile.currentPassword" })}
            error={errors.currentPassword?.message}
            secureTextEntry
          />
          <FormField
            control={control}
            name="newPassword"
            label={formatMessage({ id: "profile.newPassword" })}
            error={errors.newPassword?.message}
            secureTextEntry
          />
          <FormField
            control={control}
            name="confirmPassword"
            label={formatMessage({ id: "profile.confirmPassword" })}
            error={errors.confirmPassword?.message}
            secureTextEntry
          />

          {error && (
            <Text style={[styles.error, { color: "#EF4444" }]}>{error}</Text>
          )}

          <View style={styles.buttons}>
            <Button
              title={formatMessage({ id: "settings.close" })}
              onPress={handleClose}
              color={colors.textSecondary}
            />
            <Button
              title={
                isLoading
                  ? formatMessage({ id: "form.saving" })
                  : formatMessage({ id: "profile.changePassword" })
              }
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              color="#208AEF"
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    borderRadius: 16,
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  error: {
    fontSize: 14,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
});
