import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppIcon, AppIconName } from '../atoms/AppIcon';
import { AppText } from '../atoms/AppText';

type HeaderAction = {
  icon: AppIconName;
  onPress: () => void;
};

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  actions?: HeaderAction[];
};

export function AppHeader({
  title,
  subtitle,
  showBack,
  onBackPress,
  actions = [],
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          {showBack ? (
            <Pressable
              onPress={onBackPress}
              hitSlop={12}
              style={styles.iconButton}
            >
              <AppIcon name="ArrowLeft" color={theme.colors.primaryDark} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.center}>
          {title ? (
            <AppText variant="h3" align="center" numberOfLines={1}>
              {title}
            </AppText>
          ) : (
            <AppText
              variant="h2"
              color={theme.colors.primaryDark}
              align="center"
              style={styles.logoText}
            >
              BATO
            </AppText>
          )}

          {subtitle ? (
            <AppText
              variant="caption"
              color={theme.colors.textMuted}
              align="center"
              numberOfLines={1}
            >
              {subtitle}
            </AppText>
          ) : null}
        </View>

        <View style={styles.right}>
          {actions.map((action, index) => (
            <Pressable
              key={`${action.icon}-${index}`}
              onPress={action.onPress}
              hitSlop={12}
              style={styles.iconButton}
            >
              <AppIcon name={action.icon} color={theme.colors.text} />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 18,
    paddingBottom: 12,
    zIndex: 10,
  },
  row: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    width: 72,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 72,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    letterSpacing: 5,
  },
});