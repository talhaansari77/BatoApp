import React from 'react';
import { Pressable, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppText } from '../../../shared/ui/atoms/AppText';

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function AdminSectionHeader({
  title,
  subtitle,
  actionLabel,
  onActionPress,
}: Props) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
      }}
    >
      <View style={{ flex: 1 }}>
        <AppText variant="h3">{title}</AppText>

        {subtitle ? (
          <AppText variant="caption" color={theme.colors.textMuted}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {actionLabel ? (
        <Pressable onPress={onActionPress} hitSlop={10}>
          <AppText variant="caption" color={theme.colors.primaryDark}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}