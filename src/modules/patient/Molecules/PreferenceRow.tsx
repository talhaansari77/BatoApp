import { Pressable, View ,StyleSheet} from "react-native";
import { useAppTheme } from "@/app/providers/ThemeProvider";
import { AppText } from "@/shared/ui/atoms/AppText";
import { Chevron } from "./Chevron";
import { useMemo } from "react";

export function PreferenceRow({
  label,
  value,
  isExpanded,
  onPress,
  children,
}: {
  label: string;
  value: string;
  isExpanded: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressedRow]}
      >
        <AppText variant="bodyMedium">{label}</AppText>
        <View style={styles.preferenceRight}>
          <AppText color={theme.colors.textMuted}>{value}</AppText>
          <Chevron expanded={isExpanded} />
        </View>
      </Pressable>

      {isExpanded ? <View style={styles.expandedBody}>{children}</View> : null}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    row: {
      minHeight: 52,
      paddingHorizontal: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },
     pressedRow: {
      backgroundColor: theme.colors.cardMuted,
    },
    preferenceRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    expandedBody: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
  })
}