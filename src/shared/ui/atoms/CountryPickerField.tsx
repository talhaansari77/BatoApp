import { useAppTheme } from "@/app/providers/ThemeProvider";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import CountryPicker, {
  Country,
  CountryCode,
  DEFAULT_THEME,
} from "react-native-country-picker-modal";

type CountryPickerFieldProps = {
  countryCode: CountryCode;
  callingCode?: string;
  onSelect: (country: Country) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
};

const CountryPickerField = ({
  countryCode,
  callingCode,
  onSelect,
  label,
  error,
  disabled = false,
  containerStyle,
}: CountryPickerFieldProps) => {
  const theme = useAppTheme();
  const [visible, setVisible] = useState<boolean>(false);
  const pickerTheme = useMemo(
    () => ({
      ...DEFAULT_THEME,
      backgroundColor: theme.colors.card, // modal background
      onBackgroundTextColor: theme.colors.text, // country names, calling code, search text
      primaryColor: theme.colors.text,
      primaryColorVariant: theme.colors.border, // dividers / alpha filter
      filterPlaceholderTextColor: theme.colors.textMuted,
      fontSize: 16,
    }),
    [theme.colors],
  );
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.disabled,
        ]}
      >
        <CountryPicker
          visible={visible}
          theme={pickerTheme}
          countryCode={countryCode}
          withFilter
          withFlag
          withCallingCodeButton
          withCountryNameButton={true}
          // withAlphaFilter={true}
          onSelect={onSelect}
          preferredCountries={["KW", "AE", "SA", "QA", "OM", "BH"]}
          closeButtonImageStyle={{ tintColor: theme.colors.text }}
          filterProps={{
            placeholderTextColor: theme.colors.textMuted,
          }}
        />

        {callingCode && (
          <>
            <View style={styles.divider} />

            <Text style={styles.callingCode}>
              +{callingCode.replace("+", "")}
            </Text>
          </>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default CountryPickerField;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
  },

  inputError: {
    borderColor: "#E53935",
  },

  disabled: {
    opacity: 0.5,
  },

  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#DDD",
    marginHorizontal: 10,
  },

  callingCode: {
    fontSize: 16,
    color: "#222",
  },

  error: {
    marginTop: 5,
    fontSize: 12,
    color: "#E53935",
  },
});
