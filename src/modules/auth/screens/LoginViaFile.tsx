import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useState } from "react";
import { Phone, Lock } from "lucide-react-native";
import { AppInput } from "../../../shared/ui/atoms/AppInput";
import { PhoneNumberInput } from "../../../shared/ui/atoms/PhoneNumberInput";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { useAppLanguage } from "../../../app/providers/LanguageProvider";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { Screen } from "../../../shared/ui/templates/Screens/Screen";
import { useAuthStore } from "../store/auth.store";
import { AuthStackParamList } from "../../../core/navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

type Props = NativeStackScreenProps<AuthStackParamList, "LoginViaFile">;

const SERIF = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

const LoginViaFile = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const { isRTL } = useAppLanguage();
  const isDark = theme.resolvedMode === "dark";

  const [fileNumber, setFileNumber] = useState("");
  const [civilId, setCivilId] = useState("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [countryCode, setCountryCode] = useState<any>("KW");
  const [callingCode, setCallingCode] = useState("965");
  const loginViaFile = useAuthStore((state) => state.loginViaFile);
  const isLoading = useAuthStore((state) => state.isLoading);

  const canSubmit =
    fileNumber.trim().length > 0 &&
    civilId.trim().length > 0 &&
    mobileNumber.trim().length > 0;

  // Palette for the new warm, editorial look.
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
      login_method: "file",
      file_number: fileNumber,
      civil_id: civilId,
      any_mobile: `+${callingCode + mobileNumber}`,
    };

    try {
      const response = await loginViaFile(payload);
      console.log("OTP response:", response);

      navigation.navigate("OtpVerification", { handleSendOtp: handleSendOtp });
    } catch {
      Alert.alert(
        "Login failed",
        "Please check your Phone Number and try again.",
      );
    }
  };

  return (
    <Screen>
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
          <Phone size={26} color={palette.ink} />
        </View>

        {/* Heading */}
        <AppText
          style={[styles.title, { color: palette.ink, fontFamily: SERIF }]}
        >
          {t("auth.loginViaFileTitle", {
            defaultValue: "Connect your profile",
          })}
        </AppText>
        <AppText
          variant="small"
          color={theme.colors.textMuted}
          style={styles.subtitle}
        >
          {t("auth.loginViaFileSubtitle", {
            defaultValue:
              "Enter your file number, civil ID and mobile number so we can verify it's you.",
          })}
        </AppText>

        {/* Form */}
        <View style={{ gap: theme.spacing.md, alignSelf: "stretch" }}>
          <AppInput
            label={t("auth.fileNumber")}
            placeholder={t("auth.enterFileNumber")}
            leftIcon="FileText"
            autoCapitalize="characters"
            onChangeText={setFileNumber}
            value={fileNumber}
          />

          <AppInput
            label={t("auth.civilId")}
            placeholder={t("auth.enterCivilId")}
            leftIcon="CreditCard"
            keyboardType="number-pad"
            onChangeText={setCivilId}
            value={civilId}
          />

          <PhoneNumberInput
            label={t("auth.phone")}
            placeholder={t("auth.enterPhone")}
            value={mobileNumber}
            onChangeText={(v: string) => {
              setMobileNumber(v);
            }}
            keyboardType="phone-pad"
            countryCode={countryCode}
            callingCode={callingCode}
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCallingCode(country.callingCode[0]);
            }}
          />

          <AppText variant="small" color={theme.colors.textMuted}>
            {t("auth.phoneDescription")}
          </AppText>
        </View>

        {/* Primary action */}
        <View style={styles.action}>
          <AppButton
            title={isLoading ? t("auth.submitting") : t("auth.submit")}
            loading={isLoading}
            disabled={isLoading || !canSubmit}
            onPress={handleSendOtp}
          />
        </View>

        {/* Secondary links */}
        <Pressable
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }}
          hitSlop={8}
          style={styles.link}
        >
          <AppText
            variant="small"
            color={palette.ink}
            style={styles.linkText}
          >
            {t("auth.loginViaFile")}
          </AppText>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("ForgotPassword")}
          hitSlop={8}
          style={styles.link}
        >
          <AppText
            variant="small"
            color={palette.ink}
            style={styles.linkText}
          >
            {t("auth.forgotOrResetPassword")}
          </AppText>
        </Pressable>

        {/* Privacy note */}
        <View
          style={[
            styles.note,
            { backgroundColor: palette.note, borderColor: palette.border },
          ]}
        >
          <Lock size={14} color={theme.colors.textMuted} />
          <AppText
            variant="small"
            color={theme.colors.textMuted}
            style={{ flex: 1 }}
          >
            {t("auth.privacyNote", {
              defaultValue:
                "Your phone number is only used to verify your login. It is never shared.",
            })}
          </AppText>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default LoginViaFile;

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
    fontSize: 30,
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