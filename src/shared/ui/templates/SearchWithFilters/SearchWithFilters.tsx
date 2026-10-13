import React, { useCallback, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  TextInput,
} from "react-native";

import { FilterConfig, FilterValues, SearchWithFiltersProps } from "./types";
import { FilterModal } from "./FilterModal";
import { AppIcon } from "../../atoms/AppIcon";

function countActiveFilters(
  filters: FilterConfig[],
  applied: FilterValues,
): number {
  return filters.reduce((count, f) => {
    const val = applied[f.key];
    if (val === undefined || val === null) return count;
    if (Array.isArray(val) && val.length === 0) return count;
    if (typeof val === "string" && val.trim() === "") return count;
    if (
      typeof val === "object" &&
      !Array.isArray(val) &&
      val.min === undefined &&
      val.max === undefined
    )
      return count;
    // Exclude if matches default
    const defaultVal =
      "defaultValue" in f
        ? (f as { defaultValue?: unknown }).defaultValue
        : undefined;
    if (JSON.stringify(val) === JSON.stringify(defaultVal)) return count;
    return count + 1;
  }, 0);
}

export const SearchWithFilters: React.FC<SearchWithFiltersProps> = ({
  placeholder = "Search…",
  initialQuery = "",
  filters = [],
  initialFilters = {},
  onSearch,
  onQueryChange,
  onFiltersApply,
  onFiltersReset,
}) => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterValues>(initialFilters);
  const [modalVisible, setModalVisible] = useState(false);

  const activeCount = countActiveFilters(filters, appliedFilters);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleQueryChange = useCallback(
    (text: string) => {
      setQuery(text);
      onQueryChange?.(text);
    },
    [onQueryChange],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onQueryChange?.("");
  }, [onQueryChange]);

  const handleSearch = useCallback(() => {
    onSearch?.(query, appliedFilters);
  }, [query, appliedFilters, onSearch]);

  const handleFiltersApply = useCallback(
    (next: FilterValues) => {
      setAppliedFilters(next);
      setModalVisible(false);
      onFiltersApply?.(next);
      onSearch?.(query, next);
    },
    [query, onFiltersApply, onSearch],
  );

  const handleFiltersReset = useCallback(() => {
    setAppliedFilters({});
    setModalVisible(false);
    onFiltersReset?.();
    onSearch?.(query, {});
  }, [query, onFiltersReset, onSearch]);

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Search Row */}
      <View style={styles.row}>
        {/* Search field */}
        <View style={styles.inputWrapper}>
          <AppIcon name="Search" size={18} color="#8E8E93" />
          <TextInput
            value={query}
            onChangeText={handleQueryChange}
            onSubmitEditing={handleSearch}
            placeholder={placeholder}
            placeholderTextColor="#8E8E93"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.input}
            accessibilityLabel="Search input"
          />
          {/* Clear button — shown only when query is non-empty */}
          {query.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.clearButton}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <AppIcon name="Cross" size={18} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter button */}
        {filters.length > 0 && (
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeCount > 0 && styles.filterButtonActive,
            ]}
            onPress={() => setModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel={`Filters, ${activeCount} active`}
          >
            <AppIcon
              name="Filter"
              size={20}
              color={activeCount > 0 ? "#fff" : "#007AFF"}
            />
            {activeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Active filter chips (summary row) */}
      {activeCount > 0 && (
        <View style={styles.activeRow}>
          <Text style={styles.activeLabel}>
            {activeCount} filter{activeCount > 1 ? "s" : ""} applied
          </Text>
          <TouchableOpacity
            onPress={handleFiltersReset}
            accessibilityRole="button"
            accessibilityLabel="Clear all filters"
          >
            <Text style={styles.clearFiltersText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={modalVisible}
        filters={filters}
        appliedFilters={appliedFilters}
        onApply={handleFiltersApply}
        onReset={handleFiltersReset}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 44,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    height: "100%",
    paddingVertical: 0,
    backgroundColor: "transparent",
    // expo/ui TextInput inherits container bg; clear it
  },
  clearButton: {
    marginLeft: 4,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E8F0FE",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  activeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  activeLabel: {
    fontSize: 13,
    color: "#8E8E93",
  },
  clearFiltersText: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "500",
  },
});
