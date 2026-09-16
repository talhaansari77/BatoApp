import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import {
  AdminCard,
  AdminFilterChips,
  AdminHeroCard,
  AdminSectionHeader,
} from '../components';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

type ReportFilter = 'today' | 'week' | 'month';

type ReportMetric = {
  id: string;
  label: string;
  value: string;
  change: string;
  icon: AppIconName;
};

const filters: Array<{ label: string; value: ReportFilter }> = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
];

const metrics: ReportMetric[] = [
  {
    id: 'revenue',
    label: 'Revenue',
    value: '31,420 KWD',
    change: '+12%',
    icon: 'ChartNoAxesColumnIncreasing',
  },
  {
    id: 'appointments',
    label: 'Appointments',
    value: '248',
    change: '+18%',
    icon: 'CalendarDays',
  },
  {
    id: 'patients',
    label: 'New Patients',
    value: '64',
    change: '+9%',
    icon: 'UserPlus',
  },
  {
    id: 'completion',
    label: 'Completion Rate',
    value: '86%',
    change: '+5%',
    icon: 'CircleCheck',
  },
];

export function AdminReportsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedFilter, setSelectedFilter] = useState<ReportFilter>('month');

  return (
    <Screen
      title="Reports"
      subtitle="Clinic analytics"
      showBack
      actions={[
        {
          icon: 'Bell',
          onPress: () => {},
        },
      ]}
    >
      <View style={styles.root}>
        <AdminHeroCard
          icon="ChartNoAxesColumnIncreasing"
          title="Clinic Reports"
          description="Track revenue, appointments, patient growth, doctor performance, and service demand."
        />

        <AdminFilterChips
          options={filters}
          selectedValue={selectedFilter}
          onChange={setSelectedFilter}
        />

        <View style={styles.metricsGrid}>
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </View>

        <View style={styles.section}>
          <AdminSectionHeader
            title="Service Demand"
            subtitle="Most requested treatments"
          />

          <AdminCard style={styles.reportCard}>
            <ReportRow
              icon="Sparkles"
              title="Hair Growth Treatment"
              subtitle="Most booked service"
              value="86 bookings"
              progress={86}
            />

            <ReportRow
              icon="ScanFace"
              title="Skin Consultation"
              subtitle="High conversion service"
              value="64 bookings"
              progress={64}
            />

            <ReportRow
              icon="Droplets"
              title="Hydration Facial Therapy"
              subtitle="Popular follow-up service"
              value="52 bookings"
              progress={52}
              isLast
            />
          </AdminCard>
        </View>

        <View style={styles.section}>
          <AdminSectionHeader
            title="Doctor Performance"
            subtitle="Rating and patient activity"
          />

          <AdminCard style={styles.reportCard}>
            <ReportRow
              icon="Stethoscope"
              title="Dr. Sarah Ahmed"
              subtitle="Dermatologist"
              value="4.9 rating"
              progress={90}
            />

            <ReportRow
              icon="Stethoscope"
              title="Dr. Omar Khalid"
              subtitle="Hair Specialist"
              value="4.8 rating"
              progress={84}
            />

            <ReportRow
              icon="Stethoscope"
              title="Dr. Lina Hassan"
              subtitle="Facial Therapy"
              value="4.7 rating"
              progress={78}
              isLast
            />
          </AdminCard>
        </View>
      </View>
    </Screen>
  );
}

function MetricCard({ metric }: { metric: ReportMetric }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <AdminCard style={styles.metricCard}>
      <View style={styles.metricIcon}>
        <AppIcon
          name={metric.icon}
          size={22}
          color={theme.colors.primaryDark}
        />
      </View>

      <AppText variant="h3">{metric.value}</AppText>

      <AppText variant="caption" color={theme.colors.textMuted}>
        {metric.label}
      </AppText>

      <View style={styles.changeBadge}>
        <AppIcon
          name="TrendingUp"
          size={14}
          color={theme.colors.successText}
        />

        <AppText variant="small" color={theme.colors.successText}>
          {metric.change}
        </AppText>
      </View>
    </AdminCard>
  );
}

function ReportRow({
  icon,
  title,
  subtitle,
  value,
  progress,
  isLast = false,
}: {
  icon: AppIconName;
  title: string;
  subtitle: string;
  value: string;
  progress: number;
  isLast?: boolean;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.reportRow, isLast && styles.lastReportRow]}>
      <View style={styles.rowIcon}>
        <AppIcon name={icon} size={20} color={theme.colors.primaryDark} />
      </View>

      <View style={styles.cardText}>
        <View style={styles.rowTop}>
          <AppText variant="bodyMedium" style={styles.title}>
            {title}
          </AppText>

          <AppText variant="caption" color={theme.colors.primaryDark}>
            {value}
          </AppText>
        </View>

        <AppText variant="caption" color={theme.colors.textMuted}>
          {subtitle}
        </AppText>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing.xl,
    },

    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },

    metricCard: {
      width: '47.8%',
      minHeight: 154,
    },

    metricIcon: {
      width: 42,
      height: 42,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xs,
    },

    changeBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.success,
      marginTop: theme.spacing.xs,
    },

    section: {
      gap: theme.spacing.md,
    },

    reportCard: {
      padding: 0,
      overflow: 'hidden',
      gap: 0,
    },

    reportRow: {
      padding: theme.spacing.lg,
      flexDirection: 'row',
      gap: theme.spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },

    lastReportRow: {
      borderBottomWidth: 0,
    },

    rowIcon: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cardText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    rowTop: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      alignItems: 'center',
    },

    title: {
      flex: 1,
    },

    progressTrack: {
      height: 8,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      overflow: 'hidden',
      marginTop: theme.spacing.sm,
    },

    progressFill: {
      height: '100%',
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primaryDark,
    },
  });
}