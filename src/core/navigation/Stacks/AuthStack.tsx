// src/core/navigation/AuthNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';

import { SplashScreen } from '../../../modules/auth/screens/SplashScreen';
import { WelcomeScreen } from '../../../modules/auth/screens/WelcomeScreen';
import { LoginScreen } from '../../../modules/auth/screens/LoginScreen';
import { RegisterScreen } from '../../../modules/auth/screens/RegisterScreen';
import { OtpVerificationScreen } from '../../../modules/auth/screens/OtpVerificationScreen';
import { ForgotPasswordScreen } from '../../../modules/auth/screens/ForgotPasswordScreen';
import { RoleSelectionScreen } from '../../../modules/auth/screens/RoleSelectionScreen';
import LoginViaFile from '../../../modules/auth/screens/LoginViaFile';
import OnboardingScreen from '@/modules/auth/screens/OnboardingScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="LoginViaFile" component={LoginViaFile} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      {/* <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} /> */}
    </Stack.Navigator>
  );

}