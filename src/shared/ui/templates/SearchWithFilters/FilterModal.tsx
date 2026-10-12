

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Button,
} from "react-native";

import { FilterConfig, FilterValues } from "./types";
import { AppIcon } from "../../atoms/AppIcon";
import { FilterField } from "./FilterField";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type FilterModalProps = {
  visible: boolean;
  filters: FilterConfig[];
  appliedFilters: FilterValues;
  onApply: (filters: FilterValues) => void;
  onReset: () => void;
  onClose: () => void;
};

function buildDefaults(filters: FilterConfig[]): FilterValues {
  const defaults: FilterValues = {};
  for (const f of filters) {
    if ("defaultValue" in f && f.defaultValue !== undefined) {
      defaults[f.key] = f.defaultValue as FilterValues[string];
    }
  }
  return defaults;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  filters,
  appliedFilters,
  onApply,
  onReset,
  onClose,
}) => {
  const [draft, setDraft] = useState<FilterValues>({ ...appliedFilters });
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      setDraft({ ...appliedFilters });
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, appliedFilters]);

  const handleChange = useCallback(
    (key: string, value: FilterValues[string]) => {
      setDraft((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleApply = () => {
    onApply(draft);
  };

  const handleReset = () => {
    const defaults = buildDefaults(filters);
    setDraft(defaults);
    onReset();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
          activeOpacity={1}
        />
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <SafeAreaView style={{ flex: 1 }}>

              {/* ② CHANGE — drag handle moved above header (standard convention) */}
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>

              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={handleClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityRole="button"
                  accessibilityLabel="Close filters"
                >
                  <AppIcon name="CircleX" size={24} color="#3C3C43" />
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

              {/* Filter fields */}
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {filters.map((filter) => (
                  <FilterField
                    key={filter.key}
                    config={filter}
                    value={draft[filter.key]}
                    onChange={handleChange}
                  />
                ))}
                <View style={{ height: 16 }} />
              </ScrollView>

              {/* Apply button */}
              <View style={styles.footer}>
                <View
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Apply filters"
                >
                  <Button onPress={handleApply} title="Apply Filters" />
                </View>
              </View>

            </SafeAreaView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: SCREEN_HEIGHT * 0.92,
    minHeight: SCREEN_HEIGHT * 0.82, // ① CHANGE: was 0.4 → now 0.82
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16,
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 10,  // ① CHANGE: was 4 → 10 (more breathing room at top)
    paddingBottom: 8,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#C7C7CC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000",
  },
  resetText: {
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5EA",
  },
});