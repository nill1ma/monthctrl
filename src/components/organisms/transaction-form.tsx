import { Spacing } from "@/constants/theme";
import { Control, FieldValues, Path } from "react-hook-form";
import { useIntl } from "react-intl";
import { Button, StyleSheet, useColorScheme, View } from "react-native";

import { FormField } from "@/components/molecules/form-field";
import { MonthYearPicker } from "@/components/molecules/month-year-picker";
import { getCurrencyDecimals } from "@/lib/currency";
import { CategoryPicker } from "../molecules/category-picker";
import { CurrencyPicker } from "../molecules/currency-picker";

type TransactionFormProps<T extends FieldValues> = {
  control: Control<T>;
  errors: Partial<Record<keyof T, { message?: string }>>;
  watch: (name: Path<T>) => any;
  onSubmit: () => void;
  isSubmitting?: boolean;
  secondFieldName: Path<T>;
  secondFieldLabel: string;
  type: "incoming" | "expense";
};

export function TransactionForm<T extends FieldValues>({
  control,
  errors,
  watch,
  onSubmit,
  isSubmitting,
  secondFieldName,
  secondFieldLabel,
  type,
}: TransactionFormProps<T>) {
  const { formatMessage } = useIntl();
  const colorScheme = useColorScheme();

  const currency = watch("currency" as Path<T>);
  const decimals = currency ? getCurrencyDecimals(currency) : 2;

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
      <CurrencyPicker
        control={control}
        name={"currency" as Path<T>}
        label={formatMessage({ id: "form.currency" })}
        error={errors.currency?.message}
      />
      <FormField
        control={control}
        name={"value" as Path<T>}
        label={formatMessage({ id: "form.value" })}
        keyboardType="numeric"
        error={errors.value?.message}
        decimals={decimals}
      />

      <CategoryPicker
        control={control}
        name={"category_id" as Path<T>}
        label={formatMessage({ id: "form.category" })}
        error={errors.category_id?.message}
        type={type}
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
