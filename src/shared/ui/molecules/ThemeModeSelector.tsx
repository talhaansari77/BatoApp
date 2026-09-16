import React from 'react';
import { Pressable, View } from 'react-native';

import {
  ThemeMode,
  useAppTheme,
} from '../../../app/providers/ThemeProvider';
import { AppIcon } from '../atoms/AppIcon';
import { AppText } from '../atoms/AppText';

const options: Array<{
  label: string;
  value: ThemeMode;
  icon: 'Sun' | 'Moon' | 'Monitor';
}> = [
  {
    label: 'Light',
    value: 'light',
    icon: 'Sun',
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: 'Moon',
  },
  {
    label: 'System',
    value: 'system',
    icon: 'Monitor',
  },
];

export function ThemeModeSelector() {
  const theme = useAppTheme();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      {options.map((option) => {
        const isSelected = theme.mode === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => theme.setMode(option.value)}
            style={{
              minHeight: 56,
              paddingHorizontal: theme.spacing.lg,
              borderRadius: theme.radius.lg,
              borderWidth: 1,
              borderColor: isSelected
                ? theme.colors.primaryDark
                : theme.colors.border,
              backgroundColor: isSelected
                ? theme.colors.cardMuted
                : theme.colors.card,
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing.md,
            }}
          >
            <AppIcon
              name={option.icon}
              color={isSelected ? theme.colors.primaryDark : theme.colors.text}
            />

            <View style={{ flex: 1 }}>
              <AppText
                variant="bodyMedium"
                color={isSelected ? theme.colors.primaryDark : theme.colors.text}
              >
                {option.label}
              </AppText>

              <AppText variant="caption" color={theme.colors.textMuted}>
                {option.value === 'system'
                  ? 'Follow device appearance'
                  : `${option.label} appearance`}
              </AppText>
            </View>

            {isSelected ? (
              <AppIcon
                name="Check"
                size={20}
                color={theme.colors.primaryDark}
              />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}