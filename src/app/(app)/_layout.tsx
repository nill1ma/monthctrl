import { Redirect, Slot } from "expo-router";
import { View } from "react-native";

import { SideDrawer } from "@/components/organisms/side-drawer";
import { useAuth } from "@/context/auth";
import { useStartupSync } from "@/hooks/use-startup-sync";

export default function AppLayout() {
  const { session, loading } = useAuth();

  useStartupSync();

  if (loading) return null;
  if (!session) return <Redirect href="/login" />;

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <SideDrawer />
    </View>
  );
}
