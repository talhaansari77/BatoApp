import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { DoctorTabParamList } from '../../../core/navigation/navigation.types';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

type DoctorDashboardNavigation = BottomTabNavigationProp<
  DoctorTabParamList,
  'DoctorDashboard'
>;

type DashboardStat = {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  icon: AppIconName;
};

type TodayAppointment = {
  id: string;
  patientName: string;
  treatment: string;
  time: string;
  status: 'confirmed' | 'waiting' | 'completed';
  icon: AppIconName;
};

type QuickAction = {
  id: string;
  title: string;
  subtitle: string;
  icon: AppIconName;
  route: keyof DoctorTabParamList;
};

const dashboardStats: DashboardStat[] = [
  {
    id: 'appointments',
    label: 'Today',
    value: '8',
    subtitle: 'Appointments',
    icon: 'CalendarCheck',
  },
  {
    id: 'patients',
    label: 'Active',
    value: '24',
    subtitle: 'Patients',
    icon: 'UsersRound',
  },
  {
    id: 'plans',
    label: 'Care',
    value: '13',
    subtitle: 'Plans',
    icon: 'ClipboardList',
  },
  {
    id: 'rating',
    label: 'Rating',
    value: '4.9',
    subtitle: 'Reviews',
    icon: 'Star',
  },
];

const todayAppointments: TodayAppointment[] = [
  {
    id: 'apt-1',
    patientName: 'Muhammad Talha',
    treatment: 'Skin Consultation',
    time: '05:30 PM',
    status: 'confirmed',
    icon: 'ScanFace',
  },
  {
    id: 'apt-2',
    patientName: 'Aisha Khan',
    treatment: 'Hair Growth Treatment',
    time: '06:15 PM',
    status: 'waiting',
    icon: 'Sparkles',
  },
  {
    id: 'apt-3',
    patientName: 'Omar Ali',
    treatment: 'Hydration Facial Therapy',
    time: '07:00 PM',
    status: 'confirmed',
    icon: 'Droplets',
  },
];

const quickActions: QuickAction[] = [
  {
    id: 'appointments',
    title: 'Appointments',
    subtitle: 'View today schedule',
    icon: 'CalendarDays',
    route: 'DoctorAppointments',
  },
  {
    id: 'patients',
    title: 'Patients',
    subtitle: 'Open patient list',
    icon: 'UsersRound',
    route: 'DoctorPatients',
  },
  {
    id: 'messages',
    title: 'Messages',
    subtitle: 'Patient messages',
    icon: 'MessagesSquare',
    route: 'DoctorMessages',
  },
  {
    id: 'profile',
    title: 'Profile',
    subtitle: 'Doctor account',
    icon: 'UserRound',
    route: 'DoctorProfile',
  },
];

export function DoctorDashboardScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<DoctorDashboardNavigation>();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const navigateToTab = (route: keyof DoctorTabParamList) => {
    navigation.navigate(route);
  };

  return (
    <Screen
      title="Dashboard"
      subtitle="Doctor workspace"
      actions={[
        {
          icon: 'Bell',
          onPress: () => {},
        },
      ]}
    >
      <View style={styles.root}>
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.avatar}>
              <AppIcon
                name="Stethoscope"
                size={34}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.heroText}>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Welcome back
              </AppText>

              <AppText variant="h2">Dr. Sarah Ahmed</AppText>

              <AppText color={theme.colors.textMuted}>
                Review appointments, manage patients, and update treatment
                progress.
              </AppText>
            </View>
          </View>

          <View style={styles.statusCard}>
            <View style={styles.statusLeft}>
              <View style={styles.onlineDot} />

              <View>
                <AppText variant="bodyMedium">Available Today</AppText>

                <AppText variant="caption" color={theme.colors.textMuted}>
                  02:00 PM - 09:00 PM · Main Branch
                </AppText>
              </View>
            </View>

            <View style={styles.statusBadge}>
              <AppText variant="small" color={theme.colors.successText}>
                Online
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {dashboardStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Quick Actions"
            actionLabel="Schedule"
            onActionPress={() => navigateToTab('DoctorAppointments')}
          />

          <View style={styles.quickGrid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.id}
                onPress={() => navigateToTab(action.route)}
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

        <View style={styles.section}>
          <SectionHeader
            title="Today’s Appointments"
            actionLabel="View all"
            onActionPress={() => navigateToTab('DoctorAppointments')}
          />

          <View style={styles.appointmentList}>
            {todayAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </View>
        </View>

        <View style={styles.noteCard}>
          <View style={styles.noteIcon}>
            <AppIcon
              name="FilePenLine"
              size={24}
              color={theme.colors.primaryDark}
            />
          </View>

          <View style={styles.cardText}>
            <AppText variant="bodyMedium">Pending clinical notes</AppText>

            <AppText variant="caption" color={theme.colors.textMuted}>
              3 appointments need consultation notes and treatment updates.
            </AppText>
          </View>

          <AppIcon
            name="ChevronRight"
            size={20}
            color={theme.colors.textMuted}
          />
        </View>

        <View style={styles.carePlanCard}>
          <View style={styles.carePlanHeader}>
            <View>
              <AppText variant="h3">Treatment Plan Activity</AppText>

              <AppText variant="caption" color={theme.colors.textMuted}>
                Recent care plan updates
              </AppText>
            </View>

            <View style={styles.carePlanIcon}>
              <AppIcon
                name="ClipboardList"
                size={24}
                color={theme.colors.primaryDark}
              />
            </View>
          </View>

          <View style={styles.activityRow}>
            <View style={styles.activityDot} />

            <View style={styles.cardText}>
              <AppText variant="bodyMedium">
                Hair Rejuvenation Plan updated
              </AppText>

              <AppText variant="caption" color={theme.colors.textMuted}>
                Muhammad Talha · Session 4 completed
              </AppText>
            </View>
          </View>

          <View style={styles.activityRow}>
            <View style={styles.activityDot} />

            <View style={styles.cardText}>
              <AppText variant="bodyMedium">Skin care plan reviewed</AppText>

              <AppText variant="caption" color={theme.colors.textMuted}>
                Aisha Khan · Progress photos checked
              </AppText>
            </View>
          </View>

          <AppButton
            title="Open Patients"
            variant="outline"
            onPress={() => navigateToTab('DoctorPatients')}
          />
        </View>
      </View>
    </Screen>
  );
}

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

