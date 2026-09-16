import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AdminStackParamList } from '../../../core/navigation/navigation.types';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { LanguageSelector } from '../../../shared/ui/molecules/LanguageSelector';
import { ThemeModeSelector } from '../../../shared/ui/molecules/ThemeModeSelector';
import { Screen } from '../../../shared/ui/templates/Screen';
import { useAuthStore } from '../../../store/auth.store';

type AdminMoreNavigation = NativeStackNavigationProp<AdminStackParamList>;

type AdminTool = {
  id: string;
  title: string;
  subtitle: string;
  icon: AppIconName;
  route: keyof AdminStackParamList;
  badge?: string;
};

type SettingRow = {
  id: string;
  title: string;
  subtitle: string;
  icon: AppIconName;
  route: keyof AdminStackParamList;
};

const adminTools: AdminTool[] = [
  {
    id: 'services',
    title: 'Services',
    subtitle: 'Manage hair, skin, and face treatments',
    icon: 'Sparkles',
    route: 'AdminServices',
  },
  {
    id: 'reports',
    title: 'Reports',
    subtitle: 'Clinic performance and appointment reports',
    icon: 'ChartNoAxesColumnIncreasing',
    route: 'AdminReports',
  },
  {
    id: 'payments',
    title: 'Payments',
    subtitle: 'Transactions, refunds, and payment history',
    icon: 'CreditCard',
    route: 'AdminPayments',
    badge: '12',
  },
  {
    id: 'promotions',
    title: 'Promotions',
    subtitle: 'Offers, banners, coupons, and campaigns',
    icon: 'BadgePercent',
    route: 'AdminPromotions',
  },
  {
    id: 'branches',
    title: 'Branches',
    subtitle: 'Manage clinic locations and branch details',
    icon: 'MapPinned',
    route: 'AdminBranches',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Push messages, reminders, and announcements',
    icon: 'BellRing',
    route: 'AdminNotifications',
    badge: '5',
  },
];

const settingsRows: SettingRow[] = [
  {
    id: 'clinic',
    title: 'Clinic Settings',
    subtitle: 'Business profile, working hours, and policies',
    icon: 'Settings',
    route: 'AdminSettings',
  },
  {
    id: 'staff',
    title: 'Staff Permissions',
    subtitle: 'Admin, doctor, and nurse access controls',
    icon: 'ShieldCheck',
    route: 'AdminStaffPermissions',
  },
  {
    id: 'security',
    title: 'Security & Audit Logs',
    subtitle: 'Login activity and sensitive action history',
    icon: 'LockKeyhole',
    route: 'AdminAuditLogs',
  },
];

export function AdminMoreScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<AdminMoreNavigation>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);

  return (
    <Screen
      title="More"
      subtitle="Admin tools"
      actions={[
        {
          icon: 'Bell',
          onPress: () => navigation.navigate('AdminNotifications'),
        },
      ]}
    >
      <View style={styles.root}>
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <AppIcon
                name="Menu"
                size={34}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.cardText}>
              <AppText variant="h2">Admin Control Center</AppText>

              <AppText color={theme.colors.textMuted}>
                Access services, reports, payments, promotions, branches,
                notifications, and clinic settings.
              </AppText>
            </View>
          </View>

          <View style={styles.roleCard}>
            <View style={styles.roleIcon}>
              <AppIcon
                name="ShieldCheck"
                size={21}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.cardText}>
              <AppText variant="bodyMedium">Clinic Owner Access</AppText>

              <AppText variant="caption" color={theme.colors.textMuted}>
                Full admin permissions enabled for this account.
              </AppText>
            </View>

            <View style={styles.activeBadge}>
              <AppText variant="small" color={theme.colors.successText}>
                Active
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Management Tools" />

          <View style={styles.toolsGrid}>
            {adminTools.map((tool) => (
              <Pressable
                key={tool.id}
                onPress={() => navigation.navigate(tool.route)}
                style={({ pressed }) => [
                  styles.toolCard,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.toolTop}>
                  <View style={styles.toolIcon}>
                    <AppIcon
                      name={tool.icon}
                      size={22}
                      color={theme.colors.primaryDark}
                    />
                  </View>

                  {tool.badge ? (
                    <View style={styles.badge}>
                      <AppText variant="small" color={theme.colors.errorText}>
                        {tool.badge}
                      </AppText>
                    </View>
                  ) : null}
                </View>

                <AppText variant="bodyMedium">{tool.title}</AppText>

                <AppText variant="caption" color={theme.colors.textMuted}>
                  {tool.subtitle}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Clinic Overview" />

          <View style={styles.overviewCard}>
            <View style={styles.overviewRow}>
              <OverviewItem label="Branches" value="3" icon="MapPin" />
              <View style={styles.overviewDivider} />
              <OverviewItem label="Services" value="27" icon="Sparkles" />
            </View>

            <View style={styles.overviewRow}>
              <OverviewItem label="Doctors" value="12" icon="Stethoscope" />
              <View style={styles.overviewDivider} />
              <OverviewItem label="Patients" value="284" icon="UsersRound" />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Settings" />

          <View style={styles.card}>
            {settingsRows.map((row, index) => (
              <SettingActionRow
                key={row.id}
                row={row}
                showDivider={index !== settingsRows.length - 1}
                onPress={() => navigation.navigate(row.route)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Appearance" />

          <AppText color={theme.colors.textMuted}>
            Choose how BATO Clinic looks on your device.
          </AppText>

          <ThemeModeSelector />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Language" />

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
                Sign out from the admin account.
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

function SectionHeader({ title }: { title: string }) {
  return <AppText variant="h3">{title}</AppText>;
}

function OverviewItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: AppIconName;
}) {
  const theme = useAppTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', gap: theme.spacing.xs }}>
      <AppIcon name={icon} size={21} color={theme.colors.primaryDark} />

      <AppText variant="h3">{value}</AppText>

      <AppText variant="small" color={theme.colors.textMuted}>
        {label}
      </AppText>
    </View>
  );
}

function SettingActionRow({
  row,
  showDivider,
  onPress,
}: {
  row: SettingRow;
  showDivider: boolean;
  onPress: () => void;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}
      >
        <View style={styles.rowIcon}>
          <AppIcon name={row.icon} size={20} color={theme.colors.primaryDark} />
        </View>

        <View style={styles.cardText}>
          <AppText variant="bodyMedium">{row.title}</AppText>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {row.subtitle}
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

    cardText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    roleCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    roleIcon: {
      width: 42,
      height: 42,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    activeBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.success,
    },

    section: {
      gap: theme.spacing.md,
    },

    toolsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },

    toolCard: {
      width: '47.8%',
      minHeight: 154,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
      ...(theme.shadows.card ?? {}),
    },

    toolTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },

    toolIcon: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    badge: {
      minWidth: 24,
      height: 24,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.error,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xs,
    },

    overviewCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
      ...(theme.shadows.card ?? {}),
    },

    overviewRow: {
      minHeight: 104,
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      gap: theme.spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },

    overviewDivider: {
      width: 1,
      height: '70%',
      backgroundColor: theme.colors.border,
    },

    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
      ...(theme.shadows.card ?? {}),
    },

    settingRow: {
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
      transform: [{ scale: 0.99 }],
    },
  });
}