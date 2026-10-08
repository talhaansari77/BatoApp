import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { AppIcon } from "../../../shared/ui/atoms/AppIcon";
import { AppText } from "../../../shared/ui/atoms/AppText";
import { Screen } from "../../../shared/ui/templates/Screen";
import { usePatientAppointmentStore } from "../store/patientAppointment.store";
import { useAuthStore } from "../../auth/store/auth.store";
import AppointmentCard from "../components/AppointmentCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  PatientStackParamList,
  PatientTabParamList,
} from "@/core/navigation/navigation.types";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { getAppointmentCounts, getFirstName, getStatusColors } from "@/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const filters = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "Pending", value: "pending" },
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
  doctor_name: string;
  sessions_count: number;
  urgency_level: string;
  current_status: string;
  payment_status?: string;
};



export function PatientAppointmentsScreen({
  navigation,
}: any) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const insets = useSafeAreaInsets();

  const user = useAuthStore((state) => state.user);
  const getPatientAppointments = usePatientAppointmentStore(
    (state) => state.getPatientAppointments,
  );
  const appointments = usePatientAppointmentStore(
    (state) => state.appointments,
  );
  const isLoading = usePatientAppointmentStore((state) => state.isLoading);
  const error = usePatientAppointmentStore((state) => state.error);

  const { upcomingCount, pendingCount } = getAppointmentCounts(appointments);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getPatientAppointments(user?.id);
  }, [getPatientAppointments, user?.id]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getPatientAppointments(user?.id);
    } finally {
      setRefreshing(false);
    }
  }, [getPatientAppointments, user?.id]);

  // Filter Logic (Search matches name, appointment number, or patient ID)
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
      const payment_status = item.payment_status?.toLowerCase();
      let matchesFilter = true;

      if (selectedFilter === "today") {
        const todayStr = new Date().toISOString().split("T")[0];
        matchesFilter = item.date === todayStr;
      } else if (selectedFilter === "upcoming") {
        matchesFilter =
          status === "upcoming" ||
          status === "scheduled" ||
          status === "confirmed";
      } else if (selectedFilter === "pending") {
        matchesFilter = payment_status === "pending" || status === "waiting";
      } else if (selectedFilter === "completed") {
        matchesFilter = status === "completed" || status === "done";
      }

      return matchesSearch && matchesFilter;
    });
  }, [appointments, searchQuery, selectedFilter]);

  const renderAppointment = useCallback(
    ({ item }: { item: AppointmentApiResponse }) => {
      const statusColors = getStatusColors(item.current_status, theme.colors);
      const firstName = getFirstName(item.doctor_name);

      return (
        <AppointmentCard
          fileNumber={item.file_number}
          appointmentNo={item.appointment_number}
          patientName={item.full_name}
          patientId={item.patient_id.toString()}
          service={item.service_name}
          priceKd={Number(item.full_amount)}
          timeRange={`${item.appointment_start_time} – ${item.appointment_end_time}`}
          room={`Room ${item.room_id ?? "N/A"}`}
          doctor={`Dr. #${firstName ?? "N/A"}`}
          sessions={item.sessions_count}
          priority={item.urgency_level}
          statusLabel={item.current_status}
          statusTextColor={statusColors.text}
          statusBgColor={statusColors.bg}
          isActive={false}
          onPress={() => {
            navigation.navigate("AppointmentDetails", {
              appointmentId: item.id,
            });
          }}
        />
      );
    },
    [navigation, theme.colors],
  );

  const keyExtractor = useCallback(
    (item: AppointmentApiResponse) => item.id.toString(),
    [],
  );

  const renderSeparator = useCallback(() => {
    return <View style={{ height: theme.spacing.lg }} />;
  }, [theme.spacing.lg]);

  const renderListHeader = useMemo(() => {
    return (
      <View style={styles.headerContainer}>
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
                {upcomingCount}
              </AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Upcoming
              </AppText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <AppText variant="h3" color={theme.colors.warningText}>
                {pendingCount}
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

          {searchQuery.trim().length > 0 ? (
            <Pressable
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={() => setSearchQuery("")}
              style={({ pressed }) => [
                styles.clearSearchBtn,
                pressed && styles.crossSearchBtn,
              ]}
            >
              <AppIcon name="X" size={16} color={theme.colors.textMuted} />
            </Pressable>
          ) : null}
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
                style={({ pressed }) => [
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                  pressed && styles.btnPressedIn,
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
      </View>
    );
  }, [
    styles,
    theme.colors,
    upcomingCount,
    pendingCount,
    searchQuery,
    selectedFilter,
  ]);

  const renderListEmpty = useCallback(() => {
    if (isLoading && !refreshing) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primaryDark} />
          <AppText
            variant="caption"
            color={theme.colors.textMuted}
            style={styles.emptySubtext}
          >
            Loading appointments...
          </AppText>
        </View>
      );
    }

    if (error && !refreshing) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.errorIconContainer}>
            <AppIcon
              name="AlertCircle"
              size={32}
              color={theme.colors.errorText}
            />
          </View>
          <AppText variant="bodyMedium" style={styles.emptyTitle}>
            Failed to load appointments
          </AppText>
          <AppText
            variant="caption"
            color={theme.colors.textMuted}
            style={styles.emptySubtext}
          >
            {error}
          </AppText>
          <Pressable
            style={styles.retryButton}
            onPress={() => getPatientAppointments(user?.id)}
          >
            <AppText
              variant="caption"
              color={theme.colors.card}
              style={styles.retryButtonText}
            >
              Try Again
            </AppText>
          </Pressable>
        </View>
      );
    }

    const isFiltered =
      searchQuery.trim().length > 0 || selectedFilter !== "all";

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <AppIcon name="CalendarX" size={36} color={theme.colors.textMuted} />
        </View>
        <AppText variant="bodyMedium" style={styles.emptyTitle}>
          No appointments found
        </AppText>
        <AppText
          variant="caption"
          color={theme.colors.textMuted}
          style={styles.emptySubtext}
        >
          {isFiltered
            ? "No appointments match your search or filter criteria."
            : "You don't have any appointments scheduled."}
        </AppText>
        {isFiltered ? (
          <Pressable
            style={({ pressed }) => [
              styles.clearFilterButton,
              pressed && styles.btnPressedIn,
            ]}
            onPress={() => {
              setSearchQuery("");
              setSelectedFilter("all");
            }}
          >
            <AppText
              variant="caption"
              color={theme.colors.primaryDark}
              style={styles.clearFilterButtonText}
            >
              Clear Filters
            </AppText>
          </Pressable>
        ) : null}
      </View>
    );
  }, [
    isLoading,
    refreshing,
    error,
    theme.colors,
    styles,
    searchQuery,
    selectedFilter,
    getPatientAppointments,
    user?.id,
  ]);

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: insets.top,
        backgroundColor: theme.colors.background,

        // paddingBottom: insets.bottom,
      }}
    >
      <FlatList
        data={filteredAppointments}
        keyExtractor={keyExtractor}
        renderItem={renderAppointment}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primaryDark}
            colors={[theme.colors.primaryDark]}
          />
        }
      />
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    listContent: {
      flexGrow: 1,
      paddingBottom: theme.spacing.xl,
    },

    headerContainer: {
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
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
      alignItems: "center",
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

    clearSearchBtn: {
      padding: theme.spacing.xs,
      alignItems: "center",
      justifyContent: "center",
    },
    crossSearchBtn: {
      backgroundColor:theme.colors.greyGlass,
      borderRadius:99,
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
      paddingVertical: theme.spacing["2xl"],
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
    },

    emptyIconContainer: {
      width: 64,
      height: 64,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.xs,
    },

    errorIconContainer: {
      width: 64,
      height: 64,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.error,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.xs,
    },

    emptyTitle: {
      fontWeight: "700",
    },

    emptySubtext: {
      textAlign: "center",
      paddingHorizontal: theme.spacing.xl,
    },

    retryButton: {
      marginTop: theme.spacing.md,
      backgroundColor: theme.colors.primaryDark,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.full,
    },

    retryButtonText: {
      fontWeight: "600",
    },

    clearFilterButton: {
      marginTop: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.card,
    },
    btnPressedIn: {
      opacity: 0.8,
      transform: [{ scale: 0.96 }],
    },

    clearFilterButtonText: {
      fontWeight: "600",
    },
  });
}
