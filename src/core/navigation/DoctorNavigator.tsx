// src/core/navigation/DoctorNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DoctorTabParamList } from './navigation.types';
import { useAppTheme } from '../../app/providers/ThemeProvider';
import { AppIcon, AppIconName } from '../../shared/ui/atoms/AppIcon';

import { DoctorDashboardScreen } from '../../modules/doctor/screens/DoctorDashboardScreen';
import { DoctorAppointmentsScreen } from '../../modules/doctor/screens/DoctorAppointmentsScreen';
import { DoctorPatientsScreen } from '../../modules/doctor/screens/DoctorPatientsScreen';
import { DoctorMessagesScreen } from '../../modules/doctor/screens/DoctorMessagesScreen';
import { DoctorProfileScreen } from '../../modules/doctor/screens/DoctorProfileScreen';

const Tab = createBottomTabNavigator<DoctorTabParamList>();

const icons: Record<keyof DoctorTabParamList, AppIconName> = {
  DoctorDashboard: 'LayoutDashboard',
  DoctorAppointments: 'CalendarCheck',
  DoctorPatients: 'UsersRound',
  DoctorMessages: 'MessagesSquare',
  DoctorProfile: 'UserRound',
};

export function DoctorNavigator() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primaryDark,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          height: 64 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => (
          <AppIcon name={icons[route.name]} color={color} size={size} />
        ),
      })}
    >
      <Tab.Screen
        name="DoctorDashboard"
        component={DoctorDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="DoctorAppointments"
        component={DoctorAppointmentsScreen}
        options={{ title: 'Appointments' }}
      />
      <Tab.Screen
        name="DoctorPatients"
        component={DoctorPatientsScreen}
        options={{ title: 'Patients' }}
      />
      <Tab.Screen
        name="DoctorMessages"
        component={DoctorMessagesScreen}
        options={{ title: 'Messages' }}
      />
      <Tab.Screen
        name="DoctorProfile"
        component={DoctorProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}