import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../../core/navigation/navigation.types";
import { Screen } from "../../../shared/ui/templates/Screen";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { AppInput } from "../../../shared/ui/atoms/AppInput";
import { AuthCard } from "../../../shared/ui/molecules/AuthCard";
import { AppHeader } from "../../../shared/ui/organisms/AppHeader";
import { Pressable, StyleSheet } from "react-native";
import { AppIcon } from "../../../shared/ui/atoms/AppIcon";
import { useAppTheme } from "../../../app/providers/ThemeProvider";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export function ForgotPasswordScreen({ navigation }: Props) {
  const theme = useAppTheme();
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
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={12}
        style={styles.iconButton}
      >
        <AppIcon name="ArrowLeft" color={theme.colors.primaryDark} />
      </Pressable>

      <AuthCard
        title="Reset your password"
        subtitle="Enter your Phone number and we will send password recovery instructions."
      >
        <AppInput
          label="Phone number"
          placeholder="Enter your Phone number "
          autoCapitalize="none"
          keyboardType="number-pad"
          leftIcon="Phone"
        />
      </AuthCard>
    </Screen>
  );
}

const styles=StyleSheet.create({
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:20
  }
})
