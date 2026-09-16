import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

const plans = [
  {
    id: '1',
    title: 'Hair Rejuvenation Plan',
    doctor: 'Dr. Omar Khalid',
    progress: 50,
    sessions: '4 / 8 sessions',
    nextSession: 'Jun 22 · 06:30 PM',
    status: 'Active',
  },
  {
    id: '2',
    title: 'Skin Hydration Plan',
    doctor: 'Dr. Sarah Ahmed',
    progress: 100,
    sessions: '6 / 6 sessions',
    nextSession: 'Completed',
    status: 'Completed',
  },
];

export function TreatmentPlansScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Screen title="Treatment Plans" subtitle="Your care journey" showBack>
      <View style={styles.root}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <AppIcon
              name="ClipboardList"
              size={34}
              color={theme.colors.primaryDark}
            />
          </View>

          <View style={styles.heroText}>
            <AppText variant="h2">Personalized care plans</AppText>

            <AppText color={theme.colors.textMuted}>
              Track active treatments, completed sessions, doctor notes, and
              upcoming follow-ups.
            </AppText>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Active" value="1" icon="Activity" />
          <StatCard label="Completed" value="1" icon="CircleCheck" />
          <StatCard label="Sessions" value="10" icon="CalendarDays" />
        </View>

        <View style={styles.section}>
          <AppText variant="h3">My Plans</AppText>

          {plans.map((plan) => (
            <Pressable
              key={plan.id}
              style={({ pressed }) => [
                styles.planCard,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.planTop}>
                <View style={styles.planIcon}>
                  <AppIcon
                    name="Sparkles"
                    size={24}
                    color={theme.colors.primaryDark}
                  />
                </View>

                <View style={styles.planText}>
                  <View style={styles.titleRow}>
                    <AppText variant="bodyMedium" style={styles.title}>
                      {plan.title}
                    </AppText>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            plan.status === 'Active'
                              ? theme.colors.success
                              : theme.colors.info,
                        },
                      ]}
                    >
                      <AppText
                        variant="small"
                        color={
                          plan.status === 'Active'
                            ? theme.colors.successText
                            : theme.colors.infoText
                        }
                      >
                        {plan.status}
                      </AppText>
                    </View>
                  </View>

                  <AppText variant="caption" color={theme.colors.textMuted}>
                    {plan.doctor}
                  </AppText>
                </View>
              </View>

              <View style={styles.progressBox}>
                <View style={styles.progressHeader}>
                  <AppText variant="caption" color={theme.colors.textMuted}>
                    Treatment Progress
                  </AppText>

                  <AppText variant="caption" color={theme.colors.primaryDark}>
                    {plan.progress}%
                  </AppText>
                </View>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${plan.progress}%`,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.detailsBox}>
                <DetailRow icon="CalendarCheck" label="Sessions" value={plan.sessions} />
                <DetailRow icon="Clock" label="Next Session" value={plan.nextSession} />
              </View>

              <AppButton
                title="View Plan Details"
                variant="outline"
              />
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.statCard}>
      <AppIcon name={icon} size={20} color={theme.colors.primaryDark} />

      <AppText variant="h3">{value}</AppText>

      <AppText variant="small" color={theme.colors.textMuted}>
        {label}
      </AppText>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.detailRow}>
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

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing.xl,
    },

    heroCard: {
      borderRadius: theme.radius['2xl'],
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.xl,
      flexDirection: 'row',
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    heroIcon: {
      width: 70,
      height: 70,
      borderRadius: theme.radius['2xl'],
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    heroText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    statsRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },

    statCard: {
      flex: 1,
      minHeight: 112,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      ...(theme.shadows.card ?? {}),
    },

    section: {
      gap: theme.spacing.md,
    },

    planCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    planTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    planIcon: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    planText: {
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

    detailsBox: {
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },

    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },

    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.99 }],
    },
  });
}