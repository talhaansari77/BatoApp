import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../../core/navigation/types";

// type Props = NativeStackScreenProps<AuthStackParamList, "Splash">;

export function SplashScreen({ navigation,onFinish }:any) {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity: 1
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Wait for 2 seconds before starting the fade-out
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800, // Duration of the fade animation in ms
        useNativeDriver: true, // Uses native thread for smooth performance
      }).start(() => {
        setIsVisible(false);
        if (onFinish) onFinish(); // Callback to notify parent component
        // navigation.replace("Welcome"); // Navigate to the Welcome screen after fade-out
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, onFinish]);

  if (!isVisible) return null;
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Replace with your app logo or custom visual elements */}
      <Image
        source={require("../../../../assets/welcomeLight.png")}
        style={{ flex: 1, width: "100%", height: "100%" }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // Covers the full screen over main content
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999, // Keeps splash screen on top
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
