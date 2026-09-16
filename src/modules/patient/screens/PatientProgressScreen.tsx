import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { PatientTabParamList } from '../../../core/navigation/navigation.types';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

type PatientProgressNavigation = BottomTabNavigationProp<
  PatientTabParamList,
  'PatientProgress'
>;

type ProgressTab = 'overview' | 'sessions' | 'gallery';

type TreatmentPlan = {
  id: string;
  title: string;
  doctor: string;
  branch: string;
  completedSessions: number;
  totalSessions: number;
  nextSession: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  icon: AppIconName;
};

type TreatmentSession = {
  id: string;
  title: string;
  date: string;
  time: string;
  status: 'completed' | 'upcoming';
  note: string;
  icon: AppIconName;
};

type ProgressPhoto = {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: AppIconName;
};

const progressTabs: Array<{
  label: string;
  value: ProgressTab;
}> = [
  {
    label: 'Overview',
    value: 'overview',
  },
  {
    label: 'Sessions',
    value: 'sessions',
  },
  {
    label: 'Gallery',
    value: 'gallery',
  },
];

const activePlan: TreatmentPlan = {
  id: 'plan-1',
  title: 'Hair Rejuvenation Plan',
  doctor: 'Dr. Omar Khalid',
  branch: 'Salmiya Branch',
  completedSessions: 4,
  totalSessions: 8,
  nextSession: 'Jun 22 · 07:00 PM',
  progress: 50,
  status: 'active',
  icon: 'Sparkles',
};

const sessions: TreatmentSession[] = [
  {
    id: 'session-1',
    title: 'Initial Consultation',
    date: 'May 20',
    time: '05:00 PM',
    status: 'completed',
    note: 'Doctor reviewed scalp condition and started care plan.',
    icon: 'Stethoscope',
  },
  {
    id: 'session-2',
    title: 'Nourishment Therapy',
    date: 'May 28',
    time: '06:30 PM',
    status: 'completed',
    note: 'Hair hydration and strengthening therapy completed.',
    icon: 'Leaf',
  },
  {
    id: 'session-3',
    title: 'Serum Therapy',
    date: 'Jun 07',
    time: '04:45 PM',
    status: 'completed',
    note: 'Visible improvement noted in scalp dryness.',
    icon: 'Droplets',
  },
  {
    id: 'session-4',
    title: 'Steam Therapy',
    date: 'Jun 14',
    time: '05:20 PM',
    status: 'completed',
    note: 'Hair texture improved. Continue same plan.',
    icon: 'Activity',
  },
  {
    id: 'session-5',
    title: 'Follow-up Session',
    date: 'Jun 22',
    time: '07:00 PM',
    status: 'upcoming',
    note: 'Next session will review progress photos and treatment response.',
    icon: 'CalendarCheck',
  },
];

const progressPhotos: ProgressPhoto[] = [
  {
    id: 'photo-1',
    title: 'Before Treatment',
    date: 'May 20',
    description: 'Baseline photo captured before starting the treatment plan.',
    icon: 'Camera',
  },
  {
    id: 'photo-2',
    title: 'Session 3 Progress',
    date: 'Jun 07',
    description: 'Early improvement recorded after serum therapy.',
    icon: 'Image',
  },
  {
    id: 'photo-3',
    title: 'Current Progress',
    date: 'Jun 14',
    description: 'Hair texture and scalp hydration improved.',
    icon: 'TrendingUp',
  },
];

