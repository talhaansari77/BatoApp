// src/core/navigation/RootNavigator.tsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthStack } from "./Stacks/";
import { useAuthStore } from "../../modules/auth/store/auth.store";
import { PatientApp } from "./Tabs/PatientTabs";

  const Stack = createNativeStackNavigator<any>();

export function RootNavigator() {
  const status = useAuthStore((state) => state.status);
  // const [loaded] = useFonts({});
  const loaded = true;

  // const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>();

  if (status === "checking") {
    return null; // later we can show splash/loading screen
  }

  return (
    <Stack.Navigator
      initialRouteName="PatientApp"
      screenOptions={{ headerShown: false }}
    >
      
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="PatientApp" component={PatientApp} />
      

      {/* {status === "authenticated" && user ? (
          <Stack.Screen name="PatientApp" component={PatientNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )} */}

      {/* <Stack.Screen name="Auth" component={AuthNavigator} />
         <Stack.Screen name="PatientApp" component={PatientNavigator} />
         <Stack.Screen name="DoctorApp" component={DoctorNavigator} />
         <Stack.Screen name="AdminApp" component={AdminNavigator} />
         <Stack.Screen name="ReportsApp" component={ReportsNavigator} /> */}
    </Stack.Navigator>
  );
}
