import { Picker } from "@react-native-picker/picker";
import { StyleSheet, View } from "react-native";

import { useLocale } from "@/context/locale";
import { useTheme } from "@/hooks/use-theme";

const LANGUAGE_OPTIONS = [
  { value: "en", label: "🇬🇧 English" },
  { value: "es-ES", label: "🇪🇸 Español" },
  { value: "pt-BR", label: "🇧🇷 Português" },
] as const;

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const colors = useTheme();

  return (
    <View
      style={[styles.wrapper, { backgroundColor: colors.backgroundElement }]}
    >
      <Picker
        selectedValue={locale}
        onValueChange={setLocale}
        style={{ color: colors.text }}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderRadius: 8, overflow: "hidden", minWidth: 140 },
});
