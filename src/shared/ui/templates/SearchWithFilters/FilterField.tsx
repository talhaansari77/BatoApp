

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
} from "react-native";
import { Switch } from "@expo/ui"; // expo/ui components
import Checkbox from "expo-checkbox";

import {
  FilterConfig,
  FilterValues,
  TextFilterConfig,
  SingleSelectFilterConfig,
  MultiSelectFilterConfig,
  BooleanFilterConfig,
  DateFilterConfig,
  NumberRangeFilterConfig,
} from "./types";
import { AppIcon } from "../../atoms/AppIcon";
import DateTimePicker from "@expo/ui/community/datetime-picker";

type FilterFieldProps = {
  config: FilterConfig;
  value: FilterValues[string];
  onChange: (key: string, value: FilterValues[string]) => void;
};

// ─── Text ────────────────────────────────────────────────────────────────────

const TextField: React.FC<{
  config: TextFilterConfig;
  value: string | undefined;
  onChange: (v: string) => void;
}> = ({ config, value, onChange }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{config.label}</Text>
    {/* ✅ expo/ui TextInput */}
    <TextInput
      placeholder={config.placeholder ?? `Enter ${config.label.toLowerCase()}`}
      value={value ?? ""}
      onChangeText={onChange}
      style={styles.textInput}
      clearButtonMode="while-editing"
      autoCorrect={false}
    />
  </View>
);

// ─── Single Select ────────────────────────────────────────────────────────────

