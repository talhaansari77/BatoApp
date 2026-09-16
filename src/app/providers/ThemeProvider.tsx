import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';

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
  resolvedMode: Exclude<ColorSchemeName, null>;
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

  useEffect(() => {
    async function loadThemeMode() {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);

      if (
        savedMode === 'light' ||
        savedMode === 'dark' ||
        savedMode === 'system'
      ) {
        setThemeMode(savedMode);
      }
    }

    loadThemeMode();
  }, []);

  const resolvedMode: 'light' | 'dark' =
    mode === 'system' ? systemMode ?? 'light' : mode;

  const setMode = async (nextMode: ThemeMode) => {
    setThemeMode(nextMode);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
  };

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
    [mode, resolvedMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error('useAppTheme must be used inside ThemeProvider');
  }

  return theme;
}