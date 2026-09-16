import React from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../../core/navigation/navigation.types';
import { Screen } from '../../../shared/ui/templates/Screen';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { useAppTheme } from '../../../app/providers/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  const theme = useAppTheme();

  return (
    <Screen title="Welcome" subtitle="BATO Clinic">
      <View
        style={{
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius['2xl'],
          padding: theme.spacing['2xl'],
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        <AppText variant="h1">Your premium care journey starts here</AppText>

        <AppText
          color={theme.colors.textMuted}
          style={{ marginTop: theme.spacing.md }}
        >
          Book treatments, follow personalized plans, track progress, and stay connected with BATO Clinic.
        </AppText>
      </View>

      <View style={{ marginTop: theme.spacing['2xl'], gap: theme.spacing.md }}>
        <AppButton
          title="Login"
          onPress={() => navigation.navigate('Login')}
        />

        <AppButton
          title="Create Account"
          variant="outline"
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </Screen>
  );
}