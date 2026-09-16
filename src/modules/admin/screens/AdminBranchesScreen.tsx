import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import {
  AdminInfoCard,
  AdminSectionHeader,
  AdminStatCard,
  AdminStatusBadge,
} from '../components';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

const branches = [
  {
    id: '1',
    name: 'Main Branch',
    address: 'Salmiya, Kuwait',
    doctors: 5,
    appointments: 48,
    status: 'active',
  },
  {
    id: '2',
    name: 'Avenues Branch',
    address: 'Avenues Mall, Kuwait',
    doctors: 4,
    appointments: 31,
    status: 'active',
  },
  {
    id: '3',
    name: 'Farwaniya Branch',
    address: 'Farwaniya, Kuwait',
    doctors: 3,
    appointments: 19,
    status: 'inactive',
  },
];

export function AdminBranchesScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Screen
      title="Branches"
      subtitle="Clinic locations"
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
                name="MapPinned"
                size={32}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.heroContent}>
              <AppText variant="h2">Branch Management</AppText>

              <AppText color={theme.colors.textMuted}>
                Manage clinic locations, doctors, appointments, and branch
                operations.
              </AppText>
            </View>
          </View>

          <AppButton title="Add New Branch" />
        </AdminInfoCard>

        <View style={styles.statsRow}>
          <AdminStatCard
            label="Branches"
            value="3"
            icon="Building2"
          />

          <AdminStatCard
            label="Doctors"
            value="12"
            icon="Stethoscope"
          />
        </View>

        <View style={styles.statsRow}>
          <AdminStatCard
            label="Appointments"
            value="98"
            icon="CalendarDays"
          />

          <AdminStatCard
            label="Active"
            value="2"
            icon="CircleCheck"
          />
        </View>

        <View style={styles.section}>
          <AdminSectionHeader
            title="Clinic Branches"
            subtitle="Manage all clinic locations"
          />

          {branches.map((branch) => (
            <Pressable
              key={branch.id}
              style={({ pressed }) => [
                styles.branchCard,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.branchHeader}>
                <View style={styles.branchIcon}>
                  <AppIcon
                    name="Building2"
                    size={22}
                    color={theme.colors.primaryDark}
                  />
                </View>

                <View style={styles.branchContent}>
                  <AppText variant="bodyMedium">
                    {branch.name}
                  </AppText>

                  <AppText
                    variant="caption"
                    color={theme.colors.textMuted}
                  >
                    {branch.address}
                  </AppText>
                </View>

                <AdminStatusBadge
                  label={
                    branch.status === 'active'
                      ? 'Active'
                      : 'Inactive'
                  }
                  type={
                    branch.status === 'active'
                      ? 'success'
                      : 'error'
                  }
                />
              </View>

              <View style={styles.details}>
                <View style={styles.detailItem}>
                  <AppIcon
                    name="Stethoscope"
                    size={16}
                    color={theme.colors.primaryDark}
                  />

                  <AppText variant="caption">
                    {branch.doctors} Doctors
                  </AppText>
                </View>

                <View style={styles.detailItem}>
                  <AppIcon
                    name="CalendarDays"
                    size={16}
                    color={theme.colors.primaryDark}
                  />

                  <AppText variant="caption">
                    {branch.appointments} Appointments
                  </AppText>
                </View>
              </View>

              <View style={styles.actions}>
                <AppButton
                  title="Manage"
                  fullWidth={false}
                  style={styles.button}
                />

                <AppButton
                  title="Edit"
                  variant="outline"
                  fullWidth={false}
                  style={styles.button}
                />
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
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

    statsRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },

    section: {
      gap: theme.spacing.md,
    },

    branchCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    branchHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    branchIcon: {
      width: 50,
      height: 50,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    branchContent: {
      flex: 1,
    },

    details: {
      flexDirection: 'row',
      gap: theme.spacing.lg,
    },

    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },

    actions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },

    button: {
      flex: 1,
    },

    pressed: {
      opacity: 0.85,
    },
  });
}