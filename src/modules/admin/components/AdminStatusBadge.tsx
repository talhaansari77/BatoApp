import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppText } from '../../../shared/ui/atoms/AppText';

type StatusType = 'success' | 'warning' | 'error' | 'info';

type Props = {
  label: string;
  type: StatusType;
};

export function AdminStatusBadge({ label, type }: Props) {
  const theme = useAppTheme();

  const map = {
    success: {
      backgroundColor: theme.colors.success,
      color: theme.colors.successText,
    },
    warning: {
      backgroundColor: theme.colors.warning,
      color: theme.colors.warningText,
    },
    error: {
      backgroundColor: theme.colors.error,
      color: theme.colors.errorText,
    },
    info: {
      backgroundColor: theme.colors.info,
      color: theme.colors.infoText,
    },
  };

  return (
    <View
      style={{
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.radius.full,
        backgroundColor: map[type].backgroundColor,
      }}
    >
      <AppText variant="small" color={map[type].color}>
        {label}
      </AppText>
    </View>
  );
}