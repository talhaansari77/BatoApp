import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import {
  AppColors,
  darkColors,
  lightColors,
  radius,
  shadows,
  spacing,
  typography,
} from '../../theme';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'bato.theme.mode';

type AppTheme = {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  colors: AppColors;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  typography: typeof typography;
  setMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<AppTheme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemMode = useColorScheme();
  const [mode, setThemeMode] = useState<ThemeMode>('light');
  const [ready, setReady] = useState(false); // NEW: true once saved theme is read

  // Load saved theme, then mark ready (even if the read fails)
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setThemeMode(saved);
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  // Hide the splash only after the theme is known
  useEffect(() => {
    // if (ready) SplashScreen.hideAsync();
  }, [ready]);

  const safeSystemMode: 'light' | 'dark' =
    systemMode === 'dark' ? 'dark' : 'light';

  const resolvedMode: 'light' | 'dark' =
    mode === 'system' ? safeSystemMode : mode;

  // NEW: stable function identity
  const setMode = useCallback(async (next: ThemeMode) => {
    setThemeMode(next);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, next);
  }, []);

  const value = useMemo<AppTheme>(
    () => ({
      mode,
      resolvedMode,
      colors: resolvedMode === 'dark' ? darkColors : lightColors,
      spacing,
      radius,
      shadows,
      typography,
      setMode,
    }),
    [mode, resolvedMode, setMode], // setMode added
  );

  // NEW: must come AFTER all hooks above (hooks can't be skipped by an early return)
  if (!ready) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useAppTheme must be used inside ThemeProvider');
  return theme;
}