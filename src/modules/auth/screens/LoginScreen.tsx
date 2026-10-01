import React, { useEffect, useState } from "react";
import {
  Alert,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
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
import { Host, Picker } from "@expo/ui";

import { AuthStackParamList } from "../../../core/navigation/navigation.types";
import { Screen } from "../../../shared/ui/templates/Screen";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { AppInput } from "../../../shared/ui/atoms/AppInput";
import { AuthCard } from "../../../shared/ui/molecules/AuthCard";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { authApi } from "../services/authApi";
import { useAuthStore } from "../store/auth.store";
import CountryPickerField from "../../../shared/ui/atoms/CountryPickerField";

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

  const sendOtp = useAuthStore((state) => state.sendOtp);
  const isLoading = useAuthStore((state) => state.isLoading);
  const clearError = useAuthStore((state) => state.clearError);

  const [loginMethod, setLoginMethod] = useState<LoginMethod>("mobile");
  const [mobileNumber, setMobileNumber] = useState<number>();
  const [fileNumber, setFileNumber] = useState("");
  const [civilId, setCivilId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("66213403");
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
    const LoginPayload = {
      login_method: loginMethod,
      mobile_number: phoneNumber,
    };

    try {
      clearError();

      if (!phoneNumber.trim()) {
        Alert.alert("Missing fields", "Please enter phoneNumber.");
        return;
      }

      const response = await sendOtp({
        login_method: loginMethod,
        mobile_number: phoneNumber,
      });
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

  return (
    <Screen
      title="LOGIN"
      footer={
        <AppButton
          title={isLoading ? "Sending Otp" : "Send Otp"}
          loading={isLoading}
          disabled={isLoading}
          onPress={handleSendOtp}
        />
      }
    >
      <AuthCard
        title="Welcome back"
        subtitle={
          isMobileLogin
            ? "Enter your registered number to securely access your medical reports."
            : "Enter your file details and registered WhatsApp number to access your medical reports."
        }
      >
        <View style={{flex:1,flexDirection:'row'}}>
          <View>
            
          <CountryPickerField
            countryCode={countryCode}
            callingCode={callingCode}
            label="Country"
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCallingCode(country.callingCode[0]);
            }}
          />

          </View>
          <View style={{flex:1}}>

          </View>
        </View>
        {/* Animates the card's height smoothly whenever its content changes size. */}
        <Animated.View
          layout={LinearTransition.springify().damping(18).stiffness(180)}
          style={{ gap: theme.spacing.md }}
        >
          {/* Each method's fields is a distinct keyed element, so Reanimated
              treats a method switch as an unmount/mount and animates the
              enter/exit automatically — no manual fade sequencing needed. */}
          {isMobileLogin ? (
            <Animated.View
              key="mobile-fields"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(120)}
              style={{ gap: theme.spacing.md }}
            >
              <PhoneNumberField
                label="Registered Number"
                leftIcon="Phone"
                callingCode={mobileCallingCode}
                onCallingCodeChange={setMobileCallingCode}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />

              <AppText variant="small" color={theme.colors.textMuted}>
                We'll send the OTP to this number via WhatsApp.
              </AppText>

              {/* Login with File Number */}
              <Pressable
                onPress={() => handleMethodChange("file")}
                style={{ marginTop: theme.spacing.md }}
              >
                <AppText
                  variant="bodyMedium"
                  color={theme.colors.primaryDark}
                  align="right"
                >
                  Login via File Number
                </AppText>
              </Pressable>
              {/* Forgot or Reset Password */}
              <Pressable
                onPress={() => navigation.navigate("ForgotPassword")}
                style={{ marginTop: theme.spacing.md }}
              >
                <AppText
                  variant="bodyMedium"
                  color={theme.colors.primaryDark}
                  align="right"
                >
                  Forgot or Reset Password
                </AppText>
              </Pressable>
            </Animated.View>
          ) : (
            <Animated.View
              key="file-fields"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(120)}
              style={{ gap: theme.spacing.md }}
            >
              <AppInput
                label="File Number"
                placeholder="Enter File Number"
                leftIcon="FileText"
                autoCapitalize="characters"
                onChangeText={setFileNumber}
                value={fileNumber}
              />

              <AppInput
                label="Civil ID"
                placeholder="Enter Civil ID"
                leftIcon="CreditCard"
                keyboardType="number-pad"
                onChangeText={setCivilId}
                value={civilId}
              />

              <PhoneNumberField
                label="Receive OTP on WhatsApp Number"
                leftIcon="MessageCircle"
                callingCode={whatsappCallingCode}
                onCallingCodeChange={setWhatsappCallingCode}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />

              <AppText variant="small" color={theme.colors.textMuted}>
                We'll send the OTP to this number via WhatsApp.
              </AppText>

              {/* Login with Mobile Number */}
              <Pressable
                onPress={() => handleMethodChange("mobile")}
                style={{ marginTop: theme.spacing.md }}
              >
                <AppText
                  variant="bodyMedium"
                  color={theme.colors.primaryDark}
                  align="right"
                >
                  Login via Mobile Number
                </AppText>
              </Pressable>
              {/* Forgot or Reset Password */}
              <Pressable
                onPress={() => navigation.navigate("ForgotPassword")}
                style={{ marginTop: theme.spacing.md }}
              >
                <AppText
                  variant="bodyMedium"
                  color={theme.colors.primaryDark}
                  align="right"
                >
                  Forgot or Reset Password
                </AppText>
              </Pressable>
            </Animated.View>
          )}
        </Animated.View>
      </AuthCard>
    </Screen>
  );
}

// Combines the native country-code Picker (@expo/ui) with the existing
// AppInput for the national number. AppInput's own `label` prop renders its
// label directly above the input box, so once this is a two-part row we
// render the label ourselves instead — check AppInput's real styling and
// swap this AppText for whatever it uses internally if they differ.
function PhoneNumberField({
  label,
  leftIcon,
  callingCode,
  onCallingCodeChange,
  value,
  onChangeText,
}: {
  label: string;
  leftIcon: string;
  callingCode: string;
  onCallingCodeChange: (code: string) => void;
  value: string;
  onChangeText: (value: string) => void;
}) {
  const theme = useAppTheme();

  return (
    <View style={{ gap: 6 }}>
      <AppText variant="small" color={theme.colors.textMuted}>
        {label}
      </AppText>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          borderWidth: 1,
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
        }}
      >
        <Host matchContents>
          <Picker
            selectedValue={callingCode}
            onValueChange={onCallingCodeChange}
            appearance="menu"
          >
            {COUNTRY_CODES.map((country) => (
              <Picker.Item
                key={country.dialCode}
                label={`${country.flag} ${country.dialCode}`}
                value={country.dialCode}
              />
            ))}
          </Picker>
        </Host>

        <View style={{ flex: 1 }}>
          <TextInput
            style={{
              minHeight: 54,
              paddingHorizontal: 14,
              flexDirection: "row",
              alignItems: "center",
              fontSize: 16,
              gap: 10,
            }}
            placeholder="5001 2345"
            keyboardType="phone-pad"
            // leftIcon={'Phone'}

            onChangeText={onChangeText}
            value={value}
          />
        </View>
      </View>
    </View>
  );
}


