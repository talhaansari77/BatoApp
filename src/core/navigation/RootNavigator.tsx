// src/core/navigation/RootNavigator.tsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Auth } from "./AuthNavigator";
import { RootStackParamList } from "./navigation.types";
import { useAuthStore } from "../../modules/auth/store/auth.store";
import { PatientApp } from "./PatientNavigator";
import { StyleSheet } from "react-native";

  const Stack = createNativeStackNavigator<RootStackParamList>();

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
      
      <Stack.Screen name="Auth" component={Auth} />
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

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999, // Keeps splash screen on top
  },
  splashImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
