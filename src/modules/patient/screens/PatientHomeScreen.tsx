import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { PatientTabParamList } from '../../../core/navigation/navigation.types';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

type PatientHomeNavigation = BottomTabNavigationProp<
  PatientTabParamList,
  'PatientHome'
>;

type QuickAction = {
  id: string;
  title: string;
  subtitle: string;
  icon: AppIconName;
  route: keyof PatientTabParamList;
};

type ServiceCategory = {
  id: string;
  title: string;
  subtitle: string;
  icon: AppIconName;
};

type Specialist = {
  id: string;
  name: string;
  specialty: string;
  rating: string;
  experience: string;
};

const quickActions: QuickAction[] = [
  {
    id: 'book',
    title: 'Book Visit',
    subtitle: 'Start booking',
    icon: 'CalendarPlus',
    route: 'PatientServices',
  },
  {
    id: 'appointments',
    title: 'Appointments',
    subtitle: 'Upcoming visits',
    icon: 'CalendarDays',
    route: 'PatientAppointments',
  },
  {
    id: 'progress',
    title: 'Progress',
    subtitle: 'Track care plan',
    icon: 'ChartNoAxesColumnIncreasing',
    route: 'PatientProgress',
  },
  {
    id: 'profile',
    title: 'Profile',
    subtitle: 'Your care info',
    icon: 'UserRound',
    route: 'PatientProfile',
  },
];

const serviceCategories: ServiceCategory[] = [
  {
    id: 'hair',
    title: 'Hair Treatments',
    subtitle: 'Growth, fall control, nourishment',
    icon: 'Sparkles',
  },
  {
    id: 'skin',
    title: 'Skin Treatments',
    subtitle: 'Acne, hydration, pigmentation',
    icon: 'ScanFace',
  },
  {
    id: 'face',
    title: 'Face Treatments',
    subtitle: 'Fillers, botox, lifting',
    icon: 'SmilePlus',
  },
];

const specialists: Specialist[] = [
  {
    id: '1',
    name: 'Dr. Sarah Ahmed',
    specialty: 'Dermatologist',
    rating: '4.9',
    experience: '8 yrs',
  },
  {
    id: '2',
    name: 'Dr. Omar Khalid',
    specialty: 'Hair Specialist',
    rating: '4.8',
    experience: '10 yrs',
  },
];

