import React, { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  ColorValue,
  Pressable,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import { EaseView } from "react-native-ease";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { useAppLanguage } from "../../../app/providers/LanguageProvider";
import { AppIcon } from "../atoms/AppIcon";

export type ToggleThemeMode = "light" | "dark";

type ThemeToggleProps = {
  value: ToggleThemeMode;
  onChange: (mode: ToggleThemeMode) => void;
  isRTL?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  lightLabel?: string;
  darkLabel?: string;
};

function useReducedMotion() {
  // Avoid motion until the accessibility preference has been read.
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    let mounted = true;
    let receivedEvent = false;
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => {
        receivedEvent = true;
        if (mounted) setReduceMotion(enabled);
      },
    );
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted && !receivedEvent) setReduceMotion(enabled);
      })
      .catch(() => {});

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}

/** Controlled, reusable toggle; independent of the app's theme provider. */
export function ThemeToggle({
  value,
  onChange,
  isRTL = false,
  disabled = false,
  accessibilityLabel = "Dark theme",
  lightLabel = "Light",
  darkLabel = "Dark",
}: ThemeToggleProps) {
  const reduceMotion = useReducedMotion();
  const [pressed, setPressed] = useState(false);
  const isDark = value === "dark";
  const thumbOnRight = isDark !== isRTL;
  const leftIcon = isRTL ? "Moon" : "Sun";
  const rightIcon = isRTL ? "Sun" : "Moon";

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: isDark ? darkLabel : lightLabel }}
      accessibilityState={{ checked: isDark, disabled }}
      disabled={disabled}
      onPress={() => onChange(isDark ? "light" : "dark")}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.pressable, disabled && styles.disabled]}
    >
      <EaseView
        animate={{
          backgroundColor: isDark ? "#202D42" : "#EEF2F6",
          scale: pressed ? 0.97 : 1,
        }}
        transition={
          reduceMotion
            ? { type: "none" }
            : { type: "timing", duration: 240, easing: "easeInOut" }
        }
        style={styles.track}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
      >
        <View style={styles.iconSlots}>
          <AppIcon
            name={leftIcon}
            size={18}
            color={isDark ? "#CAD5E5" : "#64748B"}
          />
          <AppIcon
            name={rightIcon}
            size={18}
            color={isDark ? "#CAD5E5" : "#64748B"}
          />
        </View>

        <EaseView
          animate={{
            translateX: thumbOnRight ? 44 : 0,
            translateY: pressed ? 1 : 0,
            backgroundColor: isDark ? "#DCE7FA" : "#FFFFFF",
          }}
          transition={
            reduceMotion
              ? { type: "none" }
              : {
                  transform: {
                    type: "spring",
                    damping: 22,
                    stiffness: 280,
                    mass: 1,
                  },
                  backgroundColor: {
                    type: "timing",
                    duration: 240,
                    easing: "easeInOut",
                  },
                }
          }
          style={styles.thumb}
        >
          <View style={styles.thumbHighlight} />
          <EaseView
            animate={{ opacity: isDark ? 0 : 1, rotate: isDark ? 60 : 0 }}
            transition={
              reduceMotion
                ? { type: "none" }
                : { type: "timing", duration: 200 }
            }
            style={styles.thumbIcon}
          >
            <AppIcon name="Sun" size={20} color="#9A5B00" />
          </EaseView>
          <EaseView
            animate={{ opacity: isDark ? 1 : 0, rotate: isDark ? 0 : -40 }}
            transition={
              reduceMotion
                ? { type: "none" }
                : { type: "timing", duration: 200 }
            }
            style={styles.thumbIcon}
          >
            <AppIcon name="Moon" size={20} color="#24436F" />
          </EaseView>
        </EaseView>
      </EaseView>
    </Pressable>
  );
}

/** Drop-in provider-connected replacement for the original selector. */
export function ThemeModeSelector() {
  const theme = useAppTheme();
  const { isRTL } = useAppLanguage();
  const { t } = useTranslation();
  const effectiveMode: ToggleThemeMode = theme.resolvedMode;

  return (
    <ThemeToggle
      value={effectiveMode}
      disabled={theme.isThemeTransitioning}
      onChange={(mode) => {
        void theme.setMode(mode).catch((error) => {
          console.warn("Unable to save theme preference:", error);
        });
      }}
      isRTL={isRTL}
      accessibilityLabel={t("common.darkTheme", { defaultValue: "Dark theme" })}
      lightLabel={t("common.light", { defaultValue: "Light" })}
      darkLabel={t("common.dark", { defaultValue: "Dark" })}
    />
  );
}

type ThemeTransitionViewProps = ViewProps & {
  backgroundColor: ColorValue;
  borderColor?: ColorValue;
};

/** Surface helper; transitions are coordinated by ThemeProvider. */
export function ThemeTransitionView({
  backgroundColor,
  borderColor,
  style,
  ...props
}: ThemeTransitionViewProps) {
  // Compatibility export: the provider now coordinates all theme transitions.
  // Do not start a second color animation inside the global fade.
  return (
    <View
      {...props}
      style={[
        style,
        { backgroundColor, ...(borderColor !== undefined ? { borderColor } : {}) },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  pressable: {
    minWidth: 88,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    // Physical coordinates keep the thumb animation independent of native RTL.
    direction: "ltr",
  },
  disabled: { opacity: 0.5 },
  track: {
    width: 88,
    height: 44,
    borderRadius: 22,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  iconSlots: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  thumb: {
    position: "absolute",
    left: 4,
    top: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  thumbHighlight: {
    position: "absolute",
    top: 2,
    left: 5,
    right: 5,
    height: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.28)",
  },
  thumbIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
