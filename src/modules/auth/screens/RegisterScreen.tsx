import React, { useMemo, useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthStackParamList } from "../../../core/navigation/types";
import { Screen } from "../../../shared/ui/templates/Screen";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { AppInput } from "../../../shared/ui/atoms/AppInput";
import { AuthCard } from "../../../shared/ui/molecules/AuthCard";
import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { useAuthStore } from "../store/auth.store";
import { LoginScreen } from "./LoginScreen";
import axios from "axios";
import Assets from "../../../assets";
import { PhoneNumberInput } from "../../../shared/ui/atoms/PhoneNumberInput";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

type Gender = "male" | "female";

/**
 * Shape sent to the API. Make sure `register` in auth.store.ts accepts this
 * type (add the new keys if it still only has full_name / civil_id / mobile_number).
 */
export type RegisterPayload = {
  civil_id: string;
  full_name: string;
  mobile_number: string;
  country_code: string;
  dob: string; // YYYY-MM-DD
  gender: Gender;
  address: string;
  nationality: string;
};

type FieldKey =
  | "fullName"
  | "cid"
  | "countryCode"
  | "phoneNumber"
  | "dateOfBirth"
  | "gender"
  | "address"
  | "nationality"
  | "password";

type Errors = Partial<Record<FieldKey, string>>;

const MIN_PASSWORD_LENGTH = 8;
const PHONE_LENGTH_KW = 8;

/* ----------------------------- helpers ----------------------------- */

const digitsOnly = (value: string) => value.replace(/\D/g, "");

