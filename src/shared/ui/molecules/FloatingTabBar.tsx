import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from "react-native";
import { BlurView } from "expo-blur";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { AppIcon } from "../atoms/AppIcon";
import * as Icons from "lucide-react-native";
import { PatientTabParamList } from "@/core/navigation/types";
import { lightColors } from "@/theme";
import { useAppTheme } from "@/app/providers/ThemeProvider";

export type AppIconName = keyof typeof Icons;

const icons: Record<keyof PatientTabParamList, AppIconName> = {
  PatientHome: "House",
  PatientServices: "Sparkles",
  PatientAppointments: "CalendarDays",
  PatientProfile: "UserRound",
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// --- Layout ---------------------------------------------------------------

const ITEM_SIZE = Math.min(Math.max(SCREEN_WIDTH * 0.14, 52), 64);
const ITEM_HEIGHT = ITEM_SIZE;
const GAP = Math.max(SCREEN_WIDTH * 0.025, 8);
const PADDING = Math.max(SCREEN_WIDTH * 0.03, 10);
const BAR_WIDTH_RATIO = 0.9;

// Space on each side of the label inside the active item.
const LABEL_H_PAD = 10;

// Inactive items never get squeezed below this, however long the label is.
const MIN_INACTIVE_WIDTH = ITEM_SIZE * 0.7;

// --- Shape ------------------------------------------------------------------

// Concentric corners: the bar's radius is the item radius plus the padding
// between them, so the curves stay parallel instead of looking mismatched.
const ITEM_RADIUS = 14;
const BAR_RADIUS = ITEM_RADIUS + PADDING;

// --- Icon + label stack -------------------------------------------------------

const ICON_SIZE = ITEM_SIZE * 0.48;
const LABEL_FONT_SIZE = 11;
const LABEL_LINE_HEIGHT = 14;
const LABEL_GAP = 2;

// Height of icon + gap + label, centred in the item when active.
const STACK_HEIGHT = ICON_SIZE + LABEL_GAP + LABEL_LINE_HEIGHT;
const STACK_PAD = (ITEM_HEIGHT - STACK_HEIGHT) / 2;
// How far the icon travels up from dead-centre to make room for the label.
const ICON_LIFT = (LABEL_GAP + LABEL_LINE_HEIGHT) / 2;

// Floor for an item's flex weight, so an item that undershoots while closing
// can squish slightly below its resting width but never collapses to nothing.
const MIN_WEIGHT = 0.8;

// Underdamped spring => overshoot and wobble. `damping` is the bounce dial:
// lower is bouncier (~19% overshoot here), higher settles faster and flatter.
const SPRING = { damping: 12, stiffness: 190, mass: 0.9 };

type TabItemProps = {
  available: number; // row width once padding and gaps are removed
  count: number; // total number of tabs
  name: AppIconName;
  label: string;
  color: string;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

function TabItem({
  available,
  count,
  name,
  label,
  color,
  focused,
  onPress,
  onLongPress,
}: TabItemProps) {
  // Natural width of the label text, measured by the hidden <Text> below.
  const [textWidth, setTextWidth] = useState(0);

  const handleMeasure = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const width = e.nativeEvent.lines[0]?.width;
    if (width) {
      setTextWidth((prev) => (Math.abs(prev - width) < 0.5 ? prev : Math.ceil(width)));
    }
  };

  // Active width = label + padding. Inactive items share whatever is left, so
  // the flex weight that produces exactly that width is
  //   weight = target * (count - 1) / (available - target)
  // (an inactive item has weight 1). Falls back to a rough estimate until the
  // label has been measured.
  const expandWeight = useMemo(() => {
    const others = count - 1;
    if (others <= 0) return 1;

    const natural = (textWidth || label.length * 7) + LABEL_H_PAD * 2;
    const equalShare = available / count; // never narrower than an inactive item
    const maxActive = available - others * MIN_INACTIVE_WIDTH;
    const target = Math.min(Math.max(natural, equalShare), maxActive);

    return (target * others) / (available - target);
  }, [textWidth, label, available, count]);

  // 0 = collapsed, 1 = expanded. Each item owns its own spring, so the item
  // opening overshoots past 1 while the one closing undershoots below 0 —
  // that's where the bounce comes from.
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, SPRING);
  }, [focused, progress]);

  // Widths are animated as flex weights rather than fixed pixels: the row
  // always fills the bar, so overshoot just shifts the proportions and can
  // never push the row past the bar's edges.
  const containerStyle = useAnimatedStyle(() => ({
    flexGrow: Math.max(MIN_WEIGHT, 1 + (expandWeight - 1) * progress.value),
  }));

  const activeBgStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, Math.max(0, progress.value)),
  }));

  // Icon lifts to make room for the label and pops slightly.
  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -ICON_LIFT * progress.value },
      { scale: 1 + 0.08 * progress.value },
    ],
  }));

  // Label fades in once the item is mostly open and springs up from below.
  // translateY extrapolates (no clamp) so it bounces with the spring.
  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.4, 1], [0, 1], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [6, 0]) }],
  }));

  return (
    <Animated.View style={[styles.item, containerStyle]}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.activeBg, activeBgStyle]}
      />

      {/* Invisible, unconstrained copy of the label used only to measure its
          natural width. Must match the visible label's font styling. */}
      <View
        pointerEvents="none"
        style={styles.measureWrap}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        <Text numberOfLines={1} onTextLayout={handleMeasure} style={styles.measureText}>
          {label}
        </Text>
      </View>

      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityRole="button"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={label}
        style={styles.pressable}
      >
        <Animated.View style={iconStyle}>
          <AppIcon name={name} size={ICON_SIZE} color={color} />
        </Animated.View>
        <Animated.Text
          numberOfLines={1}
          ellipsizeMode="clip"
          style={[styles.label, { color }, labelStyle]}
        >
          {label}
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
}

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  const count = state.routes.length;
  const barWidth = SCREEN_WIDTH * BAR_WIDTH_RATIO;
  const available = barWidth - PADDING * 2 - (count - 1) * GAP;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: insets.bottom }]}
    >
      <BlurView
        intensity={20}
        tint="light"
        style={[styles.bar, { width: barWidth }]}
      >
        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const { options } = descriptors[route.key];
            const label =
              typeof options.tabBarLabel === "string"
                ? options.tabBarLabel
                : (options.title ?? route.name);

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <TabItem
                key={route.key}
                available={available}
                count={count}
                name={icons[route.name as keyof PatientTabParamList]}
                label={label}
                color={theme.colors.background}
                focused={focused}
                onPress={onPress}
                onLongPress={() =>
                  navigation.emit({ type: "tabLongPress", target: route.key })
                }
              />
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const labelFont = {
  fontSize: LABEL_FONT_SIZE,
  lineHeight: LABEL_LINE_HEIGHT,
  fontWeight: "600" as const,
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bar: {
    padding: PADDING,
    borderRadius: BAR_RADIUS,
    overflow: "hidden",
    backgroundColor: lightColors.primaryDark,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: GAP,
  },
  item: {
    height: ITEM_HEIGHT,
    flexBasis: 0, // width comes entirely from the animated flexGrow
    borderRadius: ITEM_RADIUS,
    overflow: "hidden",
    backgroundColor: lightColors.overlay_1,
  },
  activeBg: {
    backgroundColor: lightColors.overlay,
    borderRadius: ITEM_RADIUS,
  },
  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    ...labelFont,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: STACK_PAD,
    textAlign: "center",
  },
  measureWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0,
  },
  // Wide enough that the text never wraps, so line width = natural width.
  measureText: {
    ...labelFont,
    width: 400,
  },
});