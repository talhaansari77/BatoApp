import React from "react";
import { Image, Platform, useWindowDimensions, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../../core/navigation/navigation.types";
import { Screen } from "../../../shared/ui/templates/Screen";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  return (
    <View>
      <View
        style={{
          position: "absolute",
          backgroundColor: theme.colors.primary,
          top: 0,
          height: Platform.OS === "ios" ? height  : height+insets.top,
          width: width,
        }}
      >
        <Image
          style={{ height: "100%", width: "100%",}}
          resizeMode="stretch"
          source={require("../../../assets/images/welcomeLight.png")}
        />
      </View>

      <View
        style={{
          position: "relative",
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
    </View>
  );
}