/** "19950101" -> "1995-01-01" while typing */
function formatDob(raw: string) {
  const d = digitsOnly(raw).slice(0, 8);
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0, 4)}-${d.slice(4)}`;
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
}

function isValidDob(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const sameDay =
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d;
  return sameDay && y >= 1900 && date <= new Date();
}

/**
 * Kuwaiti civil ID: 12 digits. Digit 1 is the century (2 = 1900s, 3 = 2000s),
 * digits 2-7 are the birth date as YYMMDD.
 */
function dobFromCivilId(cid: string) {
  if (!/^[23]\d{11}$/.test(cid)) return "";
  const century = cid[0] === "2" ? "19" : "20";
  const dob = `${century}${cid.slice(1, 3)}-${cid.slice(3, 5)}-${cid.slice(5, 7)}`;
  return isValidDob(dob) ? dob : "";
}

function passwordScore(password: string) {
  let score = 0;
  if (password.length >= MIN_PASSWORD_LENGTH) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0–4
}

const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];

/* --------------------------- small pieces --------------------------- */

function SectionHeading({
  title,
  hint,
  color,
  muted,
}: {
  title: string;
  hint?: string;
  color: string;
  muted: string;
}) {
  return (
    <View style={{ gap: 2 }}>
      <Text style={{ fontSize: 16, fontWeight: "700", color }}>{title}</Text>
      {hint ? <Text style={{ fontSize: 13, color: muted }}>{hint}</Text> : null}
    </View>
  );
}

function GenderPicker({
  value,
  onChange,
  error,
  colors,
}: {
  value: Gender | "";
  onChange: (value: Gender) => void;
  error?: string;
  colors: Palette;
}) {
  const options: { label: string; value: Gender }[] = [
    { label: "Female", value: "female" },
    { label: "Male", value: "male" },
  ];

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>
        Gender
      </Text>
      <View
        accessibilityRole="radiogroup"
        style={{
          flexDirection: "row",
          padding: 4,
          gap: 4,
          borderRadius: 14,
          backgroundColor: colors.surfaceMuted,
          borderWidth: 1,
          borderColor: error ? colors.danger : colors.border,
        }}
      >
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(option.value)}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
                borderRadius: 10,
                backgroundColor: selected ? colors.primary : "transparent",
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: selected ? colors.onPrimary : colors.text,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <Text style={{ fontSize: 12, color: colors.danger }}>{error}</Text>
      ) : null}
    </View>
  );
}

function PasswordStrength({
  password,
  colors,
}: {
  password: string;
  colors: Palette;
}) {
  if (!password) return null;
  const score = passwordScore(password);
  const tone =
    score <= 1 ? colors.danger : score === 2 ? colors.warning : colors.success;

  return (
    <View
      style={{ gap: 6 }}
      accessible
      accessibilityLabel={`Password strength: ${STRENGTH_LABELS[score]}`}
    >
      <View style={{ flexDirection: "row", gap: 6 }}>
        {[1, 2, 3, 4].map((step) => (
          <View
            key={step}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: step <= score ? tone : colors.border,
            }}
          />
        ))}
      </View>
      <Text style={{ fontSize: 12, color: colors.muted }}>
        {STRENGTH_LABELS[score]}. Use {MIN_PASSWORD_LENGTH}+ characters with
        upper and lower case letters, a number and a symbol.
      </Text>
    </View>
  );
}

/* ------------------------------ screen ------------------------------ */

type Palette = ReturnType<typeof buildPalette>;

// Reads from your theme when the token exists, otherwise falls back to a safe default.
// Rename the keys here if your theme uses different names.
function buildPalette(theme: unknown) {
  const c = ((theme as { colors?: Record<string, string> })?.colors ??
    {}) as Record<string, string>;
  return {
    primary: c.primary ?? "#0F766E",
    onPrimary: c.onPrimary ?? "#FFFFFF",
    text: c.text ?? "#14202B",
    muted: c.textSecondary ?? c.muted ?? "#667085",
    border: c.border ?? "#D9DEE3",
    surfaceMuted: c.surfaceMuted ?? c.background ?? "#F3F5F7",
    danger: c.error ?? c.danger ?? "#D92D20",
    warning: c.warning ?? "#F79009",
    success: c.success ?? "#12B76A",
  };
}

export function RegisterScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const colors = useMemo(() => buildPalette(theme), [theme]);

  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const clearError = useAuthStore((state) => state.clearError);

  const [secure, setSecure] = useState(true);
  const [fullName, setFullName] = useState("");
  const [cid, setCid] = useState("");
  const [countryCode, setCountryCode] = useState<any>("KW");
    const [callingCode, setCallingCode] = useState("965");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dobEditedByUser, setDobEditedByUser] = useState(false);
  const [gender, setGender] = useState<Gender | "">("");
  const [address, setAddress] = useState("");
  const [nationality, setNationality] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const clearFieldError = (key: FieldKey) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const handleCidChange = (value: string) => {
    const next = digitsOnly(value).slice(0, 12);
    setCid(next);
    clearFieldError("cid");

    // Save a step: the birth date is encoded in the civil ID.
    if (!dobEditedByUser) {
      const derived = dobFromCivilId(next);
      if (derived) {
        setDateOfBirth(derived);
        clearFieldError("dateOfBirth");
      }
    }
  };

  const handleDobChange = (value: string) => {
    setDobEditedByUser(true);
    setDateOfBirth(formatDob(value));
    clearFieldError("dateOfBirth");
  };

  const validate = (): Errors => {
    const next: Errors = {};

    if (fullName.trim().split(/\s+/).filter(Boolean).length < 2) {
      next.fullName = "Enter your first and last name.";
    }
    if (!/^[23]\d{11}$/.test(cid)) {
      next.cid = "Civil ID must be 12 digits.";
    }
    if (!/^\+\d{1,4}$/.test(countryCode.trim())) {
      next.countryCode = "Use a code like +965.";
    }
    if (countryCode.trim() === "+965") {
      if (digitsOnly(phoneNumber).length !== PHONE_LENGTH_KW) {
        next.phoneNumber = "Enter an 8-digit Kuwait number.";
      }
    } else if (digitsOnly(phoneNumber).length < 6) {
      next.phoneNumber = "Enter a valid phone number.";
    }
    if (!isValidDob(dateOfBirth)) {
      next.dateOfBirth = "Use the format YYYY-MM-DD.";
    }
    if (!gender) {
      next.gender = "Select your gender.";
    }
    if (address.trim().length < 5) {
      next.address = "Enter your area, block and street.";
    }
    if (nationality.trim().length < 2) {
      next.nationality = "Enter your nationality.";
    }

    return next;
  };

  const handleRegister = async () => {
    console.log(countryCode, callingCode, phoneNumber);
    clearError();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload: RegisterPayload = {
      civil_id: cid,
      full_name: fullName.trim(),
      mobile_number: digitsOnly(phoneNumber),
      country_code: countryCode.trim(),
      dob: dateOfBirth,
      gender: gender as Gender,
      address: address.trim(),
      nationality: nationality.trim(),
    };

    // const Mockpayload = {
    //   civil_id: "295010112305",
    //   full_name: "Fatima Al-Sabah",
    //   mobile_number: "60608009",
    //   country_code: "+965",
    //   dob: "1995-01-01",
    //   gender: "female",
    //   address: "Salmiya, Block 4, Street 10",
    //   nationality: "Kuwaiti",
    // };
    try {
      console.log("Register payload:", payload);
      await register(payload);

      Alert.alert("Patient registered successfully");
      navigation.navigate("Login");
      // or let your auth gate switch stacks if register() also signs the user in.
    } catch (error: any) {
      let errorMessage = "Check your details and try again.";

      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status; // This will capture 409, 400, etc.
        const serverMessage = error.response?.data?.message;

        if (statusCode === 409) {
          {
            errorMessage = "This account already exists.";
            navigation.navigate("Login");
          }
        } else if (serverMessage) {
          errorMessage = serverMessage;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      Alert.alert("Couldn't create your account", errorMessage);
    }
  };

  return (
    <Screen
      title="Create Account"
      // subtitle="Join BATO Clinic"
      showBack
      onBackPress={() => navigation.goBack()}
      footer={
        <AppButton
          title={isLoading ? "Creating account..." : "Create account"}
          onPress={handleRegister}
          disabled={isLoading}
        />
      }
    >
      <Image
        source={Assets.Icons.appIcon}
        style={{
          width: 100,
          height: 100,
          alignSelf: "center",
          marginBottom: 20,
        }}
        resizeMode="contain"
      />
      <View
        // style={[
        //   {
        //     backgroundColor: theme.colors.card,
        //     borderRadius: theme.radius["2xl"],
        //     padding: theme.spacing["2xl"],
        //     borderWidth: 1,
        //     borderColor: theme.colors.border,
        //   },
        //   theme.shadows.card,
        // ]}
      >
        <View style={{ gap: theme.spacing.xl ?? 24 }}>
          {/* Personal details */}
          <View style={{ gap: theme.spacing.md }}>
            <SectionHeading
              title="Personal details"
              hint="As they appear on your civil ID."
              color={theme.colors.text}
              muted={theme.colors.textMuted}
            />

            <AppInput
              label="Full name"
              placeholder="Fatima Al-Sabah"
              value={fullName}
              onChangeText={(v: string) => {
                setFullName(v);
                clearFieldError("fullName");
              }}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              leftIcon="UserRound"
              error={errors.fullName}
            />

            <AppInput
              label="Civil ID"
              placeholder="12-digit civil ID"
              value={cid}
              onChangeText={handleCidChange}
              keyboardType="number-pad"
              maxLength={12}
              leftIcon="IdCard"
              error={errors.cid}
            />

            <AppInput
              label="Date of birth"
              placeholder="YYYY-MM-DD"
              value={dateOfBirth}
              onChangeText={handleDobChange}
              keyboardType="number-pad"
              maxLength={10}
              leftIcon="CalendarDays"
              error={errors.dateOfBirth}
            />

            <GenderPicker
              value={gender}
              onChange={(v) => {
                setGender(v);
                clearFieldError("gender");
              }}
              error={errors.gender}
              colors={colors}
            />

            <AppInput
              label="Nationality"
              placeholder="Kuwaiti"
              value={nationality}
              onChangeText={(v: string) => {
                setNationality(v);
                clearFieldError("nationality");
              }}
              autoCapitalize="words"
              leftIcon="Flag"
              error={errors.nationality}
            />
          </View>

          {/* Contact */}
          <View style={{ gap: theme.spacing.md }}>
            <SectionHeading
              title="Contact"
              hint="We use this to confirm appointments."
              color={theme.colors.text}
              muted={theme.colors.textMuted}
            />

            <PhoneNumberInput
              label="Phone"
              placeholder="0000 0000"
              value={phoneNumber}
              onChangeText={(v: string) => {
                setPhoneNumber(v);
                clearFieldError("phoneNumber");
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
            {/* <View style={{ flexDirection: "row", gap: theme.spacing.sm ?? 8 }}>
              <View style={{ width: 104 }}>
                <AppInput
                  label="Code"
                  placeholder="+965"
                  value={countryCode}
                  onChangeText={(v: string) => {
                    setCountryCode(v.replace(/[^\d+]/g, "").slice(0, 5));
                    clearFieldError("countryCode");
                  }}
                  keyboardType="phone-pad"
                  maxLength={5}
                  error={errors.countryCode}
                />
              </View>
              <View style={{ flex: 1 }}>
                <AppInput
                  label="Mobile number"
                  placeholder="6060 8069"
                  value={phoneNumber}
                  onChangeText={(v: string) => {
                    setPhoneNumber(digitsOnly(v).slice(0, 15));
                    clearFieldError("phoneNumber");
                  }}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  leftIcon="Phone"
                  error={errors.phoneNumber}
                />
              </View>
            </View> */}

            <AppInput
              label="Address"
              placeholder="Salmiya, Block 4, Street 10"
              value={address}
              onChangeText={(v: string) => {
                setAddress(v);
                clearFieldError("address");
              }}
              autoCapitalize="words"
              autoComplete="street-address"
              textContentType="fullStreetAddress"
              leftIcon="MapPin"
              error={errors.address}
            />
          </View>

          {/* Security */}
          <View style={{ gap: theme.spacing.md }}>
            <PasswordStrength password={password} colors={colors} />
          </View>
        </View>
      </View>
    </Screen>
  );
}
