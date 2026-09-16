import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { AdminCard } from './AdminCard';

type Props = {
  icon?: AppIconName;
  title: string;
  description: string;
};

export function AdminEmptyState({
  icon = 'SearchX',
  title,
  description,
}: Props) {
  const theme = useAppTheme();

  return (
    <AdminCard style={{ alignItems: 'center', padding: theme.spacing['2xl'] }}>
      <View
        style={{
          width: 58,
          height: 58,
          borderRadius: theme.radius.full,
          backgroundColor: theme.colors.cardMuted,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppIcon name={icon} size={30} color={theme.colors.primaryDark} />
      </View>

      <AppText variant="bodyMedium" align="center">
        {title}
      </AppText>

      <AppText variant="caption" color={theme.colors.textMuted} align="center">
        {description}
      </AppText>
    </AdminCard>
  );
}