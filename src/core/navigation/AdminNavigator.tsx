import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AdminStackParamList,
  AdminTabParamList,
} from './navigation.types';
import { useAppTheme } from '../../app/providers/ThemeProvider';
import { AppIcon, AppIconName } from '../../shared/ui/atoms/AppIcon';

import { AdminDashboardScreen } from '../../modules/admin/screens/AdminDashboardScreen';
import { AdminAppointmentsScreen } from '../../modules/admin/screens/AdminAppointmentsScreen';
import { AdminPatientsScreen } from '../../modules/admin/screens/AdminPatientsScreen';
import { AdminDoctorsScreen } from '../../modules/admin/screens/AdminDoctorsScreen';
import { AdminMoreScreen } from '../../modules/admin/screens/AdminMoreScreen';
import { AdminServicesScreen } from '../../modules/admin/screens/AdminServicesScreen';
import { AdminReportsScreen } from '../../modules/admin/screens/AdminReportsScreen';
import { AdminPaymentsScreen } from '../../modules/admin/screens/AdminPaymentsScreen';
import { AdminPromotionsScreen } from '../../modules/admin/screens/AdminPromotionsScreen';
import { AdminNotificationsScreen } from '../../modules/admin/screens/AdminNotificationsScreen';
import { AdminBranchesScreen } from '../../modules/admin/screens/AdminBranchesScreen';

const Stack = createNativeStackNavigator<AdminStackParamList>();
const Tab = createBottomTabNavigator<AdminTabParamList>();

const icons: Record<keyof AdminTabParamList, AppIconName> = {
  AdminDashboard: 'LayoutDashboard',
  AdminAppointments: 'CalendarClock',
  AdminPatients: 'UsersRound',
  AdminDoctors: 'Stethoscope',
  AdminMore: 'Menu',
};

function AdminTabs() {
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
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="AdminAppointments"
        component={AdminAppointmentsScreen}
        options={{ title: 'Appointments' }}
      />
      <Tab.Screen
        name="AdminPatients"
        component={AdminPatientsScreen}
        options={{ title: 'Patients' }}
      />
      <Tab.Screen
        name="AdminDoctors"
        component={AdminDoctorsScreen}
        options={{ title: 'Doctors' }}
      />
      <Tab.Screen
        name="AdminMore"
        component={AdminMoreScreen}
        options={{ title: 'More' }}
      />
    </Tab.Navigator>
  );
}

export function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
      <Stack.Screen name="AdminServices" component={AdminServicesScreen} />
      <Stack.Screen name="AdminReports" component={AdminReportsScreen} />
      <Stack.Screen name="AdminPayments" component={AdminPaymentsScreen} />
      <Stack.Screen name="AdminPromotions" component={AdminPromotionsScreen} />
      <Stack.Screen name="AdminBranches" component={AdminBranchesScreen} />
      <Stack.Screen name="AdminNotifications" component={AdminNotificationsScreen} />
    </Stack.Navigator>
  );
}