import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { AuthStackParamList } from "../../../core/navigation/types";
import { Screen } from "../../../shared/ui/templates/Screens/Screen";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { PhoneNumberInput } from "../../../shared/ui/atoms/PhoneNumberInput";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { useAppLanguage } from "../../../app/providers/LanguageProvider";
import { useAuthStore } from "../store/auth.store";
import { LanguageSelector } from "@/shared/ui/molecules/LanguageSelector";
import { AppIcon } from "@/shared/ui/atoms/AppIcon";
import { AppInput } from "@/shared/ui/atoms/AppInput";
import CountryPickerField from "@/shared/ui/atoms/CountryPickerField";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

const SERIF = Platform.select({
  ios: "serif",//Georgia
  android: "serif",
  default: "serif",
});

export function LoginScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const { isRTL } = useAppLanguage();
  const { t } = useTranslation();
  const isDark = theme.resolvedMode === "dark";

  const sendOtp = useAuthStore((state) => state.sendOtp);
  const isLoading = useAuthStore((state) => state.isLoading);
  const clearError = useAuthStore((state) => state.clearError);

  const [phoneNumber, setPhoneNumber] = useState("65910095");
  const [countryCode, setCountryCode] = useState<any>("KW");
  const [callingCode, setCallingCode] = useState("965");

  const canSubmit = phoneNumber.trim().length > 0;

  // Warm, editorial palette from the new design.
  const palette = {
    ink: isDark ? "#F3EFE8" : "#2B2723",
    surface: isDark ? "#2A2622" : "#ECE8E1",
    border: isDark ? "#3C3731" : "#DAD4CB",
    note: isDark ? "#2A2622" : "#EFEBE4",
  };

  const handleSendOtp = async () => {
    // Keep the OTP navigation in one place so both login methods
    // follow the same verification flow.
    const payload = {
      login_method: "mobile",
      mobile_number: callingCode+phoneNumber,
    };

    try {
      clearError();

      if (!canSubmit) {
        Alert.alert("Missing fields", "Please enter phoneNumber.");
        return;
      }

      const response = await sendOtp(payload);
      console.log("OTP response:", response);

      navigation.navigate("OtpVerification");
    } catch {
      Alert.alert(
        "Login failed",
        "Please check your Phone Number and try again.",
      );
    }
  };
  useEffect(()=>{
    // setcan
  })

  return (
    <Screen ShowAppHeader>
      <ScrollView
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        {/* Icon badge */}
        <View
          style={[
            styles.badge,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}
        >
          <AppIcon name="Phone" />
        </View>

        {/* Heading */}
        <AppText
          style={[styles.title, { color: palette.ink, fontFamily: SERIF }]}
          variant="h3"
          align="center"
        >
          {t("auth.connectTitle", {
            defaultValue: "Connect your BATO profile",
          })}
        </AppText>
        <AppText
          variant="small"
          color={theme.colors.textMuted}
          style={styles.subtitle}
          align="center"
        >
          {t("auth.connectSubtitle", {
            defaultValue:
              "Add your WhatsApp number so we can connect your appointment, BATO Profile, and care journey.",
          })}
        </AppText>

        {/* Phone field */}
        <View style={{ alignSelf: "stretch", gap: theme.spacing.sm }}>
          <AppText variant="small" color={theme.colors.textMuted}>
            Country code
          </AppText>

          <CountryPickerField
            countryCode={countryCode}
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCallingCode(country.callingCode[0]);
            }}
          />
          <AppText variant="small" color={theme.colors.textMuted}>
            WhatsApp number
          </AppText>
          <AppInput
            placeholder="e.g. 50 123 4567"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
          />

          <AppText variant="caption" color={theme.colors.textMuted}>
            Enter the number you use on WhatsApp — without the country code.
          </AppText>
        </View>

        {/* Primary action */}
        <View style={styles.action}>
          <AppButton
            title={
              isLoading
                ? t("auth.submitting")
                : t("auth.connectMyProfile", {
                    defaultValue: "Connect My Profile",
                  })
            }
            loading={isLoading}
            disabled={isLoading || !canSubmit}
            onPress={handleSendOtp}
          />
        </View>

        {/* Secondary links */}
        <Pressable
          onPress={() => navigation.navigate("ProfileConfirmation")}
          hitSlop={8}
          style={styles.link}
        >
          <AppText variant="small" color={palette.ink} style={styles.linkText}>
            I don't have an appointment — skip this step
          </AppText>
        </Pressable>

        {/* Privacy note */}
        <View
          style={[
            styles.note,
            { backgroundColor: palette.note, borderColor: palette.border },
          ]}
        >
          <AppText variant="small">🔒</AppText>
          <AppText
            variant="small"
            color={theme.colors.textMuted}
            style={{ flex: 1 }}
          >
            {t("auth.privacyNote", {
              defaultValue:
                "Your phone number is only used to connect your BATO appointment and profile. It is never shared.",
            })}
          </AppText>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 32,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    lineHeight: 36,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  action: {
    alignSelf: "stretch",
    marginTop: 20,
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    textDecorationLine: "underline",
    textAlign: "center",
  },
  note: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 28,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
});
