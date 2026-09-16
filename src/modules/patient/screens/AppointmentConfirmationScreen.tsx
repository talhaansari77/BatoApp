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
  'AppointmentConfirmation'
>;

export function AppointmentConfirmationScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp>();

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Screen>
      <View style={styles.root}>
        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <AppIcon
              name="CircleCheckBig"
              size={52}
              color={theme.colors.successText}
            />
          </View>

          <AppText variant="h1" align="center">
            Appointment Requested
          </AppText>

          <AppText
            align="center"
            color={theme.colors.textMuted}
          >
            Your booking request has been submitted successfully.
            The clinic will review and confirm your appointment.
          </AppText>
        </View>

        <View style={styles.detailsCard}>
          <AppText variant="h3">
            Appointment Details
          </AppText>

          <DetailRow
            label="Service"
            value="Hair Growth Treatment"
          />

          <DetailRow
            label="Doctor"
            value="Dr. Omar Khalid"
          />

          <DetailRow
            label="Branch"
            value="Main Branch"
          />

          <DetailRow
            label="Date"
            value="Jun 22, 2026"
          />

          <DetailRow
            label="Time"
            value="06:30 PM"
          />

          <DetailRow
            label="Payment"
            value="Pay at Clinic"
          />
        </View>

        <View style={styles.noticeCard}>
          <AppIcon
            name="Bell"
            size={22}
            color={theme.colors.primaryDark}
          />

          <View style={styles.noticeContent}>
            <AppText variant="bodyMedium">
              You'll receive updates
            </AppText>

            <AppText
              variant="caption"
              color={theme.colors.textMuted}
            >
              Notifications will be sent when your appointment
              gets approved or updated.
            </AppText>
          </View>
        </View>

        <AppButton
          title="View My Appointments"
          onPress={() => navigation.navigate('PatientTabs')}
        />

        <AppButton
          title="Back To Home"
          variant="outline"
          onPress={() => navigation.navigate('PatientTabs')}
        />
      </View>
    </Screen>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
      }}
    >
      <AppText
        variant="caption"
        color={theme.colors.textMuted}
      >
        {label}
      </AppText>

      <AppText variant="caption">
        {value}
      </AppText>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'center',
      gap: theme.spacing.xl,
    },

    successCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius['2xl'],
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing['3xl'],
      alignItems: 'center',
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    successIcon: {
      width: 110,
      height: 110,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.success,
      alignItems: 'center',
      justifyContent: 'center',
    },

    detailsCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    noticeCard: {
      backgroundColor: theme.colors.info,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      gap: theme.spacing.md,
    },

    noticeContent: {
      flex: 1,
      gap: theme.spacing.xs,
    },
  });
}