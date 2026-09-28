import { Colors, Spacing } from "@/constants/theme";
import { login } from "@/services/auth";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    const result = await login(email, password);
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
        Bem-vindo
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
        placeholder="Email"
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
        placeholder="Senha"
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
        title={loading ? "Entrando..." : "Entrar"}
        onPress={handleSubmit}
        disabled={loading}
        color={colorScheme === "dark" ? "#208AEF" : "#0066CC"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.six,
  },
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
  error: {
    fontSize: 14,
    marginTop: Spacing.two,
    textAlign: "center",
  },
});
