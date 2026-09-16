// src/core/navigation/AuthNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReportsStackParamList } from './navigation.types';
import { MedicalReportsScreen } from '../../modules/medical-records/screens/MedicalReportsScreen';
import { ReportDetailsScreen } from '../../modules/medical-records/screens/ReportDetailsScreen';

const Stack = createNativeStackNavigator<ReportsStackParamList>();

export function ReportsNavigator() {

  return (
    <Stack.Navigator
      // initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MedicalReports" component={MedicalReportsScreen} />
      <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} />
    </Stack.Navigator>
  );

}