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
  "BookingPayment"
>;

type PaymentOption = "online" | "clinic";

export function BookingPaymentScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<NavigationProp>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedPayment, setSelectedPayment] =
    useState<PaymentOption>("clinic");

  return (
    <Screen title="Payment" subtitle="Booking step 3 of 4" showBack>
      <View style={styles.root}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <AppIcon
              name="CreditCard"
              size={34}
              color={theme.colors.primaryDark}
            />
          </View>

          <View style={styles.heroText}>
            <AppText variant="h2">Choose payment method</AppText>

            <AppText color={theme.colors.textMuted}>
              Pay online now or choose pay at clinic. Pay-at-clinic bookings
              require admin approval.
            </AppText>
          </View>
        </View>

        <BookingStepIndicator currentStep="payment" />

        <View style={styles.section}>
          <AppText variant="h3">Payment Options</AppText>

          <PaymentCard
            title="Pay Online"
            subtitle="Pay securely now using card, Apple Pay, or Google Pay later."
            icon="CreditCard"
            selected={selectedPayment === "online"}
            onPress={() => setSelectedPayment("online")}
          />

          <PaymentCard
            title="Pay at Clinic"
            subtitle="Book now and pay when you arrive. Admin approval required."
            icon="Building2"
            selected={selectedPayment === "clinic"}
            onPress={() => setSelectedPayment("clinic")}
          />
        </View>

        <View style={styles.summaryCard}>
          <AppText variant="h3">Booking Summary</AppText>

          <SummaryRow label="Service" value="Hair Growth Treatment" />
          <SummaryRow label="Doctor" value="Dr. Omar Khalid" />
          <SummaryRow label="Branch" value="Main Branch" />
          <SummaryRow label="Date & Time" value="Jun 22 · 06:30 PM" />
          <SummaryRow label="Duration" value="45 Minutes" />

          <View style={styles.totalRow}>
            <AppText variant="bodyMedium">Total</AppText>
            <AppText variant="h3" color={theme.colors.primaryDark}>
              25 KWD
            </AppText>
          </View>
        </View>

        {selectedPayment === "clinic" ? (
          <View style={styles.noticeCard}>
            <AppIcon name="Info" size={22} color={theme.colors.warningText} />

            <View style={styles.noticeText}>
              <AppText variant="bodyMedium">Approval required</AppText>

              <AppText variant="caption" color={theme.colors.textMuted}>
                Your appointment will stay pending until the clinic admin
                approves your pay-at-clinic request.
              </AppText>
            </View>
          </View>
        ) : null}

        <AppButton
          title={
            selectedPayment === "online"
              ? "Continue to Online Payment"
              : "Request Appointment"
          }
          onPress={() => navigation.navigate("AppointmentConfirmation")}
        />
      </View>
    </Screen>
  );
}

function PaymentCard({
  title,
  subtitle,
  icon,
  selected,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: any;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.paymentCard,
        selected && styles.paymentCardActive,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.paymentIcon}>
        <AppIcon name={icon} size={24} color={theme.colors.primaryDark} />
      </View>

      <View style={styles.paymentText}>
        <AppText variant="bodyMedium">{title}</AppText>

        <AppText variant="caption" color={theme.colors.textMuted}>
          {subtitle}
        </AppText>
      </View>

      <View style={selected ? styles.radioActive : styles.radio}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        gap: theme.spacing.md,
      }}
    >
      <AppText variant="caption" color={theme.colors.textMuted}>
        {label}
      </AppText>

      <AppText variant="caption">{value}</AppText>
    </View>
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

    paymentCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    paymentCardActive: {
      borderColor: theme.colors.primaryDark,
      backgroundColor: theme.colors.nude,
    },

    paymentIcon: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
    },

    paymentText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    radio: {
      width: 24,
      height: 24,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    radioActive: {
      width: 24,
      height: 24,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.primaryDark,
      alignItems: "center",
      justifyContent: "center",
    },

    radioDot: {
      width: 12,
      height: 12,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primaryDark,
    },

    summaryCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    totalRow: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
      paddingTop: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    noticeCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.warning,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: "row",
      gap: theme.spacing.md,
    },

    noticeText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.99 }],
    },
  });
}
