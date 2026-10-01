import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { PatientTabParamList } from '../../../core/navigation/navigation.types';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';
import { useAuthStore } from '../../auth/store/auth.store';

type PatientAppointmentsNavigation = BottomTabNavigationProp<
  PatientTabParamList,
  'PatientAppointments'
>;

type AppointmentStatus = 'upcoming' | 'pending' | 'completed' | 'cancelled';

type AppointmentFilter = 'all' | AppointmentStatus;

type Appointment = {
  id: string;
  title: string;
  doctor: string;
  branch: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  paymentType: 'Online Paid' | 'Pay at Clinic';
  icon: AppIconName;
};

type FilterOption = {
  label: string;
  value: AppointmentFilter;
};

const filters: FilterOption[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Upcoming',
    value: 'upcoming',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
  },
];

const appointments: Appointment[] = [
  {
    id: 'apt-1',
    title: 'Skin Consultation',
    doctor: 'Dr. Sarah Ahmed',
    branch: 'Main Branch',
    date: 'Today',
    time: '05:30 PM',
    status: 'upcoming',
    paymentType: 'Online Paid',
    icon: 'ScanFace',
  },
  {
    id: 'apt-2',
    title: 'Hair Growth Treatment',
    doctor: 'Dr. Omar Khalid',
    branch: 'Salmiya Branch',
    date: 'Jun 22',
    time: '07:00 PM',
    status: 'pending',
    paymentType: 'Pay at Clinic',
    icon: 'Sparkles',
  },
  {
    id: 'apt-3',
    title: 'Hydration Facial Therapy',
    doctor: 'Dr. Lina Hassan',
    branch: 'Main Branch',
    date: 'Jun 10',
    time: '04:15 PM',
    status: 'completed',
    paymentType: 'Online Paid',
    icon: 'Droplets',
  },
  {
    id: 'apt-4',
    title: 'Botox Consultation',
    doctor: 'Dr. Mariam Ali',
    branch: 'Avenues Branch',
    date: 'Jun 03',
    time: '06:45 PM',
    status: 'cancelled',
    paymentType: 'Pay at Clinic',
    icon: 'SmilePlus',
  },
];

export function PatientAppointmentsScreen() {
  const theme = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation<PatientAppointmentsNavigation>();

  const [selectedFilter, setSelectedFilter] = useState<AppointmentFilter>('all');

  const styles = useMemo(() => createStyles(theme), [theme]);

  const filteredAppointments = useMemo(() => {
    if (selectedFilter === 'all') {
      return appointments;
    }

    return appointments.filter(
      (appointment) => appointment.status === selectedFilter,
    );
  }, [selectedFilter]);

  const upcomingCount = appointments.filter(
    (appointment) => appointment.status === 'upcoming',
  ).length;

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === 'pending',
  ).length;

  useEffect(()=>{
    console.log('user')
    console.log(user)
  },[])
  return (
    <Screen
      title="Appointments"
      subtitle="Manage your visits"
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
            <View style={styles.heroIcon}>
              <AppIcon
                name="CalendarDays"
                size={34}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.heroText}>
              <AppText variant="h2">Your appointments</AppText>

              {/* <AppText color={theme.colors.textMuted}>
                Track confirmed visits, pending approvals, completed sessions,
                and cancelled bookings.
              </AppText> */}
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <AppText variant="h3" color={theme.colors.primaryDark}>
                {upcomingCount}
              </AppText>

              <AppText variant="caption" color={theme.colors.textMuted}>
                Upcoming
              </AppText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <AppText variant="h3" color={theme.colors.warningText}>
                {pendingCount}
              </AppText>

              <AppText variant="caption" color={theme.colors.textMuted}>
                Pending
              </AppText>
            </View>
          </View>

          <AppButton
            title="Book New Appointment"
            onPress={() => navigation.navigate('PatientServices')}
          />
        </View>

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
                    isSelected
                      ? theme.colors.primaryDark
                      : theme.colors.textMuted
                  }
                  style={isSelected ? styles.selectedFilterText : undefined}
                >
                  {filter.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <AppText variant="h3">Appointment List</AppText>

            <AppText variant="caption" color={theme.colors.textMuted}>
              {filteredAppointments.length} bookings found
            </AppText>
          </View>
        </View>

        <View style={styles.appointmentList}>
          {filteredAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </View>

        {filteredAppointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <AppIcon
                name="CalendarX"
                size={30}
                color={theme.colors.primaryDark}
              />
            </View>

            <AppText variant="bodyMedium" align="center">
              No appointments found
            </AppText>

            <AppText
              variant="caption"
              color={theme.colors.textMuted}
              align="center"
            >
              Try another filter or book a new treatment.
            </AppText>

            <AppButton
              title="Book Appointment"
              style={styles.emptyButton}
              onPress={() => navigation.navigate('PatientServices')}
            />
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

type AppointmentCardProps = {
  appointment: Appointment;
};

function AppointmentCard({ appointment }: AppointmentCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const statusConfig = getStatusConfig(appointment.status, theme);

  return (
    <Pressable style={({ pressed }) => [styles.appointmentCard, pressed && styles.pressed]}>
      <View style={styles.appointmentTop}>
        <View style={styles.appointmentIcon}>
          <AppIcon
            name={appointment.icon}
            size={24}
            color={theme.colors.primaryDark}
          />
        </View>

        <View style={styles.appointmentContent}>
          <View style={styles.appointmentTitleRow}>
            <AppText variant="bodyMedium" style={styles.appointmentTitle}>
              {appointment.title}
            </AppText>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusConfig.backgroundColor,
                },
              ]}
            >
              <AppText variant="small" color={statusConfig.textColor}>
                {statusConfig.label}
              </AppText>
            </View>
          </View>

          <View style={styles.metaRow}>
            <AppIcon
              name="Stethoscope"
              size={16}
              color={theme.colors.textMuted}
            />

            <AppText variant="caption" color={theme.colors.textMuted}>
              {appointment.doctor}
            </AppText>
          </View>

          <View style={styles.metaRow}>
            <AppIcon name="MapPin" size={16} color={theme.colors.textMuted} />

            <AppText variant="caption" color={theme.colors.textMuted}>
              {appointment.branch}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.detailsBox}>
        <View style={styles.detailItem}>
          <AppIcon name="Calendar" size={17} color={theme.colors.primaryDark} />

          <View>
            <AppText variant="small" color={theme.colors.textMuted}>
              Date
            </AppText>

            <AppText variant="caption">{appointment.date}</AppText>
          </View>
        </View>

        <View style={styles.detailItem}>
          <AppIcon name="Clock" size={17} color={theme.colors.primaryDark} />

          <View>
            <AppText variant="small" color={theme.colors.textMuted}>
              Time
            </AppText>

            <AppText variant="caption">{appointment.time}</AppText>
          </View>
        </View>

        <View style={styles.detailItem}>
          <AppIcon
            name="CreditCard"
            size={17}
            color={theme.colors.primaryDark}
          />

          <View>
            <AppText variant="small" color={theme.colors.textMuted}>
              Payment
            </AppText>

            <AppText variant="caption">{appointment.paymentType}</AppText>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        {appointment.status === 'upcoming' ? (
          <>
            <AppButton
              title="View Details"
              fullWidth={false}
              style={styles.actionButton}
            />

            <AppButton
              title="Reschedule"
              variant="outline"
              fullWidth={false}
              style={styles.actionButton}
            />
          </>
        ) : null}

        {appointment.status === 'pending' ? (
          <>
            <View style={styles.pendingInfo}>
              <AppIcon
                name="Info"
                size={17}
                color={theme.colors.warningText}
              />

              <AppText variant="caption" color={theme.colors.textMuted}>
                Waiting for admin approval
              </AppText>
            </View>

            <AppButton
              title="Cancel"
              variant="outline"
              fullWidth={false}
              style={styles.cancelButton}
            />
          </>
        ) : null}

        {appointment.status === 'completed' ? (
          <>
            <AppButton
              title="View Summary"
              fullWidth={false}
              style={styles.actionButton}
            />

            <AppButton
              title="Book Again"
              variant="outline"
              fullWidth={false}
              style={styles.actionButton}
            />
          </>
        ) : null}

        {appointment.status === 'cancelled' ? (
          <>
            <View style={styles.pendingInfo}>
              <AppIcon name="CircleX" size={17} color={theme.colors.errorText} />

              <AppText variant="caption" color={theme.colors.textMuted}>
                This appointment was cancelled
              </AppText>
            </View>

            <AppButton
              title="Book Again"
              variant="outline"
              fullWidth={false}
              style={styles.cancelButton}
            />
          </>
        ) : null}
      </View>
    </Pressable>
  );
}

