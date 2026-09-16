import React from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppText } from './AppText';
import { AppIcon, AppIconName } from './AppIcon';

type AppInputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: AppIconName;
  rightIcon?: AppIconName;
  onRightIconPress?: () => void;
};

export function AppInput({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  placeholderTextColor,
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
        {leftIcon ? (
          <AppIcon
            name={leftIcon}
            size={20}
            color={theme.colors.textMuted}
          />
        ) : null}

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

        {rightIcon ? (
          <Pressable onPress={onRightIconPress} hitSlop={12}>
            <AppIcon
              name={rightIcon}
              size={20}
              color={theme.colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <AppText
          variant="caption"
          color={theme.colors.errorText}
          style={styles.error}
        >
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    marginBottom: 6,
  },
  inputContainer: {
    minHeight: 54,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
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