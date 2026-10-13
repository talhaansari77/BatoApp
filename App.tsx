import "./src/core/i18n/i18n";

import { useEffect, useMemo } from "react";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { LanguageProvider } from "./src/app/providers/LanguageProvider";
import { ThemeProvider, useAppTheme } from "./src/app/providers/ThemeProvider";
import { RootNavigator } from "./src/core/navigation/RootNavigator";
import { useAuthStore } from "./src/modules/auth/store/auth.store";
import * as SplashScreen from "expo-splash-screen";
import { LogBox } from "react-native";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

// Ignore specific warning messages (partial text matching works)
// LogBox.ignoreLogs(["statusBarStyle", "TextInputKeyPressEventData"]);
LogBox.ignoreAllLogs(true);

function AppContent() {
  const theme = useAppTheme();
  const bootstrapAuth = useAuthStore((state) => state.bootstrapAuth);
  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  const navTheme = useMemo(() => {
    const base = theme.resolvedMode === "dark" ? DarkTheme : DefaultTheme;
    const c = theme.colors;
    return {
      ...base, // keeps the required `fonts` and `dark` fields
      colors: {
        ...base.colors,
        background: c.background,
        card: c.card,
        text: c.text,
        border: c.border,
        primary: c.primary,
        notification: c.danger,
      },
    };
  }, [theme.resolvedMode, theme.colors]);

  return (
    <LanguageProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style={theme.resolvedMode === "dark" ? "light" : "dark"} />
        <RootNavigator />
      </NavigationContainer>
    </LanguageProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
