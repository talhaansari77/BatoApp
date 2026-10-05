import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ImageResizeMode,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";

import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { AppText } from "@/shared/ui/atoms/AppText";
import { AppIcon } from "@/shared/ui/atoms/AppIcon";
import Assets from "@/assets";
import { HeartPlus } from "lucide-react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";

/**
 * DoctorCard – reusable doctor summary card with a rating badge, favourite
 * button, price and a week availability strip.
 *
 * Usage:
 *   <DoctorCard
 *     specialty="Heart Expert"
 *     name="Dr. Willam James"
 *     price="$130"
 *     priceLabel="Per Session"
 *     rating={4.9}
 *     imageSource={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
 *     month="December"
 *     days={[
 *       { date: 6, weekday: 'S' },
 *       { date: 7, weekday: 'M', available: true },
 *       { date: 8, weekday: 'T' },
 *       { date: 9, weekday: 'W' },
 *       { date: 10, weekday: 'T', available: true },
 *       { date: 11, weekday: 'F', available: true },
 *       { date: 12, weekday: 'S' },
 *     ]}
 *     isFavorite={false}
 *     onFavoritePress={() => {}}
 *   />
 *
 * Tip: a transparent PNG (cut-out doctor) gives the exact look from the design.
 * Use imageResizeMode="contain" for cut-outs and "cover" for regular photos.
 */

export type AvailabilityDay = {
  date: number;
  weekday: string;
  available?: boolean;
};

export type DoctorCardProps = {
  name: string;
  specialty: string;
  price: string;
  priceLabel?: string;
  rating?: number;
  imageSource?: ImageSourcePropType;
  imageResizeMode?: ImageResizeMode;

  isFavorite?: boolean;
  onFavoritePress?: () => void;

  month?: string;
  onPrevMonthPress?: () => void;
  onNextMonthPress?: () => void;

  days?: AvailabilityDay[];
  selectedDate?: number;
  onDayPress?: (day: AvailabilityDay) => void;

  onPress?: () => void;

  /** Card background tint. Defaults to the soft mint from the design. */
  tintColor?: string;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_TINT = "#CDE3DB";
const INK = "#14201D";
const INK_MUTED = "#5E716B";
const ACCENT = "#1F3A35";
const STAR = "#F5B301";
const HEART_ACTIVE = "#E5484D";

export function DoctorCard({
  name,
  specialty,
  price,
  priceLabel = "Per Session",
  rating,
  imageSource,
  imageResizeMode = "cover",
  isFavorite = false,
  onFavoritePress,
  month,
  onPrevMonthPress,
  onNextMonthPress,
  days = [],
  selectedDate,
  onDayPress,
  onPress,
  tintColor = DEFAULT_TINT,
  style,
}: DoctorCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${name}, ${specialty}, ${price} ${priceLabel}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.colors.nude },
        pressed && styles.pressed,
        style,
      ]}
    >
      {/* Doctor photo (sits behind the availability panel) */}
      {imageSource ? (
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode={imageResizeMode}
          accessibilityIgnoresInvertColors
        />
      ) : null}

      {/* Rating badge */}
      {rating !== undefined ? (
        <View style={styles.ratingBadge}>
          <FontAwesomeIcon
            icon={faStar}
            color={theme.colors.yellow}
            size={20}
          />
          <AppText variant="caption" color={theme.colors.background}>
            {rating.toFixed(1)}
          </AppText>
          <View style={styles.ratingStar}>
            {/* <AppIcon name="Star" size={12} color={theme.colors.background} /> */}
          </View>
        </View>
      ) : null}

      {/* Favourite */}
      <Pressable
        onPress={onFavoritePress}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={
          isFavorite ? "Remove from favourites" : "Add to favourites"
        }
        accessibilityState={{ selected: isFavorite }}
        style={[styles.favorite, isFavorite && styles.favoriteActive]}
      >
        <FontAwesomeIcon
          icon={faHeart}
          color={isFavorite ? HEART_ACTIVE : theme.colors.background}
          size={25}
        />
      </Pressable>

      {/* Info */}
      <View style={styles.info}>
        <AppText variant="caption" color={INK_MUTED}>
          {specialty}
        </AppText>

        <AppText variant="h2" color={INK} style={styles.name} numberOfLines={3}>
          {name}
        </AppText>

        <View style={styles.priceBlock}>
          <AppText variant="h2" color={INK} style={styles.price}>
            {price}
          </AppText>
          <AppText variant="caption" color={INK_MUTED}>
            {priceLabel}
          </AppText>
        </View>
      </View>

      {/* Availability */}
      {days.length > 0 ? (
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <AppText variant="bodyMedium" color="#FFFFFF" style={styles.bold}>
              Availability
            </AppText>

            {month ? (
              <View style={styles.monthSwitcher}>
                <Pressable
                  onPress={onPrevMonthPress}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel="Previous month"
                >
                  <AppIcon name="ChevronLeft" size={18} color="#FFFFFF" />
                </Pressable>

                <AppText variant="caption" color="#FFFFFF">
                  {month}
                </AppText>

                <Pressable
                  onPress={onNextMonthPress}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel="Next month"
                >
                  <AppIcon name="ChevronRight" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
            ) : null}
          </View>

          <View style={styles.daysRow}>
            {days.map((day) => {
              const selected = selectedDate === day.date;

              return (
                <View key={`${day.date}-${day.weekday}`} style={styles.dayItem}>
                  <Pressable
                    onPress={() => onDayPress?.(day)}
                    disabled={!day.available}
                    accessibilityRole="button"
                    accessibilityState={{
                      disabled: !day.available,
                      selected,
                    }}
                    accessibilityLabel={`${day.date}, ${
                      day.available ? "available" : "unavailable"
                    }`}
                    style={[
                      styles.dayCircle,
                      day.available && styles.dayCircleAvailable,
                      selected && styles.dayCircleSelected,
                    ]}
                  >
                    <AppText
                      variant="bodyMedium"
                      color={
                        selected ? "#FFFFFF" : day.available ? INK : "#FFFFFF"
                      }
                      style={day.available ? styles.bold : undefined}
                    >
                      {day.date}
                    </AppText>
                  </Pressable>

                  <AppText variant="small" color="#FFFFFF">
                    {day.weekday}
                  </AppText>
                </View>
              );
            })}
          </View>
        </View>
      ) : null}
    </Pressable>
  );
}

