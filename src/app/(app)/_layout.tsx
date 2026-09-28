import { Redirect, Slot } from "expo-router";

import { useAuth } from "@/context/auth";

export default function AppLayout() {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (!session) return <Redirect href="/login" />;

  return <Slot />;
}
