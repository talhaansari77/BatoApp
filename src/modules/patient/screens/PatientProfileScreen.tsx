import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { AppIcon, AppIconName } from "../../../shared/ui/atoms/AppIcon";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { LanguageSelector } from "../../../shared/ui/molecules/LanguageSelector";
import { ThemeModeSelector } from "../../../shared/ui/molecules/ThemeModeSelector";
import { Screen } from "../../../shared/ui/templates/Screen";
import { useAuthStore } from "../../auth/store/auth.store";
import { useNavigation } from "@react-navigation/native";

// --- Types -----------------------------------------------------------

type ContactDetail = {
  id: string;
  label: string;
  value: string;
  icon: AppIconName;
};

type SummaryStat = {
  id: string;
  label: string;
  value: string;
  icon: AppIconName;
};

type AppointmentStatus = "completed" | "upcoming" | "cancelled";

type RecentAppointment = {
  id: string;
  day: string;
  month: string;
  year: string;
  title: string;
  doctorName: string;
  status: AppointmentStatus;
};

type QuickAction = {
  id: string;
  label: string;
  icon: AppIconName;
  onPress: () => void;
};

type ProfileTab = {
  id:
    | "overview"
    | "medicalInfo"
    | "appointments"
    | "treatments"
    | "invoices"
    | "history";
  label: string;
  icon: AppIconName;
};

// --- Static config / placeholder data --------------------------------
// Fields below aren't on the current auth-store User type (only
// full_name, full_mobile_number, patient_code, civil_id are confirmed).
// Everything else here is a placeholder until the backend/store exposes
// it — swap MOCK_PATIENT and the mock lists for real data as it lands.

const MOCK_PATIENT = {
  email: "patient@example.com",
  dob: "15/10/1998",
  gender: "Male",
  address: "Block 4, Street 12, Building 8, Jabriya, Kuwait",
  bloodType: "O+",
  allergies: "No Known Allergies",
  isVip: true,
  firstVisit: "12 Jan 2024",
  lastVisit: "15 May 2024",
  totalVisits: "8 Visits",
  totalSpent: "KWD 785",
};

const PROFILE_TABS: ProfileTab[] = [
  { id: "overview", label: "Overview", icon: "User" },
  { id: "medicalInfo", label: "Medical Info", icon: "HeartPulse" },
  { id: "appointments", label: "Appointments", icon: "CalendarDays" },
  { id: "treatments", label: "Treatments", icon: "Stethoscope" },
  { id: "invoices", label: "Invoices", icon: "CreditCard" },
  { id: "history", label: "History", icon: "Calendar" },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Expects dd/mm/yyyy, matching the format already used for DOB elsewhere
// in this app. Falls back gracefully on anything else.
function calculateAge(dob: string): string {
  const [day, month, year] = dob.split("/").map(Number);
  if (!day || !month || !year) return "—";

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());
  if (!hadBirthdayThisYear) age -= 1;

  return `${age} Years`;
}

