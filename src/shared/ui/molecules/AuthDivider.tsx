import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppText } from '../atoms/AppText';

type AuthDividerProps = {
  label?: string;
};

export function AuthDivider({ label = 'or' }: AuthDividerProps) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        marginVertical: theme.spacing.lg,
      }}
    >
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: theme.colors.border,
        }}
      />

      <AppText variant="caption" color={theme.colors.textMuted}>
        {label}
      </AppText>

      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: theme.colors.border,
        }}
      />
    </View>
  );
}