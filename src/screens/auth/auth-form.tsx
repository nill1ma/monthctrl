import { GoogleSignInButton } from "@/components/molecules/google-signin-button";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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
  footer?: React.ReactNode;
};

export function AuthForm({
  title,
  emailPlaceholder,
  passwordPlaceholder,
  submitLabel,
  submitLabelLoading,
  onSubmit,
  children,
  footer,
}: AuthFormProps) {
  const colors = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={StyleSheet.flatten([
            styles.textInput,
            styles.passwordInput,
            {
              backgroundColor: colors.backgroundElement,
              borderColor: colors.backgroundSelected,
              color: colors.text,
            },
          ])}
          placeholder={passwordPlaceholder}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <Pressable
          onPress={() => setShowPassword((prev) => !prev)}
          style={styles.eyeButton}
          hitSlop={8}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={colors.textSecondary}
          />
        </Pressable>
      </View>
      {error && (
        <Text style={StyleSheet.flatten([styles.error, { color: "#EF4444" }])}>
          {error}
        </Text>
      )}
      <GoogleSignInButton />
      <Button
        title={loading ? submitLabelLoading : submitLabel}
        onPress={handleSubmit}
        disabled={loading}
        color={"#208AEF"}
      />
      <View style={[styles.links, { backgroundColor: colors.background }]}>
        {children}
        {footer}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  links: {
    marginTop: Spacing.two,
    gap: Spacing.three,
    alignItems: "center",
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
  passwordContainer: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    paddingRight: 48, // espaço para o ícone
  },
  eyeButton: {
    position: "absolute",
    right: 12,
  },
  error: { fontSize: 14, marginTop: Spacing.two, textAlign: "center" },
});
