import React, { useMemo, useState } from "react";
import { I18nManager, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { AppIcon, AppIconName } from "../../../shared/ui/atoms/AppIcon";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { LanguageSelector } from "../../../shared/ui/molecules/LanguageSelector";
import { ThemeModeSelector } from "../../../shared/ui/molecules/ThemeModeSelector";
import { Screen } from "../../../shared/ui/templates/Screen";
import { useAuthStore } from "../../auth/store/auth.store";
import { EditProfileModal, EditProfileData } from "../components/EditProfileModal";
import { SectionLabel } from "../Molecules/SectionLabel";
import { InfoRow } from "../Molecules/InfoRow";
import { Chevron } from "../Molecules/Chevron";
import { PreferenceRow } from "../Molecules/PreferenceRow";

// --- Types & Placeholder Data ------------------------------------------

const MOCK_PATIENT = {
  dob: "15/10/1998",
  gender: "Male",
  nationality: "Kuwait",
  firstVisit: "12 Jan 2023",
  lastVisit: "15 May 2024",
  totalVisits: "14",
  totalSpent: "KWD 420.00",
  bloodType: "O+",
  allergies: "Penicillin, Peanuts",
};

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  ar: "العربية",
};

type PreferenceId = "language" | "appearance";

type CareItemId =
  | "personalSummary"
  | "treatments"
  | "medicalInfo"
  | "documents";

type CareItem = {
  id: CareItemId;
  label: string;
  icon: AppIconName;
  isExpandable: boolean;
  onPress?: () => void;
};

type SummaryStat = {
  id: string;
  label: string;
  value: string;
  icon: AppIconName;
};

type RecentAppointment = {
  id: string;
  day: string;
  month: string;
  year: string;
  title: string;
  doctorName: string;
  status: string;
};

