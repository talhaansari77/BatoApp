import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';

export type Language = 'en' | 'ar';

interface LanguageToggleProps {
  /** Selected language code */
  value: Language;
  /** Callback triggered when language changes */
  onChange: (lang: Language) => void;
  /** Optional container style overrides */
  style?: StyleProp<ViewStyle>;
}

const TOGGLE_WIDTH = 180;
const TOGGLE_HEIGHT = 44;
const PADDING = 4;
const TAB_WIDTH = (TOGGLE_WIDTH - PADDING * 2) / 2;

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  value,
  onChange,
  style,
}) => {
  // 0 = English (Left), 1 = Arabic (Right)
  const animatedValue = useRef(new Animated.Value(value === 'ar' ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value === 'ar' ? 1 : 0,
      useNativeDriver: true,
      bounciness: 6,
      speed: 14,
    }).start();
  }, [value, animatedValue]);

  // Translate animated value (0 -> 1) to horizontal pixel position
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TAB_WIDTH],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Sliding Active Pill Background */}
      <Animated.View
        style={[
          styles.activeIndicator,
          {
            transform: [{ translateX }],
          },
        ]}
      />

      {/* English Option */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.tab}
        onPress={() => onChange('en')}
      >
        <Text
          style={[
            styles.label,
            value === 'en' ? styles.activeLabel : styles.inactiveLabel,
          ]}
        >
          English
        </Text>
      </TouchableOpacity>

      {/* Arabic Option */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.tab}
        onPress={() => onChange('ar')}
      >
        <Text
          style={[
            styles.label,
            styles.arabicLabel,
            value === 'ar' ? styles.activeLabel : styles.inactiveLabel,
          ]}
        >
          العربية
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: TOGGLE_WIDTH,
    height: TOGGLE_HEIGHT,
    borderRadius: TOGGLE_HEIGHT / 2,
    backgroundColor: '#EAECEF',
    flexDirection: 'row',
    padding: PADDING,
    position: 'relative',
    alignItems: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: PADDING,
    left: PADDING,
    width: TAB_WIDTH,
    height: TOGGLE_HEIGHT - PADDING * 2,
    borderRadius: (TOGGLE_HEIGHT - PADDING * 2) / 2,
    backgroundColor: '#FFFFFF',
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3.84,
    elevation: 3,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  arabicLabel: {
    fontSize: 15, // Slightly larger font size for Arabic readability
  },
  activeLabel: {
    color: '#1A1D1E',
  },
  inactiveLabel: {
    color: '#8A8D91',
  },
});

export default LanguageToggle;