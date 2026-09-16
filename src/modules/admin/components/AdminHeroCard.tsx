import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { AdminCard } from './AdminCard';

type Props = {
  icon: AppIconName;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function AdminHeroCard({ icon, title, description, children }: Props) {
  const theme = useAppTheme();

  return (
    <AdminCard style={{ borderRadius: theme.radius['2xl'], padding: theme.spacing.xl }}>
      <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: theme.radius['2xl'],
            backgroundColor: theme.colors.cardMuted,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppIcon name={icon} size={34} color={theme.colors.primaryDark} />
        </View>

        <View style={{ flex: 1, gap: theme.spacing.xs }}>
          <AppText variant="h2">{title}</AppText>
          <AppText color={theme.colors.textMuted}>{description}</AppText>
        </View>
      </View>

      {children}
    </AdminCard>
  );
}