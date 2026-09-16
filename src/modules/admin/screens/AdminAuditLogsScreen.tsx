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

type AuditType = 'login' | 'appointment' | 'payment' | 'security';
type FilterType = 'all' | AuditType;

type AuditLog = {
  id: string;
  user: string;
  role: string;
  action: string;
  detail: string;
  time: string;
  type: AuditType;
  severity: 'low' | 'medium' | 'high';
  icon: AppIconName;
};

const filters: Array<{ label: string; value: FilterType }> = [
  { label: 'All', value: 'all' },
  { label: 'Login', value: 'login' },
  { label: 'Appointments', value: 'appointment' },
  { label: 'Payments', value: 'payment' },
  { label: 'Security', value: 'security' },
];

const auditLogs: AuditLog[] = [
  {
    id: '1',
    user: 'Clinic Owner',
    role: 'Admin',
    action: 'Approved appointment',
    detail: 'Approved pay-at-clinic request for Muhammad Talha.',
    time: '10 min ago',
    type: 'appointment',
    severity: 'low',
    icon: 'CalendarCheck',
  },
  {
    id: '2',
    user: 'Dr. Sarah Ahmed',
    role: 'Doctor',
    action: 'Updated patient notes',
    detail: 'Added consultation notes for Skin Consultation.',
    time: '22 min ago',
    type: 'appointment',
    severity: 'low',
    icon: 'FilePenLine',
  },
  {
    id: '3',
    user: 'Admin System',
    role: 'System',
    action: 'Payment refund processed',
    detail: 'Refund issued for cancelled Botox Consultation.',
    time: '1 hr ago',
    type: 'payment',
    severity: 'medium',
    icon: 'CreditCard',
  },
  {
    id: '4',
    user: 'Unknown Device',
    role: 'Security',
    action: 'Failed login attempt',
    detail: 'Multiple failed login attempts detected.',
    time: '2 hrs ago',
    type: 'security',
    severity: 'high',
    icon: 'ShieldAlert',
  },
  {
    id: '5',
    user: 'Clinic Owner',
    role: 'Admin',
    action: 'Successful login',
    detail: 'Admin logged in from trusted device.',
    time: 'Today',
    type: 'login',
    severity: 'low',
    icon: 'LogIn',
  },
];

export function AdminAuditLogsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return auditLogs.filter((log) => {
      const matchesFilter = selectedFilter === 'all' || log.type === selectedFilter;

      const matchesSearch =
        query.length === 0 ||
        log.user.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.detail.toLowerCase().includes(query) ||
        log.role.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [search, selectedFilter]);

  return (
    <Screen
      title="Audit Logs"
      subtitle="Security history"
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
                name="ShieldAlert"
                size={32}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.heroContent}>
              <AppText variant="h2">Audit Logs</AppText>

              <AppText color={theme.colors.textMuted}>
                Review logins, staff activity, payment changes, approvals, and security events.
              </AppText>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <SummaryItem label="Logs" value={`${auditLogs.length}`} />
            <View style={styles.summaryDivider} />
            <SummaryItem label="High Risk" value="1" />
            <View style={styles.summaryDivider} />
            <SummaryItem label="Today" value="5" />
          </View>
        </AdminInfoCard>

        <AppInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search audit logs..."
          leftIcon="Search"
          rightIcon={search ? 'X' : undefined}
          onRightIconPress={() => setSearch('')}
        />

        <View style={styles.filterRow}>
          {filters.map((filter) => {
            const isSelected = selectedFilter === filter.value;

            return (
              <Pressable
                key={filter.value}
                onPress={() => setSelectedFilter(filter.value)}
                style={({ pressed }) => [
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                  pressed && styles.pressed,
                ]}
              >
                <AppText
                  variant="caption"
                  color={
                    isSelected ? theme.colors.primaryDark : theme.colors.textMuted
                  }
                  style={isSelected ? styles.selectedText : undefined}
                >
                  {filter.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.section}>
          <AdminSectionHeader
            title="Activity History"
            subtitle={`${filteredLogs.length} logs found`}
          />

          {filteredLogs.map((log) => (
            <AuditLogCard key={log.id} log={log} />
          ))}
        </View>
      </View>
    </Screen>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  const theme = useAppTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', gap: theme.spacing.xs }}>
      <AppText variant="h3" color={theme.colors.primaryDark}>
        {value}
      </AppText>

      <AppText variant="small" color={theme.colors.textMuted}>
        {label}
      </AppText>
    </View>
  );
}

function AuditLogCard({ log }: { log: AuditLog }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const severityType =
    log.severity === 'high'
      ? 'error'
      : log.severity === 'medium'
        ? 'warning'
        : 'success';

  return (
    <Pressable
      style={({ pressed }) => [styles.logCard, pressed && styles.pressed]}
    >
      <View style={styles.logHeader}>
        <View style={styles.logIcon}>
          <AppIcon name={log.icon} size={22} color={theme.colors.primaryDark} />
        </View>

        <View style={styles.logContent}>
          <View style={styles.titleRow}>
            <AppText variant="bodyMedium" style={styles.title}>
              {log.action}
            </AppText>

            <AdminStatusBadge
              label={log.severity.toUpperCase()}
              type={severityType}
            />
          </View>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {log.detail}
          </AppText>
        </View>
      </View>

      <View style={styles.metaBox}>
        <MetaItem icon="UserRound" label="User" value={log.user} />
        <MetaItem icon="BadgeCheck" label="Role" value={log.role} />
        <MetaItem icon="Clock" label="Time" value={log.time} />
      </View>
    </Pressable>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: AppIconName;
  label: string;
  value: string;
}) {
  const theme = useAppTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
      <AppIcon name={icon} size={16} color={theme.colors.primaryDark} />

      <View>
        <AppText variant="small" color={theme.colors.textMuted}>
          {label}
        </AppText>

        <AppText variant="caption">{value}</AppText>
      </View>
    </View>
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

    summaryRow: {
      minHeight: 82,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },

    summaryDivider: {
      width: 1,
      height: '65%',
      backgroundColor: theme.colors.border,
    },

    filterRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },

    filterChip: {
      minHeight: 40,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },

    filterChipActive: {
      borderColor: theme.colors.primaryDark,
      backgroundColor: theme.colors.cardMuted,
    },

    selectedText: {
      fontWeight: '700',
    },

    section: {
      gap: theme.spacing.md,
    },

    logCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    logHeader: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      alignItems: 'center',
    },

    logIcon: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    logContent: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
    },

    title: {
      flex: 1,
    },

    metaBox: {
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },

    pressed: {
      opacity: 0.85,
    },
  });
}