import { Picker } from "@react-native-picker/picker";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";

const MONTH_LABELS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function buildOptions() {
  const currentYear = new Date().getFullYear();
  const options: { value: string; label: string }[] = [];

  for (let year = currentYear - 2; year <= currentYear + 3; year++) {
    MONTH_LABELS.forEach((label, index) => {
      const month = String(index + 1).padStart(2, "0");
      options.push({ value: `${year}-${month}`, label: `${label} ${year}` });
    });
  }

  return options;
}

const OPTIONS = buildOptions();

type MonthYearPickerProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  error?: string;
  formEditValue?: string;
};

export function MonthYearPicker<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  error,
  formEditValue,
}: MonthYearPickerProps<TFieldValues>) {
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
              selectedValue={formEditValue || value}
              onValueChange={onChange}
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
