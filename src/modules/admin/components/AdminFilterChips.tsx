import React from 'react';
import { Pressable, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppText } from '../../../shared/ui/atoms/AppText';

type FilterOption<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  options: FilterOption<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
};

export function AdminFilterChips<T extends string>({
  options,
  selectedValue,
  onChange,
}: Props<T>) {
  const theme = useAppTheme();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => ({
              minHeight: 40,
              paddingHorizontal: theme.spacing.md,
              borderRadius: theme.radius.full,
              borderWidth: 1,
              borderColor: isSelected ? theme.colors.primaryDark : theme.colors.border,
              backgroundColor: isSelected ? theme.colors.cardMuted : theme.colors.card,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.82 : 1,
            })}
          >
            <AppText
              variant="caption"
              color={isSelected ? theme.colors.primaryDark : theme.colors.textMuted}
              style={{ fontWeight: isSelected ? '700' : '400' }}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}