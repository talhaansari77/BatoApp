import { BookingBranchScreen } from "@/modules/patient/screens/BookingBranchScreen";
import { BookingDateTimeScreen } from "@/modules/patient/screens/BookingDateTimeScreen";
import { BookingPaymentScreen } from "@/modules/patient/screens/BookingPaymentScreen";
import { ServiceDetailsScreen } from "@/modules/patient/screens/ServiceDetailsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<any>();
export function ServicesStack() {
  return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="ServiceDetails"
          component={ServiceDetailsScreen}
        />
        <Stack.Screen
          name="BookingBranch"
          component={BookingBranchScreen}
        />
        <Stack.Screen
          name="BookingDateTime"
          component={BookingDateTimeScreen}
        />
        <Stack.Screen
          name="BookingPayment"
          component={BookingPaymentScreen}
        />
      </Stack.Navigator>
    );
}