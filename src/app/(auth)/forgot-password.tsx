import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { requestPasswordReset } from "@/services/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function ForgotPasswordScreen() {
  const colors = useTheme();
  const { formatMessage } = useIntl();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (e: any) {
      setError(e.message ?? formatMessage({ id: "forgotPassword.error" }));
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {formatMessage({ id: "forgotPassword.sent.title" })}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {formatMessage({ id: "forgotPassword.sent.message" })}
        </Text>
        <Button
          title={formatMessage({ id: "forgotPassword.backToLogin" })}
          onPress={() => router.replace("/login")}
          color="#208AEF"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {formatMessage({ id: "forgotPassword.title" })}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {formatMessage({ id: "forgotPassword.subtitle" })}
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
        placeholder={formatMessage({ id: "login.emailPlaceholder" })}
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        title={
          loading
            ? formatMessage({ id: "forgotPassword.submitting" })
            : formatMessage({ id: "forgotPassword.submit" })
        }
        onPress={handleSubmit}
        disabled={loading}
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
