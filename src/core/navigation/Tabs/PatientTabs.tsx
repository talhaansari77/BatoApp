import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PatientHomeScreen } from "../../../modules/patient/screens/PatientHomeScreen";
import { PatientServicesScreen } from "../../../modules/patient/screens/PatientServicesScreen";
import { PatientAppointmentsScreen } from "../../../modules/patient/screens/PatientAppointmentsScreen";
import { PatientProfileScreen } from "../../../modules/patient/screens/PatientProfileScreen";
import { FloatingTabBar } from "@/shared/ui/molecules/FloatingTabBar";
import { AppointmentsStack, HomeStack, ProfileStack, ServicesStack } from "../Stacks";


const Tab = createBottomTabNavigator<any>();
const Stack = createNativeStackNavigator<any>();

export function PatientTabs() {
  return (
    <Tab.Navigator
      // initialRouteName="PatientProfile"
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
        name="Assessment"
        component={PatientServicesScreen}
        options={{ title: "Services" }}
      />
      <Tab.Screen
        name="PatientAppointments"
        component={PatientAppointmentsScreen}
        options={{ title: "Appointments" }}
      />
      <Tab.Screen
        name="Chat"
        component={PatientServicesScreen}
        options={{ title: "Messages" }}
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
    <Stack.Navigator 
    // initialRouteName="ProfileStack"
    screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PatientTabs" component={PatientTabs} />
      <Stack.Screen name="AppointmentsStack" component={AppointmentsStack} />
      <Stack.Screen name="HomeStack" component={HomeStack} />
      <Stack.Screen name="ProfileStack" component={ProfileStack} />
      <Stack.Screen name="ServicesStack" component={ServicesStack} />
    </Stack.Navigator>
  );
}
