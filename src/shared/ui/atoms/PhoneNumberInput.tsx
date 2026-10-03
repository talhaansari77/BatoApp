import React from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  Pressable,
} from "react-native";

import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { AppText } from "./AppText";
import { AppIcon, AppIconName } from "./AppIcon";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";

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
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  placeholderTextColor,
  countryCode,
  callingCode,
  onSelect,
  ...props
}: AppInputProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.wrapper}>
      {label ? (
        <AppText
          variant="caption"
          color={theme.colors.textMuted}
          style={styles.label}
        >
          {label}
        </AppText>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.card,
            borderColor: error ? theme.colors.errorText : theme.colors.border,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <CountryPicker
          countryCode={countryCode}
          withFilter
          withFlag
          // withCallingCode={true}
          withCallingCodeButton={true}
          withCountryNameButton={false}
          withAlphaFilter={false}
          onSelect={onSelect}
          preferredCountries={['KW','AE','SA','QA','OM','BH']}
            // disabled={true}
        />
        {/* {callingCode && <Text>+{callingCode.replace("+", "")}</Text>} */}

        <TextInput
          {...props}
          
          placeholderTextColor={placeholderTextColor ?? theme.colors.textMuted}
          style={[
            styles.input,
            {
              color: theme.colors.text,
            },
            style,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  label: {
    marginBottom: 6,
  },
  inputContainer: {
    minHeight: 54,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  error: {
    marginTop: 6,
  },
});