export function PatientHomeScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<PatientHomeNavigation>();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const navigateToTab = (route: keyof PatientTabParamList) => {
    navigation.navigate(route);
  };

  return (
    <Screen
      title="Home"
      subtitle="Welcome to BATO Clinic"
      actions={[
        {
          icon: 'Bell',
          onPress: () => {},
        },
      ]}
    >
      <View style={styles.root}>
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTop}>
            <View style={styles.avatar}>
              <AppIcon
                name="UserRound"
                size={28}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.welcomeText}>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Good morning
              </AppText>

              <AppText variant="h3">Muhammad Talha</AppText>
            </View>
          </View>

          <View style={styles.heroBox}>
            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <AppIcon
                  name="Sparkles"
                  size={15}
                  color={theme.colors.primaryDark}
                />
                <AppText variant="small" color={theme.colors.primaryDark}>
                  Premium Care
                </AppText>
              </View>

              <AppText variant="h2" style={styles.heroTitle}>
                Your beauty and wellness journey starts here
              </AppText>

              <AppText color={theme.colors.textMuted} style={styles.heroText}>
                Book treatments, follow care plans, and track your progress with
                BATO Clinic.
              </AppText>

              <AppButton
                title="Book Appointment"
                fullWidth={false}
                style={styles.heroButton}
                onPress={() => navigateToTab('PatientServices')}
              />
            </View>

            <View style={styles.heroIcon}>
              <AppIcon
                name="HeartPulse"
                size={42}
                color={theme.colors.primaryDark}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Quick Actions"
            actionLabel="View all"
            onActionPress={() => navigateToTab('PatientServices')}
          />

          <View style={styles.quickGrid}>
            {quickActions.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => navigateToTab(item.route)}
                style={({ pressed }) => [
                  styles.quickCard,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.quickIcon}>
                  <AppIcon
                    name={item.icon}
                    size={22}
                    color={theme.colors.primaryDark}
                  />
                </View>

                <AppText variant="bodyMedium">{item.title}</AppText>

                <AppText
                  variant="caption"
                  color={theme.colors.textMuted}
                  style={styles.quickSubtitle}
                >
                  {item.subtitle}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Services"
            actionLabel="See all"
            onActionPress={() => navigateToTab('PatientServices')}
          />

          <View style={styles.list}>
            {serviceCategories.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => navigateToTab('PatientServices')}
                style={({ pressed }) => [
                  styles.serviceCard,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.serviceIcon}>
                  <AppIcon
                    name={item.icon}
                    size={24}
                    color={theme.colors.primaryDark}
                  />
                </View>

                <View style={styles.cardText}>
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
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Upcoming Appointment"
            actionLabel="Details"
            onActionPress={() => navigateToTab('PatientAppointments')}
          />

          <Pressable
            onPress={() => navigateToTab('PatientAppointments')}
            style={({ pressed }) => [
              styles.appointmentCard,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.appointmentIcon}>
              <AppIcon
                name="CalendarCheck"
                size={24}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.cardText}>
              <AppText variant="bodyMedium">Skin Consultation</AppText>

              <AppText
                variant="caption"
                color={theme.colors.primaryDark}
                style={styles.appointmentTime}
              >
                Today · 05:30 PM
              </AppText>

              <AppText variant="caption" color={theme.colors.textMuted}>
                Dr. Sarah Ahmed · Main Branch
              </AppText>
            </View>

            <View style={styles.statusBadge}>
              <AppText variant="small" color={theme.colors.successText}>
                Confirmed
              </AppText>
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Treatment Progress"
            actionLabel="View"
            onActionPress={() => navigateToTab('PatientProgress')}
          />

          <Pressable
            onPress={() => navigateToTab('PatientProgress')}
            style={({ pressed }) => [
              styles.progressCard,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.progressHeader}>
              <View style={styles.cardText}>
                <AppText variant="bodyMedium">Hair Rejuvenation Plan</AppText>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  4 of 8 sessions completed
                </AppText>
              </View>

              <AppText variant="h3" color={theme.colors.primaryDark}>
                50%
              </AppText>
            </View>

            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>

            <View style={styles.progressFooter}>
              <View style={styles.inlineInfo}>
                <AppIcon
                  name="CircleCheck"
                  size={16}
                  color={theme.colors.successText}
                />
                <AppText variant="caption" color={theme.colors.textMuted}>
                  Improving
                </AppText>
              </View>

              <View style={styles.inlineInfo}>
                <AppIcon
                  name="Clock"
                  size={16}
                  color={theme.colors.warningText}
                />
                <AppText variant="caption" color={theme.colors.textMuted}>
                  Next: Jun 22
                </AppText>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Featured Specialists" />

          <View style={styles.specialistList}>
            {specialists.map((item) => (
              <View key={item.id} style={styles.specialistCard}>
                <View style={styles.specialistAvatar}>
                  <AppIcon
                    name="Stethoscope"
                    size={24}
                    color={theme.colors.primaryDark}
                  />
                </View>

                <View style={styles.cardText}>
                  <AppText variant="bodyMedium">{item.name}</AppText>
                  <AppText variant="caption" color={theme.colors.textMuted}>
                    {item.specialty}
                  </AppText>
                </View>

                <View style={styles.specialistMeta}>
                  <View style={styles.inlineInfo}>
                    <AppIcon
                      name="Star"
                      size={14}
                      color={theme.colors.warningText}
                    />
                    <AppText variant="small">{item.rating}</AppText>
                  </View>

                  <AppText variant="small" color={theme.colors.textMuted}>
                    {item.experience}
                  </AppText>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.recommendationCard}>
          <View style={styles.recommendationIcon}>
            <AppIcon
              name="BadgePercent"
              size={24}
              color={theme.colors.primaryDark}
            />
          </View>

          <View style={styles.cardText}>
            <AppText variant="bodyMedium">Recommended for you</AppText>

            <AppText variant="caption" color={theme.colors.textMuted}>
              Hydration Facial Therapy is suggested based on your recent care
              interest.
            </AppText>
          </View>
        </View>
      </View>
    </Screen>
  );
}

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

function SectionHeader({
  title,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) {
  const theme = useAppTheme();

  return (
    <View style={sectionHeaderStyles.row}>
      <AppText variant="h3">{title}</AppText>

      {actionLabel ? (
        <Pressable onPress={onActionPress} hitSlop={10}>
          <AppText variant="caption" color={theme.colors.primaryDark}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing['2xl'],
    },

    welcomeCard: {
      gap: theme.spacing.lg,
    },

    welcomeTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    avatar: {
      width: 54,
      height: 54,
      borderRadius: theme.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.cardMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    welcomeText: {
      flex: 1,
    },

    heroBox: {
      borderRadius: theme.radius['2xl'],
      backgroundColor: theme.colors.nude,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.xl,
      flexDirection: 'row',
      overflow: 'hidden',
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    heroContent: {
      flex: 1,
      gap: theme.spacing.md,
    },

    heroBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.card,
    },

    heroTitle: {
      maxWidth: 260,
    },

    heroText: {
      maxWidth: 260,
    },

    heroButton: {
      marginTop: theme.spacing.xs,
      paddingHorizontal: theme.spacing.xl,
    },

    heroIcon: {
      width: 78,
      height: 78,
      borderRadius: theme.radius['2xl'],
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },

    section: {
      gap: theme.spacing.md,
    },

    quickGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },

    quickCard: {
      width: '47.8%',
      minHeight: 128,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.xs,
      ...theme.shadows.card,
    },

    quickIcon: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },

    quickSubtitle: {
      marginTop: -2,
    },

    list: {
      gap: theme.spacing.md,
    },

    serviceCard: {
      minHeight: 78,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    serviceIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cardText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    appointmentCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    appointmentIcon: {
      width: 50,
      height: 50,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    appointmentTime: {
      fontWeight: '600',
    },

    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.success,
    },

    progressCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    progressHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },

    progressTrack: {
      height: 9,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      overflow: 'hidden',
    },

    progressFill: {
      width: '50%',
      height: '100%',
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primaryDark,
    },

    progressFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },

    inlineInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },

    specialistList: {
      gap: theme.spacing.md,
    },

    specialistCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    specialistAvatar: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    specialistMeta: {
      alignItems: 'flex-end',
      gap: theme.spacing.xs,
    },

    recommendationCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.info,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },

    recommendationIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },

    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
  });
}

const sectionHeaderStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});