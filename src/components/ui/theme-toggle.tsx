import { Pressable, StyleSheet, Text } from "react-native";

import { useAppTheme } from "@/context/theme";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { scheme, setMode } = useAppTheme();
  const colors = useTheme();

  function toggle() {
    setMode(scheme === "dark" ? "light" : "dark");
  }

  return (
    <Pressable
      onPress={toggle}
      style={[styles.button, { backgroundColor: colors.backgroundElement }]}
    >
      <Text style={{ color: colors.text }}>
        {scheme === "dark" ? "☀️ Modo claro" : "🌙 Modo escuro"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
});
