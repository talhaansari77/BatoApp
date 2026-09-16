import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AdminTabParamList } from '../../../core/navigation/navigation.types';
import {
  AdminCard,
  AdminDetailItem,
  AdminHeroCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminStatusBadge,
} from '../components';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

type AdminDashboardNavigation = BottomTabNavigationProp<
  AdminTabParamList,
  'AdminDashboard'
>;

type QuickAction = {
  id: string;
  title: string;
  subtitle: string;
  icon: AppIconName;
  route: keyof AdminTabParamList;
};

const quickActions: QuickAction[] = [
  {
    id: 'appointments',
    title: 'Appointments',
    subtitle: 'Approve & manage',
    icon: 'CalendarClock',
    route: 'AdminAppointments',
  },
  {
    id: 'patients',
    title: 'Patients',
    subtitle: 'Profiles & records',
    icon: 'UsersRound',
    route: 'AdminPatients',
  },
  {
    id: 'doctors',
    title: 'Doctors',
    subtitle: 'Staff & schedule',
    icon: 'Stethoscope',
    route: 'AdminDoctors',
  },
  {
    id: 'more',
    title: 'More Tools',
    subtitle: 'Services & reports',
    icon: 'Menu',
    route: 'AdminMore',
  },
];

export function AdminDashboardScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<AdminDashboardNavigation>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Screen
      title="Dashboard"
      subtitle="Admin"
      actions={[{ icon: 'Bell', onPress: () => {} }]}
    >
      <View style={styles.root}>
        <AdminHeroCard
          icon="LayoutDashboard"
          title="Clinic Admin"
          description="Monitor appointments, approvals, doctors, patients, revenue, and branch activity."
        >
          <AdminCard style={styles.branchCard}>
            <AdminDetailItem
              icon="MapPin"
              label="Current Branch"
              value="Main Branch · Kuwait"
            />
            <AdminStatusBadge label="Open" type="success" />
          </AdminCard>
        </AdminHeroCard>

        <View style={styles.statsGrid}>
          <AdminStatCard
            label="Today"
            value="32"
            subtitle="Appointments"
            icon="CalendarDays"
          />
          <AdminStatCard
            label="Pending"
            value="7"
            subtitle="Approvals"
            icon="Clock"
          />
          <AdminStatCard
            label="Active"
            value="12"
            subtitle="Doctors"
            icon="Stethoscope"
          />
          <AdminStatCard
            label="Total"
            value="284"
            subtitle="Patients"
            icon="UsersRound"
          />
        </View>

        <View style={styles.section}>
          <AdminSectionHeader title="Quick Actions" />

          <View style={styles.quickGrid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.id}
                onPress={() => navigation.navigate(action.route)}
                style={({ pressed }) => [
                  styles.quickCard,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.quickIcon}>
                  <AppIcon
                    name={action.icon}
                    size={22}
                    color={theme.colors.primaryDark}
                  />
                </View>

                <AppText variant="bodyMedium">{action.title}</AppText>

                <AppText variant="caption" color={theme.colors.textMuted}>
                  {action.subtitle}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>

        <AdminCard>
          <AdminSectionHeader
            title="Revenue Summary"
            subtitle="Mock clinic financial overview"
          />

          <View style={styles.revenueMain}>
            <View>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Today
              </AppText>
              <AppText variant="h2">1,240 KWD</AppText>
            </View>

            <View style={styles.growthBadge}>
              <AppIcon
                name="TrendingUp"
                size={15}
                color={theme.colors.successText}
              />
              <AppText variant="small" color={theme.colors.successText}>
                +12%
              </AppText>
            </View>
          </View>

          <View style={styles.revenueBreakdown}>
            <RevenueItem label="Week" value="7,860 KWD" />
            <View style={styles.statDivider} />
            <RevenueItem label="Month" value="31,420 KWD" />
          </View>
        </AdminCard>

        <View style={styles.section}>
          <AdminSectionHeader
            title="Pending Approvals"
            actionLabel="View all"
            onActionPress={() => navigation.navigate('AdminAppointments')}
          />

          <AdminCard>
            <View style={styles.approvalHeader}>
              <View style={styles.quickIcon}>
                <AppIcon
                  name="Sparkles"
                  size={22}
                  color={theme.colors.primaryDark}
                />
              </View>

              <View style={styles.cardText}>
                <AppText variant="bodyMedium">Muhammad Talha</AppText>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  Hair Growth Treatment
                </AppText>
                <AppText variant="caption" color={theme.colors.primaryDark}>
                  Today · 06:15 PM
                </AppText>
              </View>
            </View>

            <View style={styles.detailsBox}>
              <AdminDetailItem
                icon="MapPin"
                label="Branch"
                value="Salmiya Branch"
              />
              <AdminDetailItem
                icon="CreditCard"
                label="Payment"
                value="Pay at Clinic"
              />
            </View>

            <View style={styles.actions}>
              <AppButton title="Approve" fullWidth={false} style={styles.button} />
              <AppButton
                title="Reject"
                variant="outline"
                fullWidth={false}
                style={styles.button}
              />
            </View>
          </AdminCard>
        </View>
      </View>
    </Screen>
  );
}

function RevenueItem({ label, value }: { label: string; value: string }) {
  const theme = useAppTheme();

  return (
    <View style={{ flex: 1, gap: theme.spacing.xs }}>
      <AppText variant="small" color={theme.colors.textMuted}>
        {label}
      </AppText>
      <AppText variant="bodyMedium">{value}</AppText>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing['2xl'],
    },

    branchCard: {
      backgroundColor: theme.colors.background,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },

    section: {
      gap: theme.spacing.md,
    },

    quickGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },

    quickCard: {
      width: '47.8%',
      minHeight: 126,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.xs,
      ...(theme.shadows.card ?? {}),
    },

    quickIcon: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },

    revenueMain: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },

    growthBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.success,
    },

    revenueBreakdown: {
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      flexDirection: 'row',
      gap: theme.spacing.md,
    },

    statDivider: {
      width: 1,
      minHeight: 42,
      backgroundColor: theme.colors.border,
    },

    approvalHeader: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },

    cardText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    detailsBox: {
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },

    actions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },

    button: {
      flex: 1,
    },

    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
  });
}