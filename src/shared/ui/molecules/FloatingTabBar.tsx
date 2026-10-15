import { useEffect, useMemo } from "react";
import { View, Pressable, StyleSheet, Dimensions } from "react-native";
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
import { PatientTabParamList } from "@/core/navigation/types";
import { useAppTheme } from "@/app/providers/ThemeProvider";
import { HairFollicle } from "@/utils/HairFollicle";

export type AppIconName = keyof typeof Icons;

const icons: Record<keyof PatientTabParamList, AppIconName> = {
  PatientHome: "House",
  Assessment: "Sparkles",
  PatientAppointments: "CalendarDays",
  Chat: "MessageCircle",
  PatientProfile: "UserRound",
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// --- Layout ---------------------------------------------------------------

const ITEM_SIZE = Math.min(Math.max(SCREEN_WIDTH * 0.12, 44), 56);
const ITEM_HEIGHT = ITEM_SIZE;
const GAP = Math.max(SCREEN_WIDTH * 0.02, 6);
const PADDING = Math.max(SCREEN_WIDTH * 0.025, 8);
const BAR_WIDTH_RATIO = 0.85;

// Minimum width for inactive items
const MIN_INACTIVE_WIDTH = ITEM_SIZE * 0.7;

// --- Shape ------------------------------------------------------------------

const ITEM_RADIUS = 14;
const BAR_RADIUS = ITEM_RADIUS + PADDING;

// --- Icon stack ---------------------------------------------------------------

const ICON_SIZE = ITEM_SIZE * 0.48;

// Floor for an item's flex weight
const MIN_WEIGHT = 0.8;

// Underdamped spring => overshoot and wobble.
const SPRING = { damping: 12, stiffness: 190, mass: 0.9 };

type TabItemProps = {
  available: number;
  count: number;
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
  focused,
  onPress,
  onLongPress,
}: TabItemProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Expand weight keeps uniform behavior when active item background highlights
  const expandWeight = useMemo(() => {
    const others = count - 1;
    if (others <= 0) return 1;

    const target = ITEM_SIZE; // Fixed icon-only size or uniform distribution
    return (target * others) / (available - target);
  }, [available, count]);

  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, SPRING);
  }, [focused, progress]);

  const containerStyle = useAnimatedStyle(() => ({
    flexGrow: Math.max(MIN_WEIGHT, 1 + (expandWeight - 1) * progress.value),
  }));

  const activeBgStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, Math.max(0, progress.value)),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + 0.08 * progress.value }],
  }));

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
        {({ pressed }) => (
          <Animated.View style={iconStyle}>
            {name === "Sparkles" ? (
              <HairFollicle
                size={32}
                color={
                  pressed || focused
                    ? theme.colors.background
                    : theme.colors.text
                }
                strokeWidth={2}
              />
            ) : (
              <AppIcon
                name={name}
                size={ICON_SIZE}
                color={
                  pressed || focused
                    ? theme.colors.background
                    : theme.colors.text
                }
              />
            )}
          </Animated.View>
        )}
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
  const styles = useMemo(() => createStyles(theme), [theme]);
  const count = state.routes.length;
  const barWidth = SCREEN_WIDTH * BAR_WIDTH_RATIO;
  const available = barWidth - PADDING * 2 - (count - 1) * GAP;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: insets.bottom / 2 }]}
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

// ---------- Styles ----------
function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    wrapper: {
      position: "absolute",
      left: 0,
      right: 0,
      alignItems: "center",
    },
    bar: {
      padding: 10,
      borderRadius: BAR_RADIUS,
      overflow: "hidden",
      backgroundColor: theme.colors.background,
      borderColor:theme.colors.border,
      borderWidth:1
    }, 
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: GAP,
    },
    item: {
      height: ITEM_HEIGHT,
      flexBasis: 0,
      borderRadius: ITEM_RADIUS,
      overflow: "hidden",
      backgroundColor: theme.colors.background,
    },
    activeBg: {
      backgroundColor: theme.colors.primaryForeground,
      borderRadius: ITEM_RADIUS,
    },
    pressable: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
