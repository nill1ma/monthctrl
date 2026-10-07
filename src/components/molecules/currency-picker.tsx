import { Picker } from "@react-native-picker/picker";
import * as currencyCodes from "currency-codes";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";

const RELEVANT_CODES = ["CAD", "USD", "EUR", "GBP", "BRL"];

const OPTIONS = RELEVANT_CODES.map((code) => {
  const info = currencyCodes.code(code);
  return { value: code, label: `${code} — ${info?.currency ?? code}` };
});

type CurrencyPickerProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  error?: string;
};

export function CurrencyPicker<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  error,
}: CurrencyPickerProps<TFieldValues>) {
  const colors = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={styles.container}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          <View
            style={[
              styles.pickerWrapper,
              { backgroundColor: colors.backgroundElement },
            ]}
          >
            <Picker
              selectedValue={value || "BRL"}
              onValueChange={onChange}
              style={{ color: colors.text }}
              dropdownIconColor={colors.text}
            >
              {OPTIONS.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  style={{
                    color: colors.text,
                    backgroundColor: colors.backgroundElement,
                  }}
                />
              ))}
            </Picker>
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 4, fontWeight: "500" },
  pickerWrapper: { borderRadius: 8, overflow: "hidden" },
  error: { color: "red", fontSize: 12, marginTop: 4 },
});
