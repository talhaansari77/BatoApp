import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@expo/ui/community/bottom-sheet";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import { AppIcon } from "@/shared/ui/atoms/AppIcon";


// ── Types ───────────────────────────────────────────────────────────
export type Period = "week" | "month" | "quarter" | "all";

export type DateFilter = {
  period?: Period; // quick range
  from?: string; // ISO date (custom range)
  to?: string; // ISO date (custom range)
};

const PERIODS: { label: string; value: Period }[] = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Quarter", value: "quarter" },
  { label: "All", value: "all" },
];

/**
 * Use in your screen to filter reports / appointments.
 * Custom from/to dates win over the period chip.
 * Returns null for "all" (= no date filtering).
 */
export function getDateRange(
  filters: DateFilter,
): { from: Date; to: Date } | null {
  if (filters.from || filters.to) {
    const start = filters.from ? new Date(filters.from) : new Date(0);
    const end = filters.to ? new Date(filters.to) : new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { from: start, to: end };
  }

  const period = filters.period ?? "all";
  if (period === "all") return null;

  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  if (period === "week") start.setDate(start.getDate() - 7);
  if (period === "month") start.setMonth(start.getMonth() - 1);
  if (period === "quarter") start.setMonth(start.getMonth() - 3);
  return { from: start, to: end };
}

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString() : "Select date";

// ── Component ───────────────────────────────────────────────────────
type FilterModalProps = {
  visible: boolean;
  appliedFilters: DateFilter;
  onApply: (filters: DateFilter) => void;
  onReset: () => void;
  onClose: () => void;
};

// Sheet heights: [normal, expanded (calendar open)]
const SNAP_POINTS = ["52%", "88%"];

export const FilterModal = ({
  visible,
  appliedFilters,
  onApply,
  onReset,
  onClose,
}:FilterModalProps) => {
  const sheetRef = useRef<BottomSheet>(null);
  const [draft, setDraft] = useState<DateFilter>({ period: "all", ...appliedFilters });
  const [pickerTarget, setPickerTarget] = useState<"from" | "to" | null>(null);

  // Copy applied filters into the draft each time the sheet opens
  useEffect(() => {
    if (visible) {
      setDraft({ period: "all", ...appliedFilters });
      setPickerTarget(null);
    }
  }, [visible, appliedFilters]);

  // Open / close, and expand / shrink when the calendar opens / closes
  useEffect(() => {
    if (!visible) {
      sheetRef.current?.close();
      return;
    }
    sheetRef.current?.snapToIndex(pickerTarget ? 1 : 0);
  }, [visible, pickerTarget]);

  const selectPeriod = (period: Period) => {
    setDraft({ period }); // clears custom dates
    setPickerTarget(null);
  };

  const handleDateSelect = (date: Date) => {
    if (!pickerTarget) return;
    setDraft((prev) => ({
      ...prev,
      [pickerTarget]: date.toISOString(),
      period: undefined, // custom dates replace the chip
    }));
    setPickerTarget(null); // sheet shrinks back
  };

  const toggleCalendar = (target: "from" | "to") =>
    setPickerTarget((cur) => (cur === target ? null : target));

  const handleApply = () => {
    let result = { ...draft };
    // swap if "from" is after "to"
    if (result.from && result.to && new Date(result.from) > new Date(result.to)) {
      result = { ...result, from: result.to, to: result.from };
    }
    if (!result.from && !result.to && !result.period) result.period = "all";
    onApply(result);
  };

  const handleReset = () => {
    setDraft({ period: "all" });
    setPickerTarget(null);
    onReset();
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={SNAP_POINTS}
      enablePanDownToClose
      onClose={() => {
        setPickerTarget(null);
        onClose();
      }}
      onChange={(index) => {
        // user dragged the sheet down while the calendar was open
        if (index === 0) setPickerTarget(null);
      }}
      backgroundStyle={{ backgroundColor: COLORS.bg }}
    >
      <BottomSheetView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => sheetRef.current?.close()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Close filters"
          >
            <AppIcon name="CircleX" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filters</Text>
          <TouchableOpacity
            onPress={handleReset}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Reset all filters"
          >
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Period chips */}
          <Text style={styles.sectionLabel}>Period</Text>
          <View style={styles.chipRow}>
            {PERIODS.map((p) => {
              const selected = draft.period === p.value;
              return (
                <TouchableOpacity
                  key={p.value}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => selectPeriod(p.value)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom dates */}
          <Text style={styles.sectionLabel}>Or choose dates</Text>
          <View style={styles.dateRow}>
            {(["from", "to"] as const).map((target) => (
              <TouchableOpacity
                key={target}
                style={[styles.dateBox, pickerTarget === target && styles.dateBoxActive]}
                onPress={() => toggleCalendar(target)}
              >
                <Text style={styles.dateLabel}>{target === "from" ? "From" : "To"}</Text>
                <Text style={styles.dateValue}>{formatDate(draft[target])}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Calendar (sheet expands when this shows, shrinks when it hides) */}
          {pickerTarget && (
            <View style={styles.calendar}>
              <DateTimePicker
                value={draft[pickerTarget] ? new Date(draft[pickerTarget]!) : new Date()}
                mode="date"
                display="inline"
                presentation="inline"
                accentColor={COLORS.text}
                minimumDate={
                  pickerTarget === "to" && draft.from ? new Date(draft.from) : undefined
                }
                maximumDate={
                  pickerTarget === "from" && draft.to ? new Date(draft.to) : undefined
                }
                onValueChange={(_event, date) => handleDateSelect(date)}
              />
            </View>
          )}
        </ScrollView>

        {/* Apply */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            accessibilityRole="button"
            accessibilityLabel="Search"
          >
            <Text style={styles.applyText}>Search</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

// ── Minimal palette ─────────────────────────────────────────────────
const COLORS = {
  bg: "#FFFFFF",
  text: "#111111",
  muted: "#6B6B6B",
  border: "#E5E5E5",
  surface: "#F5F5F5",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
  },
  resetText: {
    fontSize: 15,
    color: COLORS.muted,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.muted,
    marginTop: 8,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  chipSelected: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.text,
  },
  chipTextSelected: {
    color: COLORS.bg,
    fontWeight: "500",
  },
  dateRow: {
    flexDirection: "row",
    gap: 12,
  },
  dateBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: COLORS.bg,
  },
  dateBoxActive: {
    borderColor: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  dateLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 15,
    color: COLORS.text,
  },
  calendar: {
    marginTop: 12,
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  applyButton: {
    backgroundColor: COLORS.text,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  applyText: {
    color: COLORS.bg,
    fontSize: 16,
    fontWeight: "600",
  },
});