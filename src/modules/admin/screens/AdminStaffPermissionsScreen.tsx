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

type StaffRole = 'admin' | 'doctor' | 'nurse';
type FilterType = 'all' | StaffRole;

type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  accessLevel: string;
  status: 'active' | 'inactive';
  lastActive: string;
  icon: AppIconName;
};

const filters: Array<{ label: string; value: FilterType }> = [
  { label: 'All', value: 'all' },
  { label: 'Admins', value: 'admin' },
  { label: 'Doctors', value: 'doctor' },
  { label: 'Nurses', value: 'nurse' },
];

const staffMembers: StaffMember[] = [
  {
    id: '1',
    name: 'Clinic Owner',
    email: 'owner@batoclinic.com',
    role: 'admin',
    accessLevel: 'Full Access',
    status: 'active',
    lastActive: 'Now',
    icon: 'ShieldCheck',
  },
  {
    id: '2',
    name: 'Dr. Sarah Ahmed',
    email: 'sarah@batoclinic.com',
    role: 'doctor',
    accessLevel: 'Patient Care',
    status: 'active',
    lastActive: '10 min ago',
    icon: 'Stethoscope',
  },
  {
    id: '3',
    name: 'Dr. Omar Khalid',
    email: 'omar@batoclinic.com',
    role: 'doctor',
    accessLevel: 'Patient Care',
    status: 'active',
    lastActive: '25 min ago',
    icon: 'Stethoscope',
  },
  {
    id: '4',
    name: 'Nurse Amina',
    email: 'amina@batoclinic.com',
    role: 'nurse',
    accessLevel: 'Session Support',
    status: 'inactive',
    lastActive: 'Yesterday',
    icon: 'UserRoundCheck',
  },
];

export function AdminStaffPermissionsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();

    return staffMembers.filter((member) => {
      const matchesFilter =
        selectedFilter === 'all' || member.role === selectedFilter;

      const matchesSearch =
        query.length === 0 ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.accessLevel.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [search, selectedFilter]);

  return (
    <Screen
      title="Staff Permissions"
      subtitle="Access control"
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
                name="ShieldCheck"
                size={32}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.heroContent}>
              <AppText variant="h2">Permissions</AppText>

              <AppText color={theme.colors.textMuted}>
                Manage admin, doctor, and nurse access levels across BATO
                Clinic.
              </AppText>
            </View>
          </View>

          <AppButton title="Invite Staff Member" />
        </AdminInfoCard>

        <AppInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search staff..."
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
          <AdminSectionHeader
            title="Staff Access"
            subtitle={`${filteredStaff.length} staff members found`}
          />

          {filteredStaff.map((member) => (
            <StaffCard key={member.id} member={member} />
          ))}
        </View>
      </View>
    </Screen>
  );
}

function StaffCard({ member }: { member: StaffMember }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      style={({ pressed }) => [styles.staffCard, pressed && styles.pressed]}
    >
      <View style={styles.staffHeader}>
        <View style={styles.staffIcon}>
          <AppIcon
            name={member.icon}
            size={22}
            color={theme.colors.primaryDark}
          />
        </View>

        <View style={styles.staffContent}>
          <AppText variant="bodyMedium">{member.name}</AppText>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {member.email}
          </AppText>
        </View>

        <AdminStatusBadge
          label={member.status === 'active' ? 'Active' : 'Inactive'}
          type={member.status === 'active' ? 'success' : 'error'}
        />
      </View>

      <View style={styles.detailsBox}>
        <DetailItem
          icon="BadgeCheck"
          label="Role"
          value={member.role.toUpperCase()}
        />

        <DetailItem
          icon="LockKeyhole"
          label="Access"
          value={member.accessLevel}
        />

        <DetailItem
          icon="Clock"
          label="Last Active"
          value={member.lastActive}
        />
      </View>

      <View style={styles.actions}>
        <AppButton
          title="Edit Access"
          fullWidth={false}
          style={styles.button}
        />

        <AppButton
          title="Disable"
          variant="outline"
          fullWidth={false}
          style={styles.button}
        />
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

    staffCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    staffHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    staffIcon: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    staffContent: {
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
      opacity: 0.85,
    },
  });
}