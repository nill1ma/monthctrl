import { useLocale } from "@/context/locale";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, StyleSheet, Text } from "react-native";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const colors = useTheme();

  function toggle() {
    setLocale(locale === "en" ? "es-ES" : "en");
  }

  return (
    <Pressable
      onPress={toggle}
      style={[styles.button, { backgroundColor: colors.backgroundElement }]}
    >
      <Text style={{ color: colors.text }}>
        {locale === "en" ? "🇪🇸 Español" : "🇬🇧 English"}
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
