import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import {
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

type DoctorStatus = 'available' | 'busy' | 'offline';
type FilterType = 'all' | DoctorStatus;

type AdminDoctor = {
  id: string;
  name: string;
  specialty: string;
  branch: string;
  experience: string;
  appointmentsToday: number;
  rating: string;
  status: DoctorStatus;
  icon: AppIconName;
};

const filters: Array<{ label: string; value: FilterType }> = [
  { label: 'All', value: 'all' },
  { label: 'Available', value: 'available' },
  { label: 'Busy', value: 'busy' },
  { label: 'Offline', value: 'offline' },
];

const doctors: AdminDoctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Ahmed',
    specialty: 'Dermatologist',
    branch: 'Main Branch',
    experience: '8 years',
    appointmentsToday: 8,
    rating: '4.9',
    status: 'available',
    icon: 'Stethoscope',
  },
  {
    id: '2',
    name: 'Dr. Omar Khalid',
    specialty: 'Hair Specialist',
    branch: 'Salmiya Branch',
    experience: '10 years',
    appointmentsToday: 6,
    rating: '4.8',
    status: 'busy',
    icon: 'Stethoscope',
  },
  {
    id: '3',
    name: 'Dr. Lina Hassan',
    specialty: 'Facial Therapy Specialist',
    branch: 'Main Branch',
    experience: '6 years',
    appointmentsToday: 4,
    rating: '4.7',
    status: 'available',
    icon: 'Stethoscope',
  },
  {
    id: '4',
    name: 'Dr. Mariam Ali',
    specialty: 'Aesthetic Specialist',
    branch: 'Avenues Branch',
    experience: '9 years',
    appointmentsToday: 0,
    rating: '4.9',
    status: 'offline',
    icon: 'Stethoscope',
  },
];

export function AdminDoctorsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const filteredDoctors = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesFilter =
        selectedFilter === 'all' || doctor.status === selectedFilter;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        doctor.name.toLowerCase().includes(normalizedSearch) ||
        doctor.specialty.toLowerCase().includes(normalizedSearch) ||
        doctor.branch.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [search, selectedFilter]);

  const availableCount = doctors.filter(
    (doctor) => doctor.status === 'available',
  ).length;

  const busyCount = doctors.filter((doctor) => doctor.status === 'busy').length;

  return (
    <Screen
      title="Doctors"
      subtitle="Staff"
      actions={[
        {
          icon: 'Bell',
          onPress: () => {},
        },
      ]}
    >
      <View style={styles.root}>
        <AdminHeroCard
          icon="Stethoscope"
          title="Doctor Management"
          description="Manage doctors, specialties, branches, schedules, and daily appointment load."
        >
          <View style={styles.statsRow}>
            <SummaryItem label="Total" value={`${doctors.length}`} />
            <View style={styles.statDivider} />
            <SummaryItem label="Available" value={`${availableCount}`} />
            <View style={styles.statDivider} />
            <SummaryItem label="Busy" value={`${busyCount}`} />
          </View>

          <AppButton title="Add Doctor" />
        </AdminHeroCard>

        <AppInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search doctor, specialty, branch..."
          leftIcon="Search"
          rightIcon={search ? 'X' : undefined}
          onRightIconPress={() => setSearch('')}
        />

        <AdminFilterChips
          options={filters}
          selectedValue={selectedFilter}
          onChange={setSelectedFilter}
        />

        <View style={styles.section}>
          <AdminSectionHeader
            title="Doctor List"
            subtitle={`${filteredDoctors.length} doctors found`}
          />

          <View style={styles.list}>
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </View>
        </View>

        {filteredDoctors.length === 0 ? (
          <AdminEmptyState
            title="No doctors found"
            description="Try another keyword or change the availability filter."
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

function DoctorCard({ doctor }: { doctor: AdminDoctor }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const statusConfig = getStatusConfig(doctor.status);

  return (
    <Pressable
      style={({ pressed }) => [styles.doctorCard, pressed && styles.pressed]}
    >
      <View style={styles.doctorTop}>
        <View style={styles.doctorAvatar}>
          <AppIcon
            name={doctor.icon}
            size={26}
            color={theme.colors.primaryDark}
          />
        </View>

        <View style={styles.cardText}>
          <View style={styles.titleRow}>
            <AppText variant="bodyMedium" style={styles.title}>
              {doctor.name}
            </AppText>

            <AdminStatusBadge
              label={statusConfig.label}
              type={statusConfig.type}
            />
          </View>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {doctor.specialty}
          </AppText>
        </View>
      </View>

      <View style={styles.detailsBox}>
        <AdminDetailItem icon="MapPin" label="Branch" value={doctor.branch} />

        <AdminDetailItem
          icon="BadgeCheck"
          label="Experience"
          value={doctor.experience}
        />

        <AdminDetailItem
          icon="CalendarDays"
          label="Today"
          value={`${doctor.appointmentsToday} appointments`}
        />

        <AdminDetailItem icon="Star" label="Rating" value={doctor.rating} />
      </View>

      <View style={styles.actionRow}>
        <AppButton
          title="Manage Schedule"
          fullWidth={false}
          style={styles.actionButton}
        />

        <AppButton
          title="Edit"
          variant="outline"
          fullWidth={false}
          style={styles.actionButton}
        />
      </View>
    </Pressable>
  );
}

function getStatusConfig(status: DoctorStatus): {
  label: string;
  type: 'success' | 'warning' | 'error' | 'info';
} {
  const config = {
    available: {
      label: 'Available',
      type: 'success',
    },
    busy: {
      label: 'Busy',
      type: 'warning',
    },
    offline: {
      label: 'Offline',
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

    section: {
      gap: theme.spacing.md,
    },

    list: {
      gap: theme.spacing.md,
    },

    doctorCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    doctorTop: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      alignItems: 'center',
    },

    doctorAvatar: {
      width: 54,
      height: 54,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cardText: {
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

    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
  });
}