import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { LanguageSelector } from '../../../shared/ui/molecules/LanguageSelector';
import { ThemeModeSelector } from '../../../shared/ui/molecules/ThemeModeSelector';
import { Screen } from '../../../shared/ui/templates/Screen';
import { useAuthStore } from '../../../store/auth.store';

type DoctorStat = {
  id: string;
  label: string;
  value: string;
  icon: AppIconName;
};

type InfoItem = {
  id: string;
  label: string;
  value: string;
  icon: AppIconName;
};

const stats: DoctorStat[] = [
  { id: 'patients', label: 'Patients', value: '24', icon: 'UsersRound' },
  { id: 'appointments', label: 'Today', value: '8', icon: 'CalendarCheck' },
  { id: 'rating', label: 'Rating', value: '4.9', icon: 'Star' },
];

const infoItems: InfoItem[] = [
  {
    id: 'specialty',
    label: 'Specialty',
    value: 'Dermatology & Skin Care',
    icon: 'Stethoscope',
  },
  {
    id: 'experience',
    label: 'Experience',
    value: '8 years',
    icon: 'BadgeCheck',
  },
  {
    id: 'branch',
    label: 'Branch',
    value: 'Main Branch',
    icon: 'MapPin',
  },
  {
    id: 'availability',
    label: 'Availability',
    value: '02:00 PM - 09:00 PM',
    icon: 'Clock',
  },
];

export function DoctorProfileScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);

  return (
    <Screen
      title="Profile"
      subtitle="Doctor account"
      actions={[
        {
          icon: 'Bell',
          onPress: () => {},
        },
      ]}
    >
      <View style={styles.root}>
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <AppIcon
                name="Stethoscope"
                size={34}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.profileText}>
              <AppText variant="h2">Dr. Sarah Ahmed</AppText>

              <AppText color={theme.colors.textMuted}>
                Dermatologist focused on personalized skin treatments,
                consultations, and long-term progress tracking.
              </AppText>

              <View style={styles.verifiedBadge}>
                <AppIcon
                  name="BadgeCheck"
                  size={16}
                  color={theme.colors.successText}
                />

                <AppText variant="small" color={theme.colors.successText}>
                  Verified Doctor
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.statusCard}>
            <View style={styles.onlineDot} />

            <View style={styles.cardText}>
              <AppText variant="bodyMedium">Available Today</AppText>

              <AppText variant="caption" color={theme.colors.textMuted}>
                Main Branch · 02:00 PM - 09:00 PM
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <View style={styles.statIcon}>
                <AppIcon
                  name={stat.icon}
                  size={21}
                  color={theme.colors.primaryDark}
                />
              </View>

              <AppText variant="h3">{stat.value}</AppText>

              <AppText variant="small" color={theme.colors.textMuted}>
                {stat.label}
              </AppText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <AppText variant="h3">Professional Information</AppText>

          <View style={styles.card}>
            {infoItems.map((item, index) => (
              <InfoRow
                key={item.id}
                item={item}
                showDivider={index !== infoItems.length - 1}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="h3">Doctor Actions</AppText>

          <View style={styles.card}>
            <ActionRow
              icon="CalendarDays"
              title="Manage Schedule"
              subtitle="Update availability and clinic hours"
              showDivider
            />

            <ActionRow
              icon="ClipboardList"
              title="Treatment Templates"
              subtitle="Reusable care plans and consultation notes"
              showDivider
            />

            <ActionRow
              icon="MessageCircleReply"
              title="Quick Replies"
              subtitle="Saved replies for patient messages"
              showDivider={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="h3">Appearance</AppText>

          <AppText color={theme.colors.textMuted}>
            Choose how BATO Clinic looks on your device.
          </AppText>

          <ThemeModeSelector />
        </View>

        <View style={styles.section}>
          <AppText variant="h3">Language</AppText>

          <AppText color={theme.colors.textMuted}>
            Choose your preferred app language.
          </AppText>

          <LanguageSelector />
        </View>

        <View style={styles.logoutCard}>
          <View style={styles.logoutInfo}>
            <View style={styles.logoutIcon}>
              <AppIcon
                name="LogOut"
                size={22}
                color={theme.colors.errorText}
              />
            </View>

            <View style={styles.cardText}>
              <AppText variant="bodyMedium">Logout</AppText>

              <AppText variant="caption" color={theme.colors.textMuted}>
                Sign out from this doctor account.
              </AppText>
            </View>
          </View>

          <AppButton
            title={isLoading ? 'Logging out...' : 'Logout'}
            variant="outline"
            loading={isLoading}
            disabled={isLoading}
            onPress={logout}
          />
        </View>
      </View>
    </Screen>
  );
}

function InfoRow({
  item,
  showDivider,
}: {
  item: InfoItem;
  showDivider: boolean;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View>
      <View style={styles.infoRow}>
        <View style={styles.rowIcon}>
          <AppIcon
            name={item.icon}
            size={20}
            color={theme.colors.primaryDark}
          />
        </View>

        <View style={styles.cardText}>
          <AppText variant="caption" color={theme.colors.textMuted}>
            {item.label}
          </AppText>

          <AppText variant="bodyMedium">{item.value}</AppText>
        </View>
      </View>

      {showDivider ? <View style={styles.divider} /> : null}
    </View>
  );
}

function ActionRow({
  icon,
  title,
  subtitle,
  showDivider,
}: {
  icon: AppIconName;
  title: string;
  subtitle: string;
  showDivider: boolean;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View>
      <Pressable style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}>
        <View style={styles.rowIcon}>
          <AppIcon name={icon} size={20} color={theme.colors.primaryDark} />
        </View>

        <View style={styles.cardText}>
          <AppText variant="bodyMedium">{title}</AppText>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {subtitle}
          </AppText>
        </View>

        <AppIcon
          name="ChevronRight"
          size={20}
          color={theme.colors.textMuted}
        />
      </Pressable>

      {showDivider ? <View style={styles.divider} /> : null}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing['2xl'],
    },

    profileCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius['2xl'],
      padding: theme.spacing['2xl'],
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.xl,
      ...(theme.shadows.card ?? {}),
    },

    profileTop: {
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

    profileText: {
      flex: 1,
      gap: theme.spacing.sm,
    },

    verifiedBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.success,
    },

    statusCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
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

    cardText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    statsGrid: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },

    statCard: {
      flex: 1,
      minHeight: 124,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      ...(theme.shadows.card ?? {}),
    },

    statIcon: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xs,
    },

    section: {
      gap: theme.spacing.md,
    },

    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
      ...(theme.shadows.card ?? {}),
    },

    infoRow: {
      minHeight: 72,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    actionRow: {
      minHeight: 76,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    rowIcon: {
      width: 42,
      height: 42,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
      marginLeft: theme.spacing.lg + 42 + theme.spacing.md,
    },

    logoutCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      ...(theme.shadows.card ?? {}),
    },

    logoutInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    logoutIcon: {
      width: 46,
      height: 46,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.error,
      alignItems: 'center',
      justifyContent: 'center',
    },

    pressed: {
      opacity: 0.82,
    },
  });
}