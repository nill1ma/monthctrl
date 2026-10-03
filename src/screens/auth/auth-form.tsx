import { Colors, Spacing } from "@/constants/theme";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

type AuthFormProps = {
  title: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  submitLabel: string;
  submitLabelLoading: string;
  onSubmit: (email: string, password: string) => Promise<{ error?: string }>;
  children?: React.ReactNode;
};

export function AuthForm({
  title,
  emailPlaceholder,
  passwordPlaceholder,
  submitLabel,
  submitLabelLoading,
  onSubmit,
  children,
}: AuthFormProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    const result = await onSubmit(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    }
  }

  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        { backgroundColor: colors.background },
      ])}
    >
      <Text style={StyleSheet.flatten([styles.title, { color: colors.text }])}>
        {title}
      </Text>

      <TextInput
        style={StyleSheet.flatten([
          styles.textInput,
          {
            backgroundColor: colors.backgroundElement,
            borderColor: colors.backgroundSelected,
            color: colors.text,
          },
        ])}
        placeholder={emailPlaceholder}
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={StyleSheet.flatten([
          styles.textInput,
          {
            backgroundColor: colors.backgroundElement,
            borderColor: colors.backgroundSelected,
            color: colors.text,
          },
        ])}
        placeholder={passwordPlaceholder}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error && (
        <Text style={StyleSheet.flatten([styles.error, { color: "#EF4444" }])}>
          {error}
        </Text>
      )}

      <Button
        title={loading ? submitLabelLoading : submitLabel}
        onPress={handleSubmit}
        disabled={loading}
        color={colorScheme === "dark" ? "#208AEF" : "#0066CC"}
      />
      <Text
        style={StyleSheet.flatten([
          styles.login_signup_link,
          {
            backgroundColor: colors.background,
            color: colors.text,
          },
        ])}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  login_signup_link: {
    marginTop: Spacing.two,
    gap: Spacing.five,
  },
  container: { flex: 1, justifyContent: "center", padding: Spacing.six },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: Spacing.six,
    textAlign: "center",
  },
  textInput: {
    marginVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    fontSize: 16,
  },
  error: { fontSize: 14, marginTop: Spacing.two, textAlign: "center" },
});