export function PatientProfileScreen() {
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const { t } = useTranslation();

  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  const styles = useMemo(() => createStyles(theme), [theme]);
  const [activeTab, setActiveTab] = useState<ProfileTab["id"]>("overview");

  // Single source of truth for the screen, merging real user fields with
  // placeholders for anything not yet on the User type.
  const patient = useMemo(
    () => ({
      fullName: user?.full_name ?? "Guest Patient",
      phone: user?.full_mobile_number ?? "+965 9876 5432",
      patientCode: user?.patient_code ?? "PT-849201",
      civilId: user?.civil_id ?? "298101501234",
      email: (user as any)?.email ?? MOCK_PATIENT.email,
      dob: (user as any)?.dob ?? MOCK_PATIENT.dob,
      gender: (user as any)?.gender ?? MOCK_PATIENT.gender,
      address: (user as any)?.address ?? MOCK_PATIENT.address,
      bloodType: (user as any)?.bloodType ?? MOCK_PATIENT.bloodType,
      allergies: (user as any)?.allergies ?? MOCK_PATIENT.allergies,
      isVip: (user as any)?.isVip ?? MOCK_PATIENT.isVip,
    }),
    [user],
  );

  const initials = getInitials(patient.fullName);
  const ageLabel = calculateAge(patient.dob);

  const summaryStats: SummaryStat[] = [
    {
      id: "firstVisit",
      label: "First Visit",
      value: MOCK_PATIENT.firstVisit,
      icon: "Calendar",
    },
    {
      id: "lastVisit",
      label: "Last Visit",
      value: MOCK_PATIENT.lastVisit,
      icon: "Calendar",
    },
    {
      id: "totalVisits",
      label: "Total Visits",
      value: MOCK_PATIENT.totalVisits,
      icon: "Users",
    },
    {
      id: "totalSpent",
      label: "Total Spent",
      value: MOCK_PATIENT.totalSpent,
      icon: "CreditCard",
    },
  ];

  const contactLeft: ContactDetail[] = [
    { id: "phone", label: "Phone", value: patient.phone, icon: "Phone" },
    { id: "email", label: "Email", value: patient.email, icon: "Mail" },
    { id: "address", label: "Address", value: patient.address, icon: "MapPin" },
  ];

  const contactRight: ContactDetail[] = [
    { id: "dob", label: "Date of Birth", value: patient.dob, icon: "Calendar" },
    {
      id: "bloodType",
      label: "Blood Type",
      value: patient.bloodType,
      icon: "Droplet",
    },
    {
      id: "allergies",
      label: "Allergies",
      value: patient.allergies,
      icon: "ShieldCheck",
    },
  ];

  // Placeholder — swap for the real appointments feed once available here.
  const recentAppointments: RecentAppointment[] = [
    {
      id: "1",
      day: "15",
      month: "MAY",
      year: "2024",
      title: "Laser Hair Removal",
      doctorName: "Dr. Sarah Khan",
      status: "completed",
    },
    {
      id: "2",
      day: "08",
      month: "MAY",
      year: "2024",
      title: "HydraFacial Treatment",
      doctorName: "Dr. Fatima Ali",
      status: "completed",
    },
    {
      id: "3",
      day: "01",
      month: "MAY",
      year: "2024",
      title: "Skin Consultation",
      doctorName: "Dr. Leena Joseph",
      status: "completed",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      id: "book",
      label: "Book Appointment",
      icon: "CalendarDays",
      onPress: () => {},
    },
    {
      id: "records",
      label: "Medical Records",
      icon: "FileText",
      onPress: () =>
        navigation.navigate("ReportsApp", { screen: "MedicalReports" }),
    },
    {
      id: "payments",
      label: "Payment Methods",
      icon: "CreditCard",
      onPress: () => {},
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: "Bell",
      onPress: () => {},
    },
    {
      id: "support",
      label: "Help & Support",
      icon: "Headphones",
      onPress: () => {},
    },
  ];

  return (
    <Screen
      title={t("common.profile")}
      actions={[
        { icon: "Bell", onPress: () => {} },
        { icon: "MoreVertical", onPress: () => {} },
      ]}
      ShowAppHeader
      showBack
    >
      <View style={styles.root}>
        {/* Hero / identity card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroText}>
              <AppText variant="h2">{patient.fullName}</AppText>

              {patient.isVip ? (
                <View style={styles.vipBadge}>
                  <AppIcon
                    name="Crown"
                    size={14}
                    color={theme.colors.primaryDark}
                  />
                  <AppText variant="small" color={theme.colors.primaryDark}>
                    {t("profile.vipPatient")}
                  </AppText>
                </View>
              ) : null}

              <View style={styles.metaRow}>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  {patient.patientCode}
                </AppText>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  •
                </AppText>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  {ageLabel}
                </AppText>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  •
                </AppText>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  {patient.gender}
                </AppText>
              </View>
            </View>
            <View style={styles.avatar}>
              <AppText variant="h2" color={theme.colors.primaryDark}>
                {initials}
              </AppText>
            </View>
            {/* statusBadge */}
            {/* <View style={styles.statusBadge}>
              <AppText variant="small" color={theme.colors.successText}>
                Active
              </AppText>
            </View> */}
          </View>

          <View style={styles.divider} />

          <View style={styles.heroDetailRow}>
            <AppIcon name="Phone" size={16} color={theme.colors.textMuted} />
            <AppText variant="small" color={theme.colors.text}>
              {patient.phone}
            </AppText>
            <AppText variant="small" color={theme.colors.textMuted}>
              |
            </AppText>
            <AppIcon name="Mail" size={16} color={theme.colors.textMuted} />
            <AppText
              variant="small"
              color={theme.colors.text}
              style={styles.flexShrink}
            >
              {patient.email}
            </AppText>
          </View>

          <View style={styles.heroDetailRow}>
            <AppIcon name="MapPin" size={16} color={theme.colors.textMuted} />
            <AppText
              variant="small"
              color={theme.colors.text}
              style={styles.flexShrink}
            >
              {patient.address}
            </AppText>
          </View>
        </View>

        {/* Section tabs */}
        <View style={styles.heroCard}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsRow}
          >
            {PROFILE_TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  style={styles.tabItem}
                >
                  <AppIcon
                    name={tab.icon}
                    size={20}
                    color={
                      isActive
                        ? theme.colors.primaryDark
                        : theme.colors.textMuted
                    }
                  />
                  <AppText
                    variant="small"
                    color={
                      isActive
                        ? theme.colors.primaryDark
                        : theme.colors.textMuted
                    }
                  >
                    {/* {tab.label} */}
                    {t(`profile.${tab.id}`)}
                  </AppText>
                  {isActive ? <View style={styles.tabUnderline} /> : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
        {/* Only "Overview" has content wired up today — the other tabs are
            placeholders until their respective screens/data exist. */}
        {activeTab === "overview" ? (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <SectionHeader title={t("profile.patientSummary")} />
                
                <EditButton onPress={() => {}} />
              </View>

              <View style={styles.summaryGrid}>
                {summaryStats.map((stat) => (
                  <View key={stat.id} style={styles.summaryCell}>
                    <AppText variant="caption" color={theme.colors.textMuted}>
                      {stat.label}
                    </AppText>
                    <View style={styles.summaryValueRow}>
                      <AppIcon
                        name={stat.icon}
                        size={16}
                        color={theme.colors.primaryDark}
                      />
                      <AppText variant="bodyMedium">{stat.value}</AppText>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <SectionHeader title="Contact Information" />
                <EditButton onPress={() => {}} />
              </View>

              <View style={styles.card}>
                <View style={styles.contactColumns}>
                  <View style={styles.contactColumn}>
                    {contactLeft.map((item) => (
                      <ContactLine key={item.id} item={item} />
                    ))}
                  </View>
                  <View style={styles.contactColumn}>
                    {contactRight.map((item) => (
                      <ContactLine key={item.id} item={item} />
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <SectionHeader title="Recent Appointments" />
                <Pressable onPress={() => {}}>
                  <AppText variant="small" color={theme.colors.primaryDark}>
                    View All
                  </AppText>
                </Pressable>
              </View>

              <View style={styles.card}>
                {recentAppointments.map((appointment, index) => (
                  <AppointmentRow
                    key={appointment.id}
                    appointment={appointment}
                    showDivider={index !== recentAppointments.length - 1}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <SectionHeader title="Quick Actions" />

              <View style={styles.quickGrid}>
                {quickActions.map((action) => (
                  <QuickActionTile key={action.id} action={action} />
                ))}
              </View>
            </View>
          </>
        ) : null}

        <View style={styles.section}>
          <SectionHeader title={t("common.appearance")} />
          <AppText
            color={theme.colors.textMuted}
            style={styles.sectionDescription}
          >
            {t("profile.appearanceDescription")}
          </AppText>
          <ThemeModeSelector />
        </View>

        <View style={styles.section}>
          <SectionHeader title={t("common.language")} />
          <AppText
            color={theme.colors.textMuted}
            style={styles.sectionDescription}
          >
            {t("profile.languageDescription")}
          </AppText>
          <LanguageSelector />
        </View>

        <View style={styles.logoutCard}>
          <View style={styles.logoutInfo}>
            <View style={styles.logoutIcon}>
              <AppIcon name="LogOut" size={22} color={theme.colors.errorText} />
            </View>

            <View style={styles.cardText}>
              <AppText variant="bodyMedium">Logout</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Sign out from this device.
              </AppText>
            </View>
          </View>

          <AppButton
            title={isLoading ? "Logging out..." : "Logout"}
            variant="outline"
            loading={isLoading}
            disabled={isLoading}
            onPress={logout}
          />
        </View>
      </View>
    </Screen>
  );
}

// --- Subcomponents -----------------------------------------------------

function SectionHeader({ title }: { title: string }) {
  return <AppText variant="h3">{title}</AppText>;
}

function EditButton({ onPress }: { onPress: () => void }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable onPress={onPress} style={styles.editButton}>
      <AppIcon name="Pencil" size={14} color={theme.colors.primaryDark} />
      <AppText variant="small" color={theme.colors.primaryDark}>
        Edit
      </AppText>
    </Pressable>
  );
}

function ContactLine({ item }: { item: ContactDetail }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.contactLine}>
      <AppIcon name={item.icon} size={16} color={theme.colors.textMuted} />
      <AppText
        variant="small"
        color={theme.colors.text}
        style={styles.flexShrink}
      >
        {item.value}
      </AppText>
    </View>
  );
}

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  completed: "Completed",
  upcoming: "Upcoming",
  cancelled: "Cancelled",
};

function AppointmentRow({
  appointment,
  showDivider,
}: {
  appointment: RecentAppointment;
  showDivider: boolean;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const statusColor =
    appointment.status === "cancelled"
      ? theme.colors.errorText
      : theme.colors.successText;
  const statusBg =
    appointment.status === "cancelled"
      ? theme.colors.error
      : theme.colors.success;

  return (
    <View>
      <Pressable
        onPress={() => {}}
        style={({ pressed }) => [
          styles.appointmentRow,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.dateBlock}>
          <AppText variant="bodyMedium">{appointment.day}</AppText>
          <AppText variant="small" color={theme.colors.textMuted}>
            {appointment.month}
          </AppText>
          <AppText variant="small" color={theme.colors.textMuted}>
            {appointment.year}
          </AppText>
        </View>

        <View style={styles.cardText}>
          <AppText variant="bodyMedium">{appointment.title}</AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            {appointment.doctorName}
          </AppText>
        </View>

        <View style={[styles.statusChip, { backgroundColor: statusBg }]}>
          <AppText variant="small" color={statusColor}>
            {STATUS_LABEL[appointment.status]}
          </AppText>
        </View>

        <AppIcon name="ChevronRight" size={18} color={theme.colors.textMuted} />
      </Pressable>

      {showDivider ? <View style={styles.divider} /> : null}
    </View>
  );
}

function QuickActionTile({ action }: { action: QuickAction }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      onPress={action.onPress}
      style={({ pressed }) => [styles.quickTile, pressed && styles.pressed]}
    >
      <AppIcon name={action.icon} size={22} color={theme.colors.primaryDark} />
      <AppText variant="caption" align="center">
        {action.label}
      </AppText>
    </Pressable>
  );
}

// --- Styles --------------------------------------------------------------

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing["2xl"],
    },

    // Hero card
    heroCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius["2xl"],
      padding: theme.spacing["2xl"],
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    heroTopRow: {
      flexDirection: "row",
      gap: theme.spacing.lg,
      alignItems: "flex-start",
    },

    avatar: {
      width: 64,
      height: 64,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    heroText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    vipBadge: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },

    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      // flexWrap: "wrap",
      // backgroundColor:'red'
    },

    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.success,
      position: "absolute",
      bottom: -20,
      right: 5,
    },

    heroDetailRow: {
      flexDirection: "row",
      alignItems: "center",
      // alignSelf:'flex-end',
      gap: theme.spacing.xs,
    },

    flexShrink: {
      flexShrink: 1,
    },

    // Tabs
    tabsRow: {
      flexDirection: "row",
      gap: theme.spacing.xl,
      paddingHorizontal: theme.spacing.xs,
    },

    tabItem: {
      alignItems: "center",
      gap: theme.spacing.xs,
      paddingBottom: theme.spacing.sm,
    },

    tabUnderline: {
      height: 2,
      width: "100%",
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primaryDark,
    },

    // Shared section/card primitives
    section: {
      gap: theme.spacing.md,
    },

    sectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    sectionDescription: {
      marginTop: -theme.spacing.xs,
    },

    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
      ...(theme.shadows.card ?? {}),
    },

    cardText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
    },

    pressed: {
      opacity: 0.82,
    },

    editButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },

    // Patient Summary
    summaryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      ...(theme.shadows.card ?? {}),
    },

    summaryCell: {
      width: "50%",
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.sm,
    },

    summaryValueRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },

    // Contact Information
    contactColumns: {
      flexDirection: "row",
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
    },

    contactColumn: {
      flex: 1,
      gap: theme.spacing.md,
    },

    contactLine: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },

    // Recent Appointments
    appointmentRow: {
      minHeight: 76,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    dateBlock: {
      width: 48,
      alignItems: "center",
    },

    statusChip: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
    },

    // Quick Actions
    quickGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
    },

    quickTile: {
      width: "18%",
      minWidth: 64,
      flexGrow: 1,
      // aspectRatio: 0.95,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
      padding: theme.spacing.sm,
      ...(theme.shadows.card ?? {}),
    },

    // Logout
    logoutCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      ...(theme.shadows.card ?? {}),
    },

    logoutInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    logoutIcon: {
      width: 46,
      height: 46,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.error,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
