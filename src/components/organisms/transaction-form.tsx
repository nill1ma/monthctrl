import { Spacing } from "@/constants/theme";
import { Control, FieldValues, Path } from "react-hook-form";
import { useIntl } from "react-intl";
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
  const { formatMessage } = useIntl();
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <MonthYearPicker
        control={control}
        name={"reference" as Path<T>}
        label={formatMessage({ id: "form.reference" })}
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
        label={formatMessage({ id: "form.value" })}
        keyboardType="numeric"
        error={errors.value?.message}
      />
      <Button
        title={
          isSubmitting
            ? formatMessage({ id: "form.saving" })
            : formatMessage({ id: "form.save" })
        }
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
