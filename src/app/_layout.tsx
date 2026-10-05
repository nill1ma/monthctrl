import { GlobalThemeControl } from "@/components/organisms/global-theme-control";
import { AuthProvider } from "@/context/auth";
import { I18Provider } from "@/context/intl-provider";
import { LocaleProvider } from "@/context/locale";
import { AppThemeProvider, useAppTheme } from "@/context/theme";
import "@/lib/google-signin";
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
import { View } from "react-native";

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
            <LocaleProvider>
              <I18Provider>
                <View style={{ flex: 1 }}>
                  <GlobalThemeControl />
                  <View style={{ flex: 1 }}>
                    <Slot />
                  </View>
                </View>
              </I18Provider>
            </LocaleProvider>
          </AuthProvider>
        </NavigationThemeWrapper>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
