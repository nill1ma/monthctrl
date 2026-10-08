import { Spacing } from "@/constants/theme";
import { useResetPassword } from "@/hooks/use-reset-password";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function ResetPasswordScreen() {
  const colors = useTheme();
  const { formatMessage } = useIntl();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const { resetPasswordMutate, isPending } = useResetPassword();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    try {
      const result = await resetPasswordMutate(password);
      if (result?.error) {
        setError(result.error);
      } else {
        router.replace("/");
      }
    } catch (e: any) {
      setError(e.message ?? formatMessage({ id: "forgotPassword.error" }));
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {formatMessage({ id: "resetPassword.title" })}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {formatMessage({ id: "resetPassword.subtitle" })}
      </Text>
      <TextInput
        style={[
          styles.textInput,
          {
            backgroundColor: colors.backgroundElement,
            borderColor: colors.backgroundSelected,
            color: colors.text,
          },
        ]}
        placeholder={formatMessage({ id: "login.passwordPlaceholder" })}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        disabled={isPending}
        title={
          isPending
            ? formatMessage({ id: "forgotPassword.submitting" })
            : formatMessage({ id: "resetPassword.submit" })
        }
        onPress={handleSubmit}
        color="#208AEF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: Spacing.six },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: Spacing.three,
    textAlign: "center",
  },
  subtitle: { fontSize: 14, marginBottom: Spacing.six, textAlign: "center" },
  textInput: {
    marginVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    fontSize: 16,
  },
  error: {
    fontSize: 14,
    marginTop: Spacing.two,
    textAlign: "center",
    color: "#EF4444",
  },
});
