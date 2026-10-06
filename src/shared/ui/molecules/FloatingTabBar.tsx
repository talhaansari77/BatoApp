import { useEffect } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { AppIcon } from "../atoms/AppIcon";
import * as Icons from "lucide-react-native";
import { PatientTabParamList } from "@/core/navigation/navigation.types";
import { lightColors } from "@/theme";
import { useAppTheme } from "@/app/providers/ThemeProvider";
export type AppIconName = keyof typeof Icons;

const icons: Record<keyof PatientTabParamList, AppIconName> = {
  PatientHome: "House",
  PatientServices: "Sparkles",
  PatientAppointments: "CalendarDays",
  PatientProgress: "ChartNoAxesColumnIncreasing",
  PatientProfile: "UserRound",
};

const ITEM_SIZE = 52;
const GAP = 10;
const PADDING = 8;
const SPRING = { damping: 18, stiffness: 220, mass: 0.7 };

function TabIcon({
  name,
  focused,
  color,
}: {
  name: AppIconName;
  focused: boolean;
  color: string;
}) {
  const scale = useSharedValue(focused ? 1.1 : 1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1, SPRING);
  }, [focused, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={style}>
      <AppIcon name={name} size={22} color={color} />
    </Animated.View>
  );
}

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  const indicatorX = useSharedValue(state.index * (ITEM_SIZE + GAP));

  useEffect(() => {
    indicatorX.value = withSpring(state.index * (ITEM_SIZE + GAP), SPRING);
  }, [state.index, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: insets.bottom + 12 }]}
    >
      <BlurView intensity={35} tint="light" style={styles.bar}>
        {/* Layer 1: static circles behind everything */}
        <View style={styles.row} pointerEvents="none">
          {state.routes.map((route) => (
            <View key={route.key} style={styles.circle} />
          ))}
        </View>

        {/* Layer 2: sliding active indicator */}
        <Animated.View
          pointerEvents="none"
          style={[styles.circle, styles.indicator, indicatorStyle]}
        />

        {/* Layer 3: touch targets + icons */}
        <View style={[styles.row, styles.rowOverlay]}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const { options } = descriptors[route.key];

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
              <Pressable
                key={route.key}
                onPress={onPress}
                onLongPress={() =>
                  navigation.emit({ type: "tabLongPress", target: route.key })
                }
                accessibilityRole="button"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={options.title}
                style={styles.item}
              >
                <TabIcon
                  name={icons[route.name as keyof PatientTabParamList]}
                  focused={focused}
                  color={theme.colors.nude}
                />
              </Pressable>
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
  rowOverlay: {
    position: "absolute",
    top: PADDING,
    left: PADDING,
  },
  circle: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: lightColors.overlayDark,
  },
  indicator: {
    position: "absolute",
    top: PADDING,
    left: PADDING,
    backgroundColor: lightColors.overlay_2,
  },
  item: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});