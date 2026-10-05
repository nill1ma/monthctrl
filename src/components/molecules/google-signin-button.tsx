import { useAuth } from "@/context/auth";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { useIntl } from "react-intl";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

export function GoogleSignInButton() {
  const { signInWithGoogle } = useAuth()!;
  const colors = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { formatMessage } = useIntl();

  const handlePress = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message ?? "Erro ao entrar com Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Pressable
        onPress={handlePress}
        disabled={loading}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: colors.backgroundElement,
            borderColor: colors.backgroundSelected,
            opacity: pressed || loading ? 0.7 : 1,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={[styles.text, { color: colors.text }]}>
            {formatMessage({ id: "login.google" })}
          </Text>
        )}
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#EF4444",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
