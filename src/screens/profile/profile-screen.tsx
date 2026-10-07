import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { z } from "zod";

import { CurrencySelect } from "@/components/molecules/currency-select";
import { FormField } from "@/components/molecules/form-field";
import { ChangePasswordModal } from "@/components/organisms/change-password-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Spacing } from "@/constants/theme";
import { useProfile } from "@/hooks/use-profile";
import { useTheme } from "@/hooks/use-theme";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nickname: z.string().optional(),
  preferred_currency: z.string().min(1, "Currency is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const CURRENCY_OPTIONS = ["BRL", "CAD", "USD", "EUR", "GBP"];

export default function ProfileScreen() {
  const colors = useTheme();
  const { formatMessage } = useIntl();

  const { profile, isProfileLoading, saveProfile, isProfileSaving } =
    useProfile();
  const [showChangePassword, setShowChangePassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      nickname: "",
      preferred_currency: "BRL",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? "",
        nickname: profile.nickname ?? "",
        preferred_currency: profile.preferred_currency ?? "BRL",
      });
    }
  }, [profile, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await saveProfile(values);
  });

  if (isProfileLoading)
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <Skeleton
          width={150}
          height={20}
          style={{ marginBottom: Spacing.three }}
        />
        <Skeleton
          width="100%"
          height={50}
          style={{ marginBottom: Spacing.three }}
        />
        <Skeleton
          width={150}
          height={20}
          style={{ marginBottom: Spacing.three }}
        />
        <Skeleton
          width="100%"
          height={50}
          style={{ marginBottom: Spacing.three }}
        />
        <Skeleton
          width={120}
          height={20}
          style={{ marginBottom: Spacing.three }}
        />
        <Skeleton
          width="100%"
          height={50}
          style={{ marginBottom: Spacing.three }}
        />
        <Skeleton width={150} height={50} style={{ marginTop: Spacing.four }} />
        <Skeleton width={150} height={50} style={{ marginTop: Spacing.four }} />
      </ScrollView>
    );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <FormField
        control={control}
        name="name"
        label={formatMessage({ id: "profile.name" })}
        error={errors.name?.message}
      />
      <FormField
        control={control}
        name="nickname"
        label={formatMessage({ id: "profile.nickname" })}
        error={errors.nickname?.message}
      />
      <Text style={[styles.label, { color: colors.text }]}>
        {formatMessage({ id: "profile.currency" })}
      </Text>
      <Controller
        control={control}
        name="preferred_currency"
        render={({ field: { value, onChange } }) => (
          <CurrencySelect
            value={value}
            onChange={onChange}
            options={CURRENCY_OPTIONS}
          />
        )}
      />
      <View style={styles.button}>
        <Button
          title={
            isProfileSaving
              ? formatMessage({ id: "form.saving" })
              : formatMessage({ id: "form.save" })
          }
          onPress={onSubmit}
          disabled={isProfileSaving}
          color="#208AEF"
        />
      </View>
      <View style={styles.button}>
        <Button
          title={formatMessage({ id: "profile.changePasswordButton" })}
          onPress={() => setShowChangePassword(true)}
          color="#666"
        />
      </View>

      <ChangePasswordModal
        visible={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, gap: 12 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  button: { marginTop: 16 },
});
