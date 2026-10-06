import { useAppTheme } from "@/app/providers/ThemeProvider";
import { AppText } from "@/shared/ui/atoms/AppText";

export function SectionLabel({ title }: { title: string }) {
  const theme = useAppTheme();

  return (
    <AppText
      variant="small"
      color={theme.colors.textMuted}
      style={{
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: theme.spacing.xs,
        marginLeft: theme.spacing.xs,
      }}
    >
      {title}
    </AppText>
  );
}
