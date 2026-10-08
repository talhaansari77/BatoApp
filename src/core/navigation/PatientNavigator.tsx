import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PatientStackParamList, PatientTabParamList } from "./navigation.types";
import { useAppTheme } from "../../app/providers/ThemeProvider";
import { AppIcon, AppIconName } from "../../shared/ui/atoms/AppIcon";

import { PatientHomeScreen } from "../../modules/patient/screens/PatientHomeScreen";
import { PatientServicesScreen } from "../../modules/patient/screens/PatientServicesScreen";
import { PatientAppointmentsScreen } from "../../modules/patient/screens/PatientAppointmentsScreen";
import { PatientProgressScreen } from "../../modules/patient/screens/PatientProgressScreen";
import { PatientProfileScreen } from "../../modules/patient/screens/PatientProfileScreen";
import { ServiceDetailsScreen } from "../../modules/patient/screens/ServiceDetailsScreen";
import { DoctorProfileScreen } from "../../modules/patient/screens/DoctorProfileScreen";
import { BookingBranchScreen } from "../../modules/patient/screens/BookingBranchScreen";
import { BookingDateTimeScreen } from "../../modules/patient/screens/BookingDateTimeScreen";
import { BookingPaymentScreen } from "../../modules/patient/screens/BookingPaymentScreen";
import { AppointmentConfirmationScreen } from "../../modules/patient/screens/AppointmentConfirmationScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppointmentDetailsScreen } from "@/modules/patient/screens/AppointmentDetailsScreen";
import { AppointmentMoreDetails } from "@/modules/patient/screens/AppointmentMoreDetails";
import { DoctorDetailsScreen } from "@/modules/patient/screens/DoctorDetailsScreen";
import { FloatingTabBar } from "@/shared/ui/molecules/FloatingTabBar";
import {
  PatientAppointmentsNavigator,
  PatientHomeNavigator,
  PatientProfileNavigator,
  PatientServicesNavigator,
} from "./PatientStacks";

const Tab = createBottomTabNavigator<any>();

export function PatientApp() {
  return (
    <Tab.Navigator
      initialRouteName="ServicesStack"
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: "shift",
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={PatientHomeNavigator}
        options={{ title: "Home" }}
      />

      <Tab.Screen
        name="ServicesStack"
        component={PatientServicesNavigator}
        options={{ title: "Services" }}
      />

      <Tab.Screen
        name="AppointmentsStack"
        component={PatientAppointmentsNavigator}
        options={{ title: "Appointments" }}
      />

      <Tab.Screen
        name="ProfileStack"
        component={PatientProfileNavigator}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}
