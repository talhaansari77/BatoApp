import { useAppTheme } from "@/app/providers/ThemeProvider";
import { AppText } from "@/shared/ui/atoms/AppText";
import { View } from "react-native";

export function InfoRow({ label, value }: { label: string; value: string }) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        minHeight: 52,
        paddingHorizontal: theme.spacing.lg,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: theme.spacing.md,
      }}
    >
      <AppText color={theme.colors.textMuted}>{label}</AppText>
      <AppText variant="bodyMedium">{value}</AppText>
    </View>
  );
}

