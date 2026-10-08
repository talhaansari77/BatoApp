import { DoctorProfileScreen } from "@/modules/doctor/screens/DoctorProfileScreen";
import { MedicalReportsScreen } from "@/modules/medical-records/screens/MedicalReportsScreen";
import { ReportDetailsScreen } from "@/modules/medical-records/screens/ReportDetailsScreen";
import { AppointmentMoreDetails } from "@/modules/patient/screens/AppointmentMoreDetails";
import { BookingBranchScreen } from "@/modules/patient/screens/BookingBranchScreen";
import { BookingDateTimeScreen } from "@/modules/patient/screens/BookingDateTimeScreen";
import { BookingPaymentScreen } from "@/modules/patient/screens/BookingPaymentScreen";
import { DoctorDetailsScreen } from "@/modules/patient/screens/DoctorDetailsScreen";
import { PatientAppointmentsScreen } from "@/modules/patient/screens/PatientAppointmentsScreen";
import { PatientHomeScreen } from "@/modules/patient/screens/PatientHomeScreen";
import { PatientProfileScreen } from "@/modules/patient/screens/PatientProfileScreen";
import { PatientServicesScreen } from "@/modules/patient/screens/PatientServicesScreen";
import { ServiceDetailsScreen } from "@/modules/patient/screens/ServiceDetailsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ArrowLeft, Icon } from "lucide-react-native";
import { Pressable, TouchableOpacity } from "react-native";

const PatientHomeStack = createNativeStackNavigator<any>();
const PatientProfileStack = createNativeStackNavigator<any>();
const PatientServicesStack = createNativeStackNavigator<any>();
const PatientAppointmentsStack = createNativeStackNavigator<any>();



export function PatientHomeNavigator() {
  return (
    <PatientHomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <PatientHomeStack.Screen
        name="PatientHome"
        component={PatientHomeScreen}
      />
      <PatientHomeStack.Screen
        name="DoctorProfile"
        component={DoctorProfileScreen}
      />
      <PatientHomeStack.Screen
        name="DoctorDetails"
        component={DoctorDetailsScreen}
      />
    </PatientHomeStack.Navigator>
  );
}

export function PatientServicesNavigator() {
  return (
    <PatientServicesStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <PatientServicesStack.Screen
        name="PatientServices"
        component={PatientServicesScreen}
      />
      <PatientServicesStack.Screen
        name="ServiceDetails"
        component={ServiceDetailsScreen}
      />
      <PatientServicesStack.Screen
        name="BookingBranch"
        component={BookingBranchScreen}
      />
      <PatientServicesStack.Screen
        name="BookingDateTime"
        component={BookingDateTimeScreen}
      />
      <PatientServicesStack.Screen
        name="BookingPayment"
        component={BookingPaymentScreen}
      />
    </PatientServicesStack.Navigator>
  );
}
export function PatientAppointmentsNavigator() {
  return (
    <PatientAppointmentsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <PatientAppointmentsStack.Screen
        options={{}}
        name="PatientAppointments"
        component={PatientAppointmentsScreen}
      />

      <PatientAppointmentsStack.Screen
        name="AppointmentDetails"
        component={PatientAppointmentsScreen}
      />
      <PatientAppointmentsStack.Screen
        name="AppointmentMoreDetails"
        component={AppointmentMoreDetails}
      />
    </PatientAppointmentsStack.Navigator>
  );
}
export function PatientProfileNavigator() {
  return (
    <PatientProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <PatientProfileStack.Screen
        name="PatientProfile"
        component={PatientProfileScreen}
      />
      <PatientProfileStack.Screen
        name="MedicalReports"
           options={({ navigation }) => ({
          headerShown: true,
          title: "Medical Reports",

          headerSearchBarOptions: {
            placeholder: "Search reports...",
          },

          headerLeft: () => (
            <Pressable onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="#000" />
            </Pressable>
          ),
        })}
        component={MedicalReportsScreen}
      />
      <PatientProfileStack.Screen
        name="ReportDetails"
        component={ReportDetailsScreen}
      />
    </PatientProfileStack.Navigator>
  );
}
