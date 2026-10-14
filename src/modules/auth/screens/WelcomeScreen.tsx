import { Image, Platform, useWindowDimensions, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../../core/navigation/types";
import { Screen } from "../../../shared/ui/templates/Screens/Screen";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { useAppLanguage } from "../../../app/providers/LanguageProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Assets } from "assets";
import { Wallpaper } from "./Molecules/Wallpaper";

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
          backgroundColor: "#000000",
          top: 0,
          height: Platform.OS === "ios" ? height : height + insets.top,
          width: width,
        }}
      >
        <Image
          style={{ height: "100%", width: "100%", opacity: 0.6 }}
          resizeMode="stretch"
          source={
            theme.resolvedMode === "dark"
              ? Assets.WelcomeDark
              : Assets.WelcomeLight
          }
           onLoad={() => console.log('Image loaded')}
  onError={(event) =>
    console.log('Image error:', event.nativeEvent.error)
  }
        />
      </View>

      <View
        style={{
          position: "relative",
          bottom: -(height / 1.2),
          width: width,
          paddingHorizontal: theme.spacing.md,
          gap: theme.spacing.md,
        }}
      >
        <AppButton title="Login" onPress={() => navigation.navigate("Login")} />

        <AppButton
          title="Create Account"
          variant="white"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
}
