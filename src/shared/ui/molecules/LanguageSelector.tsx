import React from 'react';
import { Pressable, View } from 'react-native';

import { useAppLanguage } from '../../../app/providers/LanguageProvider';
import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppLanguage } from '../../../core/i18n/i18n';
import { AppIcon } from '../atoms/AppIcon';
import { AppText } from '../atoms/AppText';

const options: Array<{
  label: string;
  value: AppLanguage;
  description: string;
}> = [
  {
    label: 'English',
    value: 'en',
    description: 'Use BATO Clinic in English',
  },
  {
    label: 'العربية',
    value: 'ar',
    description: 'استخدم عيادة باتو باللغة العربية',
  },
];

export function LanguageSelector() {
  const theme = useAppTheme();
  const { language, setLanguage } = useAppLanguage();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      {options.map((option) => {
        const isSelected = language === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => setLanguage(option.value)}
            style={{
              minHeight: 56,
              paddingHorizontal: theme.spacing.lg,
              borderRadius: theme.radius.lg,
              borderWidth: 1,
              borderColor: isSelected
                ? theme.colors.primaryDark
                : theme.colors.border,
              backgroundColor: isSelected
                ? theme.colors.cardMuted
                : theme.colors.card,
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing.md,
            }}
          >
            <AppIcon
              name="Languages"
              color={isSelected ? theme.colors.primaryDark : theme.colors.text}
            />

            <View style={{ flex: 1 }}>
              <AppText
                variant="bodyMedium"
                color={isSelected ? theme.colors.primaryDark : theme.colors.text}
              >
                {option.label}
              </AppText>

              <AppText variant="caption" color={theme.colors.textMuted}>
                {option.description}
              </AppText>
            </View>

            {isSelected ? (
              <AppIcon
                name="Check"
                size={20}
                color={theme.colors.primaryDark}
              />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}