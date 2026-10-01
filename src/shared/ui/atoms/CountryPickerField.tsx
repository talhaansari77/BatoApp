import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';

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
          countryCode={countryCode}
          withFilter
          withFlag
          withCallingCode={false}
          withCountryNameButton={false}
          withAlphaFilter={false}
          onSelect={onSelect}
        //   disabled={disabled}
        />

        {callingCode && (
          <>
            <View style={styles.divider} />

            <Text style={styles.callingCode}>
              +{callingCode.replace('+', '')}
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
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
  },

  inputError: {
    borderColor: '#E53935',
  },

  disabled: {
    opacity: 0.5,
  },

  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#DDD',
    marginHorizontal: 10,
  },

  callingCode: {
    fontSize: 16,
    color: '#222',
  },

  error: {
    marginTop: 5,
    fontSize: 12,
    color: '#E53935',
  },
});
