import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../../core/navigation/types";
import { Screen } from "../../../shared/ui/templates/Screen";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { useAppLanguage } from "../../../app/providers/LanguageProvider";
import { useAuthStore } from "../store/auth.store";
import { PhoneNumberInput } from "../../../shared/ui/atoms/PhoneNumberInput";
import { LanguageSelector } from "@/shared/ui/molecules/LanguageSelector";
import { useTranslation } from "react-i18next";
import { Assets } from "assets";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

type LoginMethod = "mobile" | "file";

const SWITCH_PADDING = 4;
const SWITCH_GAP = 4;
const TAB_HEIGHT = 44;

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.9 };

// Gulf-region defaults for the country code picker — extend as needed.
const COUNTRY_CODES = [
  { flag: "🇰🇼", name: "Kuwait", dialCode: "+965" },
  { flag: "🇸🇦", name: "Saudi Arabia", dialCode: "+966" },
  { flag: "🇦🇪", name: "UAE", dialCode: "+971" },
  { flag: "🇧🇭", name: "Bahrain", dialCode: "+973" },
  { flag: "🇶🇦", name: "Qatar", dialCode: "+974" },
  { flag: "🇴🇲", name: "Oman", dialCode: "+968" },
];

export function LoginScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const { isRTL } = useAppLanguage();
  const { t } = useTranslation();
  const sendOtp = useAuthStore((state) => state.sendOtp);
  const isLoading = useAuthStore((state) => state.isLoading);
  const clearError = useAuthStore((state) => state.clearError);

  const [loginMethod, setLoginMethod] = useState<LoginMethod>("mobile");
  const [mobileNumber, setMobileNumber] = useState<number>();
  const [fileNumber, setFileNumber] = useState("");
  const [civilId, setCivilId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("65910095");

  const [countryCode, setCountryCode] = useState<any>("KW");
  const [callingCode, setCallingCode] = useState("965");

  // Each phone field gets its own calling code, in case the mobile login
  // number and the WhatsApp OTP number end up belonging to different
  // countries. Both default to Kuwait.
  const [mobileCallingCode, setMobileCallingCode] = useState("+965");
  const [whatsappCallingCode, setWhatsappCallingCode] = useState("+965");

  const isMobileLogin = loginMethod === "mobile";

  // --- Sliding pill indicator -----------------------------------------

  // Width of a single tab, derived from the measured track width. Kept in
  // state (not a shared value) since it only changes on rotation/resize,
  // not on every render.
  const [tabWidth, setTabWidth] = useState(0);

  // 0 -> "mobile" selected, 1 -> "file" selected. Reanimated drives this on
  // the UI thread, so the pill stays smooth even while JS is busy.
  const selectedIndex = useSharedValue(0);

  useEffect(() => {
    selectedIndex.value = withSpring(isMobileLogin ? 0 : 1, SPRING_CONFIG);
  }, [isMobileLogin, selectedIndex]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: selectedIndex.value * (tabWidth + SWITCH_GAP) }],
  }));

  const handleSwitchLayout = (event: LayoutChangeEvent) => {
    const trackWidth = event.nativeEvent.layout.width;
    setTabWidth((trackWidth - SWITCH_PADDING * 2 - SWITCH_GAP) / 2);
  };

  const handleMethodChange = (method: LoginMethod) => {
    if (method === loginMethod) return;
    setLoginMethod(method);
  };

  const handleSendOtp = async () => {
    // Keep the OTP navigation in one place so both login methods
    // follow the same verification flow.
    const payload = {
      login_method: loginMethod,
      mobile_number: phoneNumber,
    };

    try {
      clearError();

      if (!phoneNumber.trim()) {
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

    // navigation.navigate("OtpVerification");
  };

  // const [lang, setLang] = useState<Language>("en");

  // const handleLanguageChange = (selectedLang: Language) => {
  //   setLang(selectedLang);
  //   // Add logic here to change i18n locale or react-native-localize
  // };
  return (
    <Screen
      title="LOGIN"
      footer={
        <AppButton
          title={isLoading ? t("auth.submitting") : t("auth.submit")}
          loading={isLoading}
          disabled={isLoading}
          onPress={handleSendOtp}
        />
      }
    >
      <View
        style={{ direction: isRTL ? "rtl" : "ltr", alignItems: "flex-end" }}
      >
        {/* <LanguageToggle value={lang} onChange={handleLanguageChange} /> */}
        <LanguageSelector />
      </View>
      <ScrollView
        nestedScrollEnabled={true}
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: theme.spacing["4xl"],
          }}
        >
          <Image
            source={Assets.Logo1024}
            style={{ width: "100%", height: 150 }}
            resizeMode="contain"
          />
        </View>

        {/* Animates the card's height smoothly whenever its content changes size. */}
        <View style={{ gap: theme.spacing.md }}>
          <View style={{ gap: theme.spacing.md }}>
            <PhoneNumberInput
              label={t("auth.phone")}
              placeholder={t("auth.enterPhone")}
              value={phoneNumber}
              onChangeText={(v: string) => {
                setPhoneNumber(v);
              }}
              keyboardType="phone-pad"
              // maxLength={5}
              countryCode={countryCode}
              callingCode={callingCode}
              onSelect={(country) => {
                setCountryCode(country.cca2);
                setCallingCode(country.callingCode[0]);
              }}
            />

            <AppText variant="small" color={theme.colors.textMuted} 
            // align="right"
            >
              {t("auth.phoneDescription")}
            </AppText>

            {/* Login with File Number */}
            <Pressable
              onPress={() => navigation.navigate("LoginViaFile")}
              style={{ marginTop: theme.spacing.md }}
            >
              <AppText variant="bodyMedium" color={theme.colors.primaryDark}>
                {t("auth.loginViaFile")}
              </AppText>
            </Pressable>
            {/* Forgot or Reset Password */}

            <Pressable
              onPress={() => navigation.navigate("ForgotPassword")}
              style={{ marginTop: theme.spacing.md }}
            >
              <AppText variant="bodyMedium" color={theme.colors.primaryDark}>
                {t("auth.forgotOrResetPassword")}
              </AppText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
