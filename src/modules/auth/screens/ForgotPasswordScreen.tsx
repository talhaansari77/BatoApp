import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../../../core/navigation/navigation.types';
import { Screen } from '../../../shared/ui/templates/Screen';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppInput } from '../../../shared/ui/atoms/AppInput';
import { AuthCard } from '../../../shared/ui/molecules/AuthCard';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  return (
    <Screen
      title="Forgot Password"
      subtitle="Recover your account"
      showBack
      onBackPress={() => navigation.goBack()}
      footer={
        <AppButton
          title="Send Reset Link"
          onPress={() => navigation.goBack()}
        />
      }
    >
      <AuthCard
        title="Reset your password"
        subtitle="Enter your Phone number and we will send password recovery instructions."
      >
        <AppInput
          label="Phone number"
          placeholder="Enter your Phone number "
          autoCapitalize="none"
          keyboardType="number-pad"
          leftIcon="Mail"
        />
      </AuthCard>
    </Screen>
  );
}