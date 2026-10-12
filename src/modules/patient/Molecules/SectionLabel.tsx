import { useAppLanguage } from "@/app/providers/LanguageProvider";
import { useAppTheme } from "@/app/providers/ThemeProvider";
import { AppText } from "@/shared/ui/atoms/AppText";
import { useEffect } from "react";
import { View } from "react-native";

export function SectionLabel({ title }: { title: string }) {
  const theme = useAppTheme();
const { isRTL } = useAppLanguage();

// useEffect(() => {
//   console.log("SectionLabel", isRTL);
// }, [isRTL]);


  return (
   

    <AppText
      variant="small"
      color={theme.colors.textMuted}
      style={{
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: theme.spacing.xs,
        marginLeft: theme.spacing.xs,
        direction: "ltr",
      }}
    >
      {title}
    </AppText>
  );
}
