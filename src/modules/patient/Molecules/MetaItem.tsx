import { ThemeMode, useAppTheme } from "@/app/providers/ThemeProvider";
import { AppIcon, AppIconName } from "@/shared/ui/atoms/AppIcon";
import { AppText } from "@/shared/ui/atoms/AppText";
import { AppColors, spacing, radius, shadows, typography } from "@/theme";
import { useMemo } from "react";
import { ColorSchemeName, View, StyleSheet } from "react-native";

export default function MetaItem({ icon, label }: { icon: AppIconName; label: string }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.metaItem}>
      <AppIcon name={icon} size={17} color={theme.colors.primaryDark} />

      <AppText
        variant="caption"
        color={theme.colors.textMuted}
        numberOfLines={1}
      >
        {label}
      </AppText>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    metaItem: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
    },

    metaDivider: {
      width: 1,
      height: 22,
      backgroundColor: theme.colors.border,
    },

    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
  });
}
