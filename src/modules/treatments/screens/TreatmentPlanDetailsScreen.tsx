import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

const sessions = [
  { id: '1', title: 'Session 1', date: 'Jun 01', status: 'completed' },
  { id: '2', title: 'Session 2', date: 'Jun 08', status: 'completed' },
  { id: '3', title: 'Session 3', date: 'Jun 15', status: 'completed' },
  { id: '4', title: 'Session 4', date: 'Jun 22', status: 'upcoming' },
];

export function TreatmentPlanDetailsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Screen title="Plan Details" subtitle="Treatment journey" showBack>
      <View style={styles.root}>
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <AppIcon
                name="Sparkles"
                size={34}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.heroText}>
              <View style={styles.titleRow}>
                <AppText variant="h2" style={styles.title}>
                  Hair Rejuvenation Plan
                </AppText>

                <View style={styles.statusBadge}>
                  <AppText variant="small" color={theme.colors.successText}>
                    Active
                  </AppText>
                </View>
              </View>

              <AppText color={theme.colors.textMuted}>
                Personalized treatment plan to improve hair strength, reduce
                hair fall, and support healthy growth.
              </AppText>
            </View>
          </View>

          <View style={styles.progressBox}>
            <View style={styles.progressHeader}>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Overall Progress
              </AppText>

              <AppText variant="caption" color={theme.colors.primaryDark}>
                50%
              </AppText>
            </View>

            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>

            <AppText variant="caption" color={theme.colors.textMuted}>
              4 of 8 sessions completed
            </AppText>
          </View>
        </View>

        <View style={styles.doctorCard}>
          <View style={styles.doctorIcon}>
            <AppIcon
              name="Stethoscope"
              size={26}
              color={theme.colors.primaryDark}
            />
          </View>

          <View style={styles.cardText}>
            <AppText variant="bodyMedium">Dr. Omar Khalid</AppText>

            <AppText variant="caption" color={theme.colors.textMuted}>
              Hair Specialist · 10 years experience
            </AppText>
          </View>

          <AppIcon
            name="ChevronRight"
            size={20}
            color={theme.colors.textMuted}
          />
        </View>

        <View style={styles.nextCard}>
          <View style={styles.nextIcon}>
            <AppIcon
              name="CalendarClock"
              size={24}
              color={theme.colors.primaryDark}
            />
          </View>

          <View style={styles.cardText}>
            <AppText variant="bodyMedium">Upcoming Session</AppText>

            <AppText variant="caption" color={theme.colors.textMuted}>
              Session 4 · Jun 22 · 06:30 PM
            </AppText>

            <AppText variant="caption" color={theme.colors.primaryDark}>
              Main Branch
            </AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="h3">Session Timeline</AppText>

          <View style={styles.timelineCard}>
            {sessions.map((session, index) => (
              <TimelineItem
                key={session.id}
                title={session.title}
                date={session.date}
                completed={session.status === 'completed'}
                isLast={index === sessions.length - 1}
              />
            ))}
          </View>
        </View>

        <View style={styles.notesCard}>
          <View style={styles.notesHeader}>
            <View style={styles.notesIcon}>
              <AppIcon
                name="FileText"
                size={22}
                color={theme.colors.primaryDark}
              />
            </View>

            <AppText variant="h3">Doctor Notes</AppText>
          </View>

          <AppText color={theme.colors.textMuted}>
            Patient responding well. Hair density improving gradually. Continue
            current treatment protocol and upload progress photos before the
            next session.
          </AppText>
        </View>

        <View style={styles.photosCard}>
          <View style={styles.photosHeader}>
            <View>
              <AppText variant="h3">Progress Photos</AppText>

              <AppText variant="caption" color={theme.colors.textMuted}>
                Before and after tracking
              </AppText>
            </View>

            <View style={styles.photoCountBadge}>
              <AppText variant="small" color={theme.colors.primaryDark}>
                3 Photos
              </AppText>
            </View>
          </View>

          <View style={styles.photoGrid}>
            <View style={styles.photoPlaceholder}>
              <AppIcon
                name="Image"
                size={24}
                color={theme.colors.primaryDark}
              />
              <AppText variant="small" color={theme.colors.textMuted}>
                Before
              </AppText>
            </View>

            <View style={styles.photoPlaceholder}>
              <AppIcon
                name="ImagePlus"
                size={24}
                color={theme.colors.primaryDark}
              />
              <AppText variant="small" color={theme.colors.textMuted}>
                Latest
              </AppText>
            </View>
          </View>
        </View>

        <AppButton title="View Session Details" />
      </View>
    </Screen>
  );
}

function TimelineItem({
  title,
  date,
  completed,
  isLast,
}: {
  title: string;
  date: string;
  completed: boolean;
  isLast: boolean;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View
          style={[
            styles.timelineDot,
            completed && styles.timelineDotCompleted,
          ]}
        >
          <AppIcon
            name={completed ? 'CircleCheck' : 'Clock'}
            size={16}
            color={completed ? theme.colors.card : theme.colors.primaryDark}
          />
        </View>

        {!isLast ? <View style={styles.timelineLine} /> : null}
      </View>

      <View style={styles.timelineContent}>
        <AppText variant="bodyMedium">{title}</AppText>

        <AppText variant="caption" color={theme.colors.textMuted}>
          {date}
        </AppText>
      </View>

      <View
        style={[
          styles.timelineBadge,
          {
            backgroundColor: completed
              ? theme.colors.success
              : theme.colors.warning,
          },
        ]}
      >
        <AppText
          variant="small"
          color={
            completed ? theme.colors.successText : theme.colors.warningText
          }
        >
          {completed ? 'Done' : 'Upcoming'}
        </AppText>
      </View>
    </Pressable>
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

    heroText: {
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
      backgroundColor: theme.colors.success,
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
      width: '50%',
      height: '100%',
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primaryDark,
    },

    doctorCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    doctorIcon: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    nextCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.info,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    nextIcon: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cardText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    section: {
      gap: theme.spacing.md,
    },

    timelineCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
      ...(theme.shadows.card ?? {}),
    },

    timelineItem: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      minHeight: 70,
    },

    timelineLeft: {
      alignItems: 'center',
    },

    timelineDot: {
      width: 32,
      height: 32,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.primaryDark,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.card,
    },

    timelineDotCompleted: {
      backgroundColor: theme.colors.primaryDark,
    },

    timelineLine: {
      flex: 1,
      width: 1,
      backgroundColor: theme.colors.border,
      marginTop: theme.spacing.xs,
    },

    timelineContent: {
      flex: 1,
      gap: theme.spacing.xs,
      paddingTop: theme.spacing.xs,
    },

    timelineBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      marginTop: theme.spacing.xs,
    },

    notesCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    notesHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    notesIcon: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    photosCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    photosHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },

    photoCountBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
    },

    photoGrid: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },

    photoPlaceholder: {
      flex: 1,
      minHeight: 110,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
    },
  });
}