import React, { useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { BottomSheet, RNHostView } from "@expo/ui";
import DateTimePicker from "@expo/ui/community/datetime-picker";

import { useAppTheme } from "../../../app/providers/ThemeProvider";
import { AppButton } from "../../../shared/ui/atoms/AppButton";
import { AppIcon } from "../../../shared/ui/atoms/AppIcon";
import { AppInput } from "../../../shared/ui/atoms/AppInput";
import { AppText } from "../../../shared/ui/atoms/AppText";

export type EditProfileData = {
  fullName: string;
  dob: string;
  gender: string;
  nationality: string;
};

export type EditProfileModalProps = {
  visible: boolean;
  initialData: EditProfileData;
  patientCode: string;
  onClose: () => void;
  onSave: (data: EditProfileData) => void;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date(2000, 0, 1);
  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      const y = Number(parts[0]);
      const m = Number(parts[1]) - 1;
      const d = Number(parts[2]);
      return new Date(y, m, d);
    } else {
      // DD/MM/YYYY
      const d = Number(parts[0]);
      const m = Number(parts[1]) - 1;
      const y = Number(parts[2]);
      return new Date(y, m, d);
    }
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date(2000, 0, 1) : parsed;
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function EditProfileModal({
  visible,
  initialData,
  patientCode,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const maxDob = useMemo(() => new Date(), []);

  const [fullName, setFullName] = useState(initialData.fullName || "");
  const [dobDate, setDobDate] = useState<Date>(() =>
    parseDate(initialData.dob),
  );
  const [gender, setGender] = useState(initialData.gender || "Male");
  const [nationality, setNationality] = useState(
    initialData.nationality || "",
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (visible) {
      setFullName(initialData.fullName || "");
      setDobDate(parseDate(initialData.dob));
      setGender(initialData.gender || "Male");
      setNationality(initialData.nationality || "");
      setNameError("");
      setShowDatePicker(false);
    }
  }, [visible, initialData]);

  const handleSave = () => {
    if (!fullName.trim()) {
      setNameError("Full name cannot be empty");
      return;
    }

    onSave({
      fullName: fullName.trim(),
      dob: formatDate(dobDate),
      gender,
      nationality: nationality.trim(),
    });
  };

  return (
    <BottomSheet
      isPresented={visible}
      onDismiss={onClose}
      snapPoints={Platform.OS === "android" ? ["full"] : [{ fraction: 0.85 }]}
      showDragIndicator
      containerColor={theme.colors.card}
    >
      <RNHostView>
        <View style={styles.sheetRoot}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderRow}>
              <AppText variant="h3">Edit Profile</AppText>
              <Pressable
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.modalCloseBtn}
              >
                <AppIcon name="X" size={20} color={theme.colors.textMuted} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalFormContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Avatar Preview */}
            <View style={styles.modalAvatarSection}>
              <View style={styles.modalAvatar}>
                <AppText variant="h2" color={theme.colors.primaryDark}>
                  {getInitials(fullName || initialData.fullName)}
                </AppText>
              </View>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Patient ID: {patientCode}
              </AppText>
            </View>

            {/* Full Name Input */}
            <AppInput
              label="Full Name"
              placeholder="Enter full name"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (nameError) setNameError("");
              }}
              leftIcon="User"
              error={nameError}
            />

            {/* Date of Birth Picker with Expo UI */}
            <View style={styles.formField}>
              <AppText
                variant="caption"
                color={theme.colors.textMuted}
                style={styles.fieldLabel}
              >
                Date of Birth
              </AppText>

              <Pressable
                onPress={() => setShowDatePicker((prev) => !prev)}
                style={({ pressed }) => [
                  styles.datePickerTrigger,
                  pressed && styles.pressedTouch,
                ]}
              >
                <View style={styles.datePickerTriggerContent}>
                  <AppIcon
                    name="Calendar"
                    size={20}
                    color={theme.colors.textMuted}
                  />
                  <AppText variant="bodyMedium">
                    {formatDate(dobDate)}
                  </AppText>
                </View>
                <AppIcon
                  name={showDatePicker ? "ChevronUp" : "ChevronDown"}
                  size={18}
                  color={theme.colors.textMuted}
                />
              </Pressable>

              {showDatePicker ? (
                <View style={styles.datePickerContainer}>
                  <DateTimePicker
                    value={dobDate}
                    mode="date"
                    maximumDate={maxDob}
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    accentColor={theme.colors.primaryDark}
                    style={Platform.OS === "ios" ? styles.iosPicker : undefined}
                    onValueChange={(_event, date) => {
                      if (Platform.OS === "android") {
                        setShowDatePicker(false);
                      }
                      setDobDate(date);
                    }}
                    onDismiss={() => setShowDatePicker(false)}
                  />
                </View>
              ) : null}
            </View>

            {/* Gender Selector with reactive touch feedback */}
            <View style={styles.formField}>
              <AppText
                variant="caption"
                color={theme.colors.textMuted}
                style={styles.fieldLabel}
              >
                Gender
              </AppText>
              <View style={styles.genderRow}>
                {(["Male", "Female"] as const).map((g) => {
                  const isSelected =
                    gender.toLowerCase() === g.toLowerCase();
                  return (
                    <Pressable
                      key={g}
                      onPress={() => setGender(g)}
                      style={({ pressed }) => [
                        styles.genderChip,
                        isSelected && styles.genderChipActive,
                        pressed && styles.genderChipPressed,
                      ]}
                    >
                      <AppIcon
                        name={g === "Male" ? "User" : "UserRound"}
                        size={16}
                        color={
                          isSelected
                            ? theme.colors.card
                            : theme.colors.primaryDark
                        }
                      />
                      <AppText
                        variant="caption"
                        color={
                          isSelected
                            ? theme.colors.card
                            : theme.colors.primaryDark
                        }
                        style={
                          isSelected ? styles.selectedGenderText : undefined
                        }
                      >
                        {g}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Nationality Input */}
            <AppInput
              label="Nationality"
              placeholder="Enter nationality"
              value={nationality}
              onChangeText={setNationality}
              leftIcon="Flag"
            />

            {/* Actions */}
            <View style={styles.modalActionButtons}>
              <AppButton
                title="Cancel"
                variant="outline"
                fullWidth={false}
                style={styles.cancelBtn}
                onPress={onClose}
              />
              <AppButton
                title="Save Changes"
                variant="primary"
                fullWidth={false}
                style={styles.saveBtn}
                onPress={handleSave}
              />
            </View>
          </ScrollView>
        </View>
      </RNHostView>
    </BottomSheet>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    sheetRoot: {
      flex: 1,
    },

    modalHeader: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
      alignItems: "center",
    },

    modalHeaderRow: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    modalCloseBtn: {
      padding: theme.spacing.xs,
    },

    modalFormContent: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
      gap: theme.spacing.lg,
    },

    modalAvatarSection: {
      alignItems: "center",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },

    modalAvatar: {
      width: 76,
      height: 76,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: theme.colors.border,
    },

    formField: {
      gap: theme.spacing.xs,
    },

    fieldLabel: {
      marginLeft: theme.spacing.xs,
    },

    datePickerTrigger: {
      minHeight: 52,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    datePickerTriggerContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },

    datePickerContainer: {
      marginTop: theme.spacing.xs,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      padding: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    iosPicker: {
      width: "100%",
      height: 340,
    },

    genderRow: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },

    genderChip: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
      minHeight: 48,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },

    genderChipActive: {
      backgroundColor: theme.colors.primaryDark,
      borderColor: theme.colors.primaryDark,
    },

    genderChipPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.96 }],
    },

    pressedTouch: {
      opacity: 0.8,
      transform: [{ scale: 0.99 }],
    },

    selectedGenderText: {
      fontWeight: "700",
    },

    modalActionButtons: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },

    cancelBtn: {
      flex: 1,
    },

    saveBtn: {
      flex: 1.5,
    },
  });
}