const SingleSelectField: React.FC<{
  config: SingleSelectFilterConfig;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
}> = ({ config, value, onChange }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{config.label}</Text>
    <View style={styles.optionList}>
      {config.options.map((opt) => {
        const selected = value === opt.value;
        return (
          // ⚠️ RN fallback — expo/ui has no Picker/Select component
          <TouchableOpacity
            key={opt.value}
            style={[styles.optionChip, selected && styles.optionChipSelected]}
            onPress={() => onChange(selected ? undefined : opt.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={opt.label}
          >
            <Text
              style={[styles.optionText, selected && styles.optionTextSelected]}
            >
              {opt.label}
            </Text>
            {selected && (
              <AppIcon name="CircleCheckBig" size={14} color="#fff" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

// ─── Multi Select ─────────────────────────────────────────────────────────────

const MultiSelectField: React.FC<{
  config: MultiSelectFilterConfig;
  value: string[] | undefined;
  onChange: (v: string[]) => void;
}> = ({ config, value, onChange }) => {
  const selected = value ?? [];

  const toggle = (optValue: string) => {
    const next = selected.includes(optValue)
      ? selected.filter((v) => v !== optValue)
      : [...selected, optValue];
    onChange(next);
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{config.label}</Text>
      {config.options.map((opt) => {
        const checked = selected.includes(opt.value);
        return (
          <TouchableOpacity
            key={opt.value}
            style={styles.checkboxRow}
            onPress={() => toggle(opt.value)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked }}
          >
            {/* ✅ expo-checkbox (separate but Expo-official package) */}
            <Checkbox
              value={checked}
              onValueChange={() => toggle(opt.value)}
              color={checked ? "#007AFF" : undefined}
            />
            <Text style={styles.checkboxLabel}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── Boolean ──────────────────────────────────────────────────────────────────

const BooleanField: React.FC<{
  config: BooleanFilterConfig;
  value: boolean | undefined;
  onChange: (v: boolean) => void;
}> = ({ config, value, onChange }) => (
  <View style={[styles.fieldContainer, styles.row]}>
    <Text style={[styles.label, { flex: 1, marginBottom: 0 }]}>
      {config.label}
    </Text>
    {/* ✅ expo/ui Switch */}
    <TouchableOpacity
      style={[styles.fieldContainer, styles.row]}
      onPress={() => onChange(!(value ?? false))}
      accessibilityRole="switch"
      accessibilityLabel={config.label}
      accessibilityState={{ checked: value ?? false }}
      activeOpacity={0.8}
    >
      <Text style={[styles.label, { flex: 1, marginBottom: 0 }]}>
        {config.label}
      </Text>
      {/* ✅ @expo/ui Switch — only value + onValueChange are valid props */}
      <Switch value={value ?? false} onValueChange={onChange} />
    </TouchableOpacity>
  </View>
);

// ─── Date ─────────────────────────────────────────────────────────────────────

const DateField: React.FC<{
  config: DateFilterConfig;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
}> = ({ config, value, onChange }) => {
  const [show, setShow] = React.useState(false);
  const date = value ? new Date(value) : new Date();

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{config.label}</Text>
      {/* ⚠️ RN fallback — expo/ui has no DatePicker */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShow(true)}
        accessibilityRole="button"
        accessibilityLabel={`Select ${config.label}`}
      >
        <AppIcon name="CalendarDays" size={16} color="#007AFF" />
        <Text style={styles.dateButtonText}>
          {value ? new Date(value).toLocaleDateString() : "Select date"}
        </Text>
        {value && (
          <TouchableOpacity
            onPress={() => onChange(undefined)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppIcon name="CircleX" size={16} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onValueChange={(_, selected) => {
            setShow(Platform.OS === "ios");
            if (selected) onChange(selected.toISOString().split("T")[0]);
          }}
        />
      )}
    </View>
  );
};

// ─── Number Range ─────────────────────────────────────────────────────────────

const NumberRangeField: React.FC<{
  config: NumberRangeFilterConfig;
  value: { min?: number; max?: number } | undefined;
  onChange: (v: { min?: number; max?: number }) => void;
}> = ({ config, value, onChange }) => {
  const current = value ?? {};

  const update = (key: "min" | "max", text: string) => {
    const num = text === "" ? undefined : parseFloat(text);
    onChange({ ...current, [key]: isNaN(num as number) ? undefined : num });
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{config.label}</Text>
      {/* ⚠️ RN TextInput fallback — expo/ui TextInput lacks numeric keyboard + range concept */}
      <View style={styles.rangeRow}>
        <TextInput
          style={[styles.textInput, styles.rangeInput]}
          placeholder={config.min !== undefined ? `Min (${config.min})` : "Min"}
          value={current.min !== undefined ? String(current.min) : ""}
          onChangeText={(t) => update("min", t)}
          keyboardType="numeric"
          accessibilityLabel={`${config.label} minimum`}
        />
        <Text style={styles.rangeSeparator}>–</Text>
        <TextInput
          style={[styles.textInput, styles.rangeInput]}
          placeholder={config.max !== undefined ? `Max (${config.max})` : "Max"}
          value={current.max !== undefined ? String(current.max) : ""}
          onChangeText={(t) => update("max", t)}
          keyboardType="numeric"
          accessibilityLabel={`${config.label} maximum`}
        />
      </View>
    </View>
  );
};

// ─── Dispatcher ───────────────────────────────────────────────────────────────

export const FilterField: React.FC<FilterFieldProps> = ({
  config,
  value,
  onChange,
}) => {
  switch (config.type) {
    case "text":
      return (
        <TextField
          config={config}
          value={value as string | undefined}
          onChange={(v) => onChange(config.key, v)}
        />
      );
    case "singleSelect":
      return (
        <SingleSelectField
          config={config}
          value={value as string | undefined}
          onChange={(v) => onChange(config.key, v)}
        />
      );
    case "multiSelect":
      return (
        <MultiSelectField
          config={config}
          value={value as string[] | undefined}
          onChange={(v) => onChange(config.key, v)}
        />
      );
    case "boolean":
      return (
        <BooleanField
          config={config}
          value={value as boolean | undefined}
          onChange={(v) => onChange(config.key, v)}
        />
      );
    case "date":
      return (
        <DateField
          config={config}
          value={value as string | undefined}
          onChange={(v) => onChange(config.key, v)}
        />
      );
    case "numberRange":
      return (
        <NumberRangeField
          config={config}
          value={value as { min?: number; max?: number } | undefined}
          onChange={(v) => onChange(config.key, v)}
        />
      );
    default:
      return null;
  }
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3C3C43",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
  },
  optionList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  optionChipSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  optionText: {
    fontSize: 14,
    color: "#3C3C43",
  },
  optionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#007AFF",
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rangeInput: {
    flex: 1,
  },
  rangeSeparator: {
    fontSize: 18,
    color: "#8E8E93",
  },
});
