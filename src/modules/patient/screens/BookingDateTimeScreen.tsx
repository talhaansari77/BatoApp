import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { PatientStackParamList } from "../../../core/navigation/navigation.types";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { AppIcon } from "../../../shared/ui/atoms/AppIcon";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { Screen } from "../../../shared/ui/templates/Screen";
import { BookingStepIndicator } from "../components";

type NavigationProp = NativeStackNavigationProp<
  PatientStackParamList,
  "BookingDateTime"
>;

const dates = [
  { id: "today", day: "Today", date: "21", month: "Jun" },
  { id: "tomorrow", day: "Tomorrow", date: "22", month: "Jun" },
  { id: "jun23", day: "Tue", date: "23", month: "Jun" },
  { id: "jun24", day: "Wed", date: "24", month: "Jun" },
];

const timeSlots = [
  "10:00 AM",
  "11:30 AM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM",
  "06:30 PM",
  "07:30 PM",
];

export function BookingDateTimeScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedDate, setSelectedDate] = useState(dates[1].id);
  const [selectedTime, setSelectedTime] = useState("06:30 PM");

  return (
    <Screen title="Date & Time" subtitle="Booking step 2 of 4" showBack>
      <View style={styles.root}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <AppIcon
              name="CalendarClock"
              size={34}
              color={theme.colors.primaryDark}
            />
          </View>

          <View style={styles.heroText}>
            <AppText variant="h2">Choose appointment slot</AppText>

            <AppText color={theme.colors.textMuted}>
              Select a date and time that works best for your treatment visit.
            </AppText>
          </View>
        </View>

        <BookingStepIndicator currentStep="time" />

        <View style={styles.section}>
          <AppText variant="h3">Select Date</AppText>

          <View style={styles.dateRow}>
            {dates.map((item) => {
              const selected = selectedDate === item.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => setSelectedDate(item.id)}
                  style={({ pressed }) => [
                    styles.dateCard,
                    selected && styles.dateCardActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppText
                    variant="small"
                    color={
                      selected
                        ? theme.colors.primaryDark
                        : theme.colors.textMuted
                    }
                  >
                    {item.day}
                  </AppText>

                  <AppText variant="h3">{item.date}</AppText>

                  <AppText
                    variant="small"
                    color={
                      selected
                        ? theme.colors.primaryDark
                        : theme.colors.textMuted
                    }
                  >
                    {item.month}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="h3">Available Time Slots</AppText>

          <View style={styles.timeGrid}>
            {timeSlots.map((slot) => {
              const selected = selectedTime === slot;

              return (
                <Pressable
                  key={slot}
                  onPress={() => setSelectedTime(slot)}
                  style={({ pressed }) => [
                    styles.timeChip,
                    selected && styles.timeChipActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppIcon
                    name="Clock"
                    size={16}
                    color={
                      selected
                        ? theme.colors.primaryDark
                        : theme.colors.textMuted
                    }
                  />

                  <AppText
                    variant="caption"
                    color={
                      selected
                        ? theme.colors.primaryDark
                        : theme.colors.textMuted
                    }
                    style={selected ? styles.selectedText : undefined}
                  >
                    {slot}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <AppIcon
              name="CalendarCheck"
              size={24}
              color={theme.colors.primaryDark}
            />
          </View>

          <View style={styles.summaryText}>
            <AppText variant="bodyMedium">Selected appointment</AppText>

            <AppText variant="caption" color={theme.colors.textMuted}>
              Main Branch · Dr. Omar Khalid
            </AppText>

            <AppText variant="caption" color={theme.colors.primaryDark}>
              Jun 22 · {selectedTime}
            </AppText>
          </View>
        </View>

        <AppButton
          title="Continue to Payment"
          onPress={() => navigation.navigate("BookingPayment")}
        />
      </View>
    </Screen>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing.xl,
    },

    heroCard: {
      borderRadius: theme.radius["2xl"],
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.xl,
      flexDirection: "row",
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    heroIcon: {
      width: 70,
      height: 70,
      borderRadius: theme.radius["2xl"],
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
    },

    heroText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    section: {
      gap: theme.spacing.md,
    },

    dateRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },

    dateCard: {
      flex: 1,
      minHeight: 100,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
      ...(theme.shadows.card ?? {}),
    },

    dateCardActive: {
      borderColor: theme.colors.primaryDark,
      backgroundColor: theme.colors.nude,
    },

    timeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },

    timeChip: {
      width: "48%",
      minHeight: 46,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
    },

    timeChipActive: {
      borderColor: theme.colors.primaryDark,
      backgroundColor: theme.colors.nude,
    },

    selectedText: {
      fontWeight: "700",
    },

    summaryCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.info,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    summaryIcon: {
      width: 50,
      height: 50,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      alignItems: "center",
      justifyContent: "center",
    },

    summaryText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.99 }],
    },
  });
}
