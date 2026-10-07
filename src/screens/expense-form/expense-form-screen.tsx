import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { StyleSheet, View } from "react-native";

import { TransactionForm } from "@/components/organisms/transaction-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Spacing } from "@/constants/theme";
import { useExpenses } from "@/hooks/use-expenses";
import { useTheme } from "@/hooks/use-theme";
import { ExpenseFormValues, expenseSchema } from "@/schemas/transaction-schema";
import { getCurrentFeference } from "@/utils/text-format";
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
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      value: "0.00",
      destination: "",
      reference: getCurrentFeference(),
      category_id: "default-travel",
      currency: "BRL",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const numericValue = Number(values.value);
    try {
      if (id) {
        await updateMutation({
          id,
          value: numericValue,
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
        await createMutation({ ...values, value: numericValue });
        return router.push("/");
      }
    } catch (error) {
      console.error(new Error(String(error)));
    }
  });

  useEffect(() => {
    if (dataSingleExpense && !isLoadingSingleExpense) {
      reset({
        value: dataSingleExpense.value?.toString() ?? "0.00",
        destination: dataSingleExpense.destination ?? "",
        reference: dataSingleExpense.reference ?? "",
        category_id: dataSingleExpense.category_id ?? "",
        currency: dataSingleExpense.currency ?? "",
      });
    }
  }, [dataSingleExpense, isLoadingSingleExpense, reset]);

  if (isCreating || isUpdating || isLoadingSingleExpense)
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Skeleton
          width={200}
          height={20}
          style={{ marginBottom: Spacing.three }}
        />
        <Skeleton
          width="100%"
          height={50}
          style={{ marginBottom: Spacing.three }}
        />
        <Skeleton
          width="100%"
          height={50}
          style={{ marginBottom: Spacing.three }}
        />
        <Skeleton
          width="100%"
          height={50}
          style={{ marginBottom: Spacing.three }}
        />
        <Skeleton width={150} height={50} />
      </View>
    );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TransactionForm
        control={control}
        watch={watch}
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
