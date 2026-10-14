import { useMemo, useRef, useState } from "react";
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
import { useAppTheme } from "@/app/providers/ThemeProvider";
import { useAppLanguage } from "@/app/providers/LanguageProvider";
import { Assets } from "assets";
import LottieView from "lottie-react-native";
import { LottieFiles } from "@/utils/LottieFiles";

// import type { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get("window");

const PRIMARY = "#6C63FF";
const TEXT_DARK = "#111827";
const TEXT_GRAY = "#6B7280";

// ---------- Types ----------


interface SlideItem {
  id: string;
  image: any;
  lottie: boolean;
  title: string;
  description: string;
}

// ---------- Data ----------

// ---------- Component ----------
const OnboardingScreen = ({ navigation }: any) => {
  const theme = useAppTheme();
  const { isRTL } = useAppLanguage();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<SlideItem>>(null);

  const SLIDES: SlideItem[] = [
    {
      id: "1",
      image:
        theme.resolvedMode === "dark" ? Assets.TextLogoWhite : Assets.TextLogo,
      lottie: false,
      title: "",
      description: "Welcome to BATO –  Where beauty and health meet",
    },
    {
      id: "2",
      image: LottieFiles.Booking01,
      lottie: true,
      title: "Seamless Booking",
      description:
        "At BATO – we aspire to give you the best results through a customized plan made specifically for you.",
    },
    {
      id: "3",
      image: LottieFiles.Booking02,
      lottie: true,
      title: "Your Beauty Routine",
      description:
        "Track treatments, view recommendations, and unlock VIP member perks.",
    },
  ];
  const isLastSlide = currentIndex === SLIDES.length - 1;

  const handleFinishOnboarding = async () => {
    try {
      // alert("Onboarding completed! Navigating to Login screen.");
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
    } catch (e) {
      console.warn("Failed to save onboarding status", e);
    } finally {
      navigation.replace("Welcome");
    }
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
        {item.lottie ? (
          <LottieView
            source={item.image}
            autoPlay
            loop
            style={styles.animation}
          />
        ) : (
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="contain"
          />
        )}
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
        style={{ direction: "ltr", transform: [{ scaleX: isRTL ? -1 : 1 }] }}
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
function createStyles(theme: ReturnType<typeof useAppTheme>, isRTL: boolean) {
  return StyleSheet.create({
    container: {
      direction: isRTL ? "rtl" : "ltr",
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    slide: {
      direction: isRTL ? "rtl" : "ltr",
      transform: [{ scaleX: isRTL ? -1 : 1 }],
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
      // backgroundColor:"red"
    },
    image: {
      width: "100%",
      height: "100%",
    },
    textContainer: {
      alignItems: "center",
    },
    title: {
      writingDirection: isRTL ? "rtl" : "ltr",
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 12,
      textAlign: "center",
    },
    description: {
      writingDirection: isRTL ? "rtl" : "ltr",
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
      writingDirection: isRTL ? "rtl" : "ltr",
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
      writingDirection: isRTL ? "rtl" : "ltr",
      color: theme.colors.nude,
      fontSize: 16,
      fontWeight: "700",
    },
    animation: {
      width: "100%",
      height: "100%",
    },
  });
}
