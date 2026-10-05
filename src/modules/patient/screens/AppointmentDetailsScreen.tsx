import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { AppIcon, AppIconName } from "../../../shared/ui/atoms/AppIcon";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { Screen } from "../../../shared/ui/templates/Screen";
import { PatientStackParamList } from "@/core/navigation/navigation.types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { usePatientAppointmentStore } from "../store/patientAppointment.store";

const findAppointment = (a: any, aId: any, setAppointment: any) => {
  let result = a.find((a: any) => a.id == aId);
  let newResult = {
    appointmentNo: result?.appointment_number,
    statusLabel: result?.current_status,
    initials: "ط س",
    patientName: result?.full_name,
    patientId: result?.patient_id,
    fileNo: result?.file_number,
    date: result?.date,
    time: result?.time12,
    room: result?.room_id,
    priority: "null",
    treatment: result?.service_name,
    sessions: result?.sessions_count,
    subTotal: result?.sub_total,
    discount: result?.discount_amount,
    extraAmount: result?.extra_amount,
    fullAmount: result?.full_amount,
    paidAmount: result?.paid_amount,
    dueAmount: result?.due_amount,
  };
  setAppointment(newResult);
};

type props = NativeStackScreenProps<
  PatientStackParamList,
  "AppointmentDetails"
>;

export function AppointmentDetailsScreen({ navigation, route }: props) {
  const appointmentId = route?.params?.appointmentId;
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [appointment, setAppointment] = useState<any>();

  const appointments = usePatientAppointmentStore(
    (state) => state.appointments,
  );

  useEffect(() => {
    findAppointment(appointments, appointmentId, setAppointment);
  }, []);

  return (
    <Screen
      title="Appointment Details"
      showBack
      onBackPress={() => {}}
      actions={[{ icon: "Ellipsis", onPress: () => {} }]}
      footer={
        <AppButton
          title="View Details"
          onPress={() => {
            navigation.navigate("AppointmentMoreDetails", {
              appointmentId: appointmentId,
            });
          }}
        />
      }
    >
      <View style={styles.card}>
        {/* Status + appointment no. */}
        <View style={styles.topRow}>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <AppText variant="small" color={theme.colors.successText}>
              {appointment?.statusLabel}
            </AppText>
          </View>

          <AppText variant="bodyMedium" style={styles.bold}>
            {appointment?.appointmentNo}
          </AppText>
        </View>

        {/* Patient */}
        <View style={styles.patientRow}>
          <View style={styles.avatar}>
            <AppText variant="h3" color={theme.colors.primaryDark}>
              {appointment?.initials}
            </AppText>
          </View>

          <View style={styles.patientInfo}>
            <AppText variant="h3" style={styles.patientName}>
              {appointment?.patientName}
            </AppText>

            <View style={styles.idRow}>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Patient ID: {appointment?.patientId}
              </AppText>
              <View style={styles.inlineDivider} />
              <AppText variant="caption" color={theme.colors.textMuted}>
                File No: {appointment?.fileNo}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Schedule */}
        <View style={styles.scheduleRow}>
          <View style={styles.scheduleLeft}>
            <AppIcon
              name="CalendarDays"
              size={20}
              color={theme.colors.primaryDark}
            />
            <View style={styles.scheduleText}>
              <AppText variant="bodyMedium" style={styles.bold}>
                {appointment?.date}
              </AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                {appointment?.time}
              </AppText>
            </View>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.scheduleRight}>
            <InfoLine icon="DoorOpen" label={appointment?.room} />
            <InfoLine icon="Flag" label={appointment?.priority} />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Treatment */}
        <View style={styles.treatmentRow}>
          <View style={styles.treatmentIcon}>
            <AppIcon
              name="Sparkles"
              size={26}
              color={theme.colors.primaryDark}
            />
          </View>

          <View style={styles.treatmentText}>
            <AppText variant="bodyMedium" style={styles.bold}>
              {appointment?.treatment}
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {appointment?.sessions}
            </AppText>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Payment summary */}
        <View style={styles.summaryBox}>
          <SummaryRow label="Sub Total" value={appointment?.subTotal} />
          <SummaryRow label="Discount" value={appointment?.discount} />
          <SummaryRow label="Extra Amount" value={appointment?.extraAmount} />

          <View style={styles.divider} />

          <SummaryRow
            label="Full Amount"
            value={appointment?.fullAmount}
            strong
          />

          <View style={styles.divider} />

          <SummaryRow label="Paid Amount" value={appointment?.paidAmount} />
          <SummaryRow label="Due Amount" value={appointment?.dueAmount} accent />
        </View>
      </View>
    </Screen>
  );
}

function InfoLine({ icon, label }: { icon: AppIconName; label: string }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.infoLine}>
      <AppIcon name={icon} size={18} color={theme.colors.primaryDark} />
      <AppText variant="caption" color={theme.colors.textMuted}>
        {label}
      </AppText>
    </View>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
  strong?: boolean;
  accent?: boolean;
};

function SummaryRow({ label, value, strong, accent }: SummaryRowProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const color = accent
    ? theme.colors.primaryDark
    : strong
      ? undefined
      : theme.colors.textMuted;

  return (
    <View style={styles.summaryRow}>
      <AppText
        variant={strong ? "bodyMedium" : "caption"}
        color={color}
        style={strong || accent ? styles.bold : undefined}
      >
        {label}
      </AppText>

      <AppText
        variant={strong ? "bodyMedium" : "caption"}
        color={color}
        style={strong || accent ? styles.bold : undefined}
      >
        {value}
      </AppText>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    card: {
      borderRadius: theme.radius["2xl"],
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
      ...(theme.shadows.card ?? {}),
    },

    bold: {
      fontWeight: "700",
    },

    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
    },

    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.success,
    },

    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.successText,
    },

    patientRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.lg,
    },

    avatar: {
      width: 80,
      height: 80,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
    },

    patientInfo: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    patientName: {
      fontWeight: "700",
      writingDirection: "auto",
    },

    idRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },

    inlineDivider: {
      width: 1,
      height: 14,
      backgroundColor: theme.colors.border,
    },

    scheduleRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    scheduleLeft: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing.md,
    },

    scheduleText: {
      gap: theme.spacing.xs,
    },

    verticalDivider: {
      width: 1,
      alignSelf: "stretch",
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.lg,
    },

    scheduleRight: {
      gap: theme.spacing.md,
      minWidth: 110,
    },

    infoLine: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },

    treatmentRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    treatmentIcon: {
      width: 56,
      height: 56,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
    },

    treatmentText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    summaryBox: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.cardMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },

    summaryRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });
}