type ContactDetail = {
  id: string;
  label: string;
  value: string;
  icon: AppIconName;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function PatientProfileScreen() {
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const { t, i18n } = useTranslation();

  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const [expandedPreference, setExpandedPreference] =
    useState<PreferenceId | null>(null);
  const [expandedCareId, setExpandedCareId] = useState<CareItemId | null>(null);

  // Edit Profile Modal States
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [profileOverride, setProfileOverride] = useState<{
    fullName?: string;
    dob?: string;
    gender?: string;
    nationality?: string;
  }>({});

  const patient = useMemo(
    () => ({
      fullName: profileOverride.fullName ?? user?.full_name ?? "Guest Patient",
      patientCode: user?.patient_code ?? "PT-849201",
      dob: profileOverride.dob ?? (user as any)?.dob ?? MOCK_PATIENT.dob,
      gender: profileOverride.gender ?? (user as any)?.gender ?? MOCK_PATIENT.gender,
      nationality: profileOverride.nationality ?? (user as any)?.nationality ?? MOCK_PATIENT.nationality,
      firstVisit: MOCK_PATIENT.firstVisit,
      lastVisit: MOCK_PATIENT.lastVisit,
      totalVisits: MOCK_PATIENT.totalVisits,
      totalSpent: MOCK_PATIENT.totalSpent,
      bloodType: (user as any)?.bloodType ?? MOCK_PATIENT.bloodType,
      allergies: (user as any)?.allergies ?? MOCK_PATIENT.allergies,
    }),
    [user, profileOverride],
  );

  const handleSaveProfile = (updated: EditProfileData) => {
    updateUser({
      full_name: updated.fullName,
      dob: updated.dob,
      gender: updated.gender,
      nationality: updated.nationality,
    });

    setProfileOverride(updated);
    setIsEditModalVisible(false);
  };

  const languageLabel =
    LANGUAGE_NAMES[i18n.language?.split("-")[0]] ??
    (i18n.language ?? "").toUpperCase();

  const appearanceLabel = capitalize(
    String((theme as any).mode ?? (theme as any).themeMode ?? "system"),
  );

  // --- Dynamic Data Arrays ---

  const summaryStats: SummaryStat[] = [
    {
      id: "firstVisit",
      label: "First Visit",
      value: patient.firstVisit,
      icon: "Calendar",
    },
    {
      id: "lastVisit",
      label: "Last Visit",
      value: patient.lastVisit,
      icon: "Calendar",
    },
    {
      id: "totalVisits",
      label: "Total Visits",
      value: patient.totalVisits,
      icon: "Users",
    },
    {
      id: "totalSpent",
      label: "Total Spent",
      value: patient.totalSpent,
      icon: "CreditCard",
    },
  ];

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

  const careItems: CareItem[] = [
    {
      id: "personalSummary",
      label: t("profile.personalSummary", { defaultValue: "Personal Summary" }),
      icon: "User",
      isExpandable: true,
    },
    {
      id: "treatments",
      label: t("profile.treatmentHistory", {
        defaultValue: "Treatment History",
      }),
      icon: "Stethoscope",
      isExpandable: true,
    },
    {
      id: "medicalInfo",
      label: t("profile.medicalInformation", {
        defaultValue: "Medical Information",
      }),
      icon: "HeartPulse",
      isExpandable: true,
    },
    {
      id: "documents",
      label: t("profile.documents", { defaultValue: "Documents" }),
      icon: "FileText",
      isExpandable: false,
      onPress: () => navigation.navigate("ProfileStack"),
    },
  ];

  const toggleCare = (id: CareItemId) => {
    setExpandedCareId((current) => (current === id ? null : id));
  };

  const togglePreference = (id: PreferenceId) => {
    setExpandedPreference((current) => (current === id ? null : id));
  };

  return (
    <Screen>
      <View style={styles.root}>
        {/* Identity Hero */}
        <View style={styles.hero}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <AppText variant="h1" color={theme.colors.primaryDark}>
                {getInitials(patient.fullName)}
              </AppText>
            </View>
            <Pressable
              onPress={() => setIsEditModalVisible(true)}
              style={({ pressed }) => [
                styles.editBadge,
                pressed && styles.pressed,
              ]}
            >
              <AppIcon
                name="Pencil"
                size={12}
                color={theme.colors.primaryDark}
              />
            </Pressable>
          </View>

          <View style={styles.heroText}>
            <AppText variant="h2" align="center">
              {patient.fullName}
            </AppText>

            <View style={styles.idBadge}>
              <AppText
                variant="caption"
                color={theme.colors.textMuted}
                align="center"
              >
                {t("profile.patientId", { defaultValue: "Patient ID" })} •{" "}
                <AppText variant="caption" color={theme.colors.primaryDark}>
                  {patient.patientCode}
                </AppText>
              </AppText>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <SectionLabel
            title={t("profile.personalInformation", {
              defaultValue: "Personal Information",
            })}
          />
          <View style={styles.card}>
            <InfoRow
              label={t("profile.dateOfBirth", {
                defaultValue: "Date of Birth",
              })}
              value={patient.dob}
            />
            <View style={styles.innerDivider} />
            <InfoRow
              label={t("profile.gender", { defaultValue: "Gender" })}
              value={patient.gender}
            />
            <View style={styles.innerDivider} />
            <InfoRow
              label={t("profile.nationality", { defaultValue: "Nationality" })}
              value={patient.nationality}
            />
          </View>
        </View>

        {/* My Care Section */}
        <View style={styles.section}>
          <SectionLabel
            title={t("profile.myCare", { defaultValue: "My Care" })}
          />
          <View style={styles.card}>
            {careItems.map((item, index) => {
              const isExpanded = expandedCareId === item.id;

              return (
                <React.Fragment key={item.id}>
                  {index > 0 && <View style={styles.innerDivider} />}

                  <Pressable
                    onPress={() => {
                      if (item.isExpandable) {
                        toggleCare(item.id);
                      } else {
                        item.onPress?.();
                      }
                    }}
                    style={({ pressed }) => [
                      styles.row,
                      pressed && styles.pressedRow,
                    ]}
                  >
                    <View style={styles.navLeft}>
                      <View style={styles.iconBubble}>
                        <AppIcon
                          name={item.icon}
                          size={18}
                          color={theme.colors.primaryDark}
                        />
                      </View>
                      <AppText variant="bodyMedium">{item.label}</AppText>
                    </View>
                    <Chevron expanded={isExpanded} />
                  </Pressable>

                  {/* Expanded Content Area */}
                  {isExpanded && (
                    <View style={styles.careExpandedContainer}>
                      {item.id === "personalSummary" && (
                        <View style={styles.statsGrid}>
                          {summaryStats.map((stat) => (
                            <View key={stat.id} style={styles.statCard}>
                              <View style={styles.statHeader}>
                                <AppIcon
                                  name={stat.icon}
                                  size={14}
                                  color={theme.colors.primaryDark}
                                />
                                <AppText
                                  variant="caption"
                                  color={theme.colors.textMuted}
                                >
                                  {stat.label}
                                </AppText>
                              </View>
                              <AppText
                                variant="bodyMedium"
                                style={styles.statValue}
                              >
                                {stat.value}
                              </AppText>
                            </View>
                          ))}
                        </View>
                      )}

                      {item.id === "treatments" && (
                        <View style={styles.treatmentsList}>
                          {recentAppointments.map((appt) => (
                            <View key={appt.id} style={styles.appointmentRow}>
                              <View style={styles.dateBadge}>
                                <AppText
                                  variant="bodyMedium"
                                  style={styles.dateDay}
                                >
                                  {appt.day}
                                </AppText>
                                <AppText
                                  variant="caption"
                                  color={theme.colors.textMuted}
                                >
                                  {appt.month}
                                </AppText>
                              </View>
                              <View style={styles.apptInfo}>
                                <AppText variant="bodyMedium">
                                  {appt.title}
                                </AppText>
                                <AppText
                                  variant="caption"
                                  color={theme.colors.textMuted}
                                >
                                  {appt.doctorName}
                                </AppText>
                              </View>
                              <View style={styles.statusBadge}>
                                <AppText
                                  variant="caption"
                                  color={theme.colors.primaryDark}
                                >
                                  {appt.status}
                                </AppText>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Medical Info Tab formatted exactly like personalSummary (statsGrid & statCard) */}
                      {item.id === "medicalInfo" && (
                        <View style={styles.statsGrid}>
                          {contactRight.map((detail) => (
                            <View key={detail.id} style={styles.statCard}>
                              <View style={styles.statHeader}>
                                <AppIcon
                                  name={detail.icon}
                                  size={14}
                                  color={theme.colors.primaryDark}
                                />
                                <AppText
                                  variant="caption"
                                  color={theme.colors.textMuted}
                                >
                                  {detail.label}
                                </AppText>
                              </View>
                              <AppText
                                variant="bodyMedium"
                                style={styles.statValue}
                              >
                                {detail.value}
                              </AppText>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <SectionLabel
            title={t("profile.preferences", { defaultValue: "Preferences" })}
          />
          <View style={styles.card}>
            <View style={styles.row}>
              
              <AppText variant="bodyMedium">{t("common.language")}</AppText>
              <View>
                <LanguageSelector  />
              </View>
            </View>

            <View style={styles.innerDivider} />

            <PreferenceRow
              label={t("common.appearance")}
              value={appearanceLabel}
              isExpanded={expandedPreference === "appearance"}
              onPress={() => togglePreference("appearance")}
            >
              <ThemeModeSelector />
            </PreferenceRow>
          </View>
        </View>

        {/* Sign Out Button */}
        <Pressable
          onPress={() => {
            logout();
            navigation.navigate("Auth");
          }}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.signOutCard,
            (pressed || isLoading) && styles.pressed,
          ]}
        >
          <AppIcon name="LogOut" size={18} color={theme.colors.errorText} />
          <AppText variant="bodyMedium" color={theme.colors.errorText}>
            {isLoading
              ? t("profile.signingOut", { defaultValue: "Signing out..." })
              : t("profile.signOut", { defaultValue: "Sign Out" })}
          </AppText>
        </Pressable>
      </View>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={isEditModalVisible}
        initialData={{
          fullName: patient.fullName,
          dob: patient.dob,
          gender: patient.gender,
          nationality: patient.nationality,
        }}
        patientCode={patient.patientCode}
        onClose={() => setIsEditModalVisible(false)}
        onSave={handleSaveProfile}
      />
    </Screen>
  );
}

// --- Styles --------------------------------------------------------------

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      // paddingHorizontal: theme.spacing.lg,
      // paddingBottom: theme.spacing["2xl"],
    },

    // Hero Header
    hero: {
      alignItems: "center",
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.xl,
    },

    avatarContainer: {
      position: "relative",
    },

    avatar: {
      width: 88,
      height: 88,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: theme.colors.border,
    },

    editBadge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: theme.colors.card,
      padding: theme.spacing.xs,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },

    heroText: {
      alignItems: "center",
      gap: theme.spacing.xs,
    },

    idBadge: {
      backgroundColor: theme.colors.cardMuted,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      marginTop: theme.spacing.xs,
    },

    // Card Sections
    section: {
      marginBottom: theme.spacing.xl,
    },

    sectionLabel: {
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: theme.spacing.xs,
      marginLeft: theme.spacing.xs,
    },

    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg ?? 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
    },

    innerDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
      marginLeft: theme.spacing.lg,
    },

    // Rows
    row: {
      minHeight: 52,
      paddingHorizontal: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },

    rowValue: {
      flexShrink: 1,
      textAlign: "right",
    },

    navLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    iconBubble: {
      width: 32,
      height: 32,
      borderRadius: theme.radius.md ?? 8,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
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

    // Care Accordion Content
    careExpandedContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
      backgroundColor: theme.colors.cardMuted,
      paddingTop: theme.spacing.sm,
    },

    // Grid System (Shared by Personal Summary & Medical Info)
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },

    statCard: {
      flex: 1,
      minWidth: "45%",
      backgroundColor: theme.colors.card,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md ?? 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    statHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },

    statValue: {
      fontWeight: "600",
    },

    // Treatments List
    treatmentsList: {
      gap: theme.spacing.sm,
    },

    appointmentRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md ?? 10,
      gap: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    dateBadge: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      backgroundColor: theme.colors.cardMuted,
      borderRadius: theme.radius.sm ?? 6,
      minWidth: 44,
    },

    dateDay: {
      fontWeight: "700",
    },

    apptInfo: {
      flex: 1,
    },

    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
    },

    // Sign Out Button
    signOutCard: {
      minHeight: 52,
      borderRadius: theme.radius.lg ?? 16,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },

    pressed: {
      opacity: 0.8,
    },

    pressedRow: {
      backgroundColor: theme.colors.cardMuted,
    },
  });
}
