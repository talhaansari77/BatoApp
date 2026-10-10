import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CompositeScreenProps } from "@react-navigation/native";

import {
  AuthStackParamList,
  RootStackParamList,
} from "../../../core/navigation/types";
import { Screen } from "../../../shared/ui/templates/Screen";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { AuthCard } from "../../../shared/ui/molecules/AuthCard";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { tokenStorage } from "../../../core/storage/tokenStorage";
import { useAuthStore } from "../store/auth.store";

type Props = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, "OtpVerification">,
  NativeStackScreenProps<RootStackParamList>
>;

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export function OtpVerificationScreen({ navigation,route }: Props) {
  const theme = useAppTheme();
// Safe destructuring with fallback
  const { handleSendOtp } = route.params ?? {};
  // The original TextInputs had no `value`/`onChangeText` at all — fully
  // uncontrolled and never wired to any state. This is the actual source
  // of truth now.
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const clearError = useAuthStore((state) => state.clearError);
  const login = useAuthStore((state) => state.login);
  const status = useAuthStore((state) => state.status);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const code = otp.join("");
  const isComplete = code.length === OTP_LENGTH;

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleChangeText = (text: string, index: number) => {
    const digits = text.replace(/[^0-9]/g, "");

    // Box cleared (e.g. backspace on a filled box) — just clear it.
    if (digits.length === 0) {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    // Normal single-digit typing — fill it and auto-advance to the next box.
    if (digits.length === 1) {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = digits;
        return next;
      });

      if (index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        Keyboard.dismiss();
      }
      return;
    }

    // More than one character landed here in a single event — a paste or
    // an SMS-autofill. A full-length code always fills from the very first
    // box; a shorter pasted chunk fills starting from wherever the user
    // pasted it.
    const startIndex = digits.length >= OTP_LENGTH ? 0 : index;

    setOtp((prev) => {
      const next = [...prev];
      for (
        let i = 0;
        i < digits.length && startIndex + i < OTP_LENGTH;
        i += 1
      ) {
        next[startIndex + i] = digits[i];
      }
      return next;
    });

    const lastFilledIndex =
      Math.min(startIndex + digits.length, OTP_LENGTH) - 1;
    if (lastFilledIndex >= OTP_LENGTH - 1) {
      Keyboard.dismiss();
    } else {
      inputRefs.current[lastFilledIndex + 1]?.focus();
    }
  };

  // Pressing backspace on an already-empty box moves focus back and clears
  // the previous digit too, matching how most OTP inputs feel to use.
  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      setOtp((prev) => {
        const next = [...prev];
        next[index - 1] = "";
        return next;
      });
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setSecondsLeft(RESEND_SECONDS);
    inputRefs.current[0]?.focus();
    // TODO: trigger the actual resend-OTP request here.
    console.log('OTP Resend')
    handleSendOtp?.()
  };

  const handleVerityOtp = async () => {
    const OTP_KEY = await tokenStorage.getOtpKey();
    if (!OTP_KEY) {
      throw new Error("OTP key is missing");
    }
    const otpString = otp.join("");

    const LoginPayload = {
      otp_key: OTP_KEY,
      otp: otpString,
    };

    try {
      clearError();

      const response = await login(LoginPayload);
      if (status == "authenticated") navigation.navigate("PatientApp");
    } catch {
      Alert.alert(
        "Login failed",
        "Please check your Phone Number and try again.",
      );
    }
  };

  return (
    <Screen
      title="OTP Verification"
      subtitle="Secure login"
      showBack
      onBackPress={() => navigation.goBack()}
      footer={
        <AppButton
          title="Verify OTP"
          onPress={handleVerityOtp}
          disabled={!isComplete}
        />
      }
    >
      <AuthCard
        title="Enter verification code"
        subtitle="We sent a 6-digit code to your phone number."
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: theme.spacing.sm,
          }}
        >
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() =>
                setFocusedIndex((current) =>
                  current === index ? null : current,
                )
              }
              keyboardType="number-pad"
              // Lets iOS/Android surface the incoming SMS code as a
              // one-tap suggestion above the keyboard, and lets a normal
              // clipboard paste of the full code land here too.
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
              maxLength={OTP_LENGTH}
              selectTextOnFocus
              autoFocus={index === 0}
              accessibilityLabel={`Digit ${index + 1} of ${OTP_LENGTH}`}
              style={{
                flex: 1,
                minHeight: 52,
                borderRadius: theme.radius.md,
                borderWidth: focusedIndex === index ? 2 : 1,
                borderColor:
                  focusedIndex === index
                    ? (theme.colors.primaryDark ?? theme.colors.text)
                    : theme.colors.border,
                backgroundColor: theme.colors.background,
                textAlign: "center",
                fontSize: 20,
                color: theme.colors.text,
              }}
            />
          ))}
        </View>

        {secondsLeft > 0 ? (
          <AppText
            variant="caption"
            color={theme.colors.textMuted}
            align="center"
            style={{ marginTop: theme.spacing.lg }}
          >
            Didn’t receive a code? Resend in {secondsLeft}s
          </AppText>
        ) : (
          <Pressable
            onPress={handleResend}
            style={{ marginTop: theme.spacing.lg }}
          >
            <AppText
              variant="caption"
              color={theme.colors.primaryDark}
              align="center"
            >
              Didn’t receive a code? Resend
            </AppText>
          </Pressable>
        )}
      </AuthCard>
    </Screen>
  );
}
