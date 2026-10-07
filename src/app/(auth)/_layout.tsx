import { GlobalThemeControl } from "@/components/organisms/global-theme-control";
import { useAuth } from "@/context/auth";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";

export default function AuthLayout() {
  const { session, loading } = useAuth();

  if (loading) return null;

  if (session) return <Redirect href="/" />;

  return (
    <View style={{ flex: 1 }}>
      <GlobalThemeControl />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
