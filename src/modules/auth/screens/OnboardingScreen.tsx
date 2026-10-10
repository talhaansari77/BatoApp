import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
  ImageSourcePropType,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "@/core/navigation/types";
import Assets from "@/assets";
import { useAppTheme } from "@/app/providers/ThemeProvider";
// import type { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get("window");

const PRIMARY = "#6C63FF";
const TEXT_DARK = "#111827";
const TEXT_GRAY = "#6B7280";

// ---------- Types ----------
type OnboardingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Onboarding"
>;

interface SlideItem {
  id: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
}

// ---------- Data ----------
const SLIDES: SlideItem[] = [
  {
    id: "1",
    image: Assets.Icons.appIcon,
    title: "",
    description:
      "Welcome to BATO –  Where beauty and health meet",
  },
  {
    id: "2",
    image: Assets.Icons.appIcon,
    title: "Seamless Booking",
    description:
      "At BATO – we aspire to give you the best results through a customized plan made specifically for you.",
  },
  {
    id: "3",
    image: Assets.Icons.appIcon,
    title: "Your Beauty Routine",
    description:
      "Track treatments, view recommendations, and unlock VIP member perks.",
  },
];

// ---------- Component ----------
const OnboardingScreen = ({ navigation }: OnboardingScreenProps) => {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<SlideItem>>(null);

  const isLastSlide = currentIndex === SLIDES.length - 1;

  const handleFinishOnboarding = async () => {
    try {
      // alert("Onboarding completed! Navigating to Login screen.");
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
    } catch (e) {
      console.warn("Failed to save onboarding status", e);
    }
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "Auth",
          state: {
            routes: [{ name: "Login" }],
          },
        },
      ], // changed from 'Home'
    });
  };

  const handleNext = () => {
    if (isLastSlide) {
      handleFinishOnboarding();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    handleFinishOnboarding();
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false },
  );

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }: { item: SlideItem }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {SLIDES.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: dotWidth,
                opacity,
                backgroundColor: theme.colors.primary, // Use theme color for active dot
              },
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
      />

      {renderPagination()}

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleSkip}
          hitSlop={10}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.85}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;

// ---------- Styles ----------
function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    slide: {
      width,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
    },
    imageContainer: {
      width: width * 0.75,
      height: width * 0.75,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 40,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    textContainer: {
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 12,
      textAlign: "center",
    },
    description: {
      fontSize: 15,
      color: theme.colors.textMuted,
      textAlign: "center",
      lineHeight: 22,
      paddingHorizontal: 8,
    },
    paginationContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
    },
    dot: {
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingBottom: 32,
    },
    skipButton: {
      paddingVertical: 12,
      paddingHorizontal: 8,
    },
    skipText: {
      fontSize: 16,
      color: theme.colors.textMuted,
      fontWeight: "500",
    },
    nextButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 40,
    },
    nextButtonText: {
      color: theme.colors.nude,
      fontSize: 16,
      fontWeight: "700",
    },
  });
}
