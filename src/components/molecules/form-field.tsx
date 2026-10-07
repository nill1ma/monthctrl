import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { applyCurrencyMask } from "@/lib/currency";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type FormFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  formEditValue?: string | number;
  decimals?: number;
};

export function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  error,
  keyboardType,
  secureTextEntry,
  formEditValue,
  decimals,
}: FormFieldProps<TFieldValues>) {
  const colors = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.container}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          <TextInput
            style={[
              {
                ...styles.input,
                backgroundColor: colors.backgroundElement,
                color: colors.text,
              },
              error && styles.inputError,
              {
                borderColor: error ? "#EF4444" : colors.backgroundSelected,
              },
            ]}
            onBlur={onBlur}
            onChangeText={(text) => {
              if (decimals !== undefined) {
                onChange(applyCurrencyMask(text, decimals)); // string, sem Number()
              } else {
                onChange(text);
              }
            }}
            value={value != null ? String(value) : ""}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            placeholderTextColor={colors.textSecondary}
          />
          {error && (
            <Text style={[styles.error, { color: "#EF4444" }]}>{error}</Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.three },
  label: { fontSize: 14, marginBottom: Spacing.one, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    fontSize: 16,
  },
  inputError: { borderColor: "#EF4444" },
  error: { fontSize: 12, marginTop: Spacing.one },
});

// function sanitizeDecimalInput(text: string, decimals: number): string {
//   const normalized = text.replace(",", ".");
//   const [intPart, decPart] = normalized.split(".");
//   if (decPart === undefined) return normalized;
//   return `${intPart}.${decPart.slice(0, decimals)}`;
// }
