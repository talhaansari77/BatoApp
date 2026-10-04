import {
  Alert,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { AppInput } from "../../../shared/ui/atoms/AppInput";
import { PhoneNumberInput } from "../../../shared/ui/atoms/PhoneNumberInput";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { Screen } from "../../../shared/ui/templates/Screen";
import { useAuthStore } from "../store/auth.store";
import Assets from "../../../assets";
import { AuthStackParamList } from "../../../core/navigation/navigation.types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<AuthStackParamList, "LoginViaFile">;

const LoginViaFile = ({ navigation }: Props) => {
  const [fileNumber, setFileNumber] = useState("");
  const [civilId, setCivilId] = useState("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [countryCode, setCountryCode] = useState<any>("KW");
  const [callingCode, setCallingCode] = useState("965");
  const loginViaFile = useAuthStore((state) => state.loginViaFile);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleSendOtp = async () => {
    // Keep the OTP navigation in one place so both login methods
    // follow the same verification flow.
    const payload = {
      login_method: "file",
      file_number: fileNumber,
      civil_id: civilId,
      any_mobile: `+${callingCode + mobileNumber}`,
    };
    console.log("payload", payload);

    try {
      const response = await loginViaFile(payload);
      console.log("OTP response:", response);

      navigation.navigate("OtpVerification",{handleSendOtp:handleSendOtp});
    } catch {
      Alert.alert(
        "Login failed",
        "Please check your Phone Number and try again.",
      );
    }

    // navigation.navigate("OtpVerification");
  };
  const theme = useAppTheme();
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
      <ScrollView nestedScrollEnabled={true}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: theme.spacing["4xl"],
          }}
        >
          <Image
            source={Assets.Icons.appIcon}
            style={{ width: "100%", height: 150 }}
            resizeMode="contain"
          />
        </View>
        <View style={{ gap: theme.spacing.md }}>
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

          <PhoneNumberInput
            label="Phone"
            placeholder="0000 0000"
            value={mobileNumber}
            onChangeText={(v: string) => {
              setMobileNumber(v);
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

          <AppText variant="small" color={theme.colors.textMuted}>
            We'll send the OTP to this number via WhatsApp.
          </AppText>

          {/* Login with Mobile Number */}
          <Pressable
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            }}
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
            onPress={() => navigation.goBack()}
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
        </View>
      </ScrollView>
    </Screen>
  );
};

export default LoginViaFile;

const styles = StyleSheet.create({});
