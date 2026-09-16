import React from 'react';
import { View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppIcon } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';

type StepKey = 'branch' | 'time' | 'payment' | 'done';

type Props = {
  currentStep: StepKey;
};

const steps: Array<{ key: StepKey; label: string }> = [
  { key: 'branch', label: 'Branch' },
  { key: 'time', label: 'Time' },
  { key: 'payment', label: 'Payment' },
  { key: 'done', label: 'Done' },
];

export function BookingStepIndicator({ currentStep }: Props) {
  const theme = useAppTheme();

  const currentIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <View
      style={{
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'flex-start',
        ...(theme.shadows.card ?? {}),
      }}
    >
      {steps.map((step, index) => {
        const active = index === currentIndex;
        const done = index < currentIndex;
        const highlighted = active || done;

        return (
          <React.Fragment key={step.key}>
            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: theme.radius.full,
                  backgroundColor: highlighted
                    ? theme.colors.primaryDark
                    : theme.colors.cardMuted,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AppIcon
                  name={done ? 'CircleCheck' : active ? 'Clock' : 'Circle'}
                  size={15}
                  color={
                    highlighted ? theme.colors.card : theme.colors.textMuted
                  }
                />
              </View>

              <AppText
                variant="small"
                color={
                  highlighted
                    ? theme.colors.primaryDark
                    : theme.colors.textMuted
                }
              >
                {step.label}
              </AppText>
            </View>

            {index !== steps.length - 1 ? (
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: theme.colors.border,
                  marginTop: 14,
                }}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </View>
  );
}