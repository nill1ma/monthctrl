import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

import { TransactionForm } from "@/components/organisms/transaction-form";
import { useIncomings } from "@/hooks/use-incomings";
import { useTheme } from "@/hooks/use-theme";
import {
  IncomingFormValues,
  incomingSchema,
} from "@/schemas/transaction-schema";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function IncomingFormScreen() {
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IncomingFormValues>({
    resolver: zodResolver(incomingSchema),
    defaultValues: {
      value: 0,
      origin: "",
      reference: "",
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
    if (dataSingleIncoming && !isLoadingSingleIncoming) {
      reset({
        value: dataSingleIncoming.value ?? 0,
        origin: dataSingleIncoming.origin ?? "",
        reference: dataSingleIncoming.reference ?? "",
      });
    }
  }, [dataSingleIncoming, isLoadingSingleIncoming, reset]);

  if (isCreating || isUpdating || isLoadingSingleIncoming)
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
        secondFieldName="origin"
        secondFieldLabel="Origem"
        onSubmit={onSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
