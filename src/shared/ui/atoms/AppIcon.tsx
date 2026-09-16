import React from 'react';
import * as Icons from 'lucide-react-native';
import { useAppTheme } from '../../../app/providers/ThemeProvider';

export type AppIconName = keyof typeof Icons;

type AppIconProps = {
  name: AppIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function AppIcon({ name, size = 22, color, strokeWidth = 2 }: AppIconProps) {
  const theme = useAppTheme();
  const Icon = Icons[name] as React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;

  if (!Icon) return null;

  return (
    <Icon
      size={size}
      color={color ?? theme.colors.text}
      strokeWidth={strokeWidth}
    />
  );
}