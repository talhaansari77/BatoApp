import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../../../../app/providers/ThemeProvider";
import { AppHeader } from "../../molecules/AppHeader";
import Animated from "react-native-reanimated";
import { themeTransition } from "@/theme/transitions";

type ScreenProps = {
  children: React.ReactNode;
  ShowAppHeader?: boolean;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  scroll?: boolean;
  footer?: React.ReactNode;
  contentStyle?: ViewStyle;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onGiftPress?: () => void;
  onNotificationPress?: () => void;
};

export function Screen({
  children,
  ShowAppHeader=false,
  title,
  subtitle,
  showBack,
  onBackPress,
  scroll = true,
  footer,
  contentStyle,
  onMenuPress,
  onSearchPress,
  onGiftPress,
  onNotificationPress,
}: ScreenProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const content = (
    <View
      style={[
        styles.content,
        {
          paddingHorizontal: theme.spacing.xl,
          paddingBottom: footer
            ? theme.spacing.xl
            : insets.bottom + theme.spacing.xl,
          paddingTop: ShowAppHeader?0:insets.top,
        },
        contentStyle,
      ]}
    >
      {children}
      <View style={{ height: 64 + insets.bottom + 12 }} />
    </View>
  );

  return (
    <Animated.View style={[styles.root, { backgroundColor: theme.colors.background },themeTransition]}>
      {ShowAppHeader ? (
        <AppHeader
          onMenuPress={onMenuPress}
          onSearchPress={onSearchPress}
          onGiftPress={onGiftPress}
          onNotificationPress={onNotificationPress}
        />
      ):null}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}

        {footer ? (
          <View
            style={[
              styles.footer,
              {
                paddingBottom: insets.bottom + theme.spacing.md,
                paddingHorizontal: theme.spacing.xl,
                backgroundColor: theme.colors.background,
                borderTopColor: theme.colors.border,
              },
            ]}
          >
            {footer}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
