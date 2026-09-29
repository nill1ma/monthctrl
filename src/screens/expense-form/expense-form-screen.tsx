import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

import { TransactionForm } from "@/components/organisms/transaction-form";
import { useExpenses } from "@/hooks/use-expenses";
import { useTheme } from "@/hooks/use-theme";
import { ExpenseFormValues, expenseSchema } from "@/schemas/transaction-schema";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function ExpenseFormScreen() {
  const colors = useTheme();

  const { id } = useLocalSearchParams<{ id: string }>();

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
    },
  });

  const {
    createMutation,
    isCreating,
    updateMutation,
    isUpdating,
    dataSingleExpense,
    isLoadingSingleExpense,
  } = useExpenses();

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (id) {
        await updateMutation({
          id,
          value: values.value,
          destination: values.destination,
          reference: values.reference,
        });
      } else {
        await createMutation(values);
      }
      return <Redirect href="/" />;
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
      });
    }
  }, [dataSingleExpense, isLoadingSingleExpense, reset]);

  if (isCreating || isUpdating || isLoadingSingleExpense)
    return (
      <Text style={{ color: colors.text }}>
        Wait, we are finishing this operation...
      </Text>
    );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TransactionForm
        control={control}
        errors={errors}
        secondFieldName="destination"
        secondFieldLabel="Destino"
        onSubmit={onSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
