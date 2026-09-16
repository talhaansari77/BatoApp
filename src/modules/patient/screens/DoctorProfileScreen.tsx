import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { PatientStackParamList } from '../../../core/navigation/navigation.types';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

type NavigationProp = NativeStackNavigationProp<
  PatientStackParamList,
  'DoctorProfile'
>;

export function DoctorProfileScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Screen title="Doctor Profile" subtitle="Choose specialist" showBack>
      <View style={styles.root}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <AppIcon
              name="Stethoscope"
              size={38}
              color={theme.colors.primaryDark}
            />
          </View>

          <AppText variant="h2" align="center">
            Dr. Omar Khalid
          </AppText>

          <AppText color={theme.colors.textMuted} align="center">
            Hair Specialist · 10 years experience
          </AppText>

          <View style={styles.ratingRow}>
            <AppIcon name="Star" size={18} color={theme.colors.warningText} />
            <AppText variant="bodyMedium">4.8</AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              128 patient reviews
            </AppText>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatBox label="Patients" value="1.2k+" icon="UsersRound" />
          <StatBox label="Experience" value="10 yrs" icon="BadgeCheck" />
          <StatBox label="Rating" value="4.8" icon="Star" />
        </View>

        <View style={styles.sectionCard}>
          <AppText variant="h3">About Doctor</AppText>

          <AppText color={theme.colors.textMuted}>
            Dr. Omar Khalid specializes in hair fall control, hair growth
            treatments, scalp therapy, and long-term personalized hair care
            plans.
          </AppText>
        </View>

        <View style={styles.sectionCard}>
          <AppText variant="h3">Specializations</AppText>

          <TagList
            items={[
              'Hair Growth',
              'Hair Fall Control',
              'Scalp Therapy',
              'Serum Therapy',
            ]}
          />
        </View>

        <View style={styles.sectionCard}>
          <AppText variant="h3">Available Branches</AppText>

          <InfoRow icon="MapPin" title="Salmiya Branch" subtitle="Available today" />
          <InfoRow icon="MapPin" title="Main Branch" subtitle="Available tomorrow" />
        </View>

        <View style={styles.sectionCard}>
          <AppText variant="h3">Languages</AppText>

          <TagList items={['English', 'Arabic']} />
        </View>

        <AppButton
          title="Continue Booking"
          onPress={() => navigation.navigate('BookingBranch')}
        />
      </View>
    </Screen>
  );
}

function StatBox({
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
    <View style={styles.statBox}>
      <AppIcon name={icon} size={20} color={theme.colors.primaryDark} />

      <AppText variant="h3">{value}</AppText>

      <AppText variant="small" color={theme.colors.textMuted} align="center">
        {label}
      </AppText>
    </View>
  );
}

function TagList({ items }: { items: string[] }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.tagRow}>
      {items.map((item) => (
        <View key={item} style={styles.tag}>
          <AppText variant="caption" color={theme.colors.primaryDark}>
            {item}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function InfoRow({
  icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle: string;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <AppIcon name={icon} size={18} color={theme.colors.primaryDark} />
      </View>

      <View style={styles.infoText}>
        <AppText variant="bodyMedium">{title}</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          {subtitle}
        </AppText>
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing.xl,
    },

    profileCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius['2xl'],
      padding: theme.spacing['2xl'],
      alignItems: 'center',
      gap: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...(theme.shadows.card ?? {}),
    },

    avatar: {
      width: 88,
      height: 88,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
    },

    statsRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },

    statBox: {
      flex: 1,
      minHeight: 112,
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

    sectionCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },

    tag: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    infoIcon: {
      width: 42,
      height: 42,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    infoText: {
      flex: 1,
      gap: theme.spacing.xs,
    },
  });
}