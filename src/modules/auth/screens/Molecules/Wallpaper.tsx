import { useAppTheme } from "@/app/providers/ThemeProvider";
import { useWindowDimensions, View, Image, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Assets } from "assets";

export const Wallpaper = () => {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  return (
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
      />
    </View>
  );
};