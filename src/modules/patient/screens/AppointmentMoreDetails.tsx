import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { AppIcon, AppIconName } from "../../../shared/ui/atoms/AppIcon";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { Screen } from "../../../shared/ui/templates/Screen";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PatientStackParamList } from "@/core/navigation/navigation.types";
import { usePatientAppointmentStore } from "../store/patientAppointment.store";

/* ------------------------------------------------------------------ */
/* Static mock data from the design (UI only)                          */
/* ------------------------------------------------------------------ */

type Tone = "default" | "strong" | "accent" | "success";

type Row = {
  label: string;
  value: string;
  tone?: Tone;
  badge?: "warning";
};

type IconRowData = {
  icon: AppIconName;
  label: string;
  value: string;
  tone?: Tone;
};

type TabKey = "overview" | "patient" | "service" | "more";

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "patient", label: "Patient" },
  { key: "service", label: "Service" },
  { key: "more", label: "More" },
];

// const scheduleRows: Row[] = [
//   { label: "Appointment Date (Start)", value: "24 Sep 2026" },
//   { label: "Appointment Time (Start)", value: "01:30 AM" },
//   { label: "Appointment Date (End)", value: "24 Sep 2026" },
//   { label: "Appointment Time (End)", value: "02:00 AM" },
//   { label: "Start & End Between", value: "02:00 AM ," },
// ];

// const statusRows: IconRowData[] = [
//   { icon: "ClipboardList", label: "Appointment Number", value: "BATO-21931" },
//   {
//     icon: "CircleCheck",
//     label: "Appointment Status",
//     value: "1 (Active)",
//     tone: "success",
//   },
//   { icon: "Hourglass", label: "Progress Status", value: "1" },
//   { icon: "Gauge", label: "Urgency Level", value: "Normal" },
//   { icon: "CircleDot", label: "Current Status", value: "Active" },
//   { icon: "Clock", label: "Status", value: "1" },
//   { icon: "Headset", label: "Call Center Status", value: "1" },
// ];

// const patientRows: Row[] = [
//   { label: "Full Name", value: "طلحه سيف الدين اسري 12337" },
//   { label: "Patient ID", value: "12290" },
//   { label: "Civil ID", value: "001399042303" },
//   { label: "Date of Birth", value: "14 Jan 2026" },
//   { label: "Mobile Number", value: "65910095" },
//   { label: "Gender", value: "Male" },
//   { label: "Nationality", value: "—" },
// ];

// const medicalRows: IconRowData[] = [
//   { icon: "Ban", label: "Allergies", value: "N/A", tone: "accent" },
//   { icon: "FileText", label: "Medical History", value: "N/A", tone: "accent" },
//   { icon: "NotebookPen", label: "Notes", value: "N/A", tone: "accent" },
// ];

// const serviceRows: IconRowData[] = [
//   { icon: "CalendarCheck", label: "Sessions Count", value: "5" },
//   { icon: "Hash", label: "Service ID", value: "5" },
//   { icon: "Stethoscope", label: "Doctor ID", value: "13" },
//   { icon: "Cpu", label: "Machine ID", value: "—" },
// ];

// const feeRows: Row[] = [
//   { label: "Appointment Fees", value: "0.000 KD" },
//   { label: "Extra Fees", value: "0.000 KD" },
// ];

const paymentRows: Row[] = [
  { label: "Payment Type", value: "N/A" },
  { label: "Payment Status", value: "Pending", badge: "warning" },
  { label: "Paid Amount", value: "—" },
  { label: "Due Amount", value: "250.000 KD", tone: "accent" },
  { label: "Total Amount", value: "650.000 KD", tone: "accent" },
];

const paymentDetailRows: IconRowData[] = [
  { icon: "CalendarCheck", label: "Payment Type Session", value: "—" },
  { icon: "CircleDot", label: "Payment Course Status", value: "0" },
];

const sessionRows: IconRowData[] = [
  { icon: "CalendarCheck", label: "Appointment Course Status", value: "0" },
  { icon: "CalendarCheck", label: "Stock Assigned", value: "0" },
  { icon: "CalendarCheck", label: "Extra Sessions", value: "0" },
  { icon: "CalendarCheck", label: "Extra Sessions Notes", value: "—" },
  { icon: "CalendarCheck", label: "Free Session", value: "0" },
  { icon: "Hash", label: "Free Session Number", value: "—" },
];

const notesRows: Row[] = [
  { label: "Note", value: "N/A" },
  { label: "Note Allergy", value: "N/A" },
  { label: "Note History", value: "N/A" },
  { label: "Cancellation Reason", value: "N/A" },
  { label: "Description", value: "N/A" },
];

