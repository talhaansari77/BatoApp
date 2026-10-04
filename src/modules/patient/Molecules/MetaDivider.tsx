import { useAppTheme } from "@/app/providers/ThemeProvider";
import { useMemo } from "react";
import { View, StyleSheet } from "react-native";

export default function MetaDivider() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return <View style={styles.metaDivider} />;
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    metaDivider: {
      width: 1,
      height: 22,
      backgroundColor: theme.colors.border,
    },
  });
}
