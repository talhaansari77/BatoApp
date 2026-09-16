import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';

type Props = {
  label: string;
  value: string;
  subtitle?: string;
  icon: AppIconName;
};

export function AdminStatCard({ label, value, subtitle, icon }: Props) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        minHeight: 124,
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.lg,
        gap: theme.spacing.sm,
        ...(theme.shadows.card ?? {}),
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: theme.radius.lg,
          backgroundColor: theme.colors.cardMuted,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppIcon name={icon} size={21} color={theme.colors.primaryDark} />
      </View>

      <AppText variant="h3">{value}</AppText>

      <View>
        <AppText variant="caption">{label}</AppText>
        {subtitle ? (
          <AppText variant="small" color={theme.colors.textMuted}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}