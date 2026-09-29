import { Spacing } from "@/constants/theme";
import { Control, FieldValues, Path } from "react-hook-form";
import { Button, StyleSheet, useColorScheme, View } from "react-native";

import { FormField } from "@/components/molecules/form-field";
import { MonthYearPicker } from "@/components/molecules/month-year-picker";

type TransactionFormProps<T extends FieldValues> = {
  control: Control<T>;
  errors: Partial<Record<keyof T, { message?: string }>>;
  onSubmit: () => void;
  isSubmitting?: boolean;
  secondFieldName: Path<T>;
  secondFieldLabel: string;
};

export function TransactionForm<T extends FieldValues>({
  control,
  errors,
  onSubmit,
  isSubmitting,
  secondFieldName,
  secondFieldLabel,
}: TransactionFormProps<T>) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <MonthYearPicker
        control={control}
        name={"reference" as Path<T>}
        label="Referência"
        error={errors.reference?.message}
      />
      <FormField
        control={control}
        name={secondFieldName}
        label={secondFieldLabel}
        error={errors[secondFieldName]?.message}
      />
      <FormField
        control={control}
        name={"value" as Path<T>}
        label="Valor"
        keyboardType="numeric"
        error={errors.value?.message}
      />
      <Button
        title={isSubmitting ? "Salvando..." : "Salvar"}
        onPress={onSubmit}
        disabled={isSubmitting}
        color={colorScheme === "dark" ? "#208AEF" : "#0066CC"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.four,
  },
});
