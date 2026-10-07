// src/app/(app)/_layout.tsx
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";

import { SideDrawer } from "@/components/organisms/side-drawer";
import { useAuth } from "@/context/auth";
import { useStartupSync } from "@/hooks/use-startup-sync";
import { useTheme } from "@/hooks/use-theme";
import { useIntl } from "react-intl";

export default function AppLayout() {
  const { session, loading } = useAuth();
  const colors = useTheme();
  const { formatMessage } = useIntl();

  useStartupSync();

  if (loading) return null;
  if (!session) return <Redirect href="/login" />;

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "600" },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: formatMessage({ id: "list.title" }) }}
        />
        <Stack.Screen name="details/[reference]" options={{ title: "" }} />
        <Stack.Screen
          name="incomings/create"
          options={{ title: formatMessage({ id: "create.title.incomings" }) }}
        />
        <Stack.Screen
          name="incomings/edit/[id]"
          options={{ title: formatMessage({ id: "update.title.incomings" }) }}
        />
        <Stack.Screen
          name="expenses/create"
          options={{ title: formatMessage({ id: "create.title.expenses" }) }}
        />
        <Stack.Screen
          name="expenses/edit/[id]"
          options={{ title: formatMessage({ id: "update.title.expenses" }) }}
        />
        <Stack.Screen
          name="profile/profile"
          options={{ title: formatMessage({ id: "profile.title" }) }}
        />
      </Stack>
      <SideDrawer />
    </View>
  );
}
