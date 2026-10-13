import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FilterModal, DateFilter, getDateRange } from "./molecules/FilterModal";

// ── Mock data (dates are relative to today so every filter shows results) ──
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

type Report = {
  id: string;
  title: string;
  type: "Report" | "Appointment";
  date: string;
};

const MOCK_DATA: Report[] = [
  { id: "1", title: "Blood test results", type: "Report", date: daysAgo(1) },
  {
    id: "2",
    title: "Dentist appointment",
    type: "Appointment",
    date: daysAgo(3),
  },
  { id: "3", title: "X-ray report", type: "Report", date: daysAgo(6) },
  { id: "4", title: "Eye checkup", type: "Appointment", date: daysAgo(12) },
  { id: "5", title: "MRI scan report", type: "Report", date: daysAgo(25) },
  {
    id: "6",
    title: "Physiotherapy session",
    type: "Appointment",
    date: daysAgo(40),
  },
  { id: "7", title: "Cardiology report", type: "Report", date: daysAgo(70) },
  {
    id: "8",
    title: "Annual health checkup",
    type: "Appointment",
    date: daysAgo(110),
  },
  { id: "9", title: "Allergy test report", type: "Report", date: daysAgo(200) },
];

export const DEFAULT_FILTER: DateFilter = { period: "all" };

// Label shown on the filter button
const filterLabel = (f: DateFilter) => {
  if (f.from || f.to) {
    const fmt = (iso?: string) =>
      iso ? new Date(iso).toLocaleDateString() : "…";
    return `${fmt(f.from)} – ${fmt(f.to)}`;
  }
  const map = {
    week: "Last week",
    month: "Last month",
    quarter: "Last quarter",
    all: "All",
  };
  return map[f.period ?? "all"];
};

export default function ReportsScreen() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [applied, setApplied] = useState<DateFilter>(DEFAULT_FILTER); // Apply the date filter to the list

  const data = useMemo(() => {
    const range = getDateRange(applied); // null = "all"
    if (!range) return MOCK_DATA;
    return MOCK_DATA.filter((item) => {
      const d = new Date(item.date);
      return d >= range.from && d <= range.to;
    });
  }, [applied]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Reports & Appointments</Text>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterOpen(true)}
        >
          <Text style={styles.filterButtonText}>
            Filter · {filterLabel(applied)}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 10 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Nothing in this date range.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>

              <Text style={styles.cardDate}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.badge}>{item.type}</Text>
          </View>
        )}
      />

      <FilterModal
        visible={filterOpen}
        appliedFilters={applied}
        onApply={(f: DateFilter) => {
          setApplied(f);
          setFilterOpen(false);
        }}
        onReset={() => setApplied(DEFAULT_FILTER)}
        onClose={() => setFilterOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  topBar: { paddingHorizontal: 20, paddingTop: 12, gap: 12 },
  title: { fontSize: 22, fontWeight: "600", color: "#111111" },
  filterButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterButtonText: { fontSize: 14, color: "#111111" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  cardTitle: { fontSize: 15, fontWeight: "500", color: "#111111" },
  cardDate: { fontSize: 13, color: "#6B6B6B", marginTop: 2 },
  badge: {
    fontSize: 12,
    color: "#6B6B6B",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: "hidden",
  },
  empty: { textAlign: "center", color: "#6B6B6B", marginTop: 40 },
});
