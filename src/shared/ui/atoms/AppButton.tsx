import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { AppText } from "./AppText";
import Animated from "react-native-reanimated";
import { themeTransition } from "@/theme/transitions";

type AppButtonVariant = "primary" | "outline" | "ghost" | "white";

type AppButtonProps = PressableProps & {
  title: string;
  variant?: AppButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export function AppButton({
  title,
  variant = "primary",
  loading = false,
  fullWidth = true,
  disabled,
  style,
  ...props
}: AppButtonProps) {
  const theme = useAppTheme();

  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    if (variant === "outline") {
      return {
        backgroundColor: "transparent",
        borderColor: theme.colors.primaryDark,
        borderWidth: 1,
      };
    }

    if (variant === "ghost") {
      return {
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 1,
      };
    }
    if (variant === "white") {
      return {
        backgroundColor: theme.colors.nude,
        borderColor: theme.colors.nude,
        borderWidth: 1,
      };
    }

    return {
      backgroundColor: theme.colors.primaryDark,
      borderColor: theme.colors.primaryDark,
      borderWidth: 1,
    };
  };

  const textColor = variant === "primary" ? theme.colors.inverted : theme.colors.primaryDark;

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          width: fullWidth ? "100%" : undefined,
          opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.base,
          { borderRadius: theme.radius.lg },
          getButtonStyle(),
          themeTransition,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <AppText variant="bodyMedium" color={textColor}>
            {title}
          </AppText>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
