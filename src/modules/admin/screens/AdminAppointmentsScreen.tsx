import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import {
  AdminCard,
  AdminDetailItem,
  AdminEmptyState,
  AdminFilterChips,
  AdminHeroCard,
  AdminSectionHeader,
  AdminStatusBadge,
} from '../components';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppInput } from '../../../shared/ui/atoms/AppInput';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
type FilterType = 'all' | AppointmentStatus;

type AdminAppointment = {
  id: string;
  patientName: string;
  doctorName: string;
  service: string;
  branch: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  paymentType: 'Online Paid' | 'Pay at Clinic';
  icon: AppIconName;
};

const filters: Array<{ label: string; value: FilterType }> = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const appointments: AdminAppointment[] = [
  {
    id: 'apt-1',
    patientName: 'Muhammad Talha',
    doctorName: 'Dr. Omar Khalid',
    service: 'Hair Growth Treatment',
    branch: 'Salmiya Branch',
    date: 'Today',
    time: '06:15 PM',
    status: 'pending',
    paymentType: 'Pay at Clinic',
    icon: 'Sparkles',
  },
  {
    id: 'apt-2',
    patientName: 'Aisha Khan',
    doctorName: 'Dr. Sarah Ahmed',
    service: 'Skin Consultation',
    branch: 'Main Branch',
    date: 'Tomorrow',
    time: '04:30 PM',
    status: 'pending',
    paymentType: 'Pay at Clinic',
    icon: 'ScanFace',
  },
  {
    id: 'apt-3',
    patientName: 'Omar Ali',
    doctorName: 'Dr. Lina Hassan',
    service: 'Hydration Facial Therapy',
    branch: 'Main Branch',
    date: 'Today',
    time: '07:00 PM',
    status: 'confirmed',
    paymentType: 'Online Paid',
    icon: 'Droplets',
  },
  {
    id: 'apt-4',
    patientName: 'Mariam Yousef',
    doctorName: 'Dr. Sarah Ahmed',
    service: 'Acne Treatment Follow-up',
    branch: 'Avenues Branch',
    date: 'Jun 17',
    time: '03:45 PM',
    status: 'completed',
    paymentType: 'Online Paid',
    icon: 'Activity',
  },
  {
    id: 'apt-5',
    patientName: 'Khalid Hassan',
    doctorName: 'Dr. Omar Khalid',
    service: 'Hair Nourishment Therapy',
    branch: 'Salmiya Branch',
    date: 'Jun 15',
    time: '05:00 PM',
    status: 'cancelled',
    paymentType: 'Pay at Clinic',
    icon: 'Leaf',
  },
];

