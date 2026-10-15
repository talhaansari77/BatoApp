import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppIcon, AppIconName } from '../atoms/AppIcon';

type AppHeaderProps = {
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onGiftPress?: () => void;
  onNotificationPress?: () => void;
};

export function AppHeader({
  onMenuPress,
  onSearchPress,
  onGiftPress,
  onNotificationPress,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <View style={styles.row}>
        {/* Left Section: Rounded Box Buttons */}
        <View style={styles.leftGroup}>
          <Pressable
            onPress={onMenuPress}
            hitSlop={8}
            style={({ pressed }) => [
              styles.squareButton,
              { backgroundColor: theme.colors.mutedLight },
              pressed && styles.pressed,
            ]}
          >
            <AppIcon name="Menu" color={theme.colors.text} size={20} />
          </Pressable>

          <Pressable
            onPress={onSearchPress}
            hitSlop={8}
            style={({ pressed }) => [
              styles.squareButton,
              { backgroundColor: theme.colors.mutedLight },
              pressed && styles.pressed,
            ]}
          >
            <AppIcon name="Search" color={theme.colors.text} size={20} />
          </Pressable>
        </View>

        {/* Right Section: Plain Icon Buttons */}
        <View style={styles.rightGroup}>
          <Pressable
            onPress={onGiftPress}
            hitSlop={8}
            style={({pressed})=>[styles.squareButton, pressed && styles.pressed,pressed&&{backgroundColor: theme.colors.surface}]}
          >
            <AppIcon name="Gift" color={theme.colors.text} size={22} />
          </Pressable>

          <Pressable
            onPress={onNotificationPress}
            hitSlop={8}
            style={({pressed})=>[styles.squareButton, pressed && styles.pressed,pressed&&{backgroundColor: theme.colors.surface}]}
          >
            <AppIcon name="Bell" color={theme.colors.text} size={22} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 10,
  },
  row: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  squareButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plainButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  pressed: {
    opacity: 0.7,
  },
});