import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import {
  AdminInfoCard,
  AdminSectionHeader,
} from '../components';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { LanguageSelector } from '../../../shared/ui/molecules/LanguageSelector';
import { ThemeModeSelector } from '../../../shared/ui/molecules/ThemeModeSelector';
import { Screen } from '../../../shared/ui/templates/Screen';

type SettingItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: AppIconName;
};

const clinicSettings: SettingItem[] = [
  {
    id: 'profile',
    title: 'Clinic Profile',
    subtitle: 'Name, contact number, email, and business details',
    icon: 'Building2',
  },
  {
    id: 'hours',
    title: 'Working Hours',
    subtitle: 'Opening days, closing time, and holidays',
    icon: 'Clock',
  },
  {
    id: 'payments',
    title: 'Payment Settings',
    subtitle: 'Online payment, pay-at-clinic, and refund rules',
    icon: 'CreditCard',
  },
  {
    id: 'booking',
    title: 'Booking Rules',
    subtitle: 'Approval rules, cancellations, and rescheduling',
    icon: 'CalendarCog',
  },
];

const policySettings: SettingItem[] = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    subtitle: 'Manage patient data privacy and policy content',
    icon: 'ShieldCheck',
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    subtitle: 'Clinic booking terms and patient agreement',
    icon: 'FileText',
  },
  {
    id: 'medical',
    title: 'Medical Consent',
    subtitle: 'Treatment consent and medical disclaimer text',
    icon: 'ClipboardCheck',
  },
];

export function AdminSettingsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Screen
      title="Settings"
      subtitle="Clinic configuration"
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
                name="Settings"
                size={32}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.heroContent}>
              <AppText variant="h2">Clinic Settings</AppText>

              <AppText color={theme.colors.textMuted}>
                Configure business details, booking rules, payment preferences,
                appearance, language, and clinic policies.
              </AppText>
            </View>
          </View>

          <AppButton title="Save Changes" />
        </AdminInfoCard>

        <View style={styles.section}>
          <AdminSectionHeader
            title="Clinic Configuration"
            subtitle="Core business and booking settings"
          />

          <View style={styles.card}>
            {clinicSettings.map((item, index) => (
              <SettingRow
                key={item.id}
                item={item}
                showDivider={index !== clinicSettings.length - 1}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AdminSectionHeader
            title="Policies"
            subtitle="Patient-facing legal and medical content"
          />

          <View style={styles.card}>
            {policySettings.map((item, index) => (
              <SettingRow
                key={item.id}
                item={item}
                showDivider={index !== policySettings.length - 1}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AdminSectionHeader
            title="Appearance"
            subtitle="Choose app theme mode"
          />

          <ThemeModeSelector />
        </View>

        <View style={styles.section}>
          <AdminSectionHeader
            title="Language"
            subtitle="Choose app language"
          />

          <LanguageSelector />
        </View>
      </View>
    </Screen>
  );
}

function SettingRow({
  item,
  showDivider,
}: {
  item: SettingItem;
  showDivider: boolean;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          styles.settingRow,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.rowIcon}>
          <AppIcon
            name={item.icon}
            size={20}
            color={theme.colors.primaryDark}
          />
        </View>

        <View style={styles.rowContent}>
          <AppText variant="bodyMedium">{item.title}</AppText>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {item.subtitle}
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

    rowContent: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
      marginLeft: theme.spacing.lg + 42 + theme.spacing.md,
    },

    pressed: {
      opacity: 0.85,
    },
  });
}