function getStatusConfig(
  status: AppointmentStatus,
  theme: ReturnType<typeof useAppTheme>,
) {
  const config = {
    upcoming: {
      label: 'Confirmed',
      backgroundColor: theme.colors.success,
      textColor: theme.colors.successText,
    },
    pending: {
      label: 'Pending',
      backgroundColor: theme.colors.warning,
      textColor: theme.colors.warningText,
    },
    completed: {
      label: 'Completed',
      backgroundColor: theme.colors.info,
      textColor: theme.colors.infoText,
    },
    cancelled: {
      label: 'Cancelled',
      backgroundColor: theme.colors.error,
      textColor: theme.colors.errorText,
    },
  };

  return config[status];
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing.xl,
    },

    heroCard: {
      borderRadius: theme.radius['2xl'],
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.xl,
      gap: theme.spacing.lg,
      ...(theme.shadows.card ?? {}),
    },

    heroTop: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },

    heroIcon: {
      width: 70,
      height: 70,
      borderRadius: theme.radius['2xl'],
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    heroText: {
      flex: 1,
      gap: theme.spacing.sm,
    },

    statsRow: {
      minHeight: 82,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
    },

    statBox: {
      flex: 1,
      alignItems: 'center',
      gap: theme.spacing.xs,
    },

    statDivider: {
      width: 1,
      height: '70%',
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

    selectedFilterText: {
      fontWeight: '700',
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    appointmentTop: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },

    appointmentIcon: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    appointmentContent: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    appointmentTitleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
    },

    appointmentTitle: {
      flex: 1,
    },

    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
    },

    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
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

    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },

    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
      flexWrap: 'wrap',
    },

    actionButton: {
      minHeight: 42,
      flex: 1,
    },

    cancelButton: {
      minHeight: 42,
      paddingHorizontal: theme.spacing.xl,
    },

    pendingInfo: {
      flex: 1,
      minHeight: 42,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },

    emptyCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing['2xl'],
      alignItems: 'center',
      gap: theme.spacing.sm,
      ...(theme.shadows.card ?? {}),
    },

    emptyIcon: {
      width: 58,
      height: 58,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },

    emptyButton: {
      marginTop: theme.spacing.md,
    },

    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
  });
}