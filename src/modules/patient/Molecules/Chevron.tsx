import { useAppTheme } from "@/app/providers/ThemeProvider";
import { AppIcon } from "@/shared/ui/atoms/AppIcon";
import { View } from "react-native";
import { I18nManager } from "react-native";

export function Chevron({ expanded = false }: { expanded?: boolean }) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        transform: [
          { scaleX: I18nManager.isRTL ? -1 : 1 },
          { rotate: expanded ? "90deg" : "0deg" },
        ],
      }}
    >
      <AppIcon name="ChevronRight" size={18} color={theme.colors.textMuted} />
    </View>
  );
}