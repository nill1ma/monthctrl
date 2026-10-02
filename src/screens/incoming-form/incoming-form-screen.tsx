import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { StyleSheet, Text, View } from "react-native";

import { TransactionForm } from "@/components/organisms/transaction-form";
import { useIncomings } from "@/hooks/use-incomings";
import { useTheme } from "@/hooks/use-theme";
import {
  IncomingFormValues,
  incomingSchema,
} from "@/schemas/transaction-schema";
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
      value: 0,
      origin: "",
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
        await createMutation(values);
        return router.push("/");
      }
    } catch (error) {
      console.error(new Error(String(error)));
    }
  });

  useEffect(() => {
    if (dataSingleIncoming && !isLoadingSingleIncoming) {
      reset({
        value: dataSingleIncoming.value ?? 0,
        origin: dataSingleIncoming.origin ?? "",
        reference: dataSingleIncoming.reference ?? "",
        category_id: dataSingleIncoming.category_id ?? "",
        currency: dataSingleIncoming.currency ?? "",
      });
    }
  }, [dataSingleIncoming, isLoadingSingleIncoming, reset]);

  if (isCreating || isUpdating || isLoadingSingleIncoming)
    return (
      <Text style={{ color: colors.text }}>
        {formatMessage({ id: "create.update.loading" })}
      </Text>
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
