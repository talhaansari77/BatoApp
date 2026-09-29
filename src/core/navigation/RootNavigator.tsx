// src/core/navigation/RootNavigator.tsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AdminNavigator } from "./AdminNavigator";
import { AuthNavigator } from "./AuthNavigator";
import { DoctorNavigator } from "./DoctorNavigator";
import { PatientNavigator } from "./PatientNavigator";
import { RootStackParamList } from "./navigation.types";
import { useAuthStore } from "../../modules/auth/store/auth.store";
import { Animated, Image, View, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import { ReportsNavigator } from "./ReportsNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  const [appReady, setAppReady] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // const [loaded] = useFonts({});
  const loaded = true;

  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>();

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setSplashVisible(false);
          setAppReady(true);
        });
      }, 1500);
    }
  }, [loaded]);

  if (status === "checking") {
    return null; // later we can show splash/loading screen
  }

  return (
    <>
      <Stack.Navigator
        // initialRouteName="PatientApp"
        screenOptions={{ headerShown: false }}
      >
        {/* {status === "authenticated" && user?.role === "Patient" ? (
      ) : status === "authenticated" && user?.role === "Doctor" ? (
      ) : status === "authenticated" && user?.role === "Admin" ? (
      ) : ( */}
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="PatientApp" component={PatientNavigator} />
        <Stack.Screen name="DoctorApp" component={DoctorNavigator} />
        <Stack.Screen name="AdminApp" component={AdminNavigator} />
        <Stack.Screen name="ReportsApp" component={ReportsNavigator} />
        {/* )} */}
      </Stack.Navigator>

      {/* splashVisible */}

      {splashVisible && (
        <Animated.View
          style={[styles.splashContainer, { opacity: fadeAnim }]}
          pointerEvents="none"
        >
          <Image
            source={require("../../../assets/welcomeLight.png")}
            style={styles.splashImage}
          />
        </Animated.View>
      )}
    </>
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
