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

type PatientStatus = 'active' | 'new' | 'inactive';
type FilterType = 'all' | PatientStatus;

type AdminPatient = {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: PatientStatus;
  activePlan: string;
  lastVisit: string;
  nextVisit: string;
  appointments: number;
  branch: string;
  icon: AppIconName;
};

const filters: Array<{ label: string; value: FilterType }> = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'New', value: 'new' },
  { label: 'Inactive', value: 'inactive' },
];

const patients: AdminPatient[] = [
  {
    id: '1',
    name: 'Muhammad Talha',
    phone: '+965 0000 0000',
    email: 'muhammad.talha@email.com',
    status: 'active',
    activePlan: 'Hair Rejuvenation Plan',
    lastVisit: 'Jun 14',
    nextVisit: 'Jun 22',
    appointments: 12,
    branch: 'Salmiya Branch',
    icon: 'UserRound',
  },
  {
    id: '2',
    name: 'Aisha Khan',
    phone: '+965 1111 2222',
    email: 'aisha.khan@email.com',
    status: 'active',
    activePlan: 'Acne Treatment Plan',
    lastVisit: 'Jun 12',
    nextVisit: 'Jun 25',
    appointments: 8,
    branch: 'Main Branch',
    icon: 'UserRound',
  },
  {
    id: '3',
    name: 'Omar Ali',
    phone: '+965 3333 4444',
    email: 'omar.ali@email.com',
    status: 'new',
    activePlan: 'Consultation Pending',
    lastVisit: 'Not visited',
    nextVisit: 'Today',
    appointments: 1,
    branch: 'Main Branch',
    icon: 'UserRound',
  },
  {
    id: '4',
    name: 'Mariam Yousef',
    phone: '+965 5555 6666',
    email: 'mariam.yousef@email.com',
    status: 'inactive',
    activePlan: 'No active plan',
    lastVisit: 'May 18',
    nextVisit: 'Not scheduled',
    appointments: 4,
    branch: 'Avenues Branch',
    icon: 'UserRound',
  },
];

export function AdminPatientsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const filteredPatients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return patients.filter((patient) => {
      const matchesFilter =
        selectedFilter === 'all' || patient.status === selectedFilter;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        patient.name.toLowerCase().includes(normalizedSearch) ||
        patient.phone.toLowerCase().includes(normalizedSearch) ||
        patient.email.toLowerCase().includes(normalizedSearch) ||
        patient.activePlan.toLowerCase().includes(normalizedSearch) ||
        patient.branch.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [search, selectedFilter]);

  const activeCount = patients.filter(
    (patient) => patient.status === 'active',
  ).length;

  const newCount = patients.filter((patient) => patient.status === 'new').length;

  return (
    <Screen
      title="Patients"
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
          icon="UsersRound"
          title="Patient Management"
          description="Manage patient profiles, treatment plans, appointment history, and account status."
        >
          <View style={styles.statsRow}>
            <SummaryItem label="Total" value={`${patients.length}`} />
            <View style={styles.statDivider} />
            <SummaryItem label="Active" value={`${activeCount}`} />
            <View style={styles.statDivider} />
            <SummaryItem label="New" value={`${newCount}`} />
          </View>

          <AppButton title="Add Patient" />
        </AdminHeroCard>

        <AppInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search patient, phone, email, plan..."
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
            title="Patient List"
            subtitle={`${filteredPatients.length} patients found`}
          />

          <View style={styles.list}>
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </View>
        </View>

        {filteredPatients.length === 0 ? (
          <AdminEmptyState
            title="No patients found"
            description="Try another keyword or change the patient status filter."
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

function PatientCard({ patient }: { patient: AdminPatient }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const statusConfig = getStatusConfig(patient.status);

  return (
    <Pressable
      style={({ pressed }) => [styles.patientCard, pressed && styles.pressed]}
    >
      <View style={styles.patientTop}>
        <View style={styles.patientAvatar}>
          <AppIcon
            name={patient.icon}
            size={25}
            color={theme.colors.primaryDark}
          />
        </View>

        <View style={styles.cardText}>
          <View style={styles.titleRow}>
            <AppText variant="bodyMedium" style={styles.title}>
              {patient.name}
            </AppText>

            <AdminStatusBadge
              label={statusConfig.label}
              type={statusConfig.type}
            />
          </View>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {patient.phone}
          </AppText>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {patient.email}
          </AppText>
        </View>
      </View>

      <View style={styles.planCard}>
        <View style={styles.planIcon}>
          <AppIcon
            name="ClipboardList"
            size={20}
            color={theme.colors.primaryDark}
          />
        </View>

        <View style={styles.cardText}>
          <AppText variant="caption" color={theme.colors.textMuted}>
            Active Plan
          </AppText>

          <AppText variant="bodyMedium">{patient.activePlan}</AppText>
        </View>
      </View>

      <View style={styles.detailsBox}>
        <AdminDetailItem icon="MapPin" label="Branch" value={patient.branch} />

        <AdminDetailItem
          icon="CalendarCheck"
          label="Last Visit"
          value={patient.lastVisit}
        />

        <AdminDetailItem icon="Clock" label="Next Visit" value={patient.nextVisit} />

        <AdminDetailItem
          icon="CalendarDays"
          label="Appointments"
          value={`${patient.appointments}`}
        />
      </View>

      <View style={styles.actionRow}>
        <AppButton
          title="View Profile"
          fullWidth={false}
          style={styles.actionButton}
        />

        <AppButton
          title="Manage"
          variant="outline"
          fullWidth={false}
          style={styles.actionButton}
        />
      </View>
    </Pressable>
  );
}

function getStatusConfig(status: PatientStatus): {
  label: string;
  type: 'success' | 'warning' | 'error' | 'info';
} {
  const config = {
    active: {
      label: 'Active',
      type: 'success',
    },
    new: {
      label: 'New',
      type: 'info',
    },
    inactive: {
      label: 'Inactive',
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

    patientCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    patientTop: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      alignItems: 'center',
    },

    patientAvatar: {
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

    planCard: {
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.info,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    planIcon: {
      width: 42,
      height: 42,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
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