const departmentRows: Row[] = [
  { label: "Consult Department", value: "—" },
  { label: "Arboon Department", value: "—" },
  { label: "Service Offer", value: "—" },
];

const miscRows: Row[] = [
  { label: "Is Closed Slot", value: "0" },
  { label: "Transfer ID", value: "—" },
  { label: "Clinic ID", value: "1" },
  { label: "Call Center Staff ID", value: "—" },
];

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */
type props = NativeStackScreenProps<
  PatientStackParamList,
  "AppointmentMoreDetails"
>;
export function AppointmentMoreDetails({ route }: props) {
  const appointmentId = route?.params?.appointmentId;
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [appointment, setAppointment] = useState<any>();
  const appointments = usePatientAppointmentStore(
    (state) => state.appointments,
  );
  // Only state in this file: which tab is showing.
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  useEffect(() => {
    setAppointment(() => appointments.find((a: any) => a.id == appointmentId));
  }, []);

  return (
    <Screen title="Appointment Details" showBack onBackPress={() => {}}>
      <View style={styles.root}>
        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const selected = tab.key === activeTab;

            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                style={({ pressed }) => [
                  styles.tab,
                  selected && styles.tabActive,
                  pressed && styles.pressed,
                ]}
              >
                <AppText
                  variant="caption"
                  color={selected ? theme.colors.card : theme.colors.textMuted}
                  style={selected ? styles.bold : undefined}
                >
                  {tab.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        {activeTab === "overview" ? <OverviewTab info={appointment} /> : null}
        {activeTab === "patient" ? <PatientTab info={appointment} /> : null}
        {activeTab === "service" ? <ServiceTab info={appointment} /> : null}
        {activeTab === "more" ? <MoreTab info={appointment} /> : null}
      </View>
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

function OverviewTab({ info }: any) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const scheduleRows: Row[] = [
    { label: "Appointment Date (Start)", value: info?.appointment_start_date },
    { label: "Appointment Time (Start)", value: info?.appointment_start_time },
    { label: "Appointment Date (End)", value: info?.appointment_end_date },
    { label: "Appointment Time (End)", value: info?.appointment_end_time },
    {
      label: "Start & End Between",
      value: info?.appointment_start_between_end,
    },
  ];
  const statusRows: IconRowData[] = [
    {
      icon: "ClipboardList",
      label: "Appointment Number",
      value: info?.appointment_number,
    },
    {
      icon: "CircleCheck",
      label: "Appointment Status",
      value: `${info?.appointment_status} `,
      tone: "success",
    },
    {
      icon: "Hourglass",
      label: "Progress Status",
      value: String(info?.appointment_progress_status),
    },
    { icon: "Gauge", label: "Urgency Level", value: info?.urgency_level },
    { icon: "CircleDot", label: "Current Status", value: info?.current_status },
    { icon: "Clock", label: "Status", value: String(info?.status) },
    {
      icon: "Headset",
      label: "Call Center Status",
      value: info?.call_center_status,
    },
  ];

  return (
    <SectionCard icon="CalendarDays" title="Schedule Information">
      <RowList rows={scheduleRows} />

      <View style={styles.insetBox}>
        <IconRowList rows={statusRows} />
      </View>
    </SectionCard>
  );
}

function PatientTab({ info }: any) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const patientRows: Row[] = [
    { label: "Full Name", value: info?.full_name },
    { label: "Patient ID", value: String(info?.patient_id) },
    { label: "Civil ID", value: info?.civil_id },
    { label: "Date of Birth", value: info?.dob },
    { label: "Mobile Number", value: info?.mobile_number },
    { label: "Gender", value: "Male" }, // Not in API payload, keep default
    { label: "Nationality", value: "—" }, // Not in API payload, keep default
  ];

  const medicalRows: IconRowData[] = [
    {
      icon: "Ban",
      label: "Allergies",
      value: info?.note_allergy,
      tone: "accent",
    },
    {
      icon: "FileText",
      label: "Medical History",
      value: info?.note_history,
      tone: "accent",
    },
    { icon: "NotebookPen", label: "Notes", value: info?.note, tone: "accent" },
  ];
  return (
    <SectionCard icon="UserRound" title="Patient Information">
      <RowList rows={patientRows} />

      <View style={styles.insetBox}>
        <View style={styles.stack}>
          {medicalRows.map((row) => (
            <View key={row.label} style={styles.stackItem}>
              <View style={styles.iconTileSmall}>
                <AppIcon
                  name={row.icon}
                  size={20}
                  color={
                    row.label === "Allergies"
                      ? theme.colors.errorText
                      : theme.colors.primaryDark
                  }
                />
              </View>

              <View style={styles.stackText}>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  {row.label}
                </AppText>
                <AppText variant="caption" color={theme.colors.primaryDark}>
                  {row.value}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SectionCard>
  );
}

function ServiceTab({ info }: any) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const serviceRows: IconRowData[] = [
    {
      icon: "CalendarCheck",
      label: "Sessions Count",
      value: String(info?.sessions_count),
    },
    { icon: "Hash", label: "Service ID", value: String(info?.service_id) },
    { icon: "Stethoscope", label: "Doctor ID", value: String(info?.doctor_id) },
    {
      icon: "Cpu",
      label: "Machine ID",
      value: info?.machine_id ? String(info?.machine_id) : "—",
    },
  ];

  const feeRows: Row[] = [
    { label: "Appointment Fees", value: `${info?.appointment_fees} KD` },
    { label: "Extra Fees", value: `${info?.appointment_extra_fees} KD` },
  ];
  return (
    <SectionCard icon="Sparkles" title="Service Information">
      <View style={styles.serviceName}>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Service Name
        </AppText>
        <AppText variant="bodyMedium" style={styles.bold}>
          Hair Treatment - 650 KD
        </AppText>
      </View>

      <View style={styles.divider} />

      <View style={styles.stack}>
        {serviceRows.map((row, index) => (
          <View key={row.label}>
            <View style={styles.stackItem}>
              <AppIcon
                name={row.icon}
                size={22}
                color={theme.colors.primaryDark}
              />

              <View style={styles.stackText}>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  {row.label}
                </AppText>
                <AppText variant="bodyMedium">{row.value}</AppText>
              </View>
            </View>

            {index < serviceRows.length - 1 ? (
              <View style={[styles.divider, styles.stackDivider]} />
            ) : null}
          </View>
        ))}
      </View>

      <View style={styles.insetBox}>
        <AppText variant="bodyMedium" style={styles.bold}>
          Additional Fees
        </AppText>
        <RowList rows={feeRows} compact />
      </View>

      <View style={styles.insetBox}>
        <View style={styles.stackItem}>
          <AppIcon name="Tag" size={20} color={theme.colors.primaryDark} />

          <View style={styles.stackText}>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Consult Department
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              —
            </AppText>

            <View style={styles.spacerSm} />

            <AppText variant="caption" color={theme.colors.textMuted}>
              Offer ID
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              —
            </AppText>
          </View>
        </View>
      </View>
    </SectionCard>
  );
}

function MoreTab({ info }: any) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const paymentRows: Row[] = [
    { label: "Payment Type", value: info?.payment_type },
    { label: "Payment Status", value: info?.payment_status, badge: "warning" },
    {
      label: "Paid Amount",
      value: info?.paid_amount ? `${info?.paid_amount} KD` : "—",
    },
    { label: "Due Amount", value: `${info?.due_amount} KD`, tone: "accent" },
    { label: "Total Amount", value: `${info?.full_amount} KD`, tone: "accent" },
  ];

  const paymentDetailRows: IconRowData[] = [
    {
      icon: "CalendarCheck",
      label: "Payment Type Session",
      value: info?.payment_type_session ?? "—",
    },
    {
      icon: "CircleDot",
      label: "Payment Course Status",
      value: String(info?.appointment_course_status),
    },
  ];

  const sessionRows: IconRowData[] = [
    {
      icon: "CalendarCheck",
      label: "Appointment Course Status",
      value: String(info?.appointment_course_status),
    },
    {
      icon: "CalendarCheck",
      label: "Stock Assigned",
      value: String(info?.stock_assigned),
    },
    {
      icon: "CalendarCheck",
      label: "Extra Sessions",
      value: String(info?.extra_sessions),
    },
    {
      icon: "CalendarCheck",
      label: "Extra Sessions Notes",
      value: info?.extra_sessions_notes || "—",
    },
    {
      icon: "CalendarCheck",
      label: "Free Session",
      value: String(info?.is_free_session),
    },
    {
      icon: "Hash",
      label: "Free Session Number",
      value: info?.free_session_number
        ? String(info?.free_session_number)
        : "—",
    },
  ];

  const notesRows: Row[] = [
    { label: "Note", value: info?.note },
    { label: "Note Allergy", value: info?.note_allergy },
    { label: "Note History", value: info?.note_history },
    { label: "Cancellation Reason", value: info?.cancellation_reason },
    { label: "Description", value: info?.description },
  ];

  const departmentRows: Row[] = [
    { label: "Consult Department", value: info?.consult_department || "—" },
    { label: "Arboon Department", value: info?.arboon_department ?? "—" },
    {
      label: "Service Offer",
      value: info?.offer_id
        ? `${info?.offer_id} (${info?.offer_amount} KD)`
        : "—",
    },
  ];

  const miscRows: Row[] = [
    { label: "Is Closed Slot", value: String(info?.is_closed_slot) },
    {
      label: "Transfer ID",
      value: info?.transfer_id ? String(info?.transfer_id) : "—",
    },
    { label: "Clinic ID", value: String(info?.clinic_id) },
    {
      label: "Call Center Staff ID",
      value: info?.call_center_staff_id
        ? String(info?.call_center_staff_id)
        : "—",
    },
  ];
  return (
    <>
      <SectionCard icon="CreditCard" title="Payment Information">
        <RowList rows={paymentRows} />

        <View style={styles.insetBox}>
          <SubHeading icon="Package" title="Payment Details" />
          <IconRowList rows={paymentDetailRows} />
        </View>

        <SubHeading icon="ClipboardList" title="Session & Course" />
        <IconRowList rows={sessionRows} />
      </SectionCard>

      <SectionCard icon="FileText" title="Notes & Additional Info">
        <RowList rows={notesRows} />
        <View style={styles.divider} />
        <RowList rows={departmentRows} />
        <View style={styles.divider} />
        <RowList rows={miscRows} />
      </SectionCard>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: AppIconName;
  title: string;
  children: React.ReactNode;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconTile}>
          <AppIcon name={icon} size={22} color={theme.colors.primaryDark} />
        </View>

        <AppText variant="h3" style={styles.bold}>
          {title}
        </AppText>
      </View>

      <View style={styles.divider} />

      {children}
    </View>
  );
}

function SubHeading({ icon, title }: { icon: AppIconName; title: string }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.subHeading}>
      <View style={styles.iconTileSmall}>
        <AppIcon name={icon} size={18} color={theme.colors.primaryDark} />
      </View>

      <AppText variant="bodyMedium" style={styles.bold}>
        {title}
      </AppText>
    </View>
  );
}

