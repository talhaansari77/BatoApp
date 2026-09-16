// src/shared/ui/templates/PlaceholderScreen.tsx

import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppText } from '../atoms/AppText';
import { Screen } from './Screen';

type PlaceholderScreenProps = {
  title: string;
  subtitle?: string;
  description: string;
};

export function PlaceholderScreen({
  title,
  subtitle,
  description,
}: PlaceholderScreenProps) {
  const theme = useAppTheme();

  return (
    <Screen
      title={title}
      subtitle={subtitle}
      actions={[
        {
          icon: 'Bell',
          onPress: () => {},
        },
      ]}
    >
      <View
        style={{
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius['2xl'],
          padding: theme.spacing['2xl'],
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        <AppText variant="h2">{title}</AppText>

        <AppText
          color={theme.colors.textMuted}
          style={{ marginTop: theme.spacing.md }}
        >
          {description}
        </AppText>
      </View>
    </Screen>
  );
}