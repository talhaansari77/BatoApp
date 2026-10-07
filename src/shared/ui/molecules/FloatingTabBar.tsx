import { useEffect } from "react";
import { View, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { BlurView } from "expo-blur";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";
import { AppIcon } from "../atoms/AppIcon";
import * as Icons from "lucide-react-native";
import { PatientTabParamList } from "@/core/navigation/navigation.types";
import { lightColors } from "@/theme";
import { useAppTheme } from "@/app/providers/ThemeProvider";
import { AppText } from "../atoms/AppText";
export type AppIconName = keyof typeof Icons;

const icons: Record<keyof PatientTabParamList, AppIconName> = {
  PatientHome: "House",
  PatientServices: "Sparkles",
  PatientAppointments: "CalendarDays",
  PatientProgress: "ChartNoAxesColumnIncreasing",
  PatientProfile: "UserRound",
};

const ITEM_SIZE = 56; // collapsed circle size
const GAP = 10;
const PADDING = 12;
const ICON_SIZE = 32;
const ICON_PAD = (ITEM_SIZE - ICON_SIZE) / 2; // keeps the icon centered when collapsed
const LABEL_GAP = 6;
const LABEL_PAD_RIGHT = 14;
const BAR_WIDTH_RATIO = 0.9;

// Critically damped spring: smooth, no overshoot (so widths never exceed the bar).
const SPRING = { damping: 26, stiffness: 220, mass: 0.8 };

type TabItemProps = {
  index: number;
  position: SharedValue<number>; // animated (fractional) active index
  expandedWidth: number;
  name: AppIconName;
  label: string;
  color: string;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

function TabItem({
  index,
  position,
  expandedWidth,
  name,
  label,
  color,
  focused,
  onPress,
  onLongPress,
}: TabItemProps) {
  const labelWidth =
    expandedWidth - ICON_PAD - ICON_SIZE - LABEL_GAP - LABEL_PAD_RIGHT;

  // 0 = collapsed, 1 = fully expanded. Derived from the shared position so every
  // item (the one growing and the one shrinking) stays perfectly in sync.
  const containerStyle = useAnimatedStyle(() => {
    const p = Math.max(0, Math.min(1, 1 - Math.abs(position.value - index)));
    return {
      width: interpolate(
        p,
        [0, 1],
        [ITEM_SIZE, expandedWidth],
        Extrapolation.CLAMP,
      ),
    };
  });

  const activeBgStyle = useAnimatedStyle(() => {
    const p = Math.max(0, Math.min(1, 1 - Math.abs(position.value - index)));
    return { opacity: p };
  });

  const iconStyle = useAnimatedStyle(() => {
    const p = Math.max(0, Math.min(1, 1 - Math.abs(position.value - index)));
    return { transform: [{ scale: interpolate(p, [0, 1], [1, 1.08]) }] };
  });

  const labelStyle = useAnimatedStyle(() => {
    const p = Math.max(0, Math.min(1, 1 - Math.abs(position.value - index)));
    return {
      // text fades in only once the pill is mostly open, and fades out first on close
      opacity: interpolate(p, [0.45, 1], [0, 1], Extrapolation.CLAMP),
      transform: [
        { translateX: interpolate(p, [0, 1], [-8, 0], Extrapolation.CLAMP) },
      ],
    };
  });

  return (
    <Animated.View style={[styles.item, containerStyle]}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.activeBg, activeBgStyle]}
      />
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
          style={[styles.label, { width: labelWidth, color }, labelStyle]}
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
  const { width: screenWidth } = useWindowDimensions();

  const count = state.routes.length;
  const barWidth = screenWidth * BAR_WIDTH_RATIO;
  // The active pill takes whatever space the collapsed circles leave over.
  const expandedWidth =
    barWidth - PADDING * 2 - (count - 1) * (ITEM_SIZE + GAP);

  const position = useSharedValue(state.index);

  useEffect(() => {
    position.value = withSpring(state.index, SPRING);
  }, [state.index, position]);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: insets.bottom }]}
    >
      <BlurView
        intensity={35}
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
                index={index}
                position={position}
                expandedWidth={expandedWidth}
                name={icons[route.name as keyof PatientTabParamList]}
                label={label}
                color={theme.colors.nude}
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

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bar: {
    padding: PADDING,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: lightColors.greyGlass,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: GAP,
  },
  item: {
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    overflow: "hidden",
    backgroundColor: lightColors.overlayDark,
  },
  activeBg: {
    backgroundColor: lightColors.overlay_2,
    borderRadius: ITEM_SIZE / 2,
  },
  pressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: ICON_PAD,
  },
  label: {
    marginLeft: LABEL_GAP,
    fontSize: 16,
    fontWeight: "600",
  },
});
