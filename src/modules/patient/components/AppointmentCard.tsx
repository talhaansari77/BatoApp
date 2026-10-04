import { ThemeMode, useAppTheme } from "@/app/providers/ThemeProvider";
import { AppIcon } from "@/shared/ui/atoms/AppIcon";
import { AppText } from "@/shared/ui/atoms/AppText";
import { AppColors, spacing, radius, shadows, typography } from "@/theme";
import { useMemo } from "react";
import { ColorSchemeName, Pressable, View,StyleSheet } from "react-native";
import MetaItem from "../Molecules/MetaItem";

type AppointmentCardProps = {
  onPress?: () => void;
  appointmentNo: string;
  patientName: string;
  patientId?: string;
  service: string;
  priceKd: number;
  timeRange: string;
  room: string;
  doctor: string;
  sessions: number;
  priority: string;
  statusLabel: string;
  statusTextColor: string;
  isActive?: boolean;
};

export default function AppointmentCard({
  onPress,
  appointmentNo,
  patientName,
  patientId,
  service,
  priceKd,
  timeRange,
  room,
  doctor,
  sessions,
  priority,
  statusLabel,
  statusTextColor,
  isActive = false,
}: AppointmentCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
    onPress={onPress}
      style={({ pressed }) => [
        styles.appointmentCard,
        isActive && styles.appointmentCardActive,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.appointmentTop}>
        <View style={[styles.avatar, isActive && styles.avatarActive]}>
          <AppText variant="bodyMedium" color={theme.colors.primaryDark}>
            {patientName.slice(0, 2)}
          </AppText>
        </View>

        <View style={styles.appointmentContent}>
          <View style={styles.titleRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: theme.colors.background },
              ]}
            >
              <AppText variant="small" color={statusTextColor}>
                {statusLabel}
              </AppText>
            </View>

            <View style={styles.appointmentNoRow}>
              <AppText variant="caption" color={theme.colors.textMuted}>
                {appointmentNo}
              </AppText>

              <AppIcon
                name="ChevronRight"
                size={18}
                color={theme.colors.textMuted}
              />
            </View>
          </View>

          <AppText variant="bodyMedium" style={styles.patientName}>
            {patientId ? `${patientName} ${patientId}` : patientName}
          </AppText>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {service} - {priceKd} KD
          </AppText>
        </View>
      </View>

      <View style={styles.metaSection}>
        <MetaItem icon="Clock" label={timeRange} />
        <MetaDivider />
        <MetaItem icon="DoorOpen" label={room} />
      </View>

      <View style={styles.metaSection}>
        <MetaItem icon="UserRound" label={doctor} />
        <MetaDivider />
        <MetaItem
          icon="ClipboardList"
          label={`${sessions} ${sessions === 1 ? "Session" : "Sessions"}`}
        />
        <MetaDivider />
        <MetaItem icon="Flag" label={priority} />
      </View>
    </Pressable>
  );
}

function MetaDivider() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return <View style={styles.metaDivider} />;
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    appointmentCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    appointmentCardActive: {
      backgroundColor: theme.colors.cardMuted,
    },

    appointmentTop: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },

    avatar: {
      width: 56,
      height: 56,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
    },

    avatarActive: {
      backgroundColor: theme.colors.card,
    },

    appointmentContent: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
    },

    statusBadge: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
    },

    appointmentNoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },

    patientName: {
      fontWeight: "700",
      writingDirection: "auto",
    },
    metaSection: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },

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


