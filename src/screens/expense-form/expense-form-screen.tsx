import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { StyleSheet, Text, View } from "react-native";

import { TransactionForm } from "@/components/organisms/transaction-form";
import { useExpenses } from "@/hooks/use-expenses";
import { useTheme } from "@/hooks/use-theme";
import { ExpenseFormValues, expenseSchema } from "@/schemas/transaction-schema";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

export default function ExpenseFormScreen() {
  const { formatMessage } = useIntl();
  const colors = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    createMutation,
    isCreating,
    updateMutation,
    isUpdating,
    dataSingleExpense,
    isLoadingSingleExpense,
  } = useExpenses(undefined, id);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      value: 0,
      destination: "",
      reference: "",
      category_id: "",
      currency: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (id) {
        await updateMutation({
          id,
          value: values.value,
          destination: values.destination,
          reference: values.reference,
          category_id: values.category_id,
          currency: values.currency,
        });
        return router.push({
          pathname: "/details/[reference]",
          params: { reference: values.reference },
        });
      } else {
        await createMutation(values);
        return router.push("/");
      }
    } catch (error) {
      console.error(new Error(String(error)));
    }
  });

  useEffect(() => {
    if (dataSingleExpense && !isLoadingSingleExpense) {
      reset({
        value: dataSingleExpense.value ?? 0,
        destination: dataSingleExpense.destination ?? "",
        reference: dataSingleExpense.reference ?? "",
        category_id: dataSingleExpense.category_id ?? "",
        currency: dataSingleExpense.currency ?? "",
      });
    }
  }, [dataSingleExpense, isLoadingSingleExpense, reset]);

  if (isCreating || isUpdating || isLoadingSingleExpense)
    return (
      <Text style={{ color: colors.text }}>
        {formatMessage({ id: "create.update.loading" })}
      </Text>
    );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TransactionForm
        control={control}
        errors={errors}
        type="expense"
        secondFieldName="destination"
        secondFieldLabel={formatMessage({
          id: "create.update.expenses.destination",
        })}
        onSubmit={onSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
