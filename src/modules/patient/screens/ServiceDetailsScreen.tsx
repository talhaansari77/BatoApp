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
  'ServiceDetails'
>;

export function ServiceDetailsScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp>();

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Screen
      title="Hair Growth Treatment"
      subtitle="Service Details"
      showBack
    >
      <View style={styles.root}>
        <View style={styles.heroCard}>
          <View style={styles.iconContainer}>
            <AppIcon
              name="Sparkles"
              size={34}
              color={theme.colors.primaryDark}
            />
          </View>

          <AppText variant="h2">
            Hair Growth Treatment
          </AppText>

          <AppText
            color={theme.colors.textMuted}
            align="center"
          >
            Personalized treatment designed to improve hair strength,
            stimulate growth, and reduce hair loss.
          </AppText>
        </View>

        <View style={styles.infoCard}>
          <InfoRow
            icon="Clock"
            label="Duration"
            value="45 Minutes"
          />

          <InfoRow
            icon="CircleDollarSign"
            label="Price"
            value="25 KWD"
          />

          <InfoRow
            icon="Stethoscope"
            label="Doctors"
            value="3 Specialists"
          />

          <InfoRow
            icon="Building2"
            label="Branches"
            value="3 Available"
          />
        </View>

        <View style={styles.section}>
          <AppText variant="h3">
            Treatment Benefits
          </AppText>

          <View style={styles.benefitItem}>
            <AppIcon
              name="CircleCheck"
              size={18}
              color={theme.colors.success}
            />

            <AppText>
              Improve hair density and strength
            </AppText>
          </View>

          <View style={styles.benefitItem}>
            <AppIcon
              name="CircleCheck"
              size={18}
              color={theme.colors.success}
            />

            <AppText>
              Reduce excessive hair fall
            </AppText>
          </View>

          <View style={styles.benefitItem}>
            <AppIcon
              name="CircleCheck"
              size={18}
              color={theme.colors.success}
            />

            <AppText>
              Personalized treatment plan
            </AppText>
          </View>
        </View>

        <AppButton
          title="Choose Doctor"
          onPress={() =>
            navigation.navigate('DoctorProfile')
          }
        />
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
        gap: theme.spacing.md,
      }}
    >
      <AppIcon
        name={icon}
        size={18}
        color={theme.colors.primaryDark}
      />

      <View style={{ flex: 1 }}>
        <AppText
          variant="small"
          color={theme.colors.textMuted}
        >
          {label}
        </AppText>

        <AppText>{value}</AppText>
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
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius['2xl'],
      padding: theme.spacing['2xl'],
      alignItems: 'center',
      gap: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...(theme.shadows.card ?? {}),
    },

    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    infoCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...(theme.shadows.card ?? {}),
    },

    section: {
      gap: theme.spacing.md,
    },

    benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
  });
}