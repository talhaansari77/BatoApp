import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useAppTheme } from '../../../app/providers/ThemeProvider';

type AppTextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodyMedium' | 'caption' | 'small';

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
};

export function AppText({
  variant = 'body',
  color,
  align,
  style,
  ...props
}: AppTextProps) {
  const theme = useAppTheme();

  return (
    <Text
      {...props}
      style={[
        theme.typography[variant],
        {
          color: color ?? theme.colors.text,
          textAlign: align,
        },
        style,
      ]}
    />
  );
}