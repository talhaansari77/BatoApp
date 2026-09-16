import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';

type Props = {
  children: React.ReactNode;
};

export function AdminInfoCard({ children }: Props) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
        ...(theme.shadows.card ?? {}),
      }}
    >
      {children}
    </View>
  );
}