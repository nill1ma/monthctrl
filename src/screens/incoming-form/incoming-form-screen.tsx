import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { StyleSheet, View } from "react-native";

import { TransactionForm } from "@/components/organisms/transaction-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Spacing } from "@/constants/theme";
import { useIncomings } from "@/hooks/use-incomings";
import { useTheme } from "@/hooks/use-theme";
import {
  IncomingFormValues,
  incomingSchema,
} from "@/schemas/transaction-schema";
import { getCurrentFeference } from "@/utils/text-format";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function IncomingFormScreen() {
  const { formatMessage } = useIntl();
  const colors = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    createMutation,
    isCreating,
    updateMutation,
    isUpdating,
    dataSingleIncoming,
    isLoadingSingleIncoming,
  } = useIncomings(undefined, id);

  const router = useRouter();

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IncomingFormValues>({
    resolver: zodResolver(incomingSchema),
    defaultValues: {
      value: "0.00",
      origin: "",
      reference: getCurrentFeference(),
      category_id: "default-salary",
      currency: "BRL",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const numericValue = Number(values.value); // converte aqui
    try {
      if (id) {
        await updateMutation({
          id,
          value: numericValue,
          origin: values.origin,
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
    if (dataSingleIncoming && !isLoadingSingleIncoming) {
      reset({
        value: dataSingleIncoming.value?.toString() ?? "0.00",
        origin: dataSingleIncoming.origin ?? "",
        reference: dataSingleIncoming.reference ?? "",
        category_id: dataSingleIncoming.category_id ?? "",
        currency: dataSingleIncoming.currency ?? "BRL",
      });
    }
  }, [dataSingleIncoming, isLoadingSingleIncoming, reset]);

  if (isCreating || isUpdating || isLoadingSingleIncoming)
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
        type="incoming"
        secondFieldName="origin"
        secondFieldLabel={formatMessage({
          id: "create.update.incomings.origin",
        })}
        onSubmit={onSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
