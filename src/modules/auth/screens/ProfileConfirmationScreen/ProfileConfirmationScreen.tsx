import { useAppTheme } from "@/app/providers/ThemeProvider";
import { AppIcon } from "@/shared/ui/atoms/AppIcon";
import { AppText } from "@/shared/ui/atoms/AppText";
import { AppHeader } from "@/shared/ui/molecules/AppHeader";
import { ProfileHeader } from "@/shared/ui/molecules/ProfileHeader";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ConfirmationStep = "confirming" | "explorer_prompt";

type ProfileConfirmationScreenProps = {
  initialStep?: ConfirmationStep;
  onMessageCustomerService?: () => void;
  onAddWhatsApp?: () => void;
  onContinueAsExplorer?: () => void;
  onContinueWithoutConnecting?: () => void;
};

export function ProfileConfirmationScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<ConfirmationStep>("confirming");
  const navigation = useNavigation<any>();

  const onAddWhatsApp = () => navigation.navigate("Login");
  const onContinueAsExplorer = () => navigation.navigate("Login");
  const onContinueWithoutConnecting = () => navigation.navigate("Login");
  const onMessageCustomerService = () =>
    navigation.navigate("PatientApp", { screen: "Chat" });

  // Content config based on current state
  const isConfirming = step === "confirming";

  const title = isConfirming
    ? "We're confirming your profile"
    : "Continue as Explorer?";

  const description = isConfirming
    ? "Your BATO account is ready. Customer service can help connect your appointment details if you already booked."
    : "If you've booked an appointment with BATO, adding your WhatsApp number helps us connect your profile, care journey, and results.";

  const cardText = isConfirming
    ? "We've saved your details. A member of the BATO team will confirm your profile connection shortly."
    : "You can always connect your profile later from your account settings.";

  const handleBackPress = () => {
    if (!isConfirming) {
      setStep("confirming");
    }
  };

  const handleSecondaryAction = () => {
    if (isConfirming) {
      setStep("explorer_prompt");
      onContinueAsExplorer?.();
    } else {
      onContinueWithoutConnecting?.();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background || "#F2EFE9" },
      ]}
    >
      {/* Top Main Navigation Header */}
      <AppHeader />

      {/* Sub Header with Back Action when in Explorer Mode */}
      <ProfileHeader
        title="BATO Clinic"
        subtitle="Profile Setup"
        showBack={!isConfirming}
        onBackPress={handleBackPress}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Globe / Earth Central Icon Badge */}
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, { backgroundColor: "#E8E4DC" }]}>
            <AppIcon
              name="Globe"
              size={28}
              color={theme.colors.primaryDark || "#322C24"}
            />
          </View>
        </View>

        {/* Main Title & Description */}
        <AppText variant="h1" align="center" style={styles.headingTitle}>
          {title}
        </AppText>

        <AppText
          variant="body"
          align="center"
          color={theme.colors.textMuted || "#666157"}
          style={styles.description}
        >
          {description}
        </AppText>

        {/* Info Card Box */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: "#EAE6DF", borderColor: "#DDD9D0" },
          ]}
        >
          <AppText
            variant="small"
            align="center"
            color={theme.colors.textMuted || "#666157"}
            style={styles.infoCardText}
          >
            {cardText}
          </AppText>
        </View>

        {/* Main CTA Button */}
        <Pressable
          onPress={isConfirming ? onMessageCustomerService : onAddWhatsApp}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: theme.colors.button },
            pressed && styles.pressed,
          ]}
        >
          <AppIcon
            name={isConfirming ? "MessageSquare" : "Phone"}
            size={20}
            color="#FFFFFF"
          />
          <AppText
            variant="body"
            color="#FFFFFF"
            style={styles.primaryButtonText}
          >
            {isConfirming
              ? "Message Customer service"
              : "Add My WhatsApp Number"}
          </AppText>
        </Pressable>

        {/* Secondary Text Link */}
        <Pressable
          onPress={handleSecondaryAction}
          style={styles.secondaryButton}
        >
          <AppText
            variant="caption"
            color={theme.colors.textMuted || "#666157"}
            align="center"
            style={styles.secondaryText}
          >
            {isConfirming
              ? "Continue as Explorer"
              : "No, continue without connecting"}
          </AppText>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    alignItems: "center",
    paddingTop: 36,
  },
  badgeContainer: {
    marginBottom: 20,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headingTitle: {
    fontSize: 28,
    fontWeight: "400",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  infoCard: {
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  infoCardText: {
    fontSize: 13,
    lineHeight: 18,
  },
  primaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.85,
  },
});