function RowList({ rows, compact }: { rows: Row[]; compact?: boolean }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={compact ? styles.rowListCompact : styles.rowList}>
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <AppText variant="caption" color={theme.colors.textMuted}>
            {row.label}
          </AppText>

          {row.badge === "warning" ? (
            <View style={styles.warningBadge}>
              <AppText variant="small" color={theme.colors.warningText}>
                • {row.value}
              </AppText>
            </View>
          ) : (
            <AppText
              variant="caption"
              color={toneColor(row.tone, theme)}
              style={[
                styles.value,
                row.tone && row.tone !== "default" ? styles.bold : undefined,
              ]}
            >
              {row.value}
            </AppText>
          )}
        </View>
      ))}
    </View>
  );
}

function IconRowList({ rows }: { rows: IconRowData[] }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.iconRowList}>
      {rows.map((row) => (
        <View key={row.label} style={styles.iconRow}>
          <View style={styles.iconTileSmall}>
            <AppIcon
              name={row.icon}
              size={16}
              color={theme.colors.primaryDark}
            />
          </View>

          <AppText
            variant="caption"
            color={theme.colors.textMuted}
            style={styles.iconRowLabel}
          >
            {row.label}
          </AppText>

          <AppText
            variant="caption"
            color={toneColor(row.tone, theme)}
            style={styles.value}
          >
            {row.value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function toneColor(
  tone: Tone | undefined,
  theme: ReturnType<typeof useAppTheme>,
) {
  switch (tone) {
    case "accent":
      return theme.colors.primaryDark;
    case "success":
      return theme.colors.successText;
    default:
      return undefined;
  }
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing.lg,
    },

    bold: {
      fontWeight: "700",
    },

    pressed: {
      opacity: 0.82,
    },

    tabBar: {
      flexDirection: "row",
      padding: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    tab: {
      flex: 1,
      minHeight: 44,
      borderRadius: theme.radius.full,
      alignItems: "center",
      justifyContent: "center",
    },

    tabActive: {
      backgroundColor: theme.colors.primaryDark,
    },

    card: {
      borderRadius: theme.radius["2xl"],
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
      ...(theme.shadows.card ?? {}),
    },

    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    iconTile: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
    },

    iconTileSmall: {
      width: 32,
      height: 32,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
    },

    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
    },

    insetBox: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.cardMuted,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },

    rowList: {
      gap: theme.spacing.lg,
    },

    rowListCompact: {
      gap: theme.spacing.sm,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },

    value: {
      flexShrink: 1,
      textAlign: "right",
      writingDirection: "auto",
    },

    warningBadge: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.warning,
    },

    iconRowList: {
      gap: theme.spacing.md,
    },

    iconRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    iconRowLabel: {
      flex: 1,
    },

    subHeading: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    stack: {
      gap: theme.spacing.md,
    },

    stackItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing.md,
    },

    stackText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    stackDivider: {
      marginTop: theme.spacing.md,
    },

    serviceName: {
      gap: theme.spacing.xs,
    },

    spacerSm: {
      height: theme.spacing.sm,
    },
  });
}
