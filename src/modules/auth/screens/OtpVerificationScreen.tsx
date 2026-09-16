import React from 'react';
import { TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';

import { AuthStackParamList, RootStackParamList } from '../../../core/navigation/navigation.types';
import { Screen } from '../../../shared/ui/templates/Screen';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AuthCard } from '../../../shared/ui/molecules/AuthCard';
import { useAppTheme } from '../../../app/providers/ThemeProvider';

// type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerification'>;

type Props = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, 'OtpVerification'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function OtpVerificationScreen({ navigation }: Props) {
  const theme = useAppTheme();

  return (
    <Screen
      title="OTP Verification"
      subtitle="Secure login"
      showBack
      onBackPress={() => navigation.goBack()}
      footer={
        <AppButton
          title="Verify OTP"
          onPress={() => navigation.navigate('PatientApp')}
        />
      }
    >
      <AuthCard
        title="Enter verification code"
        subtitle="We sent a 6-digit code to your phone number."
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: theme.spacing.sm,
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <TextInput
              key={index}
              keyboardType="number-pad"
              maxLength={1}
              style={{
                flex: 1,
                minHeight: 52,
                borderRadius: theme.radius.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background,
                textAlign: 'center',
                fontSize: 20,
                color: theme.colors.text,
              }}
            />
          ))}
        </View>

        <AppText
          variant="caption"
          color={theme.colors.textMuted}
          align="center"
          style={{ marginTop: theme.spacing.lg }}
        >
          Didn’t receive a code? Resend in 30s
        </AppText>
      </AuthCard>
    </Screen>
  );
}