import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../../core/navigation/navigation.types";
import { Screen } from "../../../shared/ui/templates/Screen";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { AppInput } from "../../../shared/ui/atoms/AppInput";
import { AuthCard } from "../../../shared/ui/molecules/AuthCard";
import { useAppTheme } from "../../../app/providers/ThemeProvider";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

type LoginMethod = "mobile" | "file";

const SWITCH_PADDING = 4;
const SWITCH_GAP = 4;
const TAB_HEIGHT = 44;

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.9 };

export function LoginScreen({ navigation }: Props) {
  const theme = useAppTheme();

  const [loginMethod, setLoginMethod] = useState<LoginMethod>("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [fileNumber, setFileNumber] = useState("");
  const [civilId, setCivilId] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

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

  const handleSendOtp = () => {
    // Keep the OTP navigation in one place so both login methods
    // follow the same verification flow.
    navigation.navigate("OtpVerification");
  };

  return (
    <Screen
      title="Login"
      subtitle="Access your BATO account"
      // showBack
      // onBackPress={() => navigation.goBack()}
      footer={<AppButton title="Send OTP" onPress={handleSendOtp} />}
    >
      <AuthCard
        title="Welcome back"
        subtitle={
          isMobileLogin
            ? "Enter your registered number to securely access your medical reports."
            : "Enter your file details and registered WhatsApp number to access your medical reports."
        }
      >
        {/* Animates the card's height smoothly whenever its content changes size. */}
        <Animated.View
          layout={LinearTransition.springify().damping(18).stiffness(180)}
          style={{ gap: theme.spacing.md }}
        >
          {/* Login method switch */}
          <View
            onLayout={handleSwitchLayout}
            style={{
              flexDirection: "row",
              padding: SWITCH_PADDING,
              borderRadius: 12,
              backgroundColor: theme.colors.cardMuted,
              gap: SWITCH_GAP,
            }}
          >
            {/* Sliding pill indicator, positioned behind the two tabs */}
            {tabWidth > 0 && (
              <Animated.View
                pointerEvents="none"
                style={[
                  {
                    position: "absolute",
                    top: SWITCH_PADDING,
                    left: SWITCH_PADDING,
                    width: tabWidth,
                    height: TAB_HEIGHT,
                    borderRadius: 9,
                    backgroundColor: theme.colors.card,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                  },
                  pillStyle,
                ]}
              />
            )}

            <Pressable
              onPress={() => handleMethodChange("mobile")}
              style={{
                flex: 1,
                minHeight: TAB_HEIGHT,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9,
              }}
            >
              <AppText
                variant="bodyMedium"
                color={
                  isMobileLogin ? theme.colors.text : theme.colors.textMuted
                }
              >
                Mobile Number
              </AppText>
            </Pressable>

            <Pressable
              onPress={() => handleMethodChange("file")}
              style={{
                flex: 1,
                minHeight: TAB_HEIGHT,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9,
              }}
            >
              <AppText
                variant="bodyMedium"
                color={
                  !isMobileLogin ? theme.colors.text : theme.colors.textMuted
                }
              >
                File Number
              </AppText>
            </Pressable>
          </View>

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
              <AppInput
                label="Registered Number"
                placeholder="🇰🇼  +965  500 12345"
                keyboardType="phone-pad"
                leftIcon="Phone"
                onChangeText={setMobileNumber}
                value={mobileNumber}
              />

              <AppText variant="small" color={theme.colors.textMuted}>
                We'll send the OTP to this number via WhatsApp.
              </AppText>

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

              <AppInput
                label="Receive OTP on WhatsApp Number"
                placeholder="🇰🇼  +965  500 12345"
                keyboardType="phone-pad"
                leftIcon="MessageCircle"
                onChangeText={setWhatsappNumber}
                value={whatsappNumber}
              />

              <AppText variant="small" color={theme.colors.textMuted}>
                We'll send the OTP to this number via WhatsApp.
              </AppText>

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
