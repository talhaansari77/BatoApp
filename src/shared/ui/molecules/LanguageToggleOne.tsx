import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Languages } from 'lucide-react-native';

export type Language = 'en' | 'ar';

interface LanguageToggleProps {
  value: Language;
  onChange: (lang: Language) => void;
  style?: StyleProp<ViewStyle>;
}

const TOGGLE_HEIGHT = 40;

const LanguageToggleOne = ({
  value,
  onChange,
  style,
}: LanguageToggleProps) => {

  
  const handlePress = () => {
    onChange(value === 'en' ? 'ar' : 'en');
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.container,
        value === 'ar' && styles.containerArabic,
        style,
      ]}
      onPress={handlePress}
    >
      <Languages size={18} color="#1A1D1E" style={styles.icon} />
      <Text style={[styles.label, value === 'ar' && styles.arabicLabel]}>
        {value === 'en' ? 'English' : 'العربية'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: TOGGLE_HEIGHT,
    borderRadius: TOGGLE_HEIGHT / 2,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3.84,
    elevation: 3,
  },
  containerArabic: {
    flexDirection: 'row-reverse',
  },
  icon: {
    marginRight: 6,
    marginLeft: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1D1E',
  },
  arabicLabel: {
    fontSize: 15,
  },
});

export default LanguageToggleOne;