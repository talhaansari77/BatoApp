import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppHeader } from '../organisms/AppHeader';

type ScreenProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  scroll?: boolean;
  actions?: React.ComponentProps<typeof AppHeader>['actions'];
  footer?: React.ReactNode;
  contentStyle?: ViewStyle;
};

export function Screen({
  children,
  title,
  subtitle,
  showBack,
  onBackPress,
  scroll = true,
  actions,
  footer,
  contentStyle,
}: ScreenProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const content = (
    <View
      style={[
        styles.content,
        {
          paddingHorizontal: theme.spacing.xl,
          paddingBottom: footer ? theme.spacing.xl : insets.bottom + theme.spacing.xl,
        },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <AppHeader
        title={title}
        subtitle={subtitle}
        showBack={showBack}
        onBackPress={onBackPress}
        actions={actions}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}

        {footer ? (
          <View
            style={[
              styles.footer,
              {
                paddingBottom: insets.bottom + theme.spacing.md,
                paddingHorizontal: theme.spacing.xl,
                backgroundColor: theme.colors.background,
                borderTopColor: theme.colors.border,
              },
            ]}
          >
            {footer}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});