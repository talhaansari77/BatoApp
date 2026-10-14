import { Text, TextProps, TextStyle } from 'react-native';
import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { useAppLanguage } from '@/app/providers/LanguageProvider';
import Animated from "react-native-reanimated";
import { themeTextTransition } from '@/theme/transitions';

type AppTextVariant = 'h1' | 'h2' | 'h3'| 'h4' | 'body' | 'bodyMedium' | 'caption' | 'small';

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
  // const {isRTL} = useAppLanguage();

  return (
  <Animated.Text
    {...props}
    style={[
      theme.typography[variant],
      { color: color ?? theme.colors.text },
      style,
      { textAlign: align ?? 'left' },
      themeTextTransition,
    ]}
  />
);
}