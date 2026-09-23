import React from "react";
import { Image, useWindowDimensions, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../../core/navigation/navigation.types";
import { Screen } from "../../../shared/ui/templates/Screen";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  const { height, width } = useWindowDimensions();
  const theme = useAppTheme();

  return (
    <SafeAreaView>
      <View
        style={{
          position: "absolute",
          top: 0,
          height: height,
          width: width,
        }}
      >
        <Image
          style={{ height: "100%", width: "100%" }}
          resizeMode="contain"
          source={require("../../../assets/images/welcomeLight.png")}
        />
      </View>

      <View
        style={{
          position: "absolute",
          bottom: -(height/1.2),
          width:width,
          paddingHorizontal:theme.spacing.md,
          gap: theme.spacing.md,
        }}
      >
        <AppButton title="Login" onPress={() => navigation.navigate("Login")} />

        <AppButton
          title="Create Account"
          variant="outline"
          
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </SafeAreaView>
  );
}
