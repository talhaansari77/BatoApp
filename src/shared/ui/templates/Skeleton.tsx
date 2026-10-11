import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { Screen } from "./Screen";

const SHIMMER_DURATION = 1300;

type SkeletonStyles = ReturnType<typeof createStyles>;

// One shared animation value drives every skeleton shape.
const ShimmerContext = createContext<Animated.Value>(new Animated.Value(0));

/**
 * A single skeleton shape. It has its own muted background and a light
 * highlight that sweeps across the shape itself (clipped by overflow hidden),
 * so nothing animates outside the skeleton components.
 */
function SkeletonBox({ style }: { style?: StyleProp<ViewStyle> }) {
  const theme = useAppTheme();
  const shimmer = useContext(ShimmerContext);
  const [boxWidth, setBoxWidth] = useState(0);

  const translateX = useMemo(
    () =>
      shimmer.interpolate({
        inputRange: [0, 1],
        outputRange: [-boxWidth, boxWidth],
      }),
    [shimmer, boxWidth],
  );

  const onLayout = (event: LayoutChangeEvent) => {
    const next = Math.round(event.nativeEvent.layout.width);
    if (next !== boxWidth) setBoxWidth(next);
  };

  return (
    <View
      onLayout={onLayout}
      style={[
        { backgroundColor: theme.colors.cardMuted, borderRadius: 6 },
        style,
        { overflow: "hidden" },
      ]}
    >
      {boxWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { width: boxWidth, transform: [{ translateX }] },
          ]}
        >
          <LinearGradient
            colors={[
              theme.colors.cardMuted,
              theme.colors.card,
              theme.colors.cardMuted,
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
    </View>
  );
}

export function Skeleton() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    shimmer.setValue(0);

    const animation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: SHIMMER_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [shimmer]);

  return (
    <Screen
      title="Home"
      actions={[
        {
          icon: "Bell",
          onPress: () => {},
        },
      ]}
    >
      <ShimmerContext.Provider value={shimmer}>
        <View style={styles.root}>
          {/* Welcome header */}
          <View style={styles.welcomeTop}>
            <SkeletonBox style={styles.avatar} />

            <View style={styles.welcomeText}>
              <SkeletonBox style={styles.greeting} />
              <SkeletonBox style={styles.patientName} />
            </View>

            <View style={styles.headerActions}>
              <SkeletonBox style={styles.circleButton} />
              <SkeletonBox style={styles.circleButton} />
            </View>
          </View>

          {/* Hero card */}
          <View style={styles.heroBox}>
            <View style={styles.heroContent}>
              <SkeletonBox style={styles.heroBadge} />
              <SkeletonBox style={styles.heroTitle} />
              <SkeletonBox style={styles.heroTitleSecond} />
              <SkeletonBox style={styles.heroText} />
              <SkeletonBox style={styles.heroTextSecond} />
              <SkeletonBox style={styles.heroButton} />
            </View>

            <SkeletonBox style={styles.heroIcon} />
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <SectionSkeletonHeader styles={styles} />

            <View style={styles.quickGrid}>
              {[1, 2].map((item) => (
                <View key={item} style={styles.quickCard}>
                  <SkeletonBox style={styles.quickIcon} />
                  <SkeletonBox style={styles.quickTitle} />
                  <SkeletonBox style={styles.quickSubtitle} />
                </View>
              ))}
            </View>
          </View>

          {/* Services */}
          <View style={styles.section}>
            <SectionSkeletonHeader styles={styles} />

            <View style={styles.list}>
              {[1, 2, 3].map((item) => (
                <View key={item} style={styles.serviceCard}>
                  <SkeletonBox style={styles.serviceIcon} />

                  <View style={styles.cardText}>
                    <SkeletonBox style={styles.serviceTitle} />
                    <SkeletonBox style={styles.serviceSubtitle} />
                  </View>

                  <SkeletonBox style={styles.chevron} />
                </View>
              ))}
            </View>
          </View>

          {/* Upcoming appointment */}
          <View style={styles.section}>
            <SectionSkeletonHeader styles={styles} />

            <View style={styles.appointmentCard}>
              <SkeletonBox style={styles.appointmentIcon} />

              <View style={styles.cardText}>
                <SkeletonBox style={styles.appointmentTitle} />
                <SkeletonBox style={styles.appointmentTime} />
                <SkeletonBox style={styles.appointmentDoctor} />
              </View>

              <SkeletonBox style={styles.statusBadge} />
            </View>
          </View>

          {/* Treatment progress */}
          <View style={styles.section}>
            <SectionSkeletonHeader styles={styles} />

            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <View style={styles.cardText}>
                  <SkeletonBox style={styles.progressTitle} />
                  <SkeletonBox style={styles.progressSubtitle} />
                </View>

                <SkeletonBox style={styles.progressPercent} />
              </View>

              <SkeletonBox style={styles.progressTrack} />

              <View style={styles.progressFooter}>
                <SkeletonBox style={styles.progressFooterItem} />
                <SkeletonBox style={styles.progressFooterItem} />
              </View>
            </View>
          </View>

          {/* Featured specialists */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SkeletonBox style={styles.sectionTitle} />
            </View>

            <View style={styles.list}>
              {[1, 2].map((item) => (
                <View key={item} style={styles.specialistCard}>
                  <SkeletonBox style={styles.specialistAvatar} />

                  <View style={styles.cardText}>
                    <SkeletonBox style={styles.specialistName} />
                    <SkeletonBox style={styles.specialistRole} />
                  </View>

                  <View style={styles.specialistMeta}>
                    <SkeletonBox style={styles.rating} />
                    <SkeletonBox style={styles.experience} />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Recommended for you */}
          <View style={styles.recommendationCard}>
            <SkeletonBox style={styles.recommendationIcon} />

            <View style={styles.cardText}>
              <SkeletonBox style={styles.recommendationTitle} />
              <SkeletonBox style={styles.recommendationText} />
              <SkeletonBox style={styles.recommendationTextShort} />
            </View>
          </View>
        </View>
      </ShimmerContext.Provider>
    </Screen>
  );
}

function SectionSkeletonHeader({ styles }: { styles: SkeletonStyles }) {
  return (
    <View style={styles.sectionHeader}>
      <SkeletonBox style={styles.sectionTitle} />
      <SkeletonBox style={styles.sectionAction} />
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  // Static (non-animated) card container. Only the shapes inside shimmer.
  const cardSurface = {
    backgroundColor: theme.colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.cardMuted,
  } as const;

  return StyleSheet.create({
    root: {
      gap: theme.spacing["2xl"],
      paddingBottom: theme.spacing.lg,
    },

    welcomeTop: {
      minHeight: 54,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    avatar: {
      width: 54,
      height: 54,
      borderRadius: theme.radius.full,
    },

    welcomeText: {
      flex: 1,
      gap: theme.spacing.sm,
    },

    greeting: {
      width: 78,
      height: 10,
    },

    patientName: {
      width: 116,
      height: 20,
      borderRadius: 8,
    },

    headerActions: {
      flexDirection: "row",
      gap: 10,
    },

    circleButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },

    heroBox: {
      ...cardSurface,
      minHeight: 246,
      padding: theme.spacing.xl,
      borderRadius: theme.radius["2xl"],
      flexDirection: "row",
      gap: theme.spacing.md,
    },

    heroContent: {
      flex: 1,
      gap: theme.spacing.md,
    },

    heroBadge: {
      width: 112,
      height: 28,
      borderRadius: theme.radius.full,
    },

    heroTitle: {
      width: "95%",
      height: 22,
      borderRadius: 8,
    },

    heroTitleSecond: {
      width: "76%",
      height: 22,
      borderRadius: 8,
    },

    heroText: {
      width: "98%",
      height: 11,
    },

    heroTextSecond: {
      width: "84%",
      height: 11,
    },

    heroButton: {
      width: 142,
      height: 44,
      marginTop: 4,
      borderRadius: theme.radius.lg,
    },

    heroIcon: {
      width: 78,
      height: 78,
      alignSelf: "center",
      borderRadius: theme.radius["2xl"],
    },

    section: {
      gap: theme.spacing.md,
    },

    sectionHeader: {
      minHeight: 24,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    sectionTitle: {
      width: 132,
      height: 17,
      borderRadius: 8,
    },

    sectionAction: {
      width: 48,
      height: 10,
    },

    quickGrid: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },

    quickCard: {
      ...cardSurface,
      flex: 1,
      minHeight: 128,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.xl,
    },

    quickIcon: {
      width: 44,
      height: 44,
      marginBottom: theme.spacing.md,
      borderRadius: theme.radius.lg,
    },

    quickTitle: {
      width: 78,
      height: 13,
      marginBottom: theme.spacing.sm,
    },

    quickSubtitle: {
      width: 92,
      height: 9,
    },

    list: {
      gap: theme.spacing.md,
    },

    serviceCard: {
      ...cardSurface,
      minHeight: 78,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.xl,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    serviceIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.lg,
    },

    cardText: {
      flex: 1,
      gap: theme.spacing.sm,
    },

    serviceTitle: {
      width: 126,
      height: 13,
    },

    serviceSubtitle: {
      width: 186,
      height: 9,
    },

    chevron: {
      width: 18,
      height: 18,
      borderRadius: 6,
    },

    appointmentCard: {
      ...cardSurface,
      minHeight: 84,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.xl,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    appointmentIcon: {
      width: 50,
      height: 50,
      borderRadius: theme.radius.lg,
    },

    appointmentTitle: {
      width: 126,
      height: 13,
    },

    appointmentTime: {
      width: 110,
      height: 10,
    },

    appointmentDoctor: {
      width: 160,
      height: 9,
    },

    statusBadge: {
      width: 68,
      height: 25,
      borderRadius: theme.radius.full,
    },

    progressCard: {
      ...cardSurface,
      minHeight: 152,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.xl,
      gap: theme.spacing.md,
    },

    progressHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },

    progressTitle: {
      width: 150,
      height: 13,
    },

    progressSubtitle: {
      width: 122,
      height: 9,
    },

    progressPercent: {
      width: 40,
      height: 22,
      borderRadius: 8,
    },

    progressTrack: {
      height: 9,
      borderRadius: theme.radius.full,
    },

    progressFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    progressFooterItem: {
      width: 80,
      height: 10,
    },

    specialistCard: {
      ...cardSurface,
      minHeight: 76,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.xl,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    specialistAvatar: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.full,
    },

    specialistName: {
      width: 138,
      height: 13,
    },

    specialistRole: {
      width: 104,
      height: 9,
    },

    specialistMeta: {
      alignItems: "flex-end",
      gap: theme.spacing.sm,
    },

    rating: {
      width: 42,
      height: 10,
    },

    experience: {
      width: 42,
      height: 9,
    },

    recommendationCard: {
      ...cardSurface,
      minHeight: 86,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.xl,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    recommendationIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.lg,
    },

    recommendationTitle: {
      width: 148,
      height: 13,
    },

    recommendationText: {
      width: "100%",
      height: 9,
    },

    recommendationTextShort: {
      width: "72%",
      height: 9,
    },
  });
}