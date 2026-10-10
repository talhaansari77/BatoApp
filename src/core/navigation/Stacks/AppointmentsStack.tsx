import { AppointmentDetailsScreen } from "@/modules/patient/screens/AppointmentDetailsScreen";
import { AppointmentMoreDetails } from "@/modules/patient/screens/AppointmentMoreDetails";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<any>();
export function AppointmentsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
       <Stack.Screen
              name="AppointmentDetails"
              component={AppointmentDetailsScreen}
            />
            <Stack.Screen
              name="AppointmentMoreDetails"
              component={AppointmentMoreDetails}
            />
    </Stack.Navigator>
  );
}