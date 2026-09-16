import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppText } from './AppText';

type AppButtonVariant = 'primary' | 'outline' | 'ghost';

type AppButtonProps = PressableProps & {
  title: string;
  variant?: AppButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export function AppButton({
  title,
  variant = 'primary',
  loading = false,
  fullWidth = true,
  disabled,
  style,
  ...props
}: AppButtonProps) {
  const theme = useAppTheme();

  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    if (variant === 'outline') {
      return {
        backgroundColor: 'transparent',
        borderColor: theme.colors.primaryDark,
        borderWidth: 1,
      };
    }

    if (variant === 'ghost') {
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 1,
      };
    }

    return {
      backgroundColor: theme.colors.primaryDark,
      borderColor: theme.colors.primaryDark,
      borderWidth: 1,
    };
  };

  const textColor =
    variant === 'primary' ? '#FFFFFF' : theme.colors.primaryDark;

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          borderRadius: theme.radius.lg,
          opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        getButtonStyle(),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <AppText variant="bodyMedium" color={textColor}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});