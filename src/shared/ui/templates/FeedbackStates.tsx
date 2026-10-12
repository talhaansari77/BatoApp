// components/states/FeedbackStates.tsx
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../atoms/AppButton";
import { AppText } from "../atoms/AppText";
import { useAppTheme } from "@/app/providers/ThemeProvider";
import { AppIcon, AppIconName } from "../atoms/AppIcon";

type StateMessageProps = {
  title: string;
  description?: string | null;
  actionLabel?: string;
  icon?: AppIconName;
  onAction?: () => void;
  status?: "error" | "warning" | "info" | "success";
};

function StateMessage({
  title,
  description,
  actionLabel,
  icon = "CalendarX",
  onAction,
  status,
}: StateMessageProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIconContainer,
          status === "error" && { backgroundColor: theme.colors.error },
        ]}
      >
        <AppIcon
          name={icon}
          size={36}
          color={
            status === "error" ? theme.colors.errorText : theme.colors.textMuted
          }
        />
      </View>
      <AppText variant="bodyMedium" style={styles.emptyTitle}>
        {title}
      </AppText>
      {description && (
        <AppText
          variant="caption"
          color={theme.colors.textMuted}
          style={styles.emptySubtext}
        >
          {description}
        </AppText>
      )}

      {actionLabel && onAction ? (
        <Pressable
          style={({ pressed }) => [
            styles.clearFilterButton,
            pressed && styles.btnPressedIn,
          ]}
          onPress={onAction}
        >
          <AppText
            variant="caption"
            color={theme.colors.inverted}
            style={styles.clearFilterButtonText}
          >
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

type EmptyStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title = "Nothing here yet",
  description = "Content will appear here when it is available.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <StateMessage
      title={title}
      description={description}
      actionLabel={actionLabel}
      onAction={onAction}
    />
  );
}

type ErrorStateProps = {
  message?: string | null;
  onRetry: () => void;
  title?: string;
};

export function ErrorState({
  title,
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <StateMessage
      title={title || "Failed to load Appointments"}
      description={message}
      actionLabel="Try again"
      onAction={onRetry}
      icon="AlertCircle"
      status="error"
    />
  );
}

type ConnectionStateProps = {
  onRetry?: () => void;
};

export function ConnectionState({ onRetry }: ConnectionStateProps) {
  return (
    <StateMessage
      title="You’re offline"
      description="Check your internet connection and try again."
      actionLabel={onRetry ? "Try again" : undefined}
      onAction={onRetry}
      icon="GlobeOff"
    />
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    emptyContainer: {
      paddingVertical: theme.spacing["2xl"],
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
    },

    emptyIconContainer: {
      width: 64,
      height: 64,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.xs,
    },

    errorIconContainer: {
      width: 64,
      height: 64,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.error,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.xs,
    },

    emptyTitle: {
      fontWeight: "700",
    },

    emptySubtext: {
      textAlign: "center",
      paddingHorizontal: theme.spacing.xl,
    },

    retryButton: {
      marginTop: theme.spacing.md,
      backgroundColor: theme.colors.primaryDark,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.full,
    },

    retryButtonText: {
      fontWeight: "600",
    },

    clearFilterButton: {
      marginTop: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary,
    },
    btnPressedIn: {
      opacity: 0.8,
      transform: [{ scale: 0.96 }],
    },

    clearFilterButtonText: {
      fontWeight: "600",
    },
  });
}
