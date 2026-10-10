import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PatientStackParamList, PatientTabParamList } from "../types";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { AppIcon, AppIconName } from "../../../shared/ui/atoms/AppIcon";

import { PatientHomeScreen } from "../../../modules/patient/screens/PatientHomeScreen";
import { PatientServicesScreen } from "../../../modules/patient/screens/PatientServicesScreen";
import { PatientAppointmentsScreen } from "../../../modules/patient/screens/PatientAppointmentsScreen";
import { PatientProgressScreen } from "../../../modules/patient/screens/PatientProgressScreen";
import { PatientProfileScreen } from "../../../modules/patient/screens/PatientProfileScreen";
import { ServiceDetailsScreen } from "../../../modules/patient/screens/ServiceDetailsScreen";
import { DoctorProfileScreen } from "../../../modules/patient/screens/DoctorProfileScreen";
import { BookingBranchScreen } from "../../../modules/patient/screens/BookingBranchScreen";
import { BookingDateTimeScreen } from "../../../modules/patient/screens/BookingDateTimeScreen";
import { BookingPaymentScreen } from "../../../modules/patient/screens/BookingPaymentScreen";
import { AppointmentConfirmationScreen } from "../../../modules/patient/screens/AppointmentConfirmationScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppointmentDetailsScreen } from "@/modules/patient/screens/AppointmentDetailsScreen";
import { AppointmentMoreDetails } from "@/modules/patient/screens/AppointmentMoreDetails";
import { DoctorDetailsScreen } from "@/modules/patient/screens/DoctorDetailsScreen";
import { FloatingTabBar } from "@/shared/ui/molecules/FloatingTabBar";
import { AppointmentsStack, HomeStack, ProfileStack, ServicesStack } from "../Stacks";


const Tab = createBottomTabNavigator<any>();
const Stack = createNativeStackNavigator<any>();

export function PatientTabs() {
  return (
    <Tab.Navigator
      // initialRouteName="ServicesStack"
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: "shift",
        
      }}
      
    >
      <Tab.Screen
        name="PatientHome"
        component={PatientHomeScreen}
        options={{ title: "Home" }}
      />

      <Tab.Screen
        name="PatientServices"
        component={PatientServicesScreen}
        options={{ title: "Services" }}
      />

      <Tab.Screen
        name="PatientAppointments"
        component={PatientAppointmentsScreen}
        options={{ title: "Appointments" }}
      />

      <Tab.Screen
        name="PatientProfile"
        component={PatientProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

export function PatientApp() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PatientTabs" component={PatientTabs} />
      <Stack.Screen name="AppointmentsStack" component={AppointmentsStack} />
      <Stack.Screen name="HomeStack" component={HomeStack} />
      <Stack.Screen name="ProfileStack" component={ProfileStack} />
      <Stack.Screen name="ServicesStack" component={ServicesStack} />
    </Stack.Navigator>
  );
}
