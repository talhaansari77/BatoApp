import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import {
  AdminInfoCard,
  AdminSectionHeader,
  AdminStatusBadge,
} from '../components';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppInput } from '../../../shared/ui/atoms/AppInput';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

type NotificationType =
  | 'appointment'
  | 'promotion'
  | 'followup'
  | 'system';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  date: string;
  type: NotificationType;
  recipients: string;
  icon: AppIconName;
};

const notifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Appointment Reminder',
    message: 'Upcoming appointments reminder sent.',
    date: 'Today',
    recipients: '124 Patients',
    type: 'appointment',
    icon: 'CalendarClock',
  },
  {
    id: '2',
    title: 'Summer Promotion',
    message: '20% discount campaign broadcast.',
    date: 'Yesterday',
    recipients: '842 Patients',
    type: 'promotion',
    icon: 'BadgePercent',
  },
  {
    id: '3',
    title: 'Treatment Follow-up',
    message: 'Follow-up reminder notification sent.',
    date: 'Yesterday',
    recipients: '58 Patients',
    type: 'followup',
    icon: 'HeartHandshake',
  },
  {
    id: '4',
    title: 'System Maintenance',
    message: 'System update notification.',
    date: 'Jun 19',
    recipients: 'All Users',
    type: 'system',
    icon: 'ShieldAlert',
  },
];

export function AdminNotificationsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [search, setSearch] = useState('');

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return notifications;
    }

    return notifications.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.message.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <Screen
      title="Notifications"
      subtitle="Communication center"
      showBack
      actions={[
        {
          icon: 'Bell',
          onPress: () => {},
        },
      ]}
    >
      <View style={styles.root}>
        <AdminInfoCard>
          <View style={styles.heroRow}>
            <View style={styles.heroIcon}>
              <AppIcon
                name="BellRing"
                size={32}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.heroContent}>
              <AppText variant="h2">Notification Center</AppText>

              <AppText color={theme.colors.textMuted}>
                Send campaigns, reminders, follow-ups and system alerts.
              </AppText>
            </View>
          </View>

          <AppButton title="Create Notification" />
        </AdminInfoCard>

        <AppInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search notifications..."
          leftIcon="Search"
        />

        <View style={styles.quickActions}>
          <ActionCard
            icon="CalendarClock"
            title="Appointment Reminder"
          />

          <ActionCard
            icon="BadgePercent"
            title="Promotion"
          />

          <ActionCard
            icon="Megaphone"
            title="Broadcast"
          />

          <ActionCard
            icon="ShieldAlert"
            title="System Alert"
          />
        </View>

        <View style={styles.section}>
          <AdminSectionHeader
            title="Notification History"
            subtitle="Recently sent notifications"
          />

          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}

function ActionCard({
  icon,
  title,
}: {
  icon: AppIconName;
  title: string;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      style={{
        flex: 1,
        minHeight: 100,
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing.sm,
      }}
    >
      <AppIcon
        name={icon}
        size={22}
        color={theme.colors.primaryDark}
      />

      <AppText variant="small" align="center">
        {title}
      </AppText>
    </Pressable>
  );
}

function NotificationCard({
  notification,
}: {
  notification: NotificationItem;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const statusType =
    notification.type === 'promotion'
      ? 'info'
      : notification.type === 'system'
      ? 'warning'
      : 'success';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.notificationCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIcon}>
          <AppIcon
            name={notification.icon}
            size={22}
            color={theme.colors.primaryDark}
          />
        </View>

        <View style={styles.notificationContent}>
          <AppText variant="bodyMedium">
            {notification.title}
          </AppText>

          <AppText
            variant="caption"
            color={theme.colors.textMuted}
          >
            {notification.message}
          </AppText>
        </View>

        <AdminStatusBadge
          label="Sent"
          type={statusType}
        />
      </View>

      <View style={styles.metaRow}>
        <AppText
          variant="caption"
          color={theme.colors.textMuted}
        >
          {notification.recipients}
        </AppText>

        <AppText
          variant="caption"
          color={theme.colors.textMuted}
        >
          {notification.date}
        </AppText>
      </View>
    </Pressable>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing.xl,
    },

    heroRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },

    heroIcon: {
      width: 72,
      height: 72,
      borderRadius: theme.radius['2xl'],
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    heroContent: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    quickActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },

    section: {
      gap: theme.spacing.md,
    },

    notificationCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    notificationHeader: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      alignItems: 'center',
    },

    notificationIcon: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    notificationContent: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    pressed: {
      opacity: 0.85,
    },
  });
}