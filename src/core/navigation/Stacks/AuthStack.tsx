// src/core/navigation/AuthNavigator.tsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types";

import { WelcomeScreen } from "../../../modules/auth/screens/WelcomeScreen";
import { LoginScreen } from "../../../modules/auth/screens/LoginScreen";
import { RegisterScreen } from "../../../modules/auth/screens/RegisterScreen";
import { OtpVerificationScreen } from "../../../modules/auth/screens/OtpVerificationScreen";
import { ForgotPasswordScreen } from "../../../modules/auth/screens/ForgotPasswordScreen";
import LoginViaFile from "../../../modules/auth/screens/LoginViaFile";
import OnboardingScreen from "@/modules/auth/screens/OnboardingScreen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Skeleton } from "@/shared/ui/templates/Loaders/Skeleton";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  const [completed, setCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem("hasSeenOnboarding");
        setCompleted(value === "true");
      } catch {
        setCompleted(false);
      }
    };

    void checkOnboarding();
  }, []);

  if (completed === null) {
    return null;
  }

  return (
    <View
      style={{ flex: 1 }}
      onLayout={() => {
        void SplashScreen.hideAsync();
      }}
    >
      <Stack.Navigator
        initialRouteName={completed ? "Welcome" : "Onboarding"}
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        {!completed && (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="LoginViaFile" component={LoginViaFile} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="OtpVerification"
          component={OtpVerificationScreen}
        />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        {/* <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} /> */}
      </Stack.Navigator>
    </View>
  );
}
