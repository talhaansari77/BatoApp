
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PatientStackParamList, PatientTabParamList } from './navigation.types';
import { useAppTheme } from '../../app/providers/ThemeProvider';
import { AppIcon, AppIconName } from '../../shared/ui/atoms/AppIcon';

import { PatientHomeScreen } from '../../modules/patient/screens/PatientHomeScreen';
import { PatientServicesScreen } from '../../modules/patient/screens/PatientServicesScreen';
import { PatientAppointmentsScreen } from '../../modules/patient/screens/PatientAppointmentsScreen';
import { PatientProgressScreen } from '../../modules/patient/screens/PatientProgressScreen';
import { PatientProfileScreen } from '../../modules/patient/screens/PatientProfileScreen';
import { ServiceDetailsScreen } from '../../modules/patient/screens/ServiceDetailsScreen';
import { DoctorProfileScreen } from '../../modules/patient/screens/DoctorProfileScreen';
import { BookingBranchScreen } from '../../modules/patient/screens/BookingBranchScreen';
import { BookingDateTimeScreen } from '../../modules/patient/screens/BookingDateTimeScreen';
import { BookingPaymentScreen } from '../../modules/patient/screens/BookingPaymentScreen';
import { AppointmentConfirmationScreen } from '../../modules/patient/screens/AppointmentConfirmationScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppointmentDetailsScreen } from '@/modules/patient/screens/AppointmentDetailsScreen';
import { AppointmentMoreDetails } from '@/modules/patient/screens/AppointmentMoreDetails';

const Tab = createBottomTabNavigator<PatientTabParamList>();
const Stack = createNativeStackNavigator<PatientStackParamList>();

const icons: Record<keyof PatientTabParamList, AppIconName> = {
  PatientHome: 'House',
  PatientServices: 'Sparkles',
  PatientAppointments: 'CalendarDays',
  PatientProgress: 'ChartNoAxesColumnIncreasing',
  PatientProfile: 'UserRound',
  // AppointmentDetails: 'Phone'
};

export function PatientTabs() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
    initialRouteName='PatientAppointments'
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
        name="PatientHome"
        component={PatientHomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="PatientServices"
        component={PatientServicesScreen}
        options={{ title: 'Services' }}
      />
      <Tab.Screen
        name="PatientAppointments"
        component={PatientAppointmentsScreen}
        options={{ title: 'Appointments' }}
      />
      <Tab.Screen
        name="PatientProgress"
        component={PatientProgressScreen}
        options={{ title: 'Progress' }}
      />
      <Tab.Screen
        name="PatientProfile"
        component={PatientProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}


export const PatientNavigator =()=>{
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PatientTabs" component={PatientTabs} />
      <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
      <Stack.Screen name="AppointmentMoreDetails" component={AppointmentMoreDetails} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
      <Stack.Screen name="BookingBranch" component={BookingBranchScreen} />
      <Stack.Screen name="BookingDateTime" component={BookingDateTimeScreen} />
      <Stack.Screen name="BookingPayment" component={BookingPaymentScreen} />
      <Stack.Screen name="AppointmentConfirmation" component={AppointmentConfirmationScreen} />
    </Stack.Navigator>
  );
}