import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
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
};

export function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  error,
  keyboardType,
  secureTextEntry,
  formEditValue,
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
            onChangeText={(text) =>
              onChange(
                keyboardType === "numeric"
                  ? Number(text)
                  : (text as unknown as string),
              )
            }
            value={
              formEditValue != null
                ? String(formEditValue)
                : value != null
                  ? String(value)
                  : ""
            }
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