// Mock Days Data
const MOCK_DAYS = [
  { date: "2026-10-12", dayName: "Mon", dayNumber: 12, isAvailable: true },
  { date: "2026-10-13", dayName: "Tue", dayNumber: 13, isAvailable: true },
  { date: "2026-10-14", dayName: "Wed", dayNumber: 14, isAvailable: false },
  { date: "2026-10-15", dayName: "Thu", dayNumber: 15, isAvailable: true },
  { date: "2026-10-16", dayName: "Fri", dayNumber: 16, isAvailable: true },
];

export function DoctorCardExample() {
  const [isFav, setIsFav] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026-10-12");
  const [selected, setSelected] = useState<number | undefined>(undefined);

  return (
    <DoctorCard
      specialty="Heart Expert"
      name="Dr. Talha Asre"
      price="30 KWD"
      priceLabel="Per Session"
      rating={4.9}
      imageSource={{ uri: Assets.Images.DoctorPicOnline }}
      isFavorite={isFav}
      onFavoritePress={() => setIsFav((v) => !v)}
      month="December"
      days={[
        { date: 6, weekday: "S" },
        { date: 7, weekday: "M", available: true },
        { date: 8, weekday: "T" },
        { date: 9, weekday: "W" },
        { date: 10, weekday: "T", available: true },
        { date: 11, weekday: "F", available: true },
        { date: 12, weekday: "S" },
      ]}
      selectedDate={selected}
      onDayPress={(d) => setSelected(d.date)}
    />
  );
}
// const { width } = Dimensions.get("window");
function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    card: {
      minHeight: 360,
      borderRadius: 32,
      overflow: "hidden",
      justifyContent: "space-between",
    },

    pressed: {
      opacity: 0.94,
    },

    bold: {
      fontWeight: "700",
    },

    image: {
      position: "absolute",
      right: 0,
      bottom: 0,
      width: "58%",
      height: "82%",
    },

    ratingBadge: {
      position: "absolute",
      top: theme.spacing.lg,
      left: theme.spacing.lg,
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.colors.overlay,

      alignItems: "center",
      justifyContent: "center",
    },

    ratingStar: {
      position: "absolute",
      top: 8,
      right: 8,
    },

    favorite: {
      position: "absolute",
      top: theme.spacing.lg,
      right: theme.spacing.lg,
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.colors.overlay,
      alignItems: "center",
      justifyContent: "center",
    },

    favoriteActive: {
      backgroundColor: theme.colors.background,
    },

    info: {
      paddingTop: 88,
      paddingHorizontal: theme.spacing.xl,
      width: "58%",
      gap: theme.spacing.sm,
    },

    name: {
      fontWeight: "700",
    },

    priceBlock: {
      marginTop: theme.spacing.md,
      gap: 2,
    },

    price: {
      fontSize: 28,
      fontWeight: "700",
    },

    panel: {
      marginHorizontal: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      marginTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      borderRadius: 28,
      backgroundColor: theme.colors.overlay,
      borderWidth: 1,
      borderColor: theme.colors.overlay_1,
      gap: theme.spacing.md,
    },

    panelHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    monthSwitcher: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    daysRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    dayItem: {
      alignItems: "center",
      gap: theme.spacing.xs,
    },

    dayCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.overlay_1,
      alignItems: "center",
      justifyContent: "center",
    },

    dayCircleAvailable: {
      backgroundColor: theme.colors.background,
    },

    dayCircleSelected: {
      backgroundColor: theme.colors.primary,
    },
  });
}
