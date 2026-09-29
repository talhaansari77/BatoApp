import React, { useState } from "react";
import { Alert, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../../core/navigation/navigation.types";
import { Screen } from "../../../shared/ui/templates/Screen";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { AppInput } from "../../../shared/ui/atoms/AppInput";
import { AuthCard } from "../../../shared/ui/molecules/AuthCard";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { useAuthStore } from "../store/auth.store";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const theme = useAppTheme();

  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const clearError = useAuthStore((state) => state.clearError);

  const [secure, setSecure] = useState(true);
  const [fullName, setFullName] = useState("");
  const [cid, setCid] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [nationality, setNationality] = useState("");

  const handleRegister = async () => {
    try {
      clearError();

      if (!fullName.trim() || !cid.trim() || !password.trim()) {
        Alert.alert(
          "Missing fields",
          "Please enter full name, email, and password.",
        );
        return;
      }

      if (password.length < 6) {
        Alert.alert("Weak password", "Password must be at least 6 characters.");
        return;
      }

      await register({
        full_name: fullName.trim(),
        civil_id: phoneNumber.trim() || undefined,
        mobile_number: phoneNumber.trim() || undefined,
      });
    } catch {
      Alert.alert(
        "Registration failed",
        "Please check your details and try again.",
      );
    }
  };

  return (
    <Screen
      title="Create Account"
      subtitle="Join BATO Clinic"
      showBack
      onBackPress={() => navigation.goBack()}
      footer={
        <AppButton
          title={isLoading ? "Creating Account..." : "Create Account"}
          onPress={handleRegister}
          disabled={isLoading}
        />
      }
    >
      <AuthCard
        title="Start your care profile"
        subtitle="Create your BATO account to book treatments and track your wellness journey."
      >
        <View style={{ gap: theme.spacing.md }}>
          <AppInput
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            leftIcon="UserRound"
          />

          <AppInput
            label="Civil Id"
            placeholder="Civil Id Number"
            value={cid}
            onChangeText={setCid}
            autoCapitalize="none"
            keyboardType="phone-pad"
            leftIcon="Mail"
          />

          <AppInput
            label="Phone Number"
            placeholder="Phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            leftIcon="Phone"
          />

          <AppInput
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            leftIcon="LockKeyhole"
            rightIcon={secure ? "Eye" : "EyeOff"}
            onRightIconPress={() => setSecure((value) => !value)}
          />
        </View>
      </AuthCard>
    </Screen>
  );
}
