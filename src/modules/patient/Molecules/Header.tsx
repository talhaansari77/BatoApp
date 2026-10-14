import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { AppIcon } from "@/shared/ui/atoms/AppIcon";
import { AppText } from "@/shared/ui/atoms/AppText";
import { useAppTheme } from "@/app/providers/ThemeProvider";

const Header = ({ navigation, user }: any) => {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.welcomeTop}>
      <Pressable
        style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
        onPress={() => {
          navigation.navigate("PatientProfile");
        }}
      >
        <AppIcon name="UserRound" size={28} color={theme.colors.primaryDark} />
      </Pressable>

      <View style={styles.welcomeText}>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Good morning
        </AppText>

        <AppText variant="h3">
          {user?.full_name ? user?.full_name : "patient"}
        </AppText>
      </View>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          onPress={() => {}}
          hitSlop={12}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.cardMuted,
          }}
        >
          <AppIcon name="Search" color={theme.colors.primaryDark} />
        </Pressable>
        <Pressable
          onPress={() => {}}
          hitSlop={12}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.cardMuted,
          }}
        >
          <AppIcon name="Bell" color={theme.colors.primaryDark} />
        </Pressable>
      </View>
    </View>
  );
};

export default Header;

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing["2xl"],
    },

    welcomeCard: {
      gap: theme.spacing.lg,
    },

    welcomeTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    listContainer: {
      // paddingRight: 16, // Prevents cards from clipping at screen edges
      // paddingVertical: 8,
    },
    separator: {
      width: 20, // Spacing between doctor cards
    },

    avatar: {
      width: 54,
      height: 54,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.cardMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    welcomeText: {
      flex: 1,
    },

    heroBox: {
      borderRadius: theme.radius["2xl"],
      backgroundColor: theme.colors.nude,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.xl,
      flexDirection: "row",
      overflow: "hidden",
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    heroContent: {
      flex: 1,
      gap: theme.spacing.md,
    },

    heroBadge: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.card,
    },

    heroTitle: {
      maxWidth: 260,
    },

    heroText: {
      maxWidth: 260,
    },

    heroButton: {
      marginTop: theme.spacing.xs,
      paddingHorizontal: theme.spacing.xl,
    },

    heroIcon: {
      width: 78,
      height: 78,
      borderRadius: theme.radius["2xl"],
      backgroundColor: theme.colors.card,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },

    section: {
      gap: theme.spacing.md,
    },

    quickGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
    },

    quickCard: {
      width: "47.8%",
      minHeight: 128,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.xs,
      ...theme.shadows.card,
    },

    quickIcon: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.sm,
    },

    quickSubtitle: {
      marginTop: -2,
    },

    list: {
      gap: theme.spacing.md,
    },

    serviceCard: {
      minHeight: 78,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    serviceIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
    },

    cardText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    appointmentCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    appointmentIcon: {
      width: 50,
      height: 50,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
    },

    appointmentTime: {
      fontWeight: "600",
    },

    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.success,
    },

    progressCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    progressHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },

    progressTrack: {
      height: 9,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      overflow: "hidden",
    },

    progressFill: {
      width: "50%",
      height: "100%",
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primaryDark,
    },

    progressFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },

    inlineInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },

    specialistList: {
      gap: theme.spacing.md,
    },

    specialistCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      ...theme.shadows.card,
    },

    specialistAvatar: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
    },

    specialistMeta: {
      alignItems: "flex-end",
      gap: theme.spacing.xs,
    },

    recommendationCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.info,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },

    recommendationIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      alignItems: "center",
      justifyContent: "center",
    },

    pressed: {
      opacity: 0.8,
      transform: [{ scale: 0.99 }],
    },
  });
}
