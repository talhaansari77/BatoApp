import React, { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { LanguageSelector } from '../../../shared/ui/molecules/LanguageSelector';
import { ThemeModeSelector } from '../../../shared/ui/molecules/ThemeModeSelector';
import { Screen } from '../../../shared/ui/templates/Screen';
import { useAuthStore } from '../../auth/store/auth.store';
import { ReportsStackParamList } from '../../../core/navigation/navigation.types';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

type ProfileStat = {
  id: string;
  label: string;
  value: string;
  icon: AppIconName;
};

type ProfileInfoItem = {
  id: string;
  label: string;
  value: string;
  icon: AppIconName;
};

type AccountAction = {
  id: string;
  title: string;
  subtitle: string;
  icon: AppIconName;
  onPress: () => void;
};

const profileStats: ProfileStat[] = [
  {
    id: 'appointments',
    label: 'Appointments',
    value: '12',
    icon: 'CalendarDays',
  },
  {
    id: 'plans',
    label: 'Active Plans',
    value: '1',
    icon: 'ClipboardList',
  },
  {
    id: 'progress',
    label: 'Progress Photos',
    value: '3',
    icon: 'Images',
  },
];



// type Props = BottomTabNavigationProp<ReportsStackParamList, "PatientProfile">;


export function PatientProfileScreen() {
  const navagation = useNavigation<any>();
  const theme = useAppTheme();
  const { t } = useTranslation();

  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  const styles = useMemo(() => createStyles(theme), [theme]);

const profileInfo: ProfileInfoItem[] = user
  ? [
      {
        id: 'phone',
        label: 'Phone',
        value: user.full_mobile_number,
        icon: 'Phone',
      },
      {
        id: 'patientId',
        label: 'Patient ID',
        value: user.patient_code,
        icon: 'BadgeCheck',
      },
      {
        id: 'civilId',
        label: 'Civil ID',
        value: user.civil_id,
        icon: 'BadgeCheck',
      },
    ]
  : [];
  useEffect(()=>{
    
  },[])

  const accountActions: AccountAction[] = [
    {
      id: 'records',
      title: 'Medical Records',
      subtitle: 'Consultation notes, prescriptions, and reports',
      icon: 'FileText',
      onPress: () => {
        navagation.navigate('ReportsApp', { screen: 'MedicalReports' })
      },
    },
    {
      id: 'payments',
      title: 'Payment Methods',
      subtitle: 'Saved cards and payment preferences',
      icon: 'CreditCard',
      onPress: () => {},
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Appointments, reminders, and promotions',
      icon: 'Bell',
      onPress: () => {},
    },
    {
      id: 'support',
      title: 'Help & Support',
      subtitle: 'Contact BATO Clinic support team',
      icon: 'Headphones',
      onPress: () => {},
    },
  ];

  return (
    <Screen
      title={t('common.profile')}
      // subtitle={t('profile.account')}
      actions={[
        {
          icon: 'Bell',
          onPress: () => {},
        },
      ]}
    >
      <View style={styles.root}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <AppText variant="h2" color={theme.colors.primaryDark}>
                MT
              </AppText>
            </View>

            <View style={styles.profileText}>
              <View style={styles.nameRow}>
                <AppText variant="h2" style={styles.name}>
                  {user?.full_name}
                </AppText>

                <View style={styles.verifiedBadge}>
                  <AppIcon
                    name="BadgeCheck"
                    size={16}
                    color={theme.colors.successText}
                  />

                  <AppText variant="small" color={theme.colors.successText}>
                    Verified
                  </AppText>
                </View>
              </View>

              {/* <AppText color={theme.colors.textMuted}>
                {t('profile.profileDescription')}
              </AppText> */}
            </View>
          </View>

          <View style={styles.membershipCard}>
            <View style={styles.membershipIcon}>
              <AppIcon
                name="Crown"
                size={22}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.cardText}>
              <AppText variant="bodyMedium">Premium Care Member</AppText>

              <AppText variant="caption" color={theme.colors.textMuted}>
                Personalized treatment tracking and priority care support.
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {profileStats.map((stat) => (
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
          <SectionHeader title="Personal Information" />

          <View style={styles.card}>
            {profileInfo.map((item, index) => (
              <InfoRow
                key={item.id}
                item={item}
                showDivider={index !== profileInfo.length - 1}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Care Preferences" />

          <View style={styles.preferenceCard}>
            <View style={styles.preferenceIcon}>
              <AppIcon
                name="HeartPulse"
                size={24}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.cardText}>
              <AppText variant="bodyMedium">Treatment Focus</AppText>

              <AppText variant="caption" color={theme.colors.textMuted}>
                Hair rejuvenation, skin hydration, and progress follow-ups.
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Account" />

          <View style={styles.card}>
            {accountActions.map((action, index) => (
              <ActionRow
                key={action.id}
                action={action}
                showDivider={index !== accountActions.length - 1}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title={t('common.appearance')} />

          <AppText
            color={theme.colors.textMuted}
            style={styles.sectionDescription}
          >
            {t('profile.appearanceDescription')}
          </AppText>

          <ThemeModeSelector />
        </View>

        <View style={styles.section}>
          <SectionHeader title={t('common.language')} />

          <AppText
            color={theme.colors.textMuted}
            style={styles.sectionDescription}
          >
            {t('profile.languageDescription')}
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
                Sign out from this device.
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

type SectionHeaderProps = {
  title: string;
};

function SectionHeader({ title }: SectionHeaderProps) {
  return <AppText variant="h3">{title}</AppText>;
}

type InfoRowProps = {
  item: ProfileInfoItem;
  showDivider: boolean;
};

function InfoRow({ item, showDivider }: InfoRowProps) {
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

type ActionRowProps = {
  action: AccountAction;
  showDivider: boolean;
};

function ActionRow({ action, showDivider }: ActionRowProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View>
      <Pressable
        onPress={action.onPress}
        style={({ pressed }) => [
          styles.actionRow,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.rowIcon}>
          <AppIcon
            name={action.icon}
            size={20}
            color={theme.colors.primaryDark}
          />
        </View>

        <View style={styles.cardText}>
          <AppText variant="bodyMedium">{action.title}</AppText>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {action.subtitle}
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

    profileHeader: {
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

    nameRow: {
      gap: theme.spacing.sm,
    },

    name: {
      flexShrink: 1,
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

    membershipCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.nude,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    membershipIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
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

    sectionDescription: {
      marginTop: -theme.spacing.xs,
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

    preferenceCard: {
      backgroundColor: theme.colors.info,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    preferenceIcon: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
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