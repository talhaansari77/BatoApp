import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

type AppointmentStatus = 'confirmed' | 'waiting' | 'completed';
type FilterType = 'all' | AppointmentStatus;

type DoctorAppointment = {
  id: string;
  patientName: string;
  treatment: string;
  time: string;
  branch: string;
  status: AppointmentStatus;
  payment: string;
  icon: AppIconName;
};

const filters: Array<{ label: string; value: FilterType }> = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Waiting', value: 'waiting' },
  { label: 'Completed', value: 'completed' },
];

const appointments: DoctorAppointment[] = [
  {
    id: '1',
    patientName: 'Muhammad Talha',
    treatment: 'Skin Consultation',
    time: '05:30 PM',
    branch: 'Main Branch',
    status: 'confirmed',
    payment: 'Online Paid',
    icon: 'ScanFace',
  },
  {
    id: '2',
    patientName: 'Aisha Khan',
    treatment: 'Hair Growth Treatment',
    time: '06:15 PM',
    branch: 'Salmiya Branch',
    status: 'waiting',
    payment: 'Pay at Clinic',
    icon: 'Sparkles',
  },
  {
    id: '3',
    patientName: 'Omar Ali',
    treatment: 'Hydration Facial Therapy',
    time: '07:00 PM',
    branch: 'Main Branch',
    status: 'confirmed',
    payment: 'Online Paid',
    icon: 'Droplets',
  },
  {
    id: '4',
    patientName: 'Mariam Yousef',
    treatment: 'Acne Treatment Follow-up',
    time: '03:45 PM',
    branch: 'Main Branch',
    status: 'completed',
    payment: 'Online Paid',
    icon: 'Activity',
  },
];

export function DoctorAppointmentsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const filteredAppointments = useMemo(() => {
    if (selectedFilter === 'all') {
      return appointments;
    }

    return appointments.filter(
      (appointment) => appointment.status === selectedFilter,
    );
  }, [selectedFilter]);

  return (
    <Screen
      title="Appointments"
      subtitle="Today’s doctor schedule"
      actions={[
        {
          icon: 'Bell',
          onPress: () => {},
        },
      ]}
    >
      <View style={styles.root}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryIcon}>
              <AppIcon
                name="CalendarCheck"
                size={34}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.cardText}>
              <AppText variant="h2">Today’s Visits</AppText>

              <AppText color={theme.colors.textMuted}>
                Manage consultations, waiting patients, and completed sessions.
              </AppText>
            </View>
          </View>

          <View style={styles.statsRow}>
            <StatItem label="Total" value="8" />
            <View style={styles.statDivider} />
            <StatItem label="Waiting" value="1" />
            <View style={styles.statDivider} />
            <StatItem label="Done" value="1" />
          </View>
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
                  style={isSelected ? styles.selectedText : undefined}
                >
                  {filter.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.section}>
          <View>
            <AppText variant="h3">Schedule</AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {filteredAppointments.length} appointments found
            </AppText>
          </View>

          <View style={styles.list}>
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </View>
        </View>
      </View>
    </Screen>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
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
  appointment: DoctorAppointment;
}) {
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

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusConfig.backgroundColor },
              ]}
            >
              <AppText variant="small" color={statusConfig.textColor}>
                {statusConfig.label}
              </AppText>
            </View>
          </View>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {appointment.treatment}
          </AppText>

          <View style={styles.metaRow}>
            <AppIcon name="Clock" size={15} color={theme.colors.textMuted} />
            <AppText variant="caption" color={theme.colors.textMuted}>
              {appointment.time}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.detailsBox}>
        <DetailItem icon="MapPin" label="Branch" value={appointment.branch} />
        <DetailItem icon="CreditCard" label="Payment" value={appointment.payment} />
      </View>

      <View style={styles.actionRow}>
        {appointment.status === 'completed' ? (
          <>
            <AppButton
              title="View Notes"
              fullWidth={false}
              style={styles.actionButton}
            />

            <AppButton
              title="Follow-up"
              variant="outline"
              fullWidth={false}
              style={styles.actionButton}
            />
          </>
        ) : (
          <>
            <AppButton
              title="Start Consultation"
              fullWidth={false}
              style={styles.actionButton}
            />

            <AppButton
              title="Add Notes"
              variant="outline"
              fullWidth={false}
              style={styles.actionButton}
            />
          </>
        )}
      </View>
    </Pressable>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: AppIconName;
  label: string;
  value: string;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.detailItem}>
      <AppIcon name={icon} size={17} color={theme.colors.primaryDark} />

      <View>
        <AppText variant="small" color={theme.colors.textMuted}>
          {label}
        </AppText>

        <AppText variant="caption">{value}</AppText>
      </View>
    </View>
  );
}

function getStatusConfig(
  status: AppointmentStatus,
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
      label: 'Completed',
      backgroundColor: theme.colors.info,
      textColor: theme.colors.infoText,
    },
  };

  return config[status];
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing.xl,
    },

    summaryCard: {
      borderRadius: theme.radius['2xl'],
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.xl,
      gap: theme.spacing.lg,
      ...(theme.shadows.card ?? {}),
    },

    summaryTop: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },

    summaryIcon: {
      width: 70,
      height: 70,
      borderRadius: theme.radius['2xl'],
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cardText: {
      flex: 1,
      gap: theme.spacing.xs,
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
      gap: theme.spacing.sm,
      alignItems: 'flex-start',
    },

    title: {
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
      gap: theme.spacing.sm,
    },

    actionButton: {
      flex: 1,
      minHeight: 42,
    },

    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
  });
}