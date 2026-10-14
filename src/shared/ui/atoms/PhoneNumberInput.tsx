import { useMemo } from "react";
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
} from "react-native";
import Animated from "react-native-reanimated";
import CountryPicker, {
  Country,
  CountryCode,
  DEFAULT_THEME,
} from "react-native-country-picker-modal";

import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { useAppLanguage } from "@/app/providers/LanguageProvider";
import { themeTransition } from "@/theme/transitions";
import { AppText } from "./AppText";
import { AppIconName } from "./AppIcon";

type AppInputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: AppIconName;
  rightIcon?: AppIconName;
  onRightIconPress?: () => void;
  countryCode: CountryCode;
  callingCode?: string;
  onSelect: (country: Country) => void;
};

export function PhoneNumberInput({
  label,
  error,
  style,
  placeholderTextColor,
  countryCode,
  onSelect,
  ...props
}: AppInputProps) {
  const theme = useAppTheme();
  const { isRTL } = useAppLanguage();

  const pickerTheme = useMemo(
    () => ({
      ...DEFAULT_THEME,
      backgroundColor: theme.colors.card,          // modal background
      onBackgroundTextColor: theme.colors.text,    // country names, calling code, search text
      primaryColor: theme.colors.text,
      primaryColorVariant: theme.colors.border,    // dividers / alpha filter
      filterPlaceholderTextColor: theme.colors.textMuted,
      fontSize: 16,
    }),
    [theme.colors],
  );

  return (
    <View style={styles.wrapper}>
      {label ? (
        <AppText
          variant="caption"
          color={theme.colors.textMuted}
          style={[styles.label, isRTL && { textAlign: "left" }]}
        >
          {label}
        </AppText>
      ) : null}

      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.card,
            borderColor: error ? theme.colors.errorText : theme.colors.border,
            borderRadius: theme.radius.lg,
          },
          themeTransition,
        ]}
      >
        <CountryPicker
          theme={pickerTheme}
          countryCode={countryCode}
          withFilter
          withFlag
          withCallingCodeButton
          withCountryNameButton={false}
          withAlphaFilter={false}
          onSelect={onSelect}
          preferredCountries={["KW", "AE", "SA", "QA", "OM", "BH"]}
          closeButtonImageStyle={{ tintColor: theme.colors.text }}
          filterProps={{
            placeholderTextColor: theme.colors.textMuted,
          }}
        />

        <TextInput
          {...props}
          placeholderTextColor={placeholderTextColor ?? theme.colors.textMuted}
          style={[
            styles.input,
            {
              color: theme.colors.text,
              textAlign: isRTL ? "right" : "left",
            },
            style,
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  label: { marginBottom: 6 },
  inputContainer: {
    minHeight: 54,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 12 },
});