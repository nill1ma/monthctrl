import { useLocale } from "@/context/locale";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, StyleSheet, Text } from "react-native";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const colors = useTheme();

  function toggle() {
    const locales: Array<"en" | "es-ES" | "pt-BR"> = ["en", "es-ES", "pt-BR"];
    const currentIndex = locales.indexOf(locale);
    const nextIndex = (currentIndex + 1) % locales.length;
    setLocale(locales[nextIndex]);
  }

  const getFlag = () => {
    switch (locale) {
      case "en":
        return "🇬🇧 English";
      case "es-ES":
        return "🇪🇸 Español";
      case "pt-BR":
        return "🇧🇷 Português";
    }
  };

  return (
    <Pressable
      onPress={toggle}
      style={[styles.button, { backgroundColor: colors.backgroundElement }]}
    >
      <Text style={{ color: colors.text }}>{getFlag()}</Text>
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