function SectionHeader({
  title,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) {
  const theme = useAppTheme();

  return (
    <View style={sectionHeaderStyles.row}>
      <AppText variant="h3">{title}</AppText>

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

type StatCardProps = {
  stat: DashboardStat;
};

function StatCard({ stat }: StatCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <AppIcon name={stat.icon} size={21} color={theme.colors.primaryDark} />
      </View>

      <AppText variant="h3">{stat.value}</AppText>

      <View>
        <AppText variant="caption">{stat.label}</AppText>

        <AppText variant="small" color={theme.colors.textMuted}>
          {stat.subtitle}
        </AppText>
      </View>
    </View>
  );
}

type AppointmentCardProps = {
  appointment: TodayAppointment;
};

function AppointmentCard({ appointment }: AppointmentCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const statusConfig = getStatusConfig(appointment.status, theme);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.appointmentCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.appointmentIcon}>
        <AppIcon
          name={appointment.icon}
          size={24}
          color={theme.colors.primaryDark}
        />
      </View>

      <View style={styles.cardText}>
        <AppText variant="bodyMedium">{appointment.patientName}</AppText>

        <AppText variant="caption" color={theme.colors.textMuted}>
          {appointment.treatment}
        </AppText>

        <View style={styles.inlineInfo}>
          <AppIcon name="Clock" size={15} color={theme.colors.textMuted} />

          <AppText variant="caption" color={theme.colors.textMuted}>
            {appointment.time}
          </AppText>
        </View>
      </View>

      <View
        style={[
          styles.appointmentBadge,
          {
            backgroundColor: statusConfig.backgroundColor,
          },
        ]}
      >
        <AppText variant="small" color={statusConfig.textColor}>
          {statusConfig.label}
        </AppText>
      </View>
    </Pressable>
  );
}

function getStatusConfig(
  status: TodayAppointment['status'],
  theme: ReturnType<typeof useAppTheme>,
) {
  const config = {
    confirmed: {
      label: 'Confirmed',
      backgroundColor: theme.colors.success,
      textColor: theme.colors.successText,
    },
    waiting: {
      label: 'Waiting',
      backgroundColor: theme.colors.warning,
      textColor: theme.colors.warningText,
    },
    completed: {
      label: 'Done',
      backgroundColor: theme.colors.info,
      textColor: theme.colors.infoText,
    },
  };

  return config[status];
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing['2xl'],
    },

    heroCard: {
      borderRadius: theme.radius['2xl'],
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing['2xl'],
      gap: theme.spacing.lg,
      ...(theme.shadows.card ?? {}),
    },

    heroTop: {
      flexDirection: 'row',
      gap: theme.spacing.lg,
    },

    avatar: {
      width: 76,
      height: 76,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    heroText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    statusCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },

    statusLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    onlineDot: {
      width: 12,
      height: 12,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.successText,
    },

    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.success,
    },

    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },

    statCard: {
      width: '47.8%',
      minHeight: 132,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
      ...(theme.shadows.card ?? {}),
    },

    statIcon: {
      width: 42,
      height: 42,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
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

    appointmentList: {
      gap: theme.spacing.md,
    },

    appointmentCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    appointmentIcon: {
      width: 50,
      height: 50,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cardText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    inlineInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },

    appointmentBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
    },

    noteCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.warning,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    noteIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },

    carePlanCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      ...(theme.shadows.card ?? {}),
    },

    carePlanHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },

    carePlanIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    activityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    activityDot: {
      width: 10,
      height: 10,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primaryDark,
    },

    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
  });
}

const sectionHeaderStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});