import { DoctorDetailsScreen } from "@/modules/patient/screens/DoctorDetailsScreen";
import { DoctorProfileScreen } from "@/modules/patient/screens/DoctorProfileScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<any>();
export function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="DoctorProfile"
        component={DoctorProfileScreen}
      />
      <Stack.Screen
        name="DoctorDetails"
        component={DoctorDetailsScreen}
      />
    </Stack.Navigator>
  );
}