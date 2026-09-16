import React from 'react';
import { View, ViewStyle } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppText } from '../atoms/AppText';

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: ViewStyle;
};

export function AuthCard({ title, subtitle, children, style }: AuthCardProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius['2xl'],
          padding: theme.spacing['2xl'],
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        theme.shadows.card,
        style,
      ]}
    >
      <AppText variant="h2">{title}</AppText>

      {subtitle ? (
        <AppText
          color={theme.colors.textMuted}
          style={{ marginTop: theme.spacing.sm }}
        >
          {subtitle}
        </AppText>
      ) : null}

      <View style={{ marginTop: theme.spacing.xl }}>{children}</View>
    </View>
  );
}