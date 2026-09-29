import { AuthProvider } from "@/context/auth";
import { AppThemeProvider, useAppTheme } from "@/context/theme";
import { queryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

function NavigationThemeWrapper({ children }: { children: React.ReactNode }) {
  const { scheme } = useAppTheme();

  return (
    <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <NavigationThemeWrapper>
          <AuthProvider>
            <Slot />
          </AuthProvider>
        </NavigationThemeWrapper>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
