import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

export function TreatmentSessionDetailsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Screen title="Session Details" subtitle="Treatment session" showBack>
      <View style={styles.root}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <AppIcon
              name="CalendarCheck"
              size={34}
              color={theme.colors.primaryDark}
            />
          </View>

          <View style={styles.heroText}>
            <AppText variant="h2">Session 4</AppText>

            <AppText color={theme.colors.textMuted}>
              Hair Rejuvenation Plan · Jun 22 · 06:30 PM
            </AppText>

            <View style={styles.statusBadge}>
              <AppText variant="small" color={theme.colors.warningText}>
                Upcoming
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <InfoRow icon="Stethoscope" label="Doctor" value="Dr. Omar Khalid" />
          <InfoRow icon="MapPin" label="Branch" value="Main Branch" />
          <InfoRow icon="Clock" label="Duration" value="45 Minutes" />
          <InfoRow icon="Sparkles" label="Service" value="Hair Growth Treatment" />
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AppIcon
              name="FileText"
              size={22}
              color={theme.colors.primaryDark}
            />

            <AppText variant="h3">Doctor Notes</AppText>
          </View>

          <AppText color={theme.colors.textMuted}>
            Continue current hair strengthening protocol. Patient should upload
            progress photos before the next visit and avoid harsh hair products
            for 48 hours after the session.
          </AppText>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AppIcon
              name="Pill"
              size={22}
              color={theme.colors.primaryDark}
            />

            <AppText variant="h3">Prescription</AppText>
          </View>

          <InfoRow icon="Droplets" label="Serum" value="Apply once daily" />
          <InfoRow icon="Clock" label="Duration" value="14 days" />
          <InfoRow icon="CircleAlert" label="Note" value="Avoid scalp irritation" />
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.photosHeader}>
            <View>
              <AppText variant="h3">Progress Photos</AppText>

              <AppText variant="caption" color={theme.colors.textMuted}>
                Before and latest comparison
              </AppText>
            </View>

            <View style={styles.photoBadge}>
              <AppText variant="small" color={theme.colors.primaryDark}>
                2 photos
              </AppText>
            </View>
          </View>

          <View style={styles.photoGrid}>
            <View style={styles.photoBox}>
              <AppIcon
                name="Image"
                size={26}
                color={theme.colors.primaryDark}
              />

              <AppText variant="caption" color={theme.colors.textMuted}>
                Before Session
              </AppText>
            </View>

            <View style={styles.photoBox}>
              <AppIcon
                name="ImagePlus"
                size={26}
                color={theme.colors.primaryDark}
              />

              <AppText variant="caption" color={theme.colors.textMuted}>
                Latest Photo
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.followUpCard}>
          <View style={styles.followIcon}>
            <AppIcon
              name="Bell"
              size={24}
              color={theme.colors.primaryDark}
            />
          </View>

          <View style={styles.cardText}>
            <AppText variant="bodyMedium">Follow-up reminder</AppText>

            <AppText variant="caption" color={theme.colors.textMuted}>
              Upload new progress photos 24 hours before the next session.
            </AppText>
          </View>
        </View>

        <AppButton title="Upload Progress Photo" />
      </View>
    </Screen>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
      }}
    >
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

    statusBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.warning,
    },

    infoCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    sectionCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },

    photosHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },

    photoBadge: {
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

    photoBox: {
      flex: 1,
      minHeight: 118,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
    },

    followUpCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.info,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    followIcon: {
      width: 50,
      height: 50,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cardText: {
      flex: 1,
      gap: theme.spacing.xs,
    },
  });
}