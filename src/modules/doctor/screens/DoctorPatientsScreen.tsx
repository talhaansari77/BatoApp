import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppInput } from '../../../shared/ui/atoms/AppInput';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

type PatientStatus = 'active' | 'followUp' | 'completed';
type FilterType = 'all' | PatientStatus;

type DoctorPatient = {
  id: string;
  name: string;
  age: string;
  treatment: string;
  lastVisit: string;
  nextVisit: string;
  status: PatientStatus;
  progress: number;
  icon: AppIconName;
};

const filters: Array<{ label: string; value: FilterType }> = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Follow-up', value: 'followUp' },
  { label: 'Completed', value: 'completed' },
];

const patients: DoctorPatient[] = [
  {
    id: '1',
    name: 'Muhammad Talha',
    age: '27 yrs',
    treatment: 'Hair Rejuvenation Plan',
    lastVisit: 'Jun 14',
    nextVisit: 'Jun 22',
    status: 'active',
    progress: 50,
    icon: 'UserRound',
  },
  {
    id: '2',
    name: 'Aisha Khan',
    age: '31 yrs',
    treatment: 'Acne Treatment Plan',
    lastVisit: 'Jun 12',
    nextVisit: 'Jun 25',
    status: 'followUp',
    progress: 65,
    icon: 'UserRound',
  },
  {
    id: '3',
    name: 'Omar Ali',
    age: '35 yrs',
    treatment: 'Hydration Facial Therapy',
    lastVisit: 'Jun 10',
    nextVisit: 'Completed',
    status: 'completed',
    progress: 100,
    icon: 'UserRound',
  },
  {
    id: '4',
    name: 'Mariam Yousef',
    age: '29 yrs',
    treatment: 'Skin Rejuvenation Plan',
    lastVisit: 'Jun 16',
    nextVisit: 'Jun 28',
    status: 'active',
    progress: 35,
    icon: 'UserRound',
  },
];

export function DoctorPatientsScreen() {
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
        patient.treatment.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [search, selectedFilter]);

  return (
    <Screen
      title="Patients"
      subtitle="Manage treatment care"
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
                name="UsersRound"
                size={34}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.cardText}>
              <AppText variant="h2">Patient Care</AppText>

              <AppText color={theme.colors.textMuted}>
                Review patient progress, care plans, follow-ups, and treatment
                notes.
              </AppText>
            </View>
          </View>

          <View style={styles.statsRow}>
            <StatItem label="Active" value="24" />
            <View style={styles.statDivider} />
            <StatItem label="Follow-up" value="7" />
            <View style={styles.statDivider} />
            <StatItem label="Completed" value="18" />
          </View>
        </View>

        <AppInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search patients or treatments..."
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
            <AppText variant="h3">Patient List</AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {filteredPatients.length} patients found
            </AppText>
          </View>

          <View style={styles.list}>
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </View>
        </View>

        {filteredPatients.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <AppIcon
                name="SearchX"
                size={30}
                color={theme.colors.primaryDark}
              />
            </View>

            <AppText variant="bodyMedium" align="center">
              No patients found
            </AppText>

            <AppText
              variant="caption"
              color={theme.colors.textMuted}
              align="center"
            >
              Try another keyword or choose a different filter.
            </AppText>
          </View>
        ) : null}
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

function PatientCard({ patient }: { patient: DoctorPatient }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const statusConfig = getStatusConfig(patient.status, theme);

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

          <AppText variant="caption" color={theme.colors.textMuted}>
            {patient.age} · {patient.treatment}
          </AppText>
        </View>
      </View>

      <View style={styles.progressBox}>
        <View style={styles.progressHeader}>
          <AppText variant="caption" color={theme.colors.textMuted}>
            Treatment Progress
          </AppText>

          <AppText variant="caption" color={theme.colors.primaryDark}>
            {patient.progress}%
          </AppText>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${patient.progress}%`,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.visitGrid}>
        <VisitItem icon="CalendarCheck" label="Last Visit" value={patient.lastVisit} />
        <VisitItem icon="Clock" label="Next Visit" value={patient.nextVisit} />
      </View>

      <View style={styles.actionRow}>
        <AppButton
          title="View Profile"
          fullWidth={false}
          style={styles.actionButton}
        />

        <AppButton
          title="Add Notes"
          variant="outline"
          fullWidth={false}
          style={styles.actionButton}
        />
      </View>
    </Pressable>
  );
}

function VisitItem({
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
    <View style={styles.visitItem}>
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
  status: PatientStatus,
  theme: ReturnType<typeof useAppTheme>,
) {
  const config = {
    active: {
      label: 'Active',
      backgroundColor: theme.colors.success,
      textColor: theme.colors.successText,
    },
    followUp: {
      label: 'Follow-up',
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
      width: 52,
      height: 52,
      borderRadius: theme.radius.full,
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

    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
    },

    progressBox: {
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },

    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    progressTrack: {
      height: 8,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      overflow: 'hidden',
    },

    progressFill: {
      height: '100%',
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primaryDark,
    },

    visitGrid: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },

    visitItem: {
      flex: 1,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
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

    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
  });
}