export function AdminAppointmentsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const filteredAppointments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesFilter =
        selectedFilter === 'all' || appointment.status === selectedFilter;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        appointment.patientName.toLowerCase().includes(normalizedSearch) ||
        appointment.doctorName.toLowerCase().includes(normalizedSearch) ||
        appointment.service.toLowerCase().includes(normalizedSearch) ||
        appointment.branch.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [search, selectedFilter]);

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === 'pending',
  ).length;

  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === 'confirmed',
  ).length;

  return (
    <Screen
      title="Appointments"
      subtitle="Management"
      actions={[
        {
          icon: 'Bell',
          onPress: () => {},
        },
      ]}
    >
      <View style={styles.root}>
        <AdminHeroCard
          icon="CalendarClock"
          title="Appointment Control"
          description="Approve pay-at-clinic requests, review doctor assignments, and manage booking statuses."
        >
          <View style={styles.statsRow}>
            <SummaryItem label="Pending" value={`${pendingCount}`} />
            <View style={styles.statDivider} />
            <SummaryItem label="Confirmed" value={`${confirmedCount}`} />
            <View style={styles.statDivider} />
            <SummaryItem label="Total" value={`${appointments.length}`} />
          </View>
        </AdminHeroCard>

        <AppInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search patient, doctor, service, branch..."
          leftIcon="Search"
          rightIcon={search ? 'X' : undefined}
          onRightIconPress={() => setSearch('')}
        />

        <AdminFilterChips
          options={filters}
          selectedValue={selectedFilter}
          onChange={setSelectedFilter}
        />

        <AdminCard style={styles.noticeCard}>
          <View style={styles.noticeIcon}>
            <AppIcon name="Info" size={22} color={theme.colors.warningText} />
          </View>

          <View style={styles.cardText}>
            <AppText variant="bodyMedium">Pay-at-clinic approvals</AppText>

            <AppText variant="caption" color={theme.colors.textMuted}>
              Pending cash bookings require admin approval before confirmation.
            </AppText>
          </View>
        </AdminCard>

        <View style={styles.section}>
          <AdminSectionHeader
            title="Appointment List"
            subtitle={`${filteredAppointments.length} bookings found`}
          />

          <View style={styles.list}>
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </View>
        </View>

        {filteredAppointments.length === 0 ? (
          <AdminEmptyState
            icon="CalendarX"
            title="No appointments found"
            description="Try another search term or choose a different status filter."
          />
        ) : null}
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

function AppointmentCard({
  appointment,
}: {
  appointment: AdminAppointment;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const statusConfig = getStatusConfig(appointment.status);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.appointmentCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.appointmentTop}>
        <View style={styles.appointmentIcon}>
          <AppIcon
            name={appointment.icon}
            size={24}
            color={theme.colors.primaryDark}
          />
        </View>

        <View style={styles.cardText}>
          <View style={styles.titleRow}>
            <AppText variant="bodyMedium" style={styles.title}>
              {appointment.patientName}
            </AppText>

            <AdminStatusBadge
              label={statusConfig.label}
              type={statusConfig.type}
            />
          </View>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {appointment.service}
          </AppText>

          <AppText variant="caption" color={theme.colors.primaryDark}>
            {appointment.date} · {appointment.time}
          </AppText>
        </View>
      </View>

      <View style={styles.detailsBox}>
        <AdminDetailItem
          icon="Stethoscope"
          label="Doctor"
          value={appointment.doctorName}
        />

        <AdminDetailItem
          icon="MapPin"
          label="Branch"
          value={appointment.branch}
        />

        <AdminDetailItem
          icon="CreditCard"
          label="Payment"
          value={appointment.paymentType}
        />
      </View>

      {appointment.status === 'pending' ? (
        <View style={styles.actionRow}>
          <AppButton
            title="Approve"
            fullWidth={false}
            style={styles.actionButton}
          />

          <AppButton
            title="Reject"
            variant="outline"
            fullWidth={false}
            style={styles.actionButton}
          />
        </View>
      ) : null}

      {appointment.status === 'confirmed' ? (
        <View style={styles.actionRow}>
          <AppButton
            title="Reschedule"
            variant="outline"
            fullWidth={false}
            style={styles.actionButton}
          />

          <AppButton
            title="Mark Complete"
            fullWidth={false}
            style={styles.actionButton}
          />
        </View>
      ) : null}

      {appointment.status === 'completed' ? (
        <StatusInfo
          icon="CircleCheck"
          text="This appointment has been completed."
          color={theme.colors.successText}
        />
      ) : null}

      {appointment.status === 'cancelled' ? (
        <StatusInfo
          icon="CircleX"
          text="This appointment was cancelled."
          color={theme.colors.errorText}
        />
      ) : null}
    </Pressable>
  );
}

function StatusInfo({
  icon,
  text,
  color,
}: {
  icon: AppIconName;
  text: string;
  color: string;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.infoRow}>
      <AppIcon name={icon} size={17} color={color} />

      <AppText variant="caption" color={theme.colors.textMuted}>
        {text}
      </AppText>
    </View>
  );
}

function getStatusConfig(status: AppointmentStatus): {
  label: string;
  type: 'success' | 'warning' | 'error' | 'info';
} {
  const config = {
    pending: {
      label: 'Pending',
      type: 'warning',
    },
    confirmed: {
      label: 'Confirmed',
      type: 'success',
    },
    completed: {
      label: 'Completed',
      type: 'info',
    },
    cancelled: {
      label: 'Cancelled',
      type: 'error',
    },
  } as const;

  return config[status];
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing.xl,
    },

    statsRow: {
      minHeight: 82,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },

    statDivider: {
      width: 1,
      height: '65%',
      backgroundColor: theme.colors.border,
    },

    noticeCard: {
      backgroundColor: theme.colors.warning,
      flexDirection: 'row',
      alignItems: 'center',
    },

    noticeIcon: {
      width: 46,
      height: 46,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cardText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    section: {
      gap: theme.spacing.md,
    },

    list: {
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

    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
    },

    title: {
      flex: 1,
    },

    detailsBox: {
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },

    actionRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },

    actionButton: {
      flex: 1,
      minHeight: 42,
    },

    infoRow: {
      minHeight: 42,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },

    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
  });
}