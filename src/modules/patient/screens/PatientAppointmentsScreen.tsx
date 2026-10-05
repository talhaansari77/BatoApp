import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { AppIcon } from "../../../shared/ui/atoms/AppIcon";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { Screen } from "../../../shared/ui/templates/Screen";
import { usePatientAppointmentStore } from "../store/patientAppointment.store";
import AppointmentCard from "../components/AppointmentCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PatientStackParamList, PatientTabParamList } from "@/core/navigation/navigation.types";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

const filters = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
];

type AppointmentApiResponse = {
  id: number;
  file_number: string;
  appointment_number: string;
  full_name: string;
  patient_id: number;
  service_name: string;
  full_amount: string | number;
  date: string;
  appointment_start_time: string;
  appointment_end_time: string;
  room_id: number | null;
  doctor_id: number | null;
  sessions_count: number;
  urgency_level: string;
  current_status: string;
};

export type PatientAppointmentsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<PatientTabParamList, 'PatientAppointments'>,
  NativeStackScreenProps<PatientStackParamList>
>;

export function PatientAppointmentsScreen({ navigation }: PatientAppointmentsScreenProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const getPatientAppointments = usePatientAppointmentStore(
    (state) => state.getPatientAppointments,
  );
  const appointments = usePatientAppointmentStore(
    (state) => state.appointments,
  );

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    getPatientAppointments();
  }, []);

  // Filter Logic
  const filteredAppointments = useMemo(() => {
    if (!Array.isArray(appointments)) return [];

    const query = searchQuery.trim().toLowerCase();

    return appointments.filter((item: AppointmentApiResponse) => {
      // 1. Search Query Match
      const matchesSearch =
        !query ||
        item.full_name?.toLowerCase().includes(query) ||
        item.appointment_number?.toLowerCase().includes(query) ||
        item.patient_id?.toString().includes(query);

      // 2. Filter Category Match
      const status = item.current_status?.toLowerCase();
      let matchesFilter = true;

      if (selectedFilter === "today") {
        const todayStr = new Date().toISOString().split("T")[0];
        matchesFilter = item.date === todayStr;
      } else if (selectedFilter === "upcoming") {
        matchesFilter = status === "upcoming" || status === "scheduled" || status === "confirmed";
      } else if (selectedFilter === "completed") {
        matchesFilter = status === "completed" || status === "done";
      }

      return matchesSearch && matchesFilter;
    });
  }, [appointments, searchQuery, selectedFilter]);

  return (
    <Screen
      title="Appointments"
      actions={[
        {
          icon: "Bell",
          onPress: () => {},
        },
      ]}
    >
      <View style={styles.root}>
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <AppIcon
                name="CalendarDays"
                size={34}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.heroText}>
              <AppText variant="h2">Appointments</AppText>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <AppText variant="h3" color={theme.colors.primaryDark}>
                1
              </AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Upcoming
              </AppText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <AppText variant="h3" color={theme.colors.warningText}>
                1
              </AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Pending
              </AppText>
            </View>
          </View>
        </View>

        {/* Search Bar UI */}
        <View style={styles.searchBar}>
          <AppIcon name="Search" size={20} color={theme.colors.textMuted} />

          <TextInput
            placeholder="Search by name, ID or appointment no."
            placeholderTextColor={theme.colors.textMuted}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filters UI */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filters.map((filter) => {
            const isSelected = selectedFilter === filter.value;

            return (
              <Pressable
                key={filter.value}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(filter.value)}
              >
                <AppText
                  variant="caption"
                  color={
                    isSelected ? theme.colors.card : theme.colors.textMuted
                  }
                  style={isSelected ? styles.selectedFilterText : undefined}
                >
                  {filter.label}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Filtered Appointments List */}
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((item: AppointmentApiResponse) => (
            <AppointmentCard
              key={item.id}
              fileNumber={item.file_number}
              appointmentNo={item.appointment_number}
              patientName={item.full_name}
              patientId={item.patient_id.toString()}
              service={item.service_name}
              priceKd={Number(item.full_amount)}
              timeRange={`${item.appointment_start_time} – ${item.appointment_end_time}`}
              room={`Room ${item.room_id ?? "N/A"}`}
              doctor={`Dr. #${item.doctor_id ?? "N/A"}`}
              sessions={item.sessions_count}
              priority={item.urgency_level}
              statusLabel={item.current_status}
              statusTextColor={theme.colors.successText}
              isActive={false}
              onPress={() => {
                navigation.navigate("AppointmentDetails", {
                  appointmentId: item.id,
                });
              }}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <AppText variant="bodyMedium" color={theme.colors.textMuted}>
              No appointments found.
            </AppText>
          </View>
        )}
      </View>
    </Screen>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing.lg,
    },

    heroCard: {
      borderRadius: theme.radius["2xl"],
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.xl,
      gap: theme.spacing.lg,
      ...(theme.shadows.card ?? {}),
    },

    heroTop: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },

    heroIcon: {
      width: 70,
      height: 70,
      borderRadius: theme.radius["2xl"],
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
    },

    heroText: {
      flex: 1,
      gap: theme.spacing.sm,
    },

    statsRow: {
      minHeight: 82,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.md,
    },

    statBox: {
      flex: 1,
      alignItems: "center",
      gap: theme.spacing.xs,
    },

    statDivider: {
      width: 1,
      height: "70%",
      backgroundColor: theme.colors.border,
    },

    searchBar: {
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    searchInput: {
      flex: 1,
      minHeight: 48,
      fontSize: 15,
      color: theme.colors.primaryDark,
    },

    filterRow: {
      gap: theme.spacing.sm,
      paddingRight: theme.spacing.lg,
    },

    filterChip: {
      minHeight: 40,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      alignItems: "center",
      justifyContent: "center",
    },

    filterChipActive: {
      borderColor: theme.colors.primaryDark,
      backgroundColor: theme.colors.primaryDark,
    },

    selectedFilterText: {
      fontWeight: "700",
    },

    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
    },

    emptyContainer: {
      paddingVertical: theme.spacing.xl,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}