export function PatientProgressScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<PatientProgressNavigation>();

  const [selectedTab, setSelectedTab] = useState<ProgressTab>('overview');

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Screen
      title="Progress"
      subtitle="Track your treatment journey"
      actions={[
        {
          icon: 'Bell',
          onPress: () => {},
        },
      ]}
    >
      <View style={styles.root}>
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <AppIcon
                name="ChartNoAxesColumnIncreasing"
                size={34}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.heroText}>
              <AppText variant="h2">Your care progress</AppText>

              <AppText color={theme.colors.textMuted}>
                Follow your treatment plan, completed sessions, doctor notes,
                and visible improvements.
              </AppText>
            </View>
          </View>

          <View style={styles.progressSummary}>
            <View>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Current Plan
              </AppText>

              <AppText variant="bodyMedium">{activePlan.title}</AppText>
            </View>

            <AppText variant="h2" color={theme.colors.primaryDark}>
              {activePlan.progress}%
            </AppText>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${activePlan.progress}%`,
                },
              ]}
            />
          </View>

          <View style={styles.heroFooter}>
            <View style={styles.inlineInfo}>
              <AppIcon
                name="CircleCheck"
                size={17}
                color={theme.colors.successText}
              />

              <AppText variant="caption" color={theme.colors.textMuted}>
                {activePlan.completedSessions} of {activePlan.totalSessions}{' '}
                sessions completed
              </AppText>
            </View>

            <View style={styles.activeBadge}>
              <AppText variant="small" color={theme.colors.successText}>
                Active
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.tabRow}>
          {progressTabs.map((tab) => {
            const isSelected = selectedTab === tab.value;

            return (
              <Pressable
                key={tab.value}
                onPress={() => setSelectedTab(tab.value)}
                style={({ pressed }) => [
                  styles.tabChip,
                  isSelected && styles.tabChipActive,
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
                  style={isSelected ? styles.selectedTabText : undefined}
                >
                  {tab.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        {selectedTab === 'overview' ? (
          <View style={styles.section}>
            <View style={styles.metricsGrid}>
              <MetricCard
                title="Completed"
                value={`${activePlan.completedSessions}`}
                subtitle="Sessions"
                icon="CircleCheck"
              />

              <MetricCard
                title="Remaining"
                value={`${activePlan.totalSessions - activePlan.completedSessions}`}
                subtitle="Sessions"
                icon="Clock"
              />

              <MetricCard
                title="Progress"
                value={`${activePlan.progress}%`}
                subtitle="Improving"
                icon="TrendingUp"
              />

              <MetricCard
                title="Photos"
                value={`${progressPhotos.length}`}
                subtitle="Uploaded"
                icon="Camera"
              />
            </View>

            <View style={styles.planCard}>
              <View style={styles.planTop}>
                <View style={styles.planIcon}>
                  <AppIcon
                    name={activePlan.icon}
                    size={26}
                    color={theme.colors.primaryDark}
                  />
                </View>

                <View style={styles.cardText}>
                  <AppText variant="bodyMedium">{activePlan.title}</AppText>

                  <AppText variant="caption" color={theme.colors.textMuted}>
                    {activePlan.doctor} · {activePlan.branch}
                  </AppText>
                </View>
              </View>

              <View style={styles.nextSessionBox}>
                <View style={styles.inlineInfo}>
                  <AppIcon
                    name="CalendarCheck"
                    size={18}
                    color={theme.colors.primaryDark}
                  />

                  <View>
                    <AppText variant="small" color={theme.colors.textMuted}>
                      Next Session
                    </AppText>

                    <AppText variant="caption">{activePlan.nextSession}</AppText>
                  </View>
                </View>
              </View>

              <AppButton
                title="View Appointments"
                onPress={() => navigation.navigate('PatientAppointments')}
              />
            </View>

            <View style={styles.doctorNoteCard}>
              <View style={styles.noteIcon}>
                <AppIcon
                  name="FileText"
                  size={24}
                  color={theme.colors.primaryDark}
                />
              </View>

              <View style={styles.cardText}>
                <AppText variant="bodyMedium">Doctor Note</AppText>

                <AppText variant="caption" color={theme.colors.textMuted}>
                  Your scalp hydration and hair texture are improving. Continue
                  the current treatment plan and upload progress photos before
                  your next visit.
                </AppText>
              </View>
            </View>
          </View>
        ) : null}

        {selectedTab === 'sessions' ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <AppText variant="h3">Session Timeline</AppText>

                <AppText variant="caption" color={theme.colors.textMuted}>
                  Review completed and upcoming treatment sessions
                </AppText>
              </View>
            </View>

            <View style={styles.sessionList}>
              {sessions.map((session, index) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  isLast={index === sessions.length - 1}
                />
              ))}
            </View>
          </View>
        ) : null}

        {selectedTab === 'gallery' ? (
          <View style={styles.section}>
            <View style={styles.galleryHeaderCard}>
              <View style={styles.galleryHeaderIcon}>
                <AppIcon
                  name="Camera"
                  size={26}
                  color={theme.colors.primaryDark}
                />
              </View>

              <View style={styles.cardText}>
                <AppText variant="bodyMedium">Before / After Gallery</AppText>

                <AppText variant="caption" color={theme.colors.textMuted}>
                  Keep visual records of your treatment journey. Real image
                  upload will be connected later.
                </AppText>
              </View>
            </View>

            <View style={styles.galleryList}>
              {progressPhotos.map((photo) => (
                <ProgressPhotoCard key={photo.id} photo={photo} />
              ))}
            </View>

            <AppButton title="Upload Progress Photo" variant="outline" />
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

type MetricCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: AppIconName;
};

function MetricCard({ title, value, subtitle, icon }: MetricCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.metricCard}>
      <View style={styles.metricIcon}>
        <AppIcon name={icon} size={21} color={theme.colors.primaryDark} />
      </View>

      <AppText variant="h3">{value}</AppText>

      <View>
        <AppText variant="caption">{title}</AppText>

        <AppText variant="small" color={theme.colors.textMuted}>
          {subtitle}
        </AppText>
      </View>
    </View>
  );
}

type SessionCardProps = {
  session: TreatmentSession;
  isLast: boolean;
};

function SessionCard({ session, isLast }: SessionCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const isCompleted = session.status === 'completed';

  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineColumn}>
        <View
          style={[
            styles.timelineDot,
            {
              backgroundColor: isCompleted
                ? theme.colors.success
                : theme.colors.warning,
              borderColor: isCompleted
                ? theme.colors.successText
                : theme.colors.warningText,
            },
          ]}
        >
          <AppIcon
            name={isCompleted ? 'CircleCheck' : 'Clock'}
            size={16}
            color={
              isCompleted ? theme.colors.successText : theme.colors.warningText
            }
          />
        </View>

        {!isLast ? <View style={styles.timelineLine} /> : null}
      </View>

      <View style={styles.sessionCard}>
        <View style={styles.sessionTop}>
          <View style={styles.sessionIcon}>
            <AppIcon
              name={session.icon}
              size={22}
              color={theme.colors.primaryDark}
            />
          </View>

          <View style={styles.cardText}>
            <AppText variant="bodyMedium">{session.title}</AppText>

            <AppText variant="caption" color={theme.colors.textMuted}>
              {session.date} · {session.time}
            </AppText>
          </View>

          <View
            style={[
              styles.sessionBadge,
              {
                backgroundColor: isCompleted
                  ? theme.colors.success
                  : theme.colors.warning,
              },
            ]}
          >
            <AppText
              variant="small"
              color={
                isCompleted
                  ? theme.colors.successText
                  : theme.colors.warningText
              }
            >
              {isCompleted ? 'Done' : 'Next'}
            </AppText>
          </View>
        </View>

        <AppText variant="caption" color={theme.colors.textMuted}>
          {session.note}
        </AppText>
      </View>
    </View>
  );
}

type ProgressPhotoCardProps = {
  photo: ProgressPhoto;
};

function ProgressPhotoCard({ photo }: ProgressPhotoCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable style={({ pressed }) => [styles.photoCard, pressed && styles.pressed]}>
      <View style={styles.photoPreview}>
        <AppIcon name={photo.icon} size={30} color={theme.colors.primaryDark} />
      </View>

      <View style={styles.cardText}>
        <AppText variant="bodyMedium">{photo.title}</AppText>

        <AppText variant="caption" color={theme.colors.textMuted}>
          {photo.date}
        </AppText>

        <AppText variant="caption" color={theme.colors.textMuted}>
          {photo.description}
        </AppText>
      </View>

      <AppIcon name="ChevronRight" size={20} color={theme.colors.textMuted} />
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
      gap: theme.spacing.sm,
    },

    progressSummary: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },

    progressTrack: {
      height: 10,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      overflow: 'hidden',
    },

    progressFill: {
      height: '100%',
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primaryDark,
    },

    heroFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      flexWrap: 'wrap',
    },

    inlineInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },

    activeBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.success,
    },

    tabRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },

    tabChip: {
      flex: 1,
      minHeight: 42,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.sm,
    },

    tabChipActive: {
      borderColor: theme.colors.primaryDark,
      backgroundColor: theme.colors.cardMuted,
    },

    selectedTabText: {
      fontWeight: '700',
    },

    section: {
      gap: theme.spacing.md,
    },

    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },

    metricCard: {
      width: '47.8%',
      minHeight: 138,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
      ...(theme.shadows.card ?? {}),
    },

    metricIcon: {
      width: 42,
      height: 42,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
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

    cardText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    nextSessionBox: {
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
    },

    doctorNoteCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.info,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      gap: theme.spacing.md,
    },

    noteIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    sessionList: {
      gap: theme.spacing.md,
    },

    timelineRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },

    timelineColumn: {
      alignItems: 'center',
      width: 28,
    },

    timelineDot: {
      width: 28,
      height: 28,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },

    timelineLine: {
      flex: 1,
      width: 1,
      backgroundColor: theme.colors.border,
      marginTop: theme.spacing.xs,
    },

    sessionCard: {
      flex: 1,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    sessionTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    sessionIcon: {
      width: 46,
      height: 46,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    sessionBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
    },

    galleryHeaderCard: {
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

    galleryHeaderIcon: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    galleryList: {
      gap: theme.spacing.md,
    },

    photoCard: {
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

    photoPreview: {
      width: 64,
      height: 64,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